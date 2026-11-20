// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { onUnmounted, ref, watch, type WatchSource } from 'vue'
import { formatApiError, post } from './transport'
import { opaque } from './values'
import type { QueryResult, Schema } from './types'
type Labels = Map<string, string>
const pending = new Map<string, Promise<Labels>>()
export interface Principal { kind: string; id: string }
export function principalLabel(value: unknown, labels: Labels = new Map()): string {
  if (Array.isArray(value)) return value.map(value => principalLabel(value, labels)).join(', ')
  if (typeof value === 'string') return labels.get('user:' + value) ?? (/^[^@\s]+@[^@\s]+$/.test(value) ? value : 'Unavailable person')
  if (!value || typeof value !== 'object') return value ? 'Unknown person' : '—'
  const row = value as Record<string, unknown>
  for (const key of ['display_name', 'displayName', 'name', 'label']) if (typeof row[key] === 'string' && row[key] && !opaque(row[key])) return row[key]
  return labels.get(`${row.kind ?? 'user'}:${row.id}`) ?? (typeof row.email === 'string' && row.email ? row.email : row.kind === 'group' ? 'Unavailable group' : typeof row.id === 'string' ? principalLabel(row.id, labels) : 'Unavailable person')
}

export function principalRefs(value: unknown): Principal[] {
  if (Array.isArray(value)) return value.flatMap(principalRefs)
  if (typeof value === 'string' && value) return [{ kind: 'user', id: value }]
  if (!value || typeof value !== 'object') return []
  const row = value as Record<string, unknown>
  return typeof row.id === 'string' && (row.kind === 'user' || row.kind === 'group') ? [{ kind: row.kind, id: row.id }] : []
}
export function resultPrincipals(result: QueryResult, schema: Schema): Principal[] {
  const fields = (schema.compiled.fields ?? []).filter(field => field.type === 'principal')
  return [...result.items, ...(result.groups?.flatMap(group => group.items) ?? [])]
    .flatMap(item => fields.flatMap(field => principalRefs(item.values[field.code])))
}
export async function resolveNames(boardId: string, principals: Principal[]): Promise<Labels> {
  const refs = [...new Map(principals.map(p => [`${p.kind}:${p.id}`, { type: p.kind, id: p.id }])).values()].sort((a, b) => `${a.type}:${a.id}`.localeCompare(`${b.type}:${b.id}`))
  const key = JSON.stringify([boardId, refs])
  const active = pending.get(key)
  if (active) return active
  const read = async () => {
    const labels: Labels = new Map()
    for (let index = 0; index < refs.length; index += 200) {
      const result = await post<{ principals: { type: string; id: string; label: string }[] }>(`/api/v1/work-admin/boards/${encodeURIComponent(boardId)}/principal_labels`, { refs: refs.slice(index, index + 200) }, 'Display names')
      for (const row of result.principals) if (row.label.trim() && !opaque(row.label) && row.label !== row.id) labels.set(`${row.type}:${row.id}`, row.label.trim())
    }
    return labels
  }
  const request = read()
  pending.set(key, request)
  try { return await request } finally { pending.delete(key) }
}
export function usePrincipalNames(boardId: () => string, source: WatchSource<Principal[]>) {
  const labels = ref<Labels>(new Map()), error = ref('')
  let generation = 0
  watch([boardId, source], async ([board, refs]) => {
    const current = ++generation
    labels.value = new Map(); error.value = ''
    if (!board || !refs.length) return
    try { const resolved = await resolveNames(board, refs); if (current === generation) labels.value = resolved }
    catch (e) { if (current === generation) error.value = formatApiError(e, 'Display names are unavailable.') }
  }, { immediate: true, deep: true })
  onUnmounted(() => { generation++; labels.value.clear() })
  return { labels, error, label: (value: unknown) => principalLabel(value, labels.value),
    remember: (principal: Principal, label: string) => { if (label.trim() && !opaque(label) && label !== principal.id) labels.value.set(`${principal.kind}:${principal.id}`, label.trim()) } }
}
