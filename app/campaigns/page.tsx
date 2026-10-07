import { PageHero, PageTitle } from "@/components/sections/SplitSection";
import { pageMetadata } from "@/lib/site";
import ScrollProgress from "@/components/ScrollProgress";
import { TextLink } from "@/components/ui/Action";
import { Label } from "@/components/ui/Text";
import { Container } from "@/components/layout/Container";
import CampaignAccordion from "@/components/campaigns/CampaignAccordion";

export const metadata = pageMetadata({
  title: "Campaigns for AI Accountability",
  description:
    "Sapiens First's active campaigns to protect civil liberties in the age of AI.",
  path: "/campaigns",
});

const bodyLarge =
  "reveal mx-0 mt-0 mb-5 max-w-4xl text-left text-lg leading-normal font-medium text-ink last:mb-0 xl:text-xl";

export default function Page() {
  return (
    <>
      <ScrollProgress />

      <PageHero className="px-0 pt-20 pb-20 max-md:pt-20 max-md:pb-20 max-sm:pt-14 max-sm:pb-12">
        <Container>
          <Label className="mb-[26px]" tone="coral">
            Take action
          </Label>
          <PageTitle className="m-0 max-w-xl animate-none text-left text-6xl leading-[0.9] tracking-[-0.025em] opacity-100 lg:text-8xl">
            Our{" "}
            <span className="ink-underline ink-underline-brand-blue">
              Campaigns.
            </span>
          </PageTitle>
        </Container>
      </PageHero>
      <main>
        <section
          className={
            "relative border-b-2 border-ink bg-white px-0 py-16 max-md:py-12 max-sm:scroll-mt-20"
          }
        >
          <Container>
            <p className={bodyLarge}>
              Our long-term goal is to build movement power. Having intermediary
              objectives helps structure activities, allowing us to build
              leaders and expand movement participation.
            </p>
            <p className={bodyLarge}>
              These campaigns are drawn from our{" "}
              <TextLink
                href="/policy"
                className="text-[length:inherit] tracking-normal normal-case"
              >
                policies
              </TextLink>
              . They are intended to be achievable, so that we have momentum in
              the movement. Therefore, they are chosen to be either incremental
              or symbolic.
            </p>
            <p className={bodyLarge}>
              Campaigns also help us win the support of institutions, like
              politicians, other advocacy organizations, and the media. This,
              however, is secondary to the objective of getting lots of people
              involved in the fight for democracy.
            </p>
          </Container>
        </section>

        <section
          className={
            "relative border-b-2 border-ink bg-paper px-0 py-20 max-md:py-12 max-sm:scroll-mt-20"
          }
          id="campaigns"
        >
          <Container>
            <div
              className={
                "mb-4 reveal text-left font-display text-4xl leading-none font-extrabold tracking-tight uppercase lg:text-5xl xl:text-6xl"
              }
            >
              Current Campaigns
            </div>
            <CampaignAccordion />
          </Container>
        </section>
      </main>
    </>
  );
}
