/* Explorer: a file-browser-style outline of the Domains hierarchy (Mission →
   Pillar → Program → Project/Product). Rows, indentation and disclosure
   chevrons — no SVG canvas, no zoom/pan. Named "outline" internally (not
   "explorer") to avoid colliding with the page's existing `.atlas-explorer`
   section wrapper, which scripts/tests/ already asserts on. */
const ATLAS_OUTLINE_BAND = { Mission: 0, Pillar: 1, Objective: 1, Program: 2, Domain: 3, 'Product/Service': 3, Project: 3 };
const ATLAS_OUTLINE_TYPE_LABEL = {
  Mission: 'Mission', Pillar: 'Strategic pillar', Objective: 'Strategic pillar',
  Program: 'Program', Domain: 'Product / service', 'Product/Service': 'Product / service', Project: 'Project',
};
function atlasOutlineBand(type) { return ATLAS_OUTLINE_BAND[type] ?? 3; }
function atlasOutlineTypeLabel(type) { return ATLAS_OUTLINE_TYPE_LABEL[type] || type || 'Record'; }

// Pure layout: resolve each record's Parent ID chain into a tree. Broken
// chains/cycles land in `unplaced`, exactly like the retired Tree view did —
// nothing here invents a parent.
function atlasOutlineBuild(records) {
  const nodes = new Map(records.map(row => [row.ID, { row, children: [], parent: null }]));
  const root = [...nodes.values()].find(node => node.row.Type === 'Mission') || null;
  function resolves(node) {
    const seen = new Set();
    let current = node;
    while (current) {
      if (seen.has(current.row.ID)) return false;
      seen.add(current.row.ID);
      if (current === root) return true;
      const parentId = current.row['Parent ID'];
      if (!parentId) return false;
      current = nodes.get(parentId);
    }
    return false;
  }
  const unplaced = [];
  for (const node of nodes.values()) {
    if (node === root) continue;
    if (!resolves(node)) { unplaced.push(node); continue; }
    const parent = nodes.get(node.row['Parent ID']);
    parent.children.push(node);
    node.parent = parent;
  }
  function sortChildren(node) {
    node.children.sort((a, b) => a.row.Name.localeCompare(b.row.Name) || a.row.ID.localeCompare(b.row.ID));
    node.children.forEach(sortChildren);
  }
  if (root) sortChildren(root);
  return { nodes, root, unplaced };
}

// Pure search: which record IDs match, and which IDs (matches + their
// ancestors) must stay visible so a result reads with its containing
// hierarchy instead of as a flat list.
function atlasOutlineSearch(nodes, matchRows) {
  const matchIds = new Set(matchRows.map(row => row.ID));
  const visible = new Set();
  matchIds.forEach(id => {
    let node = nodes.get(id);
    while (node && !visible.has(node.row.ID)) { visible.add(node.row.ID); node = node.parent; }
  });
  return { matchIds, visible };
}

function renderAtlasOutline(host, records, selected, matches, query, link) {
  const html = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const { nodes, root, unplaced } = atlasOutlineBuild(records);
  host._outlineExpanded = host._outlineExpanded || new Set(root ? [root.row.ID] : []);
  const expanded = host._outlineExpanded;
  const { matchIds, visible } = query ? atlasOutlineSearch(nodes, matches) : { matchIds: new Set(), visible: null };

  function highlight(anchor, name) {
    const idx = name.toLocaleLowerCase().indexOf(query);
    if (idx === -1) return;
    const textNode = [...anchor.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
    if (!textNode) return;
    const frag = document.createDocumentFragment();
    if (idx) frag.append(document.createTextNode(name.slice(0, idx)));
    frag.append(html('mark', name.slice(idx, idx + query.length), 'atlas-outline-highlight'));
    if (idx + query.length < name.length) frag.append(document.createTextNode(name.slice(idx + query.length)));
    anchor.replaceChild(frag, textNode);
  }

  function buildRow(node, depth) {
    const li = html('li');
    li.setAttribute('role', 'treeitem');
    li.dataset.id = node.row.ID;
    const hasChildren = node.children.length > 0;
    const isExpanded = query ? true : expanded.has(node.row.ID);
    if (hasChildren) li.setAttribute('aria-expanded', String(isExpanded));
    li.setAttribute('aria-level', String(depth + 1));
    const row = html('div', undefined, 'atlas-outline-row');
    row.dataset.band = String(atlasOutlineBand(node.row.Type));
    row.tabIndex = -1;
    if (selected === node.row.ID) row.classList.add('is-selected');
    if (query && matchIds.has(node.row.ID)) row.classList.add('is-match');
    if (hasChildren) {
      const chevron = html('button', undefined, 'atlas-outline-chevron');
      chevron.type = 'button';
      chevron.setAttribute('aria-label', `${isExpanded ? 'Collapse' : 'Expand'} ${node.row.Name}`);
      chevron.addEventListener('click', event => { event.stopPropagation(); event.preventDefault(); toggle(node.row.ID, row); });
      row.append(chevron);
    } else {
      row.append(html('span', undefined, 'atlas-outline-bullet'));
    }
    const anchor = link(node.row.ID);
    anchor.classList.add('atlas-outline-title');
    anchor.tabIndex = -1;
    if (query) highlight(anchor, node.row.Name);
    row.append(anchor);
    const metaText = atlasOutlineTypeLabel(node.row.Type) + (hasChildren && !isExpanded ? ` · ${node.children.length}` : '');
    row.append(html('span', metaText, 'atlas-outline-meta'));
    li.append(row);
    if (hasChildren && isExpanded) {
      const group = html('ul', undefined, 'atlas-outline-group');
      group.setAttribute('role', 'group');
      const childList = query ? node.children.filter(child => visible.has(child.row.ID)) : node.children;
      childList.forEach(child => group.append(buildRow(child, depth + 1)));
      li.append(group);
    }
    return li;
  }

  function toggle(id, focusRow) {
    if (expanded.has(id)) expanded.delete(id); else expanded.add(id);
    draw();
    host.querySelector(`[data-id="${CSS.escape(id)}"] > .atlas-outline-row`)?.focus();
  }

  function moveFocus(current, direction) {
    const rows = [...host.querySelectorAll('.atlas-outline-row')];
    const at = rows.indexOf(current);
    if (at === -1) return;
    if (direction === 'down' && rows[at + 1]) rows[at + 1].focus();
    if (direction === 'up' && rows[at - 1]) rows[at - 1].focus();
  }

  function onKeydown(event) {
    const row = event.target.closest('.atlas-outline-row');
    if (!row) return;
    const li = row.closest('[role="treeitem"]');
    const id = li?.dataset.id;
    if (event.key === 'ArrowDown') { event.preventDefault(); moveFocus(row, 'down'); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); moveFocus(row, 'up'); }
    else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (li.hasAttribute('aria-expanded') && li.getAttribute('aria-expanded') === 'false') toggle(id, row);
      else li.querySelector(':scope > .atlas-outline-group > [role="treeitem"] > .atlas-outline-row')?.focus();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (li.getAttribute('aria-expanded') === 'true') toggle(id, row);
      else li.parentElement?.closest('[role="treeitem"]')?.querySelector(':scope > .atlas-outline-row')?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      row.querySelector('.atlas-outline-title')?.click();
    }
  }

  function draw() {
    host.replaceChildren();

    // Breadcrumb: same pattern as Circles/the retired Tree, only shown once
    // something is selected — it's orientation while browsing, not a
    // permanent fixture.
    const selectedNode = root && nodes.get(selected);
    if (selectedNode) {
      const nav = html('nav', undefined, 'atlas-outline-breadcrumbs');
      nav.setAttribute('aria-label', 'Domain hierarchy');
      const chain = []; let node = selectedNode; const seen = new Set();
      while (node && !seen.has(node.row.ID)) { seen.add(node.row.ID); chain.unshift(node); node = node.parent; }
      chain.forEach((item, i) => {
        if (i) nav.append(html('span', '›', 'atlas-outline-crumb-sep'));
        if (i === chain.length - 1) {
          const cur = html('span', item.row.Name, 'atlas-outline-crumb-current');
          cur.setAttribute('aria-current', 'page');
          nav.append(cur);
        } else nav.append(link(item.row.ID));
      });
      host.append(nav);
    }

    const toolbar = html('div', undefined, 'atlas-outline-toolbar');
    const menu = html('details', undefined, 'atlas-outline-menu');
    const summary = html('summary', undefined); summary.setAttribute('aria-label', 'More actions'); summary.textContent = '⋯';
    menu.append(summary);
    const expandAll = html('button', 'Expand all'); expandAll.type = 'button';
    expandAll.addEventListener('click', () => { nodes.forEach(n => { if (n.children.length) expanded.add(n.row.ID); }); menu.open = false; draw(); });
    const collapseAll = html('button', 'Collapse all'); collapseAll.type = 'button';
    collapseAll.addEventListener('click', () => { expanded.clear(); menu.open = false; draw(); });
    menu.append(expandAll, collapseAll);
    toolbar.append(menu);
    host.append(toolbar);

    if (!root) { host.append(html('p', 'No Mission record is recorded yet. Use the table to review the domains records.')); return; }

    if (query) {
      host.append(html('p', `${matches.length} search ${matches.length === 1 ? 'result' : 'results'}`, 'atlas-outline-hint'));
      if (!matches.length) {
        const empty = html('div', undefined, 'atlas-outline-empty');
        empty.append(html('p', `No Atlas items match "${query}".`));
        const clear = html('button', 'Clear search'); clear.type = 'button';
        clear.addEventListener('click', () => { document.querySelector('#atlas-search').value = ''; document.querySelector('#atlas-search').dispatchEvent(new Event('input')); });
        empty.append(clear);
        host.append(empty);
        return;
      }
    }

    const tree = html('ul', undefined, 'atlas-outline-tree');
    tree.setAttribute('role', 'tree');
    tree.setAttribute('aria-label', 'Domains hierarchy');
    tree.addEventListener('keydown', onKeydown);
    // Search drops the Mission wrapper (it's always the same, redundant
    // context while scanning results) and starts from whichever top-level
    // branches actually contain a match.
    const roots = query ? root.children.filter(child => visible.has(child.row.ID)) : [root];
    roots.forEach(node => tree.append(buildRow(node, 0)));
    host.append(tree);

    if (!query) host.append(html('p', 'Select the chevron to expand a branch, or a name to read its purpose and responsibilities.', 'atlas-outline-hint'));

    if (unplaced.length) {
      const section = html('details', undefined, 'atlas-unplaced');
      const sum = html('summary');
      sum.append(html('span', 'Uncategorized'), ' ', html('span', String(unplaced.length), 'atlas-badge atlas-unplaced-count'));
      section.append(sum);
      section.append(html('p', 'These records have no Parent ID chain that resolves back to the Mission record. They are shown here rather than silently dropped.'));
      const list = html('ul');
      unplaced.forEach(node => { const li = html('li'); li.append(link(node.row.ID), html('span', ` · ${node.row.Type}`)); list.append(li); });
      section.append(list);
      host.append(section);
    }
  }

  draw();
}
if (typeof module !== 'undefined') module.exports = { atlasOutlineBuild, atlasOutlineSearch, atlasOutlineTypeLabel, atlasOutlineBand };
