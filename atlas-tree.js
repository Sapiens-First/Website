/* Sapiens First planning horizons. Parent links remain the source of
   containment; Type determines a planning band, not authority or deadlines. */
const ATLAS_TREE_LEVEL_GAP = 80;
const ATLAS_TREE_SIBLING_GAP = 30;
const ATLAS_HORIZONS = [
  { label: 'H4 · Mission', time: '~3 years', question: 'What future are we building?', color: '#3155a4', fill: '#dce8ff', card: '#c2d5ff' },
  { label: 'H3 · Strategic pillars', time: '~1 year', question: 'Where must we make progress?', color: '#78439b', fill: '#eee2fa', card: '#dac1f0' },
  { label: 'H2 · Programs', time: '~6 months', question: 'What sustained efforts move us forward?', color: '#9a520c', fill: '#fff0d2', card: '#ffda91' },
  { label: 'H1 · Products & projects', time: '~3 months', question: 'What are we delivering or improving?', color: '#176758', fill: '#ddf2e9', card: '#ace0cb' },
];
const ATLAS_TYPE_BAND = { Mission: 0, Pillar: 1, Objective: 1, Program: 2, Domain: 3, 'Product/Service': 3, Project: 3 };

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
  const fontSize = isRoot ? 19 : 14;
  const maxChars = isRoot ? 40 : 20;
  const lines = atlasTreeWrapLabel(isRoot ? (node.row.Purpose || node.row.Name) : node.row.Name, maxChars);
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
  const levels = root ? ATLAS_HORIZONS.map(() => []) : [];
  if (root) { root.depth = 0; root.band = 0; levels[0].push(root); }
  for (const node of nodes.values()) {
    if (node === root) continue;
    const depth = depthOf(node);
    if (depth < 1) { unplaced.push(node); continue; }
    node.depth = depth;
    const parent = nodes.get(node.row['Parent ID']);
    parent.children.push(node);
    node.band = ATLAS_TYPE_BAND[node.row.Type] ?? Math.min(3, depth);
    levels[node.band].push(node);
  }

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

  // Vertical placement: one planning band per type group, with room for labels.
  let cursorY = 0;
  levels.forEach(row => {
    const rowHeight = Math.max(100, ...row.map(node => node.h));
    const centerY = cursorY + rowHeight / 2;
    row.forEach(node => { node.y = centerY; });
    cursorY += rowHeight + ATLAS_TREE_LEVEL_GAP;
  });

  const placed = levels.flat();
  const margin = 44;
  // Reserve space so band labels never sit under a node box.
  const leftGutter = margin;
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
  const allRecords = records;
  const mission = records.find(row => row.Type === 'Mission');
  let branch = host.dataset.branch || '';
  const ids = new Set(branch ? [branch] : []);
  if (branch) {
    let changed = true;
    while (changed) {
      changed = false;
      records.forEach(row => {
        if (ids.has(row['Parent ID']) && !ids.has(row.ID)) { ids.add(row.ID); changed = true; }
      });
    }
    if ((selected && selected !== mission?.ID && !ids.has(selected)) || !records.some(row => row.ID === branch)) {
      branch = ''; host.dataset.branch = '';
    }
  }
  if (branch) {
    const cached = host._branchRecords;
    if (cached?.source === records && cached.id === branch) records = cached.rows;
    else {
      records = records.filter(row => row.ID === mission?.ID || ids.has(row.ID));
      host._branchRecords = { source: allRecords, id: branch, rows: records };
    }
  }
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
  // changes a record’s planning band. Branch filtering keeps its mission ancestor.
  const nav = html('nav'); nav.className = 'atlas-tree-breadcrumbs'; nav.setAttribute('aria-label', 'Domain hierarchy');
  const reset = html('a', 'All work'); reset.href = '#domains/tree'; reset.addEventListener('click', () => { host.dataset.branch = ''; }); nav.append(reset);
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
  const branchLabel = html('label', 'Explore a branch', 'atlas-branch-picker');
  const picker = html('select');
  picker.setAttribute('aria-label', 'Explore a branch');
  const all = html('option', 'All work · overview'); all.value = ''; picker.append(all);
  allRecords.filter(row => row['Parent ID'] === mission?.ID).forEach(row => {
    const option = html('option', row.Name); option.value = row.ID; picker.append(option);
  });
  picker.value = branch;
  picker.addEventListener('change', () => {
    host.dataset.branch = picker.value;
    const destination = picker.value ? url(picker.value) : '#domains/tree';
    if (location.hash === destination) renderAtlasTree(host, allRecords, selected, matches, query);
    else location.hash = destination;
  });
  branchLabel.append(picker); host.append(branchLabel);
  host.append(html('p', 'Start with the overview, then choose a branch to read the work. Select a card for details.', 'atlas-tree-hint'));

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
      const textColorFor = () => '#202735';

      // Build connectors separately so they paint above bands and below nodes.
      const connectors = svgEl('g', { class: 'atlas-tree-connectors' });
      levels.forEach(row => row.forEach(node => {
        node.children.forEach(child => {
          const startY = node.y + node.h / 2, endY = child.y - child.h / 2;
          const midY = (startY + endY) / 2;
          const d = node.band === child.band
            ? `M ${node.x} ${node.y - node.h / 2} C ${node.x} ${endY - 45}, ${child.x} ${endY - 45}, ${child.x} ${endY}`
            : `M ${node.x} ${startY} C ${node.x} ${midY}, ${child.x} ${midY}, ${child.x} ${endY}`;
          const path = svgEl('path', { d, class: 'atlas-tree-edge' });
          connectors.append(path);
        });
      }));

      let bandY = 44;
      levels.forEach((row, band) => {
        const rowHeight = Math.max(100, ...row.map(node => node.h));
        svg.append(svgEl('rect', { x: 0, y: bandY - 24, width, height: rowHeight + 48, rx: 12, fill: ATLAS_HORIZONS[band].fill, 'pointer-events': 'none' }));
        bandY += rowHeight + ATLAS_TREE_LEVEL_GAP;
      });

      svg.append(connectors);
      levels.forEach(row => row.forEach(node => {
        const isRoot = node === root;
        const group = svgEl('g', { 'data-node-id': node.row.ID, 'data-parent-id': node.row['Parent ID'] || '' });
        const anchor = svgEl('a', { href: url(node.row.ID), tabindex: '0', 'aria-label': `${node.row.Type}: ${node.row.Name}, view record` });
        anchor.classList.add(isRoot ? 'atlas-tree-root' : 'atlas-tree-node');
        const title = svgEl('title'); title.textContent = node.row.Purpose ? `${node.row.Name}: ${node.row.Purpose}` : node.row.Name; anchor.append(title);
        const fill = ATLAS_HORIZONS[node.band].card;
        const rectAttrs = { x: node.x - node.w / 2, y: node.y - node.h / 2, width: node.w, height: node.h, rx: 10, fill, stroke: ATLAS_HORIZONS[node.band].color, 'stroke-width': isRoot ? 2.5 : 1.5 };
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
      host.querySelector('.atlas-horizon-canvas')?.classList.toggle('is-overview', state.zoom < .65);
      const rail = host.querySelector('.atlas-horizon-rail');
      if (rail) {
        rail.style.paddingTop = `${20 * state.zoom}px`;
        [...rail.children].forEach((label, band) => {
          const rowHeight = Math.max(100, ...levels[band].map(node => node.h));
          label.style.height = `${(rowHeight + ATLAS_TREE_LEVEL_GAP) * state.zoom}px`;
        });
      }
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
    button('← Pan', () => scroller.scrollBy({ left: -scroller.clientWidth * .7, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
    button('Pan →', () => scroller.scrollBy({ left: scroller.clientWidth * .7, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
    const canvas = html('div', undefined, 'atlas-horizon-canvas');
    const rail = html('div', undefined, 'atlas-horizon-rail');
    ATLAS_HORIZONS.forEach((horizon, band) => {
      const label = html('div', undefined, 'atlas-horizon-label');
      label.style.setProperty('--horizon-color', horizon.color);
      label.style.setProperty('--horizon-fill', horizon.fill);
      label.append(html('strong', horizon.label), html('span', horizon.question), html('small', `PLANNING WINDOW · ${horizon.time}`));
      rail.append(label);
    });
    canvas.append(rail, scroller);
    host.append(controls, canvas);
    resize(!reusable && !selected ? Math.min(1, scroller.clientWidth / width) : state.zoom);
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

  const hint = html('p', 'Choose a branch for a closer look. Select any card to read its purpose and responsibilities. These are Sapiens First’s planning horizons: approximate review windows, not deadlines or a program’s lifespan. Lines show the recorded connections; all statuses are included.');
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
