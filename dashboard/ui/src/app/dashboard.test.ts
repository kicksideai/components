// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Dashboard from './dashboard.vue'

const { get, emit } = vi.hoisted(() => ({ get: vi.fn(), emit: vi.fn() }))

vi.mock('@wippy-fe/proxy', () => ({ api: { get } }))
vi.mock('@iconify/vue', () => ({ Icon: { render: () => null } }))
vi.mock('../constants.ts', () => ({ useComponentEvents: () => emit }))
vi.mock('@wippy-fe/webcomponent-vue', async () => {
  const { onMounted } = await import('vue')
  return { useHostVisibilityRefresh: onMounted }
})

const system = { id: 'app.ui:system', label: 'System', icon: 'tabler:settings', path: '/system', route_name: 'system', render: 'surface', surface: 'system' }
const inbox = { id: 'kickside.inbox:nav', label: 'Inbox', icon: 'tabler:inbox', path: '/inbox', route_name: 'inbox', render: 'component', component_tag: 'kickside-inbox', category: 'work' }
const research = { id: 'provider:research', label: 'Research library', path: '/research/workspace', route_name: 'research-library', render: 'component', component_tag: 'kickside-research', category: 'work' }

function effective(items: object[], categories: object[] = []) {
  return { data: { success: true, items, categories } }
}

async function render() {
  const view = mount(Dashboard)
  await flushPromises()
  return view
}

beforeEach(() => {
  get.mockReset()
  emit.mockReset()
})

describe('Dashboard links', () => {
  it('only shows the member’s effective navigation', async () => {
    get.mockResolvedValueOnce(effective([inbox]))
    const view = await render()

    expect(get.mock.calls).toEqual([['/api/v1/nav/list']])
    expect(view.get('button[aria-label="Open Inbox"]').text()).toBe('Inbox')
    expect(view.find('button[aria-label="Open System"]').exists()).toBe(false)
    view.unmount()
  })

  it('opens System if the effective navigation admits it', async () => {
    get.mockResolvedValueOnce(effective([{ ...system, label: 'Administration' }, inbox]))
    const view = await render()

    await view.get('button[aria-label="Open Administration"]').trigger('click')
    expect(emit).toHaveBeenCalledWith('navigate', expect.objectContaining({ id: system.id, path: '/system' }))
    view.unmount()
  })

  it('includes categorized and contributed entries once and opens their exact effective path', async () => {
    const items = [inbox, research]
    get.mockResolvedValueOnce(effective(items, [{ key: 'work', label: 'Work', collapsed: true, items }]))
    const view = await render()

    expect(view.findAll('button').map(button => button.attributes('aria-label'))).toEqual(['Open Inbox', 'Open Research library'])
    await view.get('button[aria-label="Open Research library"]').trigger('click')
    expect(emit).toHaveBeenCalledWith('navigate', {
      id: research.id, path: research.path, route_name: research.route_name, component_tag: research.component_tag,
    })
    view.unmount()
  })

  it('omits hidden, dashboard, and non-actionable entries', async () => {
    get.mockResolvedValueOnce(effective([
      inbox,
      { ...system, hidden: true },
      { ...inbox, id: 'home', label: 'Dashboard', path: '/', component_tag: 'kickside-dashboard' },
      { ...research, id: 'unknown', path: '/unknown', render: 'surface' },
      { ...research, id: 'invalid-tag', component_tag: 'badTag' },
      { ...research, id: 'external', path: '//example.org' },
    ]))
    const view = await render()

    expect(view.findAll('button').map(button => button.attributes('aria-label'))).toEqual(['Open Inbox'])
    view.unmount()
  })

  it('shows only a recoverable error on a failed read and reloads on Retry', async () => {
    get.mockResolvedValueOnce({ data: { success: false, error: 'internal provider failure', items: [system] } })
      .mockResolvedValueOnce(effective([inbox]))
    const view = await render()

    expect(view.get('[role="alert"]').text()).toBe('Could not load workspace navigation.')
    expect(view.text()).not.toMatch(/internal provider|No features available|ready to use/)
    expect(view.find('button[aria-label="Open System"]').exists()).toBe(false)
    expect(get.mock.calls).toEqual([['/api/v1/nav/list']])

    await view.get('button').trigger('click')
    await flushPromises()
    expect(view.find('[role="alert"]').exists()).toBe(false)
    expect(view.find('button[aria-label="Open Inbox"]').exists()).toBe(true)
    view.unmount()
  })

  it('shows an empty account state only on a successful empty response', async () => {
    get.mockResolvedValueOnce({ data: { success: true, items: {}, count: 0 } })
    const view = await render()

    expect(view.text()).toContain('No features available to this account')
    expect(view.find('[role="alert"]').exists()).toBe(false)
    expect(get).toHaveBeenCalledTimes(1)
    view.unmount()
  })

  it('distinguishes a rejected request and malformed successful response from empty navigation', async () => {
    get.mockRejectedValueOnce(new Error('network failure')).mockResolvedValueOnce({ data: { success: true } })
    const view = await render()

    expect(view.get('[role="alert"]').text()).toBe('Could not load workspace navigation.')
    await view.get('button').trigger('click')
    await flushPromises()
    expect(view.get('[role="alert"]').text()).toBe('Could not load workspace navigation.')
    expect(view.text()).not.toContain('No features available')
    view.unmount()
  })
})
