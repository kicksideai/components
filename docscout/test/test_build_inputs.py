# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Materialize the installed build input when the npm lock records an older one."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]


class BuildInputTests(unittest.TestCase):
    def test_ui_kit_uses_the_native_lock_version(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            shutil.copy2(ROOT / 'Makefile', root / 'Makefile')
            (root / 'build-inputs').mkdir()
            (root / 'build-inputs/wippy.lock').write_text('''modules:
  - name: example/other
    version: 9.0.0
  - name: kickside/ui-kit
    version: 2.3.4
''')
            (root / 'ui').mkdir()
            (root / 'ui/package-lock.json').write_text(json.dumps({'packages': {
                '.wippy/npm/@kickside/ui-kit': {'version': '1.0.0'}}}))
            binary = root / 'wippy'
            binary.write_text('''#!/usr/bin/env python3
import json, pathlib, sys
root = pathlib.Path(__file__).resolve().parent
args = sys.argv[1:]
with (root / 'calls.jsonl').open('a') as output:
    output.write(json.dumps(args) + '\\n')
if args == ['install']:
    artifact = pathlib.Path('.wippy/vendor/kickside/ui-kit-2.3.4.wapp')
    artifact.parent.mkdir(parents=True)
    artifact.write_bytes(b'native artifact')
elif args[:2] == ['artifacts', 'materialize']:
    if not pathlib.Path(args[2]).is_file():
        raise SystemExit('selected artifact is not installed')
else:
    raise SystemExit('unexpected native command')
''')
            binary.chmod(0o755)
            done = subprocess.run(['make', 'ui-kit', 'WIPPY=' + str(binary)], cwd=root,
                                  capture_output=True, text=True, timeout=30, env=os.environ)
            self.assertEqual(done.returncode, 0, done.stdout + done.stderr)
            calls = [json.loads(line) for line in (root / 'calls.jsonl').read_text().splitlines()]
            self.assertEqual(calls[-1], ['artifacts', 'materialize',
                'build-inputs/.wippy/vendor/kickside/ui-kit-2.3.4.wapp',
                'kickside.ui_kit:package_fs', '--root', 'ui/.wippy'])


if __name__ == '__main__':
    unittest.main()
