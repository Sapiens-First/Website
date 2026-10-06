import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
  "/about",
  "/atlas",
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
  "/membership",
  "/policy",
  "/privacy",
];

async function expectNoOverflow(page: Page) {
  const size = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(size.scrollWidth).toBeLessThanOrEqual(size.width + 1);
}

for (const route of routes) {
  test(`${route} renders without layout or hydration errors`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("header.site-header")).toBeVisible();
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
        scrollTo(0, y);
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      scrollTo(0, 0);
    });
    await expectNoOverflow(page);
    const broken = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter(
            (image) =>
              !(image as HTMLImageElement).complete ||
              (image as HTMLImageElement).naturalWidth === 0,
          )
          .map((image) => image.getAttribute("src")),
      );
    expect(broken).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath("page.png"),
      fullPage: true,
      animations: "disabled",
    });
  });
}

test("header navigation and native Join dialog support the keyboard", async ({
  page,
}) => {
  await page.goto("/privacy");
  await page.locator(".nav-dropdown-toggle").click();
  await expect(page.locator(".nav-dropdown-toggle")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await page
    .locator(".nav-dropdown-links")
    .getByRole("link", { name: "Careers", exact: true })
    .click();
  await expect(page).toHaveURL(/\/careers$/);
  await page
    .locator("footer")
    .getByRole("link", { name: "Join", exact: true })
    .click();
  await expect(page.locator("dialog.join-dialog")).toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean(document.activeElement?.closest("dialog")))).toBe(true);
  await page.keyboard.press("Tab");
  await expect(page.locator("dialog input[type=email]")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog.join-dialog")).not.toBeVisible();
  await page.locator("header .nav-cta.join").click();
  await expect(page).toHaveURL(/\/join$/);
});

test("signup variants submit their interest and show a focusable success state", async ({
  page,
}) => {
  for (const [route, interest] of [
    ["/join", "membership"],
    ["/fellowship", "fellowship"],
    ["/circle", "start-a-circle"],
  ]) {
    let payload: unknown;
    await page.route("https://script.google.com/**", async (request) => {
      payload = request.request().postDataJSON();
      await request.fulfill({ status: 200, body: "ok" });
    });
    await page.goto(route);
    const form = page.locator("main form").first();
    await form.locator("input").fill("ui-check@example.invalid");
    await form.getByRole("button").click();
    await expect(page.locator("main .signup-done").first()).toBeVisible();
    await expect(page.locator("main .signup-done").first()).toBeFocused();
    expect(payload).toEqual({ email: "ui-check@example.invalid", interest });
    await page.unroute("https://script.google.com/**");
  }
});

test("shared FAQs retain single-open behavior, readable content, and motion handling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const [route, count] of [
    ["/circle", 7],
    ["/fellowship", 4],
  ] as const) {
    await page.goto(route);
    const items = page.locator(".faq-item");
    await expect(items).toHaveCount(count);
    await items.nth(1).locator("summary").click();
    await expect(items.nth(1).locator("summary")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect
      .poll(() =>
        items.evaluateAll(
          (elements) =>
            elements.filter((el) => (el as HTMLDetailsElement).open).length,
        ),
      )
      .toBe(1);
    await expect(items.nth(1).locator(".faq-body")).toBeVisible();
    expect(
      await items
        .nth(1)
        .locator(".faq-body")
        .evaluate((el) => (el as HTMLElement).inert),
    ).toBe(false);
    await items.nth(1).locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(items.nth(1).locator("summary")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect
      .poll(() =>
        items.evaluateAll(
          (elements) =>
            elements.filter((el) => (el as HTMLDetailsElement).open).length,
        ),
      )
      .toBe(0);
  }
});

test("campaign panels and carousel respond to their controls", async ({
  page,
}) => {
  await page.goto("/campaigns");
  const tabs = page.locator(".campaign-tab");
  await tabs.nth(0).click();
  await expect(tabs.nth(0)).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#campaign-shared-panel")).toContainText(
    "Mass surveillance is a threat",
  );
  await tabs.nth(1).click();
  await expect(page.locator("#campaign-shared-panel")).toContainText(
    "Militaries around the world",
  );
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-expanded", "false");
  await page.goto("/");
  const viewport = page.locator(".campaign-viewport");
  await viewport.scrollIntoViewIfNeeded();
  const before = await viewport.evaluate((el) => el.scrollLeft);
  await page.getByRole("button", { name: "Next campaign" }).click();
  await expect
    .poll(() => viewport.evaluate((el) => el.scrollLeft))
    .not.toBe(before);
  await expectNoOverflow(page);
});

test("Policy contents opens the correct policy panel", async ({ page }) => {
  await page.goto("/policy");
  await expect(page.locator("#toc-container .toc-item-link")).toHaveCount(12);
  await page.locator("#toc-container .toc-item-link").nth(1).click();
  await expect(page.locator(".policy-card-toggle").nth(1)).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await page.locator(".policy-card-toggle").nth(2).click();
  await expect(page.locator(".policy-card-toggle").nth(1)).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(page.locator(".policy-card-toggle").nth(2)).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

test("Events filtering, keyboard opening, details, and Escape work with a feed", async ({
  page,
}, testInfo) => {
  const row = (title: string, city: string) => ({
    c: [
      null,
      { v: title },
      { v: "Organize for a human future." },
      { v: "A friend" },
      { v: "Town hall" },
      { v: city },
      { v: "Sapiens First" },
      null,
      { v: "Date(2099,0,15)" },
      { v: "6 PM" },
    ],
  });
  await page.route("https://docs.google.com/spreadsheets/**", (request) =>
    request.fulfill({
      body: `google.visualization.Query.setResponse(${JSON.stringify({ table: { rows: [row("Community meeting", "Berkeley"), row("Organizing night", "Oakland")] } })});`,
      contentType: "application/javascript",
    }),
  );
  await page.goto("/events");
  await expect(page.locator(".event-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Berkeley", exact: true }).click();
  await expect(page.locator(".event-card")).toHaveCount(1);
  await page.locator(".event-card").focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "Community meeting" }),
  ).toBeVisible();
  await expect(page.locator(".modal-desc")).toContainText(
    "Organize for a human future",
  );
  await expectNoOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("event-details.png"),
    animations: "disabled",
  });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("Atlas supports charts, tables, search, selection, people, and history", async ({
  page,
}, testInfo) => {
  await page.goto("/atlas");
  await expect(page.locator(".atlas-circle-svg")).toBeVisible();
  await page.getByRole("button", { name: "Table", exact: true }).click();
  await expect(page.locator(".atlas-table-wrap")).toBeVisible();
  await page.locator("#atlas-search").fill("nonexistent-ui-test");
  await expect(page.locator(".atlas-table-wrap tbody tr")).toHaveCount(0);
  await page.locator("#atlas-search").fill("");
  await page.locator(".atlas-table-wrap tbody th > a").first().click();
  await expect(page.locator("#record-title")).toBeVisible();
  await expectNoOverflow(page);
  await page.screenshot({
    path: testInfo.outputPath("atlas-record.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Domains", exact: true }).click();
  await page.getByRole("button", { name: "Table", exact: true }).click();
  await expect(page.locator("#atlas-filter")).toBeVisible();
  await page.locator("#atlas-filter").selectOption("all");
  await page.getByRole("button", { name: "Alignment", exact: true }).click();
  await expect(page.locator(".atlas-alignment-layout")).toBeVisible();
  await page.getByRole("button", { name: "People", exact: true }).click();
  await expect(page.locator(".atlas-people-grid")).toBeVisible();
  await page.goBack();
  await expect(page.locator(".atlas-alignment-layout")).toBeVisible();
  await expectNoOverflow(page);
});

test("Builder print layout hides navigation and keeps the job content", async ({
  page,
}) => {
  await page.goto("/careers/builder");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("header.site-header")).not.toBeVisible();
  await expect(page.locator("footer.site-footer")).not.toBeVisible();
  await expect(page.locator(".job-sidebar")).not.toBeVisible();
  await expect(page.locator(".job-content")).toBeVisible();
  await expectNoOverflow(page);
});

test("client navigation preserves route styling and FAQ behavior", async ({
  page,
}) => {
  await page.goto("/privacy");
  await page
    .locator("header")
    .getByRole("link", { name: "Fellowship", exact: true })
    .click();
  await expect(page).toHaveURL(/\/fellowship$/);
  await page.locator(".faq-item").nth(2).locator("summary").click();
  await expect(
    page.locator(".faq-item").nth(2).locator("summary"),
  ).toHaveAttribute("aria-expanded", "true");
  await page
    .locator("header")
    .getByRole("link", { name: "Start a Circle", exact: true })
    .click();
  await expect(page).toHaveURL(/\/circle$/);
  await expect(page.locator(".faq-item")).toHaveCount(7);
  await expectNoOverflow(page);
});
