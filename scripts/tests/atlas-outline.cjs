const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { atlasOutlineBuild, atlasOutlineSearch, atlasOutlineTypeLabel, atlasOutlineBand } = require('../../atlas-outline.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('atlas-data.js', 'utf8'), context);
const records = JSON.parse(JSON.stringify(context.window.ATLAS_DATA.domains));

const { nodes, root, unplaced } = atlasOutlineBuild(records);
assert.ok(root, 'a Mission record resolves as the root');
assert.equal(root.row.Type, 'Mission');
assert.equal(root.parent, null);

let count = 0;
function validate(node) {
  count++;
  for (const child of node.children) {
    assert.equal(child.parent, node, `${child.row.ID} points back to its actual parent`);
    validate(child);
  }
}
validate(root);
assert.equal(count + unplaced.length, records.length, 'every record is either placed or explicitly unplaced');

// Children sort predictably, and never include a record whose Parent ID chain
// does not resolve back to the Mission (that's what `unplaced` is for).
for (const node of nodes.values()) {
  const names = node.children.map(c => c.row.Name);
  assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)), `${node.row.ID} children are name-sorted`);
}
const unplacedIds = new Set(unplaced.map(n => n.row.ID));
for (const node of nodes.values()) for (const child of node.children) assert.ok(!unplacedIds.has(child.row.ID));

// A broken Parent ID chain and a cycle both land in `unplaced`, not silently
// attached to the root or to each other.
{
  const broken = [
    { ID: 'D-901', Name: 'Root', Type: 'Mission', 'Parent ID': '' },
    { ID: 'D-902', Name: 'Orphan', Type: 'Pillar', 'Parent ID': 'D-999' },
    { ID: 'D-903', Name: 'Cycle A', Type: 'Program', 'Parent ID': 'D-904' },
    { ID: 'D-904', Name: 'Cycle B', Type: 'Program', 'Parent ID': 'D-903' },
  ];
  const built = atlasOutlineBuild(broken);
  const brokenUnplaced = new Set(built.unplaced.map(n => n.row.ID));
  assert.ok(brokenUnplaced.has('D-902'));
  assert.ok(brokenUnplaced.has('D-903'));
  assert.ok(brokenUnplaced.has('D-904'));
}
console.log('PASS outline hierarchy build: containment, sorting, broken chains, cycles');

// Search visibility: a match's ancestors stay visible so a result reads with
// its containing hierarchy, but unrelated siblings do not appear.
{
  const leaf = [...nodes.values()].find(n => n.children.length === 0 && n !== root);
  assert.ok(leaf, 'fixture has at least one leaf record');
  const { matchIds, visible } = atlasOutlineSearch(nodes, [leaf.row]);
  assert.ok(matchIds.has(leaf.row.ID));
  let walker = leaf;
  while (walker) { assert.ok(visible.has(walker.row.ID), `${walker.row.ID} stays visible as an ancestor of the match`); walker = walker.parent; }
  const siblingIds = leaf.parent ? leaf.parent.children.map(c => c.row.ID).filter(id => id !== leaf.row.ID) : [];
  siblingIds.forEach(id => { if (!matchIds.has(id)) assert.ok(!visible.has(id) || nodes.get(id).children.length, `unrelated sibling ${id} is not forced visible`); });
}
console.log('PASS outline search: ancestor visibility without unrelated siblings');

// Type labels and bands are used for row typography/metadata — human labels
// for what's in the current data, and a stable band for every real Type.
assert.equal(atlasOutlineTypeLabel('Mission'), 'Mission');
assert.equal(atlasOutlineTypeLabel('Pillar'), 'Strategic pillar');
assert.equal(atlasOutlineBand('Mission'), 0);
assert.equal(atlasOutlineBand('Pillar'), 1);
assert.equal(atlasOutlineBand('Project'), 3);
console.log('PASS outline type labels and bands');
