import { PageHero, PageTitle } from "@/components/sections/SplitSection";
import { pageMetadata } from "@/lib/site";
import EmberField from "@/components/EmberField";
import { TextLink } from "@/components/ui/Action";
import { Container } from "@/components/layout/Container";
import EventsClient from "@/components/events/EventsClient";

export const metadata = pageMetadata({
  title: "Events",
  description:
    "Find Sapiens First events near you and show up for the revolution.",
  path: "/events",
});

export default function Page() {
  return (
    <>
      <PageHero>
        <EmberField />
        <Container>
          <PageTitle>
            Upcoming
            <br />
            <span className="text-coral-dark">Events</span>
          </PageTitle>
        </Container>
      </PageHero>
      <main>
        <section
          className={
            "border-b-2 border-ink pt-16 pr-0 pb-24 pl-0 max-sm:scroll-mt-20"
          }
        >
          <Container>
            <div className="mb-7 flex flex-wrap items-baseline justify-between gap-4 max-md:flex-col max-md:gap-2.5">
              <h2 className="font-display text-4xl leading-none font-extrabold tracking-tight uppercase lg:text-6xl">
                All Events
              </h2>
              <TextLink href="/circle">Want to host? →</TextLink>
            </div>
            <EventsClient />
          </Container>
        </section>
      </main>
    </>
  );
}
