import type { NextConfig } from "next";
import { site } from "./lib/site";

const nextConfig: NextConfig = {
  // Learning resources now live on the docs site. Temporary (307) so the
  // old /learn guide page can be brought back without cached redirects.
  async redirects() {
    return [{ source: "/learn", destination: site.docsUrl, permanent: false }];
  },
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
};

export default nextConfig;
