/* A work hierarchy: vertical position is the number of parent links back
   to the mission, not a GTD horizon or a measure of importance. */
const ATLAS_TREE_LEVEL_GAP = 90;
const ATLAS_TREE_SIBLING_GAP = 26;

function atlasTreeBandLabel(row) {
  return row[0].depth === 0 ? 'Mission' : `Connection level ${row[0].depth}`;
}

function atlasTreeWrapLabel(name, maxChars) {
  const words = String(name).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (line && (line + ' ' + word).length > maxChars) { lines.push(line); line = word; }
    else line += (line ? ' ' : '') + word;
  }
  if (line) lines.push(line);
  return lines;
}

function atlasTreeSizeNode(node, isRoot) {
  const fontSize = isRoot ? 18 : 13;
  const maxChars = isRoot ? 40 : 20;
  const lines = atlasTreeWrapLabel(node.row.Name, maxChars);
  const charWidth = fontSize * 0.58;
  const textWidth = Math.max(...lines.map(line => line.length)) * charWidth;
  const w = Math.min(isRoot ? 520 : 200, Math.max(isRoot ? 260 : 108, textWidth + 30));
  const lineHeight = fontSize * 1.15;
  const h = lines.length * lineHeight + (isRoot ? 46 : 42);
  return { lines, w, h, fontSize, lineHeight };
}

function atlasTreeLayout(records) {
  const nodes = new Map(records.map(row => [row.ID, { row, children: [] }]));
  const root = [...nodes.values()].find(node => node.row.Type === 'Mission') || null;

  // Walk a node's Parent ID chain up to the root. Returns -1 (unresolved)
  // on a missing/broken reference or a cycle, rather than guessing a depth.
  function depthOf(node) {
    if (node === root) return 0;
    const seen = new Set();
    let current = node, hops = 0;
    while (current) {
      if (seen.has(current.row.ID)) return -1;
      seen.add(current.row.ID);
      if (current === root) return hops;
      const parentId = current.row['Parent ID'];
      if (!parentId) return -1;
      const parent = nodes.get(parentId);
      if (!parent) return -1;
      current = parent;
      hops++;
    }
    return -1;
  }

  const unplaced = [];
  const byDepth = new Map();
  if (root) { root.depth = 0; byDepth.set(0, [root]); }
  for (const node of nodes.values()) {
    if (node === root) continue;
    const depth = depthOf(node);
    if (depth < 1) { unplaced.push(node); continue; }
    node.depth = depth;
    const parent = nodes.get(node.row['Parent ID']);
    parent.children.push(node);
    if (!byDepth.has(depth)) byDepth.set(depth, []);
    byDepth.get(depth).push(node);
  }
  const maxDepth = byDepth.size ? Math.max(...byDepth.keys()) : -1;
  const levels = Array.from({ length: maxDepth + 1 }, (_, d) => byDepth.get(d) || []);

  function sortChildren(node) {
    node.children.sort((a, b) => a.row.Name.localeCompare(b.row.Name) || a.row.ID.localeCompare(b.row.ID));
    node.children.forEach(sortChildren);
  }
  if (root) sortChildren(root);

  levels.forEach(row => row.forEach(node => Object.assign(node, atlasTreeSizeNode(node, node === root))));

  // Horizontal placement: leaves consume a running cursor left-to-right in
  // depth-first (sorted) order; internal nodes center over their own
  // children's span. The same "tidy tree" idea nested-circle packing uses
  // for containment, applied here to a layered layout instead.
  let cursor = 0;
  function place(node) {
    if (!node.children.length) {
      node.x = cursor + node.w / 2;
      cursor += node.w + ATLAS_TREE_SIBLING_GAP;
      return;
    }
    node.children.forEach(place);
    const first = node.children[0], last = node.children[node.children.length - 1];
    node.x = (first.x + last.x) / 2;
  }
  if (root) place(root);

  // Fix-up pass: an internal node's own box can be wider than the span of
  // its children (e.g. a single-child branch), which pure centering above
  // does not account for. Nudge rightward within each row until no two
  // boxes in the same horizon band overlap. Never changes parentage.
  levels.forEach(row => {
    const ordered = [...row].sort((a, b) => a.x - b.x);
    for (let i = 1; i < ordered.length; i++) {
      const prev = ordered[i - 1], cur = ordered[i];
      const minGap = prev.w / 2 + cur.w / 2 + ATLAS_TREE_SIBLING_GAP;
      if (cur.x - prev.x < minGap) cur.x = prev.x + minGap;
    }
  });

  // Vertical placement: one band per structural depth, sized to its
  // tallest label, root-to-leaf top to bottom.
  let cursorY = 0;
  levels.forEach(row => {
    const rowHeight = Math.max(...row.map(node => node.h));
    const centerY = cursorY + rowHeight / 2;
    row.forEach(node => { node.y = centerY; });
    cursorY += rowHeight + ATLAS_TREE_LEVEL_GAP;
  });

  const placed = levels.flat();
  const margin = 44;
  // Reserve space so band labels never sit under a node box.
  const leftGutter = levels.length ? Math.max(...levels.map(row => atlasTreeBandLabel(row).length)) * 6.4 + margin : margin;
  let width = 0, height = 0;
  if (placed.length) {
    const minX = Math.min(...placed.map(node => node.x - node.w / 2));
    const maxX = Math.max(...placed.map(node => node.x + node.w / 2));
    placed.forEach(node => { node.x += leftGutter - minX; node.y += margin; });
    width = (maxX - minX) + leftGutter + margin;
    height = cursorY - ATLAS_TREE_LEVEL_GAP + margin * 2;
  }

  return { nodes, root, levels, unplaced, width, height };
}

function renderAtlasTree(host, records, selected, matches, query) {
  // ATLAS_DATA arrays are immutable for the lifetime of this static page.
  const previous = host._atlasTree;
  const reusable = previous?.records === records;
  const scrollLeft = reusable ? previous.scroller.scrollLeft : 0;
  const layout = reusable ? previous.layout : atlasTreeLayout(records);
  const { nodes, root, levels, unplaced, width, height } = layout;
  host.replaceChildren();
  const html = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const url = id => `#domains/tree/${id}`;
  const recordLink = row => { const a = html('a', row.Name); a.href = url(row.ID); return a; };

  // Breadcrumbs are a navigation aid pointing at the current selection's
  // ancestry — unlike the circle view, selecting a node never re-roots or
  // re-lays-out the tree, since vertical position is a fixed property
  // (containment depth), not something drilling should change.
  const nav = html('nav'); nav.className = 'atlas-tree-breadcrumbs'; nav.setAttribute('aria-label', 'Domain hierarchy');
  const reset = html('a', 'Full tree'); reset.href = '#domains/tree'; nav.append(reset);
  const selectedNode = nodes.get(selected);
  if (selectedNode) {
    const chain = []; let node = selectedNode; const seen = new Set();
    while (node && !seen.has(node.row.ID)) { seen.add(node.row.ID); chain.unshift(node); node = nodes.get(node.row['Parent ID']); }
    chain.forEach((item, i) => {
      nav.append(html('span', '›', 'atlas-tree-crumb-sep'));
      if (i === chain.length - 1) {
        const current = html('span', item.row.Name, 'atlas-tree-crumb-current');
        current.setAttribute('aria-current', 'page');
        nav.append(current);
      } else nav.append(recordLink(item.row));
    });
  }
  host.append(nav);

  if (query) {
    const found = html('div'); found.className = 'atlas-tree-search';
    found.append(html('p', `${matches.length} search ${matches.length === 1 ? 'result' : 'results'}`));
    const list = html('ul');
    matches.forEach(row => { const li = html('li'); li.append(recordLink(row)); list.append(li); });
    found.append(list); host.append(found);
  }

  if (root && levels.length) {
    const ns = 'http://www.w3.org/2000/svg';
    const svgEl = (tag, attrs = {}) => {
      const node = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value)); return node;
    };
    // Rendered at native pixel size (not scaled to container width like the
    // roughly-square circle view) so labels stay legible on a wide, short
    // tree; #atlas-tree-chart scrolls horizontally instead, the same way
    // the plain domains table already scrolls at narrow widths.
    let svg = reusable ? previous.svg : null;
    if (!svg) {
      svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, width, height, role: 'group', 'aria-label': 'Work tree: mission and connected work, all statuses' });
      svg.classList.add('atlas-tree-svg');

      // Palette distinguishes connection depth without assigning GTD horizons.
      const palette = ['#29241f', '#5a5346', '#d5c9ad', '#e6d9ad', '#f1e9d3', '#f7f2e8'];
      const textColorFor = depth => depth <= 1 ? '#fffaf2' : '#29241f';

      // Build connectors separately so they paint above bands and below nodes.
      const connectors = svgEl('g', { class: 'atlas-tree-connectors' });
      levels.forEach(row => row.forEach(node => {
        node.children.forEach(child => {
          const startY = node.y + node.h / 2, endY = child.y - child.h / 2;
          const midY = (startY + endY) / 2;
          const path = svgEl('path', { d: `M ${node.x} ${startY} C ${node.x} ${midY}, ${child.x} ${midY}, ${child.x} ${endY}`, class: 'atlas-tree-edge' });
          connectors.append(path);
        });
      }));

      // Bands describe containment depth, never a GTD horizon.
      levels.forEach(row => {
        const bandHeight = Math.max(...row.map(node => node.h)) + 36;
        svg.append(svgEl('rect', { x: 0, y: row[0].y - bandHeight / 2, width, height: bandHeight, rx: 8, fill: row[0].depth % 2 ? '#e9e0ce' : '#f7f2e8', 'pointer-events': 'none' }));
        const tag = svgEl('text', { x: 6, y: row[0].y, 'dominant-baseline': 'middle', class: 'atlas-tree-band' });
        tag.textContent = atlasTreeBandLabel(row);
        svg.append(tag);
      });

      svg.append(connectors);
      levels.forEach(row => row.forEach(node => {
        const isRoot = node === root;
        const group = svgEl('g', { 'data-node-id': node.row.ID, 'data-parent-id': node.row['Parent ID'] || '' });
        const anchor = svgEl('a', { href: url(node.row.ID), tabindex: '0', 'aria-label': `${node.row.Type}: ${node.row.Name}, view record` });
        anchor.classList.add(isRoot ? 'atlas-tree-root' : 'atlas-tree-node');
        const title = svgEl('title'); title.textContent = node.row.Name; anchor.append(title);
        const fill = palette[Math.min(node.depth, palette.length - 1)];
        const rectAttrs = { x: node.x - node.w / 2, y: node.y - node.h / 2, width: node.w, height: node.h, rx: 10, fill, stroke: '#29241f', 'stroke-width': isRoot ? 2.5 : 1.5 };
        anchor.append(svgEl('rect', rectAttrs));
        const startY = node.y - (node.lines.length - 1) * node.lineHeight / 2;
        const text = svgEl('text', { x: node.x, y: startY, 'text-anchor': 'middle', 'font-size': node.fontSize, fill: textColorFor(node.depth), 'pointer-events': 'none', 'font-weight': isRoot ? 700 : 500 });
        node.lines.forEach((line, i) => { const tspan = svgEl('tspan', { x: node.x, dy: i ? node.lineHeight : 0 }); tspan.textContent = line; text.append(tspan); });
        const typeLabel = svgEl('text', { x: node.x, y: node.y - node.h / 2 + 17, 'text-anchor': 'middle', 'font-size': 10, fill: textColorFor(node.depth), 'pointer-events': 'none', opacity: .85 });
        typeLabel.textContent = node.row.Type;
        text.setAttribute('transform', 'translate(0 8)');
        anchor.append(typeLabel, text);
        group.append(anchor);
        svg.append(group);
      }));

    }
    // Keep the actual canvas alive across search and record selection.
    // Replacing it loses zoom, scroll position, and browser focus state.
    const scroller = reusable ? previous.scroller : html('div', undefined, 'atlas-tree-scroll');
    scroller.tabIndex = 0;
    scroller.setAttribute('role', 'region');
    scroller.setAttribute('aria-label', 'Work tree. Scroll horizontally to explore branches.');
    if (!reusable) scroller.append(svg);
    const state = { records, layout, svg, scroller, selected, zoom: reusable ? previous.zoom : 1 };
    host._atlasTree = state;
    const controls = html('div', undefined, 'atlas-tree-zoom');
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Tree zoom');
    const output = html('output');
    output.setAttribute('aria-label', 'Zoom level');
    const resize = zoom => {
      const center = (scroller.scrollLeft + scroller.clientWidth / 2) / state.zoom;
      state.zoom = Math.max(0.05, Math.min(2, zoom));
      svg.setAttribute('width', width * state.zoom);
      svg.setAttribute('height', height * state.zoom);
      output.textContent = `${Math.round(state.zoom * 100)}%`;
      scroller.scrollLeft = center * state.zoom - scroller.clientWidth / 2;
    };
    const button = (label, action) => {
      const control = html('button', label);
      control.type = 'button';
      control.addEventListener('click', action);
      controls.append(control);
    };
    button('Zoom out', () => resize(state.zoom / 1.25));
    controls.append(output);
    button('Zoom in', () => resize(state.zoom * 1.25));
    button('Fit tree', () => resize(scroller.clientWidth / width));
    button('Actual size', () => resize(1));
    host.append(controls, scroller);
    resize(state.zoom);
    scroller.scrollLeft = scrollLeft;
    const matchedIds = new Set(matches.map(row => row.ID));
    svg.querySelectorAll('[data-node-id]').forEach(group => {
      const id = group.dataset.nodeId;
      const anchor = group.querySelector('a');
      anchor.classList.toggle('atlas-tree-selected', selected === id);
      anchor.classList.toggle('atlas-tree-match', Boolean(query) && matchedIds.has(id));
      if (selected === id) anchor.setAttribute('aria-current', 'true');
      else anchor.removeAttribute('aria-current');
    });
    if (!reusable || previous.selected !== selected) {
      const focusNode = selectedNode || root;
      scroller.scrollTo({
        left: Math.max(0, focusNode.x * state.zoom - scroller.clientWidth / 2),
        behavior: reusable && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant',
      });
    }
  } else {
    host.append(html('p', 'No Mission record is recorded yet. Use the table to review the domains records.'));
  }

  const hint = html('p', 'Follow the lines to see how work connects to the mission. Rows show connections, not GTD horizons. All statuses are included. Use Fit tree for an overview, then Actual size to read labels. Box size does not indicate importance.');
  hint.className = 'atlas-tree-hint'; host.append(hint);

  if (unplaced.length) {
    const section = html('details'); section.className = 'atlas-unplaced';
    const summary = html('summary');
    summary.append(html('span', 'Not connected to the Mission'), ' ', html('span', String(unplaced.length), 'atlas-badge atlas-unplaced-count'));
    section.append(summary);
    section.append(html('p', 'These records have no Parent ID chain that resolves back to the Mission record. They are not placed in the tree above and have not been given an invented parent.'));
    const list = html('ul');
    unplaced.forEach(node => { const li = html('li'); li.append(recordLink(node.row), html('span', ` · ${node.row.Type}`)); list.append(li); });
    section.append(list);
    host.append(section);
  }
}
if (typeof module !== 'undefined') module.exports = { atlasTreeLayout };
