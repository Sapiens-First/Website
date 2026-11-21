import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { CampaignChrome } from "@/components/redesign/CampaignChrome";
import { SkipLink } from "@/components/redesign/SkipLink";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Sapiens First", template: "%s — Sapiens First" },
  icons: {
    icon: [
      { url: "/favicons/favicon.ico?v=20261103-flame" },
      {
        url: "/favicons/favicon-32x32.png?v=20261103-flame",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/favicons/apple-touch-icon.png?v=20261103-flame",
  },
  manifest: "/favicons/site.webmanifest",
};

export const viewport: Viewport = { themeColor: "#fffdf5" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SkipLink />
        <CampaignChrome header={<SiteHeader />} footer={<SiteFooter />}>
          <div
            id="main"
            tabIndex={-1}
            className="flex min-w-0 flex-1 flex-col focus:outline-none"
          >
            {children}
          </div>
        </CampaignChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
