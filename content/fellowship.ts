export type FellowshipRole = {
  title: string;
  description: string;
  activities: string[];
  note?: string;
};

export const fellowshipRoles: FellowshipRole[] = [
  {
    title: "Community Organizing",
    description:
      "You enjoy talking to new people, are a great listener, and care deeply about community. You're great at making people feel empowered, with the goal of them joining the movement.",
    activities: [
      "Designing events for people",
      "Door-to-door conversations with people",
      "Creating curriculum and documentation for volunteers to train up",
    ],
    note: "Community Fellows help grow and support Circles forming across the country.",
  },
  {
    title: "Campaign Automations",
    description:
      "You enjoy building scalable systems and automations to empower communities. You're a fast learner and excellent at incorporating AI to assist you in the process, with the goal of streamlining our supporter and membership onboarding and retention processes.",
    activities: [
      "Rigging up an open-source CRM to our membership sign-up page",
      "Creating an email automation protocol for sign-ups, event attendees, and supporters",
      "Automating member onboarding on Discord",
    ],
  },
  {
    title: "Digital Marketing",
    description:
      "You enjoy communicating big ideas clearly and learning what inspires people to take action. You will test messaging and branding, with the goal of expanding our digital reach.",
    activities: [
      "Refining our brand marketing strategy",
      "Designing and executing our digital marketing strategy",
      "Designing materials like business cards, banners, and lawn signs",
    ],
  },
  {
    title: "Policy & Coalitions",
    description:
      "You enjoy diving deep into policy and AI safety. You're good at putting yourself in other people's shoes. You enjoy building relationships, with the goal of building coalitional support for Sapiens First's campaigns nationally.",
    activities: [
      "Crafting achievable campaign objectives",
      "Collaborating with other movements like YDSA and the Sunrise Movement",
      "Reaching out and building relationships with mainstream orgs like the ACLU",
    ],
  },
];
