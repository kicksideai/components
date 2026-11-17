// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, expect, it } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { reactive } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import OptionsEditor from './OptionsEditor.vue'
import PolicyEditor from './PolicyEditor.vue'
import VisibilityEditor from './VisibilityEditor.vue'
import StateSettings from './StateSettings.vue'
import ApproversEditor from './ApproversEditor.vue'
import SettingsHead from './SettingsHead.vue'
import type { Declaration, Field } from '../../types'
import { getButton } from '../../test/controls'
const wrappers: VueWrapper[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()) })
it('explains each zero retention window according to the backend policy', () => {
  const w = mount(PolicyEditor, { props: { draft: {} } }); wrappers.push(w)
  const row = (label: string) => w.findAll('.work-settings-row').find(r => r.find(`[aria-label="${label}"]`).exists())!.text()
  expect(row('Audit days')).toContain('Zero selects 365 days')
  expect(row('Interval days')).toContain('Zero selects 365 days')
  expect(row('Trash days')).toContain('Zero allows immediate cleanup')
  expect(row('Tombstone days')).toContain('Zero allows immediate cleanup')
})
it('edits and clears the per-board comments limit with the declared bounds', async () => {
  const draft = reactive<Declaration>({}), w = mount(PolicyEditor, { props: { draft } }); wrappers.push(w)
  const control = w.findAllComponents(InputNumber).find(c => c.props('ariaLabel') === 'Comments per item')!
  expect(control).toBeDefined(); expect(control.props()).toMatchObject({ min: 1, max: 100000 })
  await control.setValue(250); expect(draft.policy).toEqual({ comments_per_item: 250 })
  await control.setValue(null); expect(draft.policy?.comments_per_item).toBeUndefined()
})
it('accepts Work option ids and rejects only empty or duplicate ids', async () => {
  const field = reactive<Field>({ code: 'size', form: 'text', type: 'option', options: [{ id: 'XL' }, { id: '42' }, { id: 'blue-green' }] })
  const w = mount(OptionsEditor, { props: { field } }); wrappers.push(w)
  expect(w.findAll('[aria-label="Option ID"]').every(c => !c.attributes('pattern'))).toBe(true)
  expect(w.emitted('validity')?.at(-1)).toEqual([true, expect.any(String)])
  await w.findAll('[aria-label="Option ID"]')[1].setValue('XL')
  expect(w.emitted('validity')?.at(-1)).toEqual([false, expect.any(String)])
  await w.findAll('[aria-label="Option ID"]')[1].setValue('')
  expect(w.emitted('validity')?.at(-1)).toEqual([false, expect.any(String)])
  await w.findAll('[aria-label="Option ID"]')[1].setValue('42')
  expect(w.emitted('validity')?.at(-1)).toEqual([true, expect.any(String)])
})
it('configures text visibility with explicit levels and retains the shared holder picker', async () => {
  const draft = reactive<Declaration>({ fields: [{ code: 'visibility', form: 'text' }, { code: 'tags', form: 'text', cardinality: 'set' }, { code: 'folded', form: 'text', config: { case: 'insensitive' } }] })
  const w = mount(VisibilityEditor, { props: { draft } }); wrappers.push(w)
  const choices = w.getComponent(Select).props('options') as { value: string }[]
  expect(choices.map(c => c.value)).toEqual(['', 'visibility'])
  await w.getComponent(Select).setValue('visibility')
  await w.get('[aria-label="New visibility level"]').setValue('Internal')
  await getButton(w, 'Add level').trigger('click'); await flushPromises()
  expect(draft.visibility).toEqual({ field: 'visibility', levels: [{ id: 'Internal', holders: [] }] })
  expect(w.find('[aria-label="Who can see these items"]').exists()).toBe(true)
})
it('describes state entry requirements and gate visit self-approval accurately', () => {
  const state = { id: 'review', category: 'started' }, process = { id: 'flow', initial: 'review', states: [state] }
  const w = mount(StateSettings, { props: { state, process, draft: {} } }); wrappers.push(w)
  expect(w.text()).toContain('Required on entry'); expect(w.text()).toContain('Time allowed in this state')
  const a = mount(ApproversEditor, { props: { approvals: { min: 1, from: [] } } }); wrappers.push(a)
  expect(a.text()).toContain('The person who moves the item here cannot approve this visit')
})
it.each([true, false])('mounts the shared Share widget only for ADMIN, embedded=%s', async embedded => {
  const props = { embedded, board: { board_id: 'board/a', title: 'Delivery' }, authorized: true, dirty: false, busy: false, checkingRemoval: false, reviewed: false, disabled: true }
  const w = mount(SettingsHead, { props }); wrappers.push(w)
  await getButton(w, 'Share board').trigger('click'); await flushPromises()
  expect(JSON.parse(w.get('kickside-share').attributes('config')!)).toEqual({ resource_id: 'board/a', title: 'Delivery', access_url: '/api/v1/component-access/grants/board%2Fa', share_url: '/api/v1/component-access/share/board%2Fa' })
  await w.setProps({ authorized: false })
  expect(w.find('kickside-share').exists()).toBe(false)
  expect(w.find('[aria-label="Share board"]').exists()).toBe(false)
})
