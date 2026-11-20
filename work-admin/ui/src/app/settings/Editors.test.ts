// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { getButton as button } from '../../test/controls'
import InputNumber from 'primevue/inputnumber'
import { selectControl } from '../../test/controls'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import { expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { reactive } from 'vue'
import FieldsEditor from './FieldsEditor.vue'
import ConfigForm from './ConfigForm.vue'
import StateSettings from './StateSettings.vue'
import DurationControl from './DurationControl.vue'
import PolicyEditor from './PolicyEditor.vue'
import ProcessEditor from './ProcessEditor.vue'
import PluginsEditor from './PluginsEditor.vue'
import { requestDeclaration } from './model'
import { settings } from './api'
import { schema } from '../../test/fixtures'
import type { Declaration, Process } from '../../types'
vi.mock('../../api', () => ({ work: { schema: vi.fn() } }))
vi.mock('./api', () => ({ settings: { configure: vi.fn() } }))
it('keeps Work field kinds canonical and persists display reordering in item types', async () => {
  const draft = reactive<Declaration>({ fields: [{ id: 1, code: 'title', form: 'text' }, { id: 2, code: 'priority', type: 'option', form: 'text', options: [{ id: 'low', order: 0 }, { id: 'high', order: 1 }] }], item_types: [{ id: 'task', fields: ['title', 'priority'], process: 'flow' }] })
  const w = mount(FieldsEditor, { props: { draft } })
  await w.findAll('article')[0].findAllComponents(Select)[0].setValue('principal')
  expect(draft.fields![0]).toMatchObject({ type: 'principal', form: 'ref' })
  await w.get('[aria-label="Move Title later"]').trigger('click')
  expect(draft.item_types![0].fields).toEqual(['priority', 'title'])
  expect(draft.fields![0].code).toBe('priority')
  await w.get('button[aria-label="Option later"]').trigger('click')
  expect(draft.fields![0].options?.map(o => [o.id, o.order])).toEqual([['high', 0], ['low', 1]])
  w.unmount()
})
it('uses the installed form in the draft and lets Work derive it when submitted', async () => {
  const draft = reactive<Declaration>({ fields: [{ code: 'quantity', form: 'text', cardinality: 'one' }] })
  const iron = { id: 'app:integer_field', title: 'Whole units', form: 'int' } as const
  const w = mount(FieldsEditor, { props: { draft, installedTypes: [iron] } })
  await selectControl(w, 'Kind').setValue(iron.id)
  expect(draft.fields?.[0].form).toBe(iron.form)
  expect(requestDeclaration(draft, {}).fields).toEqual([{ code: 'quantity', type: iron.id, cardinality: 'one' }])
  w.unmount()
})
it.each([
  {
    form: 'ref',
    properties: { target: { type: 'string', title: 'Reference target' } },
    config: { target: 'app:record' },
  },
  {
    form: 'quantity',
    properties: { canonical: { type: 'string', title: 'Canonical unit' }, units: { type: 'object' } },
    config: { canonical: 'kg', units: { kg: '1' } },
  },
] as const)('edits configuration for a newly selected installed $form field', async ({ form, properties, config }) => {
  const draft = reactive<Declaration>({ fields: [{ code: 'custom', form: 'text', cardinality: 'one' }] })
  const type = { id: 'app:custom_field', title: 'Custom', form, config_schema: {
    type: 'object', properties, required: Object.keys(properties),
  } }
  const w = mount(FieldsEditor, { props: { draft, installedTypes: [type] } })
  await selectControl(w, 'Kind').setValue(type.id)
  await w.get('input[aria-label="' + (form === 'ref' ? 'Reference target' : 'Canonical unit') + '"]').setValue(
    form === 'ref' ? config.target : config.canonical,
  )
  if (form === 'quantity') await w.get('textarea[aria-label="Units"]').setValue(JSON.stringify(config.units))
  expect(w.getComponent(ConfigForm).props('schema')).toEqual(type.config_schema)
  expect(requestDeclaration(draft, {}).fields).toEqual([{ code: 'custom', type: type.id, cardinality: 'one', config }])
  w.unmount()
})
it('uses the installed form for a legacy field without a stored form or configuration schema', async () => {
  const draft = reactive<Declaration>({ fields: [{ code: 'custom', type: 'app:reference' }] })
  const type = { id: 'app:reference', title: 'Custom reference', form: 'ref' } as const
  const w = mount(FieldsEditor, { props: { draft, installedTypes: [type] } })
  await w.get('textarea[aria-label="Field configuration"]').setValue('{"target":"app:record"}')
  expect(requestDeclaration(draft, {}).fields).toEqual([{ code: 'custom', type: type.id, config: { target: 'app:record' } }])
  w.unmount()
})
it('edits per-kind stage, approval, parallel and timer settings in their process section', async () => {
  const process = reactive<Process>({ id: 'flow', initial: 'review', states: [{ id: 'review', category: 'started' }, { id: 'done', category: 'completed' }] })
  const state = process.states[0], draft: Declaration = { fields: [{ code: 'due', form: 'time' }], processes: [process] }
  const w = mount(StateSettings, { props: { state, process, draft } })
  expect(w.find('option[value=gate]').exists()).toBe(false)
  await w.getComponent(SelectButton).setValue('gate')
  expect(state.release_when?.approvals).toMatchObject({ min: 1, prevent_self: true })
  expect(state.run).toBeUndefined()
  await w.getComponent(SelectButton).setValue('automated')
  await w.get('input[aria-label="Run label"]').setValue('build')
  expect(state.run).toEqual({ stage: 'build', retry: { max: 1, backoff: 'PT1M' } })
  expect(state.release_when).toBeUndefined()
  await w.getComponent(SelectButton).setValue('parallel')
  expect(state.regions?.[0].initial).toBe('done'); expect(state.join).toBe('all'); expect(state.run).toBeUndefined()
  await button(w, 'Add timer').trigger('click')
  expect(state.timers?.[0]).toEqual({ id: 'timer_1', after: 'P1D', then: { emit: 'reminder' } })
  const interrupt = w.findAll('input[type=checkbox]').find(i => i.element.closest('label')?.textContent?.includes('Interrupting'))!
  state.timers![0].repeat = 'PT1H'; await interrupt.setValue(true)
  expect(state.timers![0].repeat).toBeUndefined(); w.unmount()
})
it('edits transition source, target, auto, default and effect values through the selected transition form', async () => {
  const draft = reactive(schema().declaration)
  const w = mount(ProcessEditor, { props: { draft } })
  await w.get('.work-graph-edge').trigger('click')
  expect(w.findAll('.work-process-sideform')).toHaveLength(1)
  await w.get('input[aria-label="Automatic transition"]').setValue(true)
  await w.get('input[aria-label="Default transition"]').setValue(true)
  await selectControl(w, 'To state').setValue('done')
  const value = draft.processes![0].transitions![0]
  expect(value).toMatchObject({ auto: true, default: true, to: 'done' })
  const effect = w.findAll('textarea').find(input => input.element.closest('label')?.textContent?.includes('Set values'))!
  await effect.setValue('[{"field":"title","value":"Ready"}]')
  expect(value.set).toEqual([{ field: 'title', value: 'Ready' }])
  await w.get('.work-graph-edge').trigger('click')
  expect(w.findAll('.work-process-sideform')).toHaveLength(1)
  expect(w.get<HTMLInputElement>('input[aria-label="Automatic transition"]').element.checked).toBe(true)
  expect(w.findAll('textarea').find(input => input.element.closest('label')?.textContent?.includes('Set values'))!.element.value).toContain('Ready')
  await w.get('.work-graph-node').trigger('click')
  expect(w.findAllComponents(StateSettings)).toHaveLength(1)
  expect(w.findAll('input[aria-label="Automatic transition"]')).toHaveLength(0)
  await button(w, 'Close state editor').trigger('click')
  expect(w.findAllComponents(StateSettings)).toHaveLength(0)
  w.unmount()
})
it('activates declarations in the draft and configures an active plugin through Work', async () => {
  const view = schema(); view.plugins = [{ plugin: 'app:plugin', installed: true, active: true, requires: [], tools: [], lifecycle: { state: 'ready' }, projections: {}, config: { threshold: 1 } }]
  view.declaration.plugins = [{ use: 'app:plugin' }]
  const draft = reactive(view.declaration), configs = reactive({})
  vi.mocked(settings.configure).mockResolvedValue({ attachment_id: 'attachment' })
  const w = mount(PluginsEditor, { props: { boardId: 'b', draft, schema: view, options: [{ plugin: 'app:plugin', installed: true, active: false, requires: [], tools: [], lifecycle: { state: 'ready' as const }, projections: {}, title: 'Enhancement', config_schema: { type: 'object', properties: { threshold: { type: 'integer' } } } }], configs } })
  await flushPromises()
  await w.getComponent(InputNumber).setValue(3)
  await button(w, 'Save configuration').trigger('click'); await flushPromises()
  expect(settings.configure).toHaveBeenCalledWith('b', 'app:plugin', { threshold: 3 })
  await w.get('input[type=checkbox]').setValue(false)
  expect(draft.plugins).toEqual([]); expect(configs).toEqual({}); w.unmount()
})

it('shows host lifecycle and per-kind projection progress', async () => {
  const view = schema()
  view.declaration.plugins = [{ use: 'app:plugin' }]
  view.plugins = [{ plugin: 'app:plugin', installed: true, active: true, requires: [], tools: [], lifecycle: { state: 'ready' }, attachment_id: 'attachment', config: { threshold: 2 }, projections: { index: { last_seq: 23, parked: true, bootstrapping: false, error: 'Projection paused' } } }]
  const w = mount(PluginsEditor, { props: { boardId: 'b', draft: view.declaration, schema: view, options: [{ plugin: 'app:plugin', installed: true, active: false, requires: [], tools: [], lifecycle: { state: 'ready' as const }, projections: {}, title: 'Enhancement', config_schema: { type: 'object', properties: {} } }], configs: {} } })
  await flushPromises()
  expect(w.text()).toContain('Active')
  expect(w.text()).toContain('Attachment configured')
  expect(w.text()).toContain('23'); expect(w.text()).toContain('Stopped: Projection paused'); expect(w.text()).toContain('Projection paused')
  expect(w.find('.work-config-fields').exists()).toBe(true)
  await w.setProps({ schema: { ...view, plugins: [{ ...view.plugins![0], lifecycle: { state: 'pending' }, projections: {} }] } })
  expect(w.text()).toContain('Configuring attachment')
  expect(w.text()).not.toContain('Last sequence')
  w.unmount()
})
it('uses the supplied host lifecycle without fetching historical schemas', async () => {
  const { work } = await import('../../api')
  const view = schema(); view.generation = 7
  view.declaration.plugins = [{ use: 'app:plugin' }]
  view.plugins = [{ plugin: 'app:plugin', installed: true, active: true, requires: [], tools: [], lifecycle: { state: 'ready' }, projections: {}, attachment_id: 'current' }]
  vi.mocked(work.schema).mockImplementation(async (_id, generation) => ({ ...view, generation: generation ?? 7, plugins: generation && generation < 3 ? [] : view.plugins }))
  const w = mount(PluginsEditor, { props: { boardId: 'b', draft: view.declaration, schema: view, options: [{ plugin: 'app:plugin', installed: true, active: false, requires: [], tools: [], lifecycle: { state: 'ready' as const }, projections: {}, title: 'Enhancement', config_schema: {} }], configs: {} } })
  await flushPromises()
  expect(w.text()).toContain('Attachment configured')
  expect(work.schema).not.toHaveBeenCalled()
  w.unmount()
})
it('keeps an attachment pending until Work reports lifecycle completion', async () => {
  const view = schema(); view.declaration.plugins = [{ use: 'app:plugin' }]
  view.plugins = [{ plugin: 'app:plugin', installed: true, active: true, requires: [], tools: [], lifecycle: { state: 'pending' }, projections: {}, attachment_id: 'attachment' }]
  const w = mount(PluginsEditor, { props: { boardId: 'b', draft: view.declaration, schema: view, options: [{ plugin: 'app:plugin', installed: true, active: false, requires: [], tools: [], lifecycle: { state: 'ready' as const }, projections: {}, title: 'Enhancement', config_schema: {} }], configs: {} } })
  await flushPromises(); expect(w.text()).toContain('Configuring attachment')
  await w.setProps({ schema: { ...view, plugins: [{ ...view.plugins![0], lifecycle: { state: 'ready' } }] } })
  expect(w.text()).toContain('Attachment configured'); w.unmount()
})

it('edits stage safety limits and their board defaults', async () => {
  const process = reactive<Process>({ id: 'flow', initial: 'build', states: [{ id: 'build', category: 'started', kind: 'automated', run: { stage: 'build' } }, { id: 'stopped', category: 'canceled' }], transitions: [{ id: 'stop', from: 'any', to: 'stopped' }] })
  const draft = reactive<Declaration>({ processes: [process] })
  const w = mount(StateSettings, { props: { state: process.states[0], process, draft } })
  const timeout = w.findAllComponents(DurationControl).find(c => c.props('label') === 'Attempt timeout')!
  expect(timeout).toBeDefined()
  timeout.vm.$emit('update:modelValue', 'PT2H')
  w.findAllComponents(InputNumber).find(c => c.find('input[aria-label="Maximum visits"]').exists())!.vm.$emit('update:modelValue', 3)
  await selectControl(w, 'When visits are exhausted').setValue('stop')
  expect(process.states[0].run).toMatchObject({ timeout: 'PT2H', max_visits: 3, on_exhausted: 'stop' })
  w.unmount()
  const policy = mount(PolicyEditor, { props: { draft } })
  policy.findAllComponents(DurationControl).find(c => c.props('label') === 'Default attempt timeout')!.vm.$emit('update:modelValue', 'PT3H')
  policy.findAllComponents(InputNumber).find(c => c.find('input[aria-label="Default maximum visits"]').exists())!.vm.$emit('update:modelValue', 4)
  expect(draft.policy).toMatchObject({ stage_timeout: 'PT3H', stage_max_visits: 4 })
  policy.unmount()
})
