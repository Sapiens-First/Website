import "server-only";

import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";

// Also used as the explicit event allowlist when registering the endpoint.
export const membershipEvents = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "invoice.finalization_failed",
  "invoice.voided",
  "invoice.marked_uncollectible",
  "charge.refunded",
  "refund.updated",
  "refund.failed",
  "charge.dispute.created",
  "charge.dispute.updated",
  "charge.dispute.closed",
  "radar.early_fraud_warning.created",
  "radar.early_fraud_warning.updated",
]);

const id = (value: string | { id: string } | null | undefined) =>
  typeof value === "string" ? value : value?.id;
const date = (seconds: number | null | undefined) =>
  seconds ? new Date(seconds * 1000).toISOString() : null;

async function eventCustomer(stripe: Stripe, event: Stripe.Event) {
  const object = event.data.object;
  if (object.object === "subscription" || object.object === "checkout.session")
    return id(object.customer);
  if (object.object === "invoice") {
    const invoice = await stripe.invoices.retrieve(object.id);
    if (!invoice.parent?.subscription_details) return;
    return id(invoice.customer);
  }
  if (
    object.object !== "charge" &&
    object.object !== "refund" &&
    object.object !== "dispute" &&
    object.object !== "radar.early_fraud_warning"
  )
    return;

  // Modern Stripe APIs link charges to subscriptions through InvoicePayments.
  let intent = id(object.payment_intent);
  if (!intent && object.object !== "charge") {
    const charge = await stripe.charges.retrieve(id(object.charge)!);
    intent = id(charge.payment_intent);
  }
  if (!intent) return;
  const customers = new Set<string>();
  for await (const payment of stripe.invoicePayments.list({
    payment: { type: "payment_intent", payment_intent: intent },
    status: "paid",
    limit: 100,
  })) {
    const invoice = await stripe.invoices.retrieve(id(payment.invoice)!);
    const subscription = id(invoice.parent?.subscription_details?.subscription);
    if (!subscription) continue;
    const current = await stripe.subscriptions.retrieve(subscription);
    customers.add(id(current.customer)!);
  }
  if (customers.size > 1) throw new Error("Ambiguous subscription ownership");
  return customers.values().next().value;
}

async function invoiceHasRisk(stripe: Stripe, invoice: Stripe.Invoice) {
  for await (const payment of stripe.invoicePayments.list({
    invoice: invoice.id,
    status: "paid",
    limit: 100,
  })) {
    let chargeId = id(payment.payment.charge);
    if (payment.payment.payment_intent) {
      const intent = await stripe.paymentIntents.retrieve(
        id(payment.payment.payment_intent)!,
      );
      chargeId = id(intent.latest_charge);
    }
    if (!chargeId) continue;
    const charge = await stripe.charges.retrieve(chargeId);
    if (charge.refunded) return true;
    if (charge.disputed) {
      for await (const dispute of stripe.disputes.list({
        charge: chargeId,
        limit: 100,
      })) {
        if (!["won", "warning_closed"].includes(dispute.status)) return true;
      }
    }
    for await (const warning of stripe.radar.earlyFraudWarnings.list({
      charge: chargeId,
      limit: 100,
    })) {
      if (warning.actionable) return true;
    }
  }
  return false;
}

export async function synchronizeMembership(
  event: Stripe.Event,
  stripe: Stripe,
  database: SupabaseClient,
  prices: string[],
) {
  if (!membershipEvents.has(event.type)) return "ignored";
  const { data: receipt, error: receiptError } = await database
    .from("stripe_webhook_events")
    .select("event_id")
    .eq("event_id", event.id)
    .maybeSingle();
  if (receiptError) throw receiptError;
  if (receipt) return "duplicate";
  const customer = await eventCustomer(stripe, event);
  if (!customer) return "ignored";
  return reconcileMembership(customer, stripe, database, prices, event);
}

// Expiry recovery uses the same reconciliation, without inventing Stripe events.
export async function reconcileMembership(
  customer: string,
  stripe: Stripe,
  database: SupabaseClient,
  prices: string[],
  event?: Stripe.Event,
) {
  for (let attempt = 0; attempt < 3; attempt++) {
    // Read BEFORE Stripe. A concurrent commit invalidates this snapshot and
    // forces another Stripe read, rather than committing stale network results.
    const { data: member, error } = await database
      .from("memberships")
      .select("updated_at,stripe_subscription_id")
      .eq("stripe_customer_id", customer)
      .maybeSingle();
    if (error) throw error;
    if (!member) return "ignored";

    const subscriptions: Stripe.Subscription[] = [];
    for await (const subscription of stripe.subscriptions.list({
      customer,
      status: "all",
      limit: 100,
    })) {
      if (
        subscription.id === member.stripe_subscription_id ||
        subscription.items.data.some((item) => prices.includes(item.price.id))
      ) {
        subscriptions.push(subscription);
      }
    }
    // Stripe lists newest first. Never select the subscription from the event
    // payload: an old subscription's cancellation must not replace a rejoin.
    const subscription = subscriptions[0];
    if (!subscription) return "ignored";
    const item = subscription.items.data[0];
    const approved =
      subscription.items.data.length === 1 &&
      item.quantity === 1 &&
      prices.includes(item.price.id) &&
      item.price.currency === "usd" &&
      item.price.recurring?.interval === "month" &&
      item.price.recurring.interval_count === 1;
    const invoiceId = id(subscription.latest_invoice);
    const invoice = invoiceId
      ? await stripe.invoices.retrieve(invoiceId)
      : null;
    let paidUntil: number | null = null;
    if (
      approved &&
      subscription.status === "active" &&
      !subscription.pause_collection &&
      invoice?.status === "paid" &&
      id(invoice.parent?.subscription_details?.subscription) ===
        subscription.id &&
      !(await invoiceHasRisk(stripe, invoice))
    ) {
      for await (const line of stripe.invoices.listLineItems(invoice.id, {
        limit: 100,
      })) {
        if (
          line.parent?.subscription_item_details?.subscription ===
            subscription.id &&
          !line.parent.subscription_item_details.proration &&
          id(line.pricing?.price_details?.price) === item.price.id
        ) {
          paidUntil = Math.max(
            paidUntil ?? 0,
            Math.min(
              line.period.end,
              item.current_period_end,
              subscription.cancel_at ?? Infinity,
            ),
          );
        }
      }
    }
    const firstTrial = subscriptions.reduce<number | null>(
      (first, sub) =>
        sub.trial_start
          ? Math.min(first ?? sub.trial_start, sub.trial_start)
          : first,
      null,
    );
    const { data: result, error: commitError } = await database.rpc(
      "sync_membership_event",
      {
        p_event_id: event?.id ?? null,
        p_event_type: event?.type ?? null,
        p_event_created_at: date(event?.created),
        p_customer_id: customer,
        p_expected_updated_at: member.updated_at,
        p_state: {
          stripe_subscription_id: subscription.id,
          stripe_price_id: item.price.id,
          status: subscription.status,
          trial_started_at: date(firstTrial),
          trial_end:
            approved && !subscription.pause_collection && subscription.trial_end
              ? date(
                  Math.min(
                    subscription.trial_end,
                    subscription.cancel_at ?? Infinity,
                  ),
                )
              : null,
          current_period_end: date(item.current_period_end),
          paid_until: date(paidUntil),
          cancel_at_period_end: subscription.cancel_at_period_end,
          stripe_schedule_id: id(subscription.schedule) ?? null,
        },
      },
    );
    if (commitError) throw commitError;
    if (result !== "retry") return result;
  }
  throw new Error("Concurrent membership synchronization; retry event");
}
