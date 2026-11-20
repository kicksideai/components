// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { host } from '@wippy-fe/proxy'
import AdminApp from './AdminApp.vue'
import { work } from '../../api'
import { ApiError } from '../../transport'
import { getButton } from '../../test/controls'
import { deferred } from '../../test/fixtures'
import { notify, subscriptions } from '../../test/setup'
vi.mock('../../api', () => ({ work: { boards: vi.fn(), createBoard: vi.fn(), packs: vi.fn().mockResolvedValue([]) } }))
const wrappers: ReturnType<typeof mount>[] = []
beforeEach(() => { vi.clearAllMocks(); vi.mocked(work.packs).mockResolvedValue([]); vi.mocked(work.boards).mockResolvedValue([{ board_id: 'b', title: 'Delivery', access: { read: true, write: true, admin: true }, generation: 7, item_count: 12, open_count: 5 }, { board_id: 'read', title: 'Read only', access: { read: true, write: false, admin: false }, generation: 2 }]) })
afterEach(() => { for (const w of wrappers.splice(0)) w.unmount() })
async function render() { const w = mount(AdminApp, { global: { stubs: { BoardSettings: true } } }); wrappers.push(w); await flushPromises(); return w }
it.each([false, true])('retries a catalog outage in place and only shows an empty state after success (empty: %s)', async empty => {
  const rows = empty ? [] : await work.boards()
  vi.mocked(work.boards).mockClear()
  const first = deferred<Awaited<ReturnType<typeof work.boards>>>()
  const retry = deferred<Awaited<ReturnType<typeof work.boards>>>()
  vi.mocked(work.boards).mockReturnValueOnce(first.promise).mockReturnValueOnce(retry.promise)
  const w = await render()
  const rail = w.get('nav')
  expect(rail.text()).toContain('Loading boards…')
  expect(rail.text()).not.toContain('No readable boards.')
  first.reject(new ApiError({ message: 'The board catalog is temporarily unavailable.', details: { code: 'catalog_unavailable' }, retryable: true }, 'Load boards', 503))
  await flushPromises()
  expect(rail.get('[role="alert"]').text()).toContain('The board catalog is temporarily unavailable.')
  expect(rail.text()).not.toContain('No readable boards.')
  expect(w.text()).not.toContain('Choose a board')
  expect(rail.get('[role="alert"]').text()).toMatch(/Error code:\s*catalog_unavailable/)
  await getButton(rail, 'Retry').trigger('click')
  expect(rail.text()).toContain('Loading boards…')
  expect(rail.text()).not.toContain('No readable boards.')
  expect(rail.find('[role="alert"]').exists()).toBe(false)
  retry.resolve(rows); await flushPromises()
  expect(work.boards).toHaveBeenCalledTimes(2)
  expect(rail.text()).not.toContain('Loading boards…')
  expect(rail.find('[role="alert"]').exists()).toBe(false)
  if (empty) expect(rail.text()).toContain('No readable boards.')
  else expect(getButton(rail, 'Settings for Delivery').exists()).toBe(true)
})

it('keeps a selected board available during a catalog refresh outage and clears the stale error after recovery', async () => {
  const w = await render()
  const row = getButton(w, 'Settings for Delivery')
  await row.trigger('click'); await flushPromises()
  vi.mocked(work.boards).mockRejectedValueOnce(new Error('Could not load boards.'))
  notify('component.b'); await flushPromises()
  expect(w.get('nav [role="alert"]').text()).toBe('Could not load boards.')
  expect(row.attributes('aria-current')).toBe('page')
  notify('component.b'); await flushPromises()
  expect(w.find('nav [role="alert"]').exists()).toBe(false)
  expect(row.attributes('aria-current')).toBe('page')
})
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
  expect(work.createBoard).toHaveBeenCalledWith('Next delivery', { key_prefix: 'NEXT' }, expect.any(String), {})
  expect(w.get('kickside-work-board-settings').attributes('board-id')).toBe('new')
})

it('asks before replacing a dirty board and keeps the current board on cancel', async () => {
  const rows = await work.boards(); vi.mocked(work.boards).mockResolvedValue([...rows, { board_id: 'other', title: 'Other', access: { read: true, write: true, admin: true } }])
  const w = await render(); await w.get('[aria-label="Settings for Delivery"]').trigger('click'); await flushPromises()
  await w.get('kickside-work-board-settings').trigger('dirty-change', { detail: { dirty: true } })
  vi.mocked(host.confirm).mockResolvedValueOnce(false)
  await w.get('[aria-label="Settings for Other"]').trigger('click'); await flushPromises()
  expect(host.confirm).toHaveBeenCalledOnce()
  expect(w.get('kickside-work-board-settings').attributes('board-id')).toBe('b')
  vi.mocked(host.confirm).mockResolvedValueOnce(true)
  await w.get('[aria-label="Settings for Other"]').trigger('click'); await flushPromises()
  expect(w.get('kickside-work-board-settings').attributes('board-id')).toBe('other')
})
