// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { settingsTab } from '../test/settings-navigation'
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
const loadMore = (w: ReturnType<typeof mount>) => w.get('.pim-catalog-picker').findAll('button').find(button => button.text() === 'Load more catalogs')!
async function typeSearch(w: ReturnType<typeof mount>, ...values: string[]) {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  try {
    const search = w.get('input[type=search]')
    for (const value of values) await search.setValue(value)
    await vi.advanceTimersByTimeAsync(250)
  } finally { vi.useRealTimers() }
  await flushPromises()
}
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
  expect(w.findAll('.pim-catalog-row').map(row => row.get('.picker-name').text())).toEqual(['Apparel'])
  await w.get('.pim-catalog-row').trigger('click')
  expect(w.get('kickside-pim-catalog-settings').attributes()).toMatchObject({ 'catalog-id': 'Apparel', embedded: 'true' })
  expect(w.findAll('a')).toHaveLength(0)
  w.unmount()
})
it('paginates and searches the administration rail', async () => {
  const w = mount(AdminApp); await flushPromises()
  vi.mocked(pim.listCatalogs).mockResolvedValue({ catalogs: [row('Hardware')] })
  await w.findAll('button').find(button => button.text().includes('Load more catalogs'))!.trigger('click'); await flushPromises()
  expect(pim.listCatalogs).toHaveBeenLastCalledWith(10, undefined)
  expect(w.findAll('.pim-catalog-row')).toHaveLength(2)
  await w.get('.pim-catalog-row').trigger('click')
  await w.get('kickside-pim-catalog-settings').trigger('open-catalog-picker')
  vi.mocked(pim.listCatalogs).mockResolvedValueOnce({ catalogs: [row('Hardware')] })
  await typeSearch(w, 'hard')
  expect(pim.listCatalogs).toHaveBeenLastCalledWith(undefined, 'hard')
  expect(w.findAll('.pim-catalog-row').map(row => row.get('.picker-name').text())).toEqual(['Hardware'])
  expect(w.find('kickside-pim-catalog-settings').exists()).toBe(false)
  expect(w.find('.pim-catalog-picker').exists()).toBe(true)
  w.unmount()
})
it('searches the directory and reads additional matching pages only on request', async () => {
  const last = deferred<Awaited<ReturnType<typeof pim.listCatalogs>>>()
  vi.mocked(pim.listCatalogs)
    .mockResolvedValueOnce({ catalogs: [row('Apparel')], after: 10 })
    .mockResolvedValueOnce({ catalogs: [row('Northstar Outdoor')], after: 1 })
    .mockReturnValueOnce(last.promise)
    .mockResolvedValueOnce({ catalogs: [] })
  const w = mount(AdminApp)
  try {
    await flushPromises()
    await typeSearch(w, 'north', '  NORTHSTAR  ')
    expect(vi.mocked(pim.listCatalogs).mock.calls).toEqual([[undefined, undefined], [undefined, 'NORTHSTAR']])
    expect(w.get('.pim-catalog-row .picker-name').text()).toBe('Northstar Outdoor')
    await loadMore(w).trigger('click')
    expect(pim.listCatalogs).toHaveBeenLastCalledWith(1, 'NORTHSTAR')
    expect(w.get('.pim-catalog-picker [role=status]').text()).toBe('Searching catalogs…')
    last.resolve({ catalogs: [row('Northstar Hardware')] })
    await flushPromises()
    expect(w.findAll('.pim-catalog-row').map(row => row.get('.picker-name').text())).toEqual(['Northstar Outdoor', 'Northstar Hardware'])
    await typeSearch(w, 'does not exist')
    expect(w.get('.pim-catalog-picker [role=status]').text()).toContain('No catalogs match.')
    expect(pim.listCatalogs).toHaveBeenCalledTimes(4)
  } finally { w.unmount() }
})
it('ignores an obsolete page response after the search is cleared', async () => {
  const pending = deferred<Awaited<ReturnType<typeof pim.listCatalogs>>>()
  vi.mocked(pim.listCatalogs)
    .mockResolvedValueOnce({ catalogs: [row('Apparel')], after: 10 })
    .mockResolvedValueOnce({ catalogs: [row('Hardware')], after: 1 })
    .mockReturnValueOnce(pending.promise)
    .mockResolvedValueOnce({ catalogs: [row('Apparel')], after: 10 })
  const w = mount(AdminApp)
  try {
    await flushPromises()
    await typeSearch(w, 'hardware')
    await loadMore(w).trigger('click')
    expect(pim.listCatalogs).toHaveBeenLastCalledWith(1, 'hardware')
    await typeSearch(w, '')
    expect(pim.listCatalogs).toHaveBeenLastCalledWith(undefined, undefined)
    pending.resolve({ catalogs: [row('More hardware')], after: 2 })
    await flushPromises()
    expect(pim.listCatalogs).toHaveBeenCalledTimes(4)
    expect(w.findAll('.pim-catalog-row').map(row => row.get('.picker-name').text())).toEqual(['Apparel'])
    expect(loadMore(w).exists()).toBe(true)
  } finally { w.unmount() }
})
it('shows a typed error and retains the cursor to retry a failed page', async () => {
  vi.mocked(pim.listCatalogs)
    .mockResolvedValueOnce({ catalogs: [row('Apparel')], after: 10 })
    .mockResolvedValueOnce({ catalogs: [row('Hardware')], after: 1 })
    .mockRejectedValueOnce(new ApiError({ message: 'Catalogs are temporarily unavailable.', details: { code: 'catalog_directory_unavailable' } }, 'catalog list', 503))
    .mockResolvedValueOnce({ catalogs: [row('More hardware')] })
  const w = mount(AdminApp)
  try {
    await flushPromises()
    await typeSearch(w, 'hardware')
    await loadMore(w).trigger('click')
    await flushPromises()
    expect(w.get('.pim-catalog-picker [role=alert]').text()).toContain('Catalogs are temporarily unavailable.')
    expect(w.get('.pim-catalog-picker [role=alert]').text()).toContain('catalog_directory_unavailable')
    expect(w.text()).not.toContain('No catalogs match')
    expect(loadMore(w).attributes('disabled')).toBeDefined()
    const retry = w.get('.pim-catalog-picker [role=alert]').findAll('button').find(button => button.text() === 'Retry')!
    await retry.trigger('click'); await flushPromises()
    expect(vi.mocked(pim.listCatalogs).mock.calls).toEqual([[undefined, undefined], [undefined, 'hardware'], [1, 'hardware'], [1, 'hardware']])
    expect(w.findAll('.pim-catalog-row').map(row => row.get('.picker-name').text())).toEqual(['Hardware', 'More hardware'])
  } finally { w.unmount() }
})
it('ignores unrelated metadata and updates a loaded catalog title without resetting the directory', async () => {
  vi.mocked(pim.listCatalogs)
    .mockResolvedValueOnce({ catalogs: [row('Apparel')], after: 10 })
    .mockResolvedValueOnce({ catalogs: [row('Hardware')], after: 20 })
  const w = mount(AdminApp)
  try {
    await flushPromises()
    await loadMore(w).trigger('click'); await flushPromises()
    const changed = events.get('component.meta.changed')!
    changed({ event: 'component.meta.changed', component_id: 'Other', meta: { title: 'Hardware copy' } })
    changed({ data: { event: 'component.meta.changed', component_id: 'Hardware', meta: { title: 'Updated hardware' } } })
    await flushPromises()
    expect(w.findAll('.pim-catalog-row').map(item => item.get('.picker-name').text())).toEqual(['Apparel', 'Updated hardware'])
    expect(loadMore(w).exists()).toBe(true)
    expect(vi.mocked(pim.listCatalogs).mock.calls).toEqual([[undefined, undefined], [10, undefined]])
  } finally { w.unmount() }
})
it('keeps transport errors visible and removes subscriptions when unmounted', async () => {
  vi.mocked(pim.listCatalogs).mockRejectedValue(new Error('Catalog directory unavailable'))
  const w = mount(AdminApp); await flushPromises()
  expect(w.text()).toContain('Catalog directory unavailable')
  expect(events.has('component.meta.changed')).toBe(true)
  w.unmount(); expect(events.has('component.meta.changed')).toBe(false)
})
it('offers Retry and opens the sole administrative catalog after recovery', async () => {
  const first = deferred<Awaited<ReturnType<typeof pim.listCatalogs>>>()
  const retry = deferred<Awaited<ReturnType<typeof pim.listCatalogs>>>()
  vi.mocked(pim.listCatalogs).mockReturnValueOnce(first.promise).mockReturnValueOnce(retry.promise)
  const w = mount(AdminApp); await flushPromises()
  expect(w.get('[role=status]').text()).toBe('Loading catalogs…')
  first.reject(new Error('Catalog directory unavailable')); await flushPromises()
  expect(w.get('[role=alert]').text()).toContain('Catalog directory unavailable')
  expect(w.find('.pim-catalog-row').exists()).toBe(false)
  await w.findAll('button').find(b => b.text() === 'Retry')!.trigger('click')
  expect(w.find('[role=alert]').exists()).toBe(false)
  expect(w.get('[role=status]').text()).toBe('Loading catalogs…')
  retry.resolve({ catalogs: [row('Apparel')] }); await flushPromises()
  expect(w.get('kickside-pim-catalog-settings').attributes('catalog-id')).toBe('Apparel')
  expect(w.find('.pim-catalog-picker').exists()).toBe(false)
  await w.get('kickside-pim-catalog-settings').trigger('open-catalog-picker')
  expect(w.find('.pim-catalog-picker').exists()).toBe(true)
  expect(w.get('.pim-catalog-row').attributes('aria-current')).toBe('true')
  w.unmount()
})
it('keeps selection independent in simultaneous System mounts', async () => {
  const first = mount(AdminApp), second = mount(AdminApp); await flushPromises()
  await first.get('.pim-catalog-row').trigger('click')
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
  expect(w.get('.kx-settings-rail').findAll('.kx-settings-rail-item').map(entry => entry.text())).toContain('History')
  await settingsTab(w, 'Families')
  expect(w.text()).toContain('Form layout')
  w.unmount()
})
