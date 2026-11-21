// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { parseYamlDocuments, run } from '../../scripts/module-rules.mjs'
import { fileURLToPath } from 'node:url'

const cwd = fileURLToPath(new URL('..', import.meta.url))
const endpointIds = ['kickside.work.api.sprints:plan_close.endpoint', 'kickside.work.api.sprints:close.endpoint']

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

test('Planning owns both sprint router targets', async () => {
  const [work, planning] = await parseYamlDocuments(await Promise.all([
    readFile(new URL('../../src/_index.yaml', import.meta.url), 'utf8'),
    readFile(new URL('../../../work-planning/src/_index.yaml', import.meta.url), 'utf8'),
  ]))
  const coreRouter = work.entries.find(entry => entry.name === 'api_router')
  assert.ok(coreRouter.targets.every(target => !endpointIds.includes(target.entry)), 'Work must link independently of Planning')
  const planningRouter = planning.entries.find(entry => entry.name === 'api_router')
  assert.equal(planningRouter?.meta?.value_kind, 'http.router')
  assert.deepEqual(planningRouter.targets, endpointIds.map(entry => ({ entry, path: '.meta.router' })))
})

for (const { profile, router, title } of [
  { profile: [], router: 'app:api', title: 'Planning loads without a router binding and uses app:api' },
  { profile: ['--profile', 'planning-router'], router: 'app:planning_api', title: 'An explicit Planning router binding takes precedence' },
]) {
  test(title, async () => {
    const args = ['registry', 'list', '--kind', 'http.endpoint', '--ns', 'kickside.work.api.sprints', '--json']
    const endpoints = JSON.parse(await run(process.env.WIPPY || 'wippy', [...args, ...profile], { cwd }))
    assert.deepEqual(Object.fromEntries(endpoints.map(entry => [entry.id, entry.meta?.router])),
      Object.fromEntries(endpointIds.map(id => [id, router])))
  })
}

test('Work uses app:api without a router binding', async () => {
  const args = ['registry', 'list', '--kind', 'http.endpoint', '--ns', 'kickside.work.api', '--name', 'list.endpoint', '--json']
  const entries = JSON.parse(await run(process.env.WIPPY || 'wippy', args, { cwd }))
  assert.deepEqual(entries.map(entry => [entry.id, entry.meta?.router]), [['kickside.work.api:list.endpoint', 'app:api']])
})
