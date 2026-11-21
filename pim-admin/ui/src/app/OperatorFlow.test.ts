// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { closeTechnicalSchema, openTechnicalSchema, settingsTab } from '../test/settings-navigation'
import { beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { parse } from 'yaml'
import { api, host } from '@wippy-fe/proxy'
import Select from 'primevue/select'
import AdminApp from './AdminApp.vue'
import SettingsApp from './SettingsApp.vue'
import SchemaBuilder from './builder/SchemaBuilder.vue'
import BuilderFields from './builder/BuilderFields.vue'
import BuilderVocabularies from './builder/BuilderVocabularies.vue'
import { pim } from '../api'
import { createSchema, deferred } from '../test/fixtures'
import { hostProps, hostEmit } from '../test/setup'
import { ApiError } from '../shared/transport'

vi.mock('../api', () => ({ pim: Object.fromEntries(['listCatalogs', 'catalogSummary', 'schema', 'schemaOptions', 'termsPage', 'apply', 'invalidateTerms', 'planSchema', 'applySchema', 'history'].map(k => [k, vi.fn()])) }))
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
  await settingsTab(w, 'Access')
  await button(w, 'Share catalog').trigger('click'); await flushPromises()
  const widget = w.get('kickside-share')
  expect(JSON.parse(widget.attributes('config')!)).toMatchObject({ resource_id: 'cat', access_url: '/api/v1/component-access/grants/cat', share_url: '/api/v1/component-access/share/cat' })
  await widget.trigger('close'); expect(w.find('kickside-share').exists()).toBe(false)
  w.unmount()
  const s = createSchema(); s.access.admin = false; vi.mocked(pim.schema).mockResolvedValue(s)
  const reader = mount(SettingsApp); await flushPromises()
  await settingsTab(reader, 'Access')
  expect(reader.findAll('button').some(b => b.text() === 'Share catalog')).toBe(false); reader.unmount()
})
it('guards the back arrow with a dirty draft and allows switching from the directory', async () => {
  const w = mount(AdminApp); await flushPromises()
  await w.findAll('.pim-catalog-row')[0].trigger('click')
  const settings = w.get('kickside-pim-catalog-settings')
  await settings.trigger('dirty-changed', { detail: { dirty: true } })
  vi.mocked(host.confirm).mockResolvedValueOnce(false)
  await settings.trigger('open-catalog-picker'); await flushPromises()
  expect(host.confirm).toHaveBeenCalledOnce()
  expect(settings.attributes('catalog-id')).toBe('First')
  expect(w.find('.pim-catalog-picker').exists()).toBe(false)
  await settings.trigger('open-catalog-picker'); await flushPromises()
  expect(w.find('kickside-pim-catalog-settings').exists()).toBe(false)
  expect(w.find('.pim-catalog-picker').exists()).toBe(true)
  expect(w.get('.pim-catalog-row[aria-current=true]').text()).toContain('First')
  await w.findAll('.pim-catalog-row')[1].trigger('click')
  expect(w.get('kickside-pim-catalog-settings').attributes('catalog-id')).toBe('Second')
  w.unmount()
})
it('requests the picker without changing the host route in embedded settings', async () => {
  const w = mount(SettingsApp); await flushPromises()
  const rail = w.get('nav[aria-label="Catalog settings sections"]')
  expect(rail.get('button').text()).toBe('All catalogs')
  expect(w.get('.pim-section-layout .kx-main-scroll > header h1').text()).toBe('Overview')
  await rail.get('button').trigger('click')
  expect(hostEmit).toHaveBeenCalledWith('open-catalog-picker', {})
  expect(hostEmit.mock.calls.some(([event]) => event === 'navigate')).toBe(false)
  w.unmount()
})
it('forwards schema dirty changes across the settings component boundary', async () => {
  const w = mount(SettingsApp); await flushPromises()
  w.getComponent(SchemaBuilder).vm.$emit('dirty-changed', true); await flushPromises()
  expect(hostEmit).toHaveBeenCalledWith('dirty-changed', { dirty: true }); w.unmount()
})
it('clears discarded JSON validity on leaving Declaration and allows visual review', async () => {
  const w = mount(SchemaBuilder, { props: { catalogId: 'cat' } }); await flushPromises()
  await openTechnicalSchema(w)
  await w.get('textarea').setValue('{broken')
  expect(w.get('[role=alert]').text()).toContain('Invalid declaration:')
  await closeTechnicalSchema(w)
  await settingsTab(w, 'Fields')
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
it.each(['review', 'apply'])('shows a typed %s conflict and reloads only after confirming draft removal', async action => {
  const conflict = new ApiError({ error: 'schema generation changed', details: { code: 'schema_generation_conflict' } }, 'schema review', 409)
  if (action === 'review') vi.mocked(pim.planSchema).mockRejectedValueOnce(conflict)
  else {
    vi.mocked(pim.planSchema).mockResolvedValueOnce({ generation: 1, class: 'cosmetic', changes: [], refused: [] })
    vi.mocked(pim.applySchema).mockRejectedValueOnce(conflict)
  }
  const w = mount(SchemaBuilder, { props: { catalogId: 'cat' } }); await flushPromises()
  await settingsTab(w, 'Fields')
  w.getComponent(BuilderFields).props('draft').aspects![0].attributes![0].width = 'half'; await flushPromises()
  await button(w, 'Review changes').trigger('click'); await flushPromises()
  if (action === 'apply') { await button(w, 'Apply changes').trigger('click'); await flushPromises() }
  expect(w.get('[role=alert]').text()).toContain('This catalog’s settings changed while you were editing.')
  expect(w.get('[role=alert] code').text()).toBe('schema_generation_conflict')
  vi.mocked(host.confirm).mockResolvedValueOnce(false)
  await button(w, 'Reload settings').trigger('click'); await flushPromises()
  expect(host.confirm).toHaveBeenCalledWith(expect.objectContaining({ acceptLabel: 'Discard and reload' }))
  expect(pim.schema).toHaveBeenCalledTimes(1)
  expect(w.getComponent(BuilderFields).props('draft').aspects![0].attributes![0].width).toBe('half')
  vi.mocked(pim.schema).mockResolvedValueOnce({ ...createSchema(), schema_generation: 2 })
  await button(w, 'Reload settings').trigger('click'); await flushPromises()
  expect(pim.schema).toHaveBeenCalledTimes(2)
  expect(w.text()).not.toMatch(/generation 2/i)
  expect(w.getComponent(BuilderFields).props('draft').aspects![0].attributes![0].width).toBeUndefined()
  expect(w.find('[role=alert]').exists()).toBe(false)
  w.unmount()
})
it('shows a readable access denial and its typed error code', async () => {
  vi.mocked(pim.schema).mockRejectedValueOnce(new ApiError({ error: 'permission check failed', details: { code: 'catalog_access_denied' } }, 'schema', 403))
  const w = mount(SettingsApp); await flushPromises()
  expect(w.get('[role=alert]').text()).toContain('You don’t have access to this catalog.')
  expect(w.get('[role=alert] code').text()).toBe('catalog_access_denied')
  w.unmount()
})
it.each([false, true])('lets non-admins browse field definitions with WRITE %s without editing', async write => {
  const s = createSchema()
  s.access = { read: true, admin: false, write }
  s.declaration.aspects![0].attributes!.push({ code: 'description', type: 'text' })
  vi.mocked(pim.schema).mockResolvedValueOnce(s)
  const w = mount(SettingsApp); await flushPromises()
  await settingsTab(w, 'Fields')
  const toggle = w.get('.field-toggle')
  expect(toggle.element.closest('[inert], fieldset[disabled]')).toBeNull()
  await toggle.trigger('click')
  expect(toggle.attributes('aria-expanded')).toBe('true')
  await w.get('.pim-field-advanced .kx-disclosure-toggle').trigger('click')
  expect(w.get('input[value="name"]').attributes('disabled')).toBeDefined()
  await toggle.trigger('keydown', { key: 'ArrowDown', altKey: true })
  expect(w.findAll('.field-toggle').map(b => b.text())[0]).toContain('Name')
  expect(w.findAll('button').some(b => b.text() === 'Add field group')).toBe(false)
  w.unmount()
})
it('loads readable history without requesting the admin directory for a reader', async () => {
  const s = createSchema(); s.access = { read: true, admin: false, write: false }
  vi.mocked(pim.schema).mockResolvedValueOnce(s)
  vi.mocked(pim.history).mockResolvedValueOnce({ entries: [{ seq: 3, n: 1, subject: 'Catalog', kind: 'schema', after: { generation: 3 }, actor: 'user:private-actor', at: '2026-11-17T12:00:00Z' }], as_of: 3 })
  const w = mount(SettingsApp); await flushPromises()
  await settingsTab(w, 'History')
  expect(w.text()).toContain('Catalog settings applied')
  expect(w.text()).not.toContain('private-actor')
  expect(api.post).not.toHaveBeenCalled()
  w.unmount()
})
it('announces terms loading and separates loading, failure, and a successful empty page', async () => {
  const initial = deferred<Awaited<ReturnType<typeof pim.termsPage>>>()
  const retry = deferred<Awaited<ReturnType<typeof pim.termsPage>>>()
  vi.mocked(pim.termsPage).mockReturnValueOnce(initial.promise).mockReturnValueOnce(retry.promise)
  const s = createSchema(); s.vocabularies = { colors: { code: 'colors', hierarchical: false } }
  const w = mount(BuilderVocabularies, { props: { catalogId: 'cat', draft: { vocabularies: [{ code: 'colors' }] }, schema: s } })
  await w.get('.pim-definition-toggle').trigger('click'); await button(w, 'Terms').trigger('click')
  expect(w.get('[role=status]').text()).toBe('Loading terms…')
  expect(w.text()).not.toContain('No terms yet.')
  initial.reject(new Error('Temporary term outage')); await flushPromises()
  expect(w.find('[role=status]').exists()).toBe(false)
  expect(w.get('[role=alert]').text()).toContain('Temporary term outage')
  expect(w.text()).not.toContain('No terms yet.')
  await button(w, 'Retry').trigger('click')
  expect(w.get('[role=status]').text()).toBe('Loading terms…')
  expect(w.find('[role=alert]').exists()).toBe(false)
  retry.resolve({ terms: [], as_of: 1 }); await flushPromises()
  expect(w.find('[role=status]').exists()).toBe(false)
  expect(w.text()).toContain('No terms yet.')
  w.unmount()
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
