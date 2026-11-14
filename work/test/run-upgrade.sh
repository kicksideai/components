#!/usr/bin/env bash
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p .wippy
exec 9>.wippy/harness.lock
flock -n 9 || { echo 'A Work harness is already running' >&2; exit 1; }
python3 - <<'PY'
import pathlib,re
names=[]
for path in pathlib.Path('src').rglob('*.yaml'):
    s=path.read_text()
    for entry in re.split(r'(?m)^- name: ',s)[1:]:
        name=entry.splitlines()[0].strip()
        if re.search(r'\btype:\s*test\b',entry):names.append(name)
for phase,target in [('seed','upgrade_seed_test'),('interrupted','upgrade_interrupted_test'),('restart','upgrade_restart_test')]:
    lines=["version: '1.0'",'override:']+[f'  app:{name}:meta.type: disabled' for name in names]
    lines.append(f'  app:{target}:meta.type: test')
    if phase!='seed':
        probe='pause' if phase=='interrupted' else 'resume'
        lines.append(f'  kickside.work.jobs:recovery:imports.jobs: app:recovery_{probe}_jobs')
    pathlib.Path(f'.wippy/upgrade-{phase}.yaml').write_text('\n'.join(lines)+'\n')
PY
rm -f .wippy/work-test.sqlite .wippy/work-test.sqlite-wal .wippy/work-test.sqlite-shm
for phase in seed interrupted restart; do
  status=0
  WIPPY_TEST_REQUIRE_CASES=1 "${WIPPY:-wippy}" test "$@" --config .wippy.yaml --config ".wippy/upgrade-$phase.yaml" > ".wippy/upgrade-$phase.log" 2>&1 || status=$?
  cat ".wippy/upgrade-$phase.log"
  test "$status" -eq 0
  grep -q PASSED ".wippy/upgrade-$phase.log"
done
