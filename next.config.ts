import type { NextConfig } from "next";
import { redirectAliases, routes } from "./lib/site";

const isExternal = (url: string) => url.startsWith("http");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...routes
        .filter((path) => path !== "/")
        .map((path) => ({
          source: `${path}.html`,
          destination: path,
          permanent: true,
        })),
      ...Object.entries(redirectAliases).flatMap(([path, destination]) =>
        [path, `${path}.html`].map((source) => ({
          source,
          destination,
          permanent: !isExternal(destination),
        })),
      ),
    ];
  },
};

export default nextConfig;
