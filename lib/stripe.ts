import "server-only";

import StripeClient from "stripe";
import { createClient } from "@supabase/supabase-js";

export class BillingError extends Error {}

export function getMembershipPrices() {
  return {
    "5": process.env.STRIPE_PRICE_MONTHLY_5 ?? "",
    "15": process.env.STRIPE_PRICE_MONTHLY_15 ?? "",
    "50": process.env.STRIPE_PRICE_MONTHLY_50 ?? "",
  };
}

function createServerClients() {
  const key = process.env.STRIPE_SECRET_KEY;
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  const prices = getMembershipPrices();
  if (!key || !url || !secret || Object.values(prices).some((price) => !price))
    throw new BillingError(
      "Membership payments aren’t available yet. Please try again later.",
    );
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

let serverClients: ReturnType<typeof createServerClients> | undefined;
export function getServerBillingClients() {
  serverClients ??= createServerClients();
  return serverClients;
}

export function getCheckoutClients() {
  const portalConfigurationId = process.env.STRIPE_PORTAL_CONFIGURATION_ID;
  const paymentMethodConfigurationId =
    process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION_ID;
  if (!portalConfigurationId || !paymentMethodConfigurationId)
    throw new BillingError(
      "Membership payments aren’t available yet. Please try again later.",
    );
  return {
    ...getServerBillingClients(),
    portalConfigurationId,
    paymentMethodConfigurationId,
  };
}
