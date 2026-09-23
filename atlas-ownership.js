/* Holacracy v5 default display rules. Ownership and role-filling are separate. */
function createAtlasOwnership(data, today) {
  const governance = new Map((data.governance || []).map(row => [row.ID, row]));
  const current = relation => (!relation['Valid from'] || relation['Valid from'] <= today)
    && (!relation['Valid until'] || today < relation['Valid until']);
  function circleCoverage(circleId) {
    const visited = new Set();
    while (circleId && !visited.has(circleId)) {
      visited.add(circleId);
      const circle = governance.get(circleId);
      if (!circle || circle.Type !== 'Circle') break;
      // A policy can delegate coverage away from the constitutional default.
      if (circle['Coverage policy']) return { circleId, reason: 'policy', note: circle['Coverage policy'] };
      // Do not infer an anchor-circle policy from a legacy Lead Link name.
      if (!circle['Parent Circle ID'] && !circle['Circle Lead policy']) return { circleId, reason: 'anchor' };
      const names = (circle['Lead Link'] || '').trim();
      if (names && names.toLowerCase() !== 'unassigned') return { circleId, reason: 'assigned', names };
      if (!names) return { circleId, reason: 'unknown' };
      // An explicitly unfilled subcircle is covered from its containing circle.
      circleId = circle['Parent Circle ID'];
    }
    return { circleId: '', reason: 'unknown' };
  }
  function responsibility(domain) {
    const explicit = (data.relationships || []).filter(row => row.Relationship === 'owns'
      && row['To ID'] === domain.ID && current(row)).map(row => row['From ID']);
    if (explicit.length) {
      const owner = governance.get(explicit[0]);
      if (owner?.Type === 'Circle') return { ids: explicit, kind: 'circle', coverage: circleCoverage(owner.ID) };
      // Empty data is unknown, not proof that a role is unfilled.
      if (owner?.['Lead Link']?.trim().toLowerCase() === 'unassigned') {
        return { ids: explicit, kind: 'unfilled', coverage: circleCoverage(owner['Parent Circle ID']) };
      }
      return { ids: explicit, kind: 'explicit' };
    }
    const circle = governance.get(domain['Circle ID']);
    if (circle?.Type === 'Circle') return { ids: [circle.ID], kind: 'undelegated', coverage: circleCoverage(circle.ID) };
    return { ids: [], kind: 'unknown' };
  }
  return { responsibility };
}
if (typeof module !== 'undefined') module.exports = { createAtlasOwnership };
