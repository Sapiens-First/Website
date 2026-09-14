(function () {
  const header = document.querySelector('header.site-header');
  if (!header) return;
  const brandLogoSrc = new URL('favicons/android-chrome-192x192.png', document.currentScript.src).href;

  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const file = path.split('/').pop().replace(/\.html$/, '');

  // Per-page active-state rules; each page can match multiple URL shapes
  // (extensionless production paths, raw .html files, path prefixes, etc.)
  // so this can't be derived purely from the flat NAV_LINKS data.
  const activeMatchers = {
    about: () => path === '/about' || path.startsWith('/about/') || file === 'about',
    fellowship: () => path === '/fellowship' || file === 'fellowship',
    'start-a-circle': () => path === '/start-a-circle' || file === 'start-a-circle',
    join: () => path === '/join' || file === 'join' || file === 'membership',
    donate: () => path === '/donate' || file === 'donate',
  };

  const isActive = page => (activeMatchers[page] && activeMatchers[page]());

  const navLink = ({ page, label }) => {
    const current = isActive(page) ? ' current' : '';
    return `<a class="nav-fellowship${current}" href="${SITE_CONFIG.pageLink(page)}">${label}</a>`;
  };

  // Join and Donate render as the dedicated .nav-cta buttons below, not as
  // regular links, even though they're flagged nav:true in config.js for the
  // old nav system's sake.
  const navLinksHtml = SITE_CONFIG.NAV_LINKS
    .filter(link => link.page !== 'join' && link.page !== 'donate')
    .map(navLink).join('\n        ');

  header.innerHTML = `
    <div class="wrap">
      <nav>
        <a class="brand" href="/">
          <img class="brand-logo" src="${brandLogoSrc}" alt="" width="30" height="30">
          <span class="brand-name">Sapiens First</span>
        </a>
        <div class="nav-actions">
          ${navLinksHtml}
          <a class="nav-cta${isActive('donate') ? ' current' : ''}" href="${SITE_CONFIG.pageLink('donate')}">Donate</a>
          <a class="nav-cta join${isActive('join') ? ' current' : ''}" href="${SITE_CONFIG.pageLink('join')}">Join</a>
        </div>
      </nav>
    </div>
  `;
})();
