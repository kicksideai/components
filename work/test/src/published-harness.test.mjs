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

test('Planning binds its sprint endpoints to the host authenticated router', async () => {
  const [work, planning, harness] = await parseYamlDocuments(await Promise.all([
    readFile(new URL('../../src/_index.yaml', import.meta.url), 'utf8'),
    readFile(new URL('../../../work-planning/src/_index.yaml', import.meta.url), 'utf8'),
    readFile(new URL('./planning.yaml', import.meta.url), 'utf8'),
  ]))
  const endpointIds = ['kickside.work.api.sprints:plan_close.endpoint', 'kickside.work.api.sprints:close.endpoint']
  const coreRouter = work.entries.find(entry => entry.name === 'api_router')
  assert.ok(coreRouter.targets.every(target => !endpointIds.includes(target.entry)), 'Work must link independently of Planning')
  const planningRouter = planning.entries.find(entry => entry.name === 'api_router')
  assert.equal(planningRouter?.meta?.value_kind, 'http.router')
  assert.deepEqual(planningRouter.targets, endpointIds.map(entry => ({ entry, path: '.meta.router' })))
  const dependency = harness.entries.find(entry => entry.component === 'kickside/work-planning')
  assert.ok(dependency.parameters.some(param => param.name === `${planning.namespace}:api_router` && param.value === 'app:api'))
})
