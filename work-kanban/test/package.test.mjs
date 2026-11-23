// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const root = new URL('../', import.meta.url)
const read = file => readFile(new URL(file, root), 'utf8')

test('the built portable component agrees with the registry entry and the pinned import map', async () => {
  const [entries, manifest, bundle, importMap] = await Promise.all([
    read('src/_index.yaml'), read('static/wippy-meta.json').then(JSON.parse),
    read('static/index.js'), read('ui/wippy-import-map.json').then(JSON.parse),
  ])
  assert.match(entries, /announced: true\s+auto_register: true/)
  assert.ok(entries.includes(`tag_name: ${manifest.wippy.tagName}`))
  assert.ok(entries.includes('entry_point: index.js'))
  assert.equal(manifest.wippy.props.properties.route.type, 'string')
  assert.match(bundle, /export\s*\{[\s\S]*?\bas webComponent\b[\s\S]*?\}/)
  for (const found of bundle.matchAll(/\bfrom\s*["']([^"']+)["']/g)) {
    assert.ok(Object.hasOwn(importMap.imports, found[1]), `Unexpected import ${found[1]}`)
  }
})
