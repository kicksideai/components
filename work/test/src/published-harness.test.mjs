// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { parseYamlDocuments } from '../../scripts/module-rules.mjs'

test('Work harness replaces only modules in this repository', async () => {
  const config = await readFile(new URL('../.wippy.yaml', import.meta.url), 'utf8')
  const replacements = config.split('  replacements:\n')[1].split(/^\S/m)[0]
  const entries = replacements.trim().split('\n').map(line => {
    const [, name, target] = line.match(/^\s*(kickside\/[^:]+):\s*(\S+)$/)
    return [name, target]
  })
  assert.deepEqual(Object.fromEntries(entries), {
    'kickside/work': '..',
    'kickside/work-planning': '../../work-planning',
    'kickside/agent-onboarding': '../../agent-onboarding',
    'kickside/sso': '../../sso',
    'kickside/dashboard': '../../dashboard',
  })
})

test('Work retains the published sprint endpoint IDs and the host router binding', async () => {
  const [work, sprints, planning] = await parseYamlDocuments(await Promise.all([
    readFile(new URL('../../src/_index.yaml', import.meta.url), 'utf8'),
    readFile(new URL('../../src/api/sprints/_index.yaml', import.meta.url), 'utf8'),
    readFile(new URL('../../../work-planning/src/_index.yaml', import.meta.url), 'utf8'),
  ]))
  const endpointIds = ['plan_close.endpoint', 'close.endpoint']
    .map(name => `${sprints.namespace}:${name}`)
  const router = work.entries.find(entry => entry.name === 'api_router')

  assert.deepEqual(sprints.entries.filter(entry => entry.kind === 'http.endpoint').map(entry => ({
    id: `${sprints.namespace}:${entry.name}`, path: entry.path, method: entry.method,
  })), [
    { id: endpointIds[0], path: '/work/sprints/plan_close', method: 'POST' },
    { id: endpointIds[1], path: '/work/sprints/close', method: 'POST' },
  ])
  assert.deepEqual(router.targets.filter(target => endpointIds.includes(target.entry)),
    endpointIds.map(entry => ({ entry, path: '.meta.router' })))
  assert.equal(router.default, undefined)
  assert.ok(!planning.entries.some(entry => entry.name === 'api_router'))
  assert.ok(!work.entries.some(entry => entry.component === 'kickside/work-planning'))
})
