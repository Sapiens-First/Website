import type { Metadata } from "next";
import GuideClient from "@/components/GuideClient";
import "./page.css";

export const metadata: Metadata = {
  title: "Guide (Outline test) — Sapiens First",
  description:
    "Test page: the Sapiens First guide rendered from an Outline doc instead of Google Docs.",
  alternates: { canonical: "/learn-01" },
  openGraph: {
    title: "Guide (Outline test) — Sapiens First",
    description:
      "Test page: the Sapiens First guide rendered from an Outline doc instead of Google Docs.",
    url: "/learn-01",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="route-root route-learn-01">
      <div className="page-hero">
        <div className="ember-field" aria-hidden="true"></div>
        <div className="container">
          <h1 className="page-title">
            {"Sapiens' Guide to"}
            <br />
            <span className="title-accent">{"Revolution"}</span>
          </h1>
        </div>
      </div>
      <main className="route-learn-01">
        <section className="guide-section">
          <div className="container">
            <div className="guide-layout">
              <GuideClient source="outline" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
