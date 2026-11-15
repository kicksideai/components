// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { canAdmin, clone, move, normalizeSchema, renameField, requestDeclaration, reviewSnapshot } from './model'
import { schema } from '../../test/fixtures'
import type { Declaration } from '../../types'
it('retains stable field identity on rename and sends explicit removals', () => {
  const original: Declaration = { fields: [{ id: 1, code: 'title', form: 'text' }, { id: 2, code: 'obsolete', form: 'text' }], item_types: [{ id: 'task', process: 'flow', fields: ['title'], inherit: ['title'] }] }
  const draft = clone(original)
  renameField(draft, draft.fields![0], 'name')
  draft.fields!.splice(1, 1)
  expect(requestDeclaration(draft, original)).toMatchObject({ fields: [{ id: 1, code: 'name' }], item_types: [{ fields: ['name'], inherit: ['name'] }], remove: { fields: ['obsolete'] } })
  draft.fields!.push(original.fields![1])
  expect(requestDeclaration(draft, original).remove).toBeUndefined()
})
it('a reviewed plan belongs to one declaration, generation and initial plugin config', () => {
  const draft: Declaration = { plugins: [{ use: 'test:plugin' }] }, configs = { 'test:plugin': { limit: 2 } }
  const review = reviewSnapshot(draft, 4, configs)
  expect(review.matches(draft, 4, configs)).toBe(true)
  expect(review.matches(draft, 5, configs)).toBe(false)
  expect(review.matches({}, 4, configs)).toBe(false)
  configs['test:plugin'].limit = 3
  expect(review.matches(draft, 4, configs)).toBe(false)
  expect(review.plugin_configs['test:plugin'].limit).toBe(2)
})
it('checks the explicit admin flag and bounds reorder operations', () => {
  expect(canAdmin({ read: true, write: true, admin: false })).toBe(false); expect(canAdmin({ read: true, write: false, admin: true })).toBe(true); expect(canAdmin(undefined)).toBe(false)
  const fields = ['a', 'b']; move(fields, 0, -1); expect(fields).toEqual(['a', 'b']); move(fields, 1, -1); expect(fields).toEqual(['b', 'a'])
})
it('recovers stable field IDs from compiled schema without mutating the response', () => {
  const view = schema(); view.compiled.fields![0].id = 17
  expect(normalizeSchema(view).declaration.fields![0].id).toBe(17)
  expect(view.declaration.fields![0].id).toBeUndefined()
})
it('identifies follow process migrations from the returned change classes', async () => {
  const { processMigration } = await import('./model')
  const plan = { generation: 2, class: 'semantic', refused: [], changes: [{ code: 'process delivery', class: 'semantic', what: 'state.map' }] }
  expect(processMigration(plan, { processes: [{ id: 'delivery', initial: 'todo', states: [] }] })).toEqual(['delivery'])
  expect(processMigration(plan, { processes: [{ id: 'delivery', initial: 'todo', states: [], migration: 'pin' }] })).toEqual([])
  expect(processMigration({ ...plan, changes: [{ ...plan.changes[0], class: 'cosmetic' }] }, { processes: [{ id: 'delivery', initial: 'todo', states: [] }] })).toEqual([])
})
it('round trips the board settings route with encoded board IDs', async () => {
  const { parse, pathOf } = await import('../route')
  const route = { name: 'settings' as const, board: 'board/one' }
  expect(pathOf(route)).toBe('board%2Fone/settings')
  expect(parse(pathOf(route))).toEqual(route)
})
it('carries field renames through process effects, timers and access holder references', () => {
  const draft: Declaration = { fields: [{ id: 1, code: 'owner', form: 'ref', access: { read: [{ field: 'owner' }] } }], visibility: { field: 'owner', levels: [{ id: 'team', holders: [{ field: 'owner' }] }] }, processes: [{ id: 'flow', initial: 'active', states: [{ id: 'active', category: 'started', require: ['owner'], timers: [{ id: 'deadline', at_field: 'owner', by: 'owner', table: { urgent: 'PT1H' } }] }], transitions: [{ id: 'go', from: ['active'], to: 'active', require: ['owner'], set: [{ field: 'owner', copy: 'owner' }] }] }] }
  renameField(draft, draft.fields![0], 'assignee')
  expect(draft.visibility?.field).toBe('assignee')
  expect(draft.visibility?.levels[0].holders).toEqual([{ field: 'assignee' }])
  expect(draft.fields![0].access?.read).toEqual([{ field: 'assignee' }])
  expect(draft.processes![0].states[0]).toMatchObject({ require: ['assignee'], timers: [{ at_field: 'assignee', by: 'assignee' }] })
  expect(draft.processes![0].transitions![0]).toMatchObject({ require: ['assignee'], set: [{ field: 'assignee', copy: 'assignee' }] })
})
it('places typed compiler errors beside their field, process or item type', async () => {
  const { validationIssues } = await import('./model')
  const { ApiError } = await import('../../transport')
  const invalid = (details: Record<string, unknown>) => new ApiError({ message: 'Invalid definition', details }, 'Schema plan')
  const draft: Declaration = { processes: [{ id: 'delivery', initial: 'review', states: [{ id: 'review', category: 'started' }] }] }
  expect(validationIssues(invalid({ field: 'priority' }), draft)[0]).toMatchObject({ code: 'priority', what: 'invalid', detail: 'Invalid definition' })
  expect(validationIssues(invalid({ state: 'review' }), draft)[0].code).toBe('process delivery')
  expect(validationIssues(invalid({ item_type: 'task' }), draft)[0].code).toBe('item_type task')
  expect(validationIssues(new Error('Unavailable'), draft)).toEqual([])
})
it('refuses stored-value field removals and keeps unused removals available', async () => {
  const { removalReason } = await import('./model')
  const plan = { generation: 2, class: 'semantic', refused: [], changes: [{ code: 'priority', what: 'removed', class: 'semantic' }] }
  expect(removalReason(plan, 'fields', 'priority')).toContain('Items still hold values')
  expect(removalReason({ ...plan, changes: [{ ...plan.changes[0], class: 'additive' }] }, 'fields', 'priority')).toBeUndefined()
})

it('renames declared approval, awaiting and nested predicate field references', () => {
  const draft: Declaration = { fields: [{ code: 'owner', form: 'ref' }, { code: 'total', form: 'int', where: { and: [{ field: 'owner', op: 'eq', value: 'owner' }, { not: { field: 'owner', op: 'is_null' } }] } }], processes: [{ id: 'flow', initial: 'review', states: [{ id: 'review', category: 'started', awaiting: { field: 'owner' }, release_when: { approvals: { min: 1, from: { field: 'owner' } }, when: { field: 'owner', op: 'eq', value: 'owner' } } }], transitions: [{ id: 'next', from: ['review'], to: 'review', when: { field: 'owner', op: 'eq', value: 'owner' } }] }] }
  renameField(draft, draft.fields![0], 'assignee')
  expect(draft.processes![0].states[0]).toMatchObject({ awaiting: { field: 'assignee' }, release_when: { approvals: { from: { field: 'assignee' } }, when: { field: 'assignee', value: 'owner' } } })
  expect(draft.processes![0].transitions![0].when).toMatchObject({ field: 'assignee', value: 'owner' })
  expect(draft.fields![1].where).toEqual({ and: [{ field: 'assignee', op: 'eq', value: 'owner' }, { not: { field: 'assignee', op: 'is_null' } }] })
})
it('refuses a rename before mutating a draft containing formula expressions', () => {
  const draft: Declaration = { fields: [{ code: 'owner', form: 'ref' }, { code: 'derived', form: 'text', expression: 'owner.id', type: 'formula' }] }
  const before = clone(draft)
  expect(() => renameField(draft, draft.fields![0], 'assignee')).toThrow('expression')
  expect(draft).toEqual(before)
})

it.each(['automated', 'parallel'])('uses the Work pin default for %s process entries', async kind => {
  const { processMigration } = await import('./model')
  const process = { id: 'delivery', initial: 'entry', states: [{ id: 'entry', category: 'started', kind }] }
  const plan = { generation: 2, class: 'semantic', refused: [], changes: [{ code: 'process delivery', class: 'semantic', what: 'state.map' }] }
  expect(processMigration(plan, { processes: [process] })).toEqual([])
  expect(normalizeSchema({ ...schema(), declaration: { processes: [process] }, compiled: { processes: [{ ...process, migration: 'pin' }] } }).declaration.processes![0].migration).toBe('pin')
})

it('preserves rollup ordering and predicate literals when a field code matches them', () => {
  const draft: Declaration = { fields: [{ code: 'time', form: 'time' }, { code: 'latest', form: 'time', type: 'rollup', by: 'time', where: { field: 'time', op: 'eq', value: { field: 'time' } } }] }
  renameField(draft, draft.fields![0], 'deadline')
  expect(draft.fields![1].by).toBe('time')
  expect(draft.fields![1].where).toEqual({ field: 'deadline', op: 'eq', value: { field: 'time' } })
})
