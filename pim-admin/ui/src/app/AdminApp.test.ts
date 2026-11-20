// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import AdminApp from './AdminApp.vue'
import SettingsApp from './SettingsApp.vue'
import SchemaBuilder from './builder/SchemaBuilder.vue'
import { pim } from '../api'
import { createSchema, deferred } from '../test/fixtures'
import { hostProps, events } from '../test/setup'

vi.mock('../api', () => ({ pim: Object.fromEntries(['listCatalogs', 'catalogSummary', 'schema', 'schemaOptions'].map(key => [key, vi.fn()])) }))
const row = (id: string, admin = true) => ({ catalog_id: id, title: id, access: { read: true, write: true, admin } })
beforeEach(() => {
  hostProps.value = {}
  vi.mocked(pim.listCatalogs).mockResolvedValue({ catalogs: [row('Apparel'), row('Reader', false)], after: 10 })
  vi.mocked(pim.catalogSummary).mockImplementation(async id => row(id))
  vi.mocked(pim.schema).mockResolvedValue(createSchema())
  vi.mocked(pim.schemaOptions).mockResolvedValue({ types: [], scopes: [], plugins: [], link_kinds: [] })
})
it('selects only administrative catalogs into the embedded settings component', async () => {
  const w = mount(AdminApp); await flushPromises()
  expect(w.findAll('.pim-rail-row').map(row => row.text())).toEqual(['Apparel'])
  await w.get('.pim-rail-row').trigger('click')
  expect(w.get('kickside-pim-catalog-settings').attributes()).toMatchObject({ 'catalog-id': 'Apparel', embedded: 'true' })
  expect(w.findAll('a')).toHaveLength(0)
  w.unmount()
})
it('paginates and searches the administration rail', async () => {
  const w = mount(AdminApp); await flushPromises()
  vi.mocked(pim.listCatalogs).mockResolvedValue({ catalogs: [row('Hardware')] })
  await w.findAll('button').find(button => button.text().includes('Load more catalogs'))!.trigger('click'); await flushPromises()
  expect(pim.listCatalogs).toHaveBeenLastCalledWith(10)
  expect(w.findAll('.pim-rail-row')).toHaveLength(2)
  await w.get('input[type=search]').setValue('hard')
  expect(w.findAll('.pim-rail-row').map(row => row.text())).toEqual(['Hardware'])
  w.unmount()
})
it('keeps transport errors visible and removes subscriptions when unmounted', async () => {
  vi.mocked(pim.listCatalogs).mockRejectedValue(new Error('Catalog directory unavailable'))
  const w = mount(AdminApp); await flushPromises()
  expect(w.text()).toContain('Catalog directory unavailable')
  expect(events.has('component.meta.changed')).toBe(true)
  w.unmount(); expect(events.has('component.meta.changed')).toBe(false)
})
it('offers Retry on a failed catalog list and prompts for selection only after it recovers', async () => {
  const first = deferred<Awaited<ReturnType<typeof pim.listCatalogs>>>()
  const retry = deferred<Awaited<ReturnType<typeof pim.listCatalogs>>>()
  vi.mocked(pim.listCatalogs).mockReturnValueOnce(first.promise).mockReturnValueOnce(retry.promise)
  const w = mount(AdminApp); await flushPromises()
  expect(w.get('[role=status]').text()).toBe('Loading catalogs…')
  first.reject(new Error('Catalog directory unavailable')); await flushPromises()
  expect(w.get('[role=alert]').text()).toContain('Catalog directory unavailable')
  expect(w.text()).not.toContain('Select a catalog')
  await w.findAll('button').find(b => b.text() === 'Retry')!.trigger('click')
  expect(w.find('[role=alert]').exists()).toBe(false)
  expect(w.get('[role=status]').text()).toBe('Loading catalogs…')
  retry.resolve({ catalogs: [row('Apparel')] }); await flushPromises()
  expect(w.text()).toContain('Select a catalog')
  await w.get('.pim-rail-row').trigger('click')
  expect(w.get('kickside-pim-catalog-settings').attributes('catalog-id')).toBe('Apparel')
  w.unmount()
})
it('keeps selection independent in simultaneous System mounts', async () => {
  const first = mount(AdminApp), second = mount(AdminApp); await flushPromises()
  await first.get('.pim-rail-row').trigger('click')
  expect(first.find('kickside-pim-catalog-settings').exists()).toBe(true)
  expect(second.find('kickside-pim-catalog-settings').exists()).toBe(false)
  first.unmount(); second.unmount()
})
it('ignores an old title response when the host selects another catalog', async () => {
  hostProps.value = { catalogId: 'first', embedded: true }
  const old = deferred<ReturnType<typeof row>>()
  vi.mocked(pim.catalogSummary).mockImplementation(id => id === 'first' ? old.promise : Promise.resolve(row('Second catalog')))
  const w = mount(SettingsApp); await flushPromises()
  hostProps.value = { catalogId: 'second', embedded: true }; await flushPromises()
  old.resolve(row('Old catalog')); await flushPromises()
  expect(w.getComponent(SchemaBuilder).props()).toMatchObject({ catalogId: 'second', title: 'Second catalog', embedded: true })
  expect(w.text()).not.toContain('Old catalog')
  expect(w.findAll('[role=tab]').map(tab => tab.text())).toContain('History')
  expect(w.text()).toContain('Form layout')
  w.unmount()
})
