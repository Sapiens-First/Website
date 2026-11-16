import type { Metadata } from "next";
import { CampaignPage } from "@/components/no-tech-kings/CampaignPage";
import { campaignMeta } from "@/lib/no-tech-kings/copy";
import { pageMetadata } from "@/lib/site";

const socialTitle = `${campaignMeta.title} — Sapiens First`;

export const metadata: Metadata = {
  ...pageMetadata({
    title: campaignMeta.title,
    description: campaignMeta.description,
    path: "/no-tech-kings",
  }),
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: campaignMeta.description,
  },
};

export default function Page() {
  return <CampaignPage />;
}
