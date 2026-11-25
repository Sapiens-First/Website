import { discord } from "@/lib/community";
import { reportUrl } from "@/lib/no-tech-kings/act";

/** One-line explanations of what each action does. Edit these with the labels. */
export const explanations = {
  volunteer: "Open a short form to tell us how you want to help.",
  joinCommunity: "Open a local group chat.",
} as const;

export function joinGroupDetail(city: string, platform: string) {
  return `Open the ${city} group in ${platform}.`;
}

export const campaignMeta = {
  title: "No Tech Kings",
  description:
    "We are the Human Revolution. December 14, 2026 tea party outside Anthropic in San Francisco. We are fighting the tech oligarchy and bringing Big Tech under human control.",
} as const;

export const pageCopy = {
  eyebrow: "Mass action: December 14, 2026 · Outside Anthropic, San Francisco",
  mission:
    "We are fighting the tech oligarchy and bringing Big Tech under human control.",
  parallel: {
    pastYear: "1773",
    pastTitle: "No taxation without representation.",
    pastBody:
      "On December 16, 1773, colonists in Boston boarded three ships and threw 342 chests of tea into the harbor. Parliament had kept a tax on that tea, and the colonies had no vote in Parliament.",
    presentYear: "2026",
    presentTitle: "No tech kings without our consent.",
    presentBody:
      "On December 14, 2026, No Tech Kings meets outside Anthropic in San Francisco for a tea party. We are the Human Revolution, and we are bringing Big Tech under human control.",
  },
  manifestoTitle: "Life, liberty, and the pursuit of happiness.",
  manifestoBody:
    "We are the Human Revolution. We are fighting the tech oligarchy and bringing Big Tech under human control. Humans, not dinosaurs.",
} as const;

/** Verbatim first-draft copy. Do not rewrite. */
export const redesignCopy = {
  homeTagline: "Defend humanity from the threats of artificial intelligence.",
  ntkTagline: "No Tech Kings is a campaign of Sapiens First.",
  headline: "No Tech Kings.",
  deck: "Big Tech have been taking our jobs, harming our children, and now they are threatening humanity itself.",
  punch: "Enough! It’s time the People had a say.",
  signupButton: "Sign up for the mass action →",
  signupPrivacy: "We’ll email you about ways to get involved.",
  signupSuccess:
    "You’re signed up for the mass action. We’ll email you about ways to get involved.",
  joinCommunity: "Join the community.",
  readDeclaration: "Read the declaration",
  campaignBefore: "No Tech Kings is a campaign of ",
  campaignName: "Sapiens First",
  demandLead: "We demand the California Governor:",
  truthTitle: "TELL THE TRUTH.",
  truthBody:
    "Call AI for what it is: an existential threat to humanity that threatens life, liberty, and the pursuit of happiness in our Republic.",
  actTitle: "ACT NOW.",
  actBody:
    "Declare a State of Emergency and halt the development of superintelligence until it is under human control.",
  event:
    "To launch, we’re holding a tea party outside of Anthropic on December 14th. Come drink, mingle, and declare revolution against the Tech Oligarchy!",
  hostTitle: "Host a Tea Party",
  hostBody:
    "We build power by empowering ordinary people to take action on Big Tech. This starts with tea parties: a chance to socialize, share your concerns about AI, learn about how we can make change together.",
  humans: "Humans, not dinosaurs.",
  sanFrancisco: "San Francisco",
  declarationTitle: "We believe in a pro-human future.",
  declarationDate: "December 14th",
  declarationLaunch: "On December 14th, we are launching No Tech Kings.",
  parallelKicker: "Boston, then San Francisco",
  heroCredit: "Photograph from sapiensfirst.org (homepage).",
  parkCredit:
    "Rob Bye, “Hanging Out in the Park,” London Fields, London, September 26, 2016. CC0 1.0. Wikimedia Commons: “Hanging Out in the Park (Unsplash).jpg”. Tea party and dinosaur illustrations made for No Tech Kings.",
  declarationCredit:
    "Engrossed Declaration of Independence, August 2, 1776. U.S. National Archives and Records Administration, NAID 1419123. Wikimedia Commons: “Engrossed Declaration of Independence, front.jpg”. Public domain.",
  currierCredit:
    "Nathaniel Currier, The Destruction of Tea at Boston Harbor, 1846. Public domain. Wikimedia Commons: “Boston Tea Party Currier colored.jpg”.",
  currierAlt:
    "The Destruction of Tea at Boston Harbor, an 1846 lithograph by Nathaniel Currier, showing colonists throwing tea chests from ships into the water.",
} as const;

/** Copy for the sunrise page (/no-tech-kings). */
export const ntkCopy = {
  heroDate: "December 14 at 11 AM PT",
  lede: "We demand that Governor Newsom take a stand on Big Tech.",
  heroNote: "Details coming soon.",
  heroMore: "More ways to help",
  demandTitle: "We demand the California Governor:",
  demands: [
    {
      title: "Tell the truth.",
      body: "Declare AI crisis and convene a special session.",
    },
    {
      title: "Act now.",
      body: "Pause the creation of frontier intelligence and put humans back in control.",
    },
  ],
  demandCta: "Email Governor Newsom",
  involvedTitle: "Get Involved",
  involvedLede: "Find your people, show up, and lend a hand.",
  involved: {
    map: {
      label: "Map",
      title: "Find a local group",
      body: "Join a group near you, or put your city on the map.",
      windowTitle: "Local groups",
      iframeTitle: "Map of local AI safety groups",
      load: "Explore the map",
      loadNote: "Loads an interactive map from Padlet.",
      open: "Open full map",
    },
    calendar: {
      label: "Calendar",
      title: "Come to an event",
      body: "Meetings, trainings, and actions.",
      windowTitle: "Upcoming events",
      iframeTitle: "Sapiens First public events calendar",
      note: "Times in Pacific",
      add: "Add to Google Calendar",
      full: "Full calendar",
    },
    volunteer: {
      label: "Volunteer",
      title: "Lend a hand",
      body: "Tell us a little about you and how you'd like to help.",
      windowTitle: "Volunteer",
      iframeTitle: "No Tech Kings get-involved form",
      open: "Open in a new tab",
    },
  },
  stayTitle: "Not on Discord?",
  stayBody: "Get updates by email instead.",
  startHere: {
    label: "Start here · Free",
    title: "Join the No Tech Kings Discord",
    body: "Meet the people behind the campaign, find your city, and pick up a first task. It takes a minute.",
  },
  quote: "It always seems impossible until it is done.",
  quoteBy: "Nelson Mandela",
  signupButton: "Stay in touch",
  share: "Share this page",
  shareCopied: "Link copied",
} as const;

export type FaqLink = { label: string; href: string; external?: boolean };
export type Faq = {
  question: string;
  answer: readonly string[];
  links?: readonly FaqLink[];
};

/**
 * No Tech Kings FAQ. Facts about the report and the special session match
 * lib/no-tech-kings/act.ts (the Email Newsom page); keep the two in step.
 */
export const ntkFaq = {
  title: "Questions",
  lede: "The short version: we want the people of California, not a few tech companies, to decide how far AI goes.",
  items: [
    {
      question: "What is No Tech Kings?",
      answer: [
        "A campaign of Sapiens First. We’re everyday people organizing to bring Big Tech under human control, starting in California, where most of the companies building the most powerful AI are based.",
      ],
    },
    {
      question: "What’s happening on December 14?",
      answer: [
        "Our launch: a tea party outside Anthropic in San Francisco, starting at 11 AM PT. Come drink tea, meet people who share your worries about AI, and declare that the future belongs to people, not tech kings.",
        "The latest details go out in the Discord and on the calendar.",
      ],
      links: [
        { label: "Join the Discord", href: discord.href, external: true },
        { label: "See the calendar", href: "/calendar" },
      ],
    },
    {
      question: "Why outside Anthropic?",
      answer: [
        "Anthropic is one of a handful of companies racing to build AI more capable than people, and it’s right here in San Francisco. In 2023 its CEO, along with the heads of OpenAI and Google DeepMind, signed a statement that reducing the risk of extinction from AI should be a global priority.",
        "We take them at their word. Risks that serious shouldn’t be managed by the companies taking them. They should be governed by the public.",
      ],
    },
    {
      question: "What are we asking Governor Newsom to do?",
      answer: [
        "Two things. Tell the truth: declare an AI crisis and call the Legislature into a special session. Act now: pass the AI safety recommendations his office received on November 18th, and cap automated AI research and development right away.",
      ],
      links: [{ label: "Email Governor Newsom", href: "/no-tech-kings/act" }],
    },
    {
      question: "What is a special session?",
      answer: [
        "Under the California Constitution, the Governor can call the Legislature back to work on a specific urgent issue outside its regular schedule. It lets lawmakers start now instead of waiting months for the next regular session.",
        "Timing matters: Governor Newsom leaves office in January 2027. A special session is how he can act on these recommendations before then.",
      ],
    },
    {
      question: "What would the recommendations do?",
      answer: [
        "The report, “AI Safety in 2026 and Beyond,” would strengthen the safety plans AI labs must follow, bring in independent auditors to check the labs actually follow them, require a way to shut down dangerous models, and allow a cap on the computing power used for automated AI research.",
        "The report stops short of putting that cap in place now. We think it should start immediately: by the time the danger is obvious, it may be too late to act.",
      ],
      links: [
        {
          label: "Read the report (PDF)",
          href: reportUrl,
          external: true,
        },
      ],
    },
    {
      question: "What is “automated AI research,” and why cap it?",
      answer: [
        "It’s AI doing more and more of the work of building the next, stronger AI, until the loop runs without people in it. Researchers call this recursive self-improvement.",
        "Once that loop speeds up, it can move faster than any government can respond. A cap keeps people in the loop while safeguards catch up.",
      ],
    },
    {
      question: "Are you against technology?",
      answer: [
        "No. We’re for people. Medicine, aviation and nuclear power all have to prove they’re safe before they reach the public. We’re asking for the same common sense for the most powerful technology ever built, and for the public, not a few billionaires, to decide how far it goes.",
      ],
    },
    {
      question: "I don’t live in California. Can I still help?",
      answer: [
        "Yes. What happens in California sets the pace for everyone, and anyone can write to Governor Newsom. Join the Discord, find or start a group near you on the map, or tell us how you’d like to help.",
      ],
      links: [
        { label: "Join the Discord", href: discord.href, external: true },
        { label: "Find a local group", href: "#involved" },
      ],
    },
  ],
} as const satisfies {
  title: string;
  lede: string;
  items: readonly Faq[];
};
