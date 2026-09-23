"""Domains Alignment matrix; run dev_server.py first."""
import asyncio
from playwright.async_api import async_playwright, expect


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for width in (1440, 390):
            page = await browser.new_page(viewport={'width': width, 'height': 1000})
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            await page.goto('http://localhost:8000/atlas#domains/alignment')
            await expect(page.locator('[data-format="alignment"]')).to_have_attribute('aria-pressed', 'true')
            await expect(page.locator('#atlas-alignment')).to_be_visible()
            await expect(page.locator('#atlas-results')).to_be_hidden()

            # No `supports` rows exist in relationships.csv yet — an honest
            # empty state, not an invented matrix.
            await expect(page.locator('.atlas-alignment-empty')).to_be_visible()
            await expect(page.locator('.atlas-alignment-empty')).to_contain_text('No cross-cutting relationships')
            await expect(page.locator('table.atlas-alignment-table')).to_have_count(0)

            # The row-type toggle is real (not disabled) even while empty,
            # and switching it doesn't error.
            await page.get_by_role('button', name='Programs').click()
            await expect(page.get_by_role('button', name='Programs')).to_have_attribute('aria-pressed', 'true')
            await expect(page.locator('.atlas-alignment-empty')).to_be_visible()
            await page.get_by_role('button', name='Projects').click()
            await expect(page.get_by_role('button', name='Projects')).to_have_attribute('aria-pressed', 'true')

            # Switching tabs and formats around Alignment doesn't break anything.
            await page.locator('[data-format="table"]').click()
            await expect(page.locator('#atlas-results')).to_be_visible()
            await expect(page.locator('#atlas-alignment')).to_be_hidden()
            await page.locator('[data-format="alignment"]').click()
            await expect(page.locator('#atlas-alignment')).to_be_visible()
            await page.locator('[data-view="governance"]').click()
            await expect(page.locator('#atlas-circles')).to_be_visible()
            await expect(page.locator('[data-format="alignment"]')).to_be_hidden()

            assert not await page.evaluate('document.documentElement.scrollWidth > innerWidth')
            assert not errors, errors
            await page.close()
            print(f'PASS {width}px: alignment empty state, row-type toggle, view/format switching')
        await browser.close()


asyncio.run(main())
