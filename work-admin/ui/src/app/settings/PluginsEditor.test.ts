// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { getButton, schemaForm } from '../../test/controls'
import { expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { reactive } from 'vue'
import ChipPicker from './ChipPicker.vue'
import PluginsEditor from './PluginsEditor.vue'
import { schema } from '../../test/fixtures'
import { projectionHealth } from './plugin-state'
vi.mock('./api', () => ({ settings: { configure: vi.fn().mockResolvedValue({ attachment_id: 'attachment' }) } }))

it('offers installed filters on their plugin and lets an administrator remove stale filters', async () => {
  const plugin = { plugin: 'app:plugin', title: 'Search', installed: true, active: true, requires: [], tools: [],
    lifecycle: { state: 'ready' as const }, projections: {} }
  const draft = reactive({ plugins: [{ use: plugin.plugin }], scopes: ['app:removed'] })
  const filters = [{ id: 'app:search', title: 'Release filter', plugin: plugin.plugin }]
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: schema(), draft, options: [plugin], configs: {}, filters } })
  try {
    await w.get('.kx-settings-item-expand').trigger('click')
    const picker = w.findAllComponents(ChipPicker).find(p => p.props('label') === 'Available filters')!
    expect(picker.props('options')).toEqual([{ value: 'app:search', label: 'Release filter' }])
    picker.vm.$emit('update:modelValue', ['app:search'])
    expect(draft.scopes).toEqual(['app:removed', 'app:search'])
    const unavailable = getButton(w, 'Unavailable query filters')
    await unavailable.trigger('click')
    await getButton(w, 'Remove unavailable filter 1').trigger('click')
    expect(draft.scopes).toEqual(['app:search'])
  } finally { w.unmount() }
})
it.each([
  [{ last_seq: 10, parked: false, bootstrapping: false }, 'Up to date'],
  [{ last_seq: 4, parked: false, bootstrapping: false }, 'Catching up'],
  [{ last_seq: 4, parked: true, bootstrapping: false, error: 'Worker unavailable' }, 'Stopped: Worker unavailable'],
] as const)('shows projection health and position against the board head', async (projection, label) => {
  const view = { ...schema(), as_of: 10, plugins: [{ plugin: 'app:plugin', installed: true, active: true, lifecycle: { state: 'ready' as const }, projections: { index: projection }, requires: [], tools: [] }] }
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: view, draft: { plugins: [{ use: 'app:plugin' }] }, options: [{ plugin: 'app:plugin', installed: true, active: false, lifecycle: { state: 'ready' as const }, projections: {}, requires: [], tools: [], title: 'Search', config_schema: {} }], configs: reactive({}) } })
  try { await w.get('[aria-expanded]').trigger('click'); await flushPromises(); expect(w.text()).toContain(label); expect(w.text()).toContain(`Indexed through ${projection.last_seq} of 10 events.`); expect(projectionHealth(projection, 10)).toBe(label) }
  finally { w.unmount() }
})
it('stages active settings and lets Reset restore the saved configuration', async () => {
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: { ...schema(), plugins: [{ plugin: 'app:plugin', installed: true, active: true, lifecycle: { state: 'ready' as const }, projections: {}, requires: [], tools: [], config: { limit: 2 } }] }, draft: { plugins: [{ use: 'app:plugin' }] }, options: [{ plugin: 'app:plugin', installed: true, active: false, lifecycle: { state: 'ready' as const }, projections: {}, requires: [], tools: [], title: 'Files', config_schema: { properties: { limit: { type: 'integer', minimum: 1 } } } }], configs: reactive({}) } })
  try {
    await w.get('[aria-expanded]').trigger('click'); await flushPromises()
    const actions = w.get('.work-plugin-config > .work-row')
    expect(actions.findAll('button').map(b => b.text())).toEqual(['Restore saved settings'])
    const form = schemaForm(w)
    expect(form.config()).toEqual({ limit: 2 })
    await form.change({ limit: 0 })
    await form.report({ limit: 'Enter at least 1.' })
    expect(w.emitted('validity')?.at(-1)).toEqual(['app:plugin', false])
    expect(w.get('.kx-settings-item-head').text()).toContain('Limit: Enter at least 1.')
    await form.change({ limit: 3 })
    await form.report()
    expect(w.props('configs')).toEqual({ 'app:plugin': { limit: 3 } })
    expect(w.emitted('validity')?.at(-1)).toEqual(['app:plugin', true])
    await getButton(w, 'Restore saved settings').trigger('click')
    expect(w.props('configs')).toEqual({})
    expect(schemaForm(w).config()).toEqual({ limit: 2 })
  } finally { w.unmount() }
})

it('shows lifecycle failures and keeps malformed installed capabilities visible and inactive', async () => {
  const option = { plugin: 'app:invalid', title: 'Invalid capability', installed: true, active: false, requires: [], tools: [], config_schema: {}, lifecycle: { state: 'failed' as const }, projections: {}, problem: { code: 'plugin_invalid', message: 'Attachment declaration is missing' } }
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: { ...schema(), plugins: [option] }, draft: { plugins: [] }, options: [option], configs: reactive({}) } })
  try { await w.get('[aria-expanded]').trigger('click'); expect(w.text()).toContain(option.problem.message); expect(w.find('input[role="switch"]').attributes('disabled')).toBeDefined() }
  finally { w.unmount() }
})

it('shows refreshed configuration and stages the edited value', async () => {
  const plugin = { plugin: 'app:plugin', installed: true, active: true, lifecycle: { state: 'ready' as const }, projections: {}, requires: [], tools: [], config: { limit: 2 } }
  const view = { ...schema(), plugins: [plugin] }
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: view, draft: { plugins: [{ use: plugin.plugin }] }, options: [{ ...plugin, config_schema: { properties: { limit: { type: 'integer' } } } }], configs: reactive({}) } })
  await w.get('[aria-expanded]').trigger('click'); await flushPromises()
  await w.setProps({ schema: { ...view, plugins: [{ ...plugin, config: { limit: 8 } }] } }); await flushPromises()
  expect(schemaForm(w).config()).toEqual({ limit: 8 })
  await schemaForm(w).change({ limit: 9 })
  expect(w.props('configs')).toEqual({ 'app:plugin': { limit: 9 } })
  w.unmount()
})

const option = (plugin: string, title: string, extra: Record<string, unknown> = {}) => ({ plugin, title, installed: true, active: false, requires: [] as string[], tools: [],
  lifecycle: { state: 'ready' as const }, projections: {}, config_schema: {}, ...extra })

it('groups plugins by purpose with enabled plugins first and shows what each needs and what uses it', async () => {
  const options = [
    option('app:search', 'Search', { category: 'Search', description: 'Find items by key or text.' }),
    option('app:sprints', 'Sprints', { category: 'Planning and tracking' }),
    option('app:notes', 'Notes', { requires: ['app:search'] }),
    option('app:milestones', 'Milestones', { category: 'Planning and tracking', active: true }),
  ]
  const view = { ...schema(), plugins: [{ ...options[3], active: true }] }
  const draft = reactive({ plugins: [{ use: 'app:milestones' }, { use: 'app:notes' }] })
  const pack = { id: 'app:tracker', title: 'Tracker', version: '1.0.0', requires: ['app:search', 'app:milestones'], outdated: true, canUpgrade: true }
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: view, draft, options, configs: reactive({}), pack } })
  try {
    const groups = w.findAll('.kx-settings-group').map(group => [group.find('h2').text(), group.findAll('.kx-settings-item-title').map(title => title.text())])
    expect(groups).toEqual([['Pack', ['Tracker']], ['Planning and tracking', ['Milestones', 'Sprints']], ['Search', ['Search']], ['Other', ['Notes']]])
    const item = (title: string) => w.findAll('.kx-settings-item').find(row => row.get('.kx-settings-item-title').text() === title)!
    expect(item('Search').get('.kx-settings-item-desc').text()).toBe('Find items by key or text.')
    expect(item('Search').get('.kx-settings-item-meta').text()).toBe('Used by Tracker and Notes')
    expect(item('Notes').get('.kx-settings-item-meta').text()).toBe('Needs Search')
    expect(item('Tracker').get('.kx-settings-item-meta').text()).toBe('Needs Search and Milestones')
    expect(item('Milestones').get('.work-plugin-state').text()).toBe('Enabled')
    expect(item('Notes').get('.work-plugin-state').text()).toBe('Turns on when applied')
    expect(item('Sprints').get('.work-plugin-state').text()).toBe('Available')
    for (const row of w.findAll('.kx-settings-item-head')) expect(row.text()).not.toMatch(/app:/)
    await getButton(item('Tracker'), 'Review update').trigger('click')
    expect(w.emitted('upgrade')).toHaveLength(1)
  } finally { w.unmount() }
})

it('shows uncategorized plugins as one untitled list', () => {
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: schema(), draft: { plugins: [] }, options: [option('app:a', 'A'), option('app:b', 'B')], configs: reactive({}) } })
  try {
    expect(w.findAll('.kx-settings-group')).toHaveLength(1)
    expect(w.find('.kx-settings-group h2').exists()).toBe(false)
  } finally { w.unmount() }
})

it('passes any plugin its declared schema and the board item types for x-choices fields', async () => {
  const configSchema = { type: 'object', properties: { issue_types: { type: 'array', title: 'Plan these item types', items: { type: 'string', 'x-choices': 'board_item_types', not: { enum: ['issue'] } } } } }
  const plugin = { plugin: 'kickside.work.planning:plugin', title: 'Work Planning', installed: true, active: true, requires: [], tools: [],
    lifecycle: { state: 'ready' as const }, projections: {}, config: { issue_types: ['task'] } }
  const draft = reactive({ plugins: [{ use: plugin.plugin }], item_types: [{ id: 'task', title: 'Task', process: 'flow', fields: [] }, { id: 'support_request', process: 'flow', fields: [] }] })
  const configs = reactive<Record<string, Record<string, unknown>>>({})
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: { ...schema(), plugins: [plugin] }, draft, options: [{ ...plugin, config_schema: configSchema }], configs } })
  try {
    await w.get('.kx-settings-item-expand').trigger('click'); await flushPromises()
    const form = schemaForm(w)
    expect(form.schema()).toEqual(configSchema)
    expect(form.config()).toEqual({ issue_types: ['task'] })
    expect(form.choices()).toEqual({ board_item_types: [{ value: 'task', label: 'Task' }, { value: 'support_request', label: 'Support request' }] })
    expect(form.disabled()).toBe(false)
    await form.change({ issue_types: ['task', 'support_request'] })
    expect(configs).toEqual({ [plugin.plugin]: { issue_types: ['task', 'support_request'] } })
    await w.setProps({ disabled: true })
    expect(schemaForm(w).disabled()).toBe(true)
  } finally { w.unmount() }
})
