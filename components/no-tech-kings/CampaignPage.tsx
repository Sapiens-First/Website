import {
  CampaignHero,
  CampaignStrip,
  CommunityBand,
  Declaration,
  EventBand,
  HostSection,
  Manifesto,
  Parallel,
} from "@/components/redesign/campaign-sections";
import { redesignCopy } from "@/lib/no-tech-kings/copy";

export function CampaignPage() {
  return (
    <main>
      <CampaignHero
        tagline={redesignCopy.ntkTagline}
        declarationHref="#declaration"
      />
      <EventBand />
      <Declaration />
      <Parallel />
      <HostSection />
      <Manifesto />
      <CommunityBand />
      <CampaignStrip />
    </main>
  );
}
