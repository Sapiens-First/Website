import type { NextConfig } from "next";
import { site } from "./lib/site";

const atlasHost = new URL(site.atlasUrl).hostname.replaceAll(".", "\\.");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...["/atlas", "/atlas.html"].map((source) => ({
        source,
        destination: site.atlasUrl,
        permanent: true,
      })),
      {
        // Keep other pages (including member sign-in) on the main origin.
        // Atlas still loads its scripts, images and same-origin APIs locally.
        source:
          "/:path((?!_next(?:/|$)|api(?:/|$)|assets(?:/|$)|favicons(?:/|$)).+)",
        has: [{ type: "host", value: atlasHost }],
        destination: `${site.url}/:path`,
        permanent: true,
      },
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
