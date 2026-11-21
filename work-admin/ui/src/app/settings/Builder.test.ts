// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { getButton as button } from '../../test/controls'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { reactive } from 'vue'
import FieldsEditor from './FieldsEditor.vue'
import TypesEditor from './TypesEditor.vue'
import RelationsEditor from './RelationsEditor.vue'
import GeneralSettings from './GeneralSettings.vue'
import { schema } from '../../test/fixtures'
import OptionsEditor from './OptionsEditor.vue'
import ProcessEditor from './ProcessEditor.vue'
import StateSettings from './StateSettings.vue'
import ProcessGraph from './ProcessGraph.vue'
import ChipPicker from './ChipPicker.vue'
import { stateUses, transitionUses, uniqueId } from './process'
import type { Declaration, Process } from '../../types'
const flow = (): Process => ({ id: 'flow', initial: 'open', states: [{ id: 'open', name: 'Open', category: 'unstarted' }, { id: 'active', name: 'Active', category: 'started' }, { id: 'done', name: 'Done', category: 'completed' }], transitions: [{ id: 'start', name: 'Start', from: ['open'], to: 'active' }] })
it('lists field users and retains a field when Work refuses its removal', async () => {
  const draft = reactive<Declaration>({ fields: [{ id: 1, code: 'title', form: 'text' }], item_types: [{ id: 'task', title: 'Task', process: 'flow', fields: ['title'] }] })
  const guardRemoval = vi.fn().mockResolvedValue('Items still hold values in this field.')
  const w = mount(FieldsEditor, { props: { draft, guardRemoval } })
  expect(w.get('.work-definition-usage').text()).toContain('Task')
  await button(w, 'Remove field').trigger('click'); await flushPromises()
  expect(guardRemoval).toHaveBeenCalledWith('fields', 'title'); expect(draft.fields).toHaveLength(1)
  expect(w.get('[role=alert]').text()).toContain('Items still hold values')
  guardRemoval.mockResolvedValue(undefined); await button(w, 'Remove field').trigger('click'); await flushPromises()
  expect(draft.fields).toEqual([]); expect(draft.item_types![0].fields).toEqual([]); w.unmount()
})
it('keeps inherited fields within carried fields and explains parent type removal guards', async () => {
  const draft = reactive<Declaration>({ fields: [{ code: 'title', form: 'text' }], processes: [flow()], item_types: [{ id: 'task', process: 'flow', fields: ['title'], inherit: ['title'] }, { id: 'child', process: 'flow', fields: [], parent_types: ['task'] }] })
  const guardRemoval = vi.fn().mockResolvedValue('Items still use this item type.')
  const w = mount(TypesEditor, { props: { draft, guardRemoval } })
  await w.findAllComponents(ChipPicker)[0].get('button').trigger('click'); expect(draft.item_types![0].inherit).toEqual([])
  await button(w.findAll('.work-definition')[0], 'Remove type').trigger('click'); await flushPromises()
  expect(w.get('[role=alert]').text()).toContain('parent type for Child'); expect(guardRemoval).not.toHaveBeenCalled()
  draft.item_types![1].parent_types = []
  await button(w.findAll('.work-definition')[0], 'Remove type').trigger('click'); await flushPromises()
  expect(w.get('[role=alert]').text()).toContain('Items still use'); expect(draft.item_types).toHaveLength(2); w.unmount()
})
it('creates types with humanized titles and carries parent references across ID edits', async () => {
  const draft = reactive<Declaration>({ processes: [flow()], item_types: [] })
  const w = mount(TypesEditor, { props: { draft } })
  await w.get('input').setValue('Delivery task'); await button(w, 'Add type').trigger('click')
  expect(draft.item_types![0]).toMatchObject({ id: 'delivery_task', title: 'Delivery task', process: 'flow' })
  draft.item_types!.push({ id: 'child', fields: [], process: 'flow', parent_types: ['delivery_task'] }); await flushPromises()
  await w.get('article .kx-disclosure input').setValue('parent_task')
  expect(draft.item_types![1].parent_types).toEqual(['parent_task']); w.unmount()
})
it('edits option identity, labels and token colors, with keyboard reordering and removal', async () => {
  const field = reactive({ code: 'priority', type: 'option', form: 'text' as const, options: [{ id: 'normal', label: 'Normal', order: 0, color: 'primary' }] })
  const w = mount(OptionsEditor, { props: { field } })
  await button(w, 'Add option').trigger('click')
  const row = w.findAll('.work-option-row')[1]
  await row.get('[aria-label="Option ID"]').setValue('urgent'); await row.get('[aria-label="Option label"]').setValue('Urgent'); await row.getComponent(Select).setValue('danger')
  await row.get('.work-reorder-handle').trigger('keydown', { key: 'ArrowUp' })
  expect(field.options[0]).toEqual({ id: 'urgent', label: 'Urgent', color: 'danger', order: 0 }); expect(field.options[1].order).toBe(1)
  expect(w.get('.work-color-swatch').classes()).toContain('work-swatch-danger')
  await w.findAll('[aria-label="Remove option"]')[1].trigger('click'); expect(field.options).toHaveLength(1); w.unmount()
})
it('guards relation removal and previews directional and symmetric labels', async () => {
  const draft = reactive<Declaration>({ relation_types: [{ id: 'blocks', outward: 'blocks', inward: 'is blocked by' }] })
  const w = mount(RelationsEditor, { props: { draft, guardRemoval: vi.fn().mockResolvedValue('Links still use this relation type.') } })
  expect(w.get('.work-relation-preview').text()).toContain('is blocked by')
  await w.get('[aria-label="Same meaning in both directions"]').setValue(true); expect(w.get('.work-relation-preview').text()).not.toContain('is blocked by')
  await button(w, 'Remove link type').trigger('click'); await flushPromises()
  expect(w.get('[role=alert]').text()).toContain('Links still use'); expect(draft.relation_types).toHaveLength(1); w.unmount()
})
it('clears a stored board override and a limit on a removed state in their own sections', async () => {
  const draft = reactive<Declaration>({ processes: [flow()], policy: { audit_days: 30, wip: { removed: { limit: 1 } } } })
  const workflow = mount(ProcessEditor, { props: { draft } })
  await button(workflow, 'Clear limit for removed state 1').trigger('click')
  expect(draft.policy!.wip!.removed).toBeUndefined()
  workflow.unmount()
  const general = mount(GeneralSettings, { props: { draft, schema: schema(), active: false, draftForm: 'draft', disabled: false, canUpgrade: false, canInstall: false } })
  await button(general, 'Use default for change history retention').trigger('click')
  expect(draft.policy!.audit_days).toBeUndefined()
  general.unmount()
})
it('renders node categories, labeled edges and capacity, and selects nodes and edges', async () => {
  const process = flow()
  const w = mount(ProcessGraph, { props: { process, draft: { policy: { wip: { active: { limit: 4, hard: true } } } } } })
  expect(w.findAll('.work-graph-node').map(n => n.classes().find(c => c.startsWith('work-stop-')))).toEqual(process.states.map(s => 'work-stop-' + s.category))
  expect(w.text()).toContain('limit 4'); expect(w.get('.work-edge-label').text()).toBe('Start')
  await w.get('.work-graph-node').trigger('keydown', { key: 'Enter' }); expect(w.emitted('state')?.[0]).toEqual([process.states[0], w.get('.work-graph-node').element])
  await w.get('.work-graph-edge').trigger('click'); expect(w.emitted('transition')?.[0]).toEqual([process.transitions![0], w.get('.work-graph-edge').element])
  await w.get('[aria-label="Connect from Open"]').trigger('pointerdown', { pointerId: 1 })
  await w.findAll('.work-graph-node')[1].trigger('pointerup', { pointerId: 1 }); expect(w.emitted('connect')).toEqual([['open', 'active', w.findAll('.work-graph-node')[1].element]]); w.unmount()
})
it('supports keyboard connection and Escape cancellation', async () => {
  const w = mount(ProcessGraph, { props: { process: flow(), draft: {} } })
  await w.get('[aria-label="Connect from Open"]').trigger('keydown', { key: 'Enter' })
  await w.findAll('.work-graph-node')[2].trigger('keydown', { key: 'Enter' }); expect(w.emitted('connect')).toEqual([['open', 'done', w.findAll('.work-graph-node')[2].element]])
  await w.get('[aria-label="Connect from Open"]').trigger('keydown', { key: 'Enter' })
  await w.get('.work-process-canvas').trigger('keydown', { key: 'Escape' }); await w.findAll('.work-graph-node')[2].trigger('pointerup')
  expect(w.emitted('connect')).toHaveLength(1); w.unmount()
})
it('opens side forms, adds unique graph transitions, and guards the initial state', async () => {
  const draft = reactive<Declaration>({ processes: [flow()] })
  const w = mount(ProcessEditor, { props: { draft } })
  await w.get('.work-graph-node').trigger('click'); expect(w.get('.work-process-sideform').attributes('aria-label')).toBe('State inspector')
  expect(w.findAllComponents(StateSettings)).toHaveLength(1)
  await w.get('.work-graph-node').trigger('click')
  expect(w.findAllComponents(StateSettings)).toHaveLength(1)
  expect(w.getComponent(StateSettings).props('state')).toBe(draft.processes![0].states[0])
  await w.get('.work-graph-edge').trigger('click'); expect(w.get('.work-process-sideform').attributes('aria-label')).toBe('Transition inspector')
  const graph = w.getComponent(ProcessGraph)
  graph.vm.$emit('connect', 'open', 'done'); graph.vm.$emit('connect', 'active', 'done'); await flushPromises()
  expect(draft.processes![0].transitions!.map(t => t.id)).toEqual(['start', 'to_done', 'to_done_2'])
  expect(draft.processes![0].transitions![2]).toMatchObject({ from: ['active'], to: 'done' })
  await w.get('.work-graph-node').trigger('click')
  await button(w, 'Remove state').trigger('click'); expect(w.get('[role=alert]').text()).toContain('initial state')
  expect(draft.processes![0].states).toHaveLength(3); w.unmount()
})
it('identifies dependent regions and timers while display names preserve stable identities', () => {
  const process = flow(), state = process.states[1], transition = process.transitions![0]
  process.states[0].timers = [{ id: 'deadline', then: { transition: 'start' } }]; state.run = { stage: 'build', on_fail: 'start' }
  process.states[2].regions = [{ id: 'region', initial: 'active' }]
  state.name = 'Working'; transition.name = 'Begin'
  expect(stateUses(process, state)).toContain('lanes in Done'); expect(transitionUses(process, transition)).toEqual(['a timer', 'failure handler in Working'])
  expect(state.id).toBe('active'); expect(transition.id).toBe('start')
  expect(transition.to).toBe('active'); expect(process.states[2].regions[0].initial).toBe('active')
  expect(state.run.on_fail).toBe('start'); expect(process.states[0].timers![0].then!.transition).toBe('start')
  expect(uniqueId('timer', [{ id: 'timer_1' }, { id: 'timer_3' }])).toBe('timer_2')
})
it('restores drag DOM before updating field order inside a shadow root and disposes sorting', async () => {
  const { default: Sortable } = await import('sortablejs')
  const host = document.createElement('div'); document.body.append(host)
  const root = host.attachShadow({ mode: 'open' }), target = document.createElement('div'); root.append(target)
  const draft = reactive<Declaration>({ fields: [{ code: 'title', form: 'text' }, { code: 'priority', form: 'text' }], item_types: [{ id: 'task', fields: ['title', 'priority'], process: 'flow' }] })
  const w = mount(FieldsEditor, { attachTo: target, props: { draft } })
  const list = w.get<HTMLElement>('.work-field-builder').element, sortable = Sortable.get(list)!
  expect(sortable.option('forceFallback')).toBe(true); expect(sortable.option('fallbackOnBody')).toBe(false)
  const destroy = vi.spyOn(sortable, 'destroy'), item = list.children[0] as HTMLElement
  list.append(item)
  sortable.option('onEnd')?.(Object.assign(new Event('end'), { item, from: list, to: list, oldDraggableIndex: 0, newDraggableIndex: 1 }) as import('sortablejs').SortableEvent)
  await flushPromises()
  expect(draft.fields!.map(f => f.code)).toEqual(['priority', 'title'])
  expect(draft.item_types![0].fields).toEqual(['priority', 'title'])
  expect(w.findAll('.work-field-row').map(row => row.get<HTMLInputElement>('input[aria-label="Field code"]').element.value)).toEqual(['priority', 'title'])
  w.unmount(); expect(destroy).toHaveBeenCalledTimes(1); host.remove()
})
it('edits field titles, cardinality, indexing, tracking and field access', async () => {
  const draft = reactive<Declaration>({ fields: [{ code: 'points', form: 'int' }] })
  const w = mount(FieldsEditor, { props: { draft } })
  await w.get('[aria-label="Field title"]').setValue('Estimate')
  await w.findAllComponents(Select).find(control => control.props('ariaLabel') === 'Values allowed')!.setValue('set')
  await w.findAllComponents(Select).find(control => control.props('ariaLabel') === 'Allow filters to use')!.setValue('number')
  await w.findAll('[type=checkbox]')[0].setValue(true); await w.findAll('[type=checkbox]')[1].setValue(true)
  expect(draft.fields![0]).toMatchObject({ title: 'Estimate', cardinality: 'set', index: 'number', track: true, intervals: true })
  expect(w.find('[aria-label="Who can read"]').exists()).toBe(true); await flushPromises()
  const access = w.get('[aria-label="Who can read"] wc-principal-picker')
  await access.trigger('config-changed', { detail: { id: 'team', type: 'group', label: 'Delivery team' } })
  expect(draft.fields![0].access).toEqual({ read: [{ group: 'team' }] }); w.unmount()
})

it.each(['on_pass', 'on_fail', 'on_cancel', 'on_exhausted'] as const)('protects a transition used by an automation %s route', route => {
  const process = flow(), transition = process.transitions![0]
  process.states[0].run = { stage: 'build', [route]: transition.id }
  expect(transitionUses(process, transition)).toHaveLength(1)
})
