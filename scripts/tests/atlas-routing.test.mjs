import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  unstable_getResponseFromNextConfig,
  getRedirectUrl,
  getRewrittenUrl,
} from "next/experimental/testing/server.js";
import { site, siteHref } from "../../lib/site.ts";

const require = createRequire(import.meta.url);
const loadConfig = require("next/dist/server/config").default;
const nextConfig = await loadConfig("phase-production-build", process.cwd());
const route = (url) => unstable_getResponseFromNextConfig({ url, nextConfig });

test("the Atlas root rewrites to the explorer without a public redirect", async () => {
  const response = await route(`${site.atlasUrl}?view=people`);
  assert.equal(response.status, 200);
  assert.equal(getRedirectUrl(response), null);
  assert.equal(
    getRewrittenUrl(response),
    "https://atlas.sapiensfirst.org/atlas?view=people",
  );
});

test("legacy URLs permanently redirect on both domains and keep query values", async () => {
  for (const origin of [site.url, new URL(site.atlasUrl).origin]) {
    for (const path of ["/atlas", "/atlas.html"]) {
      const response = await route(
        `${origin}${path}?view=people&q=lead%20link`,
      );
      assert.equal(response.status, 308);
      const target = new URL(getRedirectUrl(response));
      assert.equal(target.origin, new URL(site.atlasUrl).origin);
      assert.equal(target.pathname, "/");
      assert.equal(target.searchParams.get("view"), "people");
      assert.equal(target.searchParams.get("q"), "lead link");
      // No fragment in Location: browsers inherit the original record fragment.
      assert.equal(target.hash, "");
    }
  }
});

test("main-site pages and authentication return to the main origin", async () => {
  for (const path of [
    "/about",
    "/campaigns/freeze-ai",
    "/join",
    "/auth/callback",
    "/onboarding",
    "/dashboard/profile",
    "/circle",
    "/fellowship",
  ]) {
    const response = await route(`${new URL(site.atlasUrl).origin}${path}?a=1`);
    assert.equal(response.status, 308);
    assert.equal(getRedirectUrl(response), `${site.url}${path}?a=1`);
    const mainResponse = await route(`${site.url}${path}?a=1`);
    assert.equal(getRedirectUrl(mainResponse), null);
    assert.equal(getRewrittenUrl(mainResponse), null);
  }
});

test("Atlas scripts, images and same-origin APIs are not redirected", async () => {
  for (const path of [
    "/_next/static/chunks/app.js",
    "/_next/image?url=%2Fassets%2Fbrand%2Fdinosaur-purple.png&w=96&q=75",
    "/assets/brand/dinosaur-purple.png",
    "/favicons/favicon.ico",
    "/api/campaign-signatures",
  ]) {
    const response = await route(`${new URL(site.atlasUrl).origin}${path}`);
    assert.equal(getRedirectUrl(response), null);
    assert.equal(getRewrittenUrl(response), null);
  }
});

test("main, preview and similarly named hosts keep their original root", async () => {
  for (const origin of [
    site.url,
    "http://localhost:3000",
    "https://website-preview.vercel.app",
    "https://atlasXsapiensfirstXorg",
    "https://atlas.sapiensfirst.org.example.com",
  ]) {
    const response = await route(origin);
    assert.equal(getRedirectUrl(response), null);
    assert.equal(getRewrittenUrl(response), null);
  }
});

test("shared navigation uses the canonical Atlas and main-site addresses", () => {
  assert.equal(siteHref("/atlas"), site.atlasUrl);
  assert.equal(siteHref("/"), `${site.url}/`);
  assert.equal(siteHref("/join"), `${site.url}/join`);
  assert.equal(
    siteHref("/campaigns/freeze-ai"),
    `${site.url}/campaigns/freeze-ai`,
  );
});
