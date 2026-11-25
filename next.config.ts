import type { NextConfig } from "next";
import { site } from "./lib/site";

const nextConfig: NextConfig = {
  // Learning resources now live on the docs site. Temporary (307) so the
  // old /learn guide page can be brought back without cached redirects.
  async redirects() {
    return [{ source: "/learn", destination: site.docsUrl, permanent: false }];
  },
  async headers() {
    // Every page: no MIME sniffing, no framing by other sites, origin-only
    // referrers, and no access to device APIs the site never uses.
    const site = {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    };
    // Member pages can't be framed at all. Listed after `site`, so these win.
    const members = [
      "/join",
      "/auth/:path*",
      "/onboarding/:path*",
      "/agreement/:path*",
      "/membership/:path*",
      "/dashboard/:path*",
    ].map((source) => ({
      source,
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
      ],
    }));
    return [site, ...members];
  },
};

export default nextConfig;
