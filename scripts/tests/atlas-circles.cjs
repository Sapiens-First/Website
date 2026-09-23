const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { atlasCircleLayout } = require('../../atlas-circles.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('atlas-data.js', 'utf8'), context);
const records = JSON.parse(JSON.stringify(context.window.ATLAS_DATA.governance));
const { roots, unplaced, nodes } = atlasCircleLayout(records);
// Berkeley Chapter is a separate root circle by user direction, outside Sapiens
// First Global — not a rename of the retired worldwide Chapter Network function.
assert.equal(roots.length, 2);
assert.equal(roots[0].row.Name, 'Sapiens First Global');
assert.equal(roots[1].row.Name, 'Berkeley Chapter');
assert.ok(!roots[1].row['Parent Circle ID'], 'Berkeley Chapter has no parent circle');
// Governance data changes constantly (a core Holacracy principle), so this checks
// specific known-ambiguous/known-resolved records rather than a total that would
// need updating on every reorg. See data/atlas/governance.csv Definition notes.
const unplacedIds = new Set(unplaced.map(node => node.row.ID));
for (const id of ['G-032']) {
  assert.ok(unplacedIds.has(id), `${id} should remain unplaced pending explicit reconciliation`);
}
// G-027, G-034, and G-035 were previously unplaced but now have explicit
// containing circles as part of the governance restructuring.
for (const id of ['G-027', 'G-034', 'G-035']) {
  assert.ok(!unplacedIds.has(id), `${id} should now be placed in a containing circle`);
}
assert.equal(nodes.get('G-004').children.find(node => node.row.ID === 'G-006').row.Name, 'Website Owner');
let count = 0;
function validate(node) {
  count++;
  for (const child of node.children) {
    assert.ok(Math.hypot(child.x, child.y) + child.r < node.r, 'Children stay inside parent');
    validate(child);
  }
  for (let i = 0; i < node.children.length; i++) {
    for (let j = i + 1; j < node.children.length; j++) {
      const a = node.children[i], b = node.children[j];
      assert.ok(Math.hypot(a.x - b.x, a.y - b.y) > a.r + b.r, 'Siblings do not overlap');
    }
  }
}
roots.forEach(validate);
assert.equal(count + unplaced.length, records.length);
assert.equal(atlasCircleLayout([]).roots.length, 0);
assert.equal(atlasCircleLayout([{ ID: 'G-001', Type: 'Circle', 'Parent Circle ID': '' }]).roots[0].children.length, 0);
console.log('PASS hierarchy, containment, non-overlap, empty circles, unplaced records');

// Authorized consolidation changes canonical records, not a visual projection.
for (const [wrapper, role] of [['G-003','G-002'], ['G-012','G-033'], ['G-014','G-026'], ['G-015','G-030'], ['G-018','G-031']]) {
  assert.equal(nodes.get(wrapper).row.Status, 'Retired');
  assert.equal(nodes.get(role).row.Type, 'Role');
  assert.notEqual(nodes.get(role).row['Parent Circle ID'], wrapper);
}
// Chapter Network is retired outright (not renamed to Berkeley — Berkeley is a
// separate, independently-rooted circle; see the roots assertions above).
assert.equal(nodes.get('G-011').row.Status, 'Retired', 'Chapter Network is retired');
assert.equal(nodes.get('G-041').row.Name, 'DNA', 'Meta was renamed to DNA');
assert.equal(nodes.get('G-002').row['Parent Circle ID'], 'G-041', 'Vision & Strategy belongs to DNA');
assert.equal(nodes.get('G-019').row['Parent Circle ID'], 'G-041', 'Finance & Fundraising belongs to DNA');
// Tech supersedes the previous automatic singleton consolidation: it stays its
// own active circle, now containing three roles moved in by user direction.
assert.equal(nodes.get('G-036').row.Status, 'Active', 'Tech remains its own circle');
assert.deepEqual(
  nodes.get('G-036').children.filter(child => child.row.Status !== 'Retired').map(child => child.row.ID).sort(),
  ['G-020', 'G-031', 'G-043'],
);

for (const node of nodes.values()) {
  if (node.row.Type !== 'Circle' || node.row.Status === 'Retired') continue;
  // G-011 (retired, excluded above) and G-019 are known current singletons:
  // their other role moved into Tech by explicit user direction (House Party
  // Fundraising Operations and Membership Systems), not an automatic
  // consolidation artifact this check is meant to catch. G-042 (Berkeley
  // Chapter) is a real local chapter root circle given a starter Circle Lead
  // role — expected to grow more roles as chapter organizing develops, not an
  // administrative wrapper that turned out to be redundant.
  if (['G-011', 'G-019', 'G-042'].includes(node.row.ID)) continue;
  const liveChildren = node.children.filter(child => child.row.Status !== 'Retired');
  assert.ok(liveChildren.length !== 1 || liveChildren[0].row.Type !== 'Role', `${node.row.Name} is not a redundant single-role wrapper`);
}
