// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it, vi } from 'vitest'
import { api } from '@wippy-fe/proxy'
vi.unmock('./policy')
import { OPERATING_CONTROLS, readPolicyDefaults } from './policy'

const defaults = () => ({ audit: 'fields', audit_days: 365, trash_days: 14, tombstone_days: 365,
  ...Object.fromEntries(Object.entries(OPERATING_CONTROLS).map(([key, control]) => [key, control.min])) })

it('reads deployment defaults through the edited catalog’s administration endpoint', async () => {
  vi.mocked(api.get).mockResolvedValue({ data: { success: true, data: defaults() } } as never)
  expect(await readPolicyDefaults('a/b')).toEqual(defaults())
  expect(api.get).toHaveBeenLastCalledWith('/api/v1/pim-admin/catalogs/a%2Fb/policy_defaults', { params: undefined })
})
it('leaves an unreadable deployment default visible as an error', async () => {
  vi.mocked(api.get).mockRejectedValue(new Error('Settings unavailable'))
  await expect(readPolicyDefaults('cat')).rejects.toThrow('Settings unavailable')
})
it('rejects incomplete deployment defaults instead of inventing effective policy', async () => {
  vi.mocked(api.get).mockResolvedValue({ data: { success: true, data: { ...defaults(), proposal_count: undefined } } } as never)
  await expect(readPolicyDefaults('cat')).rejects.toThrow('Policy proposal_count is unavailable')
})
