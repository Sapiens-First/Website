"""Governance circle navigation; run dev_server.py first."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright, expect


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for width in (1440, 390):
            page = await browser.new_page(viewport={'width': width, 'height': 1000})
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            await page.goto('http://localhost:8000/atlas#governance')
            await page.locator('[data-format="circles"]').click()
            await expect(page.locator('#atlas-circles')).to_be_visible()
            await expect(page.locator('#atlas-results')).to_be_hidden()
            # Counts aren't hardcoded: governance data changes constantly (a core
            # Holacracy principle), so this checks specific known-placed/unplaced
            # records instead of totals that would break on every reorg.
            await expect(page.locator('.atlas-circle-svg [data-node-id]').first).to_be_visible()
            await expect(page.locator('.atlas-circle-svg [data-node-id="G-035"]')).to_have_count(0)
            await expect(page.locator('.atlas-unplaced summary')).to_contain_text('Circle not assigned')
            await page.locator('.atlas-circle-svg [data-node-id="G-004"] > a').first.focus()
            await page.keyboard.press('Enter')
            await expect(page.locator('#record-title')).to_have_text('Media')
            await expect(page.locator('.atlas-circle-svg [data-node-id]')).to_have_count(3)
            await page.locator('.atlas-circle-svg [data-node-id="G-006"] > a').first.focus()
            await page.keyboard.press('Enter')
            await expect(page.locator('#record-title')).to_have_text('Website Owner')
            await expect(page.locator('#atlas-record')).to_contain_text('Publishing updates')
            await page.go_back()
            await expect(page.locator('#record-title')).to_have_text('Media')
            await page.locator('[data-format="table"]').click()
            await expect(page.locator('#atlas-results')).to_be_visible()
            await expect(page.locator('#atlas-circles')).to_be_hidden()
            assert await page.locator('#atlas-record').evaluate("n => n.parentElement.classList.contains('atlas-explorer')")
            await page.locator('[data-format="circles"]').click()
            await page.locator('#atlas-search').fill('website owner')
            await expect(page.locator('.atlas-circle-search a[href="#governance/circles/G-006"]')).to_be_visible()
            await page.locator('.atlas-circle-search a[href="#governance/circles/G-006"]').click()
            await expect(page.locator('#record-title')).to_have_text('Website Owner')
            await page.locator('#atlas-search').fill('nonexistent 123')
            await expect(page.locator('.atlas-circle-search')).to_contain_text('0 search results')
            await page.goto('http://localhost:8000/atlas#governance/circles/G-016')
            await expect(page.locator('.atlas-circle-hint')).to_contain_text('No roles or subcircles')
            await page.goto('http://localhost:8000/atlas#governance/circles/G-008')
            await expect(page.locator('.atlas-circle-svg [data-node-id="G-009"]')).to_have_count(1)
            await expect(page.locator('.atlas-circle-breadcrumbs')).to_contain_text('Advocacy')
            await page.locator('.atlas-circle-breadcrumbs a').first.click()
            await page.locator('.atlas-unplaced summary').click()
            await page.locator('.atlas-unplaced a[href="#governance/circles/G-035"]').click()
            await expect(page.locator('#record-title')).to_have_text('Secretary')
            await expect(page.locator('#atlas-record')).to_contain_text('Needs definition')
            await page.goto('http://localhost:8000/atlas#governance/circles')
            assert not await page.evaluate('document.documentElement.scrollWidth > innerWidth')
            await page.locator('#atlas-circle-chart').screenshot(path=f'/tmp/atlas-circles-final-{width}.png')
            await page.locator('[data-view="domains"]').click()
            await expect(page.locator('#atlas-format')).to_be_hidden()
            await expect(page.locator('#atlas-results')).to_be_visible()
            assert not errors, errors
            await page.close()
            print(f'PASS {width}px: circles, nested drill-down, details, keyboard, search, history, unplaced, table, overflow')
        page = await browser.new_page()
        await page.goto((Path(__file__).resolve().parents[2] / 'atlas.html').as_uri() + '#governance/circles/G-004')
        await expect(page.locator('.atlas-circle-svg [data-node-id]')).to_have_count(3)
        await browser.close()
        print('PASS direct-file circle view')


asyncio.run(main())
