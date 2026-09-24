/* Deterministic nested layout. Circle area is not an organizational metric. */
function atlasCircleLayout(records) {
  const nodes = new Map(records.map(row => [row.ID, { row, children: [] }]));
  const roots = [], unplaced = [];
  for (const node of nodes.values()) {
    const parent = nodes.get(node.row['Parent Circle ID']);
    if (parent?.row.Type === 'Circle') parent.children.push(node);
    else if (!node.row['Parent Circle ID'] && node.row.Type === 'Circle') roots.push(node);
    else unplaced.push(node);
  }
  function pack(node, seen = new Set()) {
    if (seen.has(node.row.ID)) return;
    const path = new Set(seen).add(node.row.ID);
    node.children.forEach(child => pack(child, path));
    const ordered = [...node.children].sort((a, b) => b.r - a.r || a.row.ID.localeCompare(b.row.ID));
    const placed = [];
    for (const child of ordered) {
      let best = null;
      const candidates = placed.length ? [] : [{ x: 0, y: 0 }];
      for (const other of placed) {
        const distance = child.r + other.r + 8;
        for (let step = 0; step < 48; step++) {
          const angle = step * Math.PI / 24;
          candidates.push({ x: other.x + Math.cos(angle) * distance, y: other.y + Math.sin(angle) * distance });
        }
      }
      for (const point of candidates) {
        if (placed.some(other => Math.hypot(point.x - other.x, point.y - other.y) < child.r + other.r + 7.9)) continue;
        const score = Math.max(Math.hypot(point.x, point.y) + child.r, ...placed.map(other => Math.hypot(other.x, other.y) + other.r));
        if (!best || score < best.score) best = { ...point, score };
      }
      // Tangent candidates always leave room outside the existing cluster.
      child.x = best?.x ?? placed.reduce((right, other) => Math.max(right, other.x + other.r), 0) + child.r + 8;
      child.y = best?.y ?? 0;
      placed.push(child);
    }
    if (!placed.length) { node.r = node.row.Type === 'Circle' ? 48 : 35; return; }
    const cx = (Math.min(...placed.map(n => n.x - n.r)) + Math.max(...placed.map(n => n.x + n.r))) / 2;
    const cy = (Math.min(...placed.map(n => n.y - n.r)) + Math.max(...placed.map(n => n.y + n.r))) / 2;
    placed.forEach(child => { child.x -= cx; child.y -= cy; });
    node.r = Math.max(...placed.map(child => Math.hypot(child.x, child.y) + child.r)) + 66;
  }
  roots.forEach(root => pack(root));
  return { nodes, roots, unplaced };
}

function renderAtlasCircles(host, records, selected, matches, query) {
  // Captured before the host is cleared, so the outgoing view can keep
  // animating (zooming further in/out and fading) as an overlay while the
  // new one animates in underneath it — a true crossfade rather than a
  // hard swap plus a one-sided entrance.
  const outgoingSvg = host.querySelector('.atlas-circle-svg');
  const prevFocusId = host.dataset.atlasFocusId || '';
  const prevChainLen = Number(host.dataset.atlasChainLen || 0);
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  host.replaceChildren();
  // Retired wrappers stay addressable in records/history, not in the live map.
  const { nodes, roots, unplaced } = atlasCircleLayout(records.filter(row => row.Status !== 'Retired'));
  const picked = nodes.get(selected);
  const focus = picked?.row.Type === 'Circle' ? picked : nodes.get(picked?.row['Parent Circle ID']) || roots[0];
  const html = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const url = id => `#governance/circles/${id}`;
  const recordLink = row => { const a = html('a', row.Name); a.href = url(row.ID); a.prepend(atlasIcon(row.Type)); return a; };

  // Breadcrumbs: ancestors are links, the current focus is plain text (it's
  // where you already are), separated by a small caret to read as a trail
  // rather than a flat list of slash-joined links.
  const nav = html('nav'); nav.className = 'atlas-circle-breadcrumbs'; nav.setAttribute('aria-label', 'Circle hierarchy');
  const reset = html('a', 'All circles'); reset.href = '#governance/circles'; nav.append(reset);
  let chain = [];
  if (focus) {
    chain = []; let node = focus; const seen = new Set();
    while (node && !seen.has(node.row.ID)) { seen.add(node.row.ID); chain.unshift(node); node = nodes.get(node.row['Parent Circle ID']); }
    chain.forEach((item, i) => {
      nav.append(html('span', '›', 'atlas-circle-crumb-sep'));
      if (i === chain.length - 1) {
        const current = html('span', item.row.Name, 'atlas-circle-crumb-current');
        current.setAttribute('aria-current', 'page');
        nav.append(current);
      } else {
        nav.append(recordLink(item.row));
      }
    });
  }
  host.append(nav);
  // More than one root circle exists (e.g. Berkeley Chapter, independent of
  // Sapiens First Global) — surface a picker right under the breadcrumbs so
  // every root stays obviously reachable, not just technically parentless
  // and buried below the chart.
  if (roots.length > 1) {
    const picker = html('nav'); picker.className = 'atlas-root-picker'; picker.setAttribute('aria-label', 'Root circles');
    picker.append(html('span', 'Root circles:', 'atlas-root-picker-label'));
    roots.forEach(node => {
      const a = recordLink(node.row);
      if (chain[0] === node) a.setAttribute('aria-current', 'page');
      picker.append(a);
    });
    host.append(picker);
  }
  if (records.some(row => row.ID === selected && row.Status === 'Retired')) {
    host.append(html('p', 'This record is retired. The map shows current roles and circles.', 'atlas-circle-hint'));
  }

  if (query) {
    const found = html('div'); found.className = 'atlas-circle-search';
    found.append(html('p', `${matches.length} search ${matches.length === 1 ? 'result' : 'results'}`));
    const list = html('ul');
    matches.forEach(row => { const li = html('li'); li.append(recordLink(row)); list.append(li); });
    found.append(list); host.append(found);
  }

  if (focus) {
    const ns = 'http://www.w3.org/2000/svg';
    const svgEl = (tag, attrs = {}) => {
      const node = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value)); return node;
    };
    const svg = svgEl('svg', { viewBox: '-470 -470 940 940', role: 'group', 'aria-label': `${focus.row.Name}: nested governance circles` });
    svg.classList.add('atlas-circle-svg');

    // Palette is keyed to each node's top-level circle (the direct child of
    // the root it descends from), assigned in a fixed order derived from the
    // root's own children — not from the currently focused subtree — so a
    // circle's hue is stable no matter which level you're viewing, and a
    // role's color always traces back to the same lineage. Nested subcircles
    // lighten progressively so depth within a lineage still reads visually.
    const palette = ['#efe5d4', '#f4c9ad', '#d5e1bd', '#d4dff0', '#e5cde2', '#f4df9a', '#bfe3d8', '#e8c2c6'];
    const rootFill = '#f7f2e8';
    const topLevelOrder = (roots[0]?.children || []).map(child => child.row.ID);
    const colorFor = topId => palette[Math.max(0, topLevelOrder.indexOf(topId)) % palette.length];
    const lighten = (hex, amount) => {
      const n = parseInt(hex.slice(1), 16);
      const mix = c => Math.round(c + (255 - c) * amount);
      return `rgb(${mix((n >> 16) & 255)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`;
    };
    const lineageCache = new Map();
    function lineageOf(node) {
      if (lineageCache.has(node.row.ID)) return lineageCache.get(node.row.ID);
      const path = []; let current = node; const seen = new Set();
      while (current && !seen.has(current.row.ID)) { seen.add(current.row.ID); path.push(current); current = nodes.get(current.row['Parent Circle ID']); }
      const result = path.length <= 1 ? { topId: null, depth: 0 } : { topId: path[path.length - 2].row.ID, depth: path.length - 2 };
      lineageCache.set(node.row.ID, result);
      return result;
    }

    const scale = 440 / focus.r;
    const matched = new Set(matches.map(row => row.ID));
    function draw(node, x, y, depth) {
      const r = node.r * scale;
      const group = svgEl('g', { 'data-node-id': node.row.ID, 'data-parent-id': node.row['Parent Circle ID'] || '' });
      // At the global overview, reveal only the immediate layer.
      // Drilling into a circle reveals its descendants and role links.
      const anchor = svgEl('a', { href: url(node.row.ID), tabindex: '0', 'aria-label': `${node.row.Type}: ${node.row.Name}${node.row.Type === 'Circle' ? ', explore circle' : ', view responsibilities'}` });
      anchor.classList.add(node.row.Type === 'Role' ? 'atlas-node-role' : 'atlas-node-circle');
      const title = svgEl('title'); title.textContent = node.row.Name; anchor.append(title);
      const { topId, depth: lineageDepth } = lineageOf(node);
      const isRole = node.row.Type === 'Role';
      const fill = isRole ? '#fffaf2' : (topId ? lighten(colorFor(topId), Math.min(0.5, lineageDepth * 0.16)) : rootFill);
      const stroke = isRole ? (topId ? colorFor(topId) : '#8a8272') : '#29241f';
      const circleAttrs = { cx: x, cy: y, r, fill, 'stroke-width': depth === 0 ? 2 : 1.5, stroke };
      if (isRole) circleAttrs['stroke-dasharray'] = '5 4';
      anchor.append(svgEl('circle', circleAttrs));
      if (query && matched.has(node.row.ID)) anchor.classList.add('atlas-circle-match');
      if (selected === node.row.ID) anchor.classList.add('atlas-circle-selected');
      let label = null, tip = null;
      if (depth <= 1) {
        const fontSize = depth === 0 ? 19 : Math.max(11, Math.min(17, r / 4.4));
        const limit = Math.max(10, Math.floor(r * 1.55 / (fontSize * .58)));
        const words = node.row.Name.split(/\s+/), lines = [];
        let line = '';
        for (const word of words) {
          if (line && (line + ' ' + word).length > limit) { lines.push(line); line = word; } else line += (line ? ' ' : '') + word;
        }
        if (line) lines.push(line);
        const labelY = node.children.length && !(chain.length === 1 && depth === 1) ? y - r + 18 : y - (lines.length - 1) * fontSize * .58;
        const text = svgEl('text', { x, y: labelY, 'font-size': fontSize, 'text-anchor': 'middle', 'pointer-events': 'none', 'font-weight': node.row.Type === 'Circle' ? 700 : 500 });
        lines.forEach((value, i) => { const span = svgEl('tspan', { x, dy: i ? fontSize * 1.15 : 0 }); span.textContent = value; text.append(span); });
        label = svgEl('g', { 'aria-hidden': 'true', 'pointer-events': 'none' });
        if (node.row.Type === 'Circle') {
          const width = Math.max(...lines.map(value => value.length)) * fontSize * .6 + 16;
          label.append(svgEl('rect', { x: x - width / 2, y: labelY - fontSize, width, height: lines.length * fontSize * 1.15 + 8, rx: 10, class: 'atlas-circle-label-bg', fill: '#29241f' }));
          text.classList.add('atlas-circle-label');
        }
        label.append(text);
      } else {
        // Too small to label inline: a hover/focus tooltip stands in instead.
        tip = svgEl('text', { x, y: y - r - 6, 'text-anchor': 'middle', 'font-size': 11, 'pointer-events': 'none' });
        tip.classList.add('atlas-circle-tip');
        tip.textContent = node.row.Name;
      }
      group.append(anchor);
      if (chain.length > 1 || depth === 0) node.children.forEach(child => group.append(draw(child, x + child.x * scale, y + child.y * scale, depth + 1)));
      if (label) group.append(label);
      if (tip) group.append(tip);
      return group;
    }
    svg.append(draw(focus, 0, 0, 0));

    // Clicking the empty background (outside every drawn circle, including
    // the margin around the outer ring) zooms out to the parent circle —
    // same destination as the breadcrumb's previous link, just a bigger,
    // more discoverable target. A no-op at the root, where there's nothing
    // to zoom out to.
    const parentId = focus.row['Parent Circle ID'];
    if (parentId && nodes.get(parentId)) {
      svg.classList.add('atlas-circle-zoomable');
      svg.addEventListener('click', event => {
        if (event.target === svg) location.hash = url(parentId);
      });
    }

    // Smoother drill-in/out: scale+fade the newly drawn level in from a
    // slightly smaller (drilling in) or larger (drilling out) starting
    // point instead of the level just appearing, so it reads as zooming —
    // and let the level being replaced animate out the same way, as an
    // overlay on top of the new one, so both halves of the zoom read as one
    // continuous motion rather than an instant swap plus a one-sided
    // entrance. Skipped on first paint and on renders that don't change
    // focus level (e.g. typing in search) so it never fires more often than
    // needed, and skipped entirely under reduced motion.
    const stage = html('div'); stage.className = 'atlas-circle-stage';
    stage.append(svg);
    const zoomChanged = Boolean(prevFocusId) && prevFocusId !== focus.row.ID;
    const zoomingIn = chain.length >= prevChainLen;
    if (zoomChanged && !reducedMotion) {
      svg.classList.add(zoomingIn ? 'atlas-circle-enter-in' : 'atlas-circle-enter-out');
      if (outgoingSvg) {
        // Positioning only, in this synchronous pass — no transform/opacity
        // change yet, so it commits without triggering a transition. The
        // actual leave-in/leave-out animation is added a frame later,
        // alongside the entrance class removal below, so both halves of the
        // crossfade start moving together.
        outgoingSvg.classList.remove('atlas-circle-enter-in', 'atlas-circle-enter-out');
        outgoingSvg.classList.add('atlas-circle-leaving');
        stage.append(outgoingSvg);
        outgoingSvg.addEventListener('transitionend', () => outgoingSvg.remove(), { once: true });
        setTimeout(() => outgoingSvg.remove(), 500);
      }
    }
    host.append(stage);
    if (zoomChanged && !reducedMotion) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        svg.classList.remove('atlas-circle-enter-in', 'atlas-circle-enter-out');
        outgoingSvg?.classList.add(zoomingIn ? 'atlas-circle-leave-in' : 'atlas-circle-leave-out');
      }));
    }
    host.dataset.atlasFocusId = focus.row.ID;
    host.dataset.atlasChainLen = String(chain.length);

    const note = html('p', focus.children.length ? 'Select a circle to explore it, or a role to read its responsibilities. Sizes show containment, not importance.' : 'No roles or subcircles are recorded inside this circle yet.');
    note.className = 'atlas-circle-hint'; host.append(note);
    // Full-size text links keep every immediate child usable on small screens.
    const children = html('details'); children.className = 'atlas-circle-children';
    children.append(html('summary', `Inside ${focus.row.Name} (${focus.children.length})`));
    const list = html('ul');
    focus.children.forEach(child => { const li = html('li'); li.append(recordLink(child.row), html('span', ` · ${child.row.Type}`)); list.append(li); });
    children.append(list); host.append(children);
  } else host.append(html('p', 'No root circle is recorded yet. Use the table to review the governance records.'));
  if (unplaced.length) {
    const section = html('details'); section.className = 'atlas-unplaced';
    const summary = html('summary');
    summary.append(html('span', 'Circle not assigned'), ' ', html('span', String(unplaced.length), 'atlas-badge atlas-unplaced-count'));
    section.append(summary);
    section.append(html('p', 'These roles have no assigned circle. Suggested groups are shown below.'));
    // Group by crude name-word overlap with existing circle names, purely as
    // a navigational hint. This never changes any record's actual parent.
    const circleNodes = [...nodes.values()].filter(n => n.row.Type === 'Circle');
    const stopwords = new Set(['and', 'the', 'of', 'for', 'circle', 'a', 'an', 'to', 'in', 'program']);
    const wordsOf = name => (name || '').toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2 && !stopwords.has(w));
    const guess = row => {
      const rowWords = wordsOf(row.Name);
      let best = null, bestScore = 0;
      circleNodes.forEach(candidate => {
        const overlap = wordsOf(candidate.row.Name).filter(w => rowWords.includes(w)).length;
        if (overlap > bestScore) { bestScore = overlap; best = candidate; }
      });
      return best;
    };
    const groups = new Map();
    unplaced.forEach(node => {
      const match = guess(node.row);
      const key = match ? match.row.ID : '';
      if (!groups.has(key)) groups.set(key, { label: match ? match.row.Name : 'No likely match', items: [] });
      groups.get(key).items.push(node);
    });
    [...groups.values()]
      .sort((a, b) => (a.label === 'No likely match') - (b.label === 'No likely match') || a.label.localeCompare(b.label))
      .forEach(group => {
        section.append(html('h4', group.label === 'No likely match' ? group.label : `Possibly related to ${group.label}`, 'atlas-unplaced-group'));
        const list = html('ul');
        group.items.forEach(node => { const li = html('li'); li.append(recordLink(node.row), html('span', ` · ${node.row.Type}`)); list.append(li); });
        section.append(list);
      });
    host.append(section);
  }
}
if (typeof module !== 'undefined') module.exports = { atlasCircleLayout };
