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
    <div className="route-root route-events">
      <div className="page-hero">
        <EmberField />
        <Container>
          <h1 className="page-title">
            Upcoming
            <br />
            <span className="title-accent">Events</span>
          </h1>
        </Container>
      </div>
      <main className="route-events">
        <section className="events-section pt-16 pr-0 pb-24 pl-0">
          <Container>
            <div className="events-header mb-7 flex flex-wrap items-baseline justify-between gap-4 max-md:flex-col max-md:gap-2.5">
              <h2 className="events-title font-display leading-none font-extrabold tracking-tight uppercase">
                All Events
              </h2>
              <TextLink href="/circle">Want to host? →</TextLink>
            </div>
            <EventsClient />
          </Container>
        </section>
      </main>
    </div>
  );
}
