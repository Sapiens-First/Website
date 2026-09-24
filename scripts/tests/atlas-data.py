"""Local Atlas integrity and failed-build preservation tests."""
import copy
import csv
import importlib.util
import json
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('atlas_build', ROOT / 'scripts/atlas_build.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
data = module.load_data(ROOT / 'data/atlas')
text = (ROOT / 'atlas-data.js').read_text()
assert json.loads(text[text.index('=') + 1:].strip().rstrip(';')) == data
# Row counts are derived from the CSVs themselves, not hardcoded, since governance
# data is expected to change constantly (a core Holacracy principle) — this only
# catches parsing bugs (dropped/duplicated rows), not legitimate content growth.
for group, rows in data.items():
    with (ROOT / 'data/atlas' / f'{group}.csv').open(newline='', encoding='utf-8-sig') as source:
        raw = [row for row in csv.DictReader(source) if any(value.strip() for value in row.values())]
    assert len(rows) == len(raw), f'{group}: parsed {len(rows)} rows, CSV has {len(raw)}'


def invalid(change):
    sample = copy.deepcopy(data)
    change(sample)
    try:
        module.validate(sample)
    except ValueError:
        return
    raise AssertionError('Invalid data accepted')


invalid(lambda d: d['domains'][1].update({'ID': 'D-001'}))
invalid(lambda d: d['domains'][1].update({'Parent ID': 'D-999'}))
invalid(lambda d: d['domains'][1].update({'Circle ID': 'G-999'}))
invalid(lambda d: d['domains'][1].update({'Circle ID': 'G-002'}))
invalid(lambda d: d['domains'][0].update({'Parent ID': 'D-002'}))
invalid(lambda d: d['governance'][0].update({'Parent Circle ID': 'G-002'}))
invalid(lambda d: d['relationships'][0].update({'To ID': 'D-999'}))
invalid(lambda d: d['relationships'][0].update({'From ID': 'D-002'}))
invalid(lambda d: d['relationships'][0].update({'Valid from': '2026-02-30'}))
invalid(lambda d: d['relationships'][0].update({'Valid from': '2026-02-01', 'Valid until': '2026-01-01'}))
invalid(lambda d: d['relationships'].append(dict(d['relationships'][0], ID='R-999')))
invalid(lambda d: d['relationships'].extend([
    {'ID': 'R-900', 'From ID': 'D-001', 'Relationship': 'succeeds', 'To ID': 'D-002', 'Valid from': '', 'Valid until': ''},
    {'ID': 'R-901', 'From ID': 'D-002', 'Relationship': 'succeeds', 'To ID': 'D-001', 'Valid from': '', 'Valid until': ''},
]))
# People are derived from stable identities on governance assignments.
assert len({r['Person ID'] for r in data['governance'] if r.get('Person ID')}) == 10
module.validate(copy.deepcopy(data))
invalid(lambda d: d['governance'][0].update({'Person ID': 'not-a-valid-id'}))
invalid(lambda d: d['governance'][0].update({'Engagement level': 'Graduate'}))
invalid(lambda d: d['governance'][0].update({'Lead Link': 'Someone else'}))
invalid(lambda d: d['governance'][0].update({'Person ID': ''}))
invalid(lambda d: d['governance'][0].update({'Lead Link': ''}))
# Current governance has an explicit energizer; the user-directed default is
# Rohan. Keep that assignment in the CSV rather than inventing UI fallbacks.
for row in data['governance']:
    if row['Status'] in {'Retired', 'Completed'}:
        continue
    assert row.get('Person ID'), f"{row['ID']}: record an energizer (default Rohan)"
    if row.get('Assignment basis') == 'User-directed default assignment':
        assert (row['Person ID'], row['Lead Link'], row['Engagement level']) == ('P-001', 'Rohan', 'Staff')
    parent = row['Parent Circle ID']
    if parent:
        circle = next(r for r in data['governance'] if r['ID'] == parent)
        assert circle['Status'] not in {'Retired', 'Completed'}, f"{row['ID']}: live record in an inactive circle"

# Duplicate display names are allowed; duplicate identities with conflicting facts are not.
al_ids = {r['Person ID'] for r in data['governance'] if r.get('Lead Link') == 'Al' and r.get('Person ID')}
assert len(al_ids) == 2
# Adjacent ownership periods and a renamed entity retain stable references.
sample = copy.deepcopy(data)
sample['domains'][0]['Name'] = 'Renamed mission'
current = next(r for r in sample['relationships'] if r['Relationship'] == 'owns' and r['To ID'] == 'D-001' and not r['Valid until'])
current['Valid until'] = '2026-10-01'
sample['relationships'].append(dict(current, ID='R-999', **{'Valid from': '2026-10-01', 'Valid until': ''}))
module.validate(sample)
with tempfile.TemporaryDirectory() as directory:
    root = Path(directory)
    source = root / 'data/atlas'
    source.mkdir(parents=True)
    for group, rows in data.items():
        with (source / f'{group}.csv').open('w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=list(rows[0])); writer.writeheader(); writer.writerows(rows)
    module.build(root)
    before = (root / 'atlas-data.js').read_bytes()
    (source / 'domains.csv').write_text('ID,Name\nD-001,broken\n')
    try:
        module.build(root)
    except ValueError:
        pass
    else:
        raise AssertionError('Broken build accepted')
    assert (root / 'atlas-data.js').read_bytes() == before
    path = root / 'quoted.csv'
    path.write_text('ID,Name,Notes\nD-001,"A, B","line one\nline two"\n')
    assert module.read_csv(path, {'ID', 'Name'})[0]['Notes'] == 'line one\nline two'
print('PASS generated parity, IDs, dates, references, cycles, overlap, rename, Person ID format, CSV parsing, failed-build preservation')
