// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const vocabulary = JSON.parse(await readFile(resolve(root, 'src/contracts/vocabulary.json'), 'utf8'))
const check = process.argv.includes('--check')

function expand(value) {
  if (Array.isArray(value)) return value.map(expand)
  if (!value || typeof value !== 'object') return value
  if (value.$work_ref) {
    const definition = vocabulary.definitions[value.$work_ref]
    if (!definition) throw new Error(`Unknown schema ${value.$work_ref}`)
    return expand(definition)
  }
  return Object.fromEntries(Object.entries(value).map(([key, member]) => [key, expand(member)]))
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
  await writeFile(filename, value)
}

function schemas(text, replacements) {
  let index = 0
  const result = text.replace(/'(\{[^\n]*\})'/g, () => {
    const value = replacements[index++]
    if (!value) throw new Error('Schema slot has no vocabulary entry')
    return `'${JSON.stringify(expand(value)).replaceAll("'", "''")}'`
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

// Compilation owns semantic validation; this shape checks declaration structure.
function structure(schema) {
  if (schema.anyOf?.[1]?.maxItems === 0) return structure(schema.anyOf[0])
  const result = {}
  for (const key of ['type', 'required', 'additionalProperties']) {
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
