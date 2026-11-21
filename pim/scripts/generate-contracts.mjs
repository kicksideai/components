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
  if (side === 'output' && method === 'list_changes') {
    schema.properties.next = {
      ...contracts.get('list_changes:input').properties.cursor,
      description: 'Pass this continuation unchanged to read the next page. Restart from zero if this page reports a gap.',
    }
  }
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

const proposed = contracts.get('propose:input').properties
const proposalItems = structuredClone(proposed.items)
proposalItems.items.properties.product = {
  type: 'object', required: ['id'], additionalProperties: false,
  properties: { id: { type: 'string', description: 'Product id captured at submission.' } },
}
const proposalFields = {
  proposal_id: { type: 'string' },
  actor: { type: 'string', description: 'Actor who issued the command.' },
  at: { type: 'string', description: 'Command time in RFC3339 UTC.' },
}
const submitted = {
  type: 'object', additionalProperties: false,
  required: ['proposal_id', 'generation', 'base', 'items', 'actor', 'at'],
  properties: {
    ...proposalFields,
    generation: { type: 'integer', minimum: 1, description: 'Schema generation that validated the proposal.' },
    base: { type: 'object', additionalProperties: { type: 'integer' }, description: 'Product versions by product id.' },
    items: proposalItems, source: proposed.source, origin: proposed.origin, provenance: proposed.provenance,
  },
}
const decided = {
  type: 'object', additionalProperties: false, required: ['proposal_id', 'decision', 'status', 'actor', 'at'],
  properties: {
    ...proposalFields,
    decision: contracts.get('decide:input').properties.decision,
    status: { type: 'string', enum: ['accepted', 'conflict', 'failed', 'rejected'] },
    result: contracts.get('apply:output'),
  },
}
await output('src/events/proposals.yaml', `# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
# Generated from the catalog contract by scripts/generate-contracts.mjs.
version: "1.0"
namespace: kickside.pim.events
entries:
  - name: proposal.submitted
    kind: registry.entry
    meta: { type: kickside.core.threads.event, comment: "A proposal is submitted for review." }
    schema: ${JSON.stringify(submitted)}
  - name: proposal.decided
    kind: registry.entry
    meta: { type: kickside.core.threads.event, comment: "A proposal decision is recorded." }
    schema: ${JSON.stringify(decided)}
`)

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
