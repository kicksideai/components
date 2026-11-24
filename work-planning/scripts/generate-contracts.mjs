// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { definitions, operations, fixtures } = JSON.parse(
  await readFile(resolve(root, 'src/contracts/vocabulary.json'), 'utf8'))
const namespace = 'kickside.work.planning'
const api = namespace + '.api'
const contracts = namespace + '.contracts'
const quote = value => "'" + value.replaceAll("'", "''") + "'"
const schema = value => quote(JSON.stringify(value))
const input = op => expand(definitions[op.method])
const output = op => expand(definitions[op.output])
const publicMethods = operations.filter(op => !op.capability)
const capabilityMethods = operations.filter(op => op.capability)

function expand(value) {
  if (Array.isArray(value)) return value.map(expand)
  if (!value || typeof value !== 'object') return value
  if (value.$planning_ref) {
    const definition = definitions[value.$planning_ref]
    if (!definition) throw new Error('Unknown Planning schema ' + value.$planning_ref)
    return expand(definition)
  }
  return Object.fromEntries(Object.entries(value).map(([name, member]) => [name, expand(member)]))
}

function yaml(ns) {
  return '# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0\n' +
    "# Generated from src/contracts/vocabulary.json.\nversion: '1.0'\nnamespace: " + ns + '\nentries:\n'
}

async function write(path, content) {
  const target = resolve(root, path)
  if (process.argv.includes('--check')) {
    if (await readFile(target, 'utf8') !== content) throw new Error('Regenerate ' + path)
  } else {
    await writeFile(target, content)
  }
}

function contract(name, methods) {
  let result = `- name: ${name}
  kind: contract.definition
  methods:
`
  for (const op of methods) {
    result += `  - name: ${op.method}
    description: ${quote(op.title)}
    input_schemas:
    - format: application/schema+json
      definition: ${schema(input(op))}
    output_schemas:
    - format: application/schema+json
      definition: ${schema(output(op))}
`
  }
  result += `- name: ${name}_binding
  kind: contract.binding
  contracts:
  - contract: ${namespace}:${name}
    default: true
    methods:
`
  for (const op of methods) result += `      ${op.method}: ${api}:handle_${op.method}\n`
  return result
}

await write('src/contracts/generated.yaml', yaml(namespace) +
  contract('planning', publicMethods) + contract('sprint_reference', capabilityMethods))

let transports = yaml(api) + `- name: api_router
  kind: ns.requirement
  meta: {value_kind: http.router, comment: Bind to the authenticated Work router.}
  targets:
`
for (const op of publicMethods) transports += `  - {entry: '${api}:${op.method}.endpoint', path: .meta.router}\n`

for (const op of operations) {
  const security = op.storage ? `  security:\n    policies: [${api}:storage_access]\n` : ''
  transports += `- name: handle_${op.method}
  kind: function.lua
  source: file://contract.lua
  method: ${op.method}
  imports: {handlers: '${api}:handlers'}
${security}`
  if (op.tool) {
    const result = output(op)
    result.properties.success = { type: 'boolean', const: true }
    result.required.push('success')
    transports += `- name: ${op.method}
  kind: function.lua
  meta:
    type: tool
    public: true
    title: ${quote(op.title)}
    llm_alias: ${op.tool}
    llm_description: ${quote(op.title)}
    mcp: {required_scopes: [${op.scope}]}
    input_schema: ${schema(input(op))}
    output_schema: ${schema(result)}
  source: file://tools.lua
  method: ${op.method}
  imports: {handlers: '${api}:handlers'}
${security}`
  }
  if (op.http) {
    transports += `- name: http_${op.method}
  kind: function.lua
  source: file://http.lua
  method: ${op.method}
  modules: [http, json]
  imports:
    handlers: ${api}:handlers
    schemas: ${contracts}:schemas
    access: kickside.work.api:access
${security}- name: ${op.method}.endpoint
  kind: http.endpoint
  method: ${op.http}
  func: http_${op.method}
  path: /work/planning/${op.method}
`
  }
}

const contractIds = ['planning', 'planning_binding', 'sprint_reference', 'sprint_reference_binding'].map(name => namespace + ':' + name)
const handlers = operations.map(op => api + ':handle_' + op.method)
const tools = publicMethods.map(op => api + ':' + op.method)
const endpoints = publicMethods.map(op => api + ':' + op.method + '.endpoint')
transports += `- name: contract_access
  kind: security.policy
  meta: {private: true}
  groups: []
  policy:
    resources: [${[...contractIds, ...handlers].map(quote).join(', ')}]
    actions: [registry.get, contract.get, contract.open, contract.call, funcs.call]
    effect: allow
- name: tool_access
  kind: security.policy
  meta: {private: true}
  groups: []
  policy:
    resources: [${tools.map(quote).join(', ')}]
    actions: [registry.get, registry.find, funcs.call]
    effect: allow
- name: endpoint_access
  kind: security.policy
  meta: {private: true}
  groups: []
  policy:
    resources: [${endpoints.map(quote).join(', ')}]
    actions: [access]
    effect: allow
`
await write('src/api/generated.yaml', transports)

const header = '-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0\n' +
  '-- Generated from src/contracts/vocabulary.json.\nlocal json = require("json")\n'
const lua = data => header + 'return assert(json.decode([==[' + JSON.stringify(data) + ']==]))\n'
const schemas = Object.fromEntries(operations.map(op => [op.method, { input: input(op), output: output(op) }]))
await write('src/contracts/schemas.lua', lua(schemas))
await write('test/src/contracts_fixtures.lua', lua(fixtures))
