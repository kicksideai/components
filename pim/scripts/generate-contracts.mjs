// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
// Keep the runtime declaration shape and tool adapters on the published grammar.
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const declaration = JSON.parse(await readFile(resolve(root, 'src/schema/declaration.json'), 'utf8'))
const check = process.argv.includes('--check')
async function output(path, value) {
  const file = resolve(root, path)
  if (await readFile(file, 'utf8').catch(() => '') === value) return
  if (check) throw new Error(`Regenerate contract schemas: ${path}`)
  await writeFile(file, value)
}
const contracts = new Map()
let method
let side
let text = await readFile(resolve(root, 'src/_index.yaml'), 'utf8')
text = text.split('\n').map(line => {
  const named = line.match(/^      - name: (.+)$/)
  if (named) method = named[1]
  if (/^        (input|output)_schemas:/.test(line)) side = line.includes('input_') ? 'input' : 'output'
  const match = line.match(/^(\s+definition: )'(\{.*\})'$/)
  if (!match) return line
  const original = JSON.parse(match[2].replaceAll("''", "'"))
  const schema = structuredClone(original)
  if (side === 'input' && ['create', 'plan_schema', 'apply_schema'].includes(method)) schema.properties.declaration = declaration
  contracts.set(`${method}:${side}`, schema)
  if (isDeepStrictEqual(schema, original)) return line
  return match[1] + "'" + JSON.stringify(schema).replaceAll("'", "''") + "'"
}).join('\n')
await output('src/_index.yaml', text)
text = await readFile(resolve(root, 'src/traits/tools.yaml'), 'utf8')
text = text.split('\n').map(line => {
  const named = line.match(/^  - name: (.+)$/)
  if (named) method = ({ create_catalog: 'create', list_catalogs: 'list' })[named[1]] || named[1]
  const match = line.match(/^(\s+)(input|output)_schema: /)
  if (!match) return line
  const schema = structuredClone(contracts.get(`${method}:${match[2]}`))
  if (!schema) throw new Error(`Missing contract schema for ${method}`)
  if (match[2] === 'output') {
    schema.properties.success = { type: 'boolean', const: true, description: 'True when the contract call completes successfully.' }
    schema.required = [...(schema.required || []), 'success']
  }
  const original = JSON.parse(line.slice(line.indexOf(": '") + 3, -1).replaceAll("''", "'"))
  if (isDeepStrictEqual(schema, original)) return line
  return `${match[1]}${match[2]}_schema: '${JSON.stringify(schema).replaceAll("'", "''")}'`
}).join('\n')
await output('src/traits/tools.yaml', text)
await output('src/schema/declaration_shape.lua', `-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Generated from declaration.json by scripts/generate-contracts.mjs.
local json = require("json")
local types = require("types")
local M = {}
function M.get(): types.JsonObject
    return assert(json.decode([==[${JSON.stringify(declaration)}]==])) :: types.JsonObject
end
return M
`)
