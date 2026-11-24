// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'
import { ApiError, request } from '../../../admin-http'
import type {
  DeliveryStatus, Items, LogMessage, MessagePage, MessageStatus, Resource, ResourceKey, ResourceKind,
  ResourceState, Revision, SendReceipt,
} from './types'

export { ApiError }

const BASE = '/api/v1/mail'
const resourcePath = (key: ResourceKey) => `${BASE}/library/${key.kind}/${encodeURIComponent(key.name)}`

export interface LibraryFilter { kind?: ResourceKind; state?: ResourceState; q?: string }
export interface ActivityFilter { status?: MessageStatus; message?: string; since?: number; cursor?: string; limit?: number }
export interface CreateRequest { kind: ResourceKind; name: string; title: string; description: string; from: ResourceKey; note?: string }

function params(values: Record<string, string | number | undefined>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(values)) if (value !== undefined && value !== '') out[key] = String(value)
  return out
}

export const library = {
  list: (filter: LibraryFilter = {}) =>
    request<Items<Resource>>(() => api.get(`${BASE}/library`, { params: params({ ...filter }) }), 'Mail library').then(r => r.items),
  get: (key: ResourceKey) => request<Resource>(() => api.get(resourcePath(key)), 'Mail resource'),
  history: (key: ResourceKey) =>
    request<Items<Revision>>(() => api.get(`${resourcePath(key)}/history`), 'Resource history').then(r => r.items),
  create: (body: CreateRequest) => request<Resource>(() => api.post(`${BASE}/library`, body), 'Create resource'),
  reset: (key: ResourceKey, expected: number) =>
    request<Resource>(() => api.post(`${resourcePath(key)}/reset`, { expected_revision: expected }), 'Reset resource'),
  restore: (key: ResourceKey, revision: number, expected: number) =>
    request<Resource>(() => api.post(`${resourcePath(key)}/restore`, { revision, expected_revision: expected }), 'Restore revision'),
  remove: (key: ResourceKey, expected: number) =>
    request<boolean>(() => api.delete(resourcePath(key), { data: { expected_revision: expected } }), 'Delete resource'),
}

export const activity = {
  list: (filter: ActivityFilter) =>
    request<MessagePage>(() => api.get(`${BASE}/activity`, { params: params({ limit: 50, ...filter }) }), 'Mail activity'),
  get: (id: string) => request<LogMessage>(() => api.get(`${BASE}/activity/${encodeURIComponent(id)}`), 'Mail message'),
  resend: (id: string) => request<SendReceipt>(() => api.post(`${BASE}/activity/${encodeURIComponent(id)}/resend`, {}), 'Send again'),
}

export const delivery = {
  status: () => request<DeliveryStatus>(() => api.get(`${BASE}/delivery`), 'Delivery status'),
}

export function errorCode(error: unknown): string | undefined {
  if (!(error instanceof ApiError)) return undefined
  const code = error.details?.code
  return typeof code === 'string' ? code : undefined
}

export function isDenied(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 403 || error.kind === 'PERMISSION_DENIED')
}

export function isMissing(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 404 || error.kind === 'NOT_FOUND')
}
