import type { NextConfig } from "next";

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
};

export default nextConfig;
