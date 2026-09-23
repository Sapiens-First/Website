const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { atlasTreeLayout } = require('../../atlas-tree.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('atlas-data.js', 'utf8'), context);
const records = JSON.parse(JSON.stringify(context.window.ATLAS_DATA.domains));
const { root, levels, unplaced, nodes, width, height } = atlasTreeLayout(records);

// Hierarchy: exactly one root, the Mission record.
assert.ok(root, 'a Mission record roots the tree');
assert.equal(root.row.Type, 'Mission');
assert.equal(root.row.ID, 'D-001');
assert.equal(levels[0].length, 1);
assert.equal(levels[0][0], root);

// Domains data changes constantly, so this checks structural invariants and
// a few specific known-shaped records rather than hardcoded per-level totals.
// Level is walked up from Parent ID, not read off Type, because Type alone is
// ambiguous: "Enabling" Programs (e.g. Marketing & Communications, D-009)
// attach directly to the Mission — the same depth as Pillars — and some
// Products/Projects skip straight to a Pillar or the Mission, skipping the
// Program/Product tier. These are exactly the cases this test pins down.
assert.equal(nodes.get('D-009').depth, 2, 'Communications belongs to Community');
assert.equal(nodes.get('D-002').depth, 1, 'Advocacy pillar is depth 1');
assert.equal(nodes.get('D-020').depth, 1, 'General Meetings attaches directly to the Mission, skipping Program/Product');
assert.equal(nodes.get('D-029').depth, 4, 'Stop 1984 CA Strategic Plan sits under the Stop 1984 product, under Campaign Creation');

// No-inverted-levels: every child is exactly one structural depth below its
// parent, everywhere in the tree, regardless of Type.
let count = 0;
function validate(node) {
  count++;
  for (const child of node.children) {
    assert.equal(child.depth, node.depth + 1, `${child.row.ID} is exactly one level below its parent ${node.row.ID}`);
    assert.equal(nodes.get(child.row['Parent ID']), node, `${child.row.ID}'s Parent ID resolves back to ${node.row.ID}`);
    validate(child);
  }
}
validate(root);
assert.equal(count + unplaced.length, records.length, 'every record is either placed in the tree or explicitly unplaced');

// Containment / non-overlap: siblings and cousins within the same horizon
// band never overlap horizontally, and boxes never invert (a lower band
// never renders above the band it descends from).
levels.forEach((row, depth) => {
  const ordered = [...row].sort((a, b) => a.x - b.x);
  for (let i = 1; i < ordered.length; i++) {
    const prev = ordered[i - 1], cur = ordered[i];
    assert.ok(cur.x - cur.w / 2 >= prev.x + prev.w / 2 - 0.01, `boxes at depth ${depth} do not overlap`);
  }
  row.forEach(node => assert.equal(node.band, depth, 'node lives in its planning horizon'));
  if (!row.length) return;
  if (depth > 0) {
    const above = levels.slice(0, depth).filter(row => row.length).at(-1);
    if (!above) return;
    const y = row[0].y, prevY = above[0].y;
    assert.ok(y > prevY, `depth ${depth} renders strictly below depth ${depth - 1}`);
  }
});

// Empty-branch handling: a Program/Pillar with no children lays out as an
// ordinary leaf, without special-casing or crashing.
const emptyBranch = nodes.get('D-008'); // Training: a Product/Service with no recorded children.
assert.ok(emptyBranch, 'D-008 exists in the fixture');
assert.equal(emptyBranch.children.length, 0);
assert.ok(Number.isFinite(emptyBranch.x) && Number.isFinite(emptyBranch.y), 'a childless branch still gets a finite position');

// Unplaced records: broken/missing Parent ID chains never get silently
// attached to the root, and never crash the layout — checked on a synthetic
// fixture since the real CSV currently has none.
const synthetic = [
  { ID: 'D-001', Name: 'Mission', Type: 'Mission', 'Parent ID': '' },
  { ID: 'D-002', Name: 'Pillar', Type: 'Pillar', 'Parent ID': 'D-001' },
  { ID: 'D-003', Name: 'Orphan (missing parent)', Type: 'Program', 'Parent ID': 'D-999' },
  { ID: 'D-004', Name: 'Rootless (no parent recorded)', Type: 'Program', 'Parent ID': '' },
  { ID: 'D-005', Name: 'Cycle A', Type: 'Program', 'Parent ID': 'D-006' },
  { ID: 'D-006', Name: 'Cycle B', Type: 'Program', 'Parent ID': 'D-005' },
];
const synthResult = atlasTreeLayout(synthetic);
assert.equal(synthResult.root.row.ID, 'D-001');
const synthUnplacedIds = new Set(synthResult.unplaced.map(node => node.row.ID));
assert.ok(synthUnplacedIds.has('D-003'), 'a broken Parent ID reference is unplaced, not attached to root');
assert.ok(synthUnplacedIds.has('D-004'), 'a record with no Parent ID (that is not the Mission) is unplaced');
assert.ok(synthUnplacedIds.has('D-005') && synthUnplacedIds.has('D-006'), 'a Parent ID cycle never resolves to the root and stays unplaced');
assert.equal(synthResult.nodes.get('D-002').children.length, 0, 'the placed Pillar has no children polluted by the unplaced records');

// No-root fallback (e.g. Mission record missing/renamed) never throws and
// leaves everything honestly unplaced rather than guessing a root.
const noRoot = atlasTreeLayout([{ ID: 'D-001', Name: 'Not a mission', Type: 'Pillar', 'Parent ID': '' }]);
assert.equal(noRoot.root, null);
assert.equal(noRoot.unplaced.length, 1);
assert.equal(noRoot.levels.length, 0);

// Empty input never throws.
const empty = atlasTreeLayout([]);
assert.equal(empty.root, null);
assert.equal(empty.unplaced.length, 0);
assert.equal(empty.width, 0);
assert.equal(empty.height, 0);

assert.equal(nodes.get('D-009').band, 2, 'programs keep H2 even when attached to the mission');
assert.equal(nodes.get('D-020').band, 3, 'products keep H1 regardless of parent');
assert.equal(nodes.get('D-024').band, 3, 'projects share H1 delivery horizon');

assert.ok(width > 0 && height > 0, 'the real fixture produces a positive-size canvas');
console.log('PASS hierarchy, containment, non-overlap, no-inverted-levels, empty branches, unplaced records, no-root fallback');
