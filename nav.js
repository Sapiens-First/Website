(function () {
  const header = document.querySelector('header.site-header');
  if (!header) return;
  const brandLogoSrc = new URL('favicons/android-chrome-192x192.png', document.currentScript.src).href;
  const signupScriptSrc = new URL('signup.js', document.currentScript.src).href;

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
          <a class="nav-cta donate${isActive('donate') ? ' current' : ''}" href="${SITE_CONFIG.pageLink('donate')}">Donate</a>
          <a class="nav-cta join${isActive('join') ? ' current' : ''}" href="${SITE_CONFIG.pageLink('join')}">Membership</a>
        </div>
      </nav>
    </div>
  `;

  // Keep Join one click away from email entry on every page.
  let signupReady;
  let dialog;
  document.addEventListener('click', async event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href);
    const isJoin = url.origin === location.origin && /\/(join|join\.html)$/.test(url.pathname);
    if (!isJoin || link.target === '_blank' || link.hasAttribute('download')) return;
    event.preventDefault();
    try {
      if (typeof createSignupForm !== 'function') {
        if (!signupReady) {
          signupReady = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = signupScriptSrc;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }
        await signupReady;
      }
      if (!dialog) {
        dialog = document.createElement('dialog');
        dialog.className = 'join-dialog';
        dialog.setAttribute('aria-labelledby', 'join-dialog-title');
        dialog.setAttribute('aria-describedby', 'join-dialog-description');
        dialog.innerHTML = `<button class="join-dialog-close" type="button" aria-label="Close signup">×</button>
          <div class="label">Get involved</div>
          <h2 id="join-dialog-title">Join Sapiens First</h2>
          <p id="join-dialog-description">Interested in becoming a member? Leave your email and we'll be in touch.</p>`;
        dialog.appendChild(createSignupForm({ interest: 'membership' }));
        document.body.appendChild(dialog);
        dialog.querySelector('.join-dialog-close').addEventListener('click', () => dialog.close());
        dialog.addEventListener('click', event => {
          if (event.target !== dialog) return;
          const box = dialog.getBoundingClientRect();
          if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
        });
      }
      if (!dialog.open) dialog.showModal();
      const input = dialog.querySelector('input');
      if (input) input.focus();
    } catch (_) {
      // The email form is also available directly if the dialog cannot load.
      window.location.assign(link.href);
    }
  });
})();
