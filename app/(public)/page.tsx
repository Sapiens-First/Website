import type { Metadata } from "next";
import {
  CampaignHero,
  CampaignStrip,
  CommunityBand,
  Demands,
  EventBand,
  HostSection,
  Manifesto,
} from "@/components/redesign/campaign-sections";
import { redesignCopy } from "@/lib/no-tech-kings/copy";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: { absolute: "Sapiens First — A Movement for AI Accountability" },
  description:
    "Join Sapiens First to defend humanity from the threats of superintelligence. Explore our campaigns, fellowship, and local organizing groups.",
  path: "/",
});

export default function Page() {
  return (
    <main>
      <CampaignHero
        tagline={redesignCopy.homeTagline}
        declarationHref="/no-tech-kings#declaration"
        showPhoto
        showCampaignLine
      />
      <Demands />
      <EventBand />
      <Manifesto />
      <HostSection />
      <CommunityBand />
      <CampaignStrip />
    </main>
  );
}
