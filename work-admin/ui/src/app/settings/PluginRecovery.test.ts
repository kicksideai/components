// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { reactive } from 'vue'
import { beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { host } from '@wippy-fe/proxy'
import type { PluginOption } from '../../types'
import { schema } from '../../test/fixtures'
import { getButton } from '../../test/controls'
import InputNumber from 'primevue/inputnumber'
import { settings } from './api'
import PluginsEditor from './PluginsEditor.vue'

vi.mock('./api', () => ({ settings: { configure: vi.fn().mockResolvedValue({ attachment_id: 'attachment' }) } }))

beforeEach(() => vi.clearAllMocks())

const id = 'app.review_plugin:plugin'
const normal: PluginOption = {
  plugin: id,
  title: 'Change Review',
  installed: true,
  active: true,
  requires: [],
  tools: [],
  config: { threshold: 1 },
  config_schema: { properties: { threshold: { type: 'integer', minimum: 1 } } },
  lifecycle: { state: 'ready' },
  projections: {},
}

const states: { name: string; plugin: PluginOption; status: RegExp; action: RegExp }[] = [
  {
    name: 'attachment setup failed',
    plugin: { ...normal, lifecycle: { state: 'failed', error: { kind: 'unavailable', message: 'Attachment unavailable' } } },
    status: /Attachment setup failed|Configuration failed/,
    action: /Retry attachment|Retry setup/,
  },
  {
    name: 'worker degraded',
    plugin: { ...normal, projections: { index: { last_seq: 3, parked: false, bootstrapping: false, error: 'Worker unavailable' } } },
    status: /Worker unavailable|Degraded/,
    action: /Inspect|Retry|Reset projection/,
  },
  {
    name: 'effective configuration invalid',
    plugin: { ...normal, config: undefined, problem: { code: 'plugin_config_invalid', message: 'Threshold is required' },
      lifecycle: { state: 'failed', error: { kind: 'invalid', code: 'plugin_config_invalid', message: 'Threshold is required' } } },
    status: /Threshold is required/,
    action: /Save configuration|Edit configuration/,
  },
  {
    name: 'projection needs reset',
    plugin: { ...normal, projections: { index: { last_seq: 3, parked: true, bootstrapping: false, error: 'Worker stopped' } },
      lifecycle: { state: 'failed', error: { kind: 'conflict', code: 'plugin_projection_gap', message: 'Event history was pruned', floor: 8 } } },
    status: /Event history was pruned|Needs reset/,
    action: /Reset projection|Rebuild index|Review retained history/,
  },
  {
    name: 'uninstalled with active references',
    plugin: { ...normal, installed: false, title: undefined, problem: { code: 'unknown_plugin', message: 'Unknown plugin' },
      lifecycle: { state: 'failed', error: { kind: 'invalid', code: 'unknown_plugin', message: 'Unknown plugin' } } },
    status: /Not installed|Uninstalled/,
    action: /Deactivate plugin|Review references|Reinstall/,
  },
]

it.each(states)('$name has a clear status and an available recovery action', async ({ plugin, status, action }) => {
  const wrapper = mount(PluginsEditor, { props: {
    boardId: 'board',
    schema: { ...schema(), as_of: 10, plugins: [plugin] },
    draft: { plugins: [{ use: id }] },
    options: [plugin],
    configs: reactive({}),
  } })
  try {
    await wrapper.get('[aria-expanded]').trigger('click')
    await flushPromises()
    const buttons = wrapper.findAll('button:not([disabled])').map(button => button.text()).filter(Boolean)
    expect.soft(wrapper.text()).toMatch(status)
    expect(buttons.join(' · ')).toMatch(action)
  } finally {
    wrapper.unmount()
  }
})

function renderPlugin(plugin: PluginOption) {
  return mount(PluginsEditor, { props: {
    boardId: 'board',
    schema: { ...schema(), as_of: 10, plugins: [plugin] },
    draft: { plugins: [{ use: id }] },
    options: [plugin],
    configs: reactive({}),
  } })
}

it('retries failed setup using the saved board overrides and refreshes status', async () => {
  const wrapper = renderPlugin(states[0].plugin)
  try {
    await wrapper.get('.work-definition-toggle').trigger('click')
    expect(wrapper.get('.work-definition-kind').text()).toBe('Attachment setup failed')
    expect(wrapper.text()).toContain('Attachment unavailable')
    await getButton(wrapper, 'Retry setup').trigger('click')
    await flushPromises()
    expect(settings.configure).toHaveBeenCalledExactlyOnceWith('board', id)
    expect(wrapper.emitted('configured')).toEqual([[]])
  } finally { wrapper.unmount() }
})

it('rechecks a schema provider failure without changing the attachment', async () => {
  const wrapper = renderPlugin({ ...normal, lifecycle: { state: 'failed',
    error: { kind: 'unavailable', source: 'schema_provider', message: 'The schema provider timed out.' } } })
  try {
    await wrapper.get('.work-definition-toggle').trigger('click')
    expect(wrapper.get('.work-definition-kind').text()).toBe('Schema provider failed')
    expect(wrapper.text()).toContain('The schema provider timed out.')
    await getButton(wrapper, 'Retry schema check').trigger('click')
    expect(wrapper.emitted('refresh')).toEqual([[]])
    expect(settings.configure).not.toHaveBeenCalled()
  } finally { wrapper.unmount() }
})

it('shows the degraded worker error and its last acknowledged sequence together', async () => {
  const wrapper = renderPlugin(states[1].plugin)
  try {
    await wrapper.get('.work-definition-toggle').trigger('click')
    expect(wrapper.get('.work-definition-kind').text()).toBe('Degraded')
    await getButton(wrapper, 'Technical details').trigger('click')
    const progress = wrapper.get('dl')
    expect(progress.text()).toContain('Worker unavailable')
    expect(progress.text()).toContain('Indexed through 3 of 10 events.')
    await getButton(wrapper, 'Inspect worker').trigger('click')
    expect(progress.text()).toContain('Index')
    expect(settings.configure).not.toHaveBeenCalled()
  } finally { wrapper.unmount() }
})

it('repairs invalid effective config through Work and disables editing without board admin', async () => {
  const wrapper = renderPlugin(states[2].plugin)
  try {
    await wrapper.get('.work-definition-toggle').trigger('click')
    expect(wrapper.get('.work-definition-kind').text()).toBe('Misconfigured')
    await wrapper.setProps({ disabled: true })
    expect(getButton(wrapper, 'Edit configuration').attributes('disabled')).toBeDefined()
    await wrapper.setProps({ disabled: false })
    await getButton(wrapper, 'Edit configuration').trigger('click')
    await wrapper.getComponent(InputNumber).setValue(4)
    await flushPromises()
    expect(wrapper.props('configs')).toEqual({ [id]: { threshold: 4 } })
    expect(settings.configure).not.toHaveBeenCalled()
  } finally { wrapper.unmount() }
})

it('keeps an unsupported manifest unavailable for activation and config repair', async () => {
  const unsupported = { ...normal, active: false, problem: { code: 'plugin_interface_version_unsupported', message: 'Unsupported plugin interface' } }
  const wrapper = mount(PluginsEditor, { props: { boardId: 'board', schema: schema(), draft: { plugins: [] }, options: [unsupported], configs: {} } })
  try {
    await wrapper.get('.work-definition-toggle').trigger('click')
    expect(wrapper.get('input[role="switch"]').attributes('disabled')).toBeDefined()
    expect(wrapper.findComponent(InputNumber).exists()).toBe(false)
  } finally { wrapper.unmount() }
})

it('shows the retained floor and offers declaration review for a history gap', async () => {
  const wrapper = renderPlugin(states[3].plugin)
  try {
    await wrapper.get('.work-definition-toggle').trigger('click')
    expect(wrapper.get('.work-definition-kind').text()).toBe('History gap')
    expect(wrapper.text()).toContain('Earliest retained event sequence is 8.')
    await getButton(wrapper, 'Review retained history').trigger('click')
    expect(wrapper.text()).toContain('Ask the plugin maintainer to review the event projection’s start sequence.')
    expect(settings.configure).not.toHaveBeenCalled()
  } finally { wrapper.unmount() }
})

it('resets a parked projection through Work once its worker cause is resolved', async () => {
  vi.mocked(host.confirm).mockResolvedValueOnce(true)
  const wrapper = renderPlugin({ ...states[3].plugin, lifecycle: normal.lifecycle })
  try {
    await wrapper.get('.work-definition-toggle').trigger('click')
    expect(wrapper.get('.work-definition-kind').text()).toBe('Needs reset')
    expect(wrapper.text()).toContain('Worker stopped')
    await getButton(wrapper, 'Reset projection').trigger('click')
    await flushPromises()
    expect(host.confirm).toHaveBeenCalledWith(expect.objectContaining({ header: 'Reset projection?' }))
    expect(settings.configure).toHaveBeenCalledExactlyOnceWith('board', id)
  } finally { wrapper.unmount() }
})

it('identifies an uninstalled plugin and stages removal for the ordinary schema review', async () => {
  const { config_schema, ...missing } = states[4].plugin
  const wrapper = renderPlugin(missing)
  try {
    await wrapper.get('.work-definition-toggle').trigger('click')
    expect(wrapper.get('.work-definition-kind').text()).toBe('Not installed')
    expect(wrapper.get('.work-definition-toggle').text()).toContain(id)
    await getButton(wrapper, 'Review references').trigger('click')
    expect(wrapper.props('draft').plugins).toEqual([])
    expect(wrapper.emitted('review')).toHaveLength(1)
    expect(settings.configure).not.toHaveBeenCalled()
  } finally { wrapper.unmount() }
})

it('keeps installed plugin settings editable when a worker needs attention', async () => {
  const wrapper = renderPlugin(states[1].plugin)
  try {
    await wrapper.get('.work-definition-toggle').trigger('click')
    await getButton(wrapper, 'Plugin settings').trigger('click')
    await wrapper.getComponent(InputNumber).setValue(6)
    await flushPromises()
    expect(wrapper.props('configs')).toEqual({ [id]: { threshold: 6 } })
    expect(settings.configure).not.toHaveBeenCalled()
  } finally { wrapper.unmount() }
})
