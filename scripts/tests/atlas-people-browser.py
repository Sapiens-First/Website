"""People tab navigation and cross-linking; run dev_server.py first."""
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
            await page.goto('http://localhost:8000/atlas#people')
            await expect(page.locator('[data-view="people"]')).to_have_attribute('aria-pressed', 'true')
            await expect(page.locator('#atlas-people')).to_be_visible()
            # Table/chart controls are governance/domains-only, not People.
            await expect(page.locator('#atlas-format')).to_be_hidden()
            await expect(page.locator('#atlas-results')).to_be_hidden()
            await expect(page.locator('#atlas-circles')).to_be_hidden()
            await expect(page.locator('#atlas-tree')).to_be_hidden()
            cards = page.locator('.atlas-person')
            # Ten current people: Rohan (the only Staff) plus nine named Fellows.
            await expect(cards).to_have_count(10)
            await expect(page.locator('.atlas-person[data-person-id="P-001"] h3')).to_have_text('Rohan')
            await expect(page.locator('.atlas-person[data-person-id="P-001"] .atlas-badge')).to_have_text('Staff')
            # Da holds two roles, grouped under one card by Person ID.
            await expect(page.locator('.atlas-person[data-person-id="P-005"] .atlas-links li')).to_have_count(2)
            # Alex and Alejandra both display "Al" but stay distinct cards with
            # their own roles, disambiguated on-page by their first role name.
            al_cards = page.locator('.atlas-person:has(h3:text-is("Al"))')
            await expect(al_cards).to_have_count(2)
            await expect(page.locator('.atlas-person[data-person-id="P-004"] .atlas-person-context')).to_be_visible()
            await expect(page.locator('.atlas-person[data-person-id="P-007"] .atlas-person-context')).to_be_visible()
            p004_role = await page.locator('.atlas-person[data-person-id="P-004"] .atlas-person-context').text_content()
            p007_role = await page.locator('.atlas-person[data-person-id="P-007"] .atlas-person-context').text_content()
            assert p004_role != p007_role, 'the two Al cards show different roles'

            # Search matches name, engagement, and role names, using textContent
            # (safe against CSV values that look like markup).
            await page.locator('#atlas-search').fill('staff')
            await expect(cards).to_have_count(1)
            await page.locator('#atlas-search').fill('knowledge management system steward')
            await expect(cards).to_have_count(1)
            await expect(page.locator('.atlas-person h3')).to_have_text('Da')
            await page.locator('#atlas-search').fill('nonexistent person 123')
            await expect(page.locator('#atlas-people')).to_contain_text('No people match this search')
            await page.locator('#atlas-search').fill('')

            # A role link on a person card leads into that governance record.
            await page.locator('.atlas-person[data-person-id="P-005"] .atlas-links a').first.click()
            await expect(page.locator('#record-title')).to_have_text('Knowledge Base')
            # The role links back to People, landing on the same person.
            await page.locator('#atlas-record a[href^="#people/"]').first.click()
            await expect(page.locator('#view-title')).to_have_text('People')
            await expect(page.locator('.atlas-person.is-selected')).to_have_attribute('data-person-id', 'P-005')

            await page.go_back()
            await expect(page.locator('#record-title')).to_have_text('Knowledge Base')
            await page.go_back()
            await expect(page.locator('#view-title')).to_have_text('People')

            # Switching tabs away from People restores the governance/domains
            # controls, and back again re-hides them.
            await page.locator('[data-view="governance"]').click()
            await expect(page.locator('#atlas-circles')).to_be_visible()
            await expect(page.locator('#atlas-people')).to_be_hidden()
            await page.locator('[data-view="people"]').click()
            await expect(page.locator('#atlas-people')).to_be_visible()
            await expect(page.locator('#atlas-circles')).to_be_hidden()

            assert not await page.evaluate('document.documentElement.scrollWidth > innerWidth')
            assert not errors, errors
            await page.close()
            print(f'PASS {width}px: people tab, grouping, same-label identities, search, role links, history, cross-tab')
        page = await browser.new_page()
        await page.goto((Path(__file__).resolve().parents[2] / 'atlas.html').as_uri() + '#people')
        await expect(page.locator('.atlas-person')).to_have_count(10)
        await browser.close()
        print('PASS direct-file people view')


asyncio.run(main())
