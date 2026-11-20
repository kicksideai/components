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
assert.equal(manifest.module, 'pim-admin')
assert.equal(manifest.version, undefined)
assert.deepEqual(manifest.embed, ['kickside.pim.admin:ui_fs'])
assert.equal(entries.filter(entry => entry.kind === 'ns.definition').length, 1)
assert(source.every(doc => /^kickside\.pim\.admin(?:\.|$)/.test(doc.namespace)))
for (const dep of entries.filter(entry => entry.kind === 'ns.dependency')) {
  assert.equal(dep.version, dep.component === 'kickside/pim' ? '>=0.1.10' : '*', dep.id)
}
for (const pattern of ['test/**', 'test:**', 'wippy.lock', 'build-inputs/**', 'ui/node_modules/**', 'static/*.map']) assert(manifest.exclude.includes(pattern), pattern)
const owned = new Map(entries.map(entry => [entry.id, entry]))
const endpoints = entries.filter(entry => entry.kind === 'http.endpoint')
assert.deepEqual(endpoints.map(entry => `${entry.method} ${entry.path}`).sort(), [
  'GET /pim-admin/catalogs/{id}/policy_defaults',
  'POST /pim-admin/catalogs/{id}/principal_labels',
])
const access = owned.get('kickside.pim.admin.security:member_endpoints').policy
const runtime = owned.get('kickside.pim.admin.security:module_runtime').policy
assert.equal(access.actions, 'access')
assert.deepEqual(runtime.actions, ['registry.get', 'funcs.call'])
assert.deepEqual([...access.resources].sort(), [
  'kickside.pim.admin:admin', 'kickside.pim.admin:catalog_settings', 'kickside.pim.admin:ui_static',
  ...endpoints.map(entry => entry.id),
].sort())
assert.deepEqual([...runtime.resources].sort(), endpoints.flatMap(entry => [entry.id, `kickside.pim.admin.api:${entry.func}`]).sort())
for (const endpoint of endpoints) {
  const handler = owned.get(`kickside.pim.admin.api:${endpoint.func}`)
  assert.equal(handler?.kind, 'function.lua', endpoint.id)
  assert(read('src/api/' + handler.source.replace('file://', '')).includes(`function M.${handler.method}(`))
}
for (const policy of entries.filter(entry => entry.kind === 'security.policy')) {
  assert(Array.isArray(policy.policy.resources))
  assert(policy.policy.resources.every(id => owned.has(id)), policy.id)
}
assert.equal(owned.get('kickside.pim.admin.security:user_security_scope').default, 'kickside.security.groups:members')
assert.deepEqual(entries.filter(entry => entry.meta?.type === 'view.component').map(entry => entry.name).sort(), ['admin', 'catalog_settings'])
assert.equal(entries.filter(entry => entry.meta?.type === 'ui.nav_item').length, 0)
const tab = owned.get('kickside.pim.admin:settings_tab')
assert.equal(tab.component_tag, 'kickside-pim-admin')
assert.equal(tab.access, 'kickside.pim.api:apply_schema.endpoint')
for (const view of entries.filter(entry => entry.meta?.type === 'view.component')) {
  assert.equal(view.meta.base_path, 'kickside-pim-admin')
  assert(view.meta.announced && view.meta.auto_register)
  assert(existsSync(resolve(root, 'static', view.meta.entry_point)))
}
for (const name of ['index.js', 'product.js', 'layout.js', 'history.js']) assert(!existsSync(resolve(root, 'static', name)), name)
const harness = parse(read('test/.wippy.yaml'))
assert.equal(harness.workspace.replacements['kickside/pim-admin'], '..')
assert.equal(harness.workspace.replacements['kickside/pim'], '../../pim')
assert(Object.keys(harness.workspace.replacements).every(id => ['kickside/pim-admin', 'kickside/pim'].includes(id)))
const lock = parse(read('test/wippy.lock'))
const floors = { 'kickside/component': '0.3.20', 'kickside/core': '0.3.17', 'kickside/jobs': '0.1.80' }
const version = value => value.split('.').map(Number)
for (const [name, floor] of Object.entries(floors)) {
  const current = version(lock.modules.find(module => module.name === name).version), minimum = version(floor)
  assert(current[0] > minimum[0] || current[0] === minimum[0] && (current[1] > minimum[1] || current[1] === minimum[1] && current[2] >= minimum[2]), name)
}
const installed = JSON.parse(execFileSync(process.env.WIPPY || 'wippy', ['registry', 'list', '--ns', 'kickside.pim.admin*', '--json'], { cwd: resolve(root, 'test'), encoding: 'utf8' }))
assert.deepEqual(installed.map(entry => entry.id).sort(), entries.map(entry => entry.id).sort(), 'installed source is current')
console.log(`Module checks passed: ${entries.length} entries, ${endpoints.length} exact helper endpoints, sibling PIM source, administration-only bundles`)
