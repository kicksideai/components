// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { api } from '@wippy-fe/proxy'
import { expect, it, vi } from 'vitest'
import { work } from './api'
import { emptyOptions } from './types'

it('reads installed choices from the board options endpoint', async () => {
  const choice = { id: 'app:check', plugin: 'app:plugin', title: 'Release check' }
  const data = {
    ...emptyOptions(),
    guards: [choice],
    filters: [{ ...choice, id: 'app:filter' }],
    board_apps: [{ id: 'app:tracker', title: 'Tracker' }],
  }
  vi.mocked(api.get).mockResolvedValueOnce({ data: { success: true, data } })
  expect(await work.options('board/id')).toEqual(data)
  expect(api.get).toHaveBeenLastCalledWith('/api/v1/work-admin/boards/board%2Fid/options', { params: undefined })
})

it('converts empty Wippy lists into arrays for all three pickers', async () => {
  const data = { ...emptyOptions(), guards: {}, filters: {}, board_apps: {} }
  vi.mocked(api.get).mockResolvedValueOnce({ data: { success: true, data } })
  expect(await work.options('board')).toMatchObject({ guards: [], filters: [], board_apps: [] })
})
