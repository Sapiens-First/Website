/* Alignment: a matrix of cross-cutting "supports" relationships — distinct
   from the Explorer's canonical containment. Reads Relationship === 'supports'
   rows from relationships.csv; none exist in the current data, so this
   renders an honest empty state rather than inventing relationships. It
   lights up automatically once real `supports` rows are added. */
const ATLAS_ALIGNMENT_ROW_TYPES = ['Project', 'Program'];

// Pure: build the matrix for a chosen row type (Project or Program).
function atlasAlignmentMatrix(data, rowType) {
  const domains = (data?.domains || []).filter(row => row.Status !== 'Retired');
  const domainIndex = new Map(domains.map(row => [row.ID, row]));
  const supports = (data?.relationships || []).filter(r => r.Relationship === 'supports');
  const rows = domains.filter(row => row.Type === rowType);
  const rowIds = new Set(rows.map(row => row.ID));
  const relevant = supports.filter(r => rowIds.has(r['From ID']) && domainIndex.has(r['To ID']));
  const colIds = [...new Set(relevant.map(r => r['To ID']))];
  const cols = colIds.map(id => domainIndex.get(id));
  const cellMap = new Map(relevant.map(r => [`${r['From ID']}|${r['To ID']}`, r]));
  return { rows, cols, cellMap };
}

function renderAtlasAlignment(host, data, selected, link) {
  const html = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  host._alignmentRowType = host._alignmentRowType || 'Project';
  host._alignmentHighlightCol = host._alignmentHighlightCol || '';

  function draw() {
    host.replaceChildren();
    const toolbar = html('div', undefined, 'atlas-alignment-toolbar');
    const switcher = html('div', undefined, 'atlas-alignment-switch');
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', 'Alignment rows');
    ATLAS_ALIGNMENT_ROW_TYPES.forEach(type => {
      const button = html('button', type === 'Project' ? 'Projects' : 'Programs');
      button.type = 'button';
      button.setAttribute('aria-pressed', String(host._alignmentRowType === type));
      button.addEventListener('click', () => { host._alignmentRowType = type; host._alignmentHighlightCol = ''; draw(); });
      switcher.append(button);
    });
    toolbar.append(switcher);
    host.append(toolbar);

    const { rows, cols, cellMap } = atlasAlignmentMatrix(data, host._alignmentRowType);

    if (!cols.length) {
      const empty = html('div', undefined, 'atlas-alignment-empty');
      empty.append(html('p', 'No cross-cutting relationships are recorded yet.'));
      empty.append(html('p', 'This view connects projects and programs to the goals they support.', 'atlas-alignment-empty-detail'));
      host.append(empty);
      return;
    }

    const scroller = html('div', undefined, 'atlas-alignment-scroll');
    const table = html('table', undefined, 'atlas-alignment-table');
    table.append(html('caption', `${host._alignmentRowType === 'Project' ? 'Projects' : 'Programs'} and what they support`, 'atlas-sr-only'));
    const thead = html('thead');
    const headRow = html('tr');
    headRow.append(html('th', ''));
    cols.forEach(col => {
      const th = html('th');
      th.scope = 'col';
      const button = html('button', col.Name);
      button.type = 'button';
      button.className = 'atlas-alignment-col-header';
      button.setAttribute('aria-pressed', String(host._alignmentHighlightCol === col.ID));
      button.addEventListener('click', () => { host._alignmentHighlightCol = host._alignmentHighlightCol === col.ID ? '' : col.ID; draw(); });
      th.append(button);
      if (host._alignmentHighlightCol === col.ID) th.classList.add('is-highlighted');
      headRow.append(th);
    });
    thead.append(headRow);
    table.append(thead);
    const tbody = html('tbody');
    rows.forEach(row => {
      const tr = html('tr');
      const rowHasSupport = cols.some(col => cellMap.has(`${row.ID}|${col.ID}`));
      if (!rowHasSupport) return;
      const th = html('th');
      th.scope = 'row';
      th.append(link(row.ID));
      if (selected === row.ID) th.classList.add('is-selected');
      tr.append(th);
      cols.forEach(col => {
        const td = html('td');
        const relation = cellMap.get(`${row.ID}|${col.ID}`);
        if (host._alignmentHighlightCol === col.ID) td.classList.add('is-highlighted');
        if (relation) {
          const mark = html('span', '●', 'atlas-alignment-mark');
          mark.setAttribute('aria-label', `${row.Name} supports ${col.Name}`);
          if (relation.Notes) mark.title = relation.Notes;
          td.append(mark);
        }
        tr.append(td);
      });
      tbody.append(tr);
    });
    table.append(tbody);
    scroller.append(table);
    host.append(scroller);
    host.append(html('p', 'Select a name to read its details. Select a column to highlight everything supporting that priority.', 'atlas-alignment-hint'));
  }

  draw();
}
if (typeof module !== 'undefined') module.exports = { atlasAlignmentMatrix };
