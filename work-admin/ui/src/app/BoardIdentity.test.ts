// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { getButton } from '../test/controls'
import { beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import BoardIdentity from './BoardIdentity.vue'
import { work } from '../api'
import type { BoardRow } from '../types'
import { deferred } from '../test/fixtures'
vi.mock('../api', () => ({ work: { updateBoard: vi.fn() } }))
const board: BoardRow = { board_id: 'b', title: 'Delivery', description: 'Ship the next milestone.', access: { read: true, write: true, admin: true } }
beforeEach(() => vi.clearAllMocks())
it('shows the board description and saves only edited identity fields through Work', async () => {
  vi.mocked(work.updateBoard).mockResolvedValue({ board_id: 'b', status: 'updated' })
  const w = mount(BoardIdentity, { props: { board } })
  expect(w.text()).toContain(board.description)
  await w.get('button').trigger('click')
  await w.get('input').setValue('  Release delivery  ')
  await w.get('textarea').setValue('')
  await w.get('form').trigger('submit'); await flushPromises()
  expect(work.updateBoard).toHaveBeenCalledWith('b', { title: 'Release delivery', description: '' })
  expect(w.emitted('saved')).toEqual([[]]); expect(w.find('form').exists()).toBe(false)
  w.unmount()
})
it('cancels locally, accepts an unchanged edit, and refuses an empty title', async () => {
  const w = mount(BoardIdentity, { props: { board } })
  await w.get('button').trigger('click'); await w.get('input').setValue('Changed')
  await getButton(w, 'Cancel').trigger('click'); expect(w.text()).toContain('Delivery')
  await w.get('button').trigger('click'); await w.get('form').trigger('submit')
  expect(w.text()).toContain('Nothing changed.'); expect(work.updateBoard).not.toHaveBeenCalled()
  await w.get('button').trigger('click'); await w.get('input').setValue('  ')
  expect(getButton(w, 'Save').attributes('disabled')).toBeDefined()
  await w.get('form').trigger('submit'); expect(work.updateBoard).not.toHaveBeenCalled()
  w.unmount()
})
it('keeps a failed edit available for retry and guards duplicate saves', async () => {
  const pending = deferred<Awaited<ReturnType<typeof work.updateBoard>>>()
  vi.mocked(work.updateBoard).mockReturnValue(pending.promise)
  const w = mount(BoardIdentity, { props: { board } })
  await w.get('button').trigger('click'); await w.get('input').setValue('Changed')
  await w.get('form').trigger('submit'); await w.get('form').trigger('submit')
  expect(work.updateBoard).toHaveBeenCalledTimes(1)
  pending.reject(new Error('Access changed')); await flushPromises()
  expect(w.get('[role=alert]').text()).toBe('Access changed')
  expect(w.get<HTMLInputElement>('input').element.value).toBe('Changed')
  expect(w.emitted('saved')).toBeUndefined(); w.unmount()
})
it('hides identity editing without ADMIN and closes it on revocation', async () => {
  const w = mount(BoardIdentity, { props: { board } })
  await w.get('button').trigger('click')
  await w.setProps({ board: { ...board, access: { read: true, write: true, admin: false } } })
  expect(w.find('form').exists()).toBe(false); expect(w.find('button').exists()).toBe(false)
  w.unmount()
})
it('reports an unchanged answer from Work without losing the refresh', async () => {
  vi.mocked(work.updateBoard).mockResolvedValue({ board_id: 'b', status: 'unchanged' })
  const w = mount(BoardIdentity, { props: { board } })
  await w.get('button').trigger('click'); await w.get('input').setValue('New title')
  await w.get('form').trigger('submit'); await flushPromises()
  expect(w.text()).toContain('Nothing changed.'); expect(w.emitted('saved')).toEqual([[]]); w.unmount()
})

it('edits the board icon with the shared picker and sends only the changed icon', async () => {
  vi.mocked(work.updateBoard).mockResolvedValue({ board_id: 'b', status: 'updated' })
  const w = mount(BoardIdentity, { props: { board: { ...board, icon: 'tabler:home' } } })
  await getButton(w, 'Edit board').trigger('click'); await flushPromises()
  const picker = w.get('wc-icon-picker')
  expect(picker.attributes('value')).toBe('tabler:home')
  picker.element.dispatchEvent(new CustomEvent('select', { detail: 'tabler:rocket' })); await flushPromises()
  await w.get('form').trigger('submit'); await flushPromises()
  expect(work.updateBoard).toHaveBeenCalledWith('b', { icon: 'tabler:rocket' }); w.unmount()
})

it('shows the named opening app and changes it through the board update', async () => {
  vi.mocked(work.updateBoard).mockResolvedValue({ board_id: 'b', status: 'updated' })
  const boardApps = [{ id: 'app:tracker', title: 'Tracker' }, { id: 'app:releases', title: 'Release workspace' }]
  const w = mount(BoardIdentity, { props: { detail: true, board: { ...board, ui_app: 'app:tracker' }, boardApps } })
  try {
    expect(w.text()).toContain('Opens in Tracker')
    await getButton(w, 'Edit board').trigger('click')
    const { default: Select } = await import('primevue/select')
    await w.getComponent(Select).setValue('app:releases')
    await w.get('form').trigger('submit'); await flushPromises()
    expect(work.updateBoard).toHaveBeenCalledWith('b', { ui_app: 'app:releases' })
  } finally { w.unmount() }
})
