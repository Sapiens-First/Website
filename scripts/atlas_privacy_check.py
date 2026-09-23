"""Conservative public/private data guardrail for the Atlas CSVs.

Atlas's data model (data/atlas/*.csv) is compiled into atlas-data.js and
published as part of the public static site (see data/atlas/README.md:
"Publishing the site publishes these CSVs; keep their contents appropriate
for public display."). Until now nothing automated enforced that — it was
just a documented expectation. This module is that automated guardrail.

It runs automatically as part of `python3 build.py` (wired in via
scripts/atlas_build.py.load_data(), before atlas-data.js is (re)written) and
can also be run standalone:

    python3 scripts/atlas_privacy_check.py

This is a forward-looking guardrail for future edits, not a scan tuned to a
known incident, and not a cleanup of current content. data/atlas/README.md
already tentatively permits bare first names as public Lead Link values
(e.g. "Rohan", "Alex", "Damian") — flagging names, job titles, or free text
in general would be far too noisy to be useful and is explicitly NOT what
this does. It only flags a small set of high-confidence personal-data
signals:

  - email addresses
  - phone numbers
  - physical street addresses
  - obvious API keys / tokens / secrets
  - any CSV column whose header itself looks inherently personal
    (SSN, DOB, home address, phone, email, etc.), so a future schema
    addition doesn't silently start collecting private data unnoticed

A failed check raises ValueError naming the offending file, row, and column
(mirroring scripts/atlas_build.py's own validation style) and does not
modify anything. Because scripts/atlas_build.py calls this before it
(re)writes atlas-data.js, a failure leaves the existing generated file
intact, the same "failed validation leaves the existing generated data
intact" guarantee the rest of the Atlas build already makes.
"""
import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ATLAS_DIR = ROOT / 'data' / 'atlas'

# --- Value-level detectors ---------------------------------------------
# Each pattern is intentionally narrow: it matches a well-known, high-
# confidence shape rather than "anything numeric" or "anything that looks
# like a proper noun". That keeps false positives near zero against this
# dataset's actual content — bare first names, IDs (D-001, G-014), dates
# (2026-09-22), and org text like "501(c)(3)/(c)(4) compliance" all pass
# through untouched.

EMAIL_RE = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b')

# Requires a separator between the 3-3-4 digit groups, so it does not match
# unrelated digit runs such as dates (YYYY-MM-DD is a 4-2-2 shape) or IDs.
PHONE_RE = re.compile(r'(?<!\d)(?:\+?1[-.\s])?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}(?!\d)')

_STREET_SUFFIX = (
    r'(?:Street|St\.?|Avenue|Ave\.?|Boulevard|Blvd\.?|Road|Rd\.?|Drive|Dr\.?|'
    r'Lane|Ln\.?|Way|Place|Pl\.?|Suite|Ste\.?|Apt\.?|Highway|Hwy\.?|Terrace|'
    r'Parkway|Pkwy\.?)'
)
# A leading street number plus a short run of words ending in a recognized
# street-type suffix. Deliberately excludes "Circle"/"Court" as suffixes:
# both collide heavily with this org's own governance vocabulary (Circles).
ADDRESS_RE = re.compile(
    rf"\b\d{{1,6}}\s+(?:[A-Za-z0-9.'-]+\s+){{0,4}}{_STREET_SUFFIX}\b"
)
# "<City>, ST 12345" style. Requires the leading comma so a stray two-letter
# capitalized abbreviation elsewhere in prose does not trip it.
ZIP_RE = re.compile(r',\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?\b')

_SECRET_PATTERNS = [
    (re.compile(r'\bAKIA[0-9A-Z]{16}\b'), 'an AWS access key'),
    (re.compile(r'\bASIA[0-9A-Z]{16}\b'), 'an AWS temporary access key'),
    (re.compile(r'\bsk-(?:proj-)?[A-Za-z0-9]{20,}\b'), 'an API secret key (sk- prefix)'),
    (re.compile(r'\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b'), 'a Stripe secret key'),
    (re.compile(r'\bpk_(?:live|test)_[A-Za-z0-9]{16,}\b'), 'a Stripe publishable key'),
    (re.compile(r'\bgh[pousr]_[A-Za-z0-9]{20,}\b'), 'a GitHub token'),
    (re.compile(r'\bxox[baprs]-[A-Za-z0-9-]{10,}\b'), 'a Slack token'),
    (re.compile(r'\bAIza[0-9A-Za-z_-]{35}\b'), 'a Google API key'),
    (re.compile(r'-----BEGIN [A-Z ]*PRIVATE KEY-----'), 'a PEM private key block'),
    (re.compile(r'\bBearer\s+[A-Za-z0-9._-]{20,}\b'), 'a Bearer token'),
]

# --- Header-level denylist ----------------------------------------------
# Matches if a keyword appears anywhere in the (lowercased) header name.
# Deliberately narrow: none of the existing headers (ID, Name, Purpose,
# Lead Link, Definition note, Ownership note, SOP Notes, ...) match any of
# these, so today's schema passes cleanly.
_PERSONAL_HEADER_KEYWORDS = [
    'ssn', 'social security', 'date of birth', 'birth date', 'birthdate',
    'dob', 'home address', 'street address', 'mailing address',
    'phone', 'telephone', 'email', 'e-mail', 'passport',
    "driver's license", 'driver license', 'drivers license',
    'credit card', 'bank account', 'routing number', 'national id',
    'tax id',
]


def _redact(value, keep=4):
    """Show enough of a secret to locate it without echoing it in full."""
    if len(value) <= keep * 2:
        return '*' * len(value)
    return f'{value[:keep]}...{value[-keep:]}'


def _check_headers(path, headers):
    for header in headers:
        lowered = header.strip().lower()
        for keyword in _PERSONAL_HEADER_KEYWORDS:
            if re.search(rf'\b{re.escape(keyword)}\b', lowered):
                raise ValueError(
                    f'{path.name}: column "{header}" looks like it is meant to hold personal '
                    f'data (matches "{keyword.strip()}"). Atlas CSVs are published as part of '
                    f'the public site (see data/atlas/README.md) — if this column is '
                    f'intentional and safe to publish, rename it so it does not read as '
                    f'personal data; otherwise remove it.'
                )


def _check_value(path, row_number, column, value):
    if not value or not value.strip():
        return
    match = EMAIL_RE.search(value)
    if match:
        raise ValueError(
            f'{path.name}:{row_number}: column "{column}" looks like it contains an email '
            f'address ({match.group(0)}). Atlas CSVs are published as part of the public '
            f'site; remove or redact it before committing.'
        )
    match = PHONE_RE.search(value)
    if match:
        raise ValueError(
            f'{path.name}:{row_number}: column "{column}" looks like it contains a phone '
            f'number ({match.group(0)}). Atlas CSVs are published as part of the public '
            f'site; remove or redact it before committing.'
        )
    match = ADDRESS_RE.search(value) or ZIP_RE.search(value)
    if match:
        raise ValueError(
            f'{path.name}:{row_number}: column "{column}" looks like it contains a physical '
            f'address ({match.group(0)}). Atlas CSVs are published as part of the public '
            f'site; remove or redact it before committing.'
        )
    for pattern, label in _SECRET_PATTERNS:
        match = pattern.search(value)
        if match:
            raise ValueError(
                f'{path.name}:{row_number}: column "{column}" looks like it contains {label} '
                f'({_redact(match.group(0))}). Atlas CSVs are published as part of the public '
                f'site; remove it and rotate the credential before committing.'
            )


def check_file(path):
    with path.open(newline='', encoding='utf-8-sig') as source:
        reader = csv.DictReader(source)
        _check_headers(path, reader.fieldnames or [])
        for number, row in enumerate(reader, 2):
            for column, value in row.items():
                if column is None or value is None:
                    continue
                _check_value(path, number, column, value)


def check(atlas_dir=ATLAS_DIR):
    """Raise ValueError on the first high-confidence personal-data match."""
    for path in sorted(Path(atlas_dir).glob('*.csv')):
        check_file(path)


if __name__ == '__main__':
    check()
    print('Atlas privacy check: no high-confidence personal-data patterns found.')
