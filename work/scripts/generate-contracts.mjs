// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const vocabulary = JSON.parse(await readFile(resolve(root, 'src/contracts/vocabulary.json'), 'utf8'))
const check = process.argv.includes('--check')

function expand(value) {
  if (Array.isArray(value)) return value.map(expand)
  if (!value || typeof value !== 'object') return value
  if (value.$work_ref) {
    const { $work_ref, ...annotations } = value
    const definition = vocabulary.definitions[$work_ref]
    if (!definition) throw new Error(`Unknown schema ${$work_ref}`)
    return { ...expand(definition), ...expand(annotations) }
  }
  return Object.fromEntries(Object.entries(value).map(([key, member]) => [key, expand(member)]))
}

const { operations, max_ops: maxOps } = vocabulary.operation_batch
if (!Array.isArray(operations) || !operations.length || new Set(operations).size !== operations.length ||
    operations.some(op => typeof op !== 'string' || !/^[a-z][a-z0-9_]*$/.test(op))) {
  throw new Error('Work operation_batch.operations must contain unique operation names')
}
if (!Number.isSafeInteger(maxOps) || maxOps < 1) {
  throw new Error('Work operation_batch.max_ops must be a positive integer')
}

function operationBatch(batch, allowed) {
  batch = expand(batch)
  batch.minItems = 1
  batch.maxItems = maxOps
  batch.items.properties.op = operationDiscriminator(allowed)
  batch.items.required = ['op']
  return batch
}

function operationDiscriminator(allowed) {
  return { type: 'string', enum: allowed, description: `Accepted: ${allowed.join(', ')}. Each operation returns its own outcome.` }
}

const definitions = vocabulary.definitions
definitions.apply_ops = operationBatch(definitions.apply_ops, operations)
definitions.bulk_ops = operationBatch(definitions.bulk_ops, operations.filter(op => op !== 'create'))
for (const op of ['transition', 'comment']) {
  if (!operations.includes(op)) throw new Error(`Unknown Work apply operation ${op}`)
  const schema = expand(definitions.apply_request)
  schema.properties.ops.items.properties.op = operationDiscriminator([op])
  definitions[`tool_${op}_input`] = schema
}

async function output(path, value) {
  const header = path.endsWith('.lua') ? '--' : '#'
  if (!value.startsWith(`${header} SPDX-License-Identifier:`)) {
    value = `${header} SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0\n${value}`
  }
  const filename = resolve(root, path)
  const current = await readFile(filename, 'utf8').catch(error => {
    if (error.code === 'ENOENT') return ''
    throw error
  })
  if (current === value) return
  if (check) throw new Error(`Regenerate contract schemas: ${path}`)
  await mkdir(dirname(filename), { recursive: true })
  await writeFile(filename, value)
}

function adapterSchema(source) {
  const { optional_board_id, tool_output, ...reference } = source
  const schema = expand(reference)
  if (optional_board_id) {
    schema.required = schema.required.filter(key => key !== 'board_id')
  }
  if (tool_output) {
    schema.properties.success = expand({ $work_ref: 'tool_success' })
    schema.required = [...(schema.required ?? []), 'success']
  }
  return schema
}

function schemas(text, replacements) {
  let index = 0
  const result = text.replace(/'(\{[^\n]*\})'/g, () => {
    const value = replacements[index++]
    if (!value) throw new Error('Schema slot has no vocabulary entry')
    return `'${JSON.stringify(adapterSchema(value)).replaceAll("'", "''")}'`
  })
  if (index !== replacements.length) throw new Error('Schema slot count differs from the vocabulary')
  return result
}

for (const [path, template] of Object.entries(vocabulary.contracts)) {
  const text = template.replace(/'?@work_schema\(([^)]+)\)'?/g, (_, name) =>
    JSON.stringify(expand({ $work_ref: name }))).replace(/'(\{[^\n]*\})'/g, (_, raw) => {
    const parsed = JSON.parse(raw.replaceAll("''", "'"))
    return "'" + JSON.stringify(expand(parsed)).replaceAll("'", "''") + "'"
  })
  await output(path, text)
}
for (const [path, replacements] of Object.entries(vocabulary.adapters)) {
  await output(path, schemas(await readFile(resolve(root, path), 'utf8'), replacements))
}

const feedToken = JSON.stringify(expand({ $work_ref: 'plugin_feed_token' }))
await output('src/extensions/plugin_feed_schema.lua', `local json = require("json")
local types = require("types")
local M = {}
M.token = assert(json.decode([==[${feedToken}]==])) :: types.JsonObject
return M
`)

await output('src/operation_batch.lua', `-- Generated from src/contracts/vocabulary.json.
return {
    operations = { ${operations.map(op => JSON.stringify(op)).join(', ')} },
    max_ops = ${maxOps},
}
`)

// Compilation owns semantic validation; this shape checks declaration structure.
function structure(schema) {
  if (schema.anyOf?.[1]?.maxItems === 0) return structure(schema.anyOf[0])
  const result = {}
  for (const key of ['type', 'required', 'additionalProperties', 'maxProperties']) {
    if (schema[key] !== undefined) result[key] = schema[key]
  }
  if (schema.properties) result.properties = Object.fromEntries(
    Object.entries(schema.properties).map(([key, value]) => [key, structure(value)]))
  if (schema.items) result.items = structure(schema.items)
  if (schema.anyOf) result.anyOf = schema.anyOf.map(structure)
  return result
}
const declaration = structure(expand(vocabulary.declaration))
declaration.properties.processes.items = { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] }
declaration.properties.policy = { type: 'object' }
const literal = JSON.stringify(declaration)
await output('src/domain/declaration_shape.lua', `local json = require("json")
local types = require("types")
local M = {}
local DATA = [==[${literal}]==]
function M.get(): (types.JsonObject?, error?)
    local value, err = json.decode(DATA)
    if err then return nil, err end
    return value :: types.JsonObject, nil
end
return M
`)

function luaSchema(name) {
  return `assert(json.decode([==[${JSON.stringify(expand({ $work_ref: name }))}]==]))`
}
await output('src/templates/schemas.lua', `local json = require("json")
local shape = require("shape")
local types = require("types")
return {
    config = shape.tolerant(${luaSchema('templates_pinned')} :: types.Map),
    input = shape.tolerant(${luaSchema('templates_action_input')} :: types.Map),
}
`)

await output('src/blocks/schemas.lua', `local json = require("json")
local shape = require("shape")
local types = require("types")
return {
    input = shape.tolerant(${luaSchema('wait_for_item_input')} :: types.Map),
    config = shape.tolerant(${luaSchema('wait_for_item_config')} :: types.Map),
}
`)
