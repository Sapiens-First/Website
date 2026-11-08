import type { NextConfig } from "next";
import { site } from "./lib/site";

const atlasHost = new URL(site.atlasUrl).hostname.replaceAll(".", "\\.");

const nextConfig: NextConfig = {
  async headers() {
    return [
      "/join",
      "/auth/:path*",
      "/onboarding/:path*",
      "/membership/:path*",
      "/dashboard/:path*",
    ].map((source) => ({
      source,
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    }));
  },
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
