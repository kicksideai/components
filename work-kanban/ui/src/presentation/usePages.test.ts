// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { effectScope, ref } from 'vue'
import { expect, it, vi } from 'vitest'
import { WorkError, type WorkClient } from '../work/client'
import type { KanbanTab } from '../route'
import type { BoardOption } from '../work/types'
import { usePages } from './usePages'
import type { QueryPage } from './query'

const board: BoardOption = { board_id: 'one', title: 'One', access: { read: true, write: false, delete: false, admin: false } }
const item = { id: 'one', key: 'K-1', type: 'story', state: 'todo', version: 1, values: {} }
const view = { view_id: 'view', board_id: 'one', view: { type: 'kanban_backlog' } }

function fixture() {
  const scope = effectScope()
  const active = ref(board)
  const tab = ref<KanbanTab>('backlog')
  const read = vi.fn()
  const run = vi.fn()
  const accessLost = vi.fn()
  const work = { boardRead: read, runView: run } as unknown as WorkClient
  const pages = scope.run(() => usePages({
    board: () => active.value,
    schema: () => ({ as_of: 1, generation: 1, key_prefix: 'K', declaration: {}, compiled: {} }),
    tab: () => tab.value, work, accessLost,
  }))!
  read.mockResolvedValue({ views: [view] })
  return { tab, active, accessLost, pages, read, run, stop: () => scope.stop() }
}

it('ignores a response for an earlier selection even if Work finishes it last', async () => {
  const env = fixture()
  try {
    let release: (page: QueryPage) => void = () => {}
    env.run.mockImplementationOnce(() => new Promise<QueryPage>(resolve => { release = resolve }))
    const stale = env.pages.refresh()
    await vi.waitFor(() => expect(env.run).toHaveBeenCalledOnce())
    env.pages.select([{ where: { field: 'state', op: 'eq', value: 'doing' } }])
    env.read.mockResolvedValueOnce({ as_of: 10, items: [] })
    await env.pages.refresh()
    release({ as_of: 9, items: [item] })
    await stale
    expect(env.pages.backlog.value?.items).toEqual([])
  } finally { env.stop() }
})

it('retains a visible page after a transient failure and clears it on denial', async () => {
  const env = fixture()
  try {
    env.run.mockResolvedValueOnce({ as_of: 9, items: [item] })
    await env.pages.refresh()
    env.run.mockRejectedValueOnce(new WorkError({}, 503))
    await env.pages.refresh()
    expect(env.pages.backlog.value?.items).toEqual([item])
    env.run.mockRejectedValueOnce(new WorkError({}, 403))
    await env.pages.refresh()
    expect(env.pages.backlog.value).toBeUndefined()
    expect(env.accessLost).toHaveBeenCalledOnce()
  } finally { env.stop() }
})

it('does not reuse a committed-sequence fence when the selected board changes', async () => {
  const env = fixture()
  try {
    env.run.mockResolvedValueOnce({ as_of: 900, items: [item] })
    await env.pages.refresh()
    env.active.value = { ...board, board_id: 'two', title: 'Two' }
    env.run.mockResolvedValueOnce({ as_of: 1, items: [] })
    await env.pages.refresh()
    expect(env.run.mock.calls[1][1].min_seq).toBeUndefined()
  } finally { env.stop() }
})

it('retains a Backlog cursor on the same board when changing to another tab and back', async () => {
  const env = fixture()
  try {
    const cursor = { id: 'one', v: 'work-rank' }
    env.run.mockResolvedValueOnce({ as_of: 9, items: [item], after: cursor })
    await env.pages.refresh()
    env.run.mockResolvedValueOnce({ as_of: 9, items: [] })
    await env.pages.pageBacklog(1)
    expect(env.pages.backlogIndex.value).toBe(1)
    env.tab.value = 'board'
    expect(env.pages.backlog.value).toBeUndefined()
    env.tab.value = 'backlog'
    expect(env.pages.backlogIndex.value).toBe(1)
    env.run.mockResolvedValueOnce({ as_of: 9, items: [] })
    await env.pages.refresh()
    expect(env.run.mock.calls.at(-1)?.[1].after).toBe(cursor)
  } finally { env.stop() }
})

it('refreshes a visible cursor window beyond Work’s 200-row grouped page limit', async () => {
  const env = fixture()
  const fixtureItems = Array.from({ length: 228 }, (_, index) => ({ ...item, id: 'issue-' + index }))
  const cursor = (index: number) => ({ id: 'issue-' + index, v: 'rank-' + index })
  const grouped = (size: number): QueryPage => ({
    as_of: 20, items: [], groups: [{
      field: 'state', value: 'todo', count: fixtureItems.length, items: fixtureItems.slice(0, size), after: cursor(size - 1),
    }],
  })
  try {
    env.tab.value = 'board'
    env.read.mockResolvedValueOnce({ views: [{ ...view, view: { type: 'kanban_board', group_by: 'state' } }] })
    env.run.mockResolvedValueOnce(grouped(8))
    await env.pages.refresh()
    for (let start = 8; start < 228; start += 20) {
      env.read.mockResolvedValueOnce({ as_of: 20, items: fixtureItems.slice(start, start + 20), after: cursor(start + 19) })
      await env.pages.more(env.pages.lanes.value[0].columns[0])
    }
    env.pages.visible.value = ['todo']
    env.pages.visibleRow('todo', 208)
    const changed = { ...fixtureItems[210], values: { title: 'Committed edit' } }
    env.read.mockResolvedValueOnce(grouped(200))
    env.read.mockResolvedValueOnce({
      as_of: 21, items: [fixtureItems[208], fixtureItems[209], changed, ...fixtureItems.slice(211)],
    })
    await env.pages.refresh({ revalidate: false, minSeq: 21 })
    const refreshed = env.pages.lanes.value[0].columns[0]
    expect(refreshed.items).toHaveLength(228)
    expect(refreshed.items[210]).toEqual(changed)
    expect(env.read.mock.calls.at(-1)?.[2].after).toEqual(cursor(207))
    expect(env.read.mock.calls.at(-1)?.[2].min_seq).toBe(21)
  } finally { env.stop() }
})

it('keeps a requested column page when a live refresh was already in flight', async () => {
  const env = fixture()
  const after = { id: 'one', v: 'rank-1' }
  const older: QueryPage = {
    as_of: 9, items: [], groups: [{ field: 'state', value: 'todo', items: [item], count: 2, after }],
  }
  const next = { ...item, id: 'next' }
  try {
    env.tab.value = 'board'
    env.read.mockResolvedValueOnce({ views: [{ ...view, view: { type: 'kanban_board', group_by: 'state' } }] })
    env.run.mockResolvedValueOnce(older)
    await env.pages.refresh()
    env.pages.visible.value = ['todo']
    let release: (response: QueryPage) => void = () => {}
    env.read.mockImplementationOnce(() => new Promise<QueryPage>(resolve => { release = resolve }))
    const refreshing = env.pages.refresh()
    env.read.mockResolvedValueOnce({ as_of: 10, items: [next] })
    await env.pages.more(env.pages.lanes.value[0].columns[0])
    release(older)
    await refreshing
    expect(env.pages.lanes.value[0].columns[0].items).toEqual([item, next])
  } finally { env.stop() }
})
