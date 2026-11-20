// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { post } from './transport'
import type { TypeOption } from '../types'

export function humanLabel(value: string | undefined, fallback: string): string {
  return !value || /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\b[\w.]+:[\w.-]+/i.test(value) ? fallback : value
}

export function fieldTypeTitle(type: TypeOption | undefined): string {
  return type ? humanLabel(type.title, 'Field type') : 'Unknown type'
}
export async function principalLabels(catalogId: string, ids: string[]): Promise<Record<string, string>> {
  const refs = [...new Set(ids)].map(id => ({ type: 'user', id }))
  if (!refs.length) return {}
  const body = await post<{ principals: { id: string; label: string }[] }>(`/api/v1/pim-admin/catalogs/${encodeURIComponent(catalogId)}/principal_labels`, { refs }, 'People')
  return Object.fromEntries((body.principals ?? []).map(person => [person.id, humanLabel(person.label, 'Person')]))
}
