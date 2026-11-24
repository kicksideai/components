// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { beforeEach, expect, it, vi } from 'vitest'
import { api } from '@wippy-fe/proxy'
import { settings } from './api'
import { reviewSnapshot } from './model'
beforeEach(() => { vi.clearAllMocks(); vi.mocked(api.post).mockResolvedValue({ data: { success: true, data: { generation: 4, class: 'additive', refused: [], changes: [] } } }) })
it('uses Work routes and the identical reviewed request for plan and apply', async () => {
  const review = reviewSnapshot({ fields: [{ code: 'estimate', form: 'int', index: 'number' }] }, 3, {})
  await settings.plan('a/b', review)
  await settings.apply('a/b', review, 'request-key')
  expect(api.post).toHaveBeenNthCalledWith(1, '/api/v1/work/boards/a%2Fb/plan_schema', { declaration: review.declaration, expected_generation: 3, plugin_configs: {} })
  expect(api.post).toHaveBeenNthCalledWith(2, '/api/v1/work/boards/a%2Fb/apply_schema', { declaration: review.declaration, expected_generation: 3, plugin_configs: {}, key: 'request-key' })
})
it('sends plugin config and migration resume through their board methods', async () => {
  await settings.configure('b', 'app:plugin', { enabled: true }); await settings.resume('b')
  expect(api.post).toHaveBeenNthCalledWith(1, '/api/v1/work/boards/b/configure_plugin', { plugin: 'app:plugin', config: { enabled: true } })
  expect(api.post).toHaveBeenNthCalledWith(2, '/api/v1/work/boards/b/resume_migration', {})
})
it('encodes board identity updates and preserves the unchanged answer', async () => {
  const { work } = await import('../../api')
  vi.mocked(api.post).mockResolvedValue({ data: { success: true, data: { board_id: 'a/b', status: 'unchanged' } } })
  expect(await work.updateBoard('a/b', { title: 'Delivery', description: '' })).toEqual({ board_id: 'a/b', status: 'unchanged' })
  expect(api.post).toHaveBeenCalledWith('/api/v1/work/boards/a%2Fb/update', { title: 'Delivery', description: '' })
})
it('uses Work pack routes with explicit maps, resolutions and the frozen request key', async () => {
  const request = { pack: 'app:pack', version: '2.0.0', expected_generation: 3, maps: { delivery: { old: 'ready' } }, resolutions: { 'fields.title': 'local' as const } }
  await settings.packPlan('a/b', request); await settings.packApply('a/b', request, 'upgrade-key')
  expect(api.post).toHaveBeenNthCalledWith(1, '/api/v1/work/boards/a%2Fb/pack_plan', request)
  expect(api.post).toHaveBeenNthCalledWith(2, '/api/v1/work/boards/a%2Fb/pack_apply', { ...request, key: 'upgrade-key' })
})

it('retries a named plugin without posting replacement configuration', async () => {
  await settings.configure('b', 'app:plugin')
  expect(api.post).toHaveBeenCalledExactlyOnceWith('/api/v1/work/boards/b/configure_plugin', { plugin: 'app:plugin' })
})
it('sends Archive and Drop field removal choices with the reviewed generation and omits Keep', async () => {
  const review = reviewSnapshot({ item_types: [] }, 5, {}, { 'fields/estimate/task': 'archive', 'fields/notes/task': 'keep', 'fields/size': 'drop' })
  await settings.plan('b', review)
  await settings.apply('b', review, 'removal-key')
  const body = { declaration: review.declaration, expected_generation: 5, plugin_configs: {}, resolutions: { 'fields/estimate/task': 'archive', 'fields/size': 'drop' } }
  expect(api.post).toHaveBeenNthCalledWith(1, '/api/v1/work/boards/b/plan_schema', body)
  expect(api.post).toHaveBeenNthCalledWith(2, '/api/v1/work/boards/b/apply_schema', { ...body, key: 'removal-key' })
})
