// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { get } from './shared/transport'
import type { PolicyDefaults } from './types'

export async function readPolicyDefaults(catalogId: string): Promise<PolicyDefaults> {
  const values = await get<Record<string, unknown>>(`/api/v1/pim-admin/catalogs/${encodeURIComponent(catalogId)}/policy_defaults`, 'policy defaults')
  if ((values.audit !== 'fields' && values.audit !== 'off') || !['audit_days', 'trash_days', 'tombstone_days'].every(key => typeof values[key] === 'number' && Number.isSafeInteger(values[key]))) {
    throw new Error('Policy defaults are unavailable.')
  }
  for (const [key, control] of Object.entries(OPERATING_CONTROLS)) {
    const value = values[key]
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < control.min || value > control.max) throw new Error(`Policy ${key} is unavailable.`)
  }
  return values as unknown as PolicyDefaults
}

export const OPERATING_CONTROLS = {
  "proposal_days": {
    "min": 1,
    "max": 3650,
    "title": "Proposal retention (days)",
    "global": false
  },
  "completed_work_days": {
    "min": 1,
    "max": 3650,
    "title": "Completed release work retention (days)",
    "global": false
  },
  "abandoned_work_days": {
    "min": 1,
    "max": 3650,
    "title": "Abandoned release work retention (days)",
    "global": false
  },
  "import_days": {
    "min": 1,
    "max": 3650,
    "title": "Completed import retention (days)",
    "global": false
  },
  "pending_creation_days": {
    "min": 1,
    "max": 3650,
    "title": "Unfinished catalog expiry (days)",
    "global": true
  },
  "proposal_count": {
    "min": 1,
    "max": 1000,
    "title": "Proposal quota",
    "global": false
  },
  "proposal_bytes": {
    "min": 1024,
    "max": 262144,
    "title": "Proposal size (bytes)",
    "global": false
  },
  "command_deadline_ms": {
    "min": 100,
    "max": 5000,
    "title": "Time limit per catalog change (ms)",
    "global": false
  },
  "maintenance_rows": {
    "min": 20,
    "max": 500,
    "title": "Records per cleanup pass",
    "global": true
  },
  "maintenance_catalogs": {
    "min": 1,
    "max": 10,
    "title": "Catalogs per cleanup pass",
    "global": true
  },
  "rebuild_rows": {
    "min": 1,
    "max": 500,
    "title": "Products per rebuild step",
    "global": false
  },
  "job_batches": {
    "min": 1,
    "max": 20,
    "title": "Product groups per work session",
    "global": false
  },
  "import_rows": {
    "min": 1,
    "max": 200,
    "title": "Products per import step",
    "global": false
  }
} as const
