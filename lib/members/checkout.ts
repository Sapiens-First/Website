import "server-only";

import { createHash } from "node:crypto";
import StripeClient from "stripe";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export class CheckoutError extends Error {}

export function billingServerClients() {
  const key = process.env.STRIPE_SECRET_KEY;
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  const prices = {
    "1": process.env.STRIPE_PRICE_MONTHLY_1,
    "10": process.env.STRIPE_PRICE_MONTHLY_10,
    "20": process.env.STRIPE_PRICE_MONTHLY_20,
  };
  if (
    !key ||
    !/^(rk|sk)_(test|live)_/.test(key) ||
    !url ||
    !secret ||
    Object.values(prices).some((price) => !price) ||
    new Set(Object.values(prices)).size !== 3
  )
    throw new CheckoutError("Membership checkout is not configured yet.");
  return {
    stripe: new StripeClient(key, { timeout: 20_000, maxNetworkRetries: 2 }),
    database: createClient(url, secret, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }),
    prices,
    livemode: /^(rk|sk)_live_/.test(key),
  };
}

export function billingClients() {
  const portalConfigurationId = process.env.STRIPE_PORTAL_CONFIGURATION_ID;
  const paymentMethodConfigurationId =
    process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION_ID;
  if (!portalConfigurationId || !paymentMethodConfigurationId)
    throw new CheckoutError("Membership checkout is not configured yet.");
  return {
    ...billingServerClients(),
    portalConfigurationId,
    paymentMethodConfigurationId,
  };
}

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
  amount: 1 | 10 | 20;
  priceId: string;
  requestTrial: boolean;
  appUrl: string;
  portalConfigurationId: string;
  paymentMethodConfigurationId: string;
  livemode: boolean;
};

export async function createMembershipCheckout(input: CheckoutInput) {
  const {
    stripe,
    database,
    member,
    amount,
    priceId,
    appUrl,
    portalConfigurationId,
  } = input;
  const price = await stripe.prices.retrieve(priceId);
  if (
    !price.active ||
    price.livemode !== input.livemode ||
    price.currency !== "usd" ||
    price.unit_amount !== amount * 100 ||
    price.billing_scheme !== "per_unit" ||
    price.recurring?.interval !== "month" ||
    price.recurring.interval_count !== 1 ||
    price.recurring.usage_type !== "licensed"
  )
    throw new CheckoutError(
      "This contribution is unavailable. Please try again later.",
    );

  const { error: insertError } = await database
    .from("memberships")
    .upsert(
      { member_id: member.id },
      { onConflict: "member_id", ignoreDuplicates: true },
    );
  if (insertError) throw new Error("Could not prepare membership");

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
    // Fixed parameters keep concurrent customer requests idempotent.
    const customer = await stripe.customers.create(
      { metadata: { member_id: member.id } },
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
  await stripe.customers.update(customerId, {
    email: member.email,
    name: member.name,
  });

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
    if (!["canceled", "incomplete_expired"].includes(subscription.status)) {
      hasSubscription = true;
    }
  }
  if (!membership.trial_started_at && trialStarted !== null) {
    const { error } = await database
      .from("memberships")
      .update({ trial_started_at: new Date(trialStarted * 1000).toISOString() })
      .eq("member_id", member.id)
      .is("trial_started_at", null);
    if (error) throw new Error("Could not save confirmed trial history");
  }
  const manageMembership = async () => {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      configuration: portalConfigurationId,
      return_url: `${appUrl}/membership`,
    });
    return portal.url;
  };
  if (hasSubscription) return manageMembership();

  const trial = input.requestTrial && trialStarted === null;
  if (input.requestTrial && !trial) {
    throw new CheckoutError(
      "Your trial has already been used. Choose Pay monthly to continue.",
    );
  }

  const previousSessionId = membership.checkout_session_id;
  if (previousSessionId) {
    const pending = await stripe.checkout.sessions.retrieve(previousSessionId);
    if (
      pending.customer !== customerId ||
      pending.client_reference_id !== member.id ||
      pending.mode !== "subscription"
    ) {
      throw new Error("Checkout ownership mismatch");
    }
    if (pending.status === "open") {
      if (
        pending.metadata?.price_id === priceId &&
        pending.metadata?.trial === String(trial) &&
        pending.payment_method_configuration_details?.id ===
          input.paymentMethodConfigurationId &&
        pending.success_url === `${appUrl}/membership?checkout=returned` &&
        pending.cancel_url === `${appUrl}/membership?checkout=canceled` &&
        pending.url
      ) {
        return pending.url;
      }
      // Expire the previously exposed URL before replacing its contribution.
      await stripe.checkout.sessions.expire(pending.id);
    }
    if (pending.status === "complete" && pending.subscription) {
      // It may have completed after subscriptions.list ran above.
      const subscription =
        typeof pending.subscription === "string"
          ? await stripe.subscriptions.retrieve(pending.subscription)
          : pending.subscription;
      if (!["canceled", "incomplete_expired"].includes(subscription.status)) {
        return manageMembership();
      }
      if (input.requestTrial && subscription.trial_start) {
        throw new CheckoutError(
          "Your trial has already been used. Choose Pay monthly to continue.",
        );
      }
    }
  }

  const fingerprint = createHash("sha256")
    .update(
      JSON.stringify([
        member.id,
        customerId,
        previousSessionId,
        priceId,
        trial,
        appUrl,
        input.paymentMethodConfigurationId,
      ]),
    )
    .digest();
  const integrationSuffix = [...fingerprint.subarray(0, 8)]
    .map((byte) => String.fromCharCode(97 + (byte % 26)))
    .join("");
  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      customer: customerId,
      client_reference_id: member.id,
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_collection: "always",
      payment_method_configuration: input.paymentMethodConfigurationId,
      success_url: `${appUrl}/membership?checkout=returned`,
      cancel_url: `${appUrl}/membership?checkout=canceled`,
      metadata: { price_id: priceId, trial: String(trial) },
      subscription_data: trial
        ? {
            trial_period_days: 14,
            trial_settings: {
              end_behavior: { missing_payment_method: "cancel" },
            },
          }
        : undefined,
      integration_identifier: `sapiens_membership_${integrationSuffix}`,
    },
    { idempotencyKey: `membership-checkout-${fingerprint.toString("hex")}` },
  );
  if (!session.url || session.status !== "open") {
    throw new CheckoutError("This checkout has ended. Please try again.");
  }

  // Across tabs/instances, only one session may replace the previously saved ID.
  let save = database
    .from("memberships")
    .update({
      checkout_session_id: session.id,
      checkout_expires_at: new Date(session.expires_at * 1000).toISOString(),
    })
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
  throw new CheckoutError("Checkout changed in another tab. Please try again.");
}
