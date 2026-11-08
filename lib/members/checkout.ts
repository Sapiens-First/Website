import "server-only";

import type StripeClient from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { BillingError } from "../stripe";
import { TRIAL_DAYS, isEndedSubscription } from "./plans";

type Membership = {
  member_id: string;
  stripe_customer_id: string | null;
  trial_started_at: string | null;
  checkout_session_id: string | null;
};

type CheckoutInput = {
  stripe: StripeClient;
  database: SupabaseClient;
  member: { id: string; email: string; name: string };
  priceId: string;
  requestTrial: boolean;
  appUrl: string;
  portalConfigurationId: string;
  paymentMethodConfigurationId: string;
};

export async function createMembershipCheckout(input: CheckoutInput) {
  const { stripe, database, member, priceId, appUrl, portalConfigurationId } =
    input;
  // The action's atomic cooldown claim has already prepared this member's row.
  const readMembership = async () => {
    const { data, error } = await database
      .from("memberships")
      .select(
        "member_id,stripe_customer_id,trial_started_at,checkout_session_id",
      )
      .eq("member_id", member.id)
      .single();
    if (error || !data) throw new Error("Could not load membership");
    return data as Membership;
  };
  let membership = await readMembership();
  let customerId = membership.stripe_customer_id;
  if (!customerId) {
    // Concurrent requests for the same member share one idempotent customer.
    const customer = await stripe.customers.create(
      {
        email: member.email,
        name: member.name,
        metadata: { member_id: member.id },
      },
      { idempotencyKey: `membership-customer-${member.id}` },
    );
    const { error } = await database
      .from("memberships")
      .update({ stripe_customer_id: customer.id })
      .eq("member_id", member.id)
      .is("stripe_customer_id", null);
    if (error) throw new Error("Could not save billing customer");
    membership = await readMembership();
    customerId = membership.stripe_customer_id;
    if (!customerId) throw new Error("Billing customer is missing");
  }

  // Stripe is authoritative even while webhook synchronization is delayed.
  let trialStarted = membership.trial_started_at
    ? Date.parse(membership.trial_started_at) / 1000
    : null;
  let hasSubscription = false;
  for await (const subscription of stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 100,
  })) {
    if (
      subscription.trial_start &&
      (trialStarted === null || subscription.trial_start < trialStarted)
    ) {
      trialStarted = subscription.trial_start;
    }
    if (!isEndedSubscription(subscription.status)) {
      hasSubscription = true;
    }
  }
  const manageMembership = async () => {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      configuration: portalConfigurationId,
      return_url: `${appUrl}/membership?billing=returned`,
    });
    return portal.url;
  };
  if (hasSubscription) return manageMembership();

  const trial = input.requestTrial && trialStarted === null;
  if (input.requestTrial && !trial) {
    throw new BillingError(
      "Your trial has already been used. Choose Pay monthly to continue.",
    );
  }

  // Only one Checkout URL stays usable: expire the previous open session.
  const previousSessionId = membership.checkout_session_id;
  if (previousSessionId) {
    const previous = await stripe.checkout.sessions.retrieve(
      previousSessionId,
      { expand: ["subscription"] },
    );
    if (
      previous.customer !== customerId ||
      previous.client_reference_id !== member.id ||
      previous.mode !== "subscription"
    )
      throw new Error("Checkout ownership mismatch");
    if (previous.status === "open")
      await stripe.checkout.sessions.expire(previous.id);
    if (previous.status === "complete") {
      // Checkout may complete after subscriptions.list above.
      if (!previous.subscription)
        throw new BillingError(
          "Your previous checkout is still being confirmed. Please try again shortly.",
        );
      const subscription =
        typeof previous.subscription === "string"
          ? await stripe.subscriptions.retrieve(previous.subscription)
          : previous.subscription;
      if (!isEndedSubscription(subscription.status)) return manageMembership();
      if (input.requestTrial && subscription.trial_start)
        throw new BillingError(
          "Your trial has already been used. Choose Pay monthly to continue.",
        );
    }
  }

  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      adaptive_pricing: { enabled: false },
      customer: customerId,
      client_reference_id: member.id,
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_collection: "always",
      payment_method_configuration: input.paymentMethodConfigurationId,
      success_url: `${appUrl}/membership?checkout=returned`,
      cancel_url: `${appUrl}/membership?checkout=canceled`,
      subscription_data: trial ? { trial_period_days: TRIAL_DAYS } : undefined,
    },
    {
      // Keyed to the session it replaces: a retry reuses this session, while a
      // later replacement never receives an already-expired one.
      idempotencyKey: `membership-checkout-${member.id}-${previousSessionId ?? "first"}-${priceId}-${trial ? "trial" : "pay"}`,
    },
  );
  if (!session.url || session.status !== "open") {
    throw new BillingError("This checkout has ended. Please try again.");
  }

  // Across tabs/instances, only one session may replace the previously saved ID.
  let save = database
    .from("memberships")
    .update({ checkout_session_id: session.id })
    .eq("member_id", member.id)
    .eq("stripe_customer_id", customerId);
  save = previousSessionId
    ? save.eq("checkout_session_id", previousSessionId)
    : save.is("checkout_session_id", null);
  const { data: saved, error: saveError } = await save
    .select("checkout_session_id")
    .maybeSingle();
  if (saveError) throw new Error("Could not save Checkout session");
  if (saved) return session.url;

  const winner = await readMembership();
  // Identical concurrent requests can receive the same Stripe session.
  if (winner.checkout_session_id === session.id) return session.url;
  await stripe.checkout.sessions.expire(session.id);
  throw new BillingError("Checkout changed in another tab. Please try again.");
}
