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
it('opens a sole board directly and lets the operator return to the rail', async () => {
  const wrapper = mount(AdminApp); wrappers.push(wrapper); await flushPromises()
  expect(wrapper.findAll('.kx-head')).toHaveLength(0)
  expect(wrapper.find('.work-board-directory').exists()).toBe(false)
  const settings = wrapper.get('kickside-work-board-settings')
  expect(settings.attributes()).toMatchObject({ 'board-id': 'b', embedded: 'true' })
  await settings.trigger('back-to-boards'); await flushPromises()
  expect(wrapper.find('.work-board-directory').exists()).toBe(true)
  expect(wrapper.get('.kx-railhead-title b').text()).toBe('1')
  expect(wrapper.get('.work-rail-row[aria-current=true]').text()).toBe('DeliveryWORK · 0/0 open')
})
it.each([false, true])('uses a single settings surface with embedded=%s', async embedded => {
  const wrapper = mount(BoardSettings, { props: { boardId: 'b', embedded } }); wrappers.push(wrapper); await flushPromises()
  expect(wrapper.findAll('.work-ia-head')).toHaveLength(1)
  const rail = wrapper.get('.work-section-layout > nav[aria-label="Board settings sections"]')
  expect(rail.findAll('.kx-settings-rail-item').map(option => option.text())).toEqual([
    embedded ? 'All boards' : 'Back to board', 'General', 'Items', 'Workflow', 'Access', 'Plugins',
  ])
  expect(rail.get('.kx-settings-rail-group').text()).toBe('Delivery')
  expect(wrapper.get('.kx-main-scroll > header h1').text()).toBe('General')
  expect(rail.get('[aria-current="true"]').text()).toBe('General')
  await rail.findAll('.kx-settings-rail-item').find(option => option.text() === 'Workflow')!.trigger('click')
  expect(rail.get('[aria-current="true"]').text()).toBe('Workflow')
  await rail.get('[aria-current="true"]').trigger('click')
  expect(rail.get('[aria-current="true"]').text()).toBe('Workflow')
  expect(wrapper.get('.kx-main-scroll').text()).toContain('How does work move?')
  expect(wrapper.get('.kx-main-scroll > header h1').text()).toBe('Workflow')
})
it.each<[Component, Declaration]>([
  [FieldsEditor, { fields: [{ code: 'title', form: 'text' }] }],
  [TypesEditor, { item_types: [{ id: 'task', process: 'flow', fields: [] }] }],
  [RelationsEditor, { relation_types: [{ id: 'related', cardinality: 'many' }] }],
])('collapses definitions by default and expands the existing editor in place', async (component, declaration) => {
  const wrapper = mount(component, { props: { draft: reactive(structuredClone(declaration)) } }); wrappers.push(wrapper)
  expect(wrapper.get('.work-definition-toggle').attributes('aria-expanded')).toBe('false')
  expect(wrapper.get('.work-definition-body').attributes('style')).toContain('display: none')
  await wrapper.get('.work-definition-toggle').trigger('click')
  expect(wrapper.get('.work-definition-body').attributes('style') ?? '').not.toContain('display: none')
})
