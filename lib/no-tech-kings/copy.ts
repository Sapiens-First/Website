/** One-line explanations of what each action does. Edit these with the labels. */
export const explanations = {
  hostTeaParty: "Open a short form to host a tea party where you are.",
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
  heroCta: "Join the community",
  heroNote: "Details coming soon.",
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
  involvedTitle: "Get Involved",
  involvedTabs: {
    groups: {
      tab: "Start or join a local group",
      title: "Find your people.",
      body: "Find a group near you on the map and join it. No group in your city yet? Add one and start it.",
      mapTitle: "Map of local AI safety groups",
    },
    host: {
      tab: "Host a tea party",
      title: "How to host a tea party.",
      body: "Tea parties are how we build power: a chance to socialize, share concerns about AI, and plan what to do together.",
      steps: [
        "Choose a venue and lock it down.",
        "Invite your friends! Or post in local group chats, Craigslist, or Nextdoor.",
        "Create a presentation with lots of group discussion. We can help you with this!",
        "Near the end of the session, invite people to join your community group.",
        "Follow up one-on-one. Invite people to weekly socials, or ask them to throw their own tea party.",
      ],
      cta: "Get your tea party on the map",
    },
    calendar: {
      tab: "Calendar",
      title: "Upcoming events.",
      body: "Meetings, trainings, and actions.",
    },
  },
  quote: "It always seems impossible until it is done.",
  quoteBy: "Nelson Mandela",
  signupButton: "Stay in touch",
  share: "Share this page",
  shareCopied: "Link copied",
} as const;
