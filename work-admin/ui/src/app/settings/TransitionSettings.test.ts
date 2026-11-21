// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mount } from '@vue/test-utils'
import { afterEach, expect, it } from 'vitest'
import { reactive } from 'vue'
import { selectControl } from '../../test/controls'
import { schema } from '../../test/fixtures'
import type { Transition } from '../../types'
import TransitionSettings from './TransitionSettings.vue'

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
