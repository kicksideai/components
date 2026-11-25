// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'
import { ApiError, failure, request } from '../../../../admin-http'
import type { SendReceipt } from '../types'

export interface Setting {
  namespace: string
  key: string
  value?: unknown
  value_type: 'string' | 'int' | 'bool' | 'duration' | 'json' | 'secret'
  default?: unknown
  is_secret?: boolean
  has_value?: boolean
  title?: string | null
  description?: string | null
  order?: number | null
  editable?: boolean
  schema?: { enum?: unknown[]; pattern?: string; minimum?: number; maximum?: number } | null
}

export interface SettingWrite { namespace: string; key: string; value: unknown }
export interface SettingFailure { namespace: string; key: string; error: string }

// The Settings API answers without the admin envelope: `{ success, settings }` and `{ success, updated, errors }`.
export async function settings(namespace: string): Promise<Setting[]> {
  try {
    const { data } = await api.get('/api/v1/settings', { params: { namespace } })
    if (data?.success && Array.isArray(data.settings)) return (data.settings as Setting[]).filter(item => item.namespace === namespace)
    throw new ApiError({ error: data?.error, kind: 'INTERNAL' }, 'Settings')
  } catch (error) {
    throw failure(error, 'Settings')
  }
}

// The Settings API writes the values in order and stops at the first refusal, keeping the ones before it.
export async function save(values: SettingWrite[]): Promise<SettingFailure | undefined> {
  try {
    const { data } = await api.put('/api/v1/settings', { values })
    if (data?.success) return undefined
    throw new ApiError({ error: data?.error, kind: 'INVALID' }, 'Save settings')
  } catch (error) {
    const body = (error as { response?: { data?: Record<string, unknown> } })?.response?.data
    if (body && typeof body.namespace === 'string' && typeof body.key === 'string') {
      return { namespace: body.namespace, key: body.key, error: typeof body.message === 'string' ? body.message : String(body.error ?? '') }
    }
    throw failure(error, 'Save settings')
  }
}

export const sendTest = () => request<SendReceipt>(() => api.post('/api/v1/mail/delivery/send-test', {}), 'Send test email')
