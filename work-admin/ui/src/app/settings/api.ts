// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { PackPlan, PackRequest, PackResult } from '../../packs'
import { post } from '../../transport'
import type { SchemaPlan, reviewSnapshot } from './model'
const board = (id: string) => `/api/v1/work/boards/${encodeURIComponent(id)}`
type Reviewed = ReturnType<typeof reviewSnapshot>
const body = (review: Reviewed) => ({ declaration: review.declaration, expected_generation: review.expected_generation, plugin_configs: review.plugin_configs,
  ...(Object.keys(review.resolutions).length ? { resolutions: review.resolutions } : {}) })
export const settings = {
  packPlan: (id: string, request: PackRequest) => post<PackPlan>(`${board(id)}/pack_plan`, request, 'Pack plan'),
  packApply: (id: string, request: PackRequest, key: string) => post<PackResult>(`${board(id)}/pack_apply`, { ...request, key }, 'Apply pack'),
  plan: (id: string, review: Reviewed) => post<SchemaPlan>(`${board(id)}/plan_schema`, body(review), 'Schema plan'),
  apply: (id: string, review: Reviewed, key: string) => post<{ generation: number; class: string }>(`${board(id)}/apply_schema`, { ...body(review), key }, 'Apply schema'),
  resume: (id: string) => post<{ resumed: boolean; job_id: string }>(`${board(id)}/resume_migration`, {}, 'Resume migration'),
  configure: (id: string, plugin: string, config?: Record<string, unknown>) => post<{ attachment_id: string }>(`${board(id)}/configure_plugin`, { plugin, ...(config === undefined ? {} : { config }) }, 'Configure plugin'),
}
