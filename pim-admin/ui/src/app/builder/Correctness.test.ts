// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { reactive } from 'vue'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import BuilderFields from './BuilderFields.vue'
import BuilderVocabularies from './BuilderVocabularies.vue'
import ChipPicker from './ChipPicker.vue'
import DefaultValue from './DefaultValue.vue'
import { createSchema } from '../../test/fixtures'
import { pim } from '../../api'
import type { Declaration } from '../../types'

vi.mock('../../api', () => ({ pim: { termsPage: vi.fn(), apply: vi.fn(), invalidateTerms: vi.fn() } }))
const options = { types: [
  { id: 'kickside.pim.types:text', title: 'Text', form: 'text', indexes: ['none'] },
  { id: 'kickside.pim.types:integer', title: 'Integer', form: 'int', indexes: ['none'] },
], scopes: [], plugins: [], link_kinds: [] }
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(pim.termsPage).mockResolvedValue({ terms: [
    { code: 'red', labels: { en: 'Red' }, retired: false },
    { code: 'old', labels: { en: 'Old' }, retired: true },
  ], as_of: 1 })
  vi.mocked(pim.apply).mockResolvedValue({ applied: true, outcomes: [{ outcome: 'created' }] })
})

it('preserves and edits a default when adding and removing scope', async () => {
  const draft = reactive<Declaration>({ aspects: [{ namespace: 'core', attributes: [
    { code: 'name', type: options.types[0].id, default: 'Preserve this default' },
  ] }], dimensions: [{ name: 'locale', members: ['en'] }] })
  const w = mount(BuilderFields, { props: { draft, schema: createSchema(), options } })
  await w.get('.field-toggle').trigger('click')
  await w.getComponent(ChipPicker).setValue(['locale'])
  const attr = draft.aspects![0].attributes![0]
  expect(attr.default).toBe('Preserve this default')
  expect(w.findComponent(DefaultValue).exists()).toBe(true)
  w.getComponent(DefaultValue).vm.$emit('change', 'Scoped default')
  await w.getComponent(ChipPicker).setValue([])
  expect(attr.default).toBe('Scoped default')
  expect(attr.scope).toBeUndefined()
  w.unmount()
})

it('lets a declared field change type, cardinality and scope for backend review', async () => {
  const schema = createSchema()
  schema.declaration.aspects![0].attributes![0].id = 1
  const draft = reactive(structuredClone(schema.declaration))
  draft.dimensions = [{ name: 'locale', members: ['en'] }]
  const w = mount(BuilderFields, { props: { draft, schema, options } })
  await w.get('.field-toggle').trigger('click')
  const selects = w.findAllComponents(Select)
  const type = selects.find(s => s.props('modelValue') === options.types[0].id)!
  const cardinality = selects.find(s => s.props('modelValue') === 'one')!
  expect(type.props('disabled')).toBeFalsy()
  expect(cardinality.props('disabled')).toBeFalsy()
  expect(w.getComponent(ChipPicker).props('disabled')).toBeFalsy()
  await type.setValue(options.types[1].id)
  await cardinality.setValue('list')
  await w.getComponent(ChipPicker).setValue(['locale'])
  expect(draft.aspects![0].attributes![0]).toMatchObject({ id: 1, type: options.types[1].id, cardinality: 'list', scope: ['locale'] })
  await w.findAll('button').find(b => b.text() === 'Remove field')!.trigger('click')
  expect(w.emitted('remove')).toEqual([['attributes', 'core.name']])
  w.unmount()
})

async function vocabulary(write = true) {
  const schema = createSchema()
  schema.access = { read: true, admin: true, write }
  schema.vocabularies = { colors: { code: 'colors', hierarchical: true } }
  const w = mount(BuilderVocabularies, { props: { catalogId: 'cat', schema,
    draft: { vocabularies: [{ code: 'colors', hierarchical: true }] } } })
  await w.get('.pim-definition-toggle').trigger('click')
  await w.findAll('button').find(b => b.text() === 'Terms')!.trigger('click')
  await flushPromises()
  return w
}

it.each(['XL', '42', 'blue-green', 'A.b_9-', 'x'.repeat(128)])('submits backend-valid term code %s unchanged', async code => {
  const w = await vocabulary()
  const input = w.findAllComponents(InputText).find(i => i.attributes('placeholder') === 'code')!
  await input.setValue(code)
  const add = w.findAll('button').find(b => b.text() === 'Add term')!
  expect(add.attributes('disabled')).toBeUndefined()
  await add.trigger('click'); await flushPromises()
  expect(pim.apply).toHaveBeenCalledWith('cat', [expect.objectContaining({ term: { vocabulary: 'colors', code } })])
  w.unmount()
})

it.each(['', '-bad', '_bad', '.bad', 'blue green', 'é', 'x'.repeat(129), 'XL\n'])('rejects backend-invalid term code %j', async code => {
  const w = await vocabulary()
  const input = w.findAllComponents(InputText).find(i => i.attributes('placeholder') === 'code')!
  await input.setValue(code)
  expect(w.findAll('button').find(b => b.text() === 'Add term')!.attributes('disabled')).toBeDefined()
  expect(pim.apply).not.toHaveBeenCalled()
  w.unmount()
})

it('requires WRITE independently of ADMIN for adding, retiring and restoring terms', async () => {
  const w = await vocabulary(false)
  await w.get('input[placeholder=code]').setValue('valid')
  for (const title of ['Add term', 'Retire', 'Restore']) {
    const button = w.findAll('button').find(b => b.text() === title)!
    expect(button.attributes('disabled'), title).toBeDefined()
    await button.trigger('click')
  }
  expect(pim.apply).not.toHaveBeenCalled()
  expect(w.get('input[placeholder=code]').attributes('disabled')).toBeDefined()
  expect(w.get('input[placeholder="Label (en)"]').attributes('disabled')).toBeDefined()
  expect(w.getComponent(Select).props('disabled')).toBe(true)
  await w.get('input[placeholder=new_vocabulary]').setValue('valid')
  expect(w.findAll('button').find(b => b.text() === 'Add vocabulary')!.attributes('disabled')).toBeUndefined()
  w.unmount()
})

it('allows writers to retire and restore terms while declaration codes stay restricted', async () => {
  const w = await vocabulary()
  vi.mocked(pim.apply).mockResolvedValue({ applied: true, outcomes: [{ outcome: 'updated' }] })
  for (const [title, retired, code] of [['Retire', true, 'red'], ['Restore', false, 'old']] as const) {
    const button = w.findAll('button').find(b => b.text() === title)!
    expect(button.attributes('disabled')).toBeUndefined()
    await button.trigger('click'); await flushPromises()
    expect(pim.apply).toHaveBeenLastCalledWith('cat', [{ term: { vocabulary: 'colors', code }, retired }])
  }
  await w.get('input[placeholder=new_vocabulary]').setValue('XL')
  expect(w.findAll('button').find(b => b.text() === 'Add vocabulary')!.attributes('disabled')).toBeDefined()
  w.unmount()
})
