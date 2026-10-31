export const campaigns = {
  "freeze-ai": {
    title: "Freeze AI",
    headline: "Our future belongs to us.",
    description:
      "Freeze the race to build ever more powerful AI. Put people in control.",
    demand:
      "Negotiate an international AI treaty that freezes the race toward more powerful frontier systems until enforceable safety limits and public oversight are in place.",
    intro:
      "A handful of companies should not get to gamble with everyone’s future. We need governments to act together, set enforceable limits and give the public a real say in what comes next.",
    points: [
      {
        title: "Set enforceable limits",
        text: "Agree international limits on the computing power used to train frontier AI, with a process to adjust those limits as technology changes. A promise from a company is not enough.",
      },
      {
        title: "Put safety before the race",
        text: "Build a shared international AI safety research effort and preserve access to systems kept within agreed safe limits. Freezing the frontier race does not mean banning every useful AI tool.",
      },
      {
        title: "Make the rules count",
        text: "Create independent international compliance oversight. Governments must be able to check that the rules are followed, rather than relying on companies to police themselves.",
      },
    ],
    letter: [
      "To our elected representatives and governments:",
      "Our future should be decided by the people, not by a race between a few technology companies.",
      "More powerful AI could bring benefits, but it also creates serious risks through misuse, concentrated power and loss of human control. The public should not have to accept those risks just because companies are competing to move first.",
      "We call on governments to negotiate an international AI treaty that freezes the race toward more powerful frontier systems until enforceable safety limits and public oversight are in place.",
      "The agreement should set internationally enforced limits on frontier training compute, create a shared AI safety research effort, preserve access to systems within agreed safe limits and establish independent compliance oversight.",
      "Give the public a meaningful role in shaping these rules. Do not leave decisions about everyone’s future to the companies building these systems.",
      "Freeze the frontier race. Put people first.",
    ],
  },
  "stop-1984": {
    title: "Stop 1984",
    headline: "Our lives are not a surveillance feed.",
    description:
      "Ban AI-enabled mass surveillance. Protect our freedom to live, speak and organize.",
    demand:
      "Ban AI-enabled mass surveillance and protect civil liberties, free speech and the right to organize.",
    intro:
      "AI can make it easier for governments and companies to track people at scale. A free society needs limits on surveillance and public power to enforce them.",
    points: [
      {
        title: "Defend civil liberties",
        text: "People should be able to speak, meet and organize without being watched at scale.",
      },
      {
        title: "Build local power",
        text: "Bring the demand to city councils and build support for resolutions against AI-enabled mass surveillance.",
      },
      {
        title: "Make a public demand",
        text: "Bring people and civil society groups together around a ban on AI-enabled mass surveillance.",
      },
    ],
    letter: [
      "To our elected representatives:",
      "People should be free to live, speak and organize without being subjected to AI-enabled mass surveillance.",
      "Tools that track people at scale concentrate power and threaten civil liberties. The public deserves protection, rather than a future in which constant surveillance is treated as normal.",
      "We call on you to ban AI-enabled mass surveillance, defend free speech and protect the right to organize. Local governments can help build that commitment through public resolutions and action.",
      "Put our freedoms first. Stop 1984.",
    ],
  },
  "no-killer-robots": {
    title: "No Killer Robots",
    headline: "Human lives. Human responsibility.",
    description:
      "Regulate deadly autonomous weapons. Decisions about human lives must remain accountable.",
    demand:
      "Regulate autonomous weapons and require meaningful human oversight and accountability for the use of lethal force.",
    intro:
      "The use of lethal force must come with human responsibility. We are building public pressure for regulation of autonomous weapons.",
    points: [
      {
        title: "Demand oversight",
        text: "Decisions about lethal force must be subject to meaningful human oversight and accountability.",
      },
      {
        title: "Build public awareness",
        text: "Make the risks of autonomous weapons part of public debate, rather than a decision left to military and technology institutions alone.",
      },
      {
        title: "Win regulation",
        text: "Build political will for rules that protect human life as military technology changes.",
      },
    ],
    letter: [
      "To our elected representatives and governments:",
      "Human lives must not be reduced to automated targeting decisions without meaningful human oversight.",
      "We call on you to regulate autonomous weapons and require human oversight and accountability for the use of lethal force.",
      "Bring these decisions into public debate. Set rules that protect human life and hold people and institutions responsible for how weapons are used.",
      "Build political will for regulation. No killer robots.",
    ],
  },
  "citizens-dividend": {
    title: "Citizens’ Dividend",
    demand:
      "Publish a costed Citizens’ Dividend bill: a regular, unconditional cash payment funded by a fair public share of AI-driven gains, with funding, eligibility, delivery and its relationship to existing support made clear.",
  },
} as const;

export type CampaignId = keyof typeof campaigns;
