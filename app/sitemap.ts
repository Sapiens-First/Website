import type { MetadataRoute } from "next";
import { routes, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({ url: `${site.url}${path}` }));
}
