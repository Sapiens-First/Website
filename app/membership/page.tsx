import { CardText, Card } from "@/components/ui/Card";
import { PageHero, PageTitle } from "@/components/sections/SplitSection";
import { pageMetadata } from "@/lib/site";
import EmberField from "@/components/EmberField";
import ScrollProgress from "@/components/ScrollProgress";
import { Container } from "@/components/layout/Container";
import { ActionLink, TextLink } from "@/components/ui/Action";

export const metadata = pageMetadata({
  title: "Membership",
  description:
    "Sapiens First membership is on its way — monthly dues, member perks, and a direct way to fund the movement.",
  path: "/membership",
});

export default function Page() {
  return (
    <>
      <ScrollProgress />

      <PageHero>
        <EmberField />
        <Container>
          <PageTitle>
            Become a
            <br />
            <span className="text-coral-dark">Member.</span>
          </PageTitle>
        </Container>
      </PageHero>
      <main>
        <section
          className={
            "relative border-b-2 border-ink px-0 pt-14 pb-16 max-md:pt-10 max-md:pb-14 max-sm:scroll-mt-20"
          }
        >
          <Container>
            <p
              className={
                "mx-auto mb-5 max-w-2xl reveal text-center text-3xl leading-relaxed font-normal text-ink max-md:max-w-full max-md:text-xl max-sm:text-lg"
              }
            >
              Membership is how you sustain Sapiens First for the long haul —
              monthly dues, a stronger voice in the movement, and a direct way
              to help us stay accountable to the people we organize with.
            </p>
            <Card
              className={
                "mt-7 flex reveal flex-col items-center gap-4 px-9 py-10 text-center max-sm:px-6 max-sm:py-9"
              }
            >
              <svg
                className="size-11 text-coral-dark opacity-85"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"></path>
              </svg>
              <div className="border border-solid border-coral px-3.5 py-1.5 font-body text-sm tracking-widest text-coral-dark uppercase opacity-80">
                Membership page is under construction
              </div>
              <CardText className="max-w-md">
                We&apos;re still building this page. In the meantime, join our
                email list to hear the moment it goes live, or support us right
                now with a donation.
              </CardText>
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-7">
                <ActionLink href="/join" variant="primary">
                  Join our email list →
                </ActionLink>
                <TextLink href="/donate">Make a donation instead →</TextLink>
              </div>
            </Card>
          </Container>
        </section>
      </main>
    </>
  );
}
