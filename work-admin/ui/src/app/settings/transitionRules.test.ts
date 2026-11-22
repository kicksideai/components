// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import type { Declaration, Process, Transition } from '../../types'
import { transitionRules } from './transitionRules'

const process: Process = {
  id: 'delivery', initial: 'blocked',
  states: [
    { id: 'blocked', category: 'started' },
    { id: 'doing', category: 'started', require: ['assignee'] },
  ],
}
const draft: Declaration = {
  fields: [
    { code: 'resolution', title: 'Resolution' },
    { code: 'assignee', title: 'Assignee' },
    { code: 'priority', title: 'Priority', type: 'option', options: [{ id: 'high', label: 'High priority' }] },
  ],
  relation_types: [{ id: 'blocks', outward: 'blocks', inward: 'is blocked by' }],
}
const resume: Transition = { id: 'resume', from: ['blocked'], to: 'doing' }
const openCategory = { field: 'category', op: 'nin', value: ['canceled', 'completed'] }

it.each([
  ['none', 'Requires all blockers to be resolved.'],
  ['some', 'Requires an open blocker.'],
])('uses Tracker wording for the standard %s blockers rule', (q, message) => {
  const when = { rel: 'blocks', dir: 'inward', q, where: openCategory }
  expect(transitionRules({ ...resume, when }, process, draft)).toEqual(['Required: Assignee', message])
})

it('summarizes changed link predicates, the actual field choices, and installed checks', () => {
  const when = { and: [
    { rel: 'blocks', dir: 'outward', q: 'none', where: { field: 'priority', op: 'eq', value: 'high' } },
    { field: 'resolution', op: 'is_null', value: false },
  ] }
  const move = { ...resume, require: ['resolution', 'assignee'], when, guards: ['work:check'] }
  expect(transitionRules(move, process, draft, [{ id: 'work:check', title: 'Release check', plugin: 'work:plugin' }])).toEqual([
    'Required: Resolution, Assignee',
    'Only when (No item linked as “blocks” matches (Priority is High priority) and Resolution is filled)',
    'Requires the “Release check” check to pass',
  ])
})
