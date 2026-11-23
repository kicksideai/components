// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it, vi } from 'vitest'
import { WorkError } from '../work/client'
import { checkedWrite, KeyedWrite, transitionInputs, visibleFields, fieldChanges } from './model'
import type { Detail, Schema } from './types'

const schema: Schema = {
  fields: [
    { code: 'private', title: 'Private', form: 'text' },
    { code: 'resolution', title: 'Resolution', form: 'text' },
    { code: 'title', title: 'Summary', form: 'text' },
    { code: 'assignee', title: 'Assignee', type: 'principal' },
  ],
  item_types: [{ id: 'story', title: 'Story', fields: ['private', 'title', 'assignee', 'resolution'], parent_types: ['epic'], process: 'story' }],
  processes: [{ id: 'story', initial: 'todo', states: [
    { id: 'todo', name: 'To Do', require: ['title'] },
    { id: 'done', name: 'Done', require: ['resolution'] },
  ] }],
  relation_types: [],
}

const detail: Detail = {
  item: { id: 'story', key: 'ROPS-1', type: 'story', state: 'todo', version: 8, values: { title: 'Read this' },
    value_states: { title: 'provided', assignee: 'absent', resolution: 'absent' } },
  access: { read: true, write: true, admin: false, delete: false },
  field_edit: { title: 'editable', private: 'field_denied', assignee: 'editable', resolution: 'editable' },
  transitions: [{ id: 'complete', name: 'Complete', to: 'done', require: [] }],
}

describe('issue field and command mapping', () => {
  it('shows only the caller-visible fields and orders summary and common fields first', () => {
    expect(visibleFields(schema, detail.item).map(field => field.code)).toEqual(['title', 'assignee', 'resolution'])
  })
  it('requires the target state inputs from a runnable edge and rejects an unlisted edge', () => {
    expect(transitionInputs(schema, detail, 'complete')?.map(field => field.code)).toEqual(['resolution'])
    expect(transitionInputs(schema, detail, 'block')).toBeUndefined()
  })
  it('patches only editable fields, keeps false and zero and explicitly clears a typed set', () => {
    expect(fieldChanges({ title: 'A', labels: ['old'], priority: 7, flag: true, private: 'before' },
      { title: 'A', labels: [], priority: 0, flag: false, private: 'after' }, ['title', 'labels', 'priority', 'flag']))
      .toEqual({ values: { priority: 0, flag: false }, clear: ['labels'] })
  })
  it('shows command findings even when Work returns an HTTP success envelope', () => {
    expect(() => checkedWrite({ applied: false, outcomes: [{ status: 'rejected', findings: [{ code: 'when_failed' }] }] }))
      .toThrow(expect.objectContaining({ code: 'when_failed', retryable: false }))
  })
  it('replays the exact ambiguous request, including the original version and key', async () => {
    const write = vi.fn().mockRejectedValueOnce(new WorkError()).mockResolvedValueOnce('applied')
    const createKey = vi.fn(() => 'first-key')
    const command = new KeyedWrite(write, createKey)
    const body = { ops: [{ op: 'set', expect_version: 8, values: { title: 'Edited' } }] }
    await expect(command.submit(body)).rejects.toBeInstanceOf(WorkError)
    expect(command.uncertain).toBe(true)
    await expect(command.submit({ ops: [{ op: 'set', expect_version: 9, values: { title: 'Newer' } }] })).resolves.toBe('applied')
    expect(write.mock.calls[1]?.[0]).toBe(write.mock.calls[0]?.[0])
    expect(write.mock.calls[1]?.[0]).toEqual({ ...body, key: 'first-key' })
    expect(command.uncertain).toBe(false)
  })
})
