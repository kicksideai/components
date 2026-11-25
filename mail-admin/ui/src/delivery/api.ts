// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'
import { ApiError, failure } from '../api'

// Chooses Mail's delivery service through the platform Settings API. The write applies only while the driver setting
// stands at the revision Mail's delivery status reported; otherwise Settings answers 409.
export async function chooseService(driver: string, expectedRevision: number): Promise<void> {
  try {
    const { data } = await api.put('/api/v1/settings', { namespace: 'kickside.mail', key: 'driver', value: driver, expected_revision: expectedRevision })
    if (data?.success) return
    throw new ApiError({ error: data?.error, kind: 'INVALID' }, 'Delivery service')
  } catch (error) {
    throw failure(error, 'Delivery service')
  }
}

export const isConflict = (error: unknown) => error instanceof ApiError && error.status === 409
