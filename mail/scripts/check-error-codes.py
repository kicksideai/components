#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Check the generated Mail error and diagnostic code reference."""

import argparse
from collections import defaultdict
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
    found = defaultdict(set)
    for path in sorted(root.rglob("*.lua")):
        relative = path.relative_to(root).as_posix()
        source = "\n".join(line for line in path.read_text().splitlines() if not line.lstrip().startswith("--"))
        for pattern in DECLARATIONS:
            for code in re.findall(pattern, source):
                found[code].add(relative)
        if relative == "domain/failure.lua":
            # TEXT contains the public Activity codes, including external errors that Mail maps.
            text = source.split("local TEXT = {", 1)[1].split("\n}", 1)[0]
            for code in re.findall(r"^\s*([a-z][a-z0-9_]*)\s*=", text, re.MULTILINE):
                found[code].add(relative)
    return found


def reference(root):
    codes = declared_codes(root)
    width = max(map(len, codes)) + 2
    rows = [f'{"Code":<{width}}Declared in']
    rows.extend(f"{code:<{width}}{', '.join(sorted(codes[code]))}" for code in sorted(codes))
    return START + "\n\n```text\n" + "\n".join(rows) + "\n```\n\n" + END


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--update", action="store_true")
    args = parser.parse_args()
    path = ROOT / "README.md"
    content = path.read_text()
    before, start, rest = content.partition(START)
    _, end, after = rest.partition(END)
    if not start or not end:
        print("README is missing the Mail codes section markers", file=sys.stderr)
        return 1
    expected = before + reference(ROOT) + after
    if args.update:
        path.write_text(expected)
    elif content != expected:
        print("Mail error codes changed. Run python3 mail/scripts/check-error-codes.py --update.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
