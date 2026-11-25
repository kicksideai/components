// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'
import { ApiError, request } from '../../../admin-http'
import type {
  Capabilities, DeliveryStatus, DraftRender, Items, LibraryPage, LibraryRow, LogMessage, MessagePage, MessageStatus,
  Resource, ResourceContent, ResourceKey, ResourceKind, ResourceState, Revision, SendReceipt,
} from './types'

export { ApiError }

const BASE = '/api/v1/mail'
const resourcePath = (key: ResourceKey) => `${BASE}/library/${key.kind}/${encodeURIComponent(key.name)}`

export interface LibraryFilter { kind?: ResourceKind; state?: ResourceState; q?: string; cursor?: string; limit?: number }
export interface ActivityFilter { status?: MessageStatus; message?: string; since?: number; q?: string; cursor?: string; limit?: number }
export interface CopyRequest { kind: ResourceKind; name: string; title: string; description: string; from: ResourceKey; note?: string }
export interface AssetRequest { name: string; upload_id: string; title?: string; description?: string; width?: number; height?: number; note?: string }

function params(values: Record<string, string | number | undefined>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(values)) if (value !== undefined && value !== '') out[key] = String(value)
  return out
}

// The editable fields a save or preview sends; server-owned fields stay out.
export function editable(content: ResourceContent): ResourceContent {
  const { kind, name, title, description, html, text, base, subject, schema, samples } = content
  return kind === 'message'
    ? { kind, name, title, description, html, text, base, subject, schema, samples }
    : { kind, name, title, description, html, text, schema, samples }
}

type ReviewedDraft = DraftRender & {
  preview_id?: string
  errors?: (Record<string, unknown> & { message: string })[]
  dependent_messages?: string[]
}

const reviewMessage = (key: ResourceKey) => key.kind === 'message' ? key.name : 'notice'

async function review(key: ResourceKey, draft: Record<string, unknown>): Promise<string> {
  const result = await request<ReviewedDraft>(
    () => api.post(`${BASE}/library/preview`, { message: reviewMessage(key), ...draft }, { params: { review: 'true' } }),
    'Review changes',
  )
  const issue = result.errors?.[0]
  if (issue) {
    throw new ApiError({ kind: 'INVALID', message: issue.message, details: {
      ...issue, errors: result.errors, dependent_messages: result.dependent_messages,
    } }, 'Review changes')
  }
  if (!result.preview_id) throw new ApiError({ message: 'Mail did not return a preview ID.' }, 'Review changes')
  return result.preview_id
}

async function createResource(body: ResourceContent | CopyRequest, note?: string): Promise<Resource> {
  const proposed = { ...body, note: note ?? ('note' in body ? body.note : undefined) }
  const preview_id = await review(body, { create: proposed })
  return request<Resource>(() => api.post(`${BASE}/library`, { ...proposed, preview_id }), 'Create resource')
}

export const library = {
  page: (filter: LibraryFilter = {}) =>
    request<LibraryPage>(() => api.get(`${BASE}/library`, { params: params({ view: 'summary', limit: 100, ...filter }) }), 'Mail library'),
  // Images carry no template source, so their full rows are small enough to list whole.
  assets: (q?: string) =>
    request<Items<Resource>>(() => api.get(`${BASE}/library`, { params: params({ kind: 'asset', q }) }), 'Assets').then(r => r.items),
  get: (key: ResourceKey) => request<Resource>(() => api.get(resourcePath(key)), 'Mail resource'),
  history: (key: ResourceKey) =>
    request<Items<Revision>>(() => api.get(`${resourcePath(key)}/history`), 'Resource history').then(r => r.items),
  copy: (body: CopyRequest) => createResource(body),
  create: (content: ResourceContent, note?: string) => createResource(editable(content), note),
  async update(content: ResourceContent, expected: number, note?: string) {
    const proposed = { ...editable(content), expected_revision: expected, note }
    const preview_id = await review(content, { resources: [proposed] })
    return request<Resource>(() => api.put(resourcePath(content), { ...proposed, preview_id }), 'Save resource')
  },
  async reset(key: ResourceKey, expected: number) {
    const body = { expected_revision: expected }
    const preview_id = key.kind === 'asset' ? undefined : await review(key, { reset: { ...key, ...body } })
    return request<Resource>(() => api.post(`${resourcePath(key)}/reset`, { ...body, preview_id }), 'Reset resource')
  },
  async restore(key: ResourceKey, revision: number, expected: number, note?: string) {
    const body = { revision, expected_revision: expected, note }
    const preview_id = key.kind === 'asset' ? undefined : await review(key, { restore: { ...key, ...body } })
    return request<Resource>(() => api.post(`${resourcePath(key)}/restore`, { ...body, preview_id }), 'Restore revision')
  },
  remove: (key: ResourceKey, expected: number) =>
    request<boolean>(() => api.delete(resourcePath(key), { data: { expected_revision: expected } }), 'Delete resource'),
  preview: (message: string, resources: ResourceContent[]) =>
    request<DraftRender>(() => api.post(`${BASE}/library/preview`, resources.length ? { message, resources: resources.map(editable) } : { message }), 'Preview'),
  sendTest: (message: string) => request<SendReceipt>(() => api.post(`${BASE}/library/send-test`, { message }), 'Send test'),
  addAsset: (body: AssetRequest) => request<Resource>(() => api.post(`${BASE}/library`, { kind: 'asset', ...body }), 'Add image'),
  replaceAsset: (body: AssetRequest, expected: number) =>
    request<Resource>(() => api.put(`${BASE}/library/asset/${encodeURIComponent(body.name)}`, { ...body, expected_revision: expected }), 'Replace image'),
}

export interface UploadState { component_id: string; status: string; error?: string }

export const uploads = {
  // The platform upload flow: the file becomes the caller's upload, which Mail adopts as an asset once the platform
  // reports it completed.
  async add(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    form.append('metadata', JSON.stringify({ filename: file.name }))
    return request<{ uuid: string }>(async () => {
      const response = await api.post('/api/v1/uploads', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      const body = response.data as { success?: boolean; uuid?: string; error?: string }
      return { data: body?.success && body.uuid ? { success: true as const, data: { uuid: body.uuid } } : { success: false as const, error: body?.error } }
    }, 'Upload').then(result => result.uuid)
  },
  // The upload's processing status and the component whose public meta changes at each upload milestone.
  async state(id: string): Promise<UploadState> {
    return request<UploadState>(async () => {
      const response = await api.get(`/api/v1/uploads/${encodeURIComponent(id)}`)
      const body = response.data as { success?: boolean; component_id?: string; upload?: { status?: string; error?: string }; error?: string }
      return body?.success && body.upload && body.component_id
        ? { data: { success: true as const, data: { component_id: body.component_id, status: String(body.upload.status ?? ''), error: body.upload.error } } }
        : { data: { success: false as const, error: body?.error } }
    }, 'Upload')
  },
}

export const access = {
  capabilities: () => request<Capabilities>(() => api.get(`${BASE}/capabilities`), 'Mail access'),
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
