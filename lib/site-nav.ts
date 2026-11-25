import { campaignConfig } from "@/lib/no-tech-kings/config";
import { site } from "@/lib/site";

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
      { label: "No Tech Kings", href: "/no-tech-kings" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      {
        label: "Volunteer ↗",
        href: campaignConfig.volunteerForm,
        external: true,
      },
      // Membership is hidden for now; see also the header "Join" button.
      // { label: "Membership", href: "/join" },
      { label: "Calendar", href: "/calendar" },
      { label: "Local Groups", href: "/groups" },
      { label: "Donate", href: "/donate" },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        label: "Learn ↗",
        href: site.docsUrl,
        external: true,
      },
      { label: "Atlas", href: "/atlas" },
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
