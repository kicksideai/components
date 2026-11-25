// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFile, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { definitions, operations, fixtures } = JSON.parse(
  await readFile(resolve(root, 'src/contracts/vocabulary.json'), 'utf8'))
const namespace = 'kickside.work.time'
const api = namespace + '.api'
const quote = value => "'" + value.replaceAll("'", "''") + "'"
const schema = value => quote(JSON.stringify(value))
const input = op => expand(definitions[op.input ?? op.method])
const output = op => expand(definitions[op.output])
const routes = operations.filter(op => op.http)
const tools = operations.filter(op => op.tool)
const methods = operations.filter(op => op.output && op.method !== 'estimate_fields')
const storagePolicies = [namespace + ':storage_config_access', namespace + ':storage_db_access']

function handlerPolicies(op) {
  const policies = op.sprint_report
    ? [...storagePolicies, namespace + '.worklogs:sprint_discovery']
    : storagePolicies
  return policies.join(', ')
}

function expand(value) {
  if (Array.isArray(value)) return value.map(expand)
  if (!value || typeof value !== 'object') return value
  if (value.$time_ref) {
    const definition = definitions[value.$time_ref]
    if (!definition) throw new Error('Unknown Time schema ' + value.$time_ref)
    return expand(definition)
  }
  return Object.fromEntries(Object.entries(value).map(([name, member]) => [name, expand(member)]))
}

function yaml(ns) {
  return "# SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0\n" +
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

function contractMethod(name, op) {
  return `  - name: ${name}
    description: ${quote(op.title)}
    input_schemas:
    - format: application/schema+json
      definition: ${schema(input(op))}
    output_schemas:
    - format: application/schema+json
      definition: ${schema(output(op))}
`
}

let contracts = yaml(namespace) + `- name: time
  kind: contract.definition
  methods:
`
for (const op of methods) contracts += contractMethod(op.method, op)
contracts += `- name: time_binding
  kind: contract.binding
  contracts:
  - contract: ${namespace}:time
    default: true
    methods:
`
for (const op of methods) contracts += `      ${op.method}: ${api}:handle_${op.method}\n`
contracts += '- name: estimate_fields\n  kind: contract.definition\n  methods:\n' +
  contractMethod('fields', operations.find(op => op.method === 'estimate_fields')) +
  `- name: estimate_fields_binding
  kind: contract.binding
  contracts:
  - contract: ${namespace}:estimate_fields
    default: true
    methods: {fields: ${api}:handle_estimate_fields}
`
await write('src/contracts/generated.yaml', contracts)

let transports = yaml(api) + `- name: api_router
  kind: ns.requirement
  meta: {value_kind: http.router, comment: The authenticated router used by Work.}
  targets:
`
for (const op of routes) transports += `  - {entry: '${api}:${op.method}.endpoint', path: .meta.router}\n`
for (const op of operations) {
  if (op.output) {
    transports += `- name: handle_${op.method}
  kind: function.lua
  source: file://contract.lua
  method: ${op.method}
  imports: {handlers: '${api}:handlers'}
  security:
    policies: [${handlerPolicies(op)}]
`
  }
  if (op.tool) {
    const result = output(op)
    result.properties.success = { type: 'boolean', const: true }
    result.required.push('success')
    transports += `- name: ${op.entry}
  kind: function.lua
  meta:
    type: tool
    public: true
    title: ${quote(op.title)}
    llm_alias: ${op.tool}
    llm_description: ${quote(op.title)}
    mcp: {required_scopes: [state.${op.access}]}
    input_schema: ${schema(input(op))}
    output_schema: ${schema(result)}
  source: file://tools.lua
  method: ${op.method}
  imports: {handlers: '${api}:handlers'}
  security:
    policies: [${handlerPolicies(op)}]
`
  }
  if (op.http) {
    transports += `- name: http_${op.method}
  kind: function.lua
  source: file://http.lua
  method: ${op.method}
  modules: [http, json]
  imports:
    handlers: ${api}:handlers
    schemas: ${namespace}.contracts:schemas
    access: kickside.work.api:access
    csv: ${api}:csv
  security:
    policies: [${handlerPolicies(op)}]
- name: ${op.method}.endpoint
  kind: http.endpoint
  method: ${op.http}
  func: http_${op.method}
  path: /work/boards/{board}/time/${op.path}
`
  }
}
const contractResources = [namespace + ':time', namespace + ':time_binding', namespace + ':estimate_fields',
  namespace + ':estimate_fields_binding', ...operations.filter(op => op.output).map(op => api + ':handle_' + op.method)]
transports += `- name: transport_access
  kind: security.policy
  meta: {private: true}
  groups: []
  policy:
    resources: [${[...contractResources, ...tools.map(op => api + ':' + op.entry)].map(quote).join(', ')}]
    actions: [registry.get, registry.find, contract.get, contract.open, contract.call, funcs.call]
    effect: allow
- name: endpoint_access
  kind: security.policy
  meta: {private: true}
  groups: []
  policy:
    resources: [${routes.map(op => quote(api + ':' + op.method + '.endpoint')).join(', ')}]
    actions: [access]
    effect: allow
`
await write('src/api/generated.yaml', transports)

function lua(data) {
  return 'assert(json.decode([==[' + JSON.stringify(data) + ']==]))'
}
const header = '-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0\n' +
  '-- Generated from src/contracts/vocabulary.json.\nlocal json = require("json")\n'
const schemas = Object.fromEntries(operations.map(op => [op.method, {
  input: input(op), output: op.output ? output(op) : undefined,
  numeric: Object.entries(input(op).properties).filter(([, value]) => value.type === 'integer').map(([name]) => name),
}]))
await write('src/contracts/schemas.lua', header + 'return ' + lua(schemas) + '\n')
await write('test/src/contracts_fixtures.lua', header + 'return ' + lua(fixtures) + '\n')
