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
                Campaign signatures
              </h2>
              <p>
                Signing a campaign records your email, the campaign and demand
                version, the time of signing, a receipt identifier and your
                consent choices in our Supporter List. Name, US ZIP code and
                phone number are optional. We use these records to keep track of
                campaign support and, where you choose to provide them,
                understand local support and maintain contact details.
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
                Supporter information is stored in Sapiens First&apos;s Google
                Workspace spreadsheet and processed by the services that host
                this website and its signup connection. It may be used in our
                internal contact-management work for the purposes you agreed to.
                Access is restricted to the people and systems authorized to
                manage these records.
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
              We do not use cookies or tracking software on this website.
            </p>
          </div>
        </Container>
      </main>
    </>
  );
}
