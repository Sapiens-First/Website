const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { atlasCircleLayout } = require('../../atlas-circles.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('atlas-data.js', 'utf8'), context);
const records = JSON.parse(JSON.stringify(context.window.ATLAS_DATA.governance));
const { roots, unplaced, nodes } = atlasCircleLayout(records);
assert.equal(roots.length, 1);
assert.equal(roots[0].row.Name, 'General Company');
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
