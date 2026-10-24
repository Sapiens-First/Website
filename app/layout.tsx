import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { site } from "@/lib/site";
import "./globals.css";

const displayFont = Barlow_Condensed({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow-condensed",
});

const bodyFont = DM_Sans({
  weight: "variable",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Sapiens First", template: "%s — Sapiens First" },
  icons: {
    icon: [
      { url: "/favicons/favicon.ico?v=20261016-dino-purple" },
      {
        url: "/favicons/favicon-32x32.png?v=20261016-dino-purple",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/favicons/apple-touch-icon.png?v=20261016-dino-purple",
  },
  manifest: "/favicons/site.webmanifest",
};

export const viewport: Viewport = { themeColor: "#fffdf5" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <SiteHeader />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
