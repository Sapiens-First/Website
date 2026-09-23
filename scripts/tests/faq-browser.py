"""Run with the site's dev_server.py on port 8000; requires Playwright."""
import asyncio
from playwright.async_api import async_playwright


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for width in (1440, 390):
            page = await browser.new_page(viewport={"width": width, "height": 900})
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            for route in ("fellowship", "start-a-circle"):
                await page.goto(f"http://localhost:8000/{route}")
                items = page.locator(".faq-item")
                first, second = items.nth(0), items.nth(1)
                first_height = await first.evaluate("e => e.getBoundingClientRect().height")
                # Keyboard activation must animate both the incoming and outgoing answer.
                await second.locator("summary").focus()
                await page.keyboard.press("Enter")
                assert await page.locator('.faq-item summary[aria-expanded="true"]').count() == 1
                assert await first.evaluate("e => e.getAnimations().length") == 1
                assert await second.evaluate("e => e.getAnimations().length") == 1
                await page.wait_for_timeout(100)
                middle_height = await first.evaluate("e => e.getBoundingClientRect().height")
                await page.wait_for_timeout(250)
                closed_height = await first.evaluate("e => e.getBoundingClientRect().height")
                assert closed_height < middle_height < first_height
                assert await page.locator(".faq-item[open]").count() == 1
                assert await second.evaluate("e => e.open")
                assert await first.locator(".faq-body").evaluate("e => e.inert")
                # Reverse an in-flight animation several times without stale completion handlers.
                await first.locator("summary").evaluate("e => e.click()")
                await page.wait_for_timeout(40)
                await second.locator("summary").evaluate("e => e.click()")
                await page.wait_for_timeout(40)
                await first.locator("summary").evaluate("e => e.click()")
                await page.wait_for_timeout(350)
                assert await first.evaluate("e => e.open")
                assert await page.locator(".faq-item[open]").count() == 1
                await first.locator("summary").focus()
                await page.keyboard.press("Space")
                await page.wait_for_timeout(350)
                assert await page.locator(".faq-item[open]").count() == 0
                # Reduced motion uses the same exclusivity without animations.
                await page.emulate_media(reduced_motion="reduce")
                await second.locator("summary").evaluate("e => e.click()")
                assert await second.evaluate("e => e.open && !e.getAnimations().length")
                await first.locator("summary").evaluate("e => e.click()")
                assert await page.locator(".faq-item[open]").count() == 1
                assert await first.evaluate("e => e.open")
                await page.emulate_media(reduced_motion="no-preference")
                assert not await page.evaluate("document.documentElement.scrollWidth > innerWidth")
                if route == "fellowship":
                    assert await page.locator("details.role[open]").count() == 1
                print(f"PASS {route} at {width}px: motion, exclusivity, keyboard, rapid reversal, reduced motion")
            assert not errors, errors
            await page.close()
        page = await browser.new_page(java_script_enabled=False)
        await page.goto("http://localhost:8000/start-a-circle")
        await page.locator(".faq-item").nth(1).locator("summary").click()
        assert await page.locator(".faq-item").nth(1).evaluate("e => e.open")
        print("PASS native FAQ remains usable without JavaScript")
        await browser.close()


asyncio.run(main())
