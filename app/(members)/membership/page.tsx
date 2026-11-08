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
  return (
    <main className="py-14 sm:py-20">
      <Container width="content" className="max-w-3xl">
        <Kicker>Sapiens First membership</Kicker>
        <h1 className="mt-5 font-display text-5xl font-extrabold uppercase sm:text-7xl">
          {ongoing ? "Your membership." : "Choose your contribution."}
        </h1>
        <p className="mt-6">
          Subscribing as <strong>{user.email}</strong>.
        </p>
        {checkout === "returned" && <CheckoutConfirmation />}
        {checkout === "canceled" && (
          <p role="status" className="mt-5">
            You left Checkout. You can resume or choose another contribution
            below.
          </p>
        )}
        {(billing === "updated" || billing === "returned") && (
          <p role="status" className="mt-5">
            Billing changes may take a moment to appear after Stripe confirms
            them.
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
                  {amount ? `$${amount} USD/month` : "Contact billing support"}
                </dd>
              </div>
              <div>
                <dt className="font-bold">Status</dt>
                <dd>
                  {allowed
                    ? data.status === "trialing"
                      ? `${TRIAL_DAYS}-day trial`
                      : "Active"
                    : "Payment or confirmation needed"}
                </dd>
              </div>
              <div>
                <dt className="font-bold">
                  {!allowed
                    ? "Billing period ends"
                    : data.cancel_at_period_end
                      ? "Access ends"
                      : data.status === "trialing"
                        ? "Trial ends / first charge"
                        : "Next renewal"}
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
                <dt className="font-bold">Renewal</dt>
                <dd>
                  {!["active", "trialing"].includes(data.status)
                    ? "Payment recovery required"
                    : data.cancel_at_period_end
                      ? "Canceled — no further renewal"
                      : "Renews automatically"}
                </dd>
              </div>
            </dl>
            <BillingManagement />
          </section>
        )}
        {!ongoing && (
          <CheckoutForm trialUsed={Boolean(data?.trial_started_at)} />
        )}
        {!ongoing && data?.stripe_customer_id && <BillingManagement />}
        <Link href="/dashboard" className="mt-6 inline-block underline">
          Back to your account
        </Link>
        <Link
          href="/dashboard/profile"
          className="mt-6 ml-6 inline-block underline"
        >
          Edit your profile
        </Link>
      </Container>
    </main>
  );
}
