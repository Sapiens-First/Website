import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Kicker } from "@/components/ui/Text";
import { getMembershipState } from "@/lib/members/access";
import CheckoutForm from "./CheckoutForm";
import BillingForm from "./BillingForm";

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
    error?: string;
    billing?: string;
  }>;
}) {
  const {
    account: { user, supabase },
    allowed,
    unavailable,
  } = await getMembershipState(true);
  const { data, error } = await supabase
    .from("memberships")
    .select(
      "status,stripe_customer_id,stripe_price_id,trial_started_at,trial_end,current_period_end,paid_until,cancel_at_period_end,scheduled_price_id,scheduled_change_at",
    )
    .eq("member_id", user.id)
    .maybeSingle();
  if (error) throw new Error("Your membership could not be loaded.");
  const { checkout, error: accessError, billing } = await searchParams;
  if (checkout === "returned" && allowed)
    redirect("/dashboard?membership=confirmed");
  const ongoing =
    data && !["none", "canceled", "incomplete_expired"].includes(data.status);
  const contribution = (price: string | null | undefined) =>
    ["1", "10", "20"].find(
      (value) => process.env[`STRIPE_PRICE_MONTHLY_${value}`] === price,
    ) ?? null;
  const date = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat("en", {
          dateStyle: "long",
          timeStyle: "short",
          timeZone: "UTC",
        }).format(new Date(value)) + " UTC"
      : "Awaiting confirmation";
  const amount = contribution(data?.stripe_price_id);
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
        {(unavailable || accessError === "verification") && (
          <p role="alert" className="mt-5">
            We couldn’t confirm your membership right now. You can manage
            billing below or try opening the dashboard again.
          </p>
        )}
        {checkout === "returned" && (
          <p role="status" className="mt-5 border-l-4 border-ink p-3">
            We’re waiting for payment or trial confirmation. Refresh this page
            to check again. Dashboard access opens only after confirmation.
          </p>
        )}
        {checkout === "canceled" && (
          <p role="status" className="mt-5">
            You left Checkout. You can resume or choose another contribution
            below.
          </p>
        )}
        {billing === "updated" && !unavailable && (
          <p role="status" className="mt-5">
            Your billing settings have been refreshed.
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
                      ? "14-day trial"
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
            {data.scheduled_price_id && (
              <p className="mt-5">
                Pending contribution: $
                {contribution(data.scheduled_price_id) ?? "unknown"} USD/month,
                starting {date(data.scheduled_change_at)}.
              </p>
            )}
            <BillingForm
              editable={
                ["active", "trialing"].includes(data.status) && !unavailable
              }
              canceling={data.cancel_at_period_end}
              pendingChange={Boolean(data.scheduled_price_id)}
              currentAmount={amount}
            />
          </section>
        )}
        {!ongoing && (
          <CheckoutForm trialUsed={Boolean(data?.trial_started_at)} />
        )}
        {!ongoing && data?.stripe_customer_id && (
          <BillingForm
            editable={false}
            canceling={false}
            pendingChange={false}
            currentAmount={amount}
          />
        )}
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
