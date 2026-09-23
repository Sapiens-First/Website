import type { Metadata } from "next";
import GuideClient from "@/components/GuideClient";
import "./page.css";

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
        <div className="container">
          <div className="kicker">{"Learn · Organize · Act"}</div>
          <h1 className="page-title">
            {"Sapiens' Guide to"}
            <br />
            <span className="title-accent">{"Revolution"}</span>
          </h1>
          <p className="guide-intro">
            {
              "A practical guide to AI, people power, and organizing for change."
            }
          </p>
        </div>
      </div>
      <main className="route-learn">
        <section className="guide-section">
          <div className="container">
            <div className="guide-layout">
              <GuideClient source="google" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
