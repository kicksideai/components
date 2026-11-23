// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'
import { shallowReactive, watch } from 'vue'
import type { FieldValue, Principal } from './types'

export function principal(value: FieldValue): Principal | undefined {
  if (value && typeof value === 'object' && 'kind' in value && 'id' in value) return value
}

function asDirectoryRef(value: FieldValue) {
  const ref = typeof value === 'string' ? { kind: 'user', id: value } : principal(value)
  if (ref?.id && (ref.kind === 'user' || ref.kind === 'group')) return { type: ref.kind, id: ref.id }
}

export function usePrincipalNames(getValues: () => FieldValue[]) {
  const labels = shallowReactive(new Map<string, string>())
  const key = (row: { type: string; id: string }) => row.type + ':' + row.id
  const pending = new Set<string>()
  watch(getValues, async values => {
    const refs = new Map<string, NonNullable<ReturnType<typeof asDirectoryRef>>>()
    for (const value of values.flatMap(value => Array.isArray(value) ? value : [value])) {
      const ref = asDirectoryRef(value)
      if (ref && !labels.has(key(ref)) && !pending.has(key(ref))) refs.set(key(ref), ref)
    }
    const ids = Array.from(refs.keys())
    for (const id of ids) pending.add(id)
    for (let offset = 0; offset < ids.length; offset += 50) {
      const batch = ids.slice(offset, offset + 50)
      try {
        const { data } = await api.post('/api/v1/principals/resolve', { refs: batch.map(id => refs.get(id)) })
        if (!data?.success || !Array.isArray(data.principals)) continue
        for (const row of data.principals as { type: string; id: string; label?: string }[]) {
          if (batch.includes(key(row)) && row.label && row.label !== row.id) labels.set(key(row), row.label)
        }
      } catch {
        // The Users directory can be unavailable independently of the Work issue.
      } finally {
        for (const id of batch) pending.delete(id)
      }
    }
  }, { immediate: true })
  return (value: FieldValue) => {
    const ref = asDirectoryRef(value)
    return ref ? labels.get(key(ref)) : undefined
  }
}
