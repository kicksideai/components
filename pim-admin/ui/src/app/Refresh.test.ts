// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { beforeEach, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import SelectButton from 'primevue/selectbutton'
import LayoutEditor from './builder/SchemaBuilder.vue'
import HistoryPanel from './HistoryPanel.vue'
import { pim } from '../api'
import { createSchema } from '../test/fixtures'
import { events, visibility } from '../test/setup'
vi.mock('../api', () => ({ pim: { schema: vi.fn(), schemaOptions: vi.fn(), listCatalogs: vi.fn(), catalogSummary: vi.fn(), history: vi.fn() } }))
beforeEach(() => {
  events.clear()
  vi.clearAllMocks()
  vi.mocked(pim.schemaOptions).mockResolvedValue({ types: [], scopes: [], plugins: [], link_kinds: [] })
  vi.mocked(pim.schema).mockResolvedValue(createSchema())
  vi.mocked(pim.catalogSummary).mockResolvedValue({ catalog_id: 'cat', title: '', access: { read: true, write: true, admin: true } })
  vi.mocked(pim.listCatalogs).mockResolvedValue({ catalogs: [] })
  vi.mocked(pim.history).mockResolvedValue({ entries: [], as_of: 1 })
})
it('refreshes the layout on return and notifications while preserving a dirty layout', async () => {
  const w = mount(LayoutEditor, { props: { catalogId: 'cat' } }); await flushPromises()
  await w.findAll('[role=tab]').find(b => b.text() === 'Form layout')!.trigger('click')
  const before = vi.mocked(pim.schema).mock.calls.length
  events.get('component.cat')?.(); await flushPromises()
  expect(pim.schema).toHaveBeenCalledTimes(before + 1)
  await w.getComponent(SelectButton).setValue('half'); await flushPromises()
  const dirty = vi.mocked(pim.schema).mock.calls.length
  events.get('component.cat')?.(); await visibility.task!(); await flushPromises()
  expect(pim.schema).toHaveBeenCalledTimes(dirty)
  expect(w.text()).toContain('Unsaved changes')
  w.unmount(); expect(events.has('component.cat')).toBe(false)
})
it('refetches catalog history on notifications and disposes the subscription', async () => {
  const w = mount(HistoryPanel, { props: { catalogId: 'cat' } }); await flushPromises()
  const before = vi.mocked(pim.history).mock.calls.length
  events.get('component.cat')?.(); await flushPromises()
  expect(pim.history).toHaveBeenCalledTimes(before + 1)
  w.unmount(); expect(events.has('component.cat')).toBe(false)
})
