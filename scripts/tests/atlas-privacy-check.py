"""Tests for the Atlas public/private data guardrail (scripts/atlas_privacy_check.py)."""
import csv
import importlib.util
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('atlas_privacy_check', ROOT / 'scripts/atlas_privacy_check.py')
privacy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(privacy)

build_spec = importlib.util.spec_from_file_location('atlas_build', ROOT / 'scripts/atlas_build.py')
atlas_build = importlib.util.module_from_spec(build_spec)
build_spec.loader.exec_module(atlas_build)

HEADERS = ['ID', 'Name', 'Type', 'Purpose', 'Parent ID', 'Status', 'Notes']


def write_csv(directory, name, rows, headers=HEADERS):
    path = Path(directory) / name
    with path.open('w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow({column: row.get(column, '') for column in headers})
    return path


def base_row(**overrides):
    row = {'ID': 'D-001', 'Name': 'Sample', 'Type': 'Project', 'Purpose': 'A purpose', 'Parent ID': '', 'Status': 'Active', 'Notes': ''}
    row.update(overrides)
    return row


def expect_violation(build_row, fragment):
    with tempfile.TemporaryDirectory() as directory:
        write_csv(directory, 'sample.csv', [base_row(**build_row)])
        try:
            privacy.check_file(Path(directory) / 'sample.csv')
        except ValueError as error:
            assert fragment in str(error), f'expected {fragment!r} in {error!s}'
            return
        raise AssertionError(f'expected a ValueError containing {fragment!r}, got none')


def expect_clean(build_row):
    with tempfile.TemporaryDirectory() as directory:
        write_csv(directory, 'sample.csv', [base_row(**build_row)])
        privacy.check_file(Path(directory) / 'sample.csv')  # must not raise


# --- Real repository data passes cleanly today ---------------------------
# The existing CSVs already contain real first names as Lead Link values
# (Rohan, Alex, Damian, ...) per data/atlas/README.md's tentative allowance;
# this must not flag them, and the whole point of the guardrail is that it
# does not block legitimate current content.
privacy.check(ROOT / 'data' / 'atlas')

# --- High-confidence signals are caught -----------------------------------
expect_violation({'Notes': 'Reach out at organizer@example.com for details'}, 'email address')
expect_violation({'Notes': 'Call the office at 415-555-0132 first'}, 'phone number')
expect_violation({'Notes': 'Call (415) 555 0132 first'}, 'phone number')
expect_violation({'Notes': 'Mail checks to 1600 Pennsylvania Ave, Suite 200'}, 'physical address')
expect_violation({'Notes': 'Send to San Francisco, CA 94103 for processing'}, 'physical address')
expect_violation({'Notes': 'Leaked key AKIAABCDEFGHIJKLMNOP in config'}, 'AWS access key')
expect_violation({'Notes': 'token sk_live_abcdefghijklmnopqrstuvwx in use'}, 'Stripe secret key')
expect_violation({'Notes': 'ghp_abcdefghijklmnopqrstuvwxyz012345 leaked'}, 'GitHub token')
expect_violation({'Notes': '-----BEGIN RSA PRIVATE KEY-----'}, 'PEM private key')

# A personal-looking header is caught even with otherwise-innocuous data.
with tempfile.TemporaryDirectory() as directory:
    headers = HEADERS + ['Home Address']
    write_csv(directory, 'sample.csv', [base_row(**{'Home Address': ''})], headers=headers)
    try:
        privacy.check_file(Path(directory) / 'sample.csv')
    except ValueError as error:
        assert 'Home Address' in str(error) and 'personal' in str(error)
    else:
        raise AssertionError('expected a personal-header ValueError')

for header in ['SSN', 'Date of Birth', 'DOB', 'Phone Number', 'Email', 'Passport Number']:
    with tempfile.TemporaryDirectory() as directory:
        headers = HEADERS + [header]
        write_csv(directory, 'sample.csv', [base_row()], headers=headers)
        try:
            privacy.check_file(Path(directory) / 'sample.csv')
        except ValueError:
            pass
        else:
            raise AssertionError(f'expected header {header!r} to be flagged')

# --- Legitimate content is left alone (low false-positive rate) -----------
# Bare first names: the exact kind of value data/atlas/README.md says is
# tentatively permitted as public Lead Link data. Flagging these would make
# the guardrail useless in practice.
expect_clean({'Name': 'Rohan'})
expect_clean({'Notes': 'Lead Link: Alex'})
expect_clean({'Notes': 'Owned by Damian, corroborated by Knowledge Base Circle'})
# IDs and dates that could be mistaken for phone-shaped digit runs.
expect_clean({'Notes': 'See D-001 and G-014, started 2026-09-22'})
expect_clean({'Notes': 'Valid from 2026-01-01 to 2026-12-31'})
# Org text containing digits-in-parens, which must not read as a phone number.
expect_clean({'Notes': '501(c)(3)/(c)(4) compliance tracked here'})
# "Circle"/"Court" are common org vocabulary here and must not be treated as
# street-address suffixes.
expect_clean({'Notes': 'Escalate to the Advocacy Circle Lead via the Media Circle'})
expect_clean({'Notes': 'The General Company Circle sets the Two-Year Roadmap'})
# A bare URL (no @) must not be mistaken for an email address.
expect_clean({'Notes': 'See https://sapiensfirst.org/strategy for details'})
# A plain word ending in a street-suffix-like token, with no leading number.
expect_clean({'Notes': 'Find another way to reach the Boulevard Program'})

# --- Integration: a privacy violation aborts scripts.atlas_build.build()
# and leaves the previously generated atlas-data.js untouched, matching the
# existing "failed validation leaves the existing generated data intact"
# guarantee tested in scripts/tests/atlas-data.py for structural errors.
with tempfile.TemporaryDirectory() as directory:
    root = Path(directory)
    source = root / 'data' / 'atlas'
    source.mkdir(parents=True)
    good_rows = {
        'domains': [{'ID': 'D-001', 'Name': 'Mission', 'Type': 'Mission', 'Purpose': 'p', 'Parent ID': '', 'Status': 'Active'}],
        'governance': [{'ID': 'G-001', 'Name': 'Circle', 'Type': 'Circle', 'Parent Circle ID': '', 'Purpose': 'p', 'Accountabilities': '', 'Privileges': '', 'Status': 'Active'}],
        'relationships': [],
    }
    for group, rows in good_rows.items():
        fieldnames = list(rows[0]) if rows else list(atlas_build.REQUIRED[group])
        with (source / f'{group}.csv').open('w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
    atlas_build.build(root)
    before = (root / 'atlas-data.js').read_bytes()
    # Now introduce a privacy violation and rebuild.
    with (source / 'domains.csv').open('a', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['ID', 'Name', 'Type', 'Purpose', 'Parent ID', 'Status'])
        writer.writerow({'ID': 'D-002', 'Name': 'Contact', 'Type': 'Project', 'Purpose': 'reach me at leak@example.com', 'Parent ID': '', 'Status': 'Active'})
    try:
        atlas_build.build(root)
    except ValueError as error:
        assert 'email address' in str(error)
    else:
        raise AssertionError('expected the privacy check to block the build')
    assert (root / 'atlas-data.js').read_bytes() == before, 'atlas-data.js must be left untouched on a privacy-check failure'

print('PASS current CSVs clean, email/phone/address/secret/header detection, low false-positive rate, failed-build preservation')
