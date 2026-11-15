// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { PluginProjection } from '../../types'
export function projectionHealth(projection: PluginProjection, head: number): string {
  if (projection.parked) return 'Stopped: ' + (typeof projection.error === 'string' ? projection.error : projection.error?.message ?? 'Projection is parked')
  if (projection.bootstrapping) return 'Initializing'
  return projection.last_seq >= head ? 'Up to date' : 'Catching up'
}
