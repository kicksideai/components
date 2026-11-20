// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { reactive } from 'vue'
import { api } from '@wippy-fe/proxy'
import Select from 'primevue/select'
import StateSettings from './StateSettings.vue'
import type { State } from '../../types'
const wrappers: ReturnType<typeof mount>[] = []
beforeEach(() => {
  vi.mocked(api.get).mockImplementation(async (path: string) => ({ data: String(path).endsWith('/versions')
    ? { success: true, versions: [{ version: 3 }, { version: 1 }] }
    : { success: true, version: { version: Number(String(path).split('/').at(-1)) } } }) as never)
})
afterEach(() => wrappers.splice(0).forEach(w => w.unmount()))
async function render(bound = false) {
  const state = reactive<State>({ id: 'build', category: 'started', kind: 'automated', run: { stage: 'Build', ...(bound ? { flow_ref: { kind: 'flow' as const, id: 'flow-a', version: 1 } } : {}) } })
  const w = mount(StateSettings, { props: { state, process: { id: 'delivery', initial: state.id, states: [state] }, draft: {}, advanced: true } })
  wrappers.push(w); await flushPromises(); return { w, state }
}
it('uses the published Flow widget and requires an explicit version before replacing the binding', async () => {
  const { w, state } = await render(true)
  expect(w.text()).not.toContain('flow-a')
  expect(w.get('wc-workflow-picker').attributes('title')).toBe('flow-a')
  expect(JSON.parse(w.get('wc-workflow-picker').attributes('config')!)).toEqual({ flow_ref: state.run!.flow_ref })
  await w.get('wc-workflow-picker').trigger('change', { detail: { flow_ref: { kind: 'flow', id: 'flow-b', version: 3 } } }); await flushPromises()
  expect(state.run!.flow_ref).toEqual({ kind: 'flow', id: 'flow-a', version: 1 })
  expect(w.emitted('validity')).toContainEqual(['flow', false])
  const versions = w.findAllComponents(Select).find(s => s.props('ariaLabel') === 'Published version')!
  expect(versions.props('options')).toEqual([{ label: 'v3', value: 3 }, { label: 'v1', value: 1 }])
  await versions.setValue(1); await flushPromises()
  expect(state.run!.flow_ref).toEqual({ kind: 'flow', id: 'flow-b', version: 1 })
  expect(state.run!.stage).toBe('Build')
  expect(w.emitted('validity')?.at(-1)).toEqual(['flow', true])
})
it.each(['Flow deleted', 'Version gone', 'Permission denied'])('keeps the exact unavailable reference and allows replacement: %s', async message => {
  vi.mocked(api.get).mockRejectedValue(new Error(message))
  const { w, state } = await render(true)
  expect(w.get('[role=alert]').text()).toContain('Flow binding unavailable')
  expect(w.get('[role=alert]').text()).not.toContain('flow-a'); expect(w.text()).toContain('v1'); expect(w.text()).toContain(message)
  expect(state.run!.flow_ref).toEqual({ kind: 'flow', id: 'flow-a', version: 1 })
  expect(w.find('wc-workflow-picker').exists()).toBe(true)
})
it('shows a typed Flow refusal without the saved Flow identifier in the alert', async () => {
  vi.mocked(api.get).mockResolvedValue({ data: { success: false, message: 'The published version is unavailable.', details: { code: 'version_unavailable' } } } as never)
  const { w, state } = await render(true)
  const alert = w.get('[role="alert"]').text()
  expect(alert).toContain('The published version is unavailable.')
  expect(alert).toMatch(/Error code:\s*version_unavailable/)
  expect(alert).not.toContain('flow-a')
  expect(state.run?.flow_ref).toEqual({ kind: 'flow', id: 'flow-a', version: 1 })
})
it('edits a legacy unbound run without creating a binding and can explicitly remove a binding', async () => {
  const { w, state } = await render()
  expect(w.text()).toContain('No Flow bound')
  await w.get('[aria-label="Run label"]').setValue('Legacy build')
  expect(state.run).toEqual({ stage: 'Legacy build' })
  expect(w.emitted('validity')).toContainEqual(['flow', true])
  const bound = await render(true)
  await bound.w.get('[aria-label="Remove Flow binding"]').trigger('click')
  expect(bound.state.run).toEqual({ stage: 'Build' })
})
it('ignores a late availability response after replacing a Flow', async () => {
  let reject!: (reason: Error) => void
  vi.mocked(api.get).mockImplementationOnce(() => new Promise((_, no) => { reject = no }) as never)
  const { w, state } = await render(true)
  await w.get('wc-workflow-picker').trigger('change', { detail: { flow_ref: { kind: 'flow', id: 'flow-b', version: 3 } } }); await flushPromises()
  const versions = w.findAllComponents(Select).find(s => s.props('ariaLabel') === 'Published version')!
  await versions.setValue(3); await flushPromises()
  reject(new Error('Old permission denied')); await flushPromises()
  expect(state.run!.flow_ref?.id).toBe('flow-b')
  expect(w.text()).not.toContain('Old permission denied')
})
it.each(['list', 'detail'])('marks an exact version unavailable when it disappears from the %s response', async source => {
  vi.mocked(api.get).mockImplementation(async (path: string) => ({ data: path.endsWith('/versions')
    ? { success: true, versions: source === 'list' ? [{ version: 3 }] : [{ version: 1 }] }
    : { success: true, version: { version: source === 'detail' ? 3 : 1 } } }) as never)
  const { w, state } = await render(true)
  expect(w.get('[role=alert]').text()).toContain('Flow binding unavailable')
  expect(state.run!.flow_ref?.version).toBe(1)
})
it('cancels an unfinished replacement without mutating the saved binding', async () => {
  const { w, state } = await render(true)
  await w.get('wc-workflow-picker').trigger('change', { detail: { flow_ref: { kind: 'flow', id: 'flow-b', version: 3 } } }); await flushPromises()
  await w.get('[aria-label="Cancel Flow selection"]').trigger('click'); await flushPromises()
  expect(state.run!.flow_ref).toEqual({ kind: 'flow', id: 'flow-a', version: 1 })
  expect(w.emitted('validity')?.at(-1)).toEqual(['flow', true])
})
