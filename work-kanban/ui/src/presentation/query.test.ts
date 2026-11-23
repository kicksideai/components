// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it, vi } from 'vitest'
import type { WorkClient } from '../work/client'
import { bucketQuery, pageIdentity, queryFor, readItemDetail, type SavedView } from './query'

const cursor = { id: 'issue-21', value: 'work-rank' }
const view: SavedView = {
  view_id: 'view', board_id: 'board', title: 'Board',
  view: { type: 'kanban_board', group_by: 'state', order: [{ field: 'rank' }], where: { field: 'type', op: 'eq', value: 'story' } },
}
const filter = { where: { field: 'priority', op: 'eq', value: 'high' } }

it('combines the saved selection with checked filters and preserves the original cursor and rank order', () => {
  const query = queryFor(view, [filter])
  const bucket = bucketQuery(query, { state: 'todo', after: cursor }, 100)
  expect(bucket).toEqual({
    where: { and: [view.view.where, filter.where, { field: 'state', op: 'eq', value: 'todo' }] },
    order: view.view.order, after: cursor, min_seq: 100, limit: 20,
  })
  expect(bucket.after).toBe(cursor)
})

it('invalidates paging on board, schema generation, view definition or selection changes', () => {
  const identity = pageIdentity('board', 1, view, [filter])
  expect(pageIdentity('other', 1, view, [filter])).not.toBe(identity)
  expect(pageIdentity('board', 2, view, [filter])).not.toBe(identity)
  expect(pageIdentity('board', 1, view, [])).not.toBe(identity)
  expect(pageIdentity('board', 1, { ...view, view: { ...view.view, group_by: undefined } }, [filter])).not.toBe(identity)
})

it('reads item detail with Work’s typed item reference and includes only requested sections', async () => {
  const boardRead = vi.fn(async () => ({}))
  const work = { boardRead } as unknown as WorkClient
  await readItemDetail(work, 'board', 'issue-21', ['transitions'])
  expect(boardRead).toHaveBeenCalledExactlyOnceWith('board', 'get', { item: { id: 'issue-21' }, include: ['transitions'] })
})
