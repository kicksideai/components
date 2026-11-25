#!/usr/bin/env bash
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
# Runs the harness against a fresh SQLite file (or the postgres profile when
# --profile postgres is passed) and fails on an empty or failing suite.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$HERE"
mkdir -p .wippy
exec 9>.wippy/harness.lock
flock -n 9 || { echo "A Mail admin harness is already running" >&2; exit 1; }
rm -f .wippy/mail-admin-test.sqlite .wippy/mail-admin-test.sqlite-wal .wippy/mail-admin-test.sqlite-shm
export TMPDIR="${TMPDIR:-$PWD/.wippy/tmp}"
mkdir -p "$TMPDIR"
LOG="${WIPPY_TEST_LOG:-.wippy/last-test-run.log}"
WIPPY_TEST_REQUIRE_CASES=1 "${WIPPY:-wippy}" test "$@" 2>&1 | tee -- "$LOG"
LC_ALL=C sed -E 's/\x1B\[[0-?]*[ -/]*[@-~]//g' "$LOG" | tr '\r' '\n' | awk '
  /No tests found|No tests match/ { empty = 1 }
  /^[[:space:]]*FAILED([[:space:]]|$)/ { failed = 1 }
  /^[[:space:]]*PASSED([[:space:]]|$)/ { passed = 1 }
  END { exit(empty || failed || !passed) }
'
