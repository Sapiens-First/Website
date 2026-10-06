import { TextLink } from "@/components/ui/Action";
import { Label } from "@/components/ui/Label";
import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";
import CampaignAccordion from "@/components/CampaignAccordion";

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
        <Container>
          <Label tone="coral">{"Take action"}</Label>
          <h1 className="page-title">
            {"Our "}
            <span className="ink-underline blue">{"Campaigns."}</span>
          </h1>
        </Container>
      </div>
      <main className="route-campaigns">
        <section className="section section-compact">
          <Container>
            <p className="body-large reveal">
              {
                "Our long-term goal is to build movement power. Having intermediary objectives helps structure activities, allowing us to build leaders and expand movement participation."
              }
            </p>
            <p className="body-large reveal">
              {"These campaigns are drawn from our "}
              <TextLink
                href="/policy"
                style={
                  {
                    textTransform: "none",
                    letterSpacing: "normal",
                    fontSize: "inherit",
                  } as React.CSSProperties
                }
              >
                {"policies"}
              </TextLink>
              {
                ". They are intended to be achievable, so that we have momentum in the movement. Therefore, they are chosen to be either incremental or symbolic."
              }
            </p>
            <p className="body-large reveal">
              {
                "Campaigns also help us win the support of institutions, like politicians, other advocacy organizations, and the media. This, however, is secondary to the objective of getting lots of people involved in the fight for democracy."
              }
            </p>
          </Container>
        </section>

        <section className="section" id="campaigns">
          <Container>
            <div className="section-label reveal">
              <span className="title">{"Current Campaigns"}</span>
            </div>
            <CampaignAccordion />
          </Container>
        </section>
      </main>
    </div>
  );
}
