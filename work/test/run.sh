#!/usr/bin/env bash
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
# Runs the harness against a fresh SQLite file (or the postgres profile when
# --profile postgres is passed) and fails on an empty or failing suite.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$HERE"
mkdir -p .wippy
exec 9>.wippy/harness.lock
flock -n 9 || { echo "A Work harness is already running" >&2; exit 1; }
rm -f .wippy/work-test.sqlite .wippy/work-test.sqlite-wal .wippy/work-test.sqlite-shm
LOG="${WIPPY_TEST_LOG:-.wippy/last-test-run.log}"
set +e
WIPPY_TEST_REQUIRE_CASES=1 "${WIPPY:-wippy}" test "$@" 2>&1 | tee "$LOG"
status=${PIPESTATUS[0]}
set -e
if [ "$status" -ne 0 ] || grep -Eq 'FAILED|No tests found|No tests match' "$LOG" || ! grep -q 'PASSED' "$LOG"; then
  echo "wippy test did not report a passing suite" >&2
  exit 1
fi
