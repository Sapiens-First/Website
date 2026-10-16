import { notFound } from "next/navigation";
import { campaigns, type CampaignId } from "@/lib/campaigns";
import { pageMetadata } from "@/lib/site";
import { Container } from "@/components/layout/Container";
import {
  HeroCopy,
  HeroLede,
  SplitHero,
} from "@/components/sections/SplitSection";
import { ActionLink, TextLink } from "@/components/ui/Action";
import { Label } from "@/components/ui/Text";
import CampaignSignatureForm from "@/components/campaigns/CampaignSignatureForm";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(campaigns)
    .filter((slug) => slug !== "citizens-dividend")
    .map((slug) => ({ slug }));
}
function getCampaign(slug: string) {
  if (!Object.hasOwn(campaigns, slug) || slug === "citizens-dividend")
    notFound();
  const campaign = campaigns[slug as CampaignId];
  if (!("headline" in campaign)) notFound();
  return campaign;
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = getCampaign(slug);
  return pageMetadata({
    title: campaign.title,
    description: campaign.description,
    path: `/campaigns/${slug}`,
  });
}
const heading =
  "mt-5 mb-6 font-display text-4xl leading-none font-extrabold tracking-tight uppercase sm:text-5xl lg:text-6xl";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign = getCampaign(slug);
  return (
    <main>
      <SplitHero className="min-h-0">
        <HeroCopy circle={false}>
          <TextLink className="mb-8 w-max" href="/campaigns">
            ← All campaigns
          </TextLink>
          <Label tone="coral" className="w-fit">
            {campaign.title}
          </Label>
          <h1 className="mt-6 mb-0 max-w-xl font-display text-6xl leading-[0.9] font-extrabold tracking-tight uppercase sm:text-7xl xl:text-8xl">
            {campaign.headline}
          </h1>
          <HeroLede>{campaign.description}</HeroLede>
          <ActionLink href="#sign" variant="primary" className="w-fit">
            Sign the call ↓
          </ActionLink>
        </HeroCopy>
        <div className="flex flex-col justify-center border-t-2 border-ink bg-brand-blue px-7 py-16 text-paper sm:px-12 lg:border-t-0 lg:border-l-2 lg:px-16">
          <p className="text-sm font-black tracking-widest text-brand-yellow uppercase">
            Our demand
          </p>
          <h2 className={heading}>{campaign.demand}</h2>
          <p className="text-lg leading-relaxed">{campaign.intro}</p>
        </div>
      </SplitHero>
      <section className="border-b-2 border-ink bg-paper py-16 sm:py-24">
        <Container>
          <Label tone="yellow">What we are calling for</Label>
          <h2 className={heading}>Make it happen.</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {campaign.points.map((point, index) => (
              <article className="border-t-8 border-ink pt-6" key={point.title}>
                <span className="font-display text-3xl font-extrabold text-coral-dark">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 mb-4 font-display text-3xl leading-none font-extrabold uppercase">
                  {point.title}
                </h3>
                <p className="text-lg leading-relaxed">{point.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <section className="border-b-2 border-ink bg-ink py-16 text-paper sm:py-24">
        <Container className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <Label tone="yellow">The public letter</Label>
            <h2 className={heading}>Read the call.</h2>
          </div>
          <article className="border-2 border-paper/30 p-6 sm:p-10">
            {campaign.letter.map((paragraph, index) => (
              <p
                className={
                  index === campaign.letter.length - 1
                    ? "m-0 text-xl leading-relaxed font-bold text-brand-yellow"
                    : "mb-5 text-lg leading-relaxed"
                }
                key={paragraph}
              >
                {paragraph}
              </p>
            ))}
          </article>
        </Container>
      </section>
      {slug === "freeze-ai" && (
        <section className="border-b-2 border-ink bg-white py-12">
          <Container>
            <h2 className="mb-4 font-display text-3xl font-extrabold uppercase">
              The ideas behind this campaign
            </h2>
            <p className="max-w-3xl text-lg leading-relaxed">
              Our treaty demand draws on{" "}
              <TextLink
                className="text-base tracking-normal normal-case"
                href="https://aitreaty.org/"
              >
                AI Treaty’s international proposal
              </TextLink>
              . Our organizing approach is informed by{" "}
              <TextLink
                className="text-base tracking-normal normal-case"
                href="https://freezeai.now/"
              >
                Freeze AI / Irreplaceable
              </TextLink>
              . This is Sapiens First’s own call and signature list.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed">
              Signing here records your support with Sapiens First. It does not
              sign another organization’s letter, register you for an event or
              send a message to an official.
            </p>
          </Container>
        </section>
      )}
      <section className="border-b-2 border-ink bg-coral py-16 sm:py-24">
        <Container>
          <CampaignSignatureForm campaignId={slug as CampaignId} />
        </Container>
      </section>
    </main>
  );
}
