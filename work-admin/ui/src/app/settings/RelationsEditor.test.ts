// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mount } from '@vue/test-utils'
import { afterEach, expect, it } from 'vitest'
import { reactive } from 'vue'
import Checkbox from 'primevue/checkbox'
import type { Declaration } from '../../types'
import RelationsEditor from './RelationsEditor.vue'

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()))

it('edits directed source types and peer target IDs and requires clearing them before symmetry', async () => {
  const draft = reactive<Declaration>({
    item_types: [{ id: 'task', fields: [], process: 'delivery' }],
    relation_types: [{ id: 'blocks', outward: 'Blocks', from_types: ['task'], to_types: ['peer_task'] }],
  })
  const wrapper = mount(RelationsEditor, { props: { draft } })
  wrappers.push(wrapper)
  await wrapper.get('.work-definition-toggle').trigger('click')
  const symmetric = wrapper.getComponent(Checkbox)
  expect(symmetric.props('disabled')).toBe(true)
  expect(wrapper.text()).toContain('Clear the source and target types to use the same meaning in both directions.')
  await wrapper.findAll('button').find(button => button.text() === 'Peer board target types')!.trigger('click')
  await wrapper.get('[aria-label="Remove target type peer_task"]').trigger('click')
  await wrapper.get('[aria-label="Add target type"]').trigger('click')
  const target = wrapper.get('input[aria-label="Target type ID"]')
  await target.setValue('peer_release')
  await target.trigger('keydown', { key: 'Enter' })
  expect(JSON.parse(JSON.stringify(draft)).relation_types[0]).toMatchObject({ from_types: ['task'], to_types: ['peer_release'] })
  const local = wrapper.get('[aria-label="Target item types"] button')
  await local.trigger('click')
  expect(draft.relation_types?.[0].to_types).toEqual(['task', 'peer_release'])
  await local.trigger('click')
  expect(draft.relation_types?.[0].to_types).toEqual(['peer_release'])
  await wrapper.get('[aria-label="Source item types"] button').trigger('click')
  await wrapper.get('[aria-label="Remove target type peer_release"]').trigger('click')
  expect(draft.relation_types?.[0]).not.toHaveProperty('from_types')
  expect(draft.relation_types?.[0]).not.toHaveProperty('to_types')
  expect(symmetric.props('disabled')).toBe(false)
  await symmetric.setValue(true)
  expect(draft.relation_types?.[0].symmetric).toBe(true)
})
