// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { readFile, readdir, mkdtemp, writeFile, rm, mkdir } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const rulesPath = resolve(root, 'scripts/module-rules.mjs')
const handler = (name) => ({ id: `kickside.work.api:${name}`, kind: 'function.lua', method: 'handler' })
const endpoint = (name, func = name) => ({ id: `kickside.work.api:${name}.endpoint`, kind: 'http.endpoint', func })

async function luaFiles(directory) {
  const paths = []
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, item.name)
    if (item.isDirectory()) paths.push(...await luaFiles(path))
    else if (item.isFile() && path.endsWith('.lua')) paths.push(path)
  }
  return paths
}

test('retention uses the owner callback without a subscriber or notification authority', async () => {
  const { parseYamlDocuments } = await import(rulesPath)
  for (const path of ['src/_index.yaml', 'src/persist/_index.yaml', 'src/jobs/_index.yaml', 'src/retention/_index.yaml']) {
    const [document] = await parseYamlDocuments([await readFile(resolve(root, path), 'utf8')])
    for (const entry of document.entries) {
      assert.notEqual(entry.name, 'process_host', path)
      assert.ok(!entry.name.startsWith('settings_changed'), path)
      assert.ok(!Object.values(entry.imports || {}).includes('kickside.core.retention:notifier'), path)
      assert.ok(!JSON.stringify(entry.security || {}).includes('kickside.core.retention:notify_access'), path)
    }
  }
})





test('Work keeps component storage private throughout its source tree', async () => {
  for (const path of await luaFiles(resolve(root, 'src'))) {
    assert.doesNotMatch(await readFile(path, 'utf8'), /kickside_components/, path)
  }
})

test('orphan-prefix retention keeps component storage and deletion private', async () => {
  const source = await readFile(resolve(root, 'src/persist/lifecycle.lua'), 'utf8')
  const release = source.slice(source.indexOf('function M.remove_prefix('))
  assert.doesNotMatch(release, /kickside_components|component\.system_delete/)
})

test('retention leaves deletion continuation to the platform job', async () => {
  const source = await readFile(resolve(root, 'src/retention/owner.lua'), 'utf8')
  assert.doesNotMatch(source, /system_delete|rows\.pending/)
})

test('endpoints grow with the registry and each handler has exactly one route', async () => {
  const { checkEndpoints } = await import(rulesPath)
  const entries = Array.from({ length: 41 }, (_, index) => [handler(`method${index}`), endpoint(`method${index}`)]).flat()
  assert.deepEqual(checkEndpoints(entries), [])
  assert.match(checkEndpoints([...entries, handler('unreachable')]).join('\n'), /unreachable.*exactly one endpoint/)
  assert.match(checkEndpoints([...entries, endpoint('duplicate', 'method0')]).join('\n'), /method0.*exactly one endpoint/)
})

test('every endpoint resolves a local or qualified handler function', async () => {
  const { checkEndpoints } = await import(rulesPath)
  assert.deepEqual(checkEndpoints([handler('read'), endpoint('read', 'kickside.work.api:read')]), [])
  for (const entry of [undefined, { id: 'kickside.work.api:read', kind: 'library.lua' }, { ...handler('read'), method: 'run' }]) {
    assert.match(checkEndpoints([endpoint('read'), ...entry ? [entry] : []]).join('\n'), /read.endpoint.*handler/)
  }
})

test('dependency ranges belong to their parsed entry regardless of YAML field order', async () => {
  const { parseYamlDocuments, checkDependencies } = await import(rulesPath)
  const [document] = await parseYamlDocuments([`namespace: kickside.work
entries:
- name: before
  version: '*'
  kind: ns.dependency
- name: after
  kind: ns.dependency
  meta:
    comment: a nested version does not replace the entry version
    version: 1.0.0
  version: "^1.0"
- {name: inline, kind: ns.dependency, version: '~2.0'}
`])
  assert.deepEqual(checkDependencies(document.entries), [])
  assert.equal(checkDependencies([{ name: 'exact', kind: 'ns.dependency', version: '1.0.0' }]).length, 1)
  assert.equal(checkDependencies([{ name: 'missing', kind: 'ns.dependency', meta: { version: '*' } }]).length, 1)
  assert.equal(checkDependencies([{ name: 'range', kind: 'ns.dependency', version: '*' }, { name: 'missing', kind: 'ns.dependency' }]).length, 1)
})

test('every Lua type declaration lives in its directory types.lua', async () => {
  const misplaced = []
  for (const path of await luaFiles(resolve(root, 'src'))) {
    if (!path.endsWith('/types.lua') && /^type\s/m.test(await readFile(path, 'utf8'))) misplaced.push(path)
  }
  assert.deepEqual(misplaced, [])
})

test('consolidated type libraries have one import alias per dependency', async () => {
  const { parseYamlDocuments } = await import(rulesPath)
  async function check(directory) {
    for (const item of await readdir(directory, { withFileTypes: true })) {
      const path = resolve(directory, item.name)
      if (item.isDirectory()) await check(path)
      else if (/\.ya?ml$/.test(path)) {
        const [document] = await parseYamlDocuments([await readFile(path, 'utf8')])
        for (const entry of document.entries) {
          const dependencies = Object.values(entry.imports || {})
          assert.equal(new Set(dependencies).size, dependencies.length, `${document.namespace}:${entry.name} imports one dependency under multiple aliases`)
        }
      }
    }
  }
  await check(resolve(root, 'src'))
})

test('contracts and adapter schemas share the generated vocabulary', async () => {
  const { run } = await import(rulesPath)
  await run('node', [resolve(root, 'scripts/generate-contracts.mjs'), '--check'])
})

test('operation descriptions and declaration enums match their owning dispatch sets', async () => {
  const { parseYamlDocuments } = await import(rulesPath)
  const [document] = await parseYamlDocuments([await readFile(resolve(root, 'src/contracts/board.yaml'), 'utf8')])
  const methods = Object.fromEntries(document.entries.find(entry => entry.name === 'board').methods.map(method => [method.name, JSON.parse(method.input_schemas[0].definition)]))
  assert.equal(methods.plugin_feed.properties.kind.type, 'string')
  assert.equal(methods.plugin_feed.properties.kind.enum, undefined)
  assert.match(methods.update.properties.key_prefix.description, /prefix_immutable/)
  assert.equal(methods.get_time_in_state.properties.after?.type, 'integer')
  assert.match(methods.get_time_in_state.properties.field.description, /category/)
  assert.match(methods.query.properties.cross_after.properties.id.description, /marker.*WorkFindItems/)
  assert.doesNotMatch(methods.report.properties.outputs.description, /omit for an empty/)
  assert.match(methods.apply.properties.key.description, /255 bytes/)
  assert.equal(methods.create.properties.idempotency_key.description, methods.apply.properties.key.description)
  assert.equal(methods.bulk.properties.ops_template.items.properties.item.type, undefined)
  assert.match(methods.bulk.properties.ops_template.items.properties.item.description, /bulk_template_item/)
  const [tools] = await parseYamlDocuments([await readFile(resolve(root, 'src/traits/admin.yaml'), 'utf8')])
  assert.match(tools.entries.find(entry => entry.name === 'create_board').meta.llm_description, /Work administration capability/)
  const source = await readFile(resolve(root, 'src/command/items.lua'), 'utf8')
  const handlers = source.match(/local HANDLERS[^=]*= \{([\s\S]*?)\n\}/)[1]
  const kinds = [...handlers.matchAll(/\b(\w+) =/g)].map(match => match[1]).sort()
  const constants = await readFile(resolve(root, 'src/consts.lua'), 'utf8')
  const constantSet = name => [...constants.match(new RegExp(`M\\.${name} = \\{([^}]+)\\}`))[1].matchAll(/\b(\w+) = true/g)].map(match => match[1]).sort()
  const approval = await readFile(resolve(root, 'src/command/process_approval.lua'), 'utf8')
  const decisions = [...approval.match(/if decision ~= [^\n]+ then/)[0].matchAll(/decision ~= "([^"]+)"/g)].map(match => match[1]).sort()
  assert.deepEqual(methods.apply.properties.ops.items.properties.op.description.match(/Accepted: ([^.]+)\./)[1].split(', ').sort(), kinds)
  assert.deepEqual(methods.bulk.properties.ops_template.items.properties.op.description.match(/Accepted: ([^.]+)\./)[1].split(', ').sort(), kinds.filter(kind => kind !== 'create'))
  for (const node of [methods.apply.properties.ops.items, methods.bulk.properties.ops_template.items]) {
    for (const key of ['op', 'target', 'mentions', 'after', 'before', 'parent', 'body', 'state', 'transition', 'type', 'expect_version', 'decision', 'outcome', 'region']) assert.equal(node.properties[key].type, undefined, key)
    assert.deepEqual(node.properties.mentions.description.match(/Accepted kinds: ([^.]+)\./)[1].split(', ').sort(), constantSet('PRINCIPAL_KINDS'))
    assert.deepEqual(node.properties.outcome.description.match(/Accepted: ([^.]+)\./)[1].split(', ').sort(), constantSet('STAGE_OUTCOMES'))
    assert.deepEqual(node.properties.decision.description.match(/Accepted: ([^.]+)\./)[1].split(', ').sort(), decisions)
  }
  const sets = Object.fromEntries(['FORMS', 'CARDINALITIES', 'INDEXES', 'CATEGORIES', 'STATE_KINDS', 'MIGRATIONS', 'PRINCIPAL_KINDS', 'STAGE_OUTCOMES'].map(name => {
    const body = constants.match(new RegExp(`M\\.${name} = \\{([^}]+)\\}`))[1]
    return [name, [...body.matchAll(/\b(\w+) = true/g)].map(match => match[1]).sort()]
  }))
  function enums(node, path, parent) {
    const name = path.at(-1)
    const constant = ({ form: 'FORMS', index: 'INDEXES', category: 'CATEGORIES', migration: 'MIGRATIONS', outcome: 'STAGE_OUTCOMES' })[name]
      || (name === 'kind' ? parent?.properties?.category && parent?.properties?.id ? 'STATE_KINDS'
        : parent?.properties?.id && Object.keys(parent.properties).length === 2 ? 'PRINCIPAL_KINDS' : undefined : undefined)
      || (name === 'cardinality' && path.includes('fields') ? 'CARDINALITIES' : undefined)
    if (constant && !path.includes('ops') && !path.includes('ops_template')) assert.deepEqual(node.enum?.toSorted(), sets[constant], path.join('.'))
    for (const [name, value] of Object.entries(node.properties || {})) enums(value, [...path, name], node)
    for (const name of ['items', 'additionalProperties']) if (typeof node[name] === 'object') enums(node[name], path, parent)
    for (const name of ['anyOf', 'oneOf', 'allOf']) for (const branch of node[name] || []) enums(branch, path, parent)
  }
  for (const [name, schema] of Object.entries(methods)) enums(schema, [name])
  const rollup = await readFile(resolve(root, 'src/domain/rollup.lua'), 'utf8')
  const functions = [...rollup.match(/local FUNCTIONS = \{([^}]+)\}/)[1].matchAll(/\b(\w+) = true/g)].map(match => match[1]).sort()
  for (const name of ['create', 'plan_schema', 'apply_schema']) {
    assert.deepEqual(methods[name].properties.declaration.anyOf[0].properties.fields.anyOf[0].items.properties.fn.enum.toSorted(), functions)
  }
})

test('a concurrent PostgreSQL harness cannot delete an active SQLite database or enter the runtime', async () => {
  const cache = resolve(root, 'test/.wippy')
  await mkdir(cache, { recursive: true })
  const directory = await mkdtemp(resolve(cache, 'harness-exclusion-'))
  const runner = resolve(directory, 'run.sh'), fake = resolve(directory, 'wippy')
  await writeFile(runner, await readFile(resolve(root, 'test/run.sh')))
  await writeFile(fake, `#!/usr/bin/env bash
set -e
printf '%s\n' "$WORK_HARNESS_ROLE" >> entered
if [ "$WORK_HARNESS_ROLE" = first ]; then
  printf 'owned\n' > .wippy/work-test.sqlite
  printf 'READY\n'
  while [ ! -e release ]; do sleep 0.01; done
fi
printf 'PASSED\n'
`, { mode: 0o755 })
  const first = spawn('bash', [runner], { env: { ...process.env, WIPPY: fake, WORK_HARNESS_ROLE: 'first' }, cwd: directory })
  const firstExit = once(first, 'close')
  try {
    await new Promise((accept, reject) => {
      first.once('error', reject)
      first.stdout.on('data', chunk => { if (chunk.toString().includes('READY')) accept() })
    })
    const second = spawn('bash', [runner, '--profile', 'postgres'], { env: { ...process.env, WIPPY: fake, WORK_HARNESS_ROLE: 'second' }, cwd: directory })
    const [code] = await once(second, 'close')
    assert.notEqual(code, 0, 'the conflicting run is refused')
    assert.equal(await readFile(resolve(directory, '.wippy/work-test.sqlite'), 'utf8'), 'owned\n')
    assert.equal(await readFile(resolve(directory, 'entered'), 'utf8'), 'first\n')
  } finally {
    await writeFile(resolve(directory, 'release'), '')
    assert.equal((await firstExit)[0], 0)
    await rm(directory, { recursive: true })
  }
})
