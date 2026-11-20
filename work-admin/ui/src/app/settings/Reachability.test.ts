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
  const w = mount(ProcessEditor, { props: { draft } })
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
  const w = mount(StateSettings, { props: { state: process.states[0], process, draft: { processes: [process] } } })
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
  const w = mount(TransitionSettings, { props: { transition, process, draft: {} } })
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
  const w = mount(FieldsEditor, { props: { draft } })
  const result = w.findAllComponents(Select).find(c => c.props('ariaLabel') === 'Result type')
  expect(result).toBeDefined(); await result!.setValue('text')
  expect(draft.fields![0].form).toBe('text')
  const category = w.findAllComponents(Select).find(c => c.props('ariaLabel') === 'Option category')
  expect(category).toBeDefined(); await category!.setValue('backlog')
  expect(draft.fields![1].options![0].category).toBe('backlog')
  w.unmount()
})
it('uses the custom type’s form, index choices and configuration for a new field', async () => {
  const { default: FieldsEditor } = await import('./FieldsEditor.vue')
  const draft = reactive<Declaration>({})
  const installedTypes = [{ id: 'app:score_type', title: 'Score', form: 'int' as const, indexes: ['number'], config_schema: {
    type: 'object', required: ['limit'], properties: { limit: { type: 'integer', title: 'Score limit', minimum: 1 } },
  } }]
  const w = mount(FieldsEditor, { props: { draft, installedTypes } })
  try {
    await w.get('.work-add-definition input').setValue('score')
    await w.get('.work-add-definition button').trigger('click')
    await w.get('.work-definition-toggle').trigger('click')
    const control = (label: string) => w.findAll('label').find(item => item.text().startsWith(label))!.getComponent(Select)
    await control('Search support').setValue('key')
    const kind = control('Kind')
    expect(kind.props('options')).toContainEqual({ value: 'app:score_type', label: 'Score' })
    expect(w.get('[aria-label="Kind"]').attributes('role')).toBe('combobox')
    expect(w.text()).not.toContain('Custom field type')
    await kind.setValue('app:score_type')
    expect(draft.fields![0]).toMatchObject({ type: 'app:score_type', form: 'int' })
    expect(draft.fields![0].index ?? 'none').toBe('none')
    const index = control('Search support')
    expect(index.props('options')?.map(option => option.value)).toEqual(['none', 'number'])
    await index.setValue('number')
    expect(w.emitted('validity')?.at(-1)).toEqual(['config-0', false])
    const limit = w.get('input[aria-label="Score limit"]')
    await limit.setValue('5')
    await limit.trigger('blur')
    expect(draft.fields![0]).toMatchObject({ index: 'number', config: { limit: 5 } })
    expect(w.emitted('validity')?.at(-1)).toEqual(['config-0', true])
    await kind.setValue('text')
    expect(draft.fields![0]).toMatchObject({ form: 'text' })
    expect(draft.fields![0]).not.toHaveProperty('type')
    expect(draft.fields![0]).not.toHaveProperty('config')
    expect(draft.fields![0]).not.toHaveProperty('index')
  } finally {
    w.unmount()
  }
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
