// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

test('Work harness replaces only modules in this repository', async () => {
  const config = await readFile(new URL('../.wippy.yaml', import.meta.url), 'utf8')
  const replacements = config.split('  replacements:\n')[1].split(/^\S/m)[0]
  const entries = replacements.trim().split('\n').map(line => {
    const [, name, target] = line.match(/^\s*(kickside\/[^:]+):\s*(\S+)$/)
    return [name, target]
  })
  assert.deepEqual(Object.fromEntries(entries), {
    'kickside/work': '..',
    'kickside/agent-onboarding': '../../agent-onboarding',
    'kickside/sso': '../../sso',
    'kickside/dashboard': '../../dashboard',
  })
})
