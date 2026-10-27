import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = [
  "/",
  "/about",
  "/human-charter",
  "/journey",
  "/atlas",
  "/fellowship",
  "/circle",
  "/campaigns",
  "/campaigns/citizens-dividend",
  "/campaigns/freeze-ai",
  "/campaigns/stop-1984",
  "/campaigns/no-killer-robots",
  "/join",
  "/calendar",
  "/donate",
  "/learn",
  "/policy",
  "/privacy",
  "/careers",
  "/careers/builder",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({ url: `${site.url}${path}` }));
}
