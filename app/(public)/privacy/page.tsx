import { pageMetadata } from "@/lib/site";
import { Container } from "@/components/layout/Container";

export const metadata = pageMetadata({
  title: "Privacy",
  description:
    "How Sapiens First handles signups, campaign signatures, optional contact details and communication preferences.",
  path: "/privacy",
});

export default function Page() {
  return (
    <>
      <main>
        <Container>
          <div className="mx-auto my-0 flex max-w-2xl flex-col gap-10 pt-24 pr-0 pb-28 pl-0 max-sm:pt-20 max-sm:pr-0 max-sm:pb-20 max-sm:pl-0">
            <h1 className="relative z-2 max-w-xs font-display text-5xl leading-none font-extrabold tracking-tight uppercase max-sm:tracking-tighter sm:max-w-md sm:text-6xl lg:max-w-xl lg:text-8xl">
              Privacy
            </h1>
            <p className="text-lg leading-relaxed text-ink">
              When you sign up for Sapiens First, we collect your email address
              and the interest you select so we can respond with relevant
              information. We don&apos;t sell your personal information.
            </p>
            <div className="flex flex-col gap-4 text-lg leading-relaxed text-ink">
              <h2 className="font-display text-3xl font-extrabold uppercase">
                Member accounts
              </h2>
              <p>
                Google sign-in shares your basic account identity, including
                your email and name, with our authentication provider, Supabase.
                We store your account and private member profile in Supabase.
                Signing in does not subscribe you to marketing emails or publish
                your details in Atlas.
              </p>
              <p>
                When you complete your profile, we collect your confirmed name,
                country and locality for membership and local organizing.
                Region, postal code, phone and street address are optional.
                Providing a phone number does not opt you into calls or texts.
              </p>
              <p>
                We use authentication cookies to maintain your session. Signing
                out ends your current website session. You can view and correct
                your profile in the member dashboard. You can request access,
                correction or deletion of your account using the contact below.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-lg leading-relaxed text-ink">
              <h2 className="font-display text-3xl font-extrabold uppercase">
                Membership billing
              </h2>
              <p>
                Membership costs $1, $10 or $20 USD per month, with the same
                benefits at every amount. Eligible accounts can begin a 14-day
                trial with a payment card. After the trial, the selected monthly
                contribution is charged automatically unless you cancel renewal.
              </p>
              <p>
                Stripe processes membership payments. We share your account
                email and name with Stripe and store billing identifiers,
                membership status and billing dates in Supabase. We do not store
                your full card number. Stripe handles payment details under its{" "}
                <a className="underline" href="https://stripe.com/privacy">
                  Privacy Policy
                </a>
                .
              </p>
              <p>
                Cancel renewal anytime through billing management. Access
                continues through your trial or paid period. We don’t offer
                routine partial-month refunds, except where required by law.
                Failed renewal payments end member access until payment
                recovers.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-lg leading-relaxed text-ink">
              <h2 className="font-display text-3xl font-extrabold uppercase">
                Campaign signatures
              </h2>
              <p>
                Signing a campaign records your email address, any optional
                contact details, the campaign, signing time and optional
                campaign-email choice in Supabase.
              </p>
              <p>
                Your signature and contact details are private supporter
                records. We do not publish your name or send your information to
                officials through these forms. We do not submit your signature
                to the organizations linked as campaign references.
              </p>
              <p>
                Campaign email updates are an optional, separate choice. Giving
                a phone number does not opt you in to calls or text messages.
                Signing the same campaign again preserves your original
                signature and choices; it does not change your contact
                preferences.
              </p>
              <p>
                Campaign signatures and Circle or Fellowship interests are
                stored in Supabase and processed by the services that host this
                website. Access is restricted to authorized people and systems.
              </p>
              <p>
                We retain supporter and consent records while they are needed
                for those purposes or to honor contact preferences. You can ask
                to see, correct or delete your information, or change your
                communication preferences.
              </p>
            </div>
            <p className="text-lg leading-relaxed text-ink">
              To opt out, change your preferences or request deletion, email{" "}
              <a
                className="text-coral-dark"
                href="mailto:rohan@sapiensfirst.org"
              >
                rohan@sapiensfirst.org
              </a>
              .
            </p>
            <p className="border-t border-solid border-t-line pt-4 text-sm leading-relaxed text-ink">
              We use authentication cookies for account access and Vercel
              Analytics and Speed Insights to understand website usage and
              performance.
            </p>
          </div>
        </Container>
      </main>
    </>
  );
}
