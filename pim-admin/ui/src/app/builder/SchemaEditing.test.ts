// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { settingsTab } from '../../test/settings-navigation'
import { api, host } from '@wippy-fe/proxy'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import SelectButton from 'primevue/selectbutton'
import { attribute, createSchema } from '../../test/fixtures'
import type { ApplyItem, SchemaOptions, TermRow } from '../../types'
import BuilderVocabularies from './BuilderVocabularies.vue'
import ChipPicker from './ChipPicker.vue'
import SchemaBuilder from './SchemaBuilder.vue'

const wrappers: VueWrapper[] = []
const button = (w: VueWrapper, name: string) => w.findAll('button').find(b => b.text() === name)!
const response = (data: unknown) => ({ data: { data } }) as never

beforeEach(() => { vi.resetAllMocks() })
afterEach(() => wrappers.splice(0).forEach(w => w.unmount()))

it('keeps a term available to restore after retirement and offers only active parents', async () => {
  vi.mocked(host.confirm).mockResolvedValue(true)
  const schema = createSchema()
  schema.vocabularies.colors = { code: 'colors', hierarchical: true }
  const rows: TermRow[] = [
    { code: 'red', labels: { en: 'Red' }, retired: false },
    { code: 'blue', labels: { en: 'Blue' }, retired: false },
  ]
  vi.mocked(api.get).mockImplementation(async (_path: string, config?: { params?: Record<string, string> }) =>
    response({ terms: structuredClone(rows.filter(t => config?.params?.retired === 'true' || !t.retired)), as_of: 1 }))
  vi.mocked(api.post).mockImplementation(async (_path: string, data: { items: ApplyItem[] }) => {
    rows[0].retired = data.items[0].retired === true
    return response({ applied: true, outcomes: [{ outcome: 'updated' }] })
  })
  const w = mount(BuilderVocabularies, { props: { catalogId: 'term-recovery', schema, draft: { vocabularies: [{ code: 'colors', hierarchical: true }] } } })
  wrappers.push(w)
  await w.get('.pim-definition-toggle').trigger('click')
  await button(w, 'Terms').trigger('click')
  await flushPromises()
  await button(w, 'Retire').trigger('click')
  await flushPromises()
  expect(w.get('tbody tr').text()).toContain('Retired')
  expect(w.get('tbody tr').text()).toContain('Restore')
  await w.get('[role=combobox]').trigger('click')
  expect(w.findAll('[role=option]').map(option => option.text())).toEqual(['No parent', 'Blue'])
  await button(w, 'Restore').trigger('click')
  await flushPromises()
  expect(w.get('tbody tr').text()).toContain('Red')
  expect(w.get('tbody tr').text()).not.toContain('Restore')
  expect(rows[0].retired).toBe(false)
})

it('keeps the review and its apply action together in a modal and focuses the review', async () => {
  const schema = createSchema()
  vi.mocked(api.get).mockImplementation(async (path: string) => response(path.endsWith('/options') ? { types: [], scopes: [], plugins: [], link_kinds: [] } : schema))
  vi.mocked(api.post).mockResolvedValue(response({ generation: 2, class: 'cosmetic', changes: [{ code: '', class: 'cosmetic', what: 'field order changed' }], refused: [] }))
  const w = mount(SchemaBuilder, { props: { catalogId: 'layout-review', embedded: true }, attachTo: document.body })
  wrappers.push(w)
  await flushPromises()
  await settingsTab(w, 'Form layout')
  await w.getComponent(SelectButton).setValue('half')
  await button(w, 'Review changes').trigger('click')
  await flushPromises()
  const heading = w.get('.pim-plan h2').element
  expect(document.activeElement).toBe(heading)
  expect(w.get('dialog[open][aria-label="Review changes"]').element.contains(heading)).toBe(true)
  expect(w.get('.pim-plan').element.contains(button(w, 'Apply layout').element)).toBe(true)
  expect(w.get('.pim-plan').text()).toContain('Field order changed')
})

it('focuses review failures and displays the typed error code at the top of the editor', async () => {
  vi.mocked(api.get).mockImplementation(async (path: string) => response(path.endsWith('/options') ? { types: [], scopes: [], plugins: [], link_kinds: [] } : createSchema()))
  vi.mocked(api.post).mockRejectedValue({ response: { status: 400, data: { message: 'Every variation level needs axes.', details: { code: 'invalid_schema' } } } })
  const w = mount(SchemaBuilder, { props: { catalogId: 'review-error' }, attachTo: document.body })
  wrappers.push(w)
  await flushPromises()
  await settingsTab(w, 'Form layout')
  await w.getComponent(SelectButton).setValue('half')
  await button(w, 'Review changes').trigger('click')
  await flushPromises()
  const alert = w.get('[role=alert]')
  expect(alert.text()).toContain('Every variation level needs axes.')
  expect(alert.text()).toContain('invalid_schema')
  expect(document.activeElement).toBe(alert.element)
  expect(button(w, 'Apply layout')).toBeUndefined()
})

it('only offers eligible family fields as axes while keeping other fields available for ownership', async () => {
  const schema = createSchema()
  schema.attributes['external.size'] = { ...attribute, form: 'int', plugin: 'external' }
  schema.attributes['external.caption'] = { ...attribute, plugin: 'external' }
  schema.declaration = {
    plugins: [{ use: 'external' }],
    aspects: [
      { namespace: 'core', attributes: [
        { code: 'identifier', type: 'identifier', index: 'key' },
        { code: 'record', type: 'record' },
        { code: 'scoped', type: 'integer', scope: ['locale'] },
        { code: 'many', type: 'integer', cardinality: 'set' },
        { code: 'first', type: 'integer' },
        { code: 'owned', type: 'integer' },
        { code: 'available', type: 'integer' },
      ] },
      { namespace: 'unselected', attributes: [{ code: 'size', type: 'integer' }] },
    ],
    families: [{ code: 'apparel', aspects: ['core', 'external'], variation: [{ axes: ['core.first'], own: ['core.owned'] }, { axes: [] }] }],
  }
  const options: SchemaOptions = { types: [
    { id: 'identifier', form: 'text', indexes: ['none', 'key'] },
    { id: 'record', form: 'record', indexes: ['none'] },
    { id: 'integer', form: 'int', indexes: ['none'] },
  ], scopes: [], plugins: [], link_kinds: [] }
  vi.mocked(api.get).mockImplementation(async (path: string) => response(path.endsWith('/options') ? options : schema))
  const w = mount(SchemaBuilder, { props: { catalogId: 'family-axis' } })
  wrappers.push(w)
  await flushPromises()
  await settingsTab(w, 'Families')
  await w.get('.pim-definition-toggle').trigger('click')
  const pickers = w.findAllComponents(ChipPicker)
  const codes = (index: number) => pickers[index].props('options')!.map(option => option.value)
  expect(codes(1)).toEqual(['core.first', 'core.available', 'external.size'])
  expect(codes(3)).toEqual(['core.available', 'external.size'])
  expect(codes(4)).toEqual(expect.arrayContaining(['core.identifier', 'core.record', 'core.scoped', 'core.many', 'external.caption']))
})

it('shows each blocked change once and keeps it ahead of other review details', async () => {
  vi.mocked(api.get).mockImplementation(async (path: string) => response(path.endsWith('/options') ? { types: [], scopes: [], plugins: [], link_kinds: [] } : createSchema()))
  const blocked = { code: 'core.name', class: 'refused', what: 'type' }
  const width = { code: 'core.name', class: 'cosmetic', what: 'width' }
  vi.mocked(api.post).mockResolvedValue(response({ generation: 2, class: 'refused', changes: [width, blocked], refused: [blocked] }))
  const w = mount(SchemaBuilder, { props: { catalogId: 'blocked-review' } })
  wrappers.push(w)
  await flushPromises()
  await settingsTab(w, 'Form layout')
  await w.getComponent(SelectButton).setValue('half')
  await button(w, 'Review changes').trigger('click')
  await flushPromises()
  expect(w.findAll('.pim-plan li').map(row => row.get('span:last-child').text())).toEqual(['Field type', 'Change the width on product forms'])
  expect(button(w, 'Apply layout')).toBeUndefined()
})

it('holds Apply until a stored field removal is acknowledged', async () => {
  const schema = createSchema()
  schema.declaration.aspects![0].attributes![0].id = 1
  vi.mocked(api.get).mockImplementation(async (path: string) => response(path.endsWith('/options') ? { types: [], scopes: [], plugins: [], link_kinds: [] } : schema))
  vi.mocked(api.post)
    .mockResolvedValueOnce(response({ generation: 1, class: 'semantic', changes: [{ code: 'core.name', what: 'removed', class: 'semantic' }], refused: [] }))
    .mockResolvedValueOnce(response({ generation: 2, class: 'semantic' }))
  const wrapper = mount(SchemaBuilder, { props: { catalogId: 'field-removal' } })
  wrappers.push(wrapper)
  await flushPromises()
  await settingsTab(wrapper, 'Fields')
  await wrapper.get('.field-toggle').trigger('click')
  await button(wrapper, 'Remove field').trigger('click')
  await button(wrapper, 'Review changes').trigger('click')
  await flushPromises()
  const apply = button(wrapper, 'Apply changes')
  expect(apply.attributes('disabled')).toBeDefined()
  expect(wrapper.get('.pim-review-dialog').text()).toContain('Removing fields deletes the values stored in those fields.')
  expect(api.post).toHaveBeenCalledTimes(1)
  await wrapper.get('input[type=checkbox]').setValue(true)
  expect(apply.attributes('disabled')).toBeUndefined()
  await apply.trigger('click')
  await flushPromises()
  expect(api.post).toHaveBeenLastCalledWith('/api/v1/pim/catalogs/field-removal/schema', {
    declaration: expect.objectContaining({ remove: { attributes: ['core.name'] } }),
    expected_generation: 1,
    plugin_configs: {},
  })
})
