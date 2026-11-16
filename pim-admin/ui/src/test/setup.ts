// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { config } from '@vue/test-utils'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
config.global.plugins = [PrimeVuePlugin]
import { vi } from 'vitest'
vi.mock('../policy', async importOriginal => ({ ...await importOriginal<typeof import('../policy')>(), readPolicyDefaults: vi.fn().mockResolvedValue({ audit: 'off', audit_days: 365, trash_days: 30, tombstone_days: 90, proposal_days: 30, completed_work_days: 180, abandoned_work_days: 180, import_days: 180, pending_creation_days: 90, proposal_count: 1000, proposal_bytes: 262144, command_deadline_ms: 5000, maintenance_rows: 500, maintenance_catalogs: 10, rebuild_rows: 500, job_batches: 20, import_rows: 200 }) }))

export { hostProps, events, hostEmit, visibility } from '../shared/test-support'
