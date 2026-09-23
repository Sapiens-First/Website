// ─── SITE NAV CONFIG ─────────────────────────────────────────────────────────
// Set visible: false to hide a page from the nav (still accessible by direct URL).
// When all links are hidden the nav degrades to just the wordmark — identical
// to the original fixed wordmark that was there before the nav existed.

const NAV_ITEMS = [
  { id: 'home',              label: 'Sapiens First', href: 'index.html',            visible: true  },
  { id: 'blog',              label: 'Blog',          href: 'blog.html',             visible: false },
  { id: 'donate',            label: 'Donate',        href: 'donate.html',           visible: false },
  { id: 'about',             label: 'About',         href: 'about.html',            visible: true  },
  { id: 'berkeley',          label: 'Berkeley',      href: 'berkeley.html',         visible: false },
  { id: 'join',              label: 'Join',          href: 'join.html',             visible: false },
  { id: 'start-a-campaign',  label: 'Start',         href: 'start-a-campaign.html', visible: false },
];

// ─── STYLES (single source of truth) ─────────────────────────────────────���───

(function injectNavStyles() {
  var s = document.createElement('style');
  s.textContent =
    /* Fixed, transparent, no bar */
    '.site-nav{' +
      'position:fixed;top:32px;left:40px;right:40px;' +
      'z-index:100;' +
      'display:flex;align-items:center;justify-content:space-between;' +
      'pointer-events:none;' +
    '}' +

    /* Wordmark — matches the original floating wordmark exactly */
    '.nav-wordmark{' +
      'font-family:var(--font-mono,monospace);' +
      'font-size:14.85px;font-weight:575;' +
      'letter-spacing:0.16em;text-transform:uppercase;' +
      'color:var(--accent,#CD551D);' +
      'text-decoration:none;' +
      'display:flex;align-items:center;gap:12px;' +
      'pointer-events:auto;' +
      'opacity:0;animation:nav-fade-in 1s ease forwards 1s;' +
    '}' +
    '.nav-wordmark:hover{opacity:.72;}' +
    '.nav-logo{width:18px;height:18px;flex-shrink:0;margin-bottom:1px;}' +

    /* Links */
    '.nav-links{display:flex;align-items:center;gap:28px;pointer-events:none;}' +
    '.nav-link{' +
      'font-family:var(--font-mono,monospace);' +
      'font-size:14.85px;font-weight:500;' +
      'letter-spacing:0.16em;text-transform:uppercase;' +
      'color:var(--accent,#CD551D);' +
      'text-decoration:none;' +
      'pointer-events:auto;' +
      'opacity:0;animation:nav-fade-in 1s ease forwards 1s;' +
      'transition:opacity .2s;' +
    '}' +
    '.nav-link:hover{opacity:.72;}' +

    '@keyframes nav-fade-in{from{opacity:0}to{opacity:1}}' +

    /* Mobile: tighten spacing */
    '@media(max-width:640px){' +
      '.site-nav{left:24px;right:24px;top:24px;}' +
      '.nav-wordmark{font-size:12px;}' +
      '.nav-links{gap:18px;}' +
      '.nav-link{font-size:12px;}' +
    '}';
  document.head.appendChild(s);
})();

// ─── RENDERER ───────────────────────────────��────────────────────────────────

(function () {
  function renderNav() {
    var nav = document.getElementById('site-nav');
    if (!nav) return;
    nav.className = 'site-nav';

    var wordmark = NAV_ITEMS.find(function (i) { return i.id === 'home'; });
    var links    = NAV_ITEMS.filter(function (i) { return i.id !== 'home' && i.visible; });

    var html =
      '<a class="nav-wordmark" href="' + wordmark.href + '">' +
        '<img class="nav-logo" src="favicons/favicon-32x32.png" alt="">' +
        wordmark.label +
      '</a>';

    if (links.length > 0) {
      html +=
        '<div class="nav-links">' +
          links.map(function (item) {
            return '<a class="nav-link" href="' + item.href + '">' + item.label + '</a>';
          }).join('') +
        '</div>';
    }

    nav.innerHTML = html;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderNav);
  } else {
    renderNav();
  }
})();
