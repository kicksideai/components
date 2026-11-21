// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Declaration, RemoveDecl, PluginConfigs, AttributeDecl } from './types'

export function coordinateKey(code: string, scope: string[], context: Record<string, string>): string {
  return code + '|' + JSON.stringify(Object.fromEntries([...scope].sort().map(d => [d, context[d] ?? '*'])))
}

export function reviewedRequest(declaration: Declaration, generation: number, pluginConfigs: PluginConfigs = {}) {
  const text = JSON.stringify(declaration)
  const configText = JSON.stringify(pluginConfigs)
  return {
    declaration: JSON.parse(text) as Declaration,
    generation,
    pluginConfigs: JSON.parse(configText) as PluginConfigs,
    matches: (current: Declaration, currentGeneration: number, currentConfigs: PluginConfigs = {}) => generation === currentGeneration && text === JSON.stringify(current) && configText === JSON.stringify(currentConfigs),
  }
}

export function reconcileRemovals(draft: Declaration, removed: RemoveDecl): RemoveDecl {
  const out: RemoveDecl = {}
  for (const [kind, ids] of Object.entries(removed) as [keyof RemoveDecl, string[]][]) {
    const retained = ids.filter(id => {
      if (kind === 'plugins') return !draft.plugins?.some(p => p.use === id)
      if (kind === 'scopes') return !draft.scopes?.includes(id)
      if (kind === 'attributes') return !draft.aspects?.some(a => a.attributes?.some(attr => a.namespace + '.' + attr.code === id))
      if (kind === 'aspects') return !draft.aspects?.some(a => a.namespace === id)
      if (kind === 'dimensions') return !draft.dimensions?.some(d => d.name === id)
      if (kind === 'vocabularies' || kind === 'families') return !draft[kind]?.some(v => v.code === id)
      return !draft[kind]?.some(v => v.id === id)
    })
    if (retained.length) out[kind] = retained
  }
  return out
}

const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
// Validate every shape the settings sections consume before installing a draft.
type Model = string | { [key: string]: Model } | Model[]
const strings: Model = ['string']
const labels: Model = { '*': 'string' }
const attribute: Model = { id: 'number', code: 'string!', type: 'string!', scope: strings, cardinality: 'string', index: 'string', index_contexts: [labels], unique: 'boolean', vocabulary: 'string', default: 'json', config: 'object', width: 'string' }
const editorModel: Model = {
  dimensions: [{ name: 'string!', members: strings, fallback: { '*': strings } }],
  vocabularies: [{ code: 'string!', hierarchical: 'boolean' }],
  aspects: [{ namespace: 'string!', write: { sources: strings }, attributes: [attribute] }],
  families: [{ code: 'string!', aspects: strings, variation: [{ axes: strings, own: strings }], requirements: [{ id: 'string!', context: labels, require: strings, authored: strings }], checks: [{ check: 'string!', reads: strings, cost: 'string', config: 'object', enforce: 'string' }] }],
  sources: [{ id: 'string!', ordering: 'string', writes: strings, principals: strings, audit: 'boolean' }],
  channels: [{ id: 'string!', requirements: strings, families: strings }],
  plugins: [{ use: 'string!', schema: 'json' }], scopes: strings,
  policy: { '*': 'policy' }, remove: { dimensions: strings, vocabularies: strings, aspects: strings, families: strings, sources: strings, channels: strings, attributes: strings, scopes: strings, plugins: strings },
}
function validateModel(value: unknown, model: Model, path: string): void {
  if (typeof model === 'string') {
    const kind = model.replace('!', '')
    const valid = kind === 'json' || (kind === 'object' ? object(value) : kind === 'policy' ? value === false || typeof value === 'string' || typeof value === 'number' : typeof value === kind)
    if (!valid || (model.endsWith('!') && (typeof value !== 'string' || !value.trim()))) throw new Error(`${path} has an invalid ${kind} value.`)
  } else if (Array.isArray(model)) {
    if (!Array.isArray(value)) throw new Error(`${path} must be an array.`)
    value.forEach((entry, index) => validateModel(entry, model[0], `${path}[${index}]`))
  } else {
    if (!object(value)) throw new Error(`${path} must be an object.`)
    for (const [key, spec] of Object.entries(model)) if (typeof spec === 'string' && spec.endsWith('!') && value[key] === undefined) throw new Error(`${path}.${key} is required.`)
    for (const [key, entry] of Object.entries(value)) {
      const spec = model[key] ?? model['*']
      if (!spec) throw new Error(`${path}.${key} is not an editor field.`)
      validateModel(entry, spec, `${path}.${key}`)
    }
  }
}
export function parseDeclaration(text: string): Declaration {
  const value: unknown = JSON.parse(text)
  validateModel(value, editorModel, 'Declaration')
  const draft = value as Declaration
  for (const dimension of draft.dimensions ?? []) dimension.members ??= []
  return draft
}

export function parseRecord(text: string): Record<string, unknown> {
  const value: unknown = JSON.parse(text)
  if (!object(value)) throw new Error('Enter a JSON object.')
  return value
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}


export const CODE = /^[a-z][a-z0-9_]*$/
export function keyFromName(name: string): string {
  return name.trim().normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
}

export function setList<K extends string>(target: { [P in K]?: string[] }, key: K, list: string[]) {
  if (list.length) target[key] = list
  else delete target[key]
}

export function moveField(attributes: AttributeDecl[], from: number, to: number) {
  if (to < 0 || to >= attributes.length || from === to) return
  const [field] = attributes.splice(from, 1)
  attributes.splice(to, 0, field)
}
