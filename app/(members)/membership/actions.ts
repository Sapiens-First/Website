"use server";

import { redirect } from "next/navigation";
import { requireAccountProfile } from "@/lib/members/access";
import { isProfileComplete } from "@/lib/members/profile";
import { getAppUrl } from "@/lib/supabase/auth-server";
import {
  billingClients,
  CheckoutError,
  createMembershipCheckout,
} from "@/lib/members/checkout";

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
    !["1", "10", "20"].includes(String(amount)) ||
    form.getAll("payment").length !== 1 ||
    (payment !== "trial" && payment !== "pay")
  )
    return { error: "Choose a monthly contribution and payment option." };
  if (!user.email)
    return { error: "Your account needs an email address to subscribe." };

  let destination: string;
  try {
    const clients = billingClients();
    destination = await createMembershipCheckout({
      ...clients,
      member: { id: user.id, email: user.email, name: profile.full_name! },
      amount: Number(amount) as 1 | 10 | 20,
      priceId: clients.prices[amount as "1" | "10" | "20"]!,
      requestTrial: payment === "trial",
      appUrl: getAppUrl(),
    });
  } catch (error) {
    if (error instanceof CheckoutError) return { error: error.message };
    console.error("Membership Checkout failed", {
      type: error instanceof Error ? error.name : "unknown",
    });
    return { error: "We couldn’t open checkout. Please try again." };
  }
  redirect(destination);
}
