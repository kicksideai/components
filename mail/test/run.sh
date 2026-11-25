#!/usr/bin/env bash
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
mkdir -p .wippy
exec 9>.wippy/harness.lock
flock -n 9 || { echo 'A Mail harness is already running' >&2; exit 1; }

# The template projection repository owns writes to the library table.
if grep -Eil '(INSERT[[:space:]]+INTO|UPDATE|DELETE[[:space:]]+FROM)[[:space:]]+mail_library([[:space:]]|$)'     ../src/{command,persist,read,render,jobs}/*.lua | grep -Fvx '../src/persist/library_repo.lua'; then
  echo 'Mail template table writes must go through the projection repository' >&2
  exit 1
fi

export TMPDIR="${TMPDIR:-$PWD/.wippy/tmp}"
mkdir -p "$TMPDIR"

postgres=false
previous=
for arg in "$@"; do
  [[ $arg != -- ]] || break
  if [[ $arg == --profile=postgres || ( $previous == --profile && $arg == postgres ) ]]; then
    postgres=true
    break
  fi
  previous=$arg
done
if ! "$postgres"; then
  rm -f .wippy/mail-test.sqlite{,-wal,-shm}
fi

log="${WIPPY_TEST_LOG:-.wippy/test.log}"
WIPPY_TEST_REQUIRE_CASES=1 "${WIPPY:-wippy}" test "$@" 2>&1 | tee -- "$log"
LC_ALL=C sed -E 's/\x1B\[[0-?]*[ -/]*[@-~]//g' "$log" | tr '\r' '\n' | awk '
  /No tests found|No tests match/ { empty = 1 }
  /^[[:space:]]*FAILED([[:space:]]|$)/ { failed = 1 }
  /^[[:space:]]*PASSED([[:space:]]|$)/ { passed = 1 }
  END { exit(empty || failed || !passed) }
'
