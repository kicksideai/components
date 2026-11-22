// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mount } from '@vue/test-utils'
import { afterEach, expect, it } from 'vitest'
import { reactive } from 'vue'
import { selectControl } from '../../test/controls'
import { schema } from '../../test/fixtures'
import type { Transition } from '../../types'
import TransitionSettings from './TransitionSettings.vue'
import VisibilityEditor from './VisibilityEditor.vue'
import ChipPicker from './ChipPicker.vue'

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()))

it('explains the process-only choice and distinguishes false from the Work default', async () => {
  const draft = reactive(schema().declaration)
  const process = draft.processes![0]
  const transition = reactive<Transition>({ id: 'advance', from: ['todo'], to: 'done' })
  const wrapper = mount(TransitionSettings, { props: { draft, process, transition } })
  wrappers.push(wrapper)
  const people = selectControl(wrapper, 'Offer to people')
  expect(people.props('options')).toContainEqual({ label: 'Process engine only', value: false })
  expect(wrapper.text()).toContain('Work default can hide a stage route from the list while still allowing it by name.')
  await people.setValue(false)
  expect(JSON.parse(JSON.stringify(transition)).people).toBe(false)
  await people.setValue(undefined)
  expect(JSON.parse(JSON.stringify(transition))).not.toHaveProperty('people')
})

it('lets an administrator add an installed check and remove a stale check', async () => {
  const draft = reactive({ ...schema().declaration, plugins: [{ use: 'app:plugin' }] })
  const process = draft.processes![0]
  const transition = reactive<Transition>({ id: 'advance', from: ['todo'], to: 'done', guards: ['app:removed'] })
  const guards = [{ id: 'app:check', title: 'Release check', plugin: 'app:plugin' }]
  const wrapper = mount(TransitionSettings, { props: { draft, process, transition, guards } })
  wrappers.push(wrapper)
  const picker = wrapper.findAllComponents(ChipPicker).find(p => p.props('label') === 'Installed checks')!
  expect(picker.props('options')).toEqual([
    { value: 'app:check', label: 'Release check' },
    { value: 'app:removed', label: 'Unavailable check' },
  ])
  picker.vm.$emit('update:modelValue', ['app:check'])
  expect(transition.guards).toEqual(['app:check'])
})

it('keeps malformed effects and guards out of the draft and accepts corrected JSON', async () => {
  const draft = reactive(schema().declaration)
  const process = draft.processes![0]
  const transition = reactive<Transition>({ id: 'advance', from: ['todo'], to: 'done', guards: ['app:check'] })
  const wrapper = mount(TransitionSettings, { props: { draft, process, transition, guards: [] } })
  wrappers.push(wrapper)
  const effects = wrapper.get('textarea[aria-label="Set values"]')
  await effects.setValue('[{"field":"priority","copy":true}]')
  expect(transition.set).toBeUndefined()
  expect(wrapper.emitted('validity')?.at(-1)).toEqual(['set', false])
  await effects.setValue('[{"field":"priority","clear":true,"value":0}]')
  expect(transition.set).toBeUndefined()
  const valid = [{ field: 'priority', value: false }, { field: 'reviewer', value: '$actor' }, { field: 'arrival', value: '$now' }, { field: 'tag', clear: true }, { field: 'status', copy: 'old_status' }]
  await effects.setValue(JSON.stringify(valid))
  expect(transition.set).toEqual(valid)
  expect(wrapper.emitted('validity')?.at(-1)).toEqual(['set', true])

  const guards = wrapper.get('textarea[aria-label="Guards"]')
  await guards.setValue('["app:other",42]')
  expect(transition.guards).toEqual(['app:check'])
  expect(wrapper.emitted('validity')?.at(-1)).toEqual(['guards', false])
  await guards.setValue('["app:other"]')
  expect(transition.guards).toEqual(['app:other'])
  await guards.setValue('')
  expect(transition.guards).toBeUndefined()
  expect(wrapper.emitted('validity')?.at(-1)).toEqual(['guards', true])
})

it('keeps malformed visibility rules out of the draft and accepts each holder shape', async () => {
  const draft = reactive(schema().declaration)
  const wrapper = mount(VisibilityEditor, { props: { draft } })
  wrappers.push(wrapper)
  const rules = wrapper.get('textarea[aria-label="Visibility rules"]')
  const before = draft.visibility
  await rules.setValue('{"field":"visibility"}')
  expect(draft.visibility).toBe(before)
  expect(wrapper.emitted('validity')?.at(-1)).toEqual([false])
  await rules.setValue('{"field":"visibility","levels":[{"id":"internal","holders":[{"group":"team","user":"member"}]}]}')
  expect(draft.visibility).toBe(before)
  const valid = { field: 'visibility', levels: [{ id: 'internal', holders: [{ group: 'team' }, { user: 'member' }, { service: 'bot' }, { field: 'owner' }] }, { id: 'private', holders: [] }], bypass: 'admin' }
  await rules.setValue(JSON.stringify(valid))
  expect(draft.visibility).toEqual(valid)
  expect(wrapper.emitted('validity')?.at(-1)).toEqual([true])
  await rules.setValue('')
  expect(draft.visibility).toBeUndefined()
})
