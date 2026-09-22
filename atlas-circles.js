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
  host.replaceChildren();
  const { nodes, roots, unplaced } = atlasCircleLayout(records);
  const picked = nodes.get(selected);
  const focus = picked?.row.Type === 'Circle' ? picked : nodes.get(picked?.row['Parent Circle ID']) || roots[0];
  const html = (tag, text) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; return node; };
  const url = id => `#governance/circles/${id}`;
  const recordLink = row => { const a = html('a', row.Name); a.href = url(row.ID); return a; };
  const nav = html('nav'); nav.className = 'atlas-circle-breadcrumbs'; nav.setAttribute('aria-label', 'Circle hierarchy');
  const reset = html('a', 'All circles'); reset.href = '#governance/circles'; nav.append(reset);
  if (focus) {
    const chain = []; let node = focus; const seen = new Set();
    while (node && !seen.has(node.row.ID)) { seen.add(node.row.ID); chain.unshift(node); node = nodes.get(node.row['Parent Circle ID']); }
    chain.forEach(item => { nav.append(html('span', ' / '), recordLink(item.row)); });
  }
  host.append(nav);
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
    const palette = ['#efe5d4', '#f4c9ad', '#d5e1bd', '#d4dff0', '#e5cde2', '#f4df9a'];
    const scale = 440 / focus.r;
    const matched = new Set(matches.map(row => row.ID));
    function draw(node, x, y, depth) {
      const r = node.r * scale;
      const group = svgEl('g', { 'data-node-id': node.row.ID, 'data-parent-id': node.row['Parent Circle ID'] || '' });
      const anchor = svgEl('a', { href: url(node.row.ID), tabindex: depth <= 1 ? '0' : '-1', 'aria-label': `${node.row.Type}: ${node.row.Name}${node.row.Type === 'Circle' ? ', explore circle' : ', view responsibilities'}` });
      const title = svgEl('title'); title.textContent = node.row.Name; anchor.append(title);
      const fill = node.row.Type === 'Role' ? '#fffaf2' : palette[Number(node.row.ID.slice(2)) % palette.length];
      anchor.append(svgEl('circle', { cx: x, cy: y, r, fill, 'stroke-width': depth === 0 ? 2 : 1.5, stroke: '#29241f' }));
      if (query && matched.has(node.row.ID)) anchor.classList.add('atlas-circle-match');
      if (selected === node.row.ID) anchor.classList.add('atlas-circle-selected');
      let label = null;
      if (depth <= 1) {
        const fontSize = depth === 0 ? 19 : Math.max(11, Math.min(17, r / 4.4));
        const limit = Math.max(10, Math.floor(r * 1.55 / (fontSize * .58)));
        const words = node.row.Name.split(/\s+/), lines = [];
        let line = '';
        for (const word of words) {
          if (line && (line + ' ' + word).length > limit) { lines.push(line); line = word; } else line += (line ? ' ' : '') + word;
        }
        if (line) lines.push(line);
        const labelY = node.children.length ? y - r + 18 : y - (lines.length - 1) * fontSize * .58;
        const text = svgEl('text', { x, y: labelY, 'font-size': fontSize, 'text-anchor': 'middle', 'pointer-events': 'none', 'font-weight': node.row.Type === 'Circle' ? 700 : 500 });
        lines.forEach((value, i) => { const span = svgEl('tspan', { x, dy: i ? fontSize * 1.15 : 0 }); span.textContent = value; text.append(span); });
        label = svgEl('a', { href: url(node.row.ID), tabindex: '-1', 'aria-hidden': 'true' });
        if (node.row.Type === 'Circle') {
          const width = Math.max(...lines.map(value => value.length)) * fontSize * .6 + 16;
          label.append(svgEl('rect', { x: x - width / 2, y: labelY - fontSize, width, height: lines.length * fontSize * 1.15 + 8, rx: 10, fill: '#29241f' }));
          text.classList.add('atlas-circle-label');
        }
        label.append(text);
      }
      group.append(anchor);
      node.children.forEach(child => group.append(draw(child, x + child.x * scale, y + child.y * scale, depth + 1)));
      if (label) group.append(label);
      return group;
    }
    svg.append(draw(focus, 0, 0, 0)); host.append(svg);
    const note = html('p', focus.children.length ? 'Select a circle to explore it, or a role to read its responsibilities. Sizes show containment, not importance.' : 'No roles or subcircles are recorded inside this circle yet.');
    note.className = 'atlas-circle-hint'; host.append(note);
    // Full-size text links keep every immediate child usable on small screens.
    const children = html('details'); children.className = 'atlas-circle-children';
    children.append(html('summary', `Inside ${focus.row.Name} (${focus.children.length})`));
    const list = html('ul');
    focus.children.forEach(child => { const li = html('li'); li.append(recordLink(child.row), html('span', ` · ${child.row.Type}`)); list.append(li); });
    children.append(list); host.append(children);
  } else host.append(html('p', 'No root circle is recorded yet. Use the table to review the governance records.'));
  if (roots.length > 1) {
    host.append(html('h3', 'Root circles')); const list = html('ul');
    roots.forEach(node => { const li = html('li'); li.append(recordLink(node.row)); list.append(li); }); host.append(list);
  }
  if (unplaced.length) {
    const section = html('details'); section.className = 'atlas-unplaced';
    section.append(html('summary', `Circle not assigned (${unplaced.length})`));
    section.append(html('p', 'These records have no recorded containing circle. They have not been placed inside the organization chart.'));
    const list = html('ul'); unplaced.forEach(node => { const li = html('li'); li.append(recordLink(node.row)); list.append(li); });
    section.append(list); host.append(section);
  }
}
if (typeof module !== 'undefined') module.exports = { atlasCircleLayout };
