// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, expect, it } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { reactive } from 'vue'
import Select from 'primevue/select'
import OptionsEditor from './OptionsEditor.vue'
import GeneralSettings from './GeneralSettings.vue'
import { schema } from '../../test/fixtures'
import VisibilityEditor from './VisibilityEditor.vue'
import StateSettings from './StateSettings.vue'
import ApproversEditor from './ApproversEditor.vue'
import BoardShare from './BoardShare.vue'
import type { Declaration, Field } from '../../types'
import { getButton } from '../../test/controls'
import { clone, requestDeclaration } from './model'
const wrappers: VueWrapper[] = []
afterEach(() => { wrappers.splice(0).forEach(w => w.unmount()) })
it('explains stored overrides and clears a comments limit to inherit the application default', async () => {
  const draft = reactive<Declaration>({ policy: { comments_per_item: 250, audit_days: 0, trash_days: 0 } })
  const w = mount(GeneralSettings, { props: { draft, schema: schema(), active: false, draftForm: 'draft', disabled: false, canUpgrade: false, canInstall: false } }); wrappers.push(w)
  expect(w.text()).toContain('Change history retention · 365 days')
  expect(w.text()).toContain('Trash retention · Clean up immediately')
  expect(w.text()).toContain('Comments per item · 250')
  await getButton(w, 'Use default for comments per item').trigger('click')
  expect(draft.policy?.comments_per_item).toBeUndefined()
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
it('submits explicit visibility removal from the editor', async () => {
  const original: Declaration = { visibility: { field: 'visibility', levels: [{ id: 'internal', holders: [] }] } }
  const draft = reactive(clone(original))
  const w = mount(VisibilityEditor, { props: { draft } }); wrappers.push(w)
  await getButton(w, 'Remove visibility restriction').trigger('click')
  expect(requestDeclaration(draft, original)).toEqual({ remove: { visibility: true } })
})
it('describes state entry requirements and gate visit self-approval accurately', () => {
  const state = { id: 'review', category: 'started' }, process = { id: 'flow', initial: 'review', states: [state] }
  const w = mount(StateSettings, { props: { state, process, draft: {} } }); wrappers.push(w)
  expect(w.text()).toContain('Required on entry'); expect(w.text()).toContain('Time allowed in this state')
  const a = mount(ApproversEditor, { props: { approvals: { min: 1, from: [] } } }); wrappers.push(a)
  expect(a.text()).toContain('The person who moves the item here cannot approve this visit')
})
it('uses the shared Share widget and reports a saved access change', async () => {
  const w = mount(BoardShare, { props: { board: { board_id: 'board/a', title: 'Delivery' }, busy: false } }); wrappers.push(w)
  await getButton(w, 'Share board').trigger('click'); await flushPromises()
  const share = w.get('kickside-share')
  expect(JSON.parse(share.attributes('config')!)).toEqual({ resource_id: 'board/a', title: 'Delivery', access_url: '/api/v1/component-access/grants/board%2Fa', share_url: '/api/v1/component-access/share/board%2Fa' })
  await share.trigger('changed')
  expect(w.emitted('shared')).toEqual([[]])
  await share.trigger('close')
  expect(w.find('kickside-share').exists()).toBe(false)
})
