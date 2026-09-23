const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { atlasPeople } = require('../../atlas-people.js');

// Synthetic fixture: Rohan has a live role plus a retired and a completed one
// (both must be excluded), Da holds two roles, and two distinct people (Al,
// Al) share a display label but must stay separate via stable Person IDs.
const synthetic = [
  { ID: 'G-001', Name: 'Circle Lead', Type: 'Circle', Status: 'Active', 'Person ID': 'P-001', 'Lead Link': 'Rohan', 'Engagement level': 'Staff' },
  { ID: 'G-002', Name: 'Knowledge Base', Type: 'Role', Status: 'Active', 'Person ID': 'P-005', 'Lead Link': 'Da', 'Engagement level': 'Fellow' },
  { ID: 'G-003', Name: 'Knowledge Management System Steward', Type: 'Role', Status: 'Active', 'Person ID': 'P-005', 'Lead Link': 'Da', 'Engagement level': 'Fellow' },
  { ID: 'G-004', Name: 'Stop 1984 CA Strategist', Type: 'Role', Status: 'Active', 'Person ID': 'P-004', 'Lead Link': 'Al', 'Engagement level': 'Fellow' },
  { ID: 'G-005', Name: 'No Killer Robots Campaigner', Type: 'Role', Status: 'Active', 'Person ID': 'P-007', 'Lead Link': 'Al', 'Engagement level': 'Fellow' },
  { ID: 'G-006', Name: 'Retired Role', Type: 'Role', Status: 'Retired', 'Person ID': 'P-001', 'Lead Link': 'Rohan', 'Engagement level': 'Staff' },
  { ID: 'G-007', Name: 'Completed Role', Type: 'Role', Status: 'Completed', 'Person ID': 'P-001', 'Lead Link': 'Rohan', 'Engagement level': 'Staff' },
  { ID: 'G-008', Name: 'Unassigned Role', Type: 'Role', Status: 'Active', 'Person ID': '', 'Lead Link': 'Unassigned', 'Engagement level': '' },
];

const people = atlasPeople(synthetic);
assert.equal(people.length, 4, 'four distinct Person IDs, ignoring unassigned and retired-only records');

const byId = new Map(people.map(person => [person.id, person]));
assert.equal(byId.get('P-001').roles.length, 1, 'Rohan keeps only the live role');
assert.deepEqual(byId.get('P-001').roles.map(role => role.ID), ['G-001']);

assert.equal(byId.get('P-005').name, 'Da');
assert.deepEqual(byId.get('P-005').roles.map(role => role.ID), ['G-002', 'G-003'], 'Da has two roles, sorted by name');

// Distinct identities sharing a display label stay separate people with
// their own roles, never merged by name.
assert.equal(byId.get('P-004').name, 'Al');
assert.equal(byId.get('P-007').name, 'Al');
assert.notEqual(byId.get('P-004').id, byId.get('P-007').id);
assert.deepEqual(byId.get('P-004').roles.map(role => role.ID), ['G-004']);
assert.deepEqual(byId.get('P-007').roles.map(role => role.ID), ['G-005']);

// Sort order: Staff first, then alphabetical by name, ties broken by Person ID.
assert.deepEqual(people.map(person => person.id), ['P-001', 'P-004', 'P-007', 'P-005']);

assert.deepEqual(atlasPeople([]), [], 'no assignments yields no people');
console.log('PASS grouping by Person ID, same-label distinct identities, role sort, retired/unassigned exclusion, empty input');

// Real data: Rohan is Staff and the only Staff; the nine named contributors
// are all Fellows; no current Stewards (graduation-gated, never auto-promoted).
const context = { window: {} };
vm.runInNewContext(fs.readFileSync('atlas-data.js', 'utf8'), context);
const real = atlasPeople(context.window.ATLAS_DATA.governance);
assert.equal(real.length, 10, 'ten current people: Rohan plus nine named Fellows');
const staff = real.filter(person => person.level === 'Staff');
assert.equal(staff.length, 1, 'Rohan is the only Staff');
assert.equal(staff[0].name, 'Rohan');
assert.ok(real.filter(person => person.level === 'Fellow').length === 9, 'nine Fellows');
assert.equal(real.filter(person => person.level === 'Steward').length, 0, 'no current Stewards');
// Two-letter public labels only, for every Fellow.
real.filter(person => person.level === 'Fellow').forEach(person => {
  assert.ok(/^[A-Z][a-z]$/.test(person.name), `${person.id}: Fellow label ${person.name} must be exactly two letters`);
});
console.log('PASS real data: Staff/Fellow/Steward counts and two-letter Fellow labels');
