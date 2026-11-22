// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { closeTechnicalSchema, openTechnicalSchema, settingsTab } from '../../test/settings-navigation'
import { beforeEach, expect, it, vi } from 'vitest'
import { host } from '@wippy-fe/proxy'
import { flushPromises, mount } from '@vue/test-utils'
import SchemaBuilder from './SchemaBuilder.vue'
import BuilderDeclaration from './BuilderDeclaration.vue'
import BuilderPlugins from './BuilderPlugins.vue'
import BuilderPolicy from './BuilderPolicy.vue'
import BuilderVocabularies from './BuilderVocabularies.vue'
import ConfigForm from './ConfigForm.vue'
import { pim } from '../../api'
import Select from 'primevue/select'
import type { Declaration } from '../../types'
import { schema, pluginFixture } from '../../test/fixtures'
vi.mock('../../api', () => ({ pim: { schema: vi.fn(), schemaOptions: vi.fn(), planSchema: vi.fn(), applySchema: vi.fn(), configurePlugin: vi.fn(), termsPage: vi.fn(), invalidateTerms: vi.fn(), apply: vi.fn() } }))
beforeEach(() => {
  vi.mocked(host.confirm).mockResolvedValue(true)
  vi.mocked(pim.schema).mockResolvedValue(structuredClone(schema))
  vi.mocked(pim.schemaOptions).mockResolvedValue({ types: [], scopes: [], plugins: [], link_kinds: [] })
})
it('shows a planning transport failure as an error (M18)', async () => {
  const w = mount(SchemaBuilder, { props: { catalogId: 'cat' } }); await flushPromises()
  await openTechnicalSchema(w)
  await w.get('textarea').setValue('{"aspects":[{"namespace":"other"}]}'); await w.get('textarea').trigger('blur')
  await closeTechnicalSchema(w)
  vi.mocked(pim.planSchema).mockRejectedValue(new Error('Network offline'))
  await w.findAll('button').find(b => b.text() === 'Review changes')!.trigger('click'); await flushPromises()
  expect(w.get('[role=alert]').text()).toContain('Network offline'); expect(w.text()).not.toContain('Refused:'); w.unmount()
})
it('reports invalid declaration roots before blur (m1)', async () => {
  const w = mount(BuilderDeclaration, { props: { draft: {} } })
  await w.get('textarea').setValue('null')
  expect(w.get('[role=alert]').text()).toBe('Invalid declaration: Declaration must be an object.')
  expect(w.emitted('validity')?.at(-1)?.[0]).toBe(false); expect(w.emitted('replace')).toBeUndefined(); w.unmount()
})
it('sends false to reset a persisted policy (M10)', async () => {
  const draft: Declaration = { policy: { audit: 'fields' } }
  const w = mount(BuilderPolicy, { props: { draft } }); await w.getComponent(Select).setValue('')
  expect(draft.policy?.audit).toBe(false); w.unmount()
})
it('mounts the shared typed config widget (M11)', async () => {
  const w = mount(ConfigForm, { props: { schema: { properties: { active: { type: 'boolean' } } }, modelValue: { active: true } } }); await flushPromises()
  await w.get('wc-schema-form').trigger('config-changed', { detail: { active: false } })
  expect(w.emitted('update:modelValue')?.at(-1)?.[0]).toEqual({ active: false }); w.unmount()
})
it('shows rejected retirement findings (M19)', async () => {
  const s = { ...schema, vocabularies: { colors: { code: 'colors', hierarchical: false } } }
  vi.mocked(pim.termsPage).mockResolvedValue({ terms: [{ code: 'red', labels: { en: 'Red' }, retired: false }], as_of: 1 })
  vi.mocked(pim.apply).mockResolvedValue({ applied: false, outcomes: [{ outcome: 'invalid', findings: [{ code: 'referenced', message: 'Term is referenced' }] }] })
  const w = mount(BuilderVocabularies, { props: { catalogId: 'cat', draft: { vocabularies: [{ code: 'colors' }] }, schema: s } })
  await w.get('.pim-definition-toggle').trigger('click')
  await w.findAll('button').find(b => b.text() === 'Terms')!.trigger('click'); await flushPromises()
  await w.findAll('button').find(b => b.text() === 'Retire')!.trigger('click'); await flushPromises()
  expect(w.text()).toContain('Term is referenced'); w.unmount()
})

it('sends initial plugin configuration with the reviewed activation', async () => {
  vi.mocked(pim.schemaOptions).mockResolvedValue({ types: [], scopes: [], link_kinds: [], plugins: [{ ...pluginFixture('stock'), config_schema: {type:'object'} }] })
  vi.mocked(pim.planSchema).mockResolvedValue({generation:2,class:'additive',changes:[],refused:[]})
  vi.mocked(pim.applySchema).mockResolvedValue({generation:2,class:'additive'})
  const w = mount(SchemaBuilder, {props:{catalogId:'cat'}})
  await flushPromises()
  await settingsTab(w, 'Plugins')
  const plugins = w.getComponent(BuilderPlugins)
  plugins.props('draft').plugins = [{use:'stock'}]
  plugins.props('pluginConfigs')!.stock = {hold_seconds:120}
  await flushPromises()
  await w.findAll('button').find(b=>b.text()==='Review changes')!.trigger('click')
  await flushPromises()
  expect(pim.planSchema).toHaveBeenLastCalledWith('cat', expect.objectContaining({plugins:[{use:'stock'}]}), schema.schema_generation, {stock:{hold_seconds:120}})
  await w.findAll('button').find(b=>b.text()==='Apply changes')!.trigger('click')
  await flushPromises()
  expect(pim.applySchema).toHaveBeenLastCalledWith('cat', expect.objectContaining({plugins:[{use:'stock'}]}), schema.schema_generation, {stock:{hold_seconds:120}})
  w.unmount()
})
const pluginOptions = {
  types: [], scopes: [], link_kinds: [],
  plugins: [{
    ...pluginFixture('stock'), title: 'Inventory',
    config_schema: { type: 'object', properties: { hold_seconds: { type: 'integer' } } },
  }],
}

function activePlugins(...ids: string[]) {
  const active = structuredClone(schema)
  active.plugins = ids.map(id => ({ ...pluginFixture(id), active: true, config: { hold_seconds: 60 } }))
  active.declaration.plugins = ids.map(use => ({ use }))
  vi.mocked(pim.schema).mockResolvedValue(active)
  vi.mocked(pim.schemaOptions).mockResolvedValue(pluginOptions)
}

it('reviews an active plugin configuration without applying an unchanged declaration', async () => {
  vi.clearAllMocks()
  activePlugins('stock')
  vi.mocked(pim.configurePlugin).mockResolvedValue({ seq: 3 })
  const w = mount(SchemaBuilder, { props: { catalogId: 'cat' } })
  await flushPromises()
  await settingsTab(w, 'Plugins')
  const plugins = w.getComponent(BuilderPlugins)
  plugins.props('pluginConfigs')!.stock = { hold_seconds: 180 }
  await flushPromises()
  await w.findAll('button').find(b => b.text() === 'Review changes')!.trigger('click')
  await flushPromises()
  expect(w.text()).toContain('Hold seconds · 180')
  expect(pim.configurePlugin).not.toHaveBeenCalled()
  await w.findAll('button').find(b => b.text() === 'Apply changes')!.trigger('click')
  await flushPromises()
  expect(pim.configurePlugin).toHaveBeenCalledWith('cat', 'stock', { hold_seconds: 180 })
  expect(pim.planSchema).not.toHaveBeenCalled()
  expect(pim.applySchema).not.toHaveBeenCalled()
  expect(plugins.props('pluginConfigs')).toEqual({})
  w.unmount()
})

it('does not clear a new catalog configuration draft when an old save returns', async () => {
  activePlugins('stock')
  let finish!: (value: { seq: number }) => void
  vi.mocked(pim.configurePlugin).mockReturnValueOnce(new Promise(resolve => { finish = resolve }))
  const w = mount(SchemaBuilder, { props: { catalogId: 'first' } })
  await flushPromises()
  const vm = w.vm as unknown as { review: () => Promise<void>; apply: () => Promise<void>; pluginConfigs: Record<string, unknown> }
  vm.pluginConfigs.stock = { hold_seconds: 180 }
  await vm.review()
  const save = vm.apply()
  await w.setProps({ catalogId: 'second' })
  await flushPromises()
  vm.pluginConfigs.stock = { hold_seconds: 240 }
  finish({ seq: 1 })
  await save
  expect(vm.pluginConfigs.stock).toEqual({ hold_seconds: 240 })
  w.unmount()
})

it('applies the reviewed declaration and keeps only failed active configuration in the draft', async () => {
  vi.clearAllMocks()
  activePlugins('stock', 'pricing')
  vi.mocked(pim.planSchema).mockResolvedValue({ generation: 2, class: 'cosmetic', changes: [], refused: [] })
  vi.mocked(pim.applySchema).mockResolvedValue({ generation: 2, class: 'cosmetic' })
  vi.mocked(pim.configurePlugin).mockResolvedValueOnce({ seq: 3 }).mockRejectedValueOnce(new Error('Pricing validation failed'))
  const w = mount(SchemaBuilder, { props: { catalogId: 'cat' } })
  await flushPromises()
  const vm = w.vm as unknown as { review: () => Promise<void>; apply: () => Promise<void>; pluginConfigs: Record<string, unknown> }
  await settingsTab(w, 'Plugins')
  w.getComponent(BuilderPlugins).props('draft').aspects![0].attributes![0].width = 'half'
  vm.pluginConfigs.stock = { hold_seconds: 180 }
  vm.pluginConfigs.pricing = { enabled: false }
  await vm.review()
  await vm.apply()
  await flushPromises()
  expect(pim.applySchema).toHaveBeenCalledWith('cat', expect.objectContaining({ aspects: expect.any(Array) }), 1, {})
  expect(pim.configurePlugin).toHaveBeenNthCalledWith(1, 'cat', 'stock', { hold_seconds: 180 })
  expect(pim.configurePlugin).toHaveBeenNthCalledWith(2, 'cat', 'pricing', { enabled: false })
  expect(vm.pluginConfigs).toEqual({ pricing: { enabled: false } })
  expect(w.text()).toContain('Pricing validation failed')
  w.unmount()
})

it('opens an empty catalog in the schema editor and applies its first definitions', async () => {
  const empty = { ...structuredClone(schema), declaration: {}, attributes: {} }
  vi.mocked(pim.schema).mockResolvedValue(empty)
  vi.mocked(pim.planSchema).mockResolvedValue({ generation: 2, class: 'additive', changes: [], refused: [] })
  vi.mocked(pim.applySchema).mockResolvedValue({ generation: 2, class: 'additive' })
  const w = mount(SchemaBuilder, { props: { catalogId: 'new', embedded: true } })
  await flushPromises()
  expect(w.text()).not.toMatch(/generation 1/i)
  expect(w.text()).toContain('Set up products')
  expect(w.find('.p-message-error').exists()).toBe(false)
  expect(w.find('fieldset').attributes('disabled')).toBeUndefined()
  await openTechnicalSchema(w)
  const declaration = { aspects: [{ namespace: 'core', attributes: [{ code: 'name', type: 'kickside.pim.types:text' }] }] }
  await w.get('textarea').setValue(JSON.stringify(declaration)); await w.get('textarea').trigger('blur')
  await closeTechnicalSchema(w)
  await w.findAll('button').find(b => b.text() === 'Review changes')!.trigger('click'); await flushPromises()
  expect(pim.planSchema).toHaveBeenLastCalledWith('new', declaration, 1, {})
  await w.findAll('button').find(b => b.text() === 'Apply changes')!.trigger('click'); await flushPromises()
  expect(pim.applySchema).toHaveBeenLastCalledWith('new', declaration, 1, {})
  w.unmount()
})
