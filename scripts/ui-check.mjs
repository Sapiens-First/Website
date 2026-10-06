import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const stage = process.argv[2] ?? "current";
const routes = process.argv.slice(3);
const paths = routes.length
  ? routes
  : [
      "/",
      "/privacy",
      "/careers",
      "/careers/builder",
      "/membership",
      "/join",
      "/events",
      "/learn",
      "/campaigns",
      "/policy",
      "/human-charter",
      "/donate",
      "/about",
      "/fellowship",
      "/circle",
      "/atlas",
    ];
const browser = await chromium.launch();
const report = [];
await mkdir(`design-tests/${stage}`, { recursive: true });
try {
  for (const path of paths) {
    for (const [name, width, height] of [
      ["mobile", 390, 844],
      ["tablet", 820, 1180],
      ["desktop", 1440, 1000],
    ]) {
      const page = await browser.newPage({
        viewport: { width, height },
        reducedMotion: "reduce",
      });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const response = await page.goto(
        `http://localhost:${process.env.UI_PORT ?? "3100"}${path}`,
        { waitUntil: "networkidle" },
      );
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (
          let y = 0;
          y < document.body.scrollHeight;
          y += window.innerHeight
        ) {
          window.scrollTo(0, y);
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(250);
      const metrics = await page.evaluate(() => ({
        title: document.title,
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        height: document.body.scrollHeight,
        headings: Array.from(document.querySelectorAll("main h1")).map(
          (el) => el.textContent,
        ),
        brokenImages: Array.from(document.images)
          .filter((img) => !img.complete || img.naturalWidth === 0)
          .map((img) => img.src),
      }));
      await page.screenshot({
        path: `design-tests/${stage}/${path.replaceAll("/", "_") || "home"}-${name}.png`,
        fullPage: true,
        animations: "disabled",
      });
      const item = {
        path,
        viewport: name,
        status: response.status(),
        ...metrics,
        errors,
      };
      report.push(item);
      console.log(JSON.stringify(item));
      await page.close();
    }
  }
} finally {
  await browser.close();
  await writeFile(
    `design-tests/${stage}/report.json`,
    JSON.stringify(report, null, 2),
  );
}
if (
  report.some(
    (item) =>
      item.status !== 200 ||
      item.errors.length ||
      item.brokenImages.length ||
      item.scrollWidth > item.width + 1,
  )
)
  process.exitCode = 1;
