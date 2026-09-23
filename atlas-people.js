/* People are a projection of current governance assignments, never a second roster. */
function atlasPeople(records) {
  const people = new Map();
  for (const role of records) {
    const id = role['Person ID'];
    if (!id || role.Status === 'Retired' || role.Status === 'Completed') continue;
    if (!people.has(id)) people.set(id, { id, name: role['Lead Link'], level: role['Engagement level'], roles: [] });
    people.get(id).roles.push(role);
  }
  for (const person of people.values()) person.roles.sort((a, b) => a.Name.localeCompare(b.Name) || a.ID.localeCompare(b.ID));
  return [...people.values()].sort((a, b) => (b.level === 'Staff') - (a.level === 'Staff') || a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
}

function renderAtlasPeople(host, records, query, selected) {
  host.replaceChildren();
  const el = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const all = atlasPeople(records);
  const matching = all.filter(person => [person.name, person.level, ...person.roles.map(role => role.Name)].some(value => value.toLocaleLowerCase().includes(query)));
  for (const person of matching) {
    const card = el('article', undefined, 'atlas-person');
    card.dataset.personId = person.id;
    card.tabIndex = -1;
    const duplicate = all.filter(other => other.name === person.name).length > 1;
    const heading = el('h3', person.name); heading.id = `person-${person.id}`;
    card.setAttribute('aria-labelledby', heading.id);
    if (selected === person.id) card.classList.add('is-selected');
    card.append(heading, el('span', person.level, 'atlas-badge'));
    if (duplicate) card.append(el('p', person.roles[0].Name, 'atlas-person-context'));
    card.append(el('p', `${person.roles.length} ${person.roles.length === 1 ? 'assignment' : 'assignments'}`, 'atlas-person-count'));
    const roles = el('ul', undefined, 'atlas-links');
    person.roles.forEach(role => {
      const item = el('li');
      const link = el('a', role.Name); link.href = `#governance/circles/${role.ID}`;
      item.append(link, el('span', role.Type === 'Circle' ? 'Circle' : 'Role', 'atlas-person-role-type'));
      roles.append(item);
    });
    card.append(roles); host.append(card);
  }
  if (!matching.length) host.append(el('p', 'No people match this search. Try a name, role, or engagement level.'));
  return { count: matching.length, total: all.length };
}
if (typeof module !== 'undefined') module.exports = { atlasPeople };
