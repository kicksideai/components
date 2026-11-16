// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { getButton as button } from '../../test/controls'
import { beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Select from 'primevue/select'
import BoardSettings from './BoardSettings.vue'
import { work } from '../../api'
import { settings } from './api'
import { emptyOptions } from '../../types'
import { schema } from '../../test/fixtures'
import { notify } from '../../test/setup'
vi.mock('../../api', () => ({ work: { schema: vi.fn(), boards: vi.fn(), options: vi.fn(), packs: vi.fn() } }))
vi.mock('./api', () => ({ settings: { plan: vi.fn(), apply: vi.fn(), packPlan: vi.fn(), packApply: vi.fn() } }))
const pack = { id: 'app:delivery', title: 'Delivery flow', version: '2.0.0', icon: 'tabler:route', description: 'Plan delivery.', requires: [], plugins: [] }
const result = { pack: pack.id, version: '2.0.0', digest: 'new', generation: 2, class: 'semantic', changes: [{ code: 'process delivery', what: 'states changed', class: 'semantic' }], refused: [], declaration: { processes: [{ id: 'delivery', name: 'Delivery', initial: 'ready', states: [{ id: 'ready', name: 'Ready', category: 'unstarted' }, { id: 'done', name: 'Done', category: 'completed' }] }] }, conflicts: [{ path: 'processes.delivery', base: {}, local_value: { name: 'Local delivery', id: '5a336e3c-753c-49fe-8bf4-ab2742406a9b' }, incoming: { name: 'Updated delivery', plugin: 'example.private:capability' } }], maps: { delivery: { todo: 'ready' } } }
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(work.schema).mockResolvedValue({ ...schema(), pack: { id: pack.id, version: '1.0.0', digest: 'old' }, outdated: true })
  vi.mocked(work.boards).mockResolvedValue([{ board_id: 'b', title: 'Delivery' }]); vi.mocked(work.packs).mockResolvedValue([pack])
  vi.mocked(work.options).mockResolvedValue({ ...emptyOptions(), access: { read: true, write: true, admin: true } })
  vi.mocked(settings.packPlan).mockResolvedValue(result); vi.mocked(settings.packApply).mockResolvedValue({ operation_id: 'op', job_id: 'job', status: 'done', generation: 2 })
})
it('shows named provenance and reviews conflicts and editable map defaults before applying exactly the reviewed request', async () => {
  const w = mount(BoardSettings, { props: { boardId: 'b' } }); await flushPromises()
  try {
    expect(w.get('.kx-head-sub').text()).toContain('Delivery flow 1.0.0 · Outdated')
    await button(w, 'Upgrade pack').trigger('click'); await flushPromises()
    expect(settings.packApply).not.toHaveBeenCalled(); expect(w.get('[aria-label="Schema review"]').text()).toContain('Local edits conflict')
    expect(w.get('[aria-label="Pack conflicts"]').text()).toContain('Local delivery')
    expect(w.get('[aria-label="Pack conflicts"]').text()).toContain('Updated delivery')
    expect(w.text()).toContain('5a336e3c-753c-49fe-8bf4-ab2742406a9b'); expect(w.text()).toContain('example.private:capability')
    expect(button(w, 'Apply').attributes('disabled')).toBeDefined()
    const selects = w.findAllComponents(Select)
    await selects.find(s => s.props('ariaLabel') === 'Resolution for Delivery')!.setValue('incoming')
    const map = selects.find(s => s.props('ariaLabel') === 'Move items from To do')!
    expect(map.props('modelValue')).toBe('ready'); await map.setValue('done')
    await button(w, 'Review changes').trigger('click'); await flushPromises()
    const request = vi.mocked(settings.packPlan).mock.calls.at(-1)![1]
    expect(request).toEqual({ pack: pack.id, version: '2.0.0', expected_generation: 1, resolutions: { 'processes.delivery': 'incoming' }, maps: { delivery: { todo: 'done' } } })
    await button(w, 'Apply').trigger('click'); await flushPromises()
    expect(settings.packApply).toHaveBeenCalledWith('b', request, expect.any(String)); expect(settings.apply).not.toHaveBeenCalled()
    expect(w.text()).not.toContain('app:delivery')
  } finally { w.unmount() }
})
it('keeps refused changes and their reason visible and prevents stale pack applies', async () => {
  vi.mocked(settings.packPlan).mockResolvedValue({ ...result, class: 'refused', refused: [{ code: 'visibility', what: 'visibility.remove', class: 'refused' }], migration: 'Create a board and move its items.' })
  const w = mount(BoardSettings, { props: { boardId: 'b' } }); await flushPromises()
  try {
    await button(w, 'Upgrade pack').trigger('click'); await flushPromises()
    expect(w.text()).toContain('Create a board and move its items.'); expect(button(w, 'Apply').attributes('disabled')).toBeDefined()
    vi.mocked(work.schema).mockResolvedValue({ ...schema(), generation: 3 }); notify('component.b'); await flushPromises()
    expect(w.text()).toContain('advances to generation 3'); expect(settings.packApply).not.toHaveBeenCalled()
  } finally { w.unmount() }
})
it('keeps conflicts visible when the default local choice has no schema changes', async () => {
  vi.mocked(settings.packPlan).mockResolvedValue({ ...result, changes: [], maps: {}, class: 'cosmetic' })
  const w = mount(BoardSettings, { props: { boardId: 'b' } }); await flushPromises()
  try { await button(w, 'Upgrade pack').trigger('click'); await flushPromises(); expect(w.get('[aria-label="Pack conflicts"]').text()).toContain('Local edits conflict'); expect(button(w, 'Apply').attributes('disabled')).toBeDefined() }
  finally { w.unmount() }
})
it('replans proposed default maps so Apply sends the exact reviewed request', async () => {
  vi.mocked(settings.packPlan).mockResolvedValue({ ...result, conflicts: [] })
  const w = mount(BoardSettings, { props: { boardId: 'b' } }); await flushPromises()
  try {
    await button(w, 'Upgrade pack').trigger('click'); await flushPromises()
    const reviewed = vi.mocked(settings.packPlan).mock.calls.at(-1)![1]
    expect(reviewed.maps).toEqual({ delivery: { todo: 'ready' } })
    await button(w, 'Apply').trigger('click'); await flushPromises()
    expect(settings.packApply).toHaveBeenCalledWith('b', reviewed, expect.any(String))
  } finally { w.unmount() }
})

it('keeps differing capability values distinguishable in pack conflicts', async () => {
  const { default: PackReview } = await import('./PackReview.vue')
  const w = mount(PackReview, { props: { plan: { pack: 'pack', version: '2', digest: 'd', generation: 2, class: 'semantic', changes: [], refused: [], conflicts: [{ path: 'plugins', base: {}, local_value: { use: 'app:local' }, incoming: { use: 'app:incoming' } }], maps: {}, declaration: {} }, request: { pack: 'pack', version: '2', expected_generation: 1 }, original: {} } })
  expect(w.text()).toContain('app:local'); expect(w.text()).toContain('app:incoming'); w.unmount()
})

it('reviews and applies initial plugin configuration for a pack upgrade', async () => {
  const plugin = { plugin: 'app:new-plugin', installed: true, active: false, requires: [], tools: [], lifecycle: { state: 'ready' as const }, projections: {}, config_schema: { type: 'object', properties: { folder: { type: 'string' } }, required: ['folder'] } }
  vi.mocked(work.options).mockResolvedValue({ ...emptyOptions(), access: { read: true, write: true, admin: true }, schema_options: { plugins: [plugin] } })
  vi.mocked(settings.packPlan).mockResolvedValue({ ...result, conflicts: [], declaration: { ...result.declaration, plugins: [{ use: plugin.plugin }] } })
  vi.mocked(work.packs).mockResolvedValue([{ ...pack, plugins: [{ id: plugin.plugin, installed: true }] }])
  const w = mount(BoardSettings, { props: { boardId: 'b' } }); await flushPromises()
  await button(w, 'Upgrade pack').trigger('click'); await flushPromises()
  const { default: ConfigForm } = await import('./ConfigForm.vue')
  const form = w.findComponent(ConfigForm)
  expect(form.exists()).toBe(true)
  form.vm.$emit('update:modelValue', { folder: 'Documents' }); await flushPromises()
  await button(w, 'Review changes').trigger('click'); await flushPromises()
  const request = vi.mocked(settings.packPlan).mock.calls.at(-1)![1]
  expect(request).toMatchObject({ plugin_configs: { [plugin.plugin]: { folder: 'Documents' } } })
  await button(w, 'Apply').trigger('click'); await flushPromises()
  expect(settings.packApply).toHaveBeenLastCalledWith('b', request, expect.any(String)); w.unmount()
})

it('distinguishes a failed pack discovery from an unavailable pack version', async () => {
  vi.mocked(work.packs).mockRejectedValueOnce(new Error('Packs offline'))
  const w = mount(BoardSettings, { props: { boardId: 'b' } }); await flushPromises()
  expect(w.get('[role=alert]').text()).toContain('Packs offline')
  await button(w, 'Reload packs').trigger('click'); await flushPromises()
  expect(work.packs).toHaveBeenCalledTimes(2); w.unmount()
})
