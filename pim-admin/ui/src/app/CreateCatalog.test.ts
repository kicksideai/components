// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CreateCatalog from './CreateCatalog.vue'
import { pim } from '../api'
vi.mock('../api', () => ({ pim: { createCatalog: vi.fn() } }))
it('creates a catalog from the shared dialog and reports its id to either host', async () => {
  vi.mocked(pim.createCatalog).mockResolvedValue({ catalog_id: 'new-catalog', title: 'Apparel' })
  const w = mount(CreateCatalog, { props: { visible: true } }); await flushPromises()
  await w.get('input').setValue(' Apparel ')
  await w.get('form').trigger('submit'); await flushPromises()
  expect(pim.createCatalog).toHaveBeenCalledWith('Apparel')
  expect(w.emitted('created')).toEqual([['new-catalog']])
  expect(w.emitted('close')).toEqual([[]])
  w.unmount()
})
it('keeps a refused creation open with the draft and error', async () => {
  vi.mocked(pim.createCatalog).mockRejectedValue(new Error('Catalog creation is unavailable'))
  const w = mount(CreateCatalog, { props: { visible: true } }); await flushPromises()
  await w.get('input').setValue('Apparel'); await w.get('form').trigger('submit'); await flushPromises()
  expect(w.text()).toContain('Catalog creation is unavailable')
  expect((w.get('input').element as HTMLInputElement).value).toBe('Apparel')
  expect(w.emitted('close')).toBeUndefined()
  w.unmount()
})
