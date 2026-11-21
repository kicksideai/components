// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { settingsTab } from '../../test/settings-navigation'
import { beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { reactive } from 'vue'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import BuilderFields from './BuilderFields.vue'
import BuilderPolicy from './BuilderPolicy.vue'
import BuilderPlugins from './BuilderPlugins.vue'
import SchemaBuilder from './SchemaBuilder.vue'
import { pluginFixture, createSchema } from '../../test/fixtures'
import { pim } from '../../api'
import type { Declaration } from '../../types'

vi.mock('../../api', () => ({ pim: Object.fromEntries(['schema', 'schemaOptions', 'termsPage'].map(key => [key, vi.fn()])) }))
const options = { types: [], scopes: [], plugins: [], link_kinds: [] }
beforeEach(() => {
  vi.mocked(pim.schema).mockResolvedValue(createSchema())
  vi.mocked(pim.schemaOptions).mockResolvedValue(options)
})
it('keeps the declaration unchanged while every settings section opens and closes', async () => {
  const schema = createSchema()
  schema.declaration = {
    aspects: [{ namespace: 'core', attributes: [{ code: 'name', type: 'text', scope: ['locale'], index: 'text' }] }],
    dimensions: [{ name: 'locale', members: ['en', 'de'] }],
    families: [{ code: 'apparel', aspects: ['core'] }], vocabularies: [{ code: 'colors' }],
    channels: [{ id: 'web' }], sources: [{ id: 'feed' }],
    plugins: [{ use: 'stock' }], scopes: ['stock'],
  }
  vi.mocked(pim.schema).mockResolvedValue(schema)
  vi.mocked(pim.schemaOptions).mockResolvedValue({ ...options,
    types: [{ id: 'text', title: 'Text', form: 'text', indexes: ['text'] }],
    plugins: [{ ...pluginFixture('stock'), title: 'Inventory' }], scopes: [{ id: 'stock', title: 'Stock', access: 'read', filters: {} }],
  })
  const w = mount(SchemaBuilder, { props: { catalogId: 'cat' } })
  await flushPromises()
  await settingsTab(w, 'Fields')
  const draft = w.getComponent(BuilderFields).props('draft')
  const before = JSON.stringify(draft)
  for (const tab of ['Overview', 'Families', 'Fields', 'Form layout', 'Dimensions', 'Vocabularies', 'Channels', 'Sources', 'Access', 'Plugins']) {
    await settingsTab(w, tab)
    for (const toggle of w.findAll('[aria-expanded=false]')) {
      await toggle.trigger('click'); await flushPromises()
      await toggle.trigger('click')
    }
    expect(w.text(), tab).not.toContain('Unsaved changes')
    expect(JSON.stringify(draft), tab).toBe(before)
    const review = w.findAll('button').find(b => b.text() === 'Review changes')
    if (review) expect(review.attributes('disabled'), tab).toBeDefined()
  }
  w.unmount()
})
it('opens scoped fields without creating index contexts and labels source permissions', async () => {
  const draft = reactive<Declaration>({ aspects: [{ namespace: 'core', attributes: [{ code: 'name', type: 'text', scope: ['locale'], index: 'text' }] }], dimensions: [{ name: 'locale', members: ['en'] }], sources: [{ id: 'feed' }] })
  const before = JSON.stringify(draft)
  const w = mount(BuilderFields, { props: { draft, schema: createSchema(), options } })
  await w.get('.field-toggle').trigger('click')
  expect(JSON.stringify(draft)).toBe(before)
  await w.get('[aria-label="Core settings"]').trigger('click')
  expect(w.text()).toContain('Sources allowed to write')
  const label = w.get('.pim-source-permissions label')
  expect(w.find(`[role="combobox"][aria-labelledby="${label.attributes('id')}"]`).exists()).toBe(true)
  expect(w.text()).toContain('Any source')
  expect(JSON.stringify(draft)).toBe(before)
  expect(w.findAll('.pim-bsection-head h3 .mono')).toHaveLength(0)
  expect(w.find('em').exists()).toBe(false)
  w.unmount()
})
it('shows effective inherited policy without adding an override until editing', async () => {
  const draft = reactive<Declaration>({})
  const w = mount(BuilderPolicy, { props: { draft, defaults: { audit: 'off', audit_days: 365, trash_days: 30, tombstone_days: 90 , proposal_days: 30, completed_work_days: 180, abandoned_work_days: 180, import_days: 180, pending_creation_days: 90, proposal_count: 1000, proposal_bytes: 262144, command_deadline_ms: 5000, maintenance_rows: 500, maintenance_catalogs: 10, rebuild_rows: 500, job_batches: 20, import_rows: 200} } })
  expect(w.getComponent(Select).text()).toContain('Off (default)')
  expect(w.findAll('input').map(i => i.attributes('placeholder'))).toContain('Default: 365')
  expect(draft).toEqual({})
  await w.getComponent(Select).setValue('fields')
  expect(draft.policy).toEqual({ audit: 'fields' })
  await w.getComponent(Select).setValue('')
  expect(draft.policy).toEqual({ audit: false })
  w.unmount()
})
it('shows plugin and scope titles with one state label and an accessible switch', () => {
  const w = mount(BuilderPlugins, { props: { draft: {}, schema: createSchema(), options: { ...options, plugins: [{ ...pluginFixture('kickside.pim.inventory:plugin'), title: 'Inventory' }], scopes: [{ id: 'kickside.pim.inventory:stock', title: 'Stock', access: 'read', filters: {} }] } } })
  expect(w.text()).not.toMatch(/kickside\.[\w.]+:[\w-]+/)
  expect(w.text().match(/Disabled/g)).toHaveLength(1)
  expect(w.text().match(/Available/g)).toHaveLength(1)
  expect(w.find('[role=switch][aria-label="Enable Inventory"]').exists()).toBe(true)
  expect(w.find('[role=switch][aria-label="Use Stock"]').exists()).toBe(true)
  expect(w.find('em').exists()).toBe(false)
  w.unmount()
})
it('uses readable fallbacks when registry declarations have no human title', async () => {
  const id = '95fc46c1-4d10-4786-aad3-b05bfb37e89c'
  const schemaOptions = { ...options,
    plugins: [{ ...pluginFixture(id), title: id }],
    scopes: [{ id, access: 'read', filters: {} }],
    types: [{ id, form: 'text', indexes: [] }],
  }
  const plugins = mount(BuilderPlugins, { props: { draft: {}, schema: createSchema(), options: schemaOptions } })
  const fields = mount(BuilderFields, { props: { draft: { aspects: [{ namespace: 'core', attributes: [{ code: 'name', type: id }] }] }, schema: createSchema(), options: schemaOptions } })
  try {
    await fields.get('.field-toggle').trigger('click')
    for (const wrapper of [plugins, fields]) expect(wrapper.text()).not.toContain(id)
    expect(plugins.findAll('.pim-row-title').map(row => row.text())).toEqual(['Plugin', 'Filter set'])
    expect(fields.get('[data-column=kind]').text()).toBe('Field type')
    expect(plugins.get('[role=switch]').attributes('aria-label')).toBe('Enable Plugin')
  } finally { plugins.unmount(); fields.unmount() }
})
it('does not repeat the plugin state in the expanded configuration', async () => {
  const schema = createSchema()
  schema.plugins = [{ ...pluginFixture('stock'), active: true, problem: { code: 'plugin_config_invalid', message: 'Configuration needs attention.' } }]
  const w = mount(BuilderPlugins, { props: { draft: { plugins: [{ use: 'stock' }] }, schema,
    options: { ...options, plugins: [{ ...pluginFixture('stock'), title: 'Inventory' }] },
  } })
  try {
    expect(w.text().match(/Configuration needed/g)).toHaveLength(1)
    expect(w.text()).not.toContain('Enabled')
    expect(w.get('[role=alert]').text()).toContain('The saved settings don’t meet the plugin’s requirements.')
    expect(w.get('.kx-disclosure').text()).toContain('Configuration needs attention.')
    await w.setProps({ schema: { ...schema, plugins: [{ ...pluginFixture('stock'), active: true }] } })
    expect(w.text()).not.toContain('chosen by this catalog')
  } finally { w.unmount() }
})

it('groups catalog choices first and opens advanced limits without changing the draft', async () => {
  const draft = reactive<Declaration>({ policy: { command_deadline_ms: 1500, proposal_count: 25 } })
  const w = mount(BuilderPolicy, { props: { draft } })
  await flushPromises()
  expect(w.findAll('h3').map(h => h.text())).toEqual(['Retention', 'Proposals'])
  expect(w.get('[data-policy-group=retention]').text()).toContain('Audit trail')
  expect(w.get('[data-policy-group=proposals]').text()).toContain('Proposal retention')
  expect(w.get('[data-policy-group=proposals]').text()).toContain('Proposal quota')
  expect(w.get('[data-policy-group=advanced] [data-pc-name=accordioncontent]').attributes('data-p-active')).toBe('false')
  expect(w.text()).toContain('0 uses the 365-day default. History always expires.')
  expect(w.findAllComponents(InputNumber).find(c => c.props('inputId') === 'pol-audit_days')?.props('max')).toBe(106751)
  const before = JSON.stringify(draft)
  const toggle = w.get('[data-policy-group=advanced] .kx-disclosure-toggle')
  expect(toggle.attributes('aria-expanded')).toBe('false')
  await toggle.trigger('click')
  expect(toggle.attributes('aria-expanded')).toBe('true')
  const advanced = w.get('[data-policy-group=advanced]')
  for (const key of ['command_deadline_ms', 'maintenance_rows', 'maintenance_catalogs', 'rebuild_rows', 'job_batches', 'import_rows', 'proposal_bytes', 'pending_creation_days']) expect(advanced.find('#pol-' + key).exists(), key).toBe(true)
  expect(advanced.text()).not.toMatch(/callback|transaction/)
  for (const key of ['maintenance_rows', 'maintenance_catalogs', 'pending_creation_days']) {
    const input = advanced.get('#pol-' + key)
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.element.closest('.pim-policy-row')?.textContent).toContain('Managed in deployment settings')
  }
  const editable = w.findAllComponents(InputNumber).find(c => c.props('inputId') === 'pol-command_deadline_ms')!
  expect(editable.props('modelValue')).toBe(1500)
  await toggle.trigger('click')
  expect(w.find('#policy-advanced').exists()).toBe(false)
  expect(JSON.stringify(draft)).toBe(before)
  await toggle.trigger('click')
  const reopened = w.findAllComponents(InputNumber).find(c => c.props('inputId') === 'pol-command_deadline_ms')!
  await reopened.vm.$emit('update:modelValue', 2000)
  expect(draft.policy?.command_deadline_ms).toBe(2000)
  await reopened.vm.$emit('update:modelValue', null)
  expect(draft.policy?.command_deadline_ms).toBe(false)
  w.unmount()
})
