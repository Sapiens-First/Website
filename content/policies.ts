export type Policy = { id: string; title: string };
export type PolicyPillar = {
  id: string;
  title: string;
  lead: string;
  policies: Policy[];
};

export const policyPillars: PolicyPillar[] = [
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
