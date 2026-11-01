#!/usr/bin/env python3
# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
"""Check that a reusable package preserves host-selected member authority."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

parser = argparse.ArgumentParser()
parser.add_argument('--wippy', default='wippy')
args = parser.parse_args()
repository = Path(__file__).resolve().parents[2]
module = repository / 'docscout'
version = json.loads((repository / '.release-please-manifest.json').read_text())['docscout']
identity = 'kickside/docscout'
selected = 'app:restricted_members'
requirement = 'kickside.docscout.security:user_security_scope'
policy = 'kickside.docscout.security:module_access'


def write(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + '\n')


def run(command: list[str], cwd: Path) -> str:
    result = subprocess.run(command, cwd=cwd, text=True, capture_output=True, timeout=120)
    if result.returncode:
        raise RuntimeError(result.stdout + result.stderr)
    return result.stdout


with tempfile.TemporaryDirectory(prefix='docscout-package-bindings-') as directory:
    root = Path(directory)
    (root / 'empty').mkdir()
    write(root / 'pack.lock', {'directories': {'src': str(root / 'empty'), 'modules': str(root / 'pack-modules')},
                              'modules': [{'name': identity, 'version': version}]})
    write(root / 'pack.yaml', {'version': '1.0', 'workspace': {'replacements': {identity: str(module)}}})
    artifact = root / 'docscout.wapp'
    run([args.wippy, 'pack', '--lock-file', str(root / 'pack.lock'), '--config', str(root / 'pack.yaml'),
         '--module', identity, '--embed', 'kickside.docscout:ui_fs', str(artifact)], repository)
    digest = hashlib.sha256(artifact.read_bytes()).hexdigest()
    vendor = root / 'modules/vendor'
    package = vendor / ('kickside/docscout-' + version + '.wapp')
    package.parent.mkdir(parents=True)
    shutil.copyfile(artifact, package)
    write(root / 'wippy.lock', {'directories': {'src': str(root / 'src'), 'modules': str(root / 'modules')},
                              'modules': [{'name': identity, 'version': version, 'hash': digest}]})

    def groups(source: bool, explicit: bool) -> list[str]:
        dependency = {'name': 'docscout', 'kind': 'ns.dependency', 'component': identity, 'version': version}
        if explicit:
            dependency['parameters'] = [{'name': requirement, 'value': selected}]
        write(root / 'src/_index.yaml', {'version': '1.0', 'namespace': 'app', 'entries': [
            {'name': 'restricted_members', 'kind': 'security.scope'}, dependency]})
        config = {'version': '1.0', 'registry': {'dependency_lock_path': str(root / 'wippy.lock'),
                                               'dependency_vendor_dir': str(vendor)},
                  'workspace': {'include_host_dependencies': False}}
        if source:
            config['workspace']['replacements'] = {identity: str(module)}
        write(root / '.wippy.yaml', config)
        result = json.loads(run([args.wippy, 'registry', 'show', policy, '--json'], root))
        return result['data'].get('groups', [])

    observed = {'source_selected': groups(True, True), 'package_default': groups(False, False),
                'package_selected': groups(False, True)}
    print(json.dumps(observed, sort_keys=True), flush=True)
    if observed['source_selected'] != [selected] or observed['package_selected'] != [selected]:
        raise SystemExit('Packaged member authority must contain only the explicitly selected group')
    if observed['package_default'] != ['kickside.security.groups:members']:
        raise SystemExit('Packaging must preserve the declared default when no host group is selected')
