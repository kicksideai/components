// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { AttributeView, SchemaView } from '../types'
export const attribute: AttributeView = { id: 1, type: 'kickside.pim.types:text', form: 'text', scope: [], cardinality: 'one', index: 'none', index_contexts: [], unique: false, config: {}, width: 'full' }
export function createSchema(): SchemaView { return { access: { read: true, write: true, admin: true }, schema_generation: 1, declaration: { aspects: [{ namespace: 'core', attributes: [{ code: 'name', type: attribute.type }] }], scopes: [] }, attributes: { 'core.name': { ...attribute } }, families: { generic: { code: 'generic', owner: { 'core.name': 0 }, levels: [], item_level: 0, requirements: [] } }, channels: {}, dimensions: [], vocabularies: {}, sources: {}, plugins: [], as_of: 0, generation: 1, rebuilding: false } }
export const schema = createSchema()
export function deferred<T>() { let resolve!: (value: T) => void; let reject!: (error: Error) => void; const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no }); return { promise, resolve, reject } }

export function definitionFixtures() {
  const names = ['a', 'a_much_longer_definition_title', 'third', 'fourth']
  return {
    draft: {
      aspects: [{ namespace: 'core', attributes: names.map(code => ({ code, type: 'text' })) }],
      dimensions: names.map(name => ({ name, members: ['en'] })),
      families: names.map(code => ({ code, aspects: ['core'] })),
      vocabularies: names.map(code => ({ code })),
      channels: names.map(id => ({ id })), sources: names.map(id => ({ id })),
    },
    options: {
      types: [{ id: 'text', title: 'Text', form: 'text', indexes: ['none'] }], link_kinds: [],
      plugins: names.map(id => ({ ...pluginFixture(id), title: id })),
      scopes: names.map(id => ({ id, title: id, filters: {}, access: 'read' })),
    },
  }
}

export function pluginFixture(plugin: string) { return { plugin, installed: true, active: false, requires: [], tools: [], lifecycle: { state: 'ready' as const }, projections: {}, config_schema: {} } }
