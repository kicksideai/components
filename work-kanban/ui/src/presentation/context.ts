// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { BoardSchema } from '../work/types'
import type { Json, SavedView } from './query'

export interface FieldDescriptor {
  code: string
  title?: string
  type: string
  form: string
  index: string
  cardinality: string
  access?: { read?: unknown[] }
  options?: { id: string, label?: string }[]
}
export interface StatusDescriptor {
  id: string
  name: string
  category?: string
  require?: string[]
}
interface ItemType {
  id: string
  title: string
  process: string
}

function rows<T>(source: unknown): T[] {
  return Array.isArray(source) ? source : []
}

function admittedTypes(saved?: SavedView) {
  const clauses = saved?.view.where && 'and' in saved.view.where ? saved.view.where.and : [saved?.view.where]
  const type = clauses.find(clause => clause && 'field' in clause && clause.field === 'type')
  if (type && 'value' in type) {
    if (type.op === 'in' && Array.isArray(type.value)) return new Set(type.value)
    if (type.op === 'eq') return new Set([type.value])
  }
}

export function presentationContext(schema: BoardSchema, saved?: SavedView) {
  const admitted = admittedTypes(saved)
  const itemTypes = rows<ItemType>(schema.compiled.item_types)
    .filter(type => admitted ? admitted.has(type.id) : !['sprint', 'milestone'].includes(type.id))
  const processes = new Set(itemTypes.map(type => type.process))
  const definitions = rows<{ id: string, states: StatusDescriptor[] }>(schema.compiled.processes)
  const used = new Set<string>()
  const statuses = definitions
    .filter(process => processes.has(process.id))
    .flatMap(process => process.states)
    .filter(state => !used.has(state.id) && !!used.add(state.id))
  const fields = rows<FieldDescriptor>(schema.compiled.fields)
  const priority = fields.find(field => field.code === 'priority')
  return {
    itemTypes, statuses, fields, definitions,
    typeLabels: Object.fromEntries(itemTypes.map(type => [type.id, type.title])),
    statusLabels: Object.fromEntries(statuses.map(state => [state.id, state.name || state.id])),
    priorityLabels: Object.fromEntries((priority?.options ?? []).map(option => [option.id, option.label ?? option.id])),
  }
}
export type PresentationContext = ReturnType<typeof presentationContext>

export function indexedField(field: FieldDescriptor) {
  return ['key', 'number'].includes(field.index) && field.access?.read === undefined
}

export function statusSeverity(status: StatusDescriptor | undefined) {
  if (status?.id === 'blocked') return 'danger'
  if (status?.category === 'completed' || status?.category === 'done' || status?.id === 'done') return 'success'
  if (status?.category === 'started') return 'info'
  return 'secondary'
}

export function principalRef(value: Json | undefined): { kind: 'user' | 'group', id: string } | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return
  const { kind, id } = value
  if ((kind === 'user' || kind === 'group') && typeof id === 'string') return { kind, id }
}
