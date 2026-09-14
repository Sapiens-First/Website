const local = window.location.protocol === 'file:';
const footerColsHtml = SITE_CONFIG.FOOTER_GROUPS.map((group) => {
  const linksHtml = group.links.map((link) => {
    const href = link.external ? link.href : SITE_CONFIG.pageLink(link.page);
    const attrs = link.external ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${href}"${attrs}>${link.label}</a>`;
  }).join('\n          ');
  return `
        <div class="foot-col">
          <span class="foot-col-title">${group.title}</span>
          ${linksHtml}
        </div>`;
}).join('\n');

document.querySelector('footer.site-footer').innerHTML = `
  <div class="fun-layer" aria-hidden="true">
    <i style="left:38%;bottom:14%;width:34px;color:var(--paper)">
      <svg class="moon" viewBox="0 0 40 40" width="34" height="34"><mask id="foot-moon-mask"><rect width="40" height="40" fill="#fff"/><circle cx="27" cy="13" r="14" fill="#000"/></mask><circle cx="20" cy="20" r="16" fill="currentColor" mask="url(#foot-moon-mask)"/></svg>
    </i>
    <i style="left:45%;bottom:36%;width:9px;color:var(--yellow);transform:rotate(10deg)"><svg class="star" viewBox="0 0 24 24" width="9" height="9"><rect width="24" height="24" fill="currentColor"/></svg></i>
    <i style="left:33%;bottom:32%;width:7px;color:var(--yellow);transform:rotate(-14deg)"><svg class="star" viewBox="0 0 24 24" width="7" height="7"><rect width="24" height="24" fill="currentColor"/></svg></i>
  </div>
  <div class="wrap">
    <div class="foot-top">
      <a class="foot-brand" href="${local ? 'index.html' : '/'}">
        <img src="favicons/android-chrome-192x192.png" alt="">
        <span>Sapiens First</span>
      </a>
      <div class="foot-cols">${footerColsHtml}
      </div>
    </div>
    <div class="foot-bottom">
      <span>© ${new Date().getFullYear()} Sapiens First. All rights reserved.</span>
    </div>
  </div>
`;
