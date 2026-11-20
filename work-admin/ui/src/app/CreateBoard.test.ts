// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import SelectButton from 'primevue/selectbutton'
import ToggleSwitch from 'primevue/toggleswitch'
import { beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CreateBoard from './CreateBoard.vue'
import { work } from '../api'
import { ApiError } from '../transport'
vi.mock('../api', () => ({ work: { createBoard: vi.fn(), packs: vi.fn(), updateBoard: vi.fn() } }))
const packs = [
  { id: 'app:delivery', title: 'Delivery', version: '1.0.0', icon: 'tabler:layout-kanban', description: 'Plan delivery.', requires: [], plugins: [] },
  { id: 'app:cases', title: 'Cases', version: '1.1.0', icon: 'tabler:inbox', description: 'Resolve requests.', requires: ['app:missing'], plugins: [{ plugin: 'app:missing', installed: false }] },
]
beforeEach(() => { vi.clearAllMocks(); vi.mocked(work.packs).mockResolvedValue(packs); vi.mocked(work.createBoard).mockResolvedValue({ board_id: 'new' }); vi.mocked(work.updateBoard).mockResolvedValue({ board_id: 'new', status: 'updated' }) })
async function render() {
  const w = mount(CreateBoard, { props: { visible: false } }); await w.setProps({ visible: true }); await flushPromises()
  await w.get('#board-title').setValue('Next milestone'); await w.get('#board-prefix').setValue('NEXT')
  await w.get('#board-description').setValue('A shared delivery plan.'); await w.get('form').trigger('submit'); return w
}
it('discovers packs, disables unavailable requirements with a reason, and offers Empty board', async () => {
  const w = await render()
  expect(work.packs).toHaveBeenCalledOnce()
  expect(w.text()).toContain('Empty board'); expect(w.text()).toContain('Delivery'); expect(w.text()).toContain('1.0.0')
  expect(w.text()).toContain('Required plugin unavailable')
  const choice = w.getComponent(SelectButton).props('options') as { id: string; disabled?: boolean }[]
  expect(choice.find(p => p.id === 'app:cases')?.disabled).toBe(true)
  expect(w.text()).not.toContain('app:missing'); w.unmount()
})
it('creates through the pack API with explicit starter opt-in and no substitute schema', async () => {
  const w = await render(); await w.getComponent(SelectButton).setValue('app:delivery')
  await w.getComponent(ToggleSwitch).setValue(true); await w.get('form').trigger('submit'); await flushPromises()
  expect(work.createBoard).toHaveBeenCalledWith('Next milestone', { key_prefix: 'NEXT' }, expect.any(String), { pack: 'app:delivery', version: '1.0.0', starter: true })
  expect(w.emitted('created')).toEqual([['new']]); w.unmount()
})
it('creates an empty board without a local schema and keeps the retry key until the request changes', async () => {
  vi.mocked(work.createBoard).mockRejectedValue(new Error('Try again'))
  const w = await render(); await w.get('form').trigger('submit'); await flushPromises()
  expect(work.createBoard).toHaveBeenLastCalledWith('Next milestone', { key_prefix: 'NEXT' }, expect.any(String), {})
  const key = vi.mocked(work.createBoard).mock.calls[0][2]
  await w.get('form').trigger('submit'); await flushPromises(); expect(vi.mocked(work.createBoard).mock.calls[1][2]).toBe(key)
  await w.getComponent(SelectButton).setValue('app:delivery'); await w.get('form').trigger('submit'); await flushPromises()
  expect(vi.mocked(work.createBoard).mock.calls[2][2]).not.toBe(key); w.unmount()
})
it('shows discovery failures and still permits Empty board', async () => {
  vi.mocked(work.packs).mockRejectedValue(new Error('Pack discovery unavailable'))
  const w = await render(); expect(w.text()).toContain('Pack discovery unavailable')
  await w.get('form').trigger('submit'); await flushPromises(); expect(work.createBoard).toHaveBeenCalled(); w.unmount()
})

it('shows the duplicate-prefix message and its labeled Work error code in the wizard alert', async () => {
  vi.mocked(work.createBoard).mockRejectedValue(new ApiError({ message: 'initial schema failed: key prefix NEXT is taken', details: { code: 'key_prefix_taken' } }, 'Create board', 400))
  const w = await render()
  try {
    await w.get('form').trigger('submit'); await flushPromises()
    const alert = w.get('[role="alert"]').text()
    expect(alert).toContain('That item key prefix is already in use. Choose another prefix.')
    expect(alert).toMatch(/Error code:\s*key_prefix_taken/)
    expect(w.get('dialog').element.open).toBe(true)
  } finally { w.unmount() }
})

it('keeps an invalid installed pack visible and unavailable while valid choices still create', async () => {
  vi.mocked(work.packs).mockResolvedValue([...packs, { id: 'app:broken', title: 'Broken pack', version: '1', icon: 'tabler:alert-triangle', description: '', problem: { code: 'invalid_pack', message: 'Pack data is malformed' } }])
  const w = await render()
  expect(w.text()).toContain('Pack data is malformed')
  expect(w.getComponent(SelectButton).props('options')!.find((p: { id: string }) => p.id === 'app:broken')?.disabled).toBe(true)
  await w.get('form').trigger('submit'); await flushPromises()
  expect(w.emitted('created')).toEqual([['new']]); w.unmount()
})
it('updates description after creation and retries metadata on the same created board', async () => {
  vi.mocked(work.updateBoard).mockRejectedValueOnce(new ApiError({ message: 'Metadata service unavailable', details: { code: 'metadata_unavailable' } }, 'Save description', 503)).mockResolvedValue({ board_id: 'new', status: 'updated' })
  const w = await render(); await w.get('form').trigger('submit'); await flushPromises()
  expect(work.updateBoard).toHaveBeenCalledWith('new', { description: 'A shared delivery plan.' })
  const alert = w.get('[role="alert"]').text()
  expect(alert).toContain('Board created. Description was not saved. Metadata service unavailable')
  expect(alert).toMatch(/Error code:\s*metadata_unavailable/)
  expect(w.emitted('created')).toBeUndefined()
  await w.get('form').trigger('submit'); await flushPromises()
  expect(work.createBoard).toHaveBeenCalledOnce(); expect(w.emitted('created')).toEqual([['new']]); w.unmount()
})

it('identifies an unavailable pack even when invalid metadata omits its title and icon', async () => {
  vi.mocked(work.packs).mockResolvedValue([{ id: 'app:broken-metadata', problem: { code: 'invalid_pack', message: 'Pack title is malformed' } }])
  const w = await render()
  expect(w.text()).toContain('app:broken-metadata')
  expect(w.text()).toContain('Pack title is malformed'); w.unmount()
})

it('sends initial pack plugin configuration and freezes its retry identity until configuration changes', async () => {
  vi.mocked(work.packs).mockResolvedValue([{ ...packs[0], plugins: [{ plugin: 'app:log', installed: true }] }])
  vi.mocked(work.createBoard).mockRejectedValue(new Error('Try again'))
  const w = await render(); await w.getComponent(SelectButton).setValue('app:delivery')
  const input = w.get('textarea[aria-label="Initial configuration for app:log"]')
  await input.setValue('{"folder":"Documents"}')
  await w.get('form').trigger('submit'); await flushPromises()
  expect(vi.mocked(work.createBoard).mock.calls[0][3]).toMatchObject({ plugin_configs: { 'app:log': { folder: 'Documents' } } })
  const key = vi.mocked(work.createBoard).mock.calls[0][2]
  await w.get('form').trigger('submit'); await flushPromises()
  expect(vi.mocked(work.createBoard).mock.calls[1][2]).toBe(key)
  await input.setValue('{')
  await w.get('form').trigger('submit'); await flushPromises()
  expect(work.createBoard).toHaveBeenCalledTimes(2)
  await input.setValue('{"folder":"Archive"}')
  await w.get('form').trigger('submit'); await flushPromises()
  expect(vi.mocked(work.createBoard).mock.calls[2][2]).not.toBe(key)
  await w.getComponent(SelectButton).setValue('')
  await w.get('form').trigger('submit'); await flushPromises()
  expect(vi.mocked(work.createBoard).mock.calls.at(-1)![3]).toEqual({})
  w.unmount()
})
