const SITE_CONFIG = {
  DONATION_URL: 'https://www.zeffy.com/en-US/donation-form/support-sapiens-first',
  STRATEGY_DOC_URL: 'https://docs.google.com/document/d/1sBlALbzX4fwvEJcFtc4OSpAnceozyV3_chMaFNUIhJg/edit?usp=sharing',
  GUIDE_DOC_ID: '1dG4DL_Bak93Sah1LK5oSxtXQ3yQvWp15UMWFv-z9Nvs',
  EVENTS_SHEET_ID: '1mkPKC7MmmKhW8PS2K-7lqmjreQOln6zz9t5C-lSDqOU',
  EMBER_COLORS: ['#ff5252','#ff8080','#ffbe0b','#c80000','#ff6b6b','#ffd60a'],
  EMBER_COUNT: 174,
};

// Resolve a page name to a link, working both in production (clean, extensionless
// URLs served via .htaccess rewrites) and when the site is opened directly from
// disk via file:// (no rewrite support, so the real .html file must be targeted).
const siteRoot = new URL('.', document.currentScript.src);
SITE_CONFIG.pageLink = function (page) {
  return window.location.protocol === 'file:' ? new URL(`${page}.html`, siteRoot).href : `/${page}`;
};
SITE_CONFIG.JOIN_URL = new URL(SITE_CONFIG.pageLink('join'), window.location.href).href;

// Single source of truth for where each page appears in site chrome. To add,
// move, or hide a page, edit its entry here only — NAV_LINKS and
// FOOTER_GROUPS below are both derived from this registry.
// Page text and SEO metadata live in each HTML file. Search-discovery URLs
// are maintained separately in sitemap.xml; this registry does not update it.
//
//   label:  display text.
//   nav:    true       -> root-level nav item, in declared order.
//           '<pageKey>' -> dropdown child of that other page's nav item
//                          (that page must itself have nav: true).
//           omitted/false -> not in the nav bar.
//   footer: '<Group Title>' -> listed under that footer column (columns are
//                               created in first-seen order).
//           omitted/false -> not in the footer.
//   external/href: for entries that aren't a local page (e.g. Donate).
SITE_CONFIG.PAGES = {
  about:           { label: 'About',          nav: true,   footer: 'About' },
  careers:         { label: 'Careers',        nav: 'about', footer: 'About' },
  strategy:        { label: 'Strategy' },
  atlas:           { label: 'Atlas',          nav: 'about', footer: 'About' },
  privacy:         { label: 'Privacy',                      footer: 'About' },
  donate:          { label: 'Donate',                        footer: 'About' },
  fellowship:      { label: 'Fellowship',     nav: true,   footer: 'Get Involved' },
  circle:          { label: 'Start a Circle', nav: true,  footer: 'Get Involved' },
  join:            { label: 'Join',           nav: true,   footer: 'Get Involved' },
  membership:      { label: 'Membership' },
  events:          { label: 'Events' },
  learn:           { label: 'Learn',                          footer: 'Resources' },
  policy:          { label: 'Policy',                         footer: 'Resources' },
  campaigns:       { label: 'Campaigns',                      footer: 'Resources' },
  // Unlinked: reachable by direct URL only, not wired into nav or footer.
  'human-charter':  { label: 'The Human Charter' },
};

// Builds the root nav list (with nested `children` for dropdown items) from
// SITE_CONFIG.PAGES. Note: nav.js renders Donate separately as a styled CTA,
// so a page with only `nav` set (no root/parent matching it) is skipped here.
function buildNavLinks(pages) {
  const roots = [];
  const byKey = {};
  Object.keys(pages).forEach((key) => {
    if (pages[key].nav !== true) return;
    byKey[key] = { page: key, label: pages[key].label };
    roots.push(byKey[key]);
  });
  Object.keys(pages).forEach((key) => {
    const parentKey = pages[key].nav;
    if (typeof parentKey !== 'string' || !byKey[parentKey]) return;
    const parent = byKey[parentKey];
    parent.children = parent.children || [];
    parent.children.push({ page: key, label: pages[key].label });
  });
  return roots;
}

// Builds the grouped footer columns from SITE_CONFIG.PAGES, preserving the
// order groups and links first appear in.
function buildFooterGroups(pages) {
  const groups = [];
  const byTitle = {};
  Object.keys(pages).forEach((key) => {
    const page = pages[key];
    if (!page.footer) return;
    if (!byTitle[page.footer]) {
      byTitle[page.footer] = { title: page.footer, links: [] };
      groups.push(byTitle[page.footer]);
    }
    byTitle[page.footer].links.push(
      page.external ? { label: page.label, href: page.href, external: true } : { page: key, label: page.label }
    );
  });
  return groups;
}

SITE_CONFIG.NAV_LINKS = buildNavLinks(SITE_CONFIG.PAGES);
SITE_CONFIG.FOOTER_GROUPS = buildFooterGroups(SITE_CONFIG.PAGES);

function initEmberField() {
  const field = document.querySelector('.ember-field');
  if (!field) return;
  for (let i = 0; i < SITE_CONFIG.EMBER_COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'ember';
    const size = 1.5 + Math.random() * 2;
    const col = SITE_CONFIG.EMBER_COLORS[Math.floor(Math.random() * SITE_CONFIG.EMBER_COLORS.length)];
    const dur = (2.2 + Math.random() * 3.52).toFixed(2);
    const del = (-Math.random() * 7).toFixed(2);
    const peak = (0.35 + Math.random() * 0.55).toFixed(2);
    const glow = (size * 1.8).toFixed(1);
    const x = Math.random() * 100;
    const u = Math.random();
    const y = (-0.8 + Math.sqrt(0.64 + 0.8 * u)) / 0.4 * 100;
    el.style.cssText = `left:${x}%;top:${y}%;width:${size}px;height:${size}px;background:${col};--ec:${col};--ed:${dur}s;--ey:${del}s;--ep:${peak};--eg:${glow}px`;
    field.appendChild(el);
  }
}
