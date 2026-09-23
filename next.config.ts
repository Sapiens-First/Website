import type { NextConfig } from "next";

const legacyPages = [
  "/about",
  "/campaigns",
  "/careers",
  "/careers/builder",
  "/circle",
  "/donate",
  "/events",
  "/fellowship",
  "/human-charter",
  "/join",
  "/learn",
  "/learn-01",
  "/membership",
  "/policy",
  "/privacy",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      {
        source: "/archive",
        destination: "/archive/index.html",
        permanent: false,
      },
      { source: "/act", destination: "/join", permanent: true },
      { source: "/guide", destination: "/learn", permanent: true },
      {
        source: "/fellowship-app",
        destination: "/fellowship#signup",
        permanent: true,
      },
      { source: "/start-a-circle", destination: "/circle", permanent: true },
      { source: "/organize", destination: "/circle", permanent: true },
      {
        source: "/about/approach",
        destination: "/about#strategy",
        permanent: true,
      },
      {
        source: "/about/vision",
        destination: "/about#vision",
        permanent: true,
      },
      { source: "/about/careers", destination: "/careers", permanent: true },
      {
        source: "/advise",
        destination:
          "https://docs.google.com/document/d/1pxrOr9pyE72UF2UM9tek9p1rYK984AHRtIDtzIi3XkY/edit?tab=t.0",
        permanent: false,
      },
      {
        source: "/strategy",
        destination:
          "https://docs.google.com/document/d/1sBlALbzX4fwvEJcFtc4OSpAnceozyV3_chMaFNUIhJg/edit?usp=sharing",
        permanent: false,
      },
      ...legacyPages.map((path) => ({
        source: `${path}.html`,
        destination: path,
        permanent: true,
      })),
      { source: "/act.html", destination: "/join", permanent: true },
      { source: "/guide.html", destination: "/learn", permanent: true },
      {
        source: "/fellowship-app.html",
        destination: "/fellowship#signup",
        permanent: true,
      },
      {
        source: "/start-a-circle.html",
        destination: "/circle",
        permanent: true,
      },
      {
        source: "/about/approach.html",
        destination: "/about#strategy",
        permanent: true,
      },
      {
        source: "/about/vision.html",
        destination: "/about#vision",
        permanent: true,
      },
      {
        source: "/about/careers.html",
        destination: "/careers",
        permanent: true,
      },
      {
        source: "/advise.html",
        destination:
          "https://docs.google.com/document/d/1pxrOr9pyE72UF2UM9tek9p1rYK984AHRtIDtzIi3XkY/edit?tab=t.0",
        permanent: false,
      },
      {
        source: "/strategy.html",
        destination:
          "https://docs.google.com/document/d/1sBlALbzX4fwvEJcFtc4OSpAnceozyV3_chMaFNUIhJg/edit?usp=sharing",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
