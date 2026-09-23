"""Run with dev_server.py on port 8000; requires Playwright + Chromium."""
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
            errors, sheets_requests = [], []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('request', lambda request: sheets_requests.append(request.url) if 'docs.google.com' in request.url else None)
            await page.goto('http://localhost:8000/atlas')
            # Roles is the default landing tab, and Circles is the default
            # graphical view for it — the page lands on Circles, not the table,
            # until Table is pressed.
            await expect(page.locator('#atlas-circles')).to_be_visible()
            await expect(page.locator('#atlas-results')).to_be_hidden()
            await page.locator('[data-format="table"]').click()
            rows = page.locator('#atlas-table tbody tr')
            # Counts are derived from the loaded data, not hardcoded, since domains
            # and governance are expected to change constantly (a core Holacracy
            # principle) — this only catches rendering bugs, not legitimate growth.
            await expect(rows).to_have_count(len(DATA['governance']))
            await page.locator('#atlas-search').fill('rohan')
            rohan_count = sum(1 for row in DATA['governance'] if 'rohan' in ' '.join(row.values()).lower())
            await expect(rows).to_have_count(rohan_count)
            await page.locator('#atlas-search').fill('nonexistent 123')
            await expect(page.locator('#atlas-results')).to_be_hidden()
            await page.locator('#atlas-search').fill('')
            await page.locator('[data-view="domains"]').focus()
            await page.keyboard.press('Enter')
            # Switching the top-level tab returns to that view's own graphical
            # default (Explorer), even though Roles was just in Table.
            await expect(page.locator('#atlas-outline')).to_be_visible()
            await page.locator('[data-format="table"]').click()
            active_count = sum(1 for row in DATA['domains'] if row['Status'] == 'Active')
            await expect(rows).to_have_count(active_count)
            await page.locator('#atlas-filter').select_option('all')
            await expect(rows).to_have_count(len(DATA['domains']))
            await page.locator('#atlas-search').fill('  website  ')
            await expect(rows).to_have_count(1)
            await page.locator('#atlas-table summary').click()
            await expect(page.locator('#atlas-table details[open]')).to_have_count(1)
            # Links generated while browsing in Table mode carry an explicit
            # /table/ marker so they stay in Table rather than falling back to
            # the Explorer/Circles default.
            await page.locator('#atlas-table a[href="#domains/table/D-013"]').click()
            await expect(page.locator('#record-title')).to_have_text('Website')
            await expect(page.locator('#atlas-record')).to_contain_text('Communications')
            await page.locator('#atlas-record a[href="#governance/table/G-006"]').first.click()
            await expect(page.locator('#record-title')).to_have_text('Website Owner')
            await expect(page.locator('#atlas-record')).to_contain_text('Publishing updates')
            await page.locator('#atlas-record a[href="#domains/table/D-013"]').first.click()
            await expect(page.locator('#record-title')).to_have_text('Website')
            await page.go_back()
            await expect(page.locator('#record-title')).to_have_text('Website Owner')
            await page.locator('[data-view="governance"]').focus()
            await page.keyboard.press('Enter')
            # Switching the top-level tab clears the selection and returns to
            # that view's own graphical default (Circles), even though we
            # were just in Table.
            await expect(page.locator('#atlas-circles')).to_be_visible()
            await expect(page.locator('#atlas-record')).to_be_hidden()
            await page.goto('http://localhost:8000/atlas#domains/D-021')
            # Every domain now has an explicit current responsible role instead
            # of the previous "Needs clarification" placeholder ownership note.
            await expect(page.locator('#atlas-record')).to_contain_text('Fellowship Coordinator')
            await page.goto('http://localhost:8000/atlas#domains/D-003')
            await expect(page.locator('#record-title')).to_have_text('Community')
            assert not await page.evaluate('document.documentElement.scrollWidth > innerWidth')
            await page.screenshot(path=f'/tmp/atlas-local-{width}.png', full_page=True)
            assert not errors, errors
            assert not sheets_requests, sheets_requests
            await page.close()
            print(f'PASS {width}px: local data, links both ways, hierarchy, keyboard, history, search, mobile')
        page = await browser.new_page()
        await page.goto(ROOT.joinpath('atlas.html').as_uri() + '#governance/G-006')
        await expect(page.locator('#record-title')).to_have_text('Website Owner')
        await page.goto('http://localhost:8000/atlas#domains/D-999')
        await expect(page.locator('#record-title')).to_have_text('Record not found')
        await page.close()
        fallback = copy.deepcopy(DATA)
        fallback['relationships'] = [r for r in fallback['relationships'] if r['To ID'] != 'D-013']
        next(r for r in fallback['governance'] if r['ID'] == 'G-004')['Lead Link'] = 'Test Circle Lead'
        page = await browser.new_page()
        await page.route('**/atlas-data.js', lambda route: route.fulfill(body='window.ATLAS_DATA = '+json.dumps(fallback)+';', content_type='application/javascript'))
        await page.goto('http://localhost:8000/atlas#domains/D-013')
        await expect(page.locator('#atlas-record')).to_contain_text('Held by this circle; not delegated to a role.')
        await expect(page.locator('#atlas-record')).to_contain_text('Circle Lead — Test Circle Lead')
        await page.locator('#atlas-record a[href="#governance/G-004"]').first.click()
        await expect(page.locator('#atlas-record a[href="#domains/D-013"]')).to_have_count(1)
        await page.close()
        sample = copy.deepcopy(DATA)
        website = next(row for row in sample['domains'] if row['ID'] == 'D-013')
        website['Name'] = '<img src=x onerror=alert(1)>'
        website['Status'] = 'Retired'
        for number, name in [(98, 'Web infrastructure'), (99, 'Web content')]:
            sample['domains'].append(dict(website, ID=f'D-{number:03}', Name=name, Status='Active'))
            sample['relationships'].append({'ID': f'R-{number:03}', 'From ID': f'D-{number:03}', 'Relationship': 'succeeds', 'To ID': 'D-013', 'Valid from': '2020-01-01', 'Valid until': '', 'Notes': ''})
        owns = next(row for row in sample['relationships'] if row['To ID'] == 'D-013' and row['Relationship'] == 'owns')
        owns['Valid until'] = '2020-01-01'
        page = await browser.new_page()
        await page.route('**/atlas-data.js', lambda route: route.fulfill(body='window.ATLAS_DATA = '+json.dumps(sample)+';', content_type='application/javascript'))
        await page.goto('http://localhost:8000/atlas#domains/D-013')
        await expect(page.locator('#record-title')).to_have_text('<img src=x onerror=alert(1)>')
        assert await page.locator('#atlas-record img').count() == 0
        await expect(page.locator('#atlas-record')).to_contain_text('Succeeded by:')
        await expect(page.locator('#atlas-record')).to_contain_text('Ended')
        await expect(page.locator('#atlas-record')).to_contain_text('Web infrastructure')
        await expect(page.locator('#atlas-record')).to_contain_text('Web content')
        await page.locator('#atlas-record a[href="#domains/D-098"]').click()
        await expect(page.locator('#atlas-record')).to_contain_text('Succeeds:')
        await page.close()
        page = await browser.new_page()
        await page.route('**/atlas-data.js', lambda route: route.abort())
        await page.goto('http://localhost:8000/atlas')
        await expect(page.locator('#atlas-error')).to_be_visible()
        await expect(page.locator('#atlas-search')).to_be_disabled()
        await page.close()
        page = await browser.new_page(java_script_enabled=False)
        await page.goto('http://localhost:8000/atlas')
        await expect(page.locator('noscript')).to_be_visible()
        await expect(page.locator('.atlas-source')).to_have_attribute('href', 'data/atlas/governance.csv')
        print('PASS direct-file, retired records, split successors, historical ownership, safe text, missing data, no-JS')
        await browser.close()


asyncio.run(main())
