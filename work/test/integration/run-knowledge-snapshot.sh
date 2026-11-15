#!/usr/bin/env bash
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
# Run against the real consumer projection in an isolated copy of its harness.
# Usage: run-knowledge-snapshot.sh <work-knowledge source> <scratch directory> [test flags...]
set -euo pipefail
source_tree=$(realpath "$1"); scratch_tree=$(realpath -m "$2"); shift 2
work_tree=$(realpath "$(dirname "$0")/../..")
mkdir -p "$scratch_tree/work-knowledge"
rsync -a --exclude .wippy --exclude node_modules --exclude .git "$source_tree/" "$scratch_tree/work-knowledge/"
mkdir -p "$scratch_tree/work"
rsync -a --exclude .wippy --exclude node_modules --exclude .git "$work_tree/" "$scratch_tree/work/"
python3 - "$scratch_tree/work-knowledge/test/src/knowledge_test.lua" "$work_tree/test/integration/knowledge-snapshot-case.lua" <<'PY'
import pathlib,sys
p=pathlib.Path(sys.argv[1]);s=p.read_text();s=s.replace('    test.describe("Work knowledge", function()', '    test.describe("Work knowledge", function()\n'+pathlib.Path(sys.argv[2]).read_text());p.write_text(s)
PY
cd "$scratch_tree/work-knowledge/test"
"${WIPPY:-wippy}" update
WIPPY="${WIPPY:-wippy}" ./run.sh "$@"
