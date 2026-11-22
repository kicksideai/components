// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'

import { ApiError, request } from '../../../../admin-http'

export { ApiError } from '../../../../admin-http'

export interface PluginConfigRefusal { plugin: string; field: string; message: string }
export interface AdminError { message: string; code?: string; pluginConfig?: PluginConfigRefusal }
export const SCHEMA_CONFLICT = 'schema_generation_conflict'
const errorMessages: Readonly<Record<string, string>> = {
  [SCHEMA_CONFLICT]: 'This catalog’s settings changed while you were editing.',
  catalog_access_denied: 'You don’t have access to this catalog.',
  plugin_cleanup_unavailable: 'Restore the plugin package before removing it. The catalog needs the package to clean up the plugin’s data.',
}

export function presentError(error: unknown, fallback: string): AdminError {
  const details = error instanceof ApiError ? error.details : undefined
  const detail = details?.code
  const code = typeof detail === 'string' && detail ? detail : undefined
  const message = error instanceof Error && error.message ? error.message : fallback
  if (code === 'plugin_config_invalid' && typeof details?.plugin === 'string' && typeof details.field === 'string') {
    return { message, code, pluginConfig: { plugin: details.plugin, field: details.field, message } }
  }
  return { message: code && Object.prototype.hasOwnProperty.call(errorMessages, code) ? errorMessages[code] : message, code }
}

export function get<T>(path: string, what: string, params?: Record<string, string>): Promise<T> {
  return request<T>(() => api.get(path, { params }), what)
}

export function post<T>(path: string, body: unknown, what: string): Promise<T> {
  return request<T>(() => api.post(path, body), what)
}
