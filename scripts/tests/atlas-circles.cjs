const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { atlasCircleLayout } = require('../../atlas-circles.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('atlas-data.js', 'utf8'), context);
const records = JSON.parse(JSON.stringify(context.window.ATLAS_DATA.governance));
const { roots, unplaced, nodes } = atlasCircleLayout(records);
assert.equal(roots.length, 1);
assert.equal(roots[0].row.Name, 'Sapiens First Global');
// Governance data changes constantly (a core Holacracy principle), so this checks
// specific known-ambiguous/known-resolved records rather than a total that would
// need updating on every reorg. See data/atlas/governance.csv Definition notes.
const unplacedIds = new Set(unplaced.map(node => node.row.ID));
for (const id of ['G-027', 'G-032', 'G-034', 'G-035']) {
  assert.ok(unplacedIds.has(id), `${id} should remain unplaced pending explicit reconciliation`);
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
validate(roots[0]);
assert.equal(count + unplaced.length, records.length);
assert.equal(atlasCircleLayout([]).roots.length, 0);
assert.equal(atlasCircleLayout([{ ID: 'G-001', Type: 'Circle', 'Parent Circle ID': '' }]).roots[0].children.length, 0);
console.log('PASS hierarchy, containment, non-overlap, empty circles, unplaced records');

// Authorized consolidation changes canonical records, not a visual projection.
for (const [wrapper, role] of [['G-003','G-002'], ['G-012','G-033'], ['G-014','G-026'], ['G-015','G-030'], ['G-018','G-031'], ['G-036','G-030']]) {
  assert.equal(nodes.get(wrapper).row.Status, 'Retired');
  assert.equal(nodes.get(role).row.Type, 'Role');
  assert.notEqual(nodes.get(role).row['Parent Circle ID'], wrapper);
}
assert.equal(nodes.get('G-011').row.Type, 'Circle', 'Chapter Network remains a circle');
assert.equal(nodes.get('G-002').row['Parent Circle ID'], 'G-041', 'Vision & Strategy belongs to Meta');
assert.equal(nodes.get('G-019').row['Parent Circle ID'], 'G-041', 'Finance & Fundraising belongs to Meta');

for (const node of nodes.values()) {
  if (node.row.Type !== 'Circle' || node.row.Status === 'Retired' || node.row.ID === 'G-011') continue;
  const liveChildren = node.children.filter(child => child.row.Status !== 'Retired');
  assert.ok(liveChildren.length !== 1 || liveChildren[0].row.Type !== 'Role', `${node.row.Name} is not a redundant single-role wrapper`);
}
