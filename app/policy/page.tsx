import { pageMetadata } from "@/lib/site";
import { Label } from "@/components/ui/Text";
import { Container } from "@/components/layout/Container";
import PolicyToc from "@/components/policy/PolicyToc";
import { Accordion, AccordionChevron } from "@/components/sections/Faq";
import { cn } from "@/lib/cn";

export const metadata = pageMetadata({
  title: "Policy",
  description:
    "A People's Agenda for the Age of AI — Sapiens First's policy recommendations for democratic renewal, common prosperity, and a secure future.",
  path: "/policy",
});

const pillars = [
  {
    id: "democratic-renewal",
    title: "Democratic Renewal",
    lead: "AI could give governments and corporations unprecedented power to watch people, manipulate public debate, and shape policy behind closed doors. We should use this moment to strengthen democracy instead: defending civil liberties, breaking corporate control over policymaking, and giving ordinary people a direct role in decisions about our future.",
    policies: [
      {
        id: "ban-ai-enabled-mass-surveillance",
        title: "Ban AI-Enabled Mass Surveillance",
      },
      {
        id: "end-big-tech-s-influence-on-elections",
        title: "End Big Tech's Influence on Elections",
      },
      {
        id: "citizens-assemblies-for-ai-policy",
        title: "Citizens' Assemblies for AI Policy",
      },
      {
        id: "upgrade-our-democratic-process",
        title: "Upgrade Our Democratic Process",
      },
    ],
  },
  {
    id: "common-prosperity",
    title: "Common Prosperity",
    lead: "AI could create immense wealth while eliminating jobs, weakening workers' bargaining power, and concentrating ownership in a small number of companies. The gains should instead be shared broadly through dividends, public ownership, creator compensation, worker protections, and renewed investment in public institutions.",
    policies: [
      {
        id: "benefits-for-communities-affected-by-data-centers",
        title: "Benefits for Communities Affected by Data Centers",
      },
      {
        id: "enhance-our-government-institutions",
        title: "Enhance Our Government Institutions",
      },
      {
        id: "build-a-sovereign-wealth-fund-for-ai",
        title: "Build a Sovereign Wealth Fund for AI",
      },
      { id: "citizens-dividend", title: "Citizen's Dividend" },
    ],
  },
  {
    id: "a-secure-future",
    title: "A Secure Future",
    lead: "Cutting-edge AI systems could create catastrophic risks if developed through an uncontrolled race among companies and nations. Governments need independent scientific capacity, enforceable transparency, and international agreements that keep advanced AI under meaningful human control.",
    policies: [
      {
        id: "lead-a-treaty-with-china-to-stop-the-ai-arms-race",
        title: "Lead a Treaty with China to Stop the AI Arms Race",
      },
      {
        id: "mandate-that-all-frontier-ai-development-be-done-in-the-open",
        title: "Mandate That All Frontier AI Development Be Done in the Open",
      },
      {
        id: "institute-strict-liability-and-punitive-damages-for-ai-harms",
        title: "Institute Strict Liability and Punitive Damages for AI Harms",
      },
      {
        id: "build-a-powerful-and-independent-ai-safety-institute",
        title: "Build a Powerful and Independent AI Safety Institute",
      },
    ],
  },
];

const pillarColors = [
  "[--pillar-color:var(--color-coral)]",
  "[--pillar-color:var(--color-brand-blue)]",
  "[--pillar-color:var(--color-brand-purple)]",
];
const pillarClass = "mb-16 scroll-mt-[100px] last:mb-0";
const headingClass =
  "mb-3.5 border-b-[6px] border-[var(--pillar-color)] pb-4 text-left font-display text-4xl leading-none font-extrabold tracking-normal uppercase text-ink lg:text-5xl xl:text-6xl";
const bodyClass =
  "mb-4 text-left text-lg leading-normal font-medium text-ink last:mb-0 xl:text-xl [&_strong]:font-[638]";

export default function Page() {
  return (
    <>
      <div className="relative flex flex-col justify-center overflow-hidden border-b-2 border-ink bg-paper py-20 max-sm:pt-14 max-sm:pb-12">
        <Container>
          <Label tone="coral" className="mb-[26px]">
            Policy Brief — Sapiens First
          </Label>
          <h1 className="relative z-2 m-0 max-w-xl text-left text-6xl leading-[0.9] tracking-[-0.025em] lg:text-8xl">
            A People&apos;s Agenda
            <br />
            for the{" "}
            <span className="ink-underline whitespace-normal ink-underline-brand-blue">
              Age of AI.
            </span>
          </h1>
          <p className="mt-7 mr-0 mb-0 ml-0 text-xs font-bold tracking-wider uppercase">
            3 Pillars · 12 Policies · Updated July 2026
          </p>
        </Container>
      </div>
      <main>
        <section className="border-b-2 border-ink bg-white pt-20 pb-24 max-sm:pt-12 max-sm:pb-16">
          <Container>
            <div className="flex items-start gap-14 max-lg:flex-col max-lg:gap-8">
              <aside className="sticky top-24 max-h-180 w-60 shrink-0 [scrollbar-width:thin] [scrollbar-color:var(--color-line)_transparent] overflow-y-auto max-lg:static max-lg:max-h-none max-lg:w-full max-lg:overflow-visible">
                <PolicyToc pillars={pillars} />
              </aside>
              <div className="min-w-0 flex-1">
                <div className="[counter-reset:policy-num]">
                  <section
                    className={cn(
                      pillarClass,
                      "[--pillar-color:var(--color-coral)]",
                    )}
                    id="overview"
                  >
                    <div className={headingClass}>
                      <span className="text-ink">Overview</span>
                    </div>
                    <p className={bodyClass}>
                      Broadly, Sapiens First advocates for democracy,
                      prosperity, and a secure future in the age of AI.
                    </p>
                    <p className={bodyClass}>
                      Our approach to policy advocacy is:
                    </p>
                    <ul className="mb-4 flex list-disc flex-col gap-2 pl-[1.3em] [&_li]:font-body [&_li]:text-lg [&_li]:leading-normal [&_li]:text-ink [&_li]:xl:text-xl [&_li::marker]:text-coral-dark">
                      <li>
                        Run campaigns that are politically feasible and allow us
                        to mobilize a broad coalition.
                      </li>
                      <li>
                        Concurrently, do activism that expands the Overton
                        window and raises social awareness about AI-related
                        issues.
                      </li>
                    </ul>
                    <p className={bodyClass}>
                      This page represents an early draft of policies, which we
                      share in the spirit of transparency and collaboration.
                      We&apos;d like to develop policies in collaboration with
                      experts in social, economic, and tech policy. If
                      you&apos;d like to contribute, please reach out to
                      rohan@sapiensfirst.org.
                    </p>
                    <p className="mt-1 text-left font-body text-sm tracking-wider text-ink opacity-60">
                      This page is a living document, last updated in July 2026.
                    </p>
                  </section>
                  {pillars.map((pillar, index) => (
                    <section
                      className={cn(pillarClass, pillarColors[index])}
                      id={pillar.id}
                      key={pillar.id}
                    >
                      <div className={headingClass}>
                        <span className="text-ink">{pillar.title}</span>
                      </div>
                      <p className={cn(bodyClass, "mt-4 mb-8")}>
                        {pillar.lead}
                      </p>
                      {pillar.policies.map((policy) => (
                        <Accordion
                          className="scroll-mt-[100px] border-t-2 border-ink transition-colors duration-350 [counter-increment:policy-num] last:border-b-2 open:bg-paper"
                          id={policy.id}
                          key={policy.id}
                          name="policy"
                          data-policy-card
                        >
                          <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 border-l-[6px] border-[var(--pillar-color)] bg-transparent px-6 py-5 text-left focus-visible:outline-[3px] focus-visible:-outline-offset-2 focus-visible:outline-coral/40 max-sm:px-4 max-sm:py-4 [&::-webkit-details-marker]:hidden">
                            <span className="font-display text-2xl leading-tight font-extrabold tracking-normal text-ink uppercase before:mr-3 before:font-bold before:tracking-wide before:content-[counter(policy-num,decimal-leading-zero)] xl:text-3xl">
                              {policy.title}
                            </span>
                            <AccordionChevron className="size-[9px] border-r-[1.5px] border-b-[1.5px] opacity-55 group-open:opacity-100" />
                          </summary>
                          <div className="border-t border-[color-mix(in_srgb,var(--color-coral)_20%,var(--color-line))] px-6 pt-1 pb-7 max-sm:px-4 max-sm:pb-5" />
                        </Accordion>
                      ))}
                    </section>
                  ))}
                  <p className="mt-1 text-left font-body text-sm tracking-wider text-ink opacity-60">
                    Sapiens First — A People&apos;s Agenda for the Age of AI ·
                    Updated July 2026
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
