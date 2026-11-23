// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it, vi } from 'vitest'
import { BoardDirectory } from './directory'
import type { BoardOption, BoardPage } from './types'

function board(id: string, title = id): BoardOption {
  return { board_id: id, title, status: 'ready', access: { read: true, write: false, delete: false, admin: false } }
}

describe('the board directory', () => {
  it('loads one page at root and follows the exact offset for a deep link', async () => {
    const page = vi.fn<(after?: number) => Promise<BoardPage>>()
      .mockResolvedValueOnce({ boards: [board('first')], next: 12 })
      .mockResolvedValueOnce({ boards: [board('first', 'Renamed'), board('target')] })
    const directory = new BoardDirectory(page)
    expect(await directory.resolve()).toEqual(board('first'))
    expect(page.mock.calls).toEqual([[undefined]])
    expect(await directory.resolve('target')).toEqual(board('target'))
    expect(page.mock.calls).toEqual([[undefined], [12]])
    expect(directory.boards).toEqual([board('first', 'Renamed'), board('target')])
    expect(await directory.resolve('absent')).toBeUndefined()
    expect(page).toHaveBeenCalledTimes(2)
  })

  it('coalesces concurrent requests and leaves the same cursor retryable after failure', async () => {
    const page = vi.fn<(after?: number) => Promise<BoardPage>>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ boards: [board('first')] })
    const directory = new BoardDirectory(page)
    const reads = await Promise.allSettled([directory.loadMore(), directory.loadMore()])
    expect(reads.every(read => read.status === 'rejected')).toBe(true)
    expect(page).toHaveBeenCalledTimes(1)
    await directory.loadMore()
    expect(directory.boards).toEqual([board('first')])
  })
})
