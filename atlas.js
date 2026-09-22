(() => {
  const data = window.ATLAS_DATA;
  const views = {
    domains: { title: 'Domains of work', description: 'Explore our work, its purpose, and how it connects to the mission.', parent: 'Parent ID', columns: ['Name', 'Purpose', 'Parent', 'Status', 'Owner'] },
    governance: { title: 'Roles & circles', description: 'Explore responsibilities and linked domains. Roles marked “Needs definition” were named as owners but have not yet been fully documented.', parent: 'Parent Circle ID', columns: ['Name', 'Purpose', 'Parent circle', 'Status', 'Owned domains'] },
  };
  const search = document.querySelector('#atlas-search');
  const filter = document.querySelector('#atlas-filter');
  const status = document.querySelector('#atlas-status');
  const table = document.querySelector('#atlas-table');
  const results = document.querySelector('#atlas-results');
  const panel = document.querySelector('#atlas-record');
  const index = new Map();
  for (const group of Object.keys(views)) {
    for (const row of data?.[group] || []) index.set(row.ID, { group, row });
  }
  let current = 'domains';
  let selected = '';
  let format = 'table';
  const el = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const relations = () => data?.relationships || [];
  const today = () => new Date().toISOString().slice(0, 10);
  const active = relation => (!relation['Valid from'] || relation['Valid from'] <= today()) && (!relation['Valid until'] || today() < relation['Valid until']);
  function link(id) {
    const item = index.get(id);
    if (!item) return el('span', `Unresolved reference: ${id}`, 'atlas-unresolved');
    const anchor = el('a', item.row.Name);
    anchor.href = item.group === 'governance' && format === 'circles' ? `#governance/circles/${id}`
      : item.group === 'domains' && format === 'tree' ? `#domains/tree/${id}`
      : `#${item.group}/${id}`;
    return anchor;
  }
  function linkedList(ids) {
    const list = el('ul', undefined, 'atlas-links');
    ids.forEach(id => { const item = el('li'); item.append(link(id)); list.append(item); });
    return ids.length ? list : el('span', 'Not recorded');
  }
  function responsibility(row) {
    return createAtlasOwnership(data || {}, today()).responsibility(row);
  }
  function owners(row, group) {
    if (group === 'domains') return responsibility(row).ids;
    return (data?.domains || []).filter(domain => responsibility(domain).ids.includes(row.ID)).map(domain => domain.ID);
  }
  function ownershipDisplay(row) {
    const result = responsibility(row);
    const block = el('div');
    block.append(linkedList(result.ids));
    const descriptions = {
      undelegated: 'Held by this circle; not delegated to a role.',
      unfilled: 'The role retains this domain. Circle Lead coverage applies while the role is unfilled.',
      unknown: 'Containing circle not recorded; default responsibility cannot be resolved.',
    };
    if (descriptions[result.kind]) block.append(el('p', descriptions[result.kind], 'atlas-coverage'));
    const coverage = result.coverage;
    if (coverage) {
      const note = el('p', undefined, 'atlas-coverage');
      if (coverage.circleId) { note.append(el('span', 'Coverage through '), link(coverage.circleId), el('span', ': ')); }
      const message = coverage.reason === 'assigned' ? `Circle Lead — ${coverage.names}`
        : coverage.reason === 'anchor' ? 'The anchor circle has no default Circle Lead; a policy must establish coverage.'
        : coverage.reason === 'policy' ? `Governance policy: ${coverage.note}`
        : 'Circle Lead assignment is not recorded.';
      note.append(el('span', message)); block.append(note);
    }
    return block;
  }
  function extraFields(row) {
    return Object.keys(row).filter(key => !['Name', 'Type', 'Purpose', 'Parent ID', 'Parent Circle ID', 'Status'].includes(key));
  }
  function fieldsList(row, fields) {
    const dl = el('dl');
    fields.forEach(field => {
      dl.append(el('dt', field));
      const dd = el('dd');
      const value = row[field];
      if (field === 'Circle ID' && value) dd.append(link(value));
      else if (field.endsWith('URL') && /^https?:\/\//i.test(value)) {
        const a = el('a', value); a.href = value; a.target = '_blank'; a.rel = 'noopener'; dd.append(a);
      } else dd.textContent = value || 'Not documented';
      dl.append(dd);
    });
    return dl;
  }
  function renderRecord() {
    panel.replaceChildren();
    panel.hidden = !selected;
    if (!selected) return;
    const item = index.get(selected);
    const heading = el('h2', item?.row.Name || 'Record not found'); heading.id = 'record-title'; heading.tabIndex = -1;
    const closeLabel = format === 'circles' ? '← All circles' : format === 'tree' ? '← Full tree' : '← Back to list';
    const closeHref = format === 'circles' ? '#governance/circles' : format === 'tree' ? '#domains/tree' : `#${current}`;
    const close = el('a', closeLabel); close.href = closeHref;
    panel.append(close, heading);
    if (!item) { panel.append(el('p', `No record exists for ${selected}.`)); return; }
    const { row, group } = item;
    panel.append(el('p', `${row.ID} · ${row.Type} · ${row.Status}`, 'atlas-record-meta'));
    const ancestry = [];
    let parent = row[views[group].parent];
    const visited = new Set([row.ID]);
    while (parent && !visited.has(parent)) {
      visited.add(parent); ancestry.unshift(parent); parent = index.get(parent)?.row[views[group].parent];
    }
    if (ancestry.length) {
      panel.append(el('h3', 'Part of'));
      panel.append(linkedList(ancestry));
    }
    panel.append(el('p', row.Purpose || 'Purpose not documented.', 'atlas-record-purpose'));
    panel.append(el('h3', group === 'domains' ? 'Domain authority & coverage' : 'Currently holds'), group === 'domains' ? ownershipDisplay(row) : linkedList(owners(row, group)));
    if (group === 'governance' && row.Type === 'Circle') {
      panel.append(el('p', 'Includes explicitly owned domains and undelegated domains held by this circle.', 'atlas-coverage'));
    }
    panel.append(fieldsList(row, extraFields(row)));
    const children = (data[group] || []).filter(child => child[views[group].parent] === row.ID);
    if (children.length) panel.append(el('h3', 'Contains'), linkedList(children.map(child => child.ID)));
    const history = relations().filter(r => r['From ID'] === row.ID || r['To ID'] === row.ID);
    if (history.length) {
      panel.append(el('h3', 'Relationships & history'));
      const list = el('ul', undefined, 'atlas-history');
      history.forEach(r => {
        const li = el('li');
        const outgoing = r['From ID'] === row.ID;
        const label = outgoing ? { owns: 'Owns', succeeds: 'Succeeds', supports: 'Supports' }[r.Relationship]
          : { owns: 'Owned by', succeeds: 'Succeeded by', supports: 'Supported by' }[r.Relationship];
        li.append(el('span', `${label || r.Relationship}: `), link(r[outgoing ? 'To ID' : 'From ID']));
        const period = r['Valid from'] || r['Valid until']
          ? `${r['Valid from'] || 'start not recorded'} → ${r['Valid until'] || 'ongoing'}` : 'Dates not recorded';
        li.append(el('small', `${period} · ${active(r) ? 'Current' : r['Valid from'] > today() ? 'Scheduled' : 'Ended'}`));
        if (r.Notes) li.append(el('small', r.Notes));
        list.append(li);
      });
      panel.append(list);
    }
  }
  function render() {
    const view = views[current];
    const valid = Array.isArray(data?.[current]);
    const circleMode = current === 'governance' && format === 'circles';
    const treeMode = current === 'domains' && format === 'tree';
    document.querySelector('#atlas-format').hidden = !(current === 'governance' || current === 'domains');
    document.querySelectorAll('[data-format]').forEach(button => {
      button.hidden = Boolean(button.dataset.viewFormat) && button.dataset.viewFormat !== current;
      button.setAttribute('aria-pressed', String(button.dataset.format === format));
    });
    document.querySelector('#atlas-circles').hidden = !circleMode || !valid;
    document.querySelector('#atlas-tree').hidden = !treeMode || !valid;
    if (circleMode) document.querySelector('#atlas-circle-detail').append(panel);
    else if (treeMode) document.querySelector('#atlas-tree-detail').append(panel);
    else status.before(panel);
    document.querySelector('#atlas-error').hidden = valid;
    search.disabled = filter.disabled = !valid;
    document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === current)));
    document.querySelector('#view-title').textContent = view.title;
    document.querySelector('#view-description').textContent = view.description;
    document.querySelector('#atlas-filter-label').hidden = current !== 'domains' || treeMode;
    search.placeholder = current === 'domains' ? 'Search domains…' : 'Search roles, people…';
    const source = document.querySelector('.atlas-source'); source.href = `data/atlas/${current}.csv`; source.textContent = `Download ${current} CSV ↓`;
    if (!valid) { status.textContent = 'Atlas data unavailable.'; results.hidden = true; return; }
    const scoped = current === 'domains' && filter.value === 'active' ? data[current].filter(row => row.Status === 'Active') : data[current];
    const query = search.value.trim().toLocaleLowerCase();
    const rows = scoped.filter(row => [...Object.values(row), ...owners(row, current).map(id => index.get(id)?.row.Name || id)].some(value => String(value).toLocaleLowerCase().includes(query)));
    const header = el('tr');
    view.columns.forEach(column => { const th = el('th', column); th.scope = 'col'; header.append(th); });
    table.tHead.replaceChildren(header); table.caption.textContent = view.title;
    results.setAttribute('aria-label', `${view.title} table`);
    const body = document.createDocumentFragment();
    rows.forEach(row => {
      const tr = el('tr');
      view.columns.forEach((column, position) => {
        const cell = el(position ? 'td' : 'th');
        if (!position) {
          cell.scope = 'row'; cell.append(link(row.ID), el('span', `${row.Type} · ${row.ID}`, 'atlas-level'));
          const details = el('details'); const summary = el('summary', current === 'domains' ? 'More details' : 'Responsibilities');
          summary.setAttribute('aria-label', `${summary.textContent}: ${row.Name}`);
          details.append(summary, fieldsList(row, extraFields(row))); cell.append(details);
        } else if (column === 'Purpose') cell.append(el('span', row.Purpose || 'Not documented', 'atlas-cell-text'));
        else if (column.startsWith('Parent')) cell.append(row[view.parent] ? link(row[view.parent]) : el('span', row.Status === 'Needs definition' ? 'Not documented' : '—'));
        else if (column === 'Status') cell.append(el('span', row.Status, `atlas-badge${row.Status === 'Active' ? ' active' : ''}`));
        else {
          cell.append(current === 'domains' ? ownershipDisplay(row) : linkedList(owners(row, current)));
          if (row['Ownership note']) cell.append(el('p', row['Ownership note'], 'atlas-unresolved'));
        }
        tr.append(cell);
      });
      body.append(tr);
    });
    table.tBodies[0].replaceChildren(body); results.hidden = !rows.length || circleMode || treeMode;
    status.textContent = rows.length ? `${rows.length} of ${scoped.length} ${current === 'domains' ? 'areas of work' : 'roles and circles'}. Select a name to explore its connections.` : 'No matches. Try another search or choose All statuses.';
    renderRecord();
    if (circleMode) {
      renderAtlasCircles(document.querySelector('#atlas-circle-chart'), data.governance, selected, rows, query);
      status.textContent = query ? `${rows.length} matching governance records.` : 'Governance circle map. Follow the nested circles to explore the organization.';
      document.querySelector('#atlas-circles').classList.toggle('has-selection', Boolean(selected));
    }
    if (treeMode) {
      // The tree always shows the whole hierarchy regardless of the
      // Active/All-statuses filter (a Pillar with no active children would
      // otherwise vanish from its own tree), so matches are computed against
      // every domain record rather than the filtered `scoped`/`rows` set.
      const treeMatches = data.domains.filter(row => [...Object.values(row), ...owners(row, 'domains').map(id => index.get(id)?.row.Name || id)].some(value => String(value).toLocaleLowerCase().includes(query)));
      renderAtlasTree(document.querySelector('#atlas-tree-chart'), data.domains, selected, treeMatches, query);
      status.textContent = query ? `${treeMatches.length} matching domain records.` : 'Domains tree. Follow the branches to see how work ladders up to the mission.';
      document.querySelector('#atlas-tree').classList.toggle('has-selection', Boolean(selected));
    }
  }
  let lastHash = null;
  function navigate(focus = false) {
    if (location.hash === lastHash) return;
    lastHash = location.hash;
    const parts = location.hash.slice(1).split('/');
    current = parts[0] === 'governance' ? 'governance' : 'domains';
    format = current === 'governance' && parts[1] === 'circles' ? 'circles'
      : current === 'domains' && parts[1] === 'tree' ? 'tree'
      : 'table';
    selected = parts[format === 'circles' || format === 'tree' ? 2 : 1] || '';
    if (index.has(selected)) current = index.get(selected).group;
    search.value = '';
    render();
    if (focus && selected) document.querySelector('#record-title')?.focus();
  }
  const mission = data?.domains?.find(row => row.Type === 'Mission');
  if (mission) { document.querySelector('#mission-text').textContent = mission.Name; document.querySelector('.atlas-mission').hidden = false; }
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    location.hash = `#${button.dataset.view}`;
    navigate(true);
  }));
  document.querySelectorAll('[data-format]').forEach(button => button.addEventListener('click', () => {
    const suffix = selected ? `/${selected}` : '';
    location.hash = button.dataset.format === 'circles' ? `#governance/circles${suffix}`
      : button.dataset.format === 'tree' ? `#domains/tree${suffix}`
      : `#${current}${suffix}`;
    navigate(true);
  }));
  window.addEventListener('hashchange', () => navigate(true));
  search.addEventListener('input', render);
  filter.addEventListener('change', render);
  navigate();
})();
