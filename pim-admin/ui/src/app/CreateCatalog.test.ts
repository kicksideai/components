// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CreateCatalog from './CreateCatalog.vue'
import { successResponse } from '../test/proxy'

const post = vi.hoisted(() => vi.fn<(path: string, body: unknown) => Promise<unknown>>())
vi.mock('@wippy-fe/proxy', () => ({ api: { post } }))
beforeEach(() => { post.mockReset() })

it('creates a catalog from the shared dialog and reports its id to either host', async () => {
  post.mockResolvedValue(successResponse({ catalog_id: 'new-catalog', title: 'Apparel' }))
  const w = mount(CreateCatalog, { props: { visible: true } }); await flushPromises()
  await w.get('input').setValue(' Apparel ')
  await w.get('form').trigger('submit'); await flushPromises()
  expect(post).toHaveBeenCalledWith('/api/v1/pim/catalogs', expect.objectContaining({ title: 'Apparel' }))
  expect(w.emitted('created')).toEqual([['new-catalog']])
  expect(w.emitted('close')).toEqual([[]])
  w.unmount()
})
it('keeps a refused creation open with the draft and error', async () => {
  post.mockRejectedValue({ response: { status: 503, data: { success: false, message: 'Catalog creation is unavailable' } } })
  const w = mount(CreateCatalog, { props: { visible: true } }); await flushPromises()
  await w.get('input').setValue('Apparel'); await w.get('form').trigger('submit'); await flushPromises()
  expect(w.text()).toContain('Catalog creation is unavailable')
  expect((w.get('input').element as HTMLInputElement).value).toBe('Apparel')
  expect(w.emitted('close')).toBeUndefined()
  w.unmount()
})

it('replays the committed catalog when the create response is lost', async () => {
  const clock = vi.spyOn(Date, 'now').mockReturnValue(1_000)
  const catalogs = new Map<string, string>()
  post.mockImplementation(async (_path, body) => {
    const { idempotency_key: key, title } = body as { idempotency_key: string; title: string }
    const existing = catalogs.get(key)
    if (existing) return successResponse({ catalog_id: existing, title })

    const id = `catalog-${catalogs.size + 1}`
    catalogs.set(key, id)
    if (catalogs.size === 1) throw new Error('Connection lost')
    return successResponse({ catalog_id: id, title })
  })

  const w = mount(CreateCatalog, { props: { visible: true } })
  await w.get('input').setValue('Apparel')
  await w.get('form').trigger('submit')
  await flushPromises()
  expect(catalogs.size).toBe(1)
  const committedId = [...catalogs.values()][0]
  expect(w.emitted('created')).toBeUndefined()

  clock.mockReturnValue(2_000)
  await w.get('form').trigger('submit')
  await flushPromises()
  expect(catalogs.size).toBe(1)
  expect(w.emitted('created')).toEqual([[committedId]])
  w.unmount()
})

it('starts a new create intent when the dialog reopens', async () => {
  post.mockResolvedValue(successResponse({ catalog_id: 'new-catalog', title: 'Apparel' }))
  const w = mount(CreateCatalog, { props: { visible: false } })

  for (let i = 0; i < 2; i++) {
    await w.setProps({ visible: true })
    await w.get('input').setValue('Apparel')
    await w.get('form').trigger('submit')
    await flushPromises()
    await w.setProps({ visible: false })
  }

  expect(post).toHaveBeenCalledTimes(2)
  const [first, second] = post.mock.calls.map(([, body]) => body as { idempotency_key: string })
  expect(first.idempotency_key).toBeTruthy()
  expect(second.idempotency_key).toBeTruthy()
  expect(second.idempotency_key).not.toBe(first.idempotency_key)
  w.unmount()
})
