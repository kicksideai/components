// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive, type Component } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import ToggleSwitch from 'primevue/toggleswitch'
import StateSettings from './StateSettings.vue'
import ProcessEditor from './ProcessEditor.vue'
import FieldsEditor from './FieldsEditor.vue'
import TypesEditor from './TypesEditor.vue'
import RelationsEditor from './RelationsEditor.vue'
import { schema } from '../../test/fixtures'
import type { Declaration } from '../../types'
const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => wrappers.splice(0).forEach(w => w.unmount()))
it('shows live occupancy beside the editable state limit and clears the limit', async () => {
  const draft = reactive(schema().declaration)
  const itemType = draft.item_types![0]
  const w = mount(ProcessEditor, { props: { draft, countTypes: draft.item_types, counts: { [itemType.id]: { todo: 2 } } } }); wrappers.push(w)
  await w.get('[aria-label="Edit state To do"]').trigger('click')
  expect(w.get('aside').text()).toContain('2 items currently here')
  const limit = w.findAllComponents(InputNumber).find(control => control.props('ariaLabel') === 'Items allowed here')!
  await limit.setValue(4)
  await w.get('[aria-label="Refuse moves over the limit"]').setValue(true)
  expect(draft.policy!.wip!.todo).toEqual({ limit: 4, hard: true })
  await limit.setValue(null)
  expect(draft.policy!.wip!.todo).toBeUndefined()
})
it('selects states and transitions without altering the declaration, in the settings editor', async () => {
  const draft = reactive(schema().declaration)
  const w = mount(ProcessEditor, { props: { draft } }); wrappers.push(w)
  const before = JSON.stringify(draft)
  await w.get('.work-graph-node').trigger('click')
  expect(w.find('.work-process-sideform').exists()).toBe(true)
  expect(JSON.stringify(draft)).toBe(before)
  await w.get('.work-graph-edge').trigger('click')
  expect(JSON.stringify(draft)).toBe(before)
})
it('creates a named process through a small dialog', async () => {
  const draft = reactive(schema().declaration)
  const w = mount(ProcessEditor, { props: { draft } }); wrappers.push(w)
  await w.get('[aria-label="New process"]').trigger('click')
  await w.get('input[aria-label="New process name"]').setValue('Editorial review')
  await w.get('form[aria-label="New process"]').trigger('submit')
  expect(draft.processes?.at(-1)).toMatchObject({ name: 'Editorial review', id: 'editorial_review' })
})
it('groups history switches and uses structured access controls without default JSON', async () => {
  const draft = reactive(schema().declaration)
  const w = mount(FieldsEditor, { props: { draft } }); wrappers.push(w)
  await w.get('.work-definition-toggle').trigger('click')
  const body = w.get('.work-definition-body')
  expect(body.get('.work-field-history').findAllComponents(ToggleSwitch)).toHaveLength(2)
  expect(body.text()).toContain('Who can read')
  expect(body.text()).toContain('Who can edit')
  expect(body.text()).not.toContain('Declared type')
  expect(body.findAllComponents(Select)).toHaveLength(3)
  expect(body.findAll('textarea').filter(t => !t.element.closest('.kx-disclosure'))).toHaveLength(0)
})
it.each<[Component, Declaration]>([
  [TypesEditor, { item_types: [{ id: 'task', fields: [], process: 'flow' }] }],
  [RelationsEditor, { relation_types: [{ id: 'related', cardinality: 'many' }] }],
])('keeps definitions and the add row in one bordered list', (component, declaration) => {
  const w = mount(component, { props: { draft: structuredClone(declaration) } }); wrappers.push(w)
  const list = w.get('.work-field-builder')
  expect(list.findAll('.work-definition')).toHaveLength(1)
  expect(list.element.lastElementChild?.classList.contains('work-add-definition')).toBe(true)
})
it('shows process labels and relation defaults without changing the declarations', () => {
  const draft = schema().declaration
  draft.processes![0].name = undefined
  draft.relation_types = [{ id: 'related' }]
  const before = JSON.stringify(draft)
  const types = mount(TypesEditor, { props: { draft } }); wrappers.push(types)
  const relations = mount(RelationsEditor, { props: { draft } }); wrappers.push(relations)
  expect(types.get('.work-definition-kind-label').text()).toBe('Workflow:')
  expect(types.get('.work-definition-kind-value').text()).toBe('Delivery')
  expect(relations.getComponent(Select).props('modelValue')).toBe('many')
  expect(JSON.stringify(draft)).toBe(before)
})
it('gives every process toolbar control a visible meaning or tooltip and groups zoom actions', () => {
  const w = mount(ProcessEditor, { props: { draft: schema().declaration } }); wrappers.push(w)
  const controls = w.get('.work-process-controls')
  for (const button of controls.findAll('button')) {
    if (!button.text().trim()) { expect(button.attributes('aria-label')).toBeTruthy(); expect(button.attributes('title')).toBeTruthy() }
  }
  expect(w.get('[aria-label="Map zoom"]').findAll('button').map(b => b.text() || b.attributes('aria-label'))).toEqual(['Fit', 'Zoom out', 'Zoom in'])
})

it('allows a zero capacity from the state inspector input', async () => {
  const draft = reactive(schema().declaration), process = draft.processes![0]
  const w = mount(StateSettings, { props: { draft, process, state: process.states[0] } }); wrappers.push(w)
  const input = w.get('input[aria-label="Items allowed here"]')
  await input.setValue('0'); await input.trigger('blur')
  expect(draft.policy?.wip?.todo?.limit).toBe(0)
})
