// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import type { Schema } from '../issue/types'
import { createFields, initialIssueType, parentQuery, needsParent } from './model'

const schema: Schema = {
  fields: [
    { code: 'details', title: 'Details', form: 'text' },
    { code: 'title', title: 'Summary', form: 'text' },
    { code: 'locked', title: 'Locked', form: 'text', transition_only: true },
    { code: 'name', title: 'Name', form: 'text' },
  ],
  item_types: [
    { id: 'sub_task', title: 'Sub-task', process: 'delivery', parent_types: ['story', 'bug'], fields: ['details', 'title'] },
    { id: 'epic', title: 'Epic', process: 'delivery', parent_types: [], fields: ['details', 'title', 'locked'] },
    { id: 'task', title: 'Task', process: 'delivery', parent_types: [false, 'epic'], fields: ['title'] },
    { id: 'sprint', title: 'Sprint', process: 'planning', parent_types: [], fields: ['name'] },
  ],
  processes: [{ id: 'delivery', initial: 'todo', states: [{ id: 'todo', name: 'To Do', require: ['title'] }] }],
  relation_types: [],
}

it('defaults to the first root issue and fronts its required compiled fields', () => {
  const type = initialIssueType(schema)
  expect(type?.id).toBe('epic')
  expect(createFields(schema, type)).toMatchObject({
    required: [{ code: 'title' }], optional: [{ code: 'details' }],
  })
})
it('uses only eligible parent types and carries the returned cursor through bounded Work queries', () => {
  const type = schema.item_types[0]!
  expect(needsParent(type)).toBe(true)
  expect(needsParent(schema.item_types[2])).toBe(false)
  expect(parentQuery(type, 'opaque')).toEqual({
    where: { field: 'type', op: 'in', value: ['story', 'bug'] }, limit: 20, after: 'opaque',
  })
})
