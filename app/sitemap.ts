import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const paths = [
  "/",
  "/about",
  "/fellowship",
  "/circle",
  "/campaigns",
  "/join",
  "/donate",
  "/events",
  "/learn",
  "/policy",
  "/human-charter",
  "/privacy",
  "/membership",
  "/careers",
  "/careers/builder",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: `${site.url}${path}` }));
}
