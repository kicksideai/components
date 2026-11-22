// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { reactive } from 'vue'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import InputNumber from 'primevue/inputnumber'
import ProcessEditor from './ProcessEditor.vue'
import ProcessMigration from './ProcessMigration.vue'
import StateSettings from './StateSettings.vue'
import { schema } from '../../test/fixtures'
import type { Declaration } from '../../types'
const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => wrappers.splice(0).forEach(w => w.unmount()))
function editor() {
  const draft = reactive(schema().declaration), w = mount(ProcessEditor, { props: { draft } }); wrappers.push(w)
  return { draft, w }
}
it('adds after the selected stop and focuses its name without mutating other state settings', async () => {
  const host = document.createElement('div'); document.body.append(host)
  const draft = reactive(schema().declaration), w = mount(ProcessEditor, { props: { draft }, attachTo: host }); wrappers.push(w)
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
it('updates the displayed route as the state is named and makes its new continuation automatic for approval', async () => {
  const { draft, w } = editor()
  await w.get('.work-graph-node').trigger('click')
  await w.get('button[aria-label="Add state"]').trigger('click')
  await w.get('[aria-label="State name"]').setValue('Approval check')
  const state = w.getComponent(StateSettings)
  await state.getComponent(SelectButton).setValue('gate')
  expect(w.text()).toContain('To do → Approval check → In progress')
  const continuation = draft.processes![0].transitions!.at(-1)!
  expect(continuation).toMatchObject({ to: 'doing', auto: true, default: true })
  await state.getComponent(SelectButton).setValue('human')
  expect(continuation.auto).toBeUndefined()
})
it('leaves a transition shared by two source states in place when adding a state', async () => {
  const draft = reactive(schema().declaration)
  const workflow = draft.processes![0]
  const shared = workflow.transitions![0]
  shared.from = ['todo', 'done']
  const w = mount(ProcessEditor, { props: { draft } }); wrappers.push(w)
  await w.get('.work-graph-node').trigger('click')
  await w.get('button[aria-label="Add state"]').trigger('click')
  expect(shared).toMatchObject({ from: ['todo', 'done'], to: 'doing' })
  expect(workflow.transitions!.at(-1)).toMatchObject({ from: ['todo'], to: workflow.states[1].id })
  expect(w.text()).toContain('To do → New state')
})
it('edits the same draft through List and Map and provides the keyboard connection path', async () => {
  const { draft, w } = editor()
  await w.get('.work-graph-node').trigger('click')
  await w.get('[aria-label="State inspector"] button[aria-label="Add transition"]').trigger('click')
  const picker = w.findAllComponents(Select).find(c => c.props('ariaLabel') === 'Next state')!
  await picker.setValue('done')
  await w.get('[aria-label="State inspector"] button[aria-label="Add transition"]').trigger('click')
  expect(draft.processes![0].transitions!.at(-1)).toMatchObject({ from: ['todo'], to: 'done' })
  expect(w.find('[aria-label="Transition inspector"]').exists()).toBe(true)
  await w.get('[aria-label="Close transition editor"]').trigger('click')
  await w.getComponent(SelectButton).setValue('List')
  await w.get('[aria-label="Edit state To do"]').trigger('click')
  await w.get('[aria-label="Rename state"]').trigger('click')
  await w.get('[aria-label="State name"]').setValue('Ready')
  await w.get('[aria-label="Close state editor"]').trigger('click')
  await w.getComponent(SelectButton).setValue('Map')
  expect(w.get('[aria-label="Edit state Ready"]').text()).toContain('Ready')
  expect(draft.processes![0].initial).toBe('todo')
  expect(draft.processes![0].transitions![0].from).toEqual(['todo'])
})
it('guards referenced removal and edits a shared limit without seeding one on selection', async () => {
  const { draft, w } = editor(), before = JSON.stringify(draft)
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
it('keeps the process selector conditional and uses one creation action', async () => {
  const { draft, w } = editor()
  expect(w.find('[aria-label="Process"]').exists()).toBe(false)
  draft.processes!.push({ id: 'other', name: 'Other flow', initial: 'ready', states: [{ id: 'ready', name: 'Ready', category: 'unstarted' }] })
  await flushPromises()
  const picker = w.findAllComponents(Select).find(c => c.props('ariaLabel') === 'Process')!
  expect(picker.props('options')?.map(option => option.value)).toEqual(['delivery', 'other'])
  await w.get('button[aria-label="New process"]').trigger('click'); await flushPromises()
  expect(w.get('dialog').attributes('open')).toBeDefined()
  expect(w.find('.work-process-controls [aria-label^="Existing items"]').exists()).toBe(false)
})
it('opens the initial-state menu in the owning shadow root with platform styling', async () => {
  const host = document.createElement('div'); document.body.append(host)
  const shadow = host.attachShadow({ mode: 'open' }), target = document.createElement('div'); shadow.append(target)
  const w = mount(ProcessEditor, { props: { draft: schema().declaration }, attachTo: target, global: { stubs: { teleport: false } } }); wrappers.push(w)
  await w.get('[aria-label="Starts in To do"]').trigger('click'); await flushPromises()
  const overlay = shadow.querySelector('.p-select-overlay')
  expect(overlay?.getRootNode()).toBe(shadow)
  expect(overlay?.classList.contains('p-component')).toBe(true)
  expect(document.querySelector('.p-select-overlay')).toBeNull()
  host.remove()
})
it('asks where items in a removed state should go and confirms an occupied rename', async () => {
  const process = schema().declaration.processes![0]
  const removed = process.states[1]
  process.states = process.states.filter(state => state !== removed)
  const w = mount(ProcessMigration, { props: {
    removed: [{ process, state: removed, count: 2 }],
    renamed: [{ process, state: process.states[0], name: 'Ready', count: 1 }],
    confirmed: false,
  } }); wrappers.push(w)
  await w.getComponent(Select).setValue('todo')
  expect(w.emitted('destination')).toEqual([[process, 'doing', 'todo']])
  expect(w.text()).toContain('To do becomes Ready for 1 item.')
  await w.get('input[type="checkbox"]').setValue(true)
  expect(w.emitted('update:confirmed')).toEqual([[true]])
})
it('selection and clearing leave an absent transition collection untouched', async () => {
  const draft = reactive<Declaration>({ processes: [{ id: 'flow', initial: 'ready', states: [{ id: 'ready', name: 'Ready', category: 'unstarted' }] }] })
  const w = mount(ProcessEditor, { props: { draft } }); wrappers.push(w)
  const before = JSON.stringify(draft)
  await w.get('.work-graph-node').trigger('click')
  await w.get('.work-process-editor').trigger('keydown', { key: 'Escape' }); await flushPromises()
  expect(JSON.stringify(draft)).toBe(before)
  await expect.poll(() => w.find('.work-process-sideform').exists()).toBe(false)
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
  expect(w.find('[aria-label="Edit transition Approved"]').exists()).toBe(true)
  await w.get('[aria-label="Edit transition Approved"]').trigger('click')
  expect(w.get('[aria-label="Transition name"]').attributes('placeholder')).toBe('Approved')
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
