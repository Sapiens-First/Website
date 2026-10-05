import type { Metadata } from "next";
import Link from "next/link";
import CampaignAccordion from "@/components/CampaignAccordion";
import "../shared-campaigns-policy.css";
import "./page.css";

export const metadata: Metadata = {
  title: "Campaigns for AI Accountability — Sapiens First",
  description:
    "Sapiens First's active campaigns to protect civil liberties in the age of AI.",
  alternates: { canonical: "/campaigns" },
  openGraph: {
    title: "Campaigns for AI Accountability — Sapiens First",
    description:
      "Sapiens First's active campaigns to protect civil liberties in the age of AI.",
    url: "/campaigns",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="route-root route-campaigns">
      <div className="progress-bar"></div>

      <div className="page-hero">
        <div className="container">
          <span className="label">{"Take action"}</span>
          <h1 className="page-title">
            {"Our "}
            <span className="underline blue">{"Campaigns."}</span>
          </h1>
        </div>
      </div>
      <main className="route-campaigns">
        <section className="section section-compact">
          <div className="container">
            <p className="body-large reveal">
              {
                "\n          Our long-term goal is to build movement power. Having intermediary objectives helps structure activities, allowing us to build leaders and expand movement participation.\n        "
              }
            </p>
            <p className="body-large reveal">
              {"\n          These campaigns are drawn from our "}
              <Link
                href="/policy"
                className="text-link"
                style={
                  {
                    textTransform: "none",
                    letterSpacing: "normal",
                    fontSize: "inherit",
                  } as React.CSSProperties
                }
              >
                {"policies"}
              </Link>
              {
                ". They are intended to be achievable, so that we have momentum in the movement. Therefore, they are chosen to be either incremental or symbolic.\n        "
              }
            </p>
            <p className="body-large reveal">
              {
                "\n          Campaigns also help us win the support of institutions, like politicians, other advocacy organizations, and the media. This, however, is secondary to the objective of getting lots of people involved in the fight for democracy.\n        "
              }
            </p>
          </div>
        </section>

        <section className="section" id="campaigns">
          <div className="container">
            <div className="section-label reveal">
              <span className="title">{"Current Campaigns"}</span>
            </div>
            <CampaignAccordion />
          </div>
        </section>
      </main>
    </div>
  );
}
