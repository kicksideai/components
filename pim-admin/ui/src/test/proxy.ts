// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { AdminEnvelope } from '../../../../admin-http'

export function successResponse<T>(data: T): { data: AdminEnvelope<T> } {
  return { data: { success: true, data } }
}

type PrincipalLabels = { principals: { type: 'user' | 'group'; id: string; label: string }[] }

export function principalResponse(...principals: PrincipalLabels['principals']) {
  return successResponse<PrincipalLabels>({ principals })
}
