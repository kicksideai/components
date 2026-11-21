// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { getButton } from '../../test/controls'
import { expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import InputNumber from 'primevue/inputnumber'
import { reactive } from 'vue'
import ChipPicker from './ChipPicker.vue'
import PluginsEditor from './PluginsEditor.vue'
import { schema } from '../../test/fixtures'
import { settings } from './api'
import { projectionHealth } from './plugin-state'
import { ApiError } from '../../transport'
vi.mock('./api', () => ({ settings: { configure: vi.fn().mockResolvedValue({ attachment_id: 'attachment' }) } }))

it('offers installed filters on their plugin and lets an administrator remove stale filters', async () => {
  const plugin = { plugin: 'app:plugin', title: 'Search', installed: true, active: true, requires: [], tools: [],
    lifecycle: { state: 'ready' as const }, projections: {} }
  const draft = reactive({ plugins: [{ use: plugin.plugin }], scopes: ['app:removed'] })
  const filters = [{ id: 'app:search', title: 'Release filter', plugin: plugin.plugin }]
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: schema(), draft, options: [plugin], configs: {}, filters } })
  try {
    await w.get('.work-definition-toggle').trigger('click')
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
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: view, draft: { plugins: [{ use: 'app:plugin' }] }, options: [{ plugin: 'app:plugin', installed: true, active: false, lifecycle: { state: 'ready' as const }, projections: {}, requires: [], tools: [], title: 'Search', config_schema: {} }], configs: {} } })
  try { await w.get('[aria-expanded]').trigger('click'); await flushPromises(); expect(w.text()).toContain(label); expect(w.text()).toContain(`Indexed through ${projection.last_seq} of 10 events.`); expect(projectionHealth(projection, 10)).toBe(label) }
  finally { w.unmount() }
})
it('places Reset and Save plugin settings together at standard size and validates before save', async () => {
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: { ...schema(), plugins: [{ plugin: 'app:plugin', installed: true, active: true, lifecycle: { state: 'ready' as const }, projections: {}, requires: [], tools: [], config: { limit: 2 } }] }, draft: { plugins: [{ use: 'app:plugin' }] }, options: [{ plugin: 'app:plugin', installed: true, active: false, lifecycle: { state: 'ready' as const }, projections: {}, requires: [], tools: [], title: 'Files', config_schema: { properties: { limit: { type: 'integer', minimum: 1 } } } }], configs: {} } })
  try {
    await w.get('[aria-expanded]').trigger('click'); await flushPromises()
    const actions = w.get('.work-definition-body .work-form-actions')
    expect(actions.findAll('button').map(b => b.text())).toEqual(['Reset', 'Save plugin settings'])
    expect(actions.find('.p-button-sm').exists()).toBe(false)
    expect(actions.findAll('button')[1].attributes('disabled')).toBeDefined()
    await w.getComponent(InputNumber).setValue(3)
    await actions.findAll('button')[1].trigger('click'); await flushPromises()
    expect(settings.configure).toHaveBeenCalledWith('b', 'app:plugin', { limit: 3 })
  } finally { w.unmount() }
})

it('shows lifecycle failures and keeps malformed installed capabilities visible and inactive', async () => {
  const option = { plugin: 'app:invalid', title: 'Invalid capability', installed: true, active: false, requires: [], tools: [], config_schema: {}, lifecycle: { state: 'failed' as const }, projections: {}, problem: { code: 'plugin_invalid', message: 'Attachment declaration is missing' } }
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: { ...schema(), plugins: [option] }, draft: { plugins: [] }, options: [option], configs: {} } })
  try { await w.get('[aria-expanded]').trigger('click'); expect(w.text()).toContain(option.problem.message); expect(w.find('input[role="switch"]').attributes('disabled')).toBeDefined() }
  finally { w.unmount() }
})

it('shows refreshed configuration and saves the edited value', async () => {
  const plugin = { plugin: 'app:plugin', installed: true, active: true, lifecycle: { state: 'ready' as const }, projections: {}, requires: [], tools: [], config: { limit: 2 } }
  const view = { ...schema(), plugins: [plugin] }
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: view, draft: { plugins: [{ use: plugin.plugin }] }, options: [{ ...plugin, config_schema: { properties: { limit: { type: 'integer' } } } }], configs: {} } })
  await w.get('[aria-expanded]').trigger('click'); await flushPromises()
  await w.setProps({ schema: { ...view, plugins: [{ ...plugin, config: { limit: 8 } }] } }); await flushPromises()
  expect(w.getComponent(InputNumber).props('modelValue')).toBe(8)
  await w.getComponent(InputNumber).setValue(9)
  await getButton(w, 'Save plugin settings').trigger('click'); await flushPromises()
  expect(settings.configure).toHaveBeenLastCalledWith('b', 'app:plugin', { limit: 9 }); w.unmount()
})

it('shows a labeled Work error code when the plugin configuration is refused', async () => {
  const plugin = { plugin: 'app:plugin', title: 'Files', installed: true, active: true, lifecycle: { state: 'ready' as const }, projections: {}, requires: [], tools: [], config: {}, config_schema: { properties: { limit: { type: 'integer' } } } }
  vi.mocked(settings.configure).mockRejectedValueOnce(new ApiError({ message: 'app:plugin effective config is malformed', details: { code: 'plugin_config_invalid' } }, 'Save plugin settings', 400))
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: { ...schema(), plugins: [plugin] }, draft: { plugins: [{ use: plugin.plugin }] }, options: [plugin], configs: {} } })
  try {
    await w.get('[aria-expanded]').trigger('click')
    await w.getComponent(InputNumber).setValue(1)
    await getButton(w, 'Save plugin settings').trigger('click'); await flushPromises()
    const alert = w.get('[role="alert"]').text()
    expect(alert).toContain('The plugin rejected this configuration. Check its settings and try again.')
    expect(alert).toMatch(/Error code:\s*plugin_config_invalid/)
    expect(alert).not.toContain('app:plugin')
  } finally { w.unmount() }
})
