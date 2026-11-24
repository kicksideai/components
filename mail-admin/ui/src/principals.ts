// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'
import { shallowReactive } from 'vue'

interface ResolvedPrincipal { type: string; id: string; label?: string }

const labels = shallowReactive(new Map<string, string>())
const requested = new Set<string>()

// Authors and senders are user keys. The Users directory labels them for display.
export async function resolvePrincipals(ids: readonly (string | undefined)[]): Promise<void> {
  const pending = [...new Set(ids.filter((id): id is string => !!id && !requested.has(id)))]
  for (const id of pending) requested.add(id)
  for (let offset = 0; offset < pending.length; offset += 50) {
    const batch = pending.slice(offset, offset + 50)
    try {
      const { data } = await api.post('/api/v1/principals/resolve', { refs: batch.map(id => ({ type: 'user', id })) })
      const rows: ResolvedPrincipal[] = data?.success && Array.isArray(data.principals) ? data.principals : []
      for (const row of rows) if (batch.includes(row.id) && row.label && row.label !== row.id) labels.set(row.id, row.label)
    } catch {
      for (const id of batch) requested.delete(id)
    }
  }
}

export function principalLabel(id: string | undefined): string {
  if (!id) return ''
  return labels.get(id) ?? id
}

export function resetPrincipals(): void {
  labels.clear()
  requested.clear()
}
