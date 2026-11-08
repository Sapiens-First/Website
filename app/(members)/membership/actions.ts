"use server";

import { redirect } from "next/navigation";
import { requireAccountProfile } from "@/lib/members/access";
import { isProfileComplete } from "@/lib/members/profile";
import { getAppUrl } from "@/lib/supabase/auth-server";
import {
  getCheckoutClients,
  getServerBillingClients,
  BillingError,
} from "@/lib/stripe";
import { createMembershipCheckout } from "@/lib/members/checkout";
import { isContribution } from "@/lib/members/plans";
import { revalidatePath } from "next/cache";
import { reconcileMembership } from "@/lib/members/webhook";

export async function confirmCheckout(): Promise<{ error: string | null }> {
  const { user, profile, supabase } =
    await requireAccountProfile("/membership");
  if (!isProfileComplete(profile)) redirect("/onboarding?next=%2Fmembership");
  try {
    const { stripe, database, prices } = getServerBillingClients();
    // Claim BEFORE any Stripe request. Concurrent tabs/instances share this limit.
    const { data: claim, error } = await database
      .rpc("claim_checkout_reconciliation", { p_member_id: user.id })
      .maybeSingle<{
        stripe_customer_id: string;
        checkout_session_id: string;
      }>();
    if (error) throw error;
    if (!claim)
      return {
        error:
          "Confirmation was checked recently or no Checkout is pending. Please wait 30 seconds before retrying.",
      };
    const session = await stripe.checkout.sessions.retrieve(
      claim.checkout_session_id,
    );
    const customer =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;
    if (
      customer !== claim.stripe_customer_id ||
      session.client_reference_id !== user.id ||
      session.mode !== "subscription"
    )
      throw new Error("Checkout ownership mismatch");
    if (session.status !== "complete")
      return {
        error:
          "Checkout has not completed yet. Please finish it before checking again.",
      };
    await reconcileMembership(
      claim.stripe_customer_id,
      stripe,
      database,
      Object.values(prices),
    );
    const { data: access, error: accessError } = await supabase
      .rpc("membership_access")
      .maybeSingle<{ allowed: boolean }>();
    if (accessError) throw accessError;
    if (!access?.allowed)
      return {
        error:
          "Payment or trial confirmation is still pending. Please try again in 30 seconds.",
      };
  } catch (error) {
    console.error("Checkout confirmation failed", {
      type: error instanceof Error ? error.name : "database_error",
    });
    return {
      error:
        "We couldn’t check confirmation right now. Please try again in 30 seconds.",
    };
  }
  revalidatePath("/membership");
  redirect("/dashboard?membership=confirmed");
}

export async function manageBilling(): Promise<{ error: string | null }> {
  const { user, supabase } = await requireAccountProfile("/membership");
  let destination: string;
  try {
    const { data, error } = await supabase
      .from("memberships")
      .select("stripe_customer_id")
      .eq("member_id", user.id)
      .single();
    if (error || !data?.stripe_customer_id)
      throw new BillingError("No billing account is available yet.");
    await claimBillingAction(user.id);
    const { stripe, portalConfigurationId } = getCheckoutClients();
    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      configuration: portalConfigurationId,
      return_url: `${getAppUrl()}/membership?billing=returned`,
    });
    destination = session.url;
  } catch (error) {
    return {
      error:
        error instanceof BillingError
          ? error.message
          : "We couldn’t open billing management. Please try again.",
    };
  }
  redirect(destination);
}

export async function startCheckout(
  _previous: { error: string | null },
  form: FormData,
): Promise<{ error: string | null }> {
  const { user, profile } = await requireAccountProfile("/membership");
  if (!isProfileComplete(profile)) redirect("/onboarding?next=%2Fmembership");
  const amount = form.get("contribution");
  const payment = form.get("payment");
  if (
    form.getAll("contribution").length !== 1 ||
    !isContribution(amount) ||
    form.getAll("payment").length !== 1 ||
    (payment !== "trial" && payment !== "pay")
  )
    return { error: "Choose a monthly contribution and payment option." };
  if (!user.email)
    return { error: "Your account needs an email address to subscribe." };

  let destination: string;
  try {
    await claimBillingAction(user.id);
    const clients = getCheckoutClients();
    destination = await createMembershipCheckout({
      ...clients,
      member: { id: user.id, email: user.email, name: profile.full_name! },
      priceId: clients.prices[amount],
      requestTrial: payment === "trial",
      appUrl: getAppUrl(),
    });
  } catch (error) {
    if (error instanceof BillingError) return { error: error.message };
    console.error("Membership Checkout failed", {
      type: error instanceof Error ? error.name : "unknown",
    });
    return { error: "We couldn’t open checkout. Please try again." };
  }
  redirect(destination);
}
async function claimBillingAction(memberId: string) {
  const { database } = getServerBillingClients();
  const { data, error } = await database
    .rpc("claim_billing_action", { p_member_id: memberId })
    .maybeSingle<{ member_id: string }>();
  if (error) throw error;
  if (!data)
    throw new BillingError(
      "Please wait five seconds before opening Checkout or billing again.",
    );
}
