// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { WatchSource } from 'vue'
import { principalLabel, usePrincipalNames, type Principal } from './principals'
import type { Field, Item, Schema } from './types'
import { opaque } from './values'
export function humanize(code: string): string { if (opaque(code)) return 'Untitled'; const s = code.replace(/[_-]+/g, ' '); return s.charAt(0).toUpperCase() + s.slice(1) }
export function fieldTitle(field: Pick<Field, 'code' | 'title'>): string { return field.title?.trim() || humanize(field.code) }
export function display(value: unknown, field?: Field, label = principalLabel): string {
  if (value == null) return '—'
  if (field?.type === 'principal') return label(value)
  if (Array.isArray(value)) return value.map(v => display(v, field, label)).join(', ')
  if ((field?.type === 'option') && typeof value === 'string') return field.options?.find(o => o.id === value)?.label || humanize(value)
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'object') {
    if ((field?.form === 'ref' || field?.type === 'item') && 'unavailable' in value) return 'Unavailable'
    if (field?.form === 'dec' && 'm' in value && 'e' in value && typeof value.m === 'number' && typeof value.e === 'number') return (value.m * 10 ** value.e).toFixed(Math.max(0, -value.e))
    if (field?.form === 'ref' && 'ref' in value && Array.isArray(value.ref)) return 'Linked item'
    if (field?.form === 'ref' && 'id' in value && typeof value.id === 'string') return 'Linked item'
    if (field?.type === 'item' && 'item' in value && typeof value.item === 'string') return 'Linked item'
    return JSON.stringify(value)
  }
  return String(value)
}
export function readonly(field: Field): boolean { return ['formula', 'rollup', 'counter', 'rank'].includes(field.type ?? '') }
export function fieldsFor(schema: Schema, type: string): Field[] {
  const carried = schema.compiled.item_types?.find(t => t.id === type)?.fields ?? []
  return carried.flatMap(code => { const f = schema.compiled.fields?.find(f => f.code === code); return f ? [f] : [] })
}
export function titleOf(item: Item): string { return typeof item.values.title === 'string' ? item.values.title : item.key }
export function stateLabel(item: Item, schema?: Schema): string { const label = (code: string) => schema?.compiled.processes?.flatMap(p => p.states).find(s => s.id === code)?.name || humanize(code); return typeof item.state === 'string' ? label(item.state) : Object.entries(item.state).map(([r, s]) => `${humanize(r)}: ${label(s)}`).join(' · ') }

export function useDisplay(boardId: () => string, source: WatchSource<Principal[]>) {
  const names = usePrincipalNames(boardId, source)
  return { display: (value: unknown, field?: Field) => display(value, field, names.label), principalLabel: names.label,
    rememberPrincipal: names.remember, nameError: names.error, nameLabels: names.labels }
}
