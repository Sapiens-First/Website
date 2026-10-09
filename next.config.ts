import type { NextConfig } from "next";
import { routes } from "./lib/site";

const nextConfig: NextConfig = {
  async redirects() {
    return routes
      .filter((path) => path !== "/")
      .map((path) => ({
        source: `${path}.html`,
        destination: path,
        permanent: true,
      }));
  },
};

export default nextConfig;
