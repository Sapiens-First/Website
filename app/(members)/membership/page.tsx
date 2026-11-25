import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Kicker } from "@/components/ui/Text";
import { getMembershipState } from "@/lib/members/access";
import { getMembershipPrices } from "@/lib/stripe";
import {
  amountForPrice,
  isEndedSubscription,
  TRIAL_DAYS,
} from "@/lib/members/plans";
import { JoinSteps } from "@/components/members/JoinSteps";
import CheckoutForm, {
  CheckoutConfirmation,
  BillingManagement,
} from "./CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Membership",
  robots: { index: false, follow: false },
};

export default async function MembershipPage({
  searchParams,
}: {
  searchParams: Promise<{
    checkout?: string;
    billing?: string;
  }>;
}) {
  const { checkout, billing } = await searchParams;
  const {
    account: { user },
    allowed,
    membership: data,
  } = await getMembershipState("/membership");
  if (checkout === "returned" && allowed)
    redirect("/dashboard?membership=confirmed");
  const ongoing =
    data && data.status !== "none" && !isEndedSubscription(data.status);
  const date = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat("en", {
          dateStyle: "long",
          timeStyle: "short",
          timeZone: "UTC",
        }).format(new Date(value)) + " UTC"
      : "Awaiting confirmation";
  const amount = amountForPrice(data?.stripe_price_id, getMembershipPrices());
  // Allowed members were redirected above, so this is still pending.
  const returned = checkout === "returned";
  const choosing = !ongoing && !returned;
  return (
    <main className="py-12 sm:py-20">
      <Container width="content" className="max-w-3xl">
        {!ongoing && <JoinSteps current={4} className="mb-10" />}
        <Kicker>Sapiens First membership</Kicker>
        <h1 className="font-display text-5xl leading-none font-extrabold uppercase sm:text-7xl">
          {ongoing
            ? "Your membership."
            : returned
              ? "Almost there."
              : "Choose your contribution."}
        </h1>
        <p className="mt-6 text-sm break-all text-muted-foreground">
          {ongoing ? "Signed in as" : "Joining as"}{" "}
          <strong className="text-ink">{user.email}</strong>
        </p>
        {returned && <CheckoutConfirmation />}
        {checkout === "canceled" && (
          <p role="status" className="mt-5">
            You didn’t finish paying. You can pick an amount and try again
            below.
          </p>
        )}
        {(billing === "updated" || billing === "returned") && (
          <p role="status" className="mt-5">
            Changes to your payments can take a minute to show up here.
          </p>
        )}
        {ongoing && (
          <section
            aria-label="Membership status"
            className="mt-8 border-2 border-ink bg-white p-6"
          >
            <dl className="grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="font-bold">Contribution</dt>
                <dd>
                  {amount
                    ? `$${amount} USD/month`
                    : "Email ops@sapiensfirst.org"}
                </dd>
              </div>
              <div>
                <dt className="font-bold">Status</dt>
                <dd>
                  {allowed
                    ? data.status === "trialing"
                      ? `${TRIAL_DAYS}-day trial`
                      : "Active"
                    : "Payment needed"}
                </dd>
              </div>
              <div>
                <dt className="font-bold">
                  {!allowed
                    ? "Paid until"
                    : data.cancel_at_period_end
                      ? "Access ends"
                      : data.status === "trialing"
                        ? "First payment"
                        : "Next payment"}
                </dt>
                <dd>
                  {date(
                    data.status === "trialing"
                      ? data.trial_end
                      : data.current_period_end,
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-bold">Auto-renew</dt>
                <dd>
                  {!["active", "trialing"].includes(data.status)
                    ? "Payment failed — update your card"
                    : data.cancel_at_period_end
                      ? "Canceled — won’t renew"
                      : "Renews automatically"}
                </dd>
              </div>
            </dl>
            <BillingManagement />
          </section>
        )}
        {choosing && (
          <CheckoutForm trialUsed={Boolean(data?.trial_started_at)} />
        )}
        {choosing && data?.stripe_customer_id && <BillingManagement />}
        <div className="mt-10 flex flex-wrap gap-6 border-t-2 border-rule pt-6 text-sm">
          {ongoing && (
            <Link href="/dashboard" className="underline underline-offset-4">
              Back to your account
            </Link>
          )}
          <Link
            href="/dashboard/profile"
            className="underline underline-offset-4"
          >
            Edit your profile
          </Link>
        </div>
      </Container>
    </main>
  );
}
