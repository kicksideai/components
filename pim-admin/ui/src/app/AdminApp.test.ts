// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import AdminApp from './AdminApp.vue'
import SettingsApp from './SettingsApp.vue'
import SchemaBuilder from './builder/SchemaBuilder.vue'
import { pim } from '../api'
import { ApiError } from '../shared/transport'
import { createSchema, deferred } from '../test/fixtures'
import { hostProps, events } from '../test/setup'

vi.mock('../api', () => ({ pim: Object.fromEntries(['listCatalogs', 'catalogSummary', 'schema', 'schemaOptions'].map(key => [key, vi.fn()])) }))
const row = (id: string, admin = true) => ({ catalog_id: id, title: id, access: { read: true, write: true, admin } })
beforeEach(() => {
  vi.clearAllMocks()
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
it('searches all catalog pages, including pages with no administrative catalogs', async () => {
  const last = deferred<Awaited<ReturnType<typeof pim.listCatalogs>>>()
  vi.mocked(pim.listCatalogs)
    .mockResolvedValueOnce({ catalogs: [row('Northstar Apparel')], after: 10 })
    .mockResolvedValueOnce({ catalogs: [row('Northstar Reader', false)], after: 20 })
    .mockReturnValueOnce(last.promise)
  const w = mount(AdminApp)
  try {
    await flushPromises()
    await w.get('input[type=search]').setValue('  NORTHSTAR  ')
    await flushPromises()
    expect(vi.mocked(pim.listCatalogs).mock.calls).toEqual([[undefined], [10], [20]])
    expect(w.get('aside [role=status]').text()).toContain('Searching catalogs')
    last.resolve({ catalogs: [row('Northstar Outdoor'), row('Hardware')] })
    await flushPromises()
    expect(w.findAll('.pim-rail-row').map(row => row.text())).toEqual(['Northstar Apparel', 'Northstar Outdoor'])
    await w.get('input[type=search]').setValue('does not exist')
    expect(w.get('aside [role=status]').text()).toBe('No matching catalogs.')
    expect(pim.listCatalogs).toHaveBeenCalledTimes(3)
  } finally { w.unmount() }
})
it('stops searching when cleared and keeps the cursor for manual paging', async () => {
  const pending = deferred<Awaited<ReturnType<typeof pim.listCatalogs>>>()
  vi.mocked(pim.listCatalogs)
    .mockResolvedValueOnce({ catalogs: [row('Apparel')], after: 10 })
    .mockReturnValueOnce(pending.promise)
    .mockResolvedValueOnce({ catalogs: [row('Hardware')] })
  const w = mount(AdminApp)
  try {
    await flushPromises()
    const search = w.get('input[type=search]')
    await search.setValue('hardware')
    expect(pim.listCatalogs).toHaveBeenLastCalledWith(10)
    await search.setValue('')
    pending.resolve({ catalogs: [row('Footwear')], after: 20 })
    await flushPromises()
    expect(pim.listCatalogs).toHaveBeenCalledTimes(2)
    await w.findAll('button').find(button => button.text().includes('Load more catalogs'))!.trigger('click')
    await flushPromises()
    expect(pim.listCatalogs).toHaveBeenLastCalledWith(20)
    expect(w.findAll('.pim-rail-row').map(row => row.text())).toEqual(['Apparel', 'Footwear', 'Hardware'])
  } finally { w.unmount() }
})
it('shows a typed error instead of an empty result when a search page fails', async () => {
  vi.mocked(pim.listCatalogs)
    .mockResolvedValueOnce({ catalogs: [row('Apparel')], after: 10 })
    .mockRejectedValueOnce(new ApiError({ message: 'Catalogs are temporarily unavailable.', details: { code: 'catalog_directory_unavailable' } }, 'catalog list', 503))
  const w = mount(AdminApp)
  try {
    await flushPromises()
    await w.get('input[type=search]').setValue('hardware')
    await flushPromises()
    expect(w.get('aside [role=alert]').text()).toContain('Catalogs are temporarily unavailable.')
    expect(w.get('aside [role=alert]').text()).toContain('catalog_directory_unavailable')
    expect(w.text()).not.toContain('No matching catalogs')
    expect(pim.listCatalogs).toHaveBeenCalledTimes(2)
  } finally { w.unmount() }
})
it('keeps transport errors visible and removes subscriptions when unmounted', async () => {
  vi.mocked(pim.listCatalogs).mockRejectedValue(new Error('Catalog directory unavailable'))
  const w = mount(AdminApp); await flushPromises()
  expect(w.text()).toContain('Catalog directory unavailable')
  expect(events.has('component.meta.changed')).toBe(true)
  w.unmount(); expect(events.has('component.meta.changed')).toBe(false)
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
