// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { getButton } from '../../test/controls'
import { expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import PluginsEditor from './PluginsEditor.vue'
import { schema } from '../../test/fixtures'
import { settings } from './api'
import { projectionHealth } from './plugin-state'
vi.mock('./api', () => ({ settings: { configure: vi.fn().mockResolvedValue({ attachment_id: 'attachment' }) } }))
it.each([
  [{ last_seq: 10, parked: false, bootstrapping: false }, 'Up to date'],
  [{ last_seq: 4, parked: false, bootstrapping: false }, 'Catching up'],
  [{ last_seq: 4, parked: true, bootstrapping: false, error: 'Worker unavailable' }, 'Stopped: Worker unavailable'],
] as const)('shows projection health and position against the board head', async (projection, label) => {
  const view = { ...schema(), as_of: 10, plugins: [{ plugin: 'app:plugin', installed: true, active: true, lifecycle: { state: 'ready' as const }, projections: { index: projection }, requires: [], tools: [] }] }
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: view, draft: { plugins: [{ use: 'app:plugin' }] }, options: [{ plugin: 'app:plugin', installed: true, active: false, lifecycle: { state: 'ready' as const }, projections: {}, requires: [], tools: [], title: 'Search', config_schema: {} }], configs: {} } })
  try { await w.get('[aria-expanded]').trigger('click'); await flushPromises(); expect(w.text()).toContain(label); expect(w.text()).toContain(`Position ${projection.last_seq} · Board head 10`); expect(projectionHealth(projection, 10)).toBe(label) }
  finally { w.unmount() }
})
it('places Reset and Save configuration together at standard size and validates before save', async () => {
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: { ...schema(), plugins: [{ plugin: 'app:plugin', installed: true, active: true, lifecycle: { state: 'ready' as const }, projections: {}, requires: [], tools: [], config: { limit: 2 } }] }, draft: { plugins: [{ use: 'app:plugin' }] }, options: [{ plugin: 'app:plugin', installed: true, active: false, lifecycle: { state: 'ready' as const }, projections: {}, requires: [], tools: [], title: 'Files', config_schema: { properties: { limit: { type: 'integer', minimum: 1 } } } }], configs: {} } })
  try {
    await w.get('[aria-expanded]').trigger('click'); await flushPromises()
    const actions = w.get('.work-form-actions')
    expect(actions.findAll('button').map(b => b.text())).toEqual(['Reset', 'Save configuration'])
    expect(actions.find('.p-button-sm').exists()).toBe(false)
    await actions.findAll('button')[1].trigger('click'); await flushPromises()
    expect(settings.configure).toHaveBeenCalledWith('b', 'app:plugin', { limit: 2 })
  } finally { w.unmount() }
})

it('shows lifecycle failures and keeps malformed installed capabilities visible and inactive', async () => {
  const option = { plugin: 'app:invalid', title: 'Invalid capability', installed: true, active: false, requires: [], tools: [], config_schema: {}, lifecycle: { state: 'failed' as const }, projections: {}, problem: { code: 'plugin_invalid', message: 'Attachment declaration is missing' } }
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: { ...schema(), plugins: [option] }, draft: { plugins: [] }, options: [option], configs: {} } })
  try { await w.get('[aria-expanded]').trigger('click'); expect(w.text()).toContain(option.problem.message); expect(w.find('input[role="switch"]').attributes('disabled')).toBeDefined() }
  finally { w.unmount() }
})

it('saves refreshed configuration when the local form has no edits', async () => {
  const plugin = { plugin: 'app:plugin', installed: true, active: true, lifecycle: { state: 'ready' as const }, projections: {}, requires: [], tools: [], config: { limit: 2 } }
  const view = { ...schema(), plugins: [plugin] }
  const w = mount(PluginsEditor, { props: { boardId: 'b', schema: view, draft: { plugins: [{ use: plugin.plugin }] }, options: [{ ...plugin, config_schema: { properties: { limit: { type: 'integer' } } } }], configs: {} } })
  await w.get('[aria-expanded]').trigger('click'); await flushPromises()
  await w.setProps({ schema: { ...view, plugins: [{ ...plugin, config: { limit: 8 } }] } }); await flushPromises()
  await getButton(w, 'Save configuration').trigger('click'); await flushPromises()
  expect(settings.configure).toHaveBeenLastCalledWith('b', 'app:plugin', { limit: 8 }); w.unmount()
})
