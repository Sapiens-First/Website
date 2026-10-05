import type { Metadata } from "next";
import Link from "next/link";
import EventsClient from "@/components/EventsClient";
import "./page.css";

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
        <div className="container">
          <h1 className="page-title">
            {"Upcoming"}
            <br />
            <span className="title-accent">{"Events"}</span>
          </h1>
        </div>
      </div>
      <main className="route-events">
        <section className="events-section">
          <div className="container">
            <div className="events-header">
              <h2 className="events-title">{"All Events"}</h2>
              <Link className="text-link" href="/circle">
                {"Want to host? →"}
              </Link>
            </div>
            <EventsClient />
          </div>
        </section>
      </main>
    </div>
  );
}
