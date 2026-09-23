"""Validate local Atlas CSVs and compile the browser data. No network access."""
import csv
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# atlas_privacy_check lives alongside this file but is not a package (there's
# no scripts/__init__.py), so it must be importable both when this module is
# loaded normally (`from scripts.atlas_build import build`) and when a test
# loads it directly by file path (see scripts/tests/atlas-data.py). Adding
# this file's own directory to sys.path makes a plain top-level import work
# either way.
_HERE = Path(__file__).resolve().parent
if str(_HERE) not in sys.path:
    sys.path.insert(0, str(_HERE))
from atlas_privacy_check import check as check_atlas_privacy

REQUIRED = {
    'domains': {'ID', 'Name', 'Type', 'Purpose', 'Parent ID', 'Status'},
    'governance': {'ID', 'Name', 'Type', 'Purpose', 'Parent Circle ID', 'Accountabilities', 'Privileges', 'Status'},
    'relationships': {'ID', 'From ID', 'Relationship', 'To ID', 'Valid from', 'Valid until'},
}


def read_csv(path, required):
    with path.open(newline='', encoding='utf-8-sig') as source:
        reader = csv.DictReader(source)
        headers = reader.fieldnames or []
        if not required.issubset(headers) or len(headers) != len(set(headers)) or any(not h.strip() for h in headers):
            raise ValueError(f'{path.name}: missing, blank, or duplicate headers')
        rows = []
        for number, row in enumerate(reader, 2):
            if None in row or any(value is None for value in row.values()):
                raise ValueError(f'{path.name}:{number}: row width does not match headers')
            if any(value.strip() for value in row.values()):
                rows.append(row)
        return rows


def interval(row, start='Valid from', end='Valid until'):
    def parse(value, default):
        if not value:
            return default
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', value):
            raise ValueError(f"{row['ID']}: use YYYY-MM-DD dates")
        return date.fromisoformat(value)
    low, high = parse(row.get(start, ''), date.min), parse(row.get(end, ''), date.max)
    if low >= high:
        raise ValueError(f"{row['ID']}: end date must be after start date")
    return low, high


def check_cycles(edges, label):
    visiting, done = set(), set()
    def visit(node):
        if node in visiting:
            raise ValueError(f'{label}: cycle at {node}')
        if node in done:
            return
        visiting.add(node)
        for target in edges.get(node, []):
            visit(target)
        visiting.remove(node)
        done.add(node)
    for node in edges:
        visit(node)


def validate(data):
    index = {}
    for group, rows in data.items():
        prefix = {'domains': 'D', 'governance': 'G', 'relationships': 'R'}[group]
        for row in rows:
            identifier = row['ID']
            if not re.fullmatch(prefix + r'-\d+', identifier) or identifier in index:
                raise ValueError(f'Invalid or duplicate ID: {identifier}')
            index[identifier] = (group, row)
            if group != 'relationships' and not row['Name'].strip():
                raise ValueError(f'{identifier}: Name is required')
    for group, parent_field in [('domains', 'Parent ID'), ('governance', 'Parent Circle ID')]:
        edges = {}
        for row in data[group]:
            identifier, parent = row['ID'], row[parent_field]
            allowed = {'Mission', 'Pillar', 'Objective', 'Program', 'Domain', 'Product/Service', 'Project'} if group == 'domains' else {'Role', 'Circle'}
            if row['Type'] not in allowed:
                raise ValueError(f'{identifier}: unknown Type')
            if row['Status'] not in {'Planned', 'Active', 'Completed', 'Retired', 'Needs definition'}:
                raise ValueError(f'{identifier}: unknown Status')
            interval(row, 'Started on', 'Ended on')
            if group == 'domains' and row.get('Circle ID'):
                circle = index.get(row['Circle ID'])
                if not circle or circle[0] != 'governance' or circle[1]['Type'] != 'Circle':
                    raise ValueError(f'{identifier}: Circle ID must reference a governance Circle')
            if group == 'governance' and row.get('Person ID') and not re.fullmatch(r'P-\d+', row['Person ID']):
                raise ValueError(f'{identifier}: Person ID must look like P-123')
            if parent:
                if parent not in index or index[parent][0] != group:
                    raise ValueError(f'{identifier}: unresolved parent {parent}')
                if group == 'governance' and index[parent][1]['Type'] != 'Circle':
                    raise ValueError(f'{identifier}: governance parent must be a Circle')
                edges[identifier] = [parent]
        check_cycles(edges, 'Parent hierarchy')
    people = {}
    for row in data['governance']:
        person_id = row.get('Person ID', '')
        level = row.get('Engagement level', '')
        name = row.get('Lead Link', '').strip()
        if level and not person_id:
            raise ValueError(f"{row['ID']}: engagement level requires Person ID")
        if person_id:
            if not name or name.lower() == 'unassigned' or level not in {'Fellow', 'Steward', 'Staff'}:
                raise ValueError(f"{row['ID']}: person assignment requires a name and valid engagement level")
            identity = (name, level)
            if person_id in people and people[person_id] != identity:
                raise ValueError(f"{person_id}: conflicting person name or engagement level")
            people[person_id] = identity
    ownership, successors = {}, {}
    for row in data['relationships']:
        source, target, kind = row['From ID'], row['To ID'], row['Relationship']
        if source not in index or target not in index or source == target:
            raise ValueError(f"{row['ID']}: unresolved or self reference")
        a, b = index[source][0], index[target][0]
        if kind == 'owns' and (a, b) == ('governance', 'domains'):
            ownership.setdefault(target, []).append((interval(row), row['ID']))
        elif kind == 'supports' and a == b == 'domains':
            interval(row)
        elif kind == 'succeeds' and a == b and a in {'domains', 'governance'}:
            interval(row)
            successors.setdefault(source, []).append(target)
        else:
            raise ValueError(f"{row['ID']}: invalid relationship type or direction")
    for target, owners in ownership.items():
        owners.sort()
        for previous, following in zip(owners, owners[1:]):
            if previous[0][1] > following[0][0]:
                raise ValueError(f'{target}: overlapping ownership ({previous[1]}, {following[1]})')
    check_cycles(successors, 'Succession')


def load_data(source):
    # Runs before any parsing so a privacy violation is reported without
    # depending on the rest of the CSVs also being structurally valid, and
    # so a failure here leaves atlas-data.js untouched exactly like every
    # other validation failure below.
    check_atlas_privacy(source)
    data = {name: read_csv(source / f'{name}.csv', fields) for name, fields in REQUIRED.items()}
    validate(data)
    return data


def build(root=ROOT):
    data = load_data(root / 'data' / 'atlas')
    output = '// Generated from data/atlas/*.csv by build.py. Edit the CSVs, not this file.\nwindow.ATLAS_DATA = '
    output += json.dumps(data, ensure_ascii=False, indent=2) + ';\n'
    target = root / 'atlas-data.js'
    if not target.exists() or target.read_text() != output:
        temporary = target.with_suffix('.js.tmp')
        temporary.write_text(output)
        temporary.replace(target)
    print(f"Atlas validated: {len(data['domains'])} work records, {len(data['governance'])} roles/circles, {len(data['relationships'])} relationships")


if __name__ == '__main__':
    build()
