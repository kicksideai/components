// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { BoardAccess, Holder, Declaration, Field, Schema } from '../../types'
import { effectiveMigration } from './process'
import { ApiError, formatApiError } from '../../transport'
export interface SchemaChange { code: string; class: string; what: string; detail?: string; to?: string; count?: number }
export interface SchemaPlan { generation: number; class: string; changes: SchemaChange[]; refused: SchemaChange[]; migration?: string }
export type PluginConfigs = Record<string, Record<string, unknown>>
export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
export function canAdmin(access: BoardAccess | undefined): boolean { return access?.admin === true }
export function move<T>(list: T[], index: number, delta: number) {
  const target = index + delta
  if (index < 0 || index >= list.length || target < 0 || target >= list.length) return
  const [value] = list.splice(index, 1)
  list.splice(target, 0, value)
}
export function renameField(draft: Declaration, field: Field, code: string) {
  const before = field.code
  if (before === code) return
  if (draft.fields?.some(candidate => candidate.expression)) throw new Error('Clear formula expressions before renaming a field, then restore them with the new code.')
  field.code = code
  const renamed = (value: string) => value === before ? code : value
  for (const type of draft.item_types ?? []) {
    type.fields = type.fields.map(renamed)
    if (type.inherit) type.inherit = type.inherit.map(renamed)
  }
  const holders = (values: Holder[] | undefined) => {
    for (const value of values ?? []) if ('field' in value && value.field === before) value.field = code
  }
  const reference = (value: unknown) => { if (value && typeof value === 'object' && !Array.isArray(value) && 'field' in value && typeof value.field === 'string') value.field = renamed(value.field) }
  const predicate = (value: unknown): void => {
    if (!value || typeof value !== 'object') return
    if (Array.isArray(value)) { value.forEach(predicate); return }
    reference(value)
    for (const [key, child] of Object.entries(value)) if (!['value', 'values', 'ctx'].includes(key)) predicate(child)
  }
  for (const declared of draft.fields ?? []) {
    if (declared.field) declared.field = renamed(declared.field)
    predicate(declared.where)
    holders(declared.access?.read); holders(declared.access?.write)
  }
  if (draft.visibility) {
    draft.visibility.field = renamed(draft.visibility.field)
    for (const level of draft.visibility.levels) holders(level.holders)
  }
  for (const process of draft.processes ?? []) {
    for (const state of process.states) {
      reference(state.awaiting); reference(state.release_when?.approvals?.from); predicate(state.release_when?.when)
      if (state.require) state.require = state.require.map(renamed)
      for (const timer of state.timers ?? []) {
        if (timer.at_field) timer.at_field = renamed(timer.at_field)
        if (timer.by) timer.by = renamed(timer.by)
      }
    }
    for (const transition of process.transitions ?? []) {
      predicate(transition.when)
      if (transition.require) transition.require = transition.require.map(renamed)
      for (const effect of transition.set ?? []) {
        effect.field = renamed(effect.field)
        if (effect.copy) effect.copy = renamed(effect.copy)
      }
    }
  }
}
export function requestDeclaration(draft: Declaration, original: Declaration): Declaration {
  const out = clone(draft)
  for (const field of out.fields ?? []) {
    if (field.type?.includes(':')) delete field.form
  }
  const removed = { ...out.remove }
  if (original.visibility && !out.visibility) removed.visibility = true
  else delete removed.visibility
  for (const kind of ['fields', 'item_types', 'processes', 'relation_types'] as const) {
    const missing = (original[kind] ?? []).filter(entry => {
      if (kind === 'fields') {
        const field = entry as Field
        return !out.fields?.some(f => field.id !== undefined ? f.id === field.id : f.code === field.code)
      }
      return !(out[kind] ?? []).some(candidate => 'id' in candidate && candidate.id === ('id' in entry ? entry.id : undefined))
    }).map(entry => 'code' in entry ? entry.code : entry.id as string)
    if (missing.length) removed[kind] = [...new Set([...(removed[kind] ?? []), ...missing])]
    else delete removed[kind]
  }
  if (Object.keys(removed).length) out.remove = removed
  else delete out.remove
  return out
}
export function reviewSnapshot(declaration: Declaration, generation: number, configs: PluginConfigs) {
  const serialized = JSON.stringify({ declaration, configs })
  return { declaration: clone(declaration), expected_generation: generation, plugin_configs: clone(configs),
    matches: (current: Declaration, currentGeneration: number, currentConfigs: PluginConfigs) => generation === currentGeneration && serialized === JSON.stringify({ declaration: current, configs: currentConfigs }) }
}
export function normalizeSchema(view: Schema): Schema {
  const out = clone(view)
  const order = [...new Set(out.declaration.item_types?.flatMap(type => type.fields) ?? [])]
  const rank = (code: string) => { const index = order.indexOf(code); return index < 0 ? order.length : index }
  out.declaration.fields?.sort((a, b) => rank(a.code) - rank(b.code))
  for (const field of out.declaration.fields ?? []) {
    const compiled = out.compiled.fields?.find(f => f.code === field.code)
    field.id ??= compiled?.id
    field.form ??= compiled?.form
  }
  for (const process of out.declaration.processes ?? []) process.migration ??= out.compiled.processes?.find(compiled => compiled.id === process.id)?.migration ?? effectiveMigration(process)
  return out
}

export function processMigration(plan: SchemaPlan, declaration: Declaration): string[] {
  return (declaration.processes ?? []).filter(process => effectiveMigration(process) !== 'pin' && plan.changes.some(change => change.code === 'process ' + process.id && change.class !== 'cosmetic' && change.class !== 'refused')).map(process => process.id)
}

export type RemovalKind = 'fields' | 'item_types' | 'processes' | 'relation_types'
export type RemovalGuard = (kind: RemovalKind, id: string) => Promise<string | undefined>
export function removalReason(plan: SchemaPlan, kind: RemovalKind, id: string): string | undefined {
  const codes = [id, `item_type ${id}`, `relation ${id}`, `process ${id}`]
  const blocked = plan.refused.filter(change => codes.includes(change.code))
  if (kind === 'fields') blocked.push(...plan.changes.filter(change => change.code === id && change.what === 'removed' && change.class === 'semantic'))
  return blocked.length ? blocked.map(changeReason).join(' ') : undefined
}
export function removeEntry(draft: Declaration, kind: RemovalKind, id: string) {
  if (kind === 'fields') {
    draft.fields = draft.fields?.filter(field => field.code !== id)
    for (const type of draft.item_types ?? []) {
      type.fields = type.fields.filter(code => code !== id)
      type.inherit = type.inherit?.filter(code => code !== id)
    }
  } else if (kind === 'item_types') draft.item_types = draft.item_types?.filter(type => type.id !== id)
  else if (kind === 'processes') draft.processes = draft.processes?.filter(process => process.id !== id)
  else draft.relation_types = draft.relation_types?.filter(relation => relation.id !== id)
}
export function changeReason(change: SchemaChange): string {
  if (change.what === 'invalid') return change.detail || 'The definition is invalid.'
  const reason = change.what === 'removed' ? 'Items still hold values in this field.'
    : change.code.startsWith('item_type ') && change.what === 'remove' ? 'Items still use this item type.'
    : change.code.startsWith('relation ') && change.what === 'remove' ? 'Links still use this relation type.'
    : change.what === 'options.remove' ? 'Items still hold values in this option field.'
    : change.what === 'state.remove' ? 'Items still occupy this state. Map them to a surviving state.'
    : change.what === 'process' ? 'An existing item type cannot change process.'
    : ['type', 'form', 'cardinality'].includes(change.what) || change.what.startsWith('config.') ? 'This change alters the representation of stored values. Add a new field and migrate values first.'
    : change.what === 'state.kind' ? 'An existing state cannot change kind. Create a new state and map existing items to it.'
    : change.what === 'shape' && change.code.startsWith('relation ') ? 'Existing links prevent a cardinality or symmetry change.'
    : 'Stored data or a schema dependency prevents this change.'
  return [reason, change.detail, change.count ? `${change.count} items` : ''].filter(Boolean).join(' ')
}
export function validationIssues(error: unknown, declaration: Declaration): SchemaChange[] {
  if (!(error instanceof ApiError)) return []
  const details = error.details ?? {}
  let code = typeof details.field === 'string' ? details.field : ''
  if (!code) {
    const process = declaration.processes?.find(p => p.id === details.process || p.states.some(s => s.id === details.state) || error.message.includes(`process ${p.id}`))
    if (process) code = `process ${process.id}`
    else if (typeof details.item_type === 'string') code = `item_type ${details.item_type}`
  }
  return code ? [{ code, class: 'refused', what: 'invalid', detail: formatApiError(error, 'The definition is invalid.') }] : []
}
export const classDescription: Record<string, string> = {
  unchanged: 'Nothing changes.', cosmetic: 'Presentation or policy changes. Stored item values keep their meaning.',
  additive: 'New definitions become available to items.', semantic: 'The board updates its indexes or process generations after apply.',
  refused: 'Resolve the refused changes before applying this draft.', initial: 'The first schema defines the board.',
}
