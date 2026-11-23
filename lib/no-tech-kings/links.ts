/**
 * Campaign URLs. Add a city by appending to communityGroups.
 * Links with external: true open in a new tab.
 *
 * The mass-action signup is not a URL. It uses the homepage supporter form
 * (saveInterest with topic "membership"), which writes public.member_interests.
 */

export type CampaignLink = {
  href: string;
  external: boolean;
};

export type CommunityGroup = {
  city: string;
  platform: string;
  href: string;
  external: boolean;
};

export const links = {
  hostTeaParty: {
    href: "https://docs.google.com/forms/d/e/1FAIpQLSfQdMLDf8RlSK69MELH9Vq61YEHuzmzdovLWWkxDtjWyLiGWg/viewform",
    external: true,
  },
  sapiensFirst: {
    href: "https://sapiensfirst.org",
    external: true,
  },
  /** Padlet map of local AI safety groups. embedUrl is padlet.com/embed/<board id>. */
  groupsMap: {
    href: "https://padlet.com/benaisafety/ai-safety-groups-s025maulwsvpdofp4are",
    embedUrl: "https://padlet.com/embed/s025maulwsvpdofp4are",
    external: true,
  },
  communityGroups: [
    {
      city: "San Francisco",
      platform: "Signal",
      href: "https://signal.group/#CjQKIOrofW8j8QU_sAQ2AgrDwH78vUOq2WI2Xhh3t4R_qU87EhCerjEOUUL1NKbzetKqfd73",
      external: true,
    },
  ],
} as const satisfies {
  hostTeaParty: CampaignLink;
  sapiensFirst: CampaignLink;
  groupsMap: CampaignLink & { embedUrl: string };
  communityGroups: readonly CommunityGroup[];
};
