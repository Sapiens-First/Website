import "server-only";

import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";

// Subscribe the Stripe endpoint only to these events. Payment outcomes that
// change access (paid, failed, recovered) also emit customer.subscription.updated.
export const membershipEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const id = (value: string | { id: string } | null | undefined) =>
  typeof value === "string" ? value : value?.id;
const date = (seconds: number | null | undefined) =>
  seconds ? new Date(seconds * 1000).toISOString() : null;

export async function synchronizeMembership(
  event: Stripe.Event,
  stripe: Stripe,
  database: SupabaseClient,
  prices: string[],
) {
  if (!membershipEvents.has(event.type)) return "ignored";
  const object = event.data.object;
  const customer =
    object.object === "subscription" || object.object === "checkout.session"
      ? id(object.customer)
      : undefined;
  if (!customer) return "ignored";
  // Duplicates are rejected atomically by sync_membership_event's receipt insert.
  return reconcileMembership(customer, stripe, database, prices, event);
}

// Throttled Checkout confirmation shares reconciliation without inventing events.
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
          current_period_end:
            approved && !subscription.pause_collection
              ? date(
                  Math.min(
                    item.current_period_end,
                    subscription.cancel_at ?? Infinity,
                  ),
                )
              : null,
          cancel_at_period_end:
            subscription.cancel_at_period_end || Boolean(subscription.cancel_at),
        },
      },
    );
    if (commitError) throw commitError;
    if (result !== "retry") return result;
  }
  throw new Error("Concurrent membership synchronization; retry event");
}
