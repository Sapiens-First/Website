import { campaignConfig } from "@/lib/no-tech-kings/config";

export type NavLink = { label: string; href: string; external?: boolean };

/** Footer link groups, shared by the site footer and the No Tech Kings footer. */
export const footerGroups: readonly {
  title: string;
  links: readonly NavLink[];
}[] = [
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Human Charter", href: "/human-charter" },
      { label: "Atlas", href: "/atlas" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      {
        label: "Host a Tea Party ↗",
        href: campaignConfig.hostForm,
        external: true,
      },
      { label: "Membership", href: "/join" },
      { label: "Calendar", href: "/calendar" },
      { label: "Donate", href: "/donate" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "No Tech Kings", href: "/no-tech-kings" },
      { label: "Learn", href: "/learn" },
      { label: "Policy", href: "/policy" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/sapiensfirst.global/",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/sapiens-first/",
  },
] as const;
