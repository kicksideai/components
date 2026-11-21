// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const readJSON = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'))
const declaration = await readJSON('src/schema/declaration.json')
const { methods, tools, definitions, limits } = await readJSON('src/contracts/vocabulary.json')
const check = process.argv.includes('--check')
const license = 'SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0'
const generated = 'Generated from the catalog vocabulary by scripts/generate-contracts.mjs.'

definitions.declaration = declaration

function limit(name) {
  const value = limits[name]
  if (!Number.isSafeInteger(value) || value < 1) throw new Error(`Invalid PIM limit ${name}`)
  return value
}

function expand(value) {
  if (typeof value === 'string') return value.replace(/@\{(\w+)\}/g, (_, name) => limit(name))
  if (Array.isArray(value)) return value.map(expand)
  if (!value || typeof value !== 'object') return value
  if (value.$pim_limit) return limit(value.$pim_limit)
  const { $pim_ref: reference, ...fields } = value
  if (reference && !Object.hasOwn(definitions, reference)) throw new Error(`Unknown PIM schema ${reference}`)
  return {
    ...(reference ? expand(definitions[reference]) : {}),
    ...Object.fromEntries(Object.entries(fields).map(([key, member]) => [key, expand(member)])),
  }
}

async function output(path, value) {
  const file = resolve(root, path)
  const current = await readFile(file, 'utf8').catch(error => {
    if (error.code === 'ENOENT') return ''
    throw error
  })
  if (current === value) return
  if (check) throw new Error(`Regenerate contract schemas: ${path}`)
  await writeFile(file, value)
}

const yamlString = value => "'" + value.replaceAll("'", "''") + "'"
const yamlSchema = schema => yamlString(JSON.stringify(schema))
const contracts = expand(methods)
const methodEntries = Object.entries(contracts).map(([name, { description, input, output }]) => [
  `      - name: ${name}`,
  ...(description ? [`        description: ${yamlString(description)}`] : []),
  '        input_schemas:',
  '          - format: application/schema+json',
  `            definition: ${yamlSchema(input)}`,
  '        output_schemas:',
  '          - format: application/schema+json',
  `            definition: ${yamlSchema(output)}`,
].join('\n'))

await output('src/contracts/catalog.yaml', `# ${license}
# ${generated}
version: "1.0"
namespace: kickside.pim
entries:
  - name: catalog
    kind: contract.definition
    meta:
      title: PIM catalog
      comment: The catalog service - schema, products, reads, proposals and releases. Every method runs under the caller's identity.
    methods:
${methodEntries.join('\n')}
`)

const toolEntries = Object.entries(expand(tools)).map(([name, tool]) => {
  const { input, output } = contracts[tool.method ?? name]
  const result = structuredClone(output)
  result.properties.success = { type: 'boolean', const: true, description: 'True when the contract call completes successfully.' }
  result.required = [...(result.required ?? []), 'success']
  return `  - name: ${name}
    kind: function.lua
    meta:
      type: tool
      title: ${tool.alias}
      llm_alias: ${tool.alias}
      llm_description: ${yamlString(tool.description)}
      mcp: { required_scopes: [${tool.scope}] }
      input_schema: ${yamlSchema(input)}
      output_schema: ${yamlSchema(result)}
    source: file://pim_tool.lua
    method: ${name}
    modules: [ctx]
    imports: { catalog_client: kickside.pim:client }
`
})

await output('src/traits/tools.yaml', `# ${license}
# ${generated}
version: "1.0"
namespace: kickside.pim.traits
entries:
${toolEntries.join('\n')}`)

const blocks = {
  query_products: {
    method: 'query',
    titles: { where: 'Filter', text: 'Text', family: 'Family', status: 'Status', ready: 'Readiness', sort: 'Sort',
      count: 'Count matches', limit: 'Page size', after: 'After', published: 'Published on channel', scopes: 'Plugin scopes',
      min_seq: 'Read after sequence', columns: 'Columns' },
  },
  apply: {
    method: 'apply',
    titles: { expected_generation: 'Expected schema generation', items: 'Items', mode: 'Mode', source: 'Source',
      origin: 'Origin', idempotency: 'Idempotency', trace_context: 'Trace', provenance: 'Provenance' },
  },
  release: { method: 'release', titles: { items: 'Items', idempotency: 'Idempotency', trace_context: 'Trace' } },
}
const blockPath = 'src/blocks/_index.yaml'
const slots = new Set(Object.keys(blocks).flatMap(name => [`${name}:input`, `${name}:output`]))
let blockName
const blockSource = await readFile(resolve(root, blockPath), 'utf8')
const blockText = blockSource.split('\n').map(line => {
  const named = line.match(/^  - name: (.+)$/)
  if (named) blockName = named[1]
  const block = blocks[blockName]
  const shape = line.match(/^        (input|output): \{/)
  if (!block || !shape) return line
  const side = shape[1]
  if (!slots.delete(`${blockName}:${side}`)) throw new Error(`Duplicate Block schema ${blockName}:${side}`)
  const schema = structuredClone(contracts[block.method][side])
  if (side === 'input') {
    delete schema.properties.catalog_id
    for (const [key, title] of Object.entries(block.titles)) schema.properties[key].title = title
  }
  return `        ${side}: ${JSON.stringify(schema)}`
}).join('\n')
if (slots.size) throw new Error(`Missing Block schemas: ${[...slots].join(', ')}`)
await output(blockPath, blockText)

await output('src/contracts/limits.lua', `-- ${license}
-- ${generated}
return {
${Object.keys(limits).map(name => `    ${name} = ${limit(name)},`).join('\n')}
}
`)

const proposed = contracts.propose.input.properties
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
    decision: contracts.decide.input.properties.decision,
    status: { type: 'string', enum: [...contracts.decide.output.properties.status.enum].sort() },
    result: contracts.apply.output,
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
