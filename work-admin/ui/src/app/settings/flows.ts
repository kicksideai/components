// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'
import { ApiError, failure } from '../../transport'
export type FlowRef = { kind: 'flow'; id: string; version: number }
async function read(path: string): Promise<{ versions?: { version: number }[]; version?: { version: number } }> {
  try {
    const { data } = await api.get(path)
    if (!data?.success) {
      const message = data?.message || (typeof data?.error === 'string' ? data.error : data?.error?.message) || 'Could not read published Flow.'
      throw new ApiError({ message, details: data?.details }, 'Published Flow')
    }
    return data
  } catch (error) { throw failure(error, 'Published Flow') }
}
const path = (id: string) => `/api/v1/workflows/${encodeURIComponent(id)}/versions`
export const flows = {
  versions: async (id: string) => (await read(path(id))).versions ?? [],
  check: async (reference: FlowRef) => {
    const data = await read(`${path(reference.id)}/${reference.version}`)
    if (data.version?.version !== reference.version) throw new Error('The published version is unavailable.')
  },
}
