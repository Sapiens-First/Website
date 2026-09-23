const assert = require('node:assert/strict');
const { createAtlasOwnership } = require('../../atlas-ownership.js');
const today = '2026-09-22';
const make = () => ({
  domains: [{ ID: 'D-001', 'Circle ID': 'G-002' }],
  governance: [
    { ID: 'G-001', Type: 'Circle', 'Parent Circle ID': '', 'Lead Link': 'Root name' },
    { ID: 'G-002', Type: 'Circle', 'Parent Circle ID': 'G-001', 'Lead Link': 'Alice' },
    { ID: 'G-003', Type: 'Role', 'Parent Circle ID': 'G-002', 'Lead Link': 'Bob' },
    { ID: 'G-004', Type: 'Circle', 'Parent Circle ID': 'G-002', 'Lead Link': 'Unassigned' },
  ],
  relationships: [],
});
const result = data => createAtlasOwnership(data, today).responsibility(data.domains[0]);
let data = make();
assert.deepEqual(result(data), { ids: ['G-002'], kind: 'undelegated', coverage: { circleId: 'G-002', reason: 'assigned', names: 'Alice' } });
assert.deepEqual(data.relationships, []); // The fallback does not duplicate owns data.
data.relationships.push({ 'From ID': 'G-003', 'To ID': 'D-001', Relationship: 'owns', 'Valid from': '', 'Valid until': '' });
assert.deepEqual(result(data), { ids: ['G-003'], kind: 'explicit' });
data.governance[2]['Lead Link'] = 'Unassigned';
assert.equal(result(data).kind, 'unfilled');
assert.deepEqual(result(data).ids, ['G-003']); // Domain remains delegated to the role.
assert.equal(result(data).coverage.names, 'Alice');
data.governance[2]['Lead Link'] = '';
assert.equal(result(data).kind, 'explicit'); // Unknown is not proof of a vacancy.
data.relationships[0]['Valid until'] = today;
assert.equal(result(data).kind, 'undelegated');
data.relationships[0]['Valid until'] = '';
data.relationships[0]['Valid from'] = '2027-01-01';
assert.equal(result(data).kind, 'undelegated');
data.relationships = [];
data.domains[0]['Circle ID'] = 'G-004';
assert.deepEqual(result(data).ids, ['G-004']); // Do not transfer domain ownership up a level.
assert.equal(result(data).coverage.names, 'Alice');
data.domains[0]['Circle ID'] = 'G-001';
assert.equal(result(data).coverage.reason, 'anchor');
data.governance[0]['Circle Lead policy'] = 'Anchor appoints Circle Leads';
assert.equal(result(data).coverage.names, 'Root name');
data.governance[0]['Coverage policy'] = 'Coverage delegated to an alternate process';
assert.equal(result(data).coverage.reason, 'policy');
data.domains[0]['Circle ID'] = '';
assert.equal(result(data).kind, 'unknown');
data.domains[0]['Circle ID'] = 'G-003';
assert.equal(result(data).kind, 'unknown');
data = make();
data.governance[1]['Lead Link'] = '';
assert.equal(result(data).coverage.reason, 'unknown');
console.log('PASS undelegated authority, explicit ownership, unfilled roles, dates, containing circle, anchor policy, unknown assignments');
