// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
type ErrorBody = {
  error?: string
  message?: string
  kind?: string
  details?: Record<string, unknown>
  retryable?: boolean
}

export type AdminFailure = { success: false } & ErrorBody
export type AdminEnvelope<T> = { success: true; data: T } | AdminFailure

export class ApiError extends Error {
  readonly kind?: string
  readonly details?: Record<string, unknown>
  readonly retryable?: boolean
  readonly status?: number

  constructor(body: ErrorBody, what: string, status?: number) {
    super(body.message ?? body.error ?? `${what} failed`)
    this.name = 'ApiError'
    this.kind = body.kind
    this.details = body.details
    this.retryable = body.retryable
    this.status = status
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function responseError(value: unknown, what: string, status?: number): ApiError {
  const body = isRecord(value) ? value : {}
  return new ApiError({
    message: typeof body.message === 'string' ? body.message : undefined,
    error: typeof body.error === 'string' ? body.error : undefined,
    kind: typeof body.kind === 'string' ? body.kind : undefined,
    details: isRecord(body.details) ? body.details : undefined,
    retryable: typeof body.retryable === 'boolean' ? body.retryable : undefined,
  }, what, status)
}

export function failure(error: unknown, what: string): Error {
  if (error instanceof ApiError) return error
  if (isRecord(error) && isRecord(error.response) && isRecord(error.response.data)) {
    const { data, status } = error.response
    return responseError(data, what, typeof status === 'number' ? status : undefined)
  }
  return error instanceof Error ? error : new ApiError({ kind: 'UNAVAILABLE' }, what)
}

export async function request<T>(send: () => Promise<{ data: AdminEnvelope<T> | undefined }>, what: string): Promise<T> {
  let body: AdminEnvelope<T> | undefined
  try {
    body = (await send()).data
  } catch (error) {
    throw failure(error, what)
  }
  if (body?.success === true && body.data !== undefined) return body.data
  if (body?.success === false) throw responseError(body, what)
  throw new ApiError({ kind: 'INTERNAL', message: `${what}: invalid response envelope`, details: { code: 'response_envelope_invalid' } }, what)
}
