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
const owned = new Map(entries.map(entry => [entry.id, entry]))

const manifest = parse(read('wippy.yaml'))
assert.equal(manifest.organization, 'kickside')
assert.equal(manifest.module, 'mail-admin')
assert.equal(manifest.version, undefined)
assert.deepEqual(manifest.embed, ['kickside.mail.admin:ui_fs'])
for (const pattern of ['test/**', 'test:**', 'wippy.lock', 'build-inputs/**', 'ui/node_modules/**', 'static/*.map']) assert(manifest.exclude.includes(pattern), pattern)

assert.equal(entries.filter(entry => entry.kind === 'ns.definition').length, 1)
assert(source.every(doc => /^kickside\.mail\.admin(?:\.|$)/.test(doc.namespace)))
const dependencies = entries.filter(entry => entry.kind === 'ns.dependency')
assert.deepEqual(dependencies.map(dep => `${dep.component}@${dep.version}`).sort(), ['kickside/contract@*', 'kickside/mail@*'])

// Administration only: one helper endpoint for the delivery driver list, no navigation item.
const endpoints = entries.filter(entry => entry.kind === 'http.endpoint')
assert.deepEqual(endpoints.map(entry => `${entry.method} ${entry.path}`), ['GET /mail-admin/drivers'])
for (const endpoint of endpoints) {
  const handler = owned.get(`kickside.mail.admin.api:${endpoint.func}`)
  assert.equal(handler?.kind, 'function.lua', endpoint.id)
  assert(read('src/api/' + handler.source.replace('file://', '')).includes(`function M.${handler.method}(`))
  assert(owned.get('kickside.mail.admin:api_router').targets.some(target => target.entry === endpoint.id), 'router target ' + endpoint.id)
}
assert.equal(entries.filter(entry => entry.meta?.type === 'ui.nav_item').length, 0)
assert.deepEqual(entries.filter(entry => entry.meta?.type === 'view.component').map(entry => entry.name).sort(), ['admin', 'delivery'])
const block = owned.get('kickside.mail.admin:delivery_block')
assert.equal(block.meta.type, 'kickside.settings:block')
assert.equal(block.namespace, 'kickside.mail')
assert.equal(block.component_tag, owned.get('kickside.mail.admin:delivery').meta.tag_name)

const tab = owned.get('kickside.mail.admin:settings_tab')
assert.equal(tab.meta.type, 'ui.settings_tab')
assert.equal(tab.key, 'mail')
assert.equal(tab.component_tag, 'kickside-mail-admin')
assert.equal(tab.access, 'kickside.mail.api:library_list.endpoint')

const view = owned.get('kickside.mail.admin:admin')
assert.equal(view.meta.tag_name, tab.component_tag)
for (const component of ['admin', 'delivery'].map(name => owned.get('kickside.mail.admin:' + name))) {
  assert.equal(component.meta.base_path, 'kickside-mail-admin')
  assert(component.meta.announced && component.meta.auto_register)
  assert(existsSync(resolve(root, 'static', component.meta.entry_point)), 'built bundle ' + component.meta.entry_point)
}
assert.equal(owned.get('kickside.mail.admin:ui_static').path, '/' + view.meta.base_path)

const access = owned.get('kickside.mail.admin.security:member_endpoints').policy
assert.equal(access.actions, 'access')
assert.deepEqual([...access.resources].sort(), ['kickside.mail.admin.api:drivers.endpoint', 'kickside.mail.admin:admin', 'kickside.mail.admin:delivery', 'kickside.mail.admin:ui_static'])
for (const policy of entries.filter(entry => entry.kind === 'security.policy')) {
  assert(Array.isArray(policy.policy.resources))
  assert(policy.policy.resources.every(id => owned.has(id)), policy.id)
}
assert.equal(owned.get('kickside.mail.admin.security:user_security_scope').default, 'kickside.security.groups:members')

const ui = JSON.parse(read('ui/package.json'))
assert.equal(ui.wippy.tagName, tab.component_tag)

const harness = parse(read('test/.wippy.yaml'))
assert.deepEqual(harness.workspace.replacements, { 'kickside/mail-admin': '..', 'kickside/mail': '../../mail' })

const installed = JSON.parse(execFileSync(process.env.WIPPY || 'wippy', ['registry', 'list', '--ns', 'kickside.mail.admin*', '--json'], { cwd: resolve(root, 'test'), encoding: 'utf8' }))
assert.deepEqual(installed.map(entry => entry.id).sort(), entries.map(entry => entry.id).sort(), 'installed source is current')
assert.deepEqual(owned.get('kickside.mail.admin.api:drivers').security.policies, ['kickside.mail.security:driver_discovery'])
console.log(`Module checks passed: ${entries.length} entries, Mail tab gated by ${tab.access}, delivery block ${block.component_tag}`)
