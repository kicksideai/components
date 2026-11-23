// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { boardWindow, rowWindow, moveIntent } from './window'

it('bounds mounted cards on either axis even at the end of a large board', () => {
  const columns = boardWindow(5200, 1750, 260, 20, 0)
  const rows = rowWindow(17_000, 1300, 82, 500, 0)
  expect(columns).toContain(19)
  expect(columns).toContain(0)
  expect(rows).toContain(0)
  expect(rows).toContain(208)
  expect(columns.length * rows.length).toBeLessThanOrEqual(150)
})

it('preserves Work neighbor IDs when moving across a virtual window', () => {
  expect(moveIntent('a', 'todo', 'done', ['b', 'a', 'c', 'd'], 'c', 'after')).toEqual({
    item: 'a', source: 'todo', target: 'done', after: 'c', before: 'd',
  })
  expect(moveIntent('only', 'todo', 'todo', ['only'], 'only', 'before')).toBeUndefined()
})
