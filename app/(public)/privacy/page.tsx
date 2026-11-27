import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "How Sapiens First handles member profiles, campaign signatures and communication preferences.",
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
                You can sign in with Google or with a link we email you. If you
                use Google, it shares your name and email with us. Signing in
                doesn&apos;t sign you up for marketing emails or make your
                details public.
              </p>
              <p>
                Your profile requires your name, country, city, postal code and
                phone number so we can connect you with people nearby. Your
                state or region and street address are optional. Giving us your
                phone number doesn&apos;t mean we&apos;ll call or text you.
              </p>
              <p>
                When you agree to the member agreement, we note which version
                you agreed to and when. Membership is currently free.
              </p>
              <p>
                We use cookies to keep you signed in. You can see and edit your
                profile in your member dashboard, or email us to get a copy of
                your data or have it deleted.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-lg leading-relaxed text-ink">
              <h2 className="font-display text-3xl font-extrabold uppercase">
                Campaign signatures
              </h2>
              <p>
                Signing a campaign records your email address, any optional
                contact details, the campaign, when you signed, and whether you
                want campaign emails.
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
                Signatures and interests are stored securely with the services
                that run this website. Only authorized people can access them.
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
              <a className="text-coral-dark" href="mailto:ops@sapiensfirst.org">
                ops@sapiensfirst.org
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
