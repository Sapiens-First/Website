import { notFound } from "next/navigation";
import { campaigns, type CampaignId } from "@/lib/campaigns";
import { pageMetadata } from "@/lib/site";
import { Container } from "@/components/layout/Container";
import { ActionLink, TextLink } from "@/components/ui/Action";
import { Label } from "@/components/ui/Text";
import CampaignActionHero from "@/components/campaigns/CampaignActionHero";

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
      <CampaignActionHero
        campaignId={slug as CampaignId}
        headline={campaign.headline}
        description={campaign.description}
      />
      <section className="border-b-2 border-ink bg-paper py-16 sm:py-24">
        <Container>
          <Label tone="yellow">What we are calling for</Label>
          <h2 className={heading}>Make it happen.</h2>
          <p className="max-w-3xl text-lg leading-relaxed">{campaign.intro}</p>
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
      <section
        id="the-call"
        className="scroll-mt-24 border-b-2 border-ink bg-soft py-12 sm:py-16"
      >
        <Container className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <Label tone="yellow">The public letter</Label>
            <h2 className={heading}>Our open letter.</h2>
          </div>
          <article className="max-w-[65ch] border-2 border-ink bg-white p-6 sm:p-10">
            {campaign.letter.map((paragraph, index) => (
              <p
                className={
                  index === campaign.letter.length - 1
                    ? "m-0 text-xl leading-relaxed font-bold text-coral-dark"
                    : "mb-6 text-lg leading-[1.7]"
                }
                key={paragraph}
              >
                {paragraph}
              </p>
            ))}
            <ActionLink href="#sign" variant="primary" className="mt-8">
              Add my signature ↑
            </ActionLink>
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
    </main>
  );
}
