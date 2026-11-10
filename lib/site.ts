import type { Metadata } from "next";

export const site = {
  url: "https://sapiensfirst.org",
  donationUrl:
    "https://www.zeffy.com/en-US/donation-form/support-sapiens-first",
  guideDocId: "1dG4DL_Bak93Sah1LK5oSxtXQ3yQvWp15UMWFv-z9Nvs",
} as const;

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
