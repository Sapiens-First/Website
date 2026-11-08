import "server-only";
import type Stripe from "stripe";
import { billingClients, CheckoutError } from "./checkout";
import { getAppUrl } from "../supabase/auth-server";

const id = (value: string | { id: string }) =>
  typeof value === "string" ? value : value.id;

// IDs always come from the authenticated member's server-read billing row.
export async function updateMembershipBilling(
  memberId: string,
  operation: string,
  amount: string,
) {
  const { stripe, database, prices, portalConfigurationId } = billingClients();
  const { data: member, error } = await database
    .from("memberships")
    .select("stripe_customer_id,stripe_subscription_id")
    .eq("member_id", memberId)
    .single();
  if (error || !member?.stripe_customer_id)
    throw new CheckoutError("No billing account is available yet.");
  if (operation === "portal") {
    const session = await stripe.billingPortal.sessions.create({
      customer: member.stripe_customer_id,
      configuration: portalConfigurationId,
      return_url: `${getAppUrl()}/membership?billing=returned`,
    });
    return session.url;
  }
  if (!member.stripe_subscription_id)
    throw new CheckoutError("No subscription is available.");
  const sub = await stripe.subscriptions.retrieve(
    member.stripe_subscription_id,
  );
  if (id(sub.customer) !== member.stripe_customer_id)
    throw new Error("Billing ownership mismatch");
  if (!["active", "trialing"].includes(sub.status))
    throw new CheckoutError(
      "Use billing management to recover your subscription first.",
    );
  const item = sub.items.data[0];
  if (
    sub.items.data.length !== 1 ||
    item.quantity !== 1 ||
    !Object.values(prices).includes(item.price.id)
  )
    throw new CheckoutError(
      "Please contact billing support for this subscription.",
    );

  if (operation === "cancel-change" || operation === "cancel-renewal") {
    if (sub.schedule)
      await stripe.subscriptionSchedules.release(id(sub.schedule));
    if (operation === "cancel-renewal")
      await stripe.subscriptions.update(sub.id, { cancel_at_period_end: true });
  } else if (operation === "resume") {
    await stripe.subscriptions.update(sub.id, { cancel_at_period_end: false });
  } else if (operation === "change") {
    if (!["1", "10", "20"].includes(amount))
      throw new CheckoutError("Choose $1, $10 or $20 per month.");
    const priceId = prices[amount as keyof typeof prices];
    if (!priceId || sub.cancel_at_period_end || sub.cancel_at)
      throw new CheckoutError(
        "Resume renewal before changing your contribution.",
      );
    if (priceId === item.price.id)
      throw new CheckoutError("That is already your current contribution.");
    const price = await stripe.prices.retrieve(priceId);
    if (
      !price.active ||
      price.currency !== "usd" ||
      price.unit_amount !== Number(amount) * 100 ||
      price.recurring?.interval !== "month" ||
      price.recurring.interval_count !== 1
    )
      throw new Error("Invalid membership price");
    const schedule = sub.schedule
      ? await stripe.subscriptionSchedules.retrieve(id(sub.schedule))
      : await stripe.subscriptionSchedules.create({
          from_subscription: sub.id,
        });
    const start = schedule.current_phase?.start_date;
    if (!start)
      throw new CheckoutError(
        "Your billing period is changing. Please try again.",
      );
    const current: Stripe.SubscriptionScheduleUpdateParams.Phase = {
      start_date: start,
      end_date: item.current_period_end,
      items: [{ price: item.price.id, quantity: 1 }],
      proration_behavior: "none",
    };
    if (sub.status === "trialing" && sub.trial_end)
      current.trial_end = sub.trial_end;
    await stripe.subscriptionSchedules.update(schedule.id, {
      end_behavior: "release",
      proration_behavior: "none",
      phases: [
        current,
        {
          start_date: item.current_period_end,
          duration: { interval: "month", interval_count: 1 },
          items: [{ price: priceId, quantity: 1 }],
          proration_behavior: "none",
        },
      ],
    });
  } else throw new CheckoutError("Choose a valid billing action.");
  return null;
}
