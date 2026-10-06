import { expect, test } from "@playwright/test";

test("homepage crisis emphasis remains legible on its dark background", async ({
  page,
}) => {
  await page.goto("/");
  const colors = await page.locator(".crisis-statement em").evaluate((el) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--coral)";
    el.append(probe);
    const expected = getComputedStyle(probe).color;
    probe.remove();
    return { actual: getComputedStyle(el).color, expected };
  });
  expect(colors.actual).toBe(colors.expected);
});
