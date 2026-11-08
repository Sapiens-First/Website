import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Kicker } from "@/components/ui/Text";
import { requireAccountProfile } from "@/lib/members/access";
import { isProfileComplete } from "@/lib/members/profile";
import { createAuthSupabaseClient } from "@/lib/supabase/auth-server";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Membership",
  robots: { index: false, follow: false },
};

export default async function MembershipPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { user, profile } = await requireAccountProfile("/membership");
  if (!isProfileComplete(profile)) redirect("/onboarding?next=%2Fmembership");
  const supabase = await createAuthSupabaseClient(true);
  const { data, error } = await supabase
    .from("memberships")
    .select("trial_started_at")
    .eq("member_id", user.id)
    .maybeSingle();
  if (error) throw new Error("Your membership could not be loaded.");
  const { checkout } = await searchParams;
  return (
    <main className="py-14 sm:py-20">
      <Container width="content" className="max-w-3xl">
        <Kicker>Sapiens First membership</Kicker>
        <h1 className="mt-5 font-display text-5xl font-extrabold uppercase sm:text-7xl">
          Choose your contribution.
        </h1>
        <p className="mt-6">
          Subscribing as <strong>{user.email}</strong>.
        </p>
        {checkout === "returned" && (
          <p role="status" className="mt-5 border-l-4 border-ink p-3">
            You’ve returned from Stripe. Membership access requires separate
            payment confirmation.
          </p>
        )}
        {checkout === "canceled" && (
          <p role="status" className="mt-5">
            You left Checkout. You can resume or choose another contribution
            below.
          </p>
        )}
        <p className="mt-5">
          If you already have an ongoing subscription, Continue opens billing
          management.
        </p>
        <CheckoutForm trialUsed={Boolean(data?.trial_started_at)} />
        <Link href="/dashboard" className="mt-6 inline-block underline">
          Back to your account
        </Link>
      </Container>
    </main>
  );
}
