// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { getButton as button } from '../../test/controls'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import DurationControl from './DurationControl.vue'
import { expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { reactive } from 'vue'
import ApproversEditor from './ApproversEditor.vue'
import TimersEditor from './TimersEditor.vue'
import StateSettings from './StateSettings.vue'
import type { Process, State } from '../../types'
it('selects a group or distinct principals through the platform picker and validates the minimum', async () => {
  const approvals = reactive({ min: 1, from: { group: '' }, prevent_self: true } as NonNullable<NonNullable<State['release_when']>['approvals']>)
  const w = mount(ApproversEditor, { props: { approvals } }); await flushPromises()
  expect(w.get('wc-principal-picker').attributes('kinds')).toBe('group')
  expect(w.emitted('validity')?.at(-1)).toEqual([false])
  await w.get('wc-principal-picker').trigger('config-changed', { detail: { principal_id: 'team', type: 'group' } })
  expect(approvals.from).toEqual({ group: 'team' }); expect(w.emitted('validity')?.at(-1)).toEqual([true])
  await w.getComponent(Select).setValue('principals')
  expect(w.get('[role=alert]').text()).toContain('Select at least 1')
  const picker = w.get('wc-principal-picker')
  await picker.trigger('config-changed', { detail: { id: 'person', type: 'user' } })
  await picker.trigger('config-changed', { detail: { id: 'person', type: 'user' } })
  expect(approvals.from).toEqual([{ kind: 'user', id: 'person' }]); expect(w.emitted('validity')?.at(-1)).toEqual([true])
  await w.get('[aria-label="Remove approver 1"]').trigger('click')
  expect(w.emitted('validity')?.at(-1)).toEqual([false]); w.unmount()
})
it('supports wait-only gates without retaining approval requirements', async () => {
  const state = reactive<State>({ id: 'review', category: 'started', kind: 'gate', release_when: { approvals: { min: 1, from: { group: 'team' } } } })
  const process: Process = { id: 'flow', initial: 'review', states: [state] }
  const w = mount(StateSettings, { props: { state, process, draft: {}, advanced: true } }); await flushPromises()
  const approvals = w.findAll('[type=checkbox]').find(input => input.element.closest('label')?.textContent?.includes('Require approvals'))!
  await approvals.setValue(false)
  const wait = w.findAllComponents(DurationControl).find(c => c.props('label') === 'Wait before release')!
  await wait.getComponent(Select).setValue('hours'); await wait.getComponent(InputNumber).setValue(2); expect(state.release_when).toEqual({ wait: 'PT2H' }); expect(w.findComponent(ApproversEditor).exists()).toBe(false)
  w.unmount()
})
it('edits each timer deadline, lookup table and effect and removes repetition for interrupting timers', async () => {
  const state = reactive<State>({ id: 'active', category: 'started' })
  const w = mount(TimersEditor, { props: { state, draft: { fields: [{ code: 'due', form: 'time' }, { code: 'priority', type: 'option', form: 'text' }] } } })
  await button(w, 'Add timer').trigger('click')
  let selects = w.findAllComponents(Select)
  await selects[0].setValue('at_field'); selects = w.findAllComponents(Select)
  await selects[1].setValue('due'); await selects[2].setValue('priority')
  await w.get('textarea').setValue('{"urgent":"PT1H"}')
  await w.findAllComponents(Select).at(-1)!.setValue('transition')
  const effect = w.findAll('input').find(input => input.element.closest('label')?.textContent?.startsWith('Transition ID'))!
  await effect.setValue('finish')
  expect(state.timers![0]).toMatchObject({ at_field: 'due', by: 'priority', table: { urgent: 'PT1H' }, then: { transition: 'finish' } })
  expect(state.timers![0].after).toBeUndefined()
  const repeat = w.findAllComponents(DurationControl).find(c => c.props('label') === 'Repeat every')!.getComponent(InputNumber)
  await repeat.setValue(1); await w.get('[type=checkbox]').setValue(true)
  expect(state.timers![0].repeat).toBeUndefined(); expect(repeat.props('disabled')).toBe(true)
  await button(w, 'Remove timer').trigger('click'); expect(state.timers).toEqual([]); w.unmount()
})
it('allocates an unused timer identifier when existing identifiers contain a gap', async () => {
  const state = reactive<State>({ id: 'active', category: 'started', timers: [{ id: 'timer_1', after: 'PT1H', then: { emit: 'one' } }, { id: 'timer_3', after: 'PT1H', then: { emit: 'three' } }] })
  const w = mount(TimersEditor, { props: { state, draft: {} } })
  await button(w, 'Add timer').trigger('click'); expect(state.timers!.map(timer => timer.id)).toEqual(['timer_1', 'timer_3', 'timer_2']); w.unmount()
})

it('allows multiple approvals from a group in a principal source list', async () => {
  const approvals = reactive({ min: 2, from: [{ kind: 'group', id: 'reviewers' }], prevent_self: true })
  const w = mount(ApproversEditor, { props: { approvals } }); await flushPromises()
  expect(w.emitted('validity')?.at(-1)).toEqual([true])
  expect(w.find('[role=alert]').exists()).toBe(false)
  w.unmount()
})

it('preserves field approvers and edits their field source without a principal picker', async () => {
  const approvals = reactive({ min: 2, from: { field: 'reviewers' } } as NonNullable<NonNullable<State['release_when']>['approvals']>)
  const w = mount(ApproversEditor, { props: { approvals } }); await flushPromises()
  expect(w.emitted('validity')?.at(-1)).toEqual([true])
  expect(w.find('wc-principal-picker').exists()).toBe(false)
  expect(w.get<HTMLInputElement>('[aria-label="Principal field"]').element.value).toBe('reviewers')
  await w.get('[aria-label="Principal field"]').setValue('owner')
  expect(approvals.from).toEqual({ field: 'owner' })
  await w.get('[aria-label="Principal field"]').setValue('')
  expect(w.emitted('validity')?.at(-1)).toEqual([false])
  w.unmount()
})

it('clears duration validity after removing an earlier timer and then the invalid timer', async () => {
  const state = reactive<State>({ id: 'active', category: 'started', timers: [{ id: 'one', after: 'PT1H' }, { id: 'two', after: 'PT1H' }] })
  const invalid = new Set<string>()
  const w = mount(TimersEditor, { props: { state, draft: {}, onValidity: (key: string, valid: boolean) => { if (valid) invalid.delete(key); else invalid.add(key) } } })
  await w.findAllComponents(DurationControl)[2].getComponent(InputNumber).setValue(0)
  expect(invalid.size).toBe(1)
  await w.findAll('[aria-label="Remove timer"]')[0].trigger('click')
  expect(invalid.size).toBe(1)
  await w.findAll('[aria-label="Remove timer"]')[0].trigger('click')
  expect(invalid.size).toBe(0); w.unmount()
})
