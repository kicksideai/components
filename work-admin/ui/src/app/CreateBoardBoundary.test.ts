// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { api } from '@wippy-fe/proxy'
import CreateBoard from './CreateBoard.vue'
it('sends the wizard create body through the declared HTTP boundary then updates metadata', async () => {
  vi.mocked(api.get).mockResolvedValue({ data: { success: true, data: { packs: [] } } })
  vi.mocked(api.post).mockImplementation(async (path: string, body: unknown) => {
    if (path === '/api/v1/work/boards') {
      expect(Object.keys(body as object).sort()).toEqual(['declaration', 'idempotency_key', 'title'])
      return { data: { success: true, data: { board_id: 'created' } } }
    }
    expect(path).toBe('/api/v1/work/boards/created/update')
    expect(body).toEqual({ description: 'Team work' })
    return { data: { success: true, data: { board_id: 'created', status: 'updated' } } }
  })
  const w = mount(CreateBoard, { props: { visible: true } }); await flushPromises()
  await w.get('#board-title').setValue('Delivery'); await w.get('#board-description').setValue('Team work')
  await w.get('form').trigger('submit'); await w.get('form').trigger('submit'); await flushPromises()
  expect(w.emitted('created')).toEqual([['created']]); w.unmount()
})

it('includes exact initial plugin configuration in the packed creation HTTP body', async () => {
  const { default: SelectButton } = await import('primevue/selectbutton')
  vi.mocked(api.get).mockResolvedValue({ data: { success: true, data: { packs: [{ id: 'app:pack', title: 'Delivery', version: '1.0.0', icon: '', description: '', requires: ['app:plugin'], plugins: [{ plugin: 'app:plugin', installed: true }] }] } } })
  vi.mocked(api.post).mockImplementation(async (path: string, body: unknown) => {
    expect(path).toBe('/api/v1/work/boards')
    expect(body).toEqual({ title: 'Configured board', declaration: { key_prefix: 'WORK' }, idempotency_key: expect.any(String), pack: 'app:pack', version: '1.0.0', starter: false, plugin_configs: { 'app:plugin': { folder: 'Documents' } } })
    return { data: { success: true, data: { board_id: 'configured' } } }
  })
  const w = mount(CreateBoard, { props: { visible: true } }); await flushPromises()
  await w.get('#board-title').setValue('Configured board'); await w.get('form').trigger('submit')
  await w.getComponent(SelectButton).setValue('app:pack')
  await w.get('textarea[aria-label="Initial configuration for app:plugin"]').setValue('{"folder":"Documents"}')
  await w.get('form').trigger('submit'); await flushPromises()
  expect(w.emitted('created')).toEqual([['configured']]); w.unmount()
})
