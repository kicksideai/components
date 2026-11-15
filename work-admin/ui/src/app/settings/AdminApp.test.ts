// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import AdminApp from './AdminApp.vue'
import { work } from '../../api'
import { notify, subscriptions } from '../../test/setup'
vi.mock('../../api', () => ({ work: { boards: vi.fn(), createBoard: vi.fn(), packs: vi.fn().mockResolvedValue([]) } }))
const wrappers: ReturnType<typeof mount>[] = []
beforeEach(() => { vi.clearAllMocks(); vi.mocked(work.packs).mockResolvedValue([]); vi.mocked(work.boards).mockResolvedValue([{ board_id: 'b', title: 'Delivery', access: { read: true, write: true, admin: true }, generation: 7, item_count: 12, open_count: 5 }, { board_id: 'read', title: 'Read only', access: { read: true, write: false, admin: false }, generation: 2 }]) })
afterEach(() => { for (const w of wrappers.splice(0)) w.unmount() })
async function render() { const w = mount(AdminApp, { global: { stubs: { BoardSettings: true } } }); wrappers.push(w); await flushPromises(); return w }
it('shows board counts without rail generations, offers settings only to board administrators, and refreshes visible boards', async () => {
  const w = await render()
  const rows = w.findAll('.work-rail-row'); expect(rows[0].text()).not.toContain('Generation'); expect(rows[0].text()).toContain('12'); expect(rows[1].attributes('disabled')).toBeDefined()
  const count = vi.mocked(work.boards).mock.calls.length; notify('component.b'); await flushPromises(); expect(work.boards).toHaveBeenCalledTimes(count + 1)
  await w.get('[aria-label="Settings for Delivery"]').trigger('click'); await flushPromises(); expect(w.get('kickside-work-board-settings').attributes('board-id')).toBe('b')
  w.unmount(); wrappers.pop(); expect(subscriptions.has('component.b')).toBe(false)
})
it('creates a board from the System tab with a native dialog then opens its settings', async () => {
  vi.mocked(work.createBoard).mockResolvedValue({ board_id: 'new' })
  const w = await render(); await w.get('[aria-label="Create board"]').trigger('click'); await flushPromises()
  expect(w.get('dialog').element.open).toBe(true)
  const inputs = w.findAll('dialog input'); await inputs[0].setValue('Next delivery'); await inputs[1].setValue('NEXT')
  await w.get('dialog form').trigger('submit'); await flushPromises()
  await w.get('dialog form').trigger('submit'); await flushPromises()
  expect(work.createBoard).toHaveBeenCalledWith('Next delivery', { key_prefix: 'NEXT' }, expect.any(String), '', {})
  expect(w.get('kickside-work-board-settings').attributes('board-id')).toBe('new')
})
