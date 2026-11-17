// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'
import { host } from '@wippy-fe/proxy'
import Select from 'primevue/select'
import AdminApp from './AdminApp.vue'
import SettingsApp from './SettingsApp.vue'
import SchemaBuilder from './builder/SchemaBuilder.vue'
import BuilderFields from './builder/BuilderFields.vue'
import BuilderVocabularies from './builder/BuilderVocabularies.vue'
import { pim } from '../api'
import { createSchema } from '../test/fixtures'
import { hostProps, hostEmit } from '../test/setup'

vi.mock('../api', () => ({ pim: Object.fromEntries(['listCatalogs', 'catalogSummary', 'schema', 'schemaOptions', 'termsPage', 'apply', 'invalidateTerms', 'planSchema'].map(k => [k, vi.fn()])) }))
const row = (id: string) => ({ catalog_id: id, title: id, access: { read: true, write: true, admin: true } })
const button = (w: ReturnType<typeof mount>, text: string) => w.findAll('button').find(b => b.text() === text)!
beforeEach(() => {
  vi.clearAllMocks()
  hostProps.value = { catalogId: 'cat', embedded: true }
  vi.mocked(host.confirm).mockResolvedValue(true)
  vi.mocked(pim.listCatalogs).mockResolvedValue({ catalogs: [row('First'), row('Second')] })
  vi.mocked(pim.catalogSummary).mockResolvedValue(row('cat'))
  vi.mocked(pim.schema).mockResolvedValue(createSchema())
  vi.mocked(pim.schemaOptions).mockResolvedValue({ types: [], scopes: [], plugins: [], link_kinds: [] })
})
it('opens the existing catalog share widget only for ADMIN', async () => {
  const w = mount(SettingsApp); await flushPromises()
  await button(w, 'Share').trigger('click'); await flushPromises()
  const widget = w.get('kickside-share')
  expect(JSON.parse(widget.attributes('config')!)).toMatchObject({ resource_id: 'cat', access_url: '/api/v1/component-access/grants/cat', share_url: '/api/v1/component-access/share/cat' })
  await widget.trigger('close'); expect(w.find('kickside-share').exists()).toBe(false)
  w.unmount()
  const s = createSchema(); s.access.admin = false; vi.mocked(pim.schema).mockResolvedValue(s)
  const reader = mount(SettingsApp); await flushPromises()
  expect(reader.findAll('button').some(b => b.text() === 'Share')).toBe(false); reader.unmount()
})
it('cancels catalog switching with a dirty draft and switches after confirmation', async () => {
  const w = mount(AdminApp); await flushPromises()
  await w.findAll('.pim-rail-row')[0].trigger('click')
  await w.get('kickside-pim-catalog-settings').trigger('dirty-changed', { detail: { dirty: true } })
  vi.mocked(host.confirm).mockResolvedValue(false)
  await w.findAll('.pim-rail-row')[1].trigger('click'); await flushPromises()
  expect(host.confirm).toHaveBeenCalled()
  expect(w.get('kickside-pim-catalog-settings').attributes('catalog-id')).toBe('First')
  vi.mocked(host.confirm).mockResolvedValue(true)
  await w.findAll('.pim-rail-row')[1].trigger('click'); await flushPromises()
  expect(w.get('kickside-pim-catalog-settings').attributes('catalog-id')).toBe('Second'); w.unmount()
})
it('forwards schema dirty changes across the settings component boundary', async () => {
  const w = mount(SettingsApp); await flushPromises()
  w.getComponent(SchemaBuilder).vm.$emit('dirty-changed', true); await flushPromises()
  expect(hostEmit).toHaveBeenCalledWith('dirty-changed', { dirty: true }); w.unmount()
})
it('clears discarded JSON validity on leaving Declaration and allows visual review', async () => {
  const w = mount(SchemaBuilder, { props: { catalogId: 'cat' } }); await flushPromises()
  await w.findAll('[role=tab]').find(t => t.text() === 'Declaration')!.trigger('click')
  await w.get('textarea').setValue('{broken')
  expect(w.get('[role=alert]').text()).toContain('Invalid declaration:')
  await w.findAll('[role=tab]').find(t => t.text() === 'Fields')!.trigger('click')
  w.getComponent(BuilderFields).props('draft').aspects![0].attributes![0].width = 'full'; await flushPromises()
  expect(button(w, 'Review changes').attributes('disabled')).toBeUndefined()
  expect(w.find('[role=alert]').exists()).toBe(false); w.unmount()
})
it('retries a failed term read and clears its old error after recovery', async () => {
  vi.mocked(pim.termsPage).mockRejectedValueOnce(new Error('Temporary term outage')).mockResolvedValue({ terms: [{ code: 'red', labels: { en: 'Red' }, retired: false }], as_of: 1 })
  const s = createSchema(); s.vocabularies = { colors: { code: 'colors', hierarchical: false } }
  const w = mount(BuilderVocabularies, { props: { catalogId: 'cat', draft: { vocabularies: [{ code: 'colors' }] }, schema: s } })
  await w.get('.pim-definition-toggle').trigger('click'); await button(w, 'Terms').trigger('click'); await flushPromises()
  expect(w.text()).toContain('Temporary term outage')
  await button(w, 'Retry').trigger('click'); await flushPromises()
  expect(w.text()).toContain('Red'); expect(w.text()).not.toContain('Temporary term outage')
  expect(w.text()).toContain('Term changes save immediately')
  vi.mocked(host.confirm).mockResolvedValue(false)
  await button(w, 'Retire').trigger('click'); await flushPromises()
  expect(host.confirm).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('immediately') }))
  expect(pim.apply).not.toHaveBeenCalled(); w.unmount()
})
it('labels value counts for operators while preserving wire values', async () => {
  const s = createSchema()
  const w = mount(BuilderFields, { props: { draft: s.declaration, schema: s, options: { types: [], scopes: [], plugins: [], link_kinds: [] } } })
  await w.get('.field-toggle').trigger('click')
  const values = w.findAllComponents(Select).find(c => c.props('modelValue') === 'one')!
  expect(values.props('options')).toEqual([{ value: 'one', label: 'Single value' }, { value: 'list', label: 'Ordered list' }, { value: 'set', label: 'Unique set' }])
  expect(w.text()).toContain('Values'); expect(w.text()).toContain('Add field group'); expect(w.text()).not.toContain('aspect'); w.unmount()
})
it('publishes Quantity configuration through built-in metadata for the shared form', () => {
  const { entries } = parse(readFileSync('../../pim/src/types/_index.yaml', 'utf8'))
  const quantity = entries.find((e: { name: string }) => e.name === 'quantity').meta.config_schema
  expect(quantity).toMatchObject({ type: 'object', required: ['units', 'canonical'], properties: { units: { type: 'object' }, canonical: { type: 'string' } } })
  expect(entries.find((e: { name: string }) => e.name === 'money').meta.config_schema.properties.currency).toMatchObject({ type: 'string' })
  for (const name of ['text', 'integer', 'number', 'money', 'record']) expect(entries.find((e: {name: string}) => e.name === name).meta.config_schema).toBeDefined()
})
it('documents shipped types and configuration route and labels the System tab Catalogs', () => {
  const spec = readFileSync('../../pim/docs/SPEC.md', 'utf8')
  expect(spec).not.toContain('/plugins/{plugin}/config')
  expect(spec).not.toContain('`asset`, `record`')
  const { entries } = parse(readFileSync('../src/_index.yaml', 'utf8'))
  expect(entries.find((e: {name: string}) => e.name === 'settings_tab')).toMatchObject({ label: 'Catalogs', access: 'kickside.pim.api:apply_schema.endpoint' })
})
