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
