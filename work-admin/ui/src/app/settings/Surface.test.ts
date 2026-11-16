// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { reactive, type Component } from 'vue'
import AdminApp from './AdminApp.vue'
import BoardSettings from './BoardSettings.vue'
import FieldsEditor from './FieldsEditor.vue'
import TypesEditor from './TypesEditor.vue'
import RelationsEditor from './RelationsEditor.vue'
import { work } from '../../api'
import { schema } from '../../test/fixtures'
import { emptyOptions, type Declaration } from '../../types'
vi.mock('../../api', () => ({ work: { boards: vi.fn(), schema: vi.fn(), options: vi.fn() } }))
const wrappers: ReturnType<typeof mount>[] = []
beforeEach(() => {
  vi.mocked(work.boards).mockResolvedValue([{ board_id: 'b', title: 'Delivery', key_prefix: 'WORK', generation: 1, access: { read: true, write: true, admin: true } }])
  vi.mocked(work.schema).mockResolvedValue(schema())
  vi.mocked(work.options).mockResolvedValue({ ...emptyOptions(), access: { read: true, write: true, admin: true }, schema_options: { plugins: [] } })
})
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()))
it('keeps System headerless before and after selecting a board from its rail', async () => {
  const wrapper = mount(AdminApp); wrappers.push(wrapper); await flushPromises()
  expect(wrapper.findAll('.kx-head')).toHaveLength(0)
  expect(wrapper.get('.work-railhead [aria-label="1 board"]').text()).toBe('1')
  await wrapper.get('[aria-label="Settings for Delivery"]').trigger('click'); await flushPromises()
  expect(wrapper.findAll('.kx-head')).toHaveLength(0)
  expect(wrapper.get('kickside-work-board-settings').attributes('board-id')).toBe('b')
  expect(wrapper.get('kickside-work-board-settings').attributes('embedded')).toBe('true')
})
it.each([false, true])('uses a single settings surface with embedded=%s', async embedded => {
  const wrapper = mount(BoardSettings, { props: { boardId: 'b', embedded } }); wrappers.push(wrapper); await flushPromises()
  expect(wrapper.findAll('.kx-head')).toHaveLength(embedded ? 0 : 1)
  expect(wrapper.get('[role=tablist]').text()).toContain('Fields')
  expect(wrapper.find('.work-detail-head').exists()).toBe(embedded)
})
it.each<[Component, Declaration]>([
  [FieldsEditor, { fields: [{ code: 'title', form: 'text' }] }],
  [TypesEditor, { item_types: [{ id: 'task', process: 'flow', fields: [] }] }],
  [RelationsEditor, { relation_types: [{ id: 'related', cardinality: 'many' }] }],
])('collapses definitions by default and expands the existing editor in place', async (component, declaration) => {
  const wrapper = mount(component, { props: { draft: reactive(structuredClone(declaration)), advanced: false } }); wrappers.push(wrapper)
  expect(wrapper.get('[aria-expanded]').attributes('aria-expanded')).toBe('false')
  expect(wrapper.get('.work-definition-body').attributes('style')).toContain('display: none')
  await wrapper.get('[aria-expanded]').trigger('click')
  expect(wrapper.get('.work-definition-body').attributes('style') ?? '').not.toContain('display: none')
})
