import type { NextConfig } from "next";
import { routes, site } from "./lib/site";

const atlasHost = new URL(site.atlasUrl).hostname.replaceAll(".", "\\.");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/atlas",
        destination: site.atlasUrl,
        permanent: true,
      },
      {
        source: "/atlas.html",
        destination: site.atlasUrl,
        permanent: true,
      },
      ...routes
        .filter((path) => path !== "/" && path !== "/atlas")
        .map((path) => ({
          source: path,
          has: [{ type: "host" as const, value: atlasHost }],
          destination: `${site.url}${path}`,
          permanent: true,
        })),
      ...routes
        .filter((path) => path !== "/" && path !== "/atlas")
        .map((path) => ({
          source: `${path}.html`,
          destination: path,
          permanent: true,
        })),
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: atlasHost }],
          destination: "/atlas",
        },
      ],
    };
  },
};

export default nextConfig;
