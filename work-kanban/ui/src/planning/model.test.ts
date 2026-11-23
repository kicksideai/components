// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { closeRequest, sprintMemberQuery } from './model'

it('sends Planning’s unchanged snapshot and token with the command key', () => {
  const snapshot = { board: 'b', generation: 1, versions: [{ item: 'i', version: 6 }] }
  const body = closeRequest({ snapshot, token: 'preview', unfinished: 1 }, 'retry-key')
  expect(body).toEqual({ snapshot, token: 'preview', key: 'retry-key' })
  expect(body.snapshot).toBe(snapshot)
})
it('loads one membership page scoped to the selected sprint or backlog', () => {
  expect(sprintMemberQuery('b', 's', 'opaque').where).toMatchObject({
    and: [{ field: 'type', op: 'nin', value: ['sprint', 'milestone'] },
      { field: 'current_sprint', op: 'eq', value: { board: 'b', item: 's' } }],
  })
  expect(sprintMemberQuery('b', undefined).where).toMatchObject({
    and: [{ field: 'type' }, { field: 'current_sprint', op: 'is_null', value: true }],
  })
})
