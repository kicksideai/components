// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it, vi } from 'vitest'
import { loadByTagName } from '@wippy-fe/proxy'
import { ensureTag } from './mount'
it('allows a later explicit load after a failed component registration', async () => {
  vi.mocked(loadByTagName).mockRejectedValueOnce(new Error('Unavailable')).mockResolvedValueOnce(undefined)
  expect(await ensureTag('work-recoverable-widget')).toBe(false)
  expect(await ensureTag('work-recoverable-widget')).toBe(true)
})
