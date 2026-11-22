// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'

import { ApiError, request } from '../../../admin-http'

export { ApiError, failure } from '../../../admin-http'

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
export function get<T>(path: string, what: string, params?: Record<string, string>): Promise<T> {
  return request<T>(() => api.get(path, { params }), what)
}

export function post<T>(path: string, body: unknown, what: string): Promise<T> {
  return request<T>(() => api.post(path, body), what)
}
