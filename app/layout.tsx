import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageInteractions from "@/components/PageInteractions";
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
  metadataBase: new URL("https://sapiensfirst.org"),
  title: "Sapiens First",
  icons: {
    icon: [
      { url: "/favicons/favicon.ico" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
  manifest: "/favicons/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${bodyFont.variable} js`}
    >
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <PageInteractions />
      </body>
    </html>
  );
}
