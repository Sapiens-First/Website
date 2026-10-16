import type { Metadata } from "next";

export const site = {
  url: "https://sapiensfirst.org",
  donationUrl:
    "https://www.zeffy.com/en-US/donation-form/support-sapiens-first",
  guideDocId: "1dG4DL_Bak93Sah1LK5oSxtXQ3yQvWp15UMWFv-z9Nvs",
  signupScriptUrl:
    "https://script.google.com/macros/s/AKfycbyXZdjPHlsgHyuklLQmJ2JNFjVZorzcdhUY-wkv3h5vTJuXxtqOveAK4JnIXVdwwSU0/exec",
} as const;

export const navigation = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Careers", href: "/careers" },
      { label: "Atlas", href: "/atlas" },
      { label: "Campaigns", href: "/campaigns" },
    ],
  },
  { label: "Fellowship", href: "/fellowship" },
  { label: "Start a Circle", href: "/circle" },
] as const;

export const footerGroups = [
  {
    title: "About",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Atlas", href: "/atlas" },
      { label: "Privacy", href: "/privacy" },
      { label: "Donate", href: "/donate" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Fellowship", href: "/fellowship" },
      { label: "Start a Circle", href: "/circle" },
      { label: "Join", href: "/join" },
      { label: "Calendar", href: "/calendar" },
      {
        label: "Instagram",
        href: "https://www.instagram.com/sapiensfirst.global/",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Learn", href: "/learn" },
      { label: "Policy", href: "/policy" },
      { label: "Campaigns", href: "/campaigns" },
    ],
  },
] as const;

export const routes = [
  "/",
  "/about",
  "/atlas",
  "/fellowship",
  "/circle",
  "/campaigns",
  "/campaigns/citizens-dividend",
  "/join",
  "/calendar",
  "/donate",
  "/learn",
  "/policy",
  "/human-charter",
  "/privacy",
  "/careers",
  "/careers/builder",
] as const;

export function pageMetadata({
  title,
  description,
  path,
  ogDescription = description,
}: {
  title: string | { absolute: string };
  description: string;
  path: string;
  ogDescription?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title:
        typeof title === "string" ? `${title} — Sapiens First` : title.absolute,
      description: ogDescription,
      url: path,
      type: "website",
    },
  };
}
