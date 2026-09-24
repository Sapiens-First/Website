/* One small glyph per object Type, reused identically across Table, People,
   breadcrumbs and lists. Loaded before the other atlas-*.js render modules
   so they can all call atlasIcon(type) without duplicating the mapping.
   Icons are non-text elements only (CSS mask-image via atlas.css), so they
   never affect textContent-based assertions in scripts/tests/. */
const ATLAS_ICON_SLUG = {
  Mission: 'mission', Pillar: 'pillar', Objective: 'pillar', Program: 'program',
  Domain: 'product', 'Product/Service': 'product', Project: 'project',
  Circle: 'circle', Role: 'role',
};
function atlasIconSlug(type) { return ATLAS_ICON_SLUG[type] || 'role'; }
function atlasIcon(type) {
  const span = document.createElement('span');
  span.className = `atlas-icon atlas-icon--${atlasIconSlug(type)}`;
  span.setAttribute('aria-hidden', 'true');
  return span;
}
if (typeof module !== 'undefined') module.exports = { atlasIconSlug, atlasIcon };
