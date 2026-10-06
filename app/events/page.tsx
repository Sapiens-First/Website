import { TextLink } from "@/components/ui/Action";
import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";
import EventsClient from "@/components/EventsClient";

export const metadata: Metadata = {
  title: "Events — Sapiens First",
  description:
    "Find Sapiens First events near you and show up for the revolution.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Events — Sapiens First",
    description:
      "Find Sapiens First events near you and show up for the revolution.",
    url: "/events",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-events">
      <div className="page-hero">
        <div className="ember-field" aria-hidden="true"></div>
        <Container>
          <h1 className="page-title">
            {"Upcoming"}
            <br />
            <span className="title-accent">{"Events"}</span>
          </h1>
        </Container>
      </div>
      <main className="route-events">
        <section className="events-section pt-16 pr-0 pb-24 pl-0">
          <Container>
            <div className="events-header flex items-baseline justify-between flex-wrap gap-4 mb-7 max-md:flex-col max-md:gap-2.5">
              <h2 className="events-title font-display font-extrabold leading-none tracking-tight uppercase">
                {"All Events"}
              </h2>
              <TextLink href="/circle">{"Want to host? →"}</TextLink>
            </div>
            <EventsClient />
          </Container>
        </section>
      </main>
    </div>
  );
}
