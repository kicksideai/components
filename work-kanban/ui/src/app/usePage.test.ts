// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it, vi } from 'vitest'
import { effectScope, ref } from 'vue'
import type { KanbanRoute } from '../route'
import { planningPlugin, WorkError } from '../work/client'
import type { BoardOption, BoardSchema } from '../work/types'
import { availableTabs, usePage } from './usePage'

const option = (board_id: string): BoardOption => ({
  board_id, title: board_id, status: 'ready',
  access: { read: true, write: false, delete: false, admin: false },
})
const snapshot: BoardSchema = {
  generation: 1, as_of: 1, key_prefix: 'KB', compiled: {}, declaration: {},
  plugins: [{ plugin: planningPlugin, active: true }],
}
const flush = () => new Promise(resolve => setTimeout(resolve, 0))

describe('the Kanban page controller', () => {
  it('offers a supported tab for a caller-visible board panel', () => {
    const schema: BoardSchema = {
      ...snapshot,
      plugins: [...snapshot.plugins!, { plugin: 'plugin:manifest', active: true }],
      extensions: [{
        id: 'plugin:search_panel', title: 'Search', slot: 'board_panel', target: 'board:search',
        plugin: 'plugin:manifest', tag: 'plugin-search', access: 'write', order: 1,
      }],
    }
    const reader = option('linked').access
    expect(availableTabs(schema, reader)).toEqual(['board', 'backlog', 'sprints'])
    expect(availableTabs(schema, { ...reader, write: true })).toEqual(['board', 'backlog', 'sprints', 'search'])
    expect(availableTabs(snapshot, { ...reader, write: true })).toEqual(['board', 'backlog', 'sprints'])
  })

  it('revalidates the selected board without replacing its issue deep link', async () => {
    const route = ref<KanbanRoute>({ tab: 'backlog', board: 'linked', issue: 'issue' })
    const schema = vi.fn().mockResolvedValueOnce(snapshot).mockResolvedValueOnce({ ...snapshot, generation: 2 })
    const boards = vi.fn().mockResolvedValue({ boards: [option('linked')] })
    const navigate = vi.fn()
    const subscribe = vi.fn((_board: string, _refresh: () => Promise<void>) => undefined)
    const scope = effectScope()
    try {
      const page = scope.run(() => usePage(route, { boards, schema }, navigate, subscribe))!
      await flush()
      await subscribe.mock.calls[0][1]()
      expect(subscribe).toHaveBeenCalledTimes(1)
      expect(page.schema.value?.generation).toBe(2)
      expect(navigate).not.toHaveBeenCalled()
      expect(route.value.issue).toBe('issue')
    } finally {
      scope.stop()
    }
  })

  it('drops an earlier board response when the shell changes the board', async () => {
    const route = ref<KanbanRoute>({ tab: 'board', board: 'first' })
    let finish!: (value: BoardSchema) => void
    const schema = vi.fn<(id: string) => Promise<BoardSchema>>()
      .mockImplementationOnce(() => new Promise(resolve => { finish = resolve }))
      .mockResolvedValueOnce(snapshot)
    const boards = vi.fn().mockResolvedValue({ boards: [option('first'), option('second')] })
    const events: string[] = []
    const subscribe = vi.fn((id: string) => {
      events.push(id)
      return () => events.push('stop:' + id)
    })
    const scope = effectScope()
    try {
      const page = scope.run(() => usePage(route, { boards, schema }, vi.fn(), subscribe))!
      await flush()
      route.value = { tab: 'sprints', board: 'second' }
      await flush()
      finish({ ...snapshot, generation: 2 })
      await flush()
      expect(boards).toHaveBeenCalledTimes(1)
      expect(schema.mock.calls).toEqual([['first'], ['second']])
      expect(events).toEqual(['first', 'stop:first', 'second'])
      expect(page.board.value?.board_id).toBe('second')
      expect(page.schema.value?.generation).toBe(1)
    } finally {
      scope.stop()
    }
  })

  it('clears selected data after READ is lost and leaves the deep link in place', async () => {
    const route = ref<KanbanRoute>({ tab: 'board', board: 'linked', issue: 'issue' })
    const schema = vi.fn().mockResolvedValueOnce(snapshot).mockRejectedValueOnce(new WorkError(undefined, 403))
    const boards = vi.fn().mockResolvedValue({ boards: [option('linked'), option('other')] })
    const navigate = vi.fn()
    const scope = effectScope()
    try {
      const page = scope.run(() => usePage(route, { boards, schema }, navigate, () => undefined))!
      await flush()
      expect(page.board.value?.board_id).toBe('linked')
      await page.refresh(true)
      expect(page.board.value).toBeUndefined()
      expect(page.schema.value).toBeUndefined()
      expect(page.boards.value).toEqual([option('other')])
      expect(page.missing.value).toBe(true)
      expect(navigate).not.toHaveBeenCalled()
      expect(route.value.issue).toBe('issue')
    } finally {
      scope.stop()
    }
  })
})
