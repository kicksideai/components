// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { planMove } from './move'
import type { ItemDetail } from '../presentation/query'

const detail: ItemDetail = {
  item: { id: '1', key: 'K-1', type: 'story', state: 'todo', version: 6, values: {} },
  access: { read: true, write: true, delete: false, admin: false },
  field_edit: { resolution: 'editable' },
  transitions: [{ id: 'complete', name: 'Complete', to: 'done', require: ['resolution'] }],
}

it('uses the version and required inputs from the authorized item read', () => {
  const intent = { item: '1', source: 'todo', target: 'done', before: '2' }
  expect(planMove(detail, intent)).toEqual({
    operations: [
      { op: 'transition', item: '1', transition: 'complete', expect_version: 6 },
      { op: 'rank', item: '1', before: '2' },
    ],
    required: ['resolution'],
  })
  expect(planMove({ ...detail, transitions: [] }, intent)).toBeUndefined()
  expect(planMove({ ...detail, field_edit: {} }, intent)).toBeUndefined()
})
