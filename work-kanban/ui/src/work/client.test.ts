// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it, vi } from 'vitest'
import { createWorkClient, kanbanPack, kanbanUiApp, newBoardRequest } from './client'

describe('the Work HTTP client', () => {
  it('preserves directory scope and count suppression when continuing a page', async () => {
    const request = vi.fn(async () => ({ data: { success: true, data: { boards: [], next: 76 } } }))
    const work = createWorkClient(request)
    await expect(work.boards()).resolves.toEqual({ boards: [], next: 76 })
    await work.boards(76)
    const base = '/api/v1/work/boards?ui_app=' + encodeURIComponent(kanbanUiApp) + '&include_counts=false&limit=50'
    expect(request.mock.calls).toEqual([[{ method: 'get', url: base }],
      [{ method: 'get', url: base + '&after=76' }]])
  })

  it('sends the exact packed create request, omitting a blank prefix and keeping the retry key', async () => {
    const request = vi.fn(async () => ({ data: { success: true, data: { board_id: 'b', generation: 1 } } }))
    const work = createWorkClient(request)
    const draft = newBoardRequest('  Delivery  ', '  ', '1.0.0', 'key')
    await work.createBoard(draft)
    await work.createBoard(draft)
    const data = {
      title: 'Delivery', pack: kanbanPack, version: '1.0.0', starter: false, idempotency_key: 'key',
      plugin_configs: { 'kickside.work.planning:plugin': { issue_types: ['epic', 'story', 'task', 'bug', 'sub_task'] } },
    }
    const call = { method: 'post', url: '/api/v1/work/boards', data }
    expect(request.mock.calls).toEqual([[call], [call]])
    expect(newBoardRequest('Delivery', ' OPS ', '1.0.0', 'key')).toEqual({ ...data, declaration: { key_prefix: 'OPS' } })
  })

  it('preserves the Work code and HTTP status on a denied write', async () => {
    const work = createWorkClient(async () => {
      throw { response: { status: 403, data: { code: 'board_creation_denied' } } }
    })
    await expect(work.createBoard(newBoardRequest('Delivery', '', '1.0.0', 'key')))
      .rejects.toMatchObject({ code: 'board_creation_denied', status: 403 })
  })
})
