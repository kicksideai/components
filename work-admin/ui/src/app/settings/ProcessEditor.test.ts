// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { reactive } from 'vue'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import InputNumber from 'primevue/inputnumber'
import ProcessEditor from './ProcessEditor.vue'
import ProcessMigration from './ProcessMigration.vue'
import { schema } from '../../test/fixtures'
import type { Declaration } from '../../types'
const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => wrappers.splice(0).forEach(w => w.unmount()))
function editor(advanced = false) {
  const draft = reactive(schema().declaration), w = mount(ProcessEditor, { props: { draft, advanced } }); wrappers.push(w)
  return { draft, w }
}
it('adds after the selected stop and focuses its name without mutating other state settings', async () => {
  const host = document.createElement('div'); document.body.append(host)
  const draft = reactive(schema().declaration), w = mount(ProcessEditor, { props: { draft, advanced: false }, attachTo: host }); wrappers.push(w)
  const first = structuredClone(schema().declaration.processes![0].states[0])
  await w.get('.work-graph-node').trigger('click')
  await w.get('button[aria-label="Add state"]').trigger('click'); await flushPromises()
  expect(draft.processes![0].states[0]).toEqual(first)
  expect(draft.processes![0].states[1].name).toBe('New state')
  expect(w.findAll('.work-node-name').map(s => s.text()).slice(0, 3)).toEqual(['To do', 'New state', 'In progress'])
  expect(draft.processes![0].transitions![0].to).toBe(draft.processes![0].states[1].id)
  expect(draft.processes![0].transitions!.at(-1)).toMatchObject({ from: [draft.processes![0].states[1].id], to: 'doing' })
  expect(document.activeElement).toBe(w.get('[aria-label="State name"]').element)
  host.remove()
})
it('edits the same draft through List and Map and provides the keyboard connection path', async () => {
  const { draft, w } = editor()
  await w.get('.work-graph-node').trigger('click')
  const picker = w.findAllComponents(Select).find(c => c.props('ariaLabel') === 'Add transition to…')!
  await picker.setValue('done')
  await w.get('button[aria-label="Add transition"]').trigger('click')
  expect(draft.processes![0].transitions!.at(-1)).toMatchObject({ from: ['todo'], to: 'done' })
  expect(w.find('[aria-label="Transition inspector"]').exists()).toBe(true)
  await w.get('[aria-label="Close transition editor"]').trigger('click')
  await w.getComponent(SelectButton).setValue('List')
  await w.get('input[aria-label="Name of To do"]').setValue('Ready')
  await w.getComponent(SelectButton).setValue('Map')
  expect(w.get('[aria-label="Edit state Ready"]').text()).toContain('Ready')
  expect(draft.processes![0].initial).toBe('todo')
  expect(draft.processes![0].transitions![0].from).toEqual(['todo'])
})
it('guards referenced removal and edits a shared limit without seeding one on selection', async () => {
  const { draft, w } = editor(true), before = JSON.stringify(draft)
  await w.get('.work-graph-node').trigger('click')
  expect(JSON.stringify(draft)).toBe(before)
  const limit = w.findAllComponents(InputNumber).find(c => c.find('[aria-label="Items allowed here"]').exists())!
  await limit.setValue(3)
  expect(draft.policy!.wip!.todo.limit).toBe(3)
  await w.get('[aria-label="Remove state"]').trigger('click')
  expect(w.get('[role="alert"]').text()).toContain('initial state')
  await limit.setValue(null)
  expect(draft.policy!.wip!.todo).toBeUndefined()
})
it('keeps the process selector conditional and puts creation last', async () => {
  const { draft, w } = editor()
  expect(w.find('[aria-label="Process"]').exists()).toBe(false)
  draft.processes!.push({ id: 'other', name: 'Other flow', initial: 'ready', states: [{ id: 'ready', name: 'Ready', category: 'unstarted' }] })
  await flushPromises()
  const picker = w.findAllComponents(Select).find(c => c.props('ariaLabel') === 'Process')!
  expect(picker.props('options')?.at(-1)).toEqual({ label: 'New process…', value: '__new' })
  await picker.setValue('__new'); await flushPromises()
  expect(w.get('dialog').attributes('open')).toBeDefined()
  expect(w.find('.work-process-controls [aria-label^="Existing items"]').exists()).toBe(false)
})
it('opens the initial-state menu in the owning shadow root with platform styling', async () => {
  const host = document.createElement('div'); document.body.append(host)
  const shadow = host.attachShadow({ mode: 'open' }), target = document.createElement('div'); shadow.append(target)
  const w = mount(ProcessEditor, { props: { draft: schema().declaration, advanced: false }, attachTo: target, global: { stubs: { teleport: false } } }); wrappers.push(w)
  await w.get('[aria-label="Starts in To do"]').trigger('click'); await flushPromises()
  const overlay = shadow.querySelector('.p-select-overlay')
  expect(overlay?.getRootNode()).toBe(shadow)
  expect(overlay?.classList.contains('p-component')).toBe(true)
  expect(document.querySelector('.p-select-overlay')).toBeNull()
  host.remove()
})
it('changes existing-item policy and maps removed states through Review without seeding defaults', async () => {
  const original = schema().declaration, draft = reactive(structuredClone(original))
  draft.processes![0].states = draft.processes![0].states.filter(s => s.id !== 'doing')
  const before = JSON.stringify(draft), w = mount(ProcessMigration, { props: { draft, original } }); wrappers.push(w)
  expect(JSON.stringify(draft)).toBe(before)
  const selects = w.findAllComponents(Select)
  await selects[1].setValue('todo')
  expect(draft.processes![0].map).toEqual({ doing: 'todo' })
  await selects[0].setValue('pin')
  expect(draft.processes![0].migration).toBe('pin')
  expect(w.findAllComponents(Select)).toHaveLength(1)
})
it('selection and clearing leave an absent transition collection untouched', async () => {
  const draft = reactive<Declaration>({ processes: [{ id: 'flow', initial: 'ready', states: [{ id: 'ready', name: 'Ready', category: 'unstarted' }] }] })
  const w = mount(ProcessEditor, { props: { draft, advanced: true } }); wrappers.push(w)
  const before = JSON.stringify(draft)
  await w.get('.work-graph-node').trigger('click')
  await w.get('.work-process-editor').trigger('keydown', { key: 'Escape' })
  expect(JSON.stringify(draft)).toBe(before)
  expect(w.find('.work-process-sideform').exists()).toBe(false)
})

it('renames the inspector title in place and keeps transition references stable', async () => {
  const { draft, w } = editor()
  await w.get('.work-graph-node').trigger('click')
  expect(w.get('[aria-label="Rename state"]').text()).toBe('To do')
  await w.get('[aria-label="Rename state"]').trigger('click')
  await w.get('[aria-label="State name"]').setValue('Ready')
  await w.get('[aria-label="State name"]').trigger('blur')
  expect(w.get('[aria-label="Rename state"]').text()).toBe('Ready')
  expect(draft.processes![0].states[0].id).toBe('todo')
  expect(draft.processes![0].initial).toBe('todo')
  expect(draft.processes![0].transitions![0].from).toEqual(['todo'])
})
it('shows the humanized id in List when a transition has no display name', async () => {
  const { draft, w } = editor()
  draft.processes![0].transitions![0].name = undefined; draft.processes![0].transitions![0].id = 'approved'
  await w.getComponent(SelectButton).setValue('List')
  expect(w.get('input[aria-label="Name of Approved"]').attributes('placeholder')).toBe('Approved')
})
it('keeps generated process identifiers valid and unique for long human names', async () => {
  const { w, draft } = editor()
  for (let i = 0; i < 2; i++) {
    await w.get('[aria-label="New process"]').trigger('click')
    await w.get('[aria-label="New process name"]').setValue('A deliberately long process name that keeps its full human title')
    await w.get('form[aria-label="New process"]').trigger('submit')
  }
  const created = draft.processes!.slice(-2)
  expect(new Set(created.map(p => p.id)).size).toBe(2)
  for (const process of created) { expect(process.id).toMatch(/^[a-z][a-z0-9_]{0,39}$/); expect(process.name).toBe('A deliberately long process name that keeps its full human title') }
})
