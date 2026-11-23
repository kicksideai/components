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
  assert.match(bundle, /\bimport\.meta\.url\b/)

  const files = new Map([['index.js', bundle]])
  async function source(file) {
    if (!files.has(file)) files.set(file, await read('static/' + file))
    return files.get(file)
  }
  async function closure(roots) {
    const visited = new Set(roots)
    for (const file of visited) {
      const code = await source(file)
      for (const [, specifier] of code.matchAll(/^import (?:[^\n]+? from\s+)?["']([^"']+)["']/gm)) {
        if (specifier.startsWith('./')) visited.add(specifier.slice(2))
        else assert.ok(Object.hasOwn(importMap.imports, specifier), `Unexpected import ${specifier} in ${file}`)
      }
    }
    return visited
  }
  const eager = await closure(['index.js'])
  const lazy = new Set()
  for (const file of eager) {
    for (const [, chunk] of (await source(file)).matchAll(/\bimport\(["']\.\/([^"']+)["']\)/g)) lazy.add(chunk)
  }
  for (const component of ['IssueDrawer', 'CreateIssue', 'SprintsPanel', 'SearchPanel', 'NewBoardDialog', 'BacklogTable']) {
    assert.ok([...lazy].some(chunk => chunk.startsWith(component + '-')), `Missing lazy chunk for ${component}`)
    assert.ok([...eager].every(chunk => !chunk.startsWith(component + '-')), `${component} is loaded with the entry`)
  }
  await closure(lazy)
})
