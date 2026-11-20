// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import SelectButton from 'primevue/selectbutton'
import LayoutEditor from './LayoutEditor.vue'
import SchemaBuilder from './builder/SchemaBuilder.vue'
import BuilderFields from './builder/BuilderFields.vue'
import { pim } from '../api'
import { attribute, createSchema } from '../test/fixtures'
vi.mock('../api', () => ({ pim: Object.fromEntries(['schema', 'schemaOptions', 'planSchema', 'applySchema'].map(key => [key, vi.fn()])) }))
const wrappers: VueWrapper[] = []
afterEach(() => wrappers.splice(0).forEach(w => w.unmount()))
function fixture() {
  const schema = createSchema()
  schema.declaration.aspects![0].attributes!.push({ code: 'color', type: attribute.type, width: 'quarter' })
  schema.attributes['core.color'] = { ...attribute, id: 2, width: 'quarter' }
  return schema
}
const button = (w: VueWrapper, text: string) => w.findAll('button').find(b => b.text() === text)!
const tab = async (w: VueWrapper, text: string) => { await w.findAll('[role=tab]').find(t => t.text() === text)!.trigger('click') }
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(pim.schema).mockResolvedValue(fixture())
  vi.mocked(pim.schemaOptions).mockResolvedValue({ types: [], plugins: [], scopes: [], link_kinds: [] })
  vi.mocked(pim.planSchema).mockResolvedValue({ generation: 2, class: 'cosmetic', changes: [], refused: [] })
  vi.mocked(pim.applySchema).mockResolvedValue({ generation: 2, class: 'cosmetic' })
})
it('arranges fields with arrows, constrains boundary moves, and uses compiled width defaults', async () => {
  const schema = fixture(), draft = structuredClone(schema.declaration)
  const w = mount(LayoutEditor, { props: { schema, draft } }); wrappers.push(w)
  expect(w.findAll('.pim-lcard').map(c => c.attributes('style'))).toEqual(['grid-column: span 12;', 'grid-column: span 3;'])
  expect(w.get('[aria-label="Move Name earlier"]').attributes('disabled')).toBeDefined()
  await w.get('[aria-label="Move Color earlier"]').trigger('click')
  expect(draft.aspects![0].attributes!.map(a => a.code)).toEqual(['color', 'name'])
  expect(w.get('[aria-label="Move Name later"]').attributes('disabled')).toBeDefined()
  await w.getComponent(SelectButton).setValue('third')
  expect(draft.aspects![0].attributes![0].width).toBe('third')
  expect(schema.declaration.aspects![0].attributes![0].code).toBe('name')
})
it('supports dragging within a group and rejects drops across groups', async () => {
  const schema = fixture(), draft = structuredClone(schema.declaration)
  draft.aspects!.push({ namespace: 'other', attributes: [{ code: 'notes', type: attribute.type }] })
  const w = mount(LayoutEditor, { props: { schema, draft } }); wrappers.push(w)
  await w.findAll('.pim-lcard')[0].trigger('dragstart')
  await w.findAll('.pim-lcard')[2].trigger('drop')
  expect(draft.aspects![0].attributes![0].code).toBe('name')
  await w.findAll('.pim-lcard')[0].trigger('dragstart')
  await w.findAll('.pim-lcard')[1].trigger('dragover')
  expect(w.findAll('.pim-lcard')[1].classes()).toContain('over')
  await w.findAll('.pim-lcard')[1].trigger('drop')
  expect(draft.aspects![0].attributes!.map(a => a.code)).toEqual(['color', 'name'])
  expect(w.find('.over').exists()).toBe(false)
})
it('shows plugin fields without editable controls and leaves the draft unchanged on read', () => {
  const schema = fixture(), draft = structuredClone(schema.declaration), initial = JSON.stringify(draft)
  schema.attributes['stock.quantity'] = { ...attribute, plugin: 'stock', width: 'half' }
  const w = mount(LayoutEditor, { props: { schema, draft } }); wrappers.push(w)
  expect(w.get('.fixed').text()).toContain('Quantity')
  expect(w.get('.fixed').find('button').exists()).toBe(false)
  expect(JSON.stringify(draft)).toBe(initial)
})
it('shares the field draft, invalidates a review after layout edits, and applies its reviewed snapshot', async () => {
  const w = mount(SchemaBuilder, { props: { catalogId: 'cat', title: 'Apparel' } }); wrappers.push(w); await flushPromises()
  w.getComponent(BuilderFields).props('draft').policy = { trash_days: 45 }
  await tab(w, 'Form layout')
  await w.getComponent(SelectButton).setValue('half')
  await button(w, 'Review changes').trigger('click'); await flushPromises()
  expect(pim.planSchema).toHaveBeenLastCalledWith('cat', expect.objectContaining({ policy: { trash_days: 45 } }), 1, {})
  await w.get('[aria-label="Move Color earlier"]').trigger('click')
  expect(button(w, 'Review changes')).toBeDefined()
  await button(w, 'Review changes').trigger('click'); await flushPromises()
  const reviewed = vi.mocked(pim.planSchema).mock.calls.at(-1)![1]
  expect(reviewed.aspects![0].attributes!.map(a => a.code)).toEqual(['color', 'name'])
  await button(w, 'Apply layout').trigger('click'); await flushPromises()
  expect(pim.applySchema).toHaveBeenLastCalledWith('cat', reviewed, 1, {})
  expect(w.text()).toContain('Applied as generation 2 (cosmetic)')
})
it('discards layout edits with the same builder action and surfaces generation conflicts', async () => {
  const w = mount(SchemaBuilder, { props: { catalogId: 'cat' } }); wrappers.push(w); await flushPromises()
  await tab(w, 'Form layout'); await w.getComponent(SelectButton).setValue('half')
  await button(w, 'Discard').trigger('click')
  expect(w.getComponent(SelectButton).props('modelValue')).toBe('full')
  expect(w.text()).not.toContain('Unsaved changes')
  await w.getComponent(SelectButton).setValue('half')
  await button(w, 'Review changes').trigger('click'); await flushPromises()
  vi.mocked(pim.applySchema).mockRejectedValue(new Error('Schema generation changed'))
  await button(w, 'Apply layout').trigger('click'); await flushPromises()
  expect(w.get('[role=alert]').text()).toContain('Schema generation changed')
  expect(w.text()).toContain('Unsaved changes')
})
it('keeps the layout readable and every mutation unavailable to non-admins', async () => {
  const schema = fixture(); schema.access.admin = false
  vi.mocked(pim.schema).mockResolvedValue(schema)
  const w = mount(SchemaBuilder, { props: { catalogId: 'cat' } }); wrappers.push(w); await flushPromises()
  await tab(w, 'Form layout')
  expect(w.get('.pim-layout').element.closest('[inert], fieldset[disabled]')).toBeNull()
  expect(w.findAll('.pim-lcard').every(c => c.attributes('draggable') === 'false')).toBe(true)
  expect(w.findAllComponents(SelectButton).every(control => control.props('disabled'))).toBe(true)
  expect(w.find('[aria-label="Move Name earlier"]').exists()).toBe(false)
  expect(w.findAll('button').some(b => ['Apply layout', 'Discard', 'Review changes'].includes(b.text()))).toBe(false)
})
