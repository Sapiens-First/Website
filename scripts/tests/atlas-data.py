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
assert len(data['domains']) == 21
assert len(data['governance']) == 35
assert len(data['relationships']) == 20


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
# Adjacent ownership periods and a renamed entity retain stable references.
sample = copy.deepcopy(data)
sample['domains'][0]['Name'] = 'Renamed mission'
sample['relationships'][0]['Valid until'] = '2026-10-01'
sample['relationships'].append(dict(sample['relationships'][0], ID='R-999', **{'Valid from': '2026-10-01', 'Valid until': ''}))
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
print('PASS generated parity, IDs, dates, references, cycles, overlap, rename, CSV parsing, failed-build preservation')
