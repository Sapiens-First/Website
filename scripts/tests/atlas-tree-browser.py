"""Domains tree (Horizons of Focus) navigation; run dev_server.py first."""
import asyncio
import copy
import json
from pathlib import Path
from playwright.async_api import async_playwright, expect

ROOT = Path(__file__).resolve().parents[2]
text = (ROOT / 'atlas-data.js').read_text()
DATA = json.loads(text[text.index('=') + 1:].strip().rstrip(';'))


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for width in (1440, 390):
            page = await browser.new_page(viewport={'width': width, 'height': 1000})
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            await page.goto('http://localhost:8000/atlas#domains')
            await page.locator('[data-format="tree"]').click()
            await expect(page.locator('#atlas-tree')).to_be_visible()
            await expect(page.locator('#atlas-results')).to_be_hidden()
            # The whole hierarchy always renders (no drill/focus narrowing —
            # vertical position is a fixed Horizon Level, not a layout the
            # user can change), so the Mission root and every record are
            # present in one pass, plus a level below it.
            await expect(page.locator('.atlas-tree-svg [data-node-id="D-001"]')).to_have_count(1)
            await expect(page.locator('.atlas-tree-svg [data-node-id]')).to_have_count(len(DATA['domains']))
            await expect(page.locator('.atlas-horizon-label').first).to_contain_text('Mission')
            await expect(page.locator('.atlas-horizon-label').first).to_contain_text('H4')
            await expect(page.locator('.atlas-horizon-label').last).to_contain_text('~3 months')
            await page.locator('.atlas-guide summary').click()
            await expect(page.locator('.atlas-horizons li')).to_have_count(4)
            assert not await page.evaluate('document.documentElement.scrollWidth > innerWidth')
            await page.locator('.atlas-guide summary').click()
            await page.get_by_role('button', name='Actual size').click()
            # Searching must preserve the canvas and the participant's place.
            await page.evaluate('window.originalTree = document.querySelector(".atlas-tree-svg")')
            await page.locator('.atlas-tree-scroll').evaluate('(n) => { n.scrollLeft = 120; }')
            await page.locator('#atlas-search').fill('website')
            assert await page.evaluate('window.originalTree === document.querySelector(".atlas-tree-svg")')
            assert await page.locator('.atlas-tree-scroll').evaluate('n => n.scrollLeft') == 120
            await page.locator('#atlas-search').fill('')
            await page.get_by_role('button', name='Fit tree').click()
            assert await page.locator('.atlas-tree-scroll').evaluate('n => n.scrollWidth <= n.clientWidth + 1')
            await page.get_by_role('button', name='Actual size').click()
            await expect(page.locator('.atlas-tree-zoom output')).to_have_text('100%')
            await page.get_by_role('button', name='Zoom in', exact=True).click()
            await expect(page.locator('.atlas-tree-zoom output')).to_have_text('125%')
            await page.locator('#atlas-search').fill('website')
            await expect(page.locator('.atlas-tree-zoom output')).to_have_text('125%')
            await page.locator('#atlas-search').fill('')
            await page.get_by_role('button', name='Actual size').click()
            # Keyboard: focus a node's link directly (mirrors the governance
            # circle test) and activate it with Enter.
            await page.locator('.atlas-tree-svg [data-node-id="D-013"] > a').first.focus()
            await page.keyboard.press('Enter')
            await expect(page.locator('#record-title')).to_have_text('Website')
            await expect(page.locator('#atlas-record')).to_contain_text('Communications')
            await expect(page.locator('.atlas-tree-breadcrumbs')).to_contain_text('Communications')
            await expect(page.locator('.atlas-tree-breadcrumbs')).to_contain_text('Website')
            await page.locator('.atlas-tree-svg [data-node-id="D-009"] > a').first.focus()
            await page.keyboard.press('Enter')
            await expect(page.locator('#record-title')).to_have_text('Communications')
            await page.go_back()
            await expect(page.locator('#record-title')).to_have_text('Website')
            await page.locator('[data-format="table"]').click()
            await expect(page.locator('#atlas-results')).to_be_visible()
            await expect(page.locator('#atlas-tree')).to_be_hidden()
            assert await page.locator('#atlas-record').evaluate("n => n.parentElement.classList.contains('atlas-explorer')")
            await page.locator('[data-format="tree"]').click()
            await page.locator('#atlas-search').fill('website')
            await expect(page.locator('.atlas-tree-search a[href="#domains/tree/D-013"]')).to_be_visible()
            await page.locator('.atlas-tree-search a[href="#domains/tree/D-013"]').click()
            await expect(page.locator('#record-title')).to_have_text('Website')
            await page.locator('#atlas-search').fill('nonexistent 123')
            await expect(page.locator('.atlas-tree-search')).to_contain_text('0 search results')
            # The Active/All-statuses filter must never hide branches from the
            # tree — Community (a Pillar) has a "Planned" status, not Active.
            await expect(page.locator('.atlas-tree-svg [data-node-id="D-003"]')).to_have_count(1)
            await page.goto('http://localhost:8000/atlas#domains/tree/D-003')
            await expect(page.locator('#record-title')).to_have_text('Community')
            await expect(page.locator('.atlas-tree-breadcrumbs')).to_contain_text('Community')
            await page.goto('http://localhost:8000/atlas#domains/tree')
            assert not await page.evaluate('document.documentElement.scrollWidth > innerWidth')
            await page.locator('#atlas-tree-chart').screenshot(path=f'/tmp/atlas-tree-final-{width}.png')
            await page.get_by_label('Explore a branch', exact=True).select_option('D-002')
            await expect(page.locator('#record-title')).to_have_text('Advocacy')
            await expect(page.locator('.atlas-tree-svg [data-node-id="D-003"]')).to_have_count(0)
            await expect(page.locator('.atlas-tree-svg [data-node-id="D-024"]')).to_have_count(1)
            await page.get_by_label('Explore a branch', exact=True).select_option('')
            await expect(page.locator('.atlas-tree-svg [data-node-id]')).to_have_count(len(DATA['domains']))
            await page.locator('[data-view="governance"]').click()
            await expect(page.locator('[data-format="tree"]')).to_be_hidden()
            await expect(page.locator('[data-format="circles"]')).to_be_visible()
            assert not errors, errors
            await page.close()
            print(f'PASS {width}px: tree, root+levels, keyboard, breadcrumbs, search, history, table toggle, active-filter independence, overflow')

        # Unplaced records: a broken Parent ID reference must land in the
        # honest "Not connected to the Mission" list, never silently attached
        # to the root. The real CSV currently has none, so this is injected.
        sample = copy.deepcopy(DATA)
        template = sample['domains'][0]
        orphan = dict(template, ID='D-901', Name='Orphan Initiative', Type='Program', **{'Parent ID': 'D-999'})
        sample['domains'].append(orphan)
        page = await browser.new_page(viewport={'width': 1440, 'height': 1000})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        await page.route('**/atlas-data.js', lambda route: route.fulfill(body='window.ATLAS_DATA = ' + json.dumps(sample) + ';', content_type='application/javascript'))
        await page.goto('http://localhost:8000/atlas#domains/tree')
        await expect(page.locator('.atlas-unplaced summary')).to_contain_text('Not connected to the Mission')
        await page.locator('.atlas-unplaced summary').click()
        await expect(page.locator('.atlas-unplaced a[href="#domains/tree/D-901"]')).to_be_visible()
        await page.locator('.atlas-unplaced a[href="#domains/tree/D-901"]').click()
        await expect(page.locator('#record-title')).to_have_text('Orphan Initiative')
        await expect(page.locator('.atlas-tree-svg [data-node-id="D-901"]')).to_have_count(0)
        assert not errors, errors
        await page.close()
        print('PASS unplaced records: honest separate list, not attached to root')

        page = await browser.new_page()
        await page.goto(ROOT.joinpath('atlas.html').as_uri() + '#domains/tree/D-013')
        await expect(page.locator('.atlas-tree-svg [data-node-id]')).to_have_count(len(DATA['domains']))
        await expect(page.locator('#record-title')).to_have_text('Website')
        await browser.close()
        print('PASS direct-file tree view')


asyncio.run(main())
