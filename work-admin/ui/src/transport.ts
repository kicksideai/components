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
const operatorMessages: Readonly<Record<string, string>> = {
  key_prefix_taken: 'That item key prefix is already in use. Choose another prefix.',
  plugin_config_invalid: 'The plugin rejected this configuration. Check its settings and try again.',
  generation_changed: 'The board settings changed. Review your changes again before applying them.',
  no_parked_migration: 'There is no paused migration to resume.',
}

export function formatApiError(error: unknown, fallback: string): string {
  const code = error instanceof ApiError ? error.details?.code : undefined
  const message = error instanceof Error ? error.message || fallback : fallback
  if (typeof code !== 'string' || !code.trim()) return message
  const operatorMessage = Object.hasOwn(operatorMessages, code) ? operatorMessages[code] : message
  return `${operatorMessage}\nError code: ${code}`
}
export function unwrap<T>(data: unknown, what: string): T {
  const body = data as { success?: boolean; error?: string; data?: T }
  if (body && typeof body === 'object' && body.success === false) throw new ApiError(body, what)
  if (body && typeof body === 'object' && body.success === true && body.data !== undefined) return body.data
  throw new ApiError({ kind: 'INTERNAL', message: `${what}: invalid response envelope`, details: { code: 'response_envelope_invalid' } }, what)
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
