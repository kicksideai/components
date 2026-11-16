// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Declaration } from './types'
import { clone, type SchemaPlan } from './app/settings/model'
export interface Pack { id: string; title: string; version: string; icon: string; description: string; requires: string[]; plugins: { id: string; installed: boolean }[] }
export interface PackSelection { pack?: string; version?: string; starter?: boolean }
export interface PackRequest { pack: string; version?: string; expected_generation: number; maps?: Record<string, Record<string, string>>; plugin_configs?: Record<string, Record<string, unknown>>; resolutions?: Record<string, 'local' | 'incoming'> }
export interface PackPlan extends SchemaPlan { pack: string; version: string; digest: string; declaration: Declaration; conflicts: { path: string; base: unknown; local_value: unknown; incoming: unknown }[]; maps: Record<string, Record<string, string>> }
export interface PackResult { operation_id: string; job_id: string; status: string; generation: number }

export function upgradeRequest(pack: Pack, generation: number): PackRequest {
  return { pack: pack.id, version: pack.version, expected_generation: generation }
}

export async function planUpgrade(input: PackRequest, plan: (request: PackRequest) => Promise<PackPlan>) {
  const request: PackRequest = { ...clone(input), resolutions: clone(input.resolutions ?? {}) }
  let response = await plan(request)
  if (!request.maps) { request.maps = clone(response.maps); response = await plan(request) }
  return { request, plan: response }
}
