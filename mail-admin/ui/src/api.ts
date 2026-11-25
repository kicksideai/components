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
    () => api.post(`${BASE}/library/preview`, { message: reviewMessage(key), ...draft }),
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

type LibraryReceipt = { seq: number; committed: true; projected: boolean }

async function projectedResource(key: ResourceKey, result: Resource | LibraryReceipt): Promise<Resource> {
  if ('kind' in result) return result
  for (let attempt = 0; attempt < 20; attempt++) {
    if (attempt > 0) await new Promise(resolve => setTimeout(resolve, 250))
    try {
      const item = await library.get(key)
      if ((item.seq ?? 0) >= result.seq) return item
    } catch (err) {
      if (!(err instanceof ApiError) || err.kind !== 'NOT_FOUND') throw err
    }
  }
  throw new ApiError({ message: 'Changes were saved. Reload the resource to see the new revision.' }, 'Mail library')
}

async function createResource(body: ResourceContent | CopyRequest, note?: string): Promise<Resource> {
  const proposed = { ...body, note: note ?? ('note' in body ? body.note : undefined) }
  const preview_id = await review(body, { create: proposed })
  const command_id = crypto.randomUUID()
  const result = await request<Resource | LibraryReceipt>(
    () => api.post(`${BASE}/library`, { ...proposed, preview_id, command_id }), 'Create resource')
  return projectedResource(body, result)
}

function libraryPage(filter: LibraryFilter = {}) {
  return request<LibraryPage>(
    () => api.get(`${BASE}/library`, { params: params({ limit: 100, ...filter }) }), 'Mail library')
}

async function allPages<T>(load: (cursor?: string) => Promise<Items<T> & { next_cursor?: string }>): Promise<T[]> {
  const items: T[] = []
  let cursor: string | undefined
  do {
    const page = await load(cursor)
    items.push(...page.items)
    cursor = page.next_cursor
  } while (cursor)
  return items
}

export const library = {
  page: libraryPage,
  assets: (q?: string) => allPages(cursor => libraryPage({ kind: 'asset', q, cursor })),
  get: (key: ResourceKey) => request<Resource>(() => api.get(resourcePath(key)), 'Mail resource'),
  history: (key: ResourceKey) => allPages(cursor =>
    request<Items<Revision> & { next_cursor?: string }>(
      () => api.get(`${resourcePath(key)}/history`, { params: params({ cursor }) }), 'Resource history')),
  copy: (body: CopyRequest) => createResource(body),
  create: (content: ResourceContent, note?: string) => createResource(editable(content), note),
  async update(content: ResourceContent, expected: number, note?: string) {
    const proposed = { ...editable(content), expected_revision: expected, note }
    const preview_id = await review(content, { resources: [proposed] })
    const command_id = crypto.randomUUID()
    const result = await request<Resource | LibraryReceipt>(
      () => api.put(resourcePath(content), { ...proposed, preview_id, command_id }), 'Save resource')
    return projectedResource(content, result)
  },
  async reset(key: ResourceKey, expected: number) {
    const body = { expected_revision: expected }
    const preview_id = key.kind === 'asset' ? undefined : await review(key, { reset: { ...key, ...body } })
    const command_id = key.kind === 'asset' ? undefined : crypto.randomUUID()
    const result = await request<Resource | LibraryReceipt>(
      () => api.post(`${resourcePath(key)}/reset`, { ...body, preview_id, command_id }), 'Reset resource')
    return projectedResource(key, result)
  },
  async restore(key: ResourceKey, revision: number, expected: number, note?: string) {
    const body = { revision, expected_revision: expected, note }
    const preview_id = key.kind === 'asset' ? undefined : await review(key, { restore: { ...key, ...body } })
    const command_id = key.kind === 'asset' ? undefined : crypto.randomUUID()
    const result = await request<Resource | LibraryReceipt>(
      () => api.post(`${resourcePath(key)}/restore`, { ...body, preview_id, command_id }), 'Restore revision')
    return projectedResource(key, result)
  },
  remove: (key: ResourceKey, expected: number) => {
    const command_id = key.kind === 'asset' ? undefined : crypto.randomUUID()
    return request<boolean>(
      () => api.delete(resourcePath(key), { data: { expected_revision: expected, command_id } }), 'Delete resource')
  },
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
