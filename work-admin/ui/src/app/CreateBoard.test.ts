// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import SelectButton from 'primevue/selectbutton'
import ToggleSwitch from 'primevue/toggleswitch'
import { beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CreateBoard from './CreateBoard.vue'
import { work } from '../api'
vi.mock('../api', () => ({ work: { createBoard: vi.fn(), packs: vi.fn() } }))
const packs = [
  { id: 'app:delivery', title: 'Delivery', version: '1.0.0', icon: 'tabler:layout-kanban', description: 'Plan delivery.', requires: [], plugins: [] },
  { id: 'app:cases', title: 'Cases', version: '1.1.0', icon: 'tabler:inbox', description: 'Resolve requests.', requires: ['app:missing'], plugins: [{ id: 'app:missing', installed: false }] },
]
beforeEach(() => { vi.clearAllMocks(); vi.mocked(work.packs).mockResolvedValue(packs); vi.mocked(work.createBoard).mockResolvedValue({ board_id: 'new' }) })
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
  expect(work.createBoard).toHaveBeenCalledWith('Next milestone', { key_prefix: 'NEXT' }, expect.any(String), 'A shared delivery plan.', { pack: 'app:delivery', version: '1.0.0', starter: true })
  expect(w.emitted('created')).toEqual([['new']]); w.unmount()
})
it('creates an empty board without a local schema and keeps the retry key until the request changes', async () => {
  vi.mocked(work.createBoard).mockRejectedValue(new Error('Try again'))
  const w = await render(); await w.get('form').trigger('submit'); await flushPromises()
  expect(work.createBoard).toHaveBeenLastCalledWith('Next milestone', { key_prefix: 'NEXT' }, expect.any(String), 'A shared delivery plan.', {})
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
