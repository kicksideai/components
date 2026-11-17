// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { parse } from '../ui/node_modules/yaml/dist/index.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = path => readFileSync(resolve(root, path), 'utf8')
const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const path = resolve(directory, entry.name)
  return entry.isDirectory() ? walk(path) : [path]
})
const source = walk(resolve(root, 'src')).filter(path => path.endsWith('.yaml')).map(path => parse(readFileSync(path, 'utf8')))
const entries = source.flatMap(doc => doc.entries.map(entry => ({ ...entry, id: `${doc.namespace}:${entry.name}` })))
const manifest = parse(read('wippy.yaml'))
assert.equal(manifest.organization, 'kickside')
assert.equal(manifest.module, 'work-admin')
assert.equal(manifest.version, undefined)
assert.deepEqual(manifest.embed, ['kickside.work.admin:ui_fs'])
assert.equal(entries.filter(entry => entry.kind === 'ns.definition').length, 1)
assert(source.every(doc => /^kickside\.work\.admin(?:\.|$)/.test(doc.namespace)))
for (const dep of entries.filter(entry => entry.kind === 'ns.dependency')) assert.equal(dep.version, '*', dep.id)
for (const pattern of ['test/**', 'test:**', 'wippy.lock', 'build-inputs/**', 'ui/node_modules/**', 'static/*.map']) assert(manifest.exclude.includes(pattern), pattern)
const owned = new Map(entries.map(entry => [entry.id, entry]))
const endpoints = entries.filter(entry => entry.kind === 'http.endpoint')
assert.deepEqual(endpoints.map(entry => `${entry.method} ${entry.path}`).sort(), [
  'GET /work-admin/boards/{id}/options', 'POST /work-admin/boards/{id}/principal_labels',
])
const access = owned.get('kickside.work.admin.security:member_endpoints').policy
const runtime = owned.get('kickside.work.admin.security:module_runtime').policy
assert.equal(access.actions, 'access')
assert.deepEqual(runtime.actions, ['registry.get', 'funcs.call'])
assert.deepEqual([...access.resources].sort(), [
  'kickside.work.admin:admin', 'kickside.work.admin:board_settings', 'kickside.work.admin:defaults', 'kickside.work.admin:ui_static',
  ...endpoints.map(entry => entry.id),
].sort())
assert.deepEqual([...runtime.resources].sort(), endpoints.flatMap(entry => [entry.id, `kickside.work.admin.api:${entry.func}`]).sort())
for (const endpoint of endpoints) {
  const handler = owned.get(`kickside.work.admin.api:${endpoint.func}`)
  assert.equal(handler?.kind, 'function.lua', endpoint.id)
  assert(read('src/api/' + handler.source.replace('file://', '')).includes(`function M.${handler.method}(`))
}
for (const policy of entries.filter(entry => entry.kind === 'security.policy')) {
  assert(Array.isArray(policy.policy.resources))
  assert(policy.policy.resources.every(id => owned.has(id)), policy.id)
}
assert.equal(owned.get('kickside.work.admin.security:user_security_scope').default, 'kickside.security.groups:members')
assert.deepEqual(entries.filter(entry => entry.meta?.type === 'view.component').map(entry => entry.name).sort(), ['admin', 'board_settings', 'defaults'])
assert.equal(entries.filter(entry => entry.meta?.type === 'ui.nav_item').length, 0)
const tab = owned.get('kickside.work.admin:settings_tab')
assert.equal(tab.component_tag, 'kickside-work-admin')
assert.equal(tab.access, 'kickside.work.api:create.endpoint')
for (const view of entries.filter(entry => entry.meta?.type === 'view.component')) {
  assert.equal(view.meta.base_path, 'kickside-work-admin')
  assert(view.meta.announced && view.meta.auto_register)
  assert(existsSync(resolve(root, 'static', view.meta.entry_point)))
}
for (const name of ['index.js', 'board.js', 'list.js', 'table.js', 'backlog.js']) assert(!existsSync(resolve(root, 'static', name)), name)
const harness = parse(read('test/.wippy.yaml'))
assert.equal(harness.workspace.replacements['kickside/work-admin'], '..')
// Work is published privately; the harness tests against the sibling source at the same commit.
assert.equal(harness.workspace.replacements['kickside/work'], '../../work')
assert(Object.keys(harness.workspace.replacements).every(id => ['kickside/work-admin', 'kickside/work', 'kickside/agent-onboarding', 'kickside/sso', 'kickside/dashboard'].includes(id)))
const lock = parse(read('test/wippy.lock'))
assert.equal(lock.modules.find(module => module.name === 'kickside/work').version, '0.1.1')
const floors = { 'kickside/component': '0.3.20', 'kickside/core': '0.3.17', 'kickside/jobs': '0.1.80' }
const version = value => value.split('.').map(Number)
for (const [name, floor] of Object.entries(floors)) {
  const current = version(lock.modules.find(module => module.name === name).version), minimum = version(floor)
  assert(current[0] > minimum[0] || current[0] === minimum[0] && (current[1] > minimum[1] || current[1] === minimum[1] && current[2] >= minimum[2]), name)
}
const installed = JSON.parse(execFileSync(process.env.WIPPY || 'wippy', ['registry', 'list', '--ns', 'kickside.work.admin*', '--json'], { cwd: resolve(root, 'test'), encoding: 'utf8' }))
assert.deepEqual(installed.map(entry => entry.id).sort(), entries.map(entry => entry.id).sort(), 'installed source is current')
console.log(`Module checks passed: ${entries.length} entries, ${endpoints.length} exact helper endpoints, published Work 0.1.1, administration-only bundles`)
