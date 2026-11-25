import { Archivo_Black, Inter } from "next/font/google";

/** No Tech Kings type: Archivo Black for headlines, Inter for everything else. */
export const ntkDisplay = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--ntk-display",
  display: "swap",
});

export const ntkSans = Inter({
  subsets: ["latin"],
  variable: "--ntk-sans",
  display: "swap",
});

export const ntkFontVars = `${ntkDisplay.variable} ${ntkSans.variable}`;
