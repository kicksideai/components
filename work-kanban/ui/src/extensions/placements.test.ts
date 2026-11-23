// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { badgeSlots, checkPlacements, extensionFilter } from './placements'

const base = { slot: 'card_badge', tag: 'wc-badge', title: 'Badge', order: 10, access: 'read', plugin: 'example:plugin', target: 'item' }

it('keeps at most two badges for a matching card and exposes the rest to the drawer', () => {
  const checked = checkPlacements([
    { ...base, id: 'c', target: 'item:story' },
    { ...base, id: 'b' },
    { ...base, id: 'a', order: 1 },
    { ...base, id: 'bad-tag', tag: '<button>' },
    { ...base, id: 'other-type', target: 'item:task' },
    { ...base, id: 'writer', access: 'write' },
  ], { read: true, write: false, delete: false, admin: false })
  const badges = badgeSlots(checked, 'story')
  expect(badges.visible.map(item => item.id)).toEqual(['a', 'b'])
  expect(badges.overflow.map(item => item.id)).toEqual(['c'])
})

it('allows only the admitted field, operand or scope in an extension intent', () => {
  const field = { ...base, id: 'priority', slot: 'filter' as const, access: 'read' as const, target: 'field:priority' }
  expect(extensionFilter(field, { field: 'priority', op: 'eq', value: 'high' })).toEqual({
    where: { field: 'priority', op: 'eq', value: 'high' },
  })
  expect(extensionFilter(field, { field: 'assignee', op: 'eq', value: 'someone' })).toBeUndefined()
  expect(extensionFilter(field, { or: [{ field: 'priority', op: 'eq', value: 'high' }] })).toBeUndefined()
  expect(extensionFilter({ ...field, target: 'operand:my:operand' }, {
    field: 'priority', op: 'eq', value: { $operand: 'other:operand' },
  })).toBeUndefined()
})
