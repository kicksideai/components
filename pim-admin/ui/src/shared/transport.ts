// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'

export class ApiError extends Error {
  readonly kind?: string
  readonly details?: Record<string, unknown>
  readonly retryable?: boolean
  readonly status?: number
  constructor(body: { error?: string; message?: string; kind?: string; details?: Record<string, unknown>; retryable?: boolean }, what: string, status?: number) {
    super(body.message ?? body.error ?? `${what} failed`)
    this.name = 'ApiError'
    this.kind = body.kind
    this.details = body.details
    this.retryable = body.retryable
    this.status = status
  }
}
export interface AdminError { message: string; code?: string }
export const SCHEMA_CONFLICT = 'schema_generation_conflict'
const errorMessages: Readonly<Record<string, string>> = {
  [SCHEMA_CONFLICT]: 'This catalog’s settings changed while you were editing.',
  catalog_access_denied: 'You don’t have access to this catalog.',
}

export function presentError(error: unknown, fallback: string): AdminError {
  const detail = error instanceof ApiError ? error.details?.code : undefined
  const code = typeof detail === 'string' && detail ? detail : undefined
  const message = error instanceof Error && error.message ? error.message : fallback
  return { message: code && Object.prototype.hasOwnProperty.call(errorMessages, code) ? errorMessages[code] : message, code }
}

export function unwrap<T>(data: unknown, what: string): T {
  const body = data as { success?: boolean; error?: string; data?: T }
  if (body && typeof body === 'object' && body.success === false) throw new ApiError(body, what)
  if (body && typeof body === 'object' && body.data !== undefined) return body.data
  return data as T
}
export function failure(e: unknown, what: string): Error {
  if (e instanceof ApiError) return e
  const response = (e as { response?: { status?: number; data?: ConstructorParameters<typeof ApiError>[0] } })?.response
  if (response?.data) return new ApiError(response.data, what, response.status)
  return e instanceof Error ? e : new ApiError({ kind: 'Unavailable' }, what)
}
export async function get<T>(path: string, what: string, params?: Record<string, string>): Promise<T> {
  try { return unwrap<T>((await api.get(path, { params })).data, what) } catch (e) { throw failure(e, what) }
}
export async function post<T>(path: string, body: unknown, what: string): Promise<T> {
  try { return unwrap<T>((await api.post(path, body)).data, what) } catch (e) { throw failure(e, what) }
}
