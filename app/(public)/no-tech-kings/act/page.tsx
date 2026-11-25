import type { Metadata } from "next";
import { ActPage } from "@/components/no-tech-kings/act/ActPage";
import { actCopy } from "@/lib/no-tech-kings/act";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: actCopy.title,
    description: actCopy.description,
    path: "/no-tech-kings/act",
  }),
  twitter: {
    card: "summary_large_image",
    title: `${actCopy.title} — No Tech Kings`,
    description: actCopy.description,
  },
  icons: {
    icon: [
      { url: "/no-tech-kings/three-point-crown.svg", type: "image/svg+xml" },
    ],
  },
};

export default function Page() {
  return <ActPage />;
}
