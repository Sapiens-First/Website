"""Domains Explorer (outline) navigation; run dev_server.py first."""
import asyncio
from playwright.async_api import async_playwright, expect


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for width in (1440, 390):
            page = await browser.new_page(viewport={'width': width, 'height': 1000})
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            await page.goto('http://localhost:8000/atlas#domains')
            # Explorer is Domains' default graphical view.
            await expect(page.locator('[data-format="outline"]')).to_have_attribute('aria-pressed', 'true')
            await expect(page.locator('#atlas-outline')).to_be_visible()
            await expect(page.locator('#atlas-results')).to_be_hidden()

            mission = page.locator('[data-id="D-001"] > .atlas-outline-row')
            advocacy = page.locator('[data-id="D-002"] > .atlas-outline-row')
            campaign_creation = page.locator('[data-id="D-033"] > .atlas-outline-row')
            stop_1984 = page.locator('[data-id="D-005"] > .atlas-outline-row')
            background_research = page.locator('[data-id="D-024"]')

            # Default state: Mission expanded, its immediate children visible
            # but themselves collapsed — deeper levels are not in the DOM at all.
            await expect(mission).to_be_visible()
            await expect(page.locator('[data-id="D-001"]')).to_have_attribute('aria-expanded', 'true')
            await expect(advocacy).to_be_visible()
            await expect(page.locator('[data-id="D-002"]')).to_have_attribute('aria-expanded', 'false')
            await expect(campaign_creation).to_have_count(0)

            await page.locator('[data-id="D-002"] > .atlas-outline-row > .atlas-outline-chevron').click()
            await expect(page.locator('[data-id="D-002"]')).to_have_attribute('aria-expanded', 'true')
            await expect(campaign_creation).to_be_visible()
            await page.locator('[data-id="D-033"] > .atlas-outline-row > .atlas-outline-chevron').click()
            await expect(stop_1984).to_be_visible()
            await page.locator('[data-id="D-005"] > .atlas-outline-row > .atlas-outline-chevron').click()
            await expect(background_research).to_be_visible()

            # Selecting a name opens the shared record panel and a breadcrumb.
            await page.locator('[data-id="D-024"] .atlas-outline-title').click()
            await expect(page.locator('#record-title')).to_have_text('Stop 1984! Background Research')
            await expect(page.locator('.atlas-outline-breadcrumbs')).to_contain_text('Advocacy')
            await expect(page.locator('.atlas-outline-breadcrumbs')).to_contain_text('Stop 1984')

            # Search prunes to matches + ancestor context, drops the Mission
            # wrapper, and does not surface an unrelated sibling pillar.
            await page.goto('http://localhost:8000/atlas#domains')
            await page.locator('#atlas-search').fill('freeze ai background research')
            # Only Advocacy (the ancestor) starts the pruned tree — Mission is dropped.
            await expect(page.locator('.atlas-outline-tree > li > .atlas-outline-row')).to_have_count(1)
            await expect(page.locator('[data-id="D-002"]')).to_be_visible()
            await expect(page.locator('[data-id="D-025"]')).to_be_visible()
            await expect(page.locator('[data-id="D-003"]')).to_have_count(0)  # Community pillar not pulled in
            highlight_text = await page.locator('.atlas-outline-highlight').first.text_content()
            assert highlight_text and highlight_text.strip(), 'the matching phrase is highlighted'
            await page.locator('#atlas-search').fill('')

            # Expand all / Collapse all live behind the ••• menu. D-042 sits
            # under a branch (Operations & Infrastructure) never manually
            # expanded above, so this genuinely exercises Expand all rather
            # than reusing state left over from the earlier chevron clicks.
            await expect(page.locator('[data-id="D-042"]')).to_have_count(0)
            await page.locator('.atlas-outline-menu summary').click()
            await page.get_by_role('button', name='Expand all').click()
            await expect(page.locator('[data-id="D-042"]')).to_be_visible()
            await page.locator('.atlas-outline-menu summary').click()
            await page.get_by_role('button', name='Collapse all').click()
            await expect(page.locator('[data-id="D-002"]')).to_have_count(0)
            await expect(mission).to_be_visible()

            assert not await page.evaluate('document.documentElement.scrollWidth > innerWidth')
            assert not errors, errors
            await page.close()
            print(f'PASS {width}px: explorer default state, expand/collapse, selection, breadcrumbs, search pruning')

        # Mobile: a selection replaces the outline with a full-width detail
        # view rather than stacking both panels.
        page = await browser.new_page(viewport={'width': 390, 'height': 1000})
        await page.goto('http://localhost:8000/atlas#domains/D-002')
        await expect(page.locator('#atlas-outline')).to_have_class('atlas-outline-layout has-selection')
        await expect(page.locator('#atlas-outline-tree')).to_be_hidden()
        await expect(page.locator('#record-title')).to_have_text('Advocacy')
        await page.close()
        print('PASS 390px: mobile selection hides the outline, shows only the detail panel')

        await browser.close()


asyncio.run(main())
