import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";
import GuideClient from "@/components/GuideClient";

export const metadata: Metadata = {
  title: "Guide — Sapiens First",
  description:
    "The Sapiens First guide to AI, people power, and how to make change.",
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "Guide — Sapiens First",
    description:
      "The Sapiens First guide to AI, people power, and how to make change.",
    url: "/learn",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-learn">
      <div className="page-hero">
        <Container>
          <div className="kicker">Learn · Organize · Act</div>
          <h1 className="page-title">
            Sapiens&apos; Guide to
            <br />
            <span className="title-accent">Revolution</span>
          </h1>
          <p className="guide-intro mt-7 leading-normal max-sm:mt-6">
            A practical guide to AI, people power, and organizing for change.
          </p>
        </Container>
      </div>
      <main className="route-learn">
        <section className="guide-section">
          <Container>
            <div className="guide-layout">
              <GuideClient />
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
