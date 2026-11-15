// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import Select from 'primevue/select'
import ToggleSwitch from 'primevue/toggleswitch'
import ProcessEditor from './ProcessEditor.vue'
import StateSettings from './StateSettings.vue'
import TransitionSettings from './TransitionSettings.vue'
import ConditionEditor from './ConditionEditor.vue'
import FilterNode from '../query/FilterNode.vue'
import type { Declaration, Process } from '../../types'
it('adds a manual state without declaring an invalid automatic default', async () => {
  const draft = reactive<Declaration>({ processes: [{ id: 'flow', initial: 'ready', states: [{ id: 'ready', name: 'Ready', category: 'unstarted' }], transitions: [] }] })
  const w = mount(ProcessEditor, { props: { draft, advanced: false } })
  await w.findAll('button').find(b => b.text() === 'Add state')!.trigger('click')
  expect(draft.processes![0].transitions).toHaveLength(1)
  expect(draft.processes![0].transitions![0].default).not.toBe(true)
  w.unmount()
})
it('clears a condition validity failure when the condition is disabled', async () => {
  const w = mount(ConditionEditor, { props: { draft: {}, label: 'Release', modelValue: { field: 'state', op: 'eq', value: 'ready' } } })
  w.getComponent(FilterNode).vm.$emit('validity', false)
  await w.getComponent(ToggleSwitch).setValue(false)
  expect(w.emitted('validity')?.at(-1)).toEqual([true])
  w.unmount()
})
it('exposes each automation outcome route through a labeled platform select', async () => {
  const process = reactive<Process>({ id: 'flow', initial: 'build', states: [{ id: 'build', category: 'started', kind: 'automated', run: { stage: 'build' } }, { id: 'done', category: 'completed' }], transitions: [{ id: 'finish', name: 'Finish', from: ['build'], to: 'done' }] })
  const w = mount(StateSettings, { props: { state: process.states[0], process, draft: { processes: [process] }, advanced: true } })
  for (const label of ['On success', 'On cancellation']) {
    const control = w.findAllComponents(Select).find(c => c.props('ariaLabel') === label)
    expect(control, label).toBeDefined()
    await control!.setValue('finish')
  }
  expect(process.states[0].run).toMatchObject({ on_pass: 'finish', on_cancel: 'finish' })
  w.unmount()
})
it('exposes transition people visibility and evaluation order without changing the draft on mount', async () => {
  const process = reactive<Process>({ id: 'flow', initial: 'ready', states: [{ id: 'ready', category: 'unstarted' }], transitions: [{ id: 'retry', from: ['ready'], to: 'ready' }] })
  const transition = process.transitions![0], before = JSON.stringify(transition)
  const w = mount(TransitionSettings, { props: { transition, process, draft: {}, advanced: true } })
  expect(JSON.stringify(transition)).toBe(before)
  const people = w.findAllComponents(Select).find(c => c.props('ariaLabel') === 'Offer to people')
  expect(people).toBeDefined(); await people!.setValue(false)
  expect(transition).toHaveProperty('people', false)
  const order = w.find('[aria-label="Transition order"]')
  expect(order.exists()).toBe(true)
  w.unmount()
})
it('offers all formula result forms and all Work option categories', async () => {
  const { default: FieldsEditor } = await import('./FieldsEditor.vue')
  const draft = reactive<Declaration>({ fields: [{ code: 'derived', type: 'formula', form: 'int', expression: '1' }, { code: 'status', type: 'option', form: 'text', options: [{ id: 'ready' }] }] })
  const w = mount(FieldsEditor, { props: { draft, advanced: true } })
  const result = w.findAllComponents(Select).find(c => c.props('ariaLabel') === 'Result form')
  expect(result).toBeDefined(); await result!.setValue('text')
  expect(draft.fields![0].form).toBe('text')
  const category = w.findAllComponents(Select).find(c => c.props('ariaLabel') === 'Option category')
  expect(category).toBeDefined(); await category!.setValue('backlog')
  expect(draft.fields![1].options![0].category).toBe('backlog')
  w.unmount()
})
it('retains backend predicate forms and combines validity from both condition editors', async () => {
  const { default: JsonInput } = await import('./JsonInput.vue')
  const w = mount(ConditionEditor, { props: { draft: {}, label: 'Release', modelValue: { awaiting: true } } })
  const raw = w.findComponent(JsonInput)
  expect(raw.exists()).toBe(true)
  raw.vm.$emit('validity', false); w.getComponent(FilterNode).vm.$emit('validity', true)
  expect(w.emitted('validity')?.at(-1)).toEqual([false])
  raw.vm.$emit('update:modelValue', { awaiting: true })
  expect(w.emitted('update:modelValue')?.at(-1)).toEqual([{ awaiting: true }])
  await w.getComponent(ToggleSwitch).setValue(false)
  expect(w.emitted('validity')?.at(-1)).toEqual([true]); w.unmount()
})
