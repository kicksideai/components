// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import InputNumber from 'primevue/inputnumber'
import ToggleSwitch from 'primevue/toggleswitch'
import Select from 'primevue/select'
import ConfigForm from './ConfigForm.vue'
const schema = { type: 'object', properties: {
  max_files: { type: 'integer', title: 'Files per item', description: 'Limit each item.', minimum: 1 },
  allowed_types: { type: 'array', title: 'Allowed file types', description: 'Media types accepted.', items: { type: 'string' } },
  include_comments: { type: 'boolean', description: 'Index comments too.' }, mode: { type: 'string', enum: ['all', 'selected'] },
} }
it('uses schema labels and help, chips for strings, and themed scalar controls', async () => {
  const w = mount(ConfigForm, { props: { schema, modelValue: { max_files: 5, allowed_types: ['text/plain'] } } })
  expect(w.text()).toContain('Files per item'); expect(w.text()).toContain('Limit each item.')
  expect(w.text()).toContain('Include comments'); expect(w.text()).toContain('Index comments too.')
  expect(w.find('details').exists()).toBe(false); expect(w.find('.p-chip').text()).toContain('text/plain')
  expect(w.findComponent(InputNumber).exists()).toBe(true); expect(w.findComponent(ToggleSwitch).exists()).toBe(true)
  expect(w.getComponent(Select).props('appendTo')).toBe('self')
  await w.get('[aria-label="Add value"]').trigger('click')
  await w.get('[aria-label="Add allowed file types"]').setValue('image/png')
  await w.get('[aria-label="Add allowed file types"]').trigger('keydown', { key: 'Enter' })
  expect(w.emitted('update:modelValue')?.at(-1)).toEqual([{ max_files: 5, allowed_types: ['text/plain', 'image/png'] }]); w.unmount()
})
it('reports validation inline and keeps invalid configuration unsavable', async () => {
  const w = mount(ConfigForm, { props: { schema, modelValue: { max_files: 0 } } })
  expect(w.get('[role=alert]').text()).toContain('at least 1'); expect(w.emitted('validity')?.at(-1)).toEqual([false])
  await w.getComponent(InputNumber).setValue(3)
  await w.setProps({ modelValue: { max_files: 3 } })
  expect(w.find('[role=alert]').exists()).toBe(false); expect(w.emitted('validity')?.at(-1)).toEqual([true]); w.unmount()
})
it('reports validity only when the valid state changes', async () => {
  const required = { ...schema, required: ['max_files'] }
  const w = mount(ConfigForm, { props: { schema: required, modelValue: {} } })
  await w.setProps({ modelValue: {} })
  expect(w.emitted('validity')).toEqual([[false]])
  await w.setProps({ modelValue: { max_files: 3 } })
  await w.setProps({ modelValue: { max_files: 5 } })
  expect(w.emitted('validity')).toEqual([[false], [true]])
  w.unmount()
})
