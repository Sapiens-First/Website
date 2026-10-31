import { Container } from "@/components/layout/Container";
import { ActionLink, TextLink } from "@/components/ui/Action";
import { Label } from "@/components/ui/Text";
import { campaigns, type CampaignId } from "@/lib/campaigns";
import CampaignSignatureForm from "./CampaignSignatureForm";
import { getCampaignSignatureState } from "@/lib/campaign-signatures";

export async function CampaignSignatureLink({
  campaignId,
}: {
  campaignId: CampaignId;
}) {
  const access = await getCampaignSignatureState(campaignId);
  return (
    <ActionLink href="#sign" variant="primary" className="mt-8">
      {access.state === "member" && access.signature
        ? "You’ve signed this campaign ✓"
        : "Add my signature ↑"}
    </ActionLink>
  );
}

export default async function CampaignActionHero({
  campaignId,
  headline,
  description,
}: {
  campaignId: CampaignId;
  headline: string;
  description: string;
}) {
  const access = await getCampaignSignatureState(campaignId);
  return (
    <section className="border-b-2 border-ink bg-paper py-5 sm:py-10">
      <Container className="grid items-start gap-7 px-5 sm:gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div className="lg:pt-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 lg:block">
            <TextLink className="lg:mb-5" href="/campaigns">
              ← All campaigns
            </TextLink>
            <div>
              <Label tone="coral">{campaigns[campaignId].title}</Label>
            </div>
          </div>
          <h1 className="max-w-xl text-[2.5rem] leading-[0.98] text-balance sm:text-6xl xl:text-7xl">
            {headline}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed sm:text-lg">
            {description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-5">
            <ActionLink
              href="#sign"
              variant="primary"
              className="text-xs sm:text-sm"
            >
              {access.state === "member" && access.signature
                ? "You’ve signed this campaign ✓"
                : "Sign the letter ↓"}
            </ActionLink>
            <TextLink
              href="#the-call"
              className="text-xs tracking-normal normal-case sm:text-sm"
            >
              Read the letter ↓
            </TextLink>
          </div>
          <p className="mt-6 hidden max-w-sm border-t-2 border-ink pt-4 text-sm leading-relaxed lg:block">
            {access.state === "member" && access.signature
              ? "Thank you for supporting this campaign. Your signature is recorded."
              : "Your voice belongs in the debate. Add your support for the call, or read the full letter below."}
          </p>
        </div>
        <CampaignSignatureForm
          key={`${campaignId}:${access.state === "member" ? access.email : access.state}`}
          campaignId={campaignId}
          access={access}
        />
      </Container>
    </section>
  );
}
