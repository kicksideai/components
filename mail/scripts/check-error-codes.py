#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Check the generated Mail error and diagnostic code reference."""

import argparse
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1] / "src"
START = "<!-- BEGIN MAIL CODES -->"
END = "<!-- END MAIL CODES -->"
CODE = r'["\']([a-z][a-z0-9_]*)["\']'
DECLARATIONS = (
    # Native details, Activity and writable-sink codes, and warning/log diagnostics.
    rf'\b(?:reason_)?code\s*=\s*{CODE}',
    rf'\b(?:error|failure)\(\s*errors\.[A-Z_]+,\s*{CODE}',
    rf'\b(?:invalid|limit_error|error_with_code)\(\s*{CODE}\s*,',
    rf'\b(?:setup_error|missing|fail)\(\s*[^,\n]+,\s*{CODE}',
    rf'\b(?:details\.)?code\s+or\s+{CODE}',
    rf'\bbounded_json\([^,]+,\s*[^,]+,\s*{CODE}',
    r'"(delivery_uncertain|delivery_failed|mail_library_read_denied|mail_library_write_denied)"',
)


def declared_codes(root):
    found = set()
    for path in sorted(root.rglob("*.lua")):
        relative = path.relative_to(root).as_posix()
        source = "\n".join(line for line in path.read_text().splitlines() if not line.lstrip().startswith("--"))
        for pattern in DECLARATIONS:
            found.update(re.findall(pattern, source))
        if relative == "domain/failure.lua":
            # TEXT contains the public Activity codes, including external errors that Mail maps.
            text = source.split("local TEXT = {", 1)[1].split("\n}", 1)[0]
            found.update(re.findall(r"^\s*([a-z][a-z0-9_]*)\s*=", text, re.MULTILINE))
    return found


def reference(meanings):
    width = max(map(len, meanings)) + 2
    rows = [f'{"Code":<{width}}Meaning']
    rows.extend(f"{code:<{width}}{meaning}" for code, meaning in sorted(meanings.items()))
    return START + "\n\n```text\n" + "\n".join(rows) + "\n```\n\n" + END


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--update", action="store_true")
    args = parser.parse_args()
    path = ROOT / "README.md"
    content = path.read_text()
    before, start, rest = content.partition(START)
    section, end, after = rest.partition(END)
    if not start or not end:
        print("README is missing the Mail codes section markers", file=sys.stderr)
        return 1
    meanings = {}
    for code, meaning in re.findall(r"(?m)^([a-z][a-z0-9_]*) {2,}(\S.*)$", section):
        if code in meanings:
            print(f"Duplicate meaning for {code}.", file=sys.stderr)
            return 1
        meanings[code] = meaning
    codes = declared_codes(ROOT)
    missing = sorted(codes - meanings.keys())
    extra = sorted(meanings.keys() - codes)
    if missing or extra:
        for code in missing:
            print(f"Document the meaning of {code} in the Mail codes table.", file=sys.stderr)
        for code in extra:
            print(f"Remove the undeclared code {code} from the Mail codes table.", file=sys.stderr)
        return 1
    expected = before + reference(meanings) + after
    if args.update:
        path.write_text(expected)
    elif content != expected:
        print("Mail error codes changed. Run python3 mail/scripts/check-error-codes.py --update.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
