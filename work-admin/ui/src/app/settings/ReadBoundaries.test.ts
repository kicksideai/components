// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import InputNumber from 'primevue/inputnumber'
import FieldsEditor from './FieldsEditor.vue'
import TypesEditor from './TypesEditor.vue'
import RelationsEditor from './RelationsEditor.vue'
import OptionsEditor from './OptionsEditor.vue'
import PolicyEditor from './PolicyEditor.vue'
import type { Declaration, Field } from '../../types'
import { getButton } from '../../test/controls'
it.each([
  [FieldsEditor, 'Add field', 'fields'],
  [TypesEditor, 'Add type', 'item_types'],
  [RelationsEditor, 'Add relation', 'relation_types'],
] as const)('creates definitions on user writes, leaving absent collections absent on reads', async (component, action, key) => {
  const draft = reactive<Declaration>({}), w = mount(component, { props: { draft } })
  expect(draft).toEqual({})
  await w.get('input').setValue('new_entry'); await getButton(w, action).trigger('click')
  expect(draft[key]).toHaveLength(1); w.unmount()
})
it('creates policy only when a policy control changes', async () => {
  const draft = reactive<Declaration>({}), w = mount(PolicyEditor, { props: { draft } })
  expect(draft).toEqual({})
  const visits = w.findAllComponents(InputNumber).find(c => c.props('ariaLabel') === 'Default maximum visits')!
  await visits.setValue(7); expect(draft.policy?.stage_max_visits).toBe(7)
  await visits.setValue(null); expect(draft.policy?.stage_max_visits).toBeUndefined(); w.unmount()
})
it('leaves absent options untouched until Add option', async () => {
  const field = reactive<Field>({ code: 'status', type: 'option', form: 'text' }), w = mount(OptionsEditor, { props: { field } })
  expect(field.options).toBeUndefined()
  await getButton(w, 'Add option').trigger('click'); expect(field.options).toHaveLength(1); w.unmount()
})
it('edits the item key prefix through the schema draft', async () => {
  const draft = reactive<Declaration>({ key_prefix: 'OLD' }), w = mount(PolicyEditor, { props: { draft } })
  await w.get('[aria-label="Item key prefix"]').setValue('NEW')
  expect(draft).toEqual({ key_prefix: 'NEW' }); w.unmount()
})
