/** Campaign facts and presentation copy share one source across both views. */
export const campaignContent = {
  surveillance: {
    id: "stop-1984",
    title: "Stop 1984",
    objective: "Ban AI-enabled mass surveillance.",
    description:
      "Mass surveillance is a threat to our civil liberties and free speech. AI-enabled surveillance could mean unprecedented concentration of power. We believe that a variety of coalition groups and civil society organizations could support a ban on AI-enabled mass surveillance.",
    metrics: [
      "Get individuals and organizations to sign onto our open letter against AI-enabled mass surveillance (forthcoming)",
      "Get city councils to do resolutions against AI-enabled mass surveillance",
    ],
    resources: "Resources: forthcoming",
    teaser: {
      id: "surveillance",
      title: "Stop 1984.",
      description: "End AI-enabled mass surveillance.",
    },
  },
  robots: {
    id: "no-killer-robots",
    title: "No Killer Robots",
    objective: "Regulate autonomous weapons in the military.",
    description:
      "Militaries around the world are racing to deploy autonomous weapons that can select and kill targets without human oversight. However, most people are unaware this is already happening, or don't grasp how quickly it's becoming normalized. Increasing awareness of this threat expands the Overton window, and builds political will for regulation.",
    metrics: [
      "Get mainstream media to write positively about activism against autonomous weapons",
      "Increase awareness through social media",
    ],
    resources: "Resources: forthcoming",
    teaser: {
      id: "robots",
      title: "No Killer Robots.",
      description: "Regulate deadly, autonomous weapons.",
    },
  },
  freeze: {
    id: "save-our-future",
    title: "AI Freeze",
    objective:
      "Negotiate a coordinated slowdown on the development of artificial intelligence.",
    description:
      "Experts in artificial intelligence, including those at frontier AI labs, have warned for years about the dangers of superintelligence. However, most people are unaware of these risks, or are not acting appropriately given their severity. Increasing awareness of existential risk expands the Overton window, and builds political will for AI safety.",
    metrics: [
      "Get mainstream media to write positively about activism against existential risk posed by AI",
      "Increase awareness through social media",
    ],
    resources: "Resources: forthcoming",
    teaser: {
      id: "freeze",
      title: "Freeze AI.",
      description:
        "Call on the US to slow the development of frontier intelligence.",
    },
  },
} as const;
export const campaignDetails = [
  campaignContent.surveillance,
  campaignContent.robots,
  campaignContent.freeze,
] as const;
export const campaignTeasers = [
  campaignContent.freeze.teaser,
  campaignContent.surveillance.teaser,
  campaignContent.robots.teaser,
] as const;
