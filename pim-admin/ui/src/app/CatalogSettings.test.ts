// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFileSync } from 'node:fs'
import { flushPromises, mount } from '@vue/test-utils'
import { chromium, type Browser, type Page } from 'playwright'
import { afterAll, beforeAll, beforeEach, expect, it, vi } from 'vitest'
import { settingsTab } from '../test/settings-navigation'
import { pim } from '../api'
import { attribute, createSchema, pluginFixture } from '../test/fixtures'
import type { SchemaOptions } from '../types'
import SchemaBuilder from './builder/SchemaBuilder.vue'

vi.mock('../api', () => ({ pim: { schema: vi.fn(), schemaOptions: vi.fn() } }))

const css = ['../.wippy/npm/@kickside/ui-kit/kx-head.css', '../.wippy/npm/@kickside/ui-kit/kx-settings-rail.css', 'shared/base.css', 'shared/page-head.css', 'shared/settings.css', 'styles.css']
  .map(file => readFileSync(`src/${file}`, 'utf8').replace(/^@import .*;$/gm, ''))
  .join('\n')
const options: SchemaOptions = {
  types: [{ id: attribute.type, title: 'Text', form: 'text', indexes: ['none', 'key'] }],
  scopes: [], plugins: [], link_kinds: [],
}
let browser: Browser

beforeAll(async () => { browser = await chromium.launch() })
afterAll(async () => { await browser?.close() })
beforeEach(() => {
  vi.mocked(pim.schema).mockResolvedValue(createSchema())
  vi.mocked(pim.schemaOptions).mockResolvedValue(options)
})

async function render(page: Page, html: string) {
  await page.setContent(`<style>${css} body { margin: 0; }</style>${html}`)
}

it('wraps an unbroken catalog heading within the embedded settings rail', async () => {
  const title = 'Northstar'.repeat(20)
  const wrapper = mount(SchemaBuilder, { props: { catalogId: 'cat', title, embedded: true, backLabel: 'All catalogs' } })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  try {
    await flushPromises()
    await render(page, wrapper.html())
    const rail = page.getByRole('navigation', { name: 'Catalog settings sections' })
    expect(await rail.getByRole('button').first().innerText()).toBe('All catalogs')
    const heading = rail.getByText(title, { exact: true })
    expect(await rail.evaluate(el => el.scrollWidth)).toBeLessThanOrEqual(390)
    expect(await heading.evaluate(el => {
      const text = document.createRange()
      text.selectNodeContents(el)
      return text.getClientRects().length
    })).toBeGreaterThan(1)
  } finally {
    wrapper.unmount()
    await page.close()
  }
})

it('associates field labels with their controls in each open row', async () => {
  const schema = createSchema()
  schema.declaration.dimensions = [{ name: 'locale', members: ['en'] }]
  schema.declaration.aspects![0].attributes = [
    { id: 1, code: 'name', type: attribute.type, scope: ['locale'], index: 'key', index_contexts: [{ locale: 'en' }] },
    { id: 2, code: 'description', type: attribute.type },
  ]
  vi.mocked(pim.schema).mockResolvedValue(schema)
  const wrapper = mount(SchemaBuilder, { props: { catalogId: 'cat', title: 'Apparel' } })
  const page = await browser.newPage()
  try {
    await flushPromises()
    await settingsTab(wrapper, 'Fields')
    for (const toggle of wrapper.findAll('.field-toggle')) await toggle.trigger('click')
    for (const toggle of wrapper.findAll('.pim-field-advanced .kx-disclosure-toggle')) await toggle.trigger('click')
    await render(page, wrapper.html())
    const rows = page.locator('.pim-definition-body')
    for (const [i, code] of ['name', 'description'].entries()) {
      const row = rows.nth(i)
      expect(await row.getByRole('textbox', { name: 'Integration key', exact: true }).inputValue({ timeout: 1500 })).toBe(code)
      for (const name of ['Type', 'Values', 'Search and filters']) {
        expect(await row.getByRole('combobox', { name, exact: true }).count()).toBe(1)
      }
      expect(await row.getByRole('group', { name: 'Width', exact: true }).count()).toBe(1)
      expect(await row.getByRole('group', { name: 'Varies per', exact: true }).count()).toBe(1)
      expect(await row.getByRole('switch', { name: 'Unique', exact: true }).count()).toBe(1)
    }
    expect(await rows.first().getByRole('combobox', { name: 'Locale', exact: true }).count()).toBe(1)
    expect(await rows.first().getByRole('textbox', { name: 'Integration key', exact: true }).getAttribute('id'))
      .not.toBe(await rows.last().getByRole('textbox', { name: 'Integration key', exact: true }).getAttribute('id'))
  } finally {
    wrapper.unmount()
    await page.close()
  }
})

it('names family field group, variation, and requirement controls', async () => {
  const schema = createSchema()
  schema.declaration.dimensions = [{ name: 'locale', members: ['en'] }]
  schema.declaration.families = [{
    code: 'equipment', aspects: ['core'], variation: [{ axes: [] }],
    requirements: [{ id: 'published', require: [] }],
  }]
  vi.mocked(pim.schema).mockResolvedValue(schema)
  const wrapper = mount(SchemaBuilder, { props: { catalogId: 'cat', title: 'Apparel' } })
  const page = await browser.newPage()
  try {
    await flushPromises()
    await settingsTab(wrapper, 'Families')
    await wrapper.get('.pim-definition-toggle').trigger('click')
    await render(page, wrapper.html())
    expect(await page.getByRole('group', { name: 'Field groups', exact: true }).count()).toBe(1)
    for (const name of ['Distinguish variants by', 'Other fields edited here', 'Required', 'Entered for this context', 'Locale']) {
      expect(await page.getByRole('combobox', { name, exact: true }).count()).toBe(1)
    }
  } finally {
    wrapper.unmount()
    await page.close()
  }
})

it('names the dimension, channel, and source controls with their visible labels', async () => {
  const schema = createSchema()
  schema.declaration.dimensions = [{ name: 'locale', members: ['en', 'fr'] }]
  schema.declaration.channels = [{ id: 'retail' }]
  schema.declaration.families = [{ code: 'equipment', requirements: [{ id: 'published' }] }]
  schema.declaration.sources = [{ id: 'warehouse' }]
  vi.mocked(pim.schema).mockResolvedValue(schema)
  const wrapper = mount(SchemaBuilder, { props: { catalogId: 'cat', title: 'Apparel' } })
  const page = await browser.newPage()
  try {
    await flushPromises()
    async function openSection(name: string) {
      await settingsTab(wrapper, name)
      for (const toggle of wrapper.findAll('.pim-definition-toggle')) await toggle.trigger('click')
      await render(page, wrapper.html())
    }
    await openSection('Dimensions')
    expect.soft(await page.getByRole('textbox', { name: 'Allowed values', exact: true }).count()).toBe(1)
    expect.soft(await page.getByRole('group', { name: 'en falls back to', exact: true }).count()).toBe(1)
    await openSection('Channels')
    for (const name of ['Release requirements', 'Families']) {
      expect.soft(await page.getByRole('group', { name, exact: true }).count()).toBe(1)
    }
    await openSection('Sources')
    for (const name of ['Field groups it can update', 'People and service accounts']) {
      expect.soft(await page.getByRole('group', { name, exact: true }).count()).toBe(1)
    }
    expect.soft(await page.getByRole('combobox', { name: 'Handle incoming updates', exact: true }).count()).toBe(1)
    expect.soft(await page.getByRole('switch', { name: 'Audit', exact: true }).count()).toBe(1)
  } finally {
    wrapper.unmount()
    await page.close()
  }
})

it('uses registry titles and readable field and filter labels in summaries', async () => {
  const schema = createSchema()
  const plugin = { ...pluginFixture('app:warehouse'), title: 'Warehouse inventory' }
  schema.attributes['warehouse.bin_label'] = { ...attribute, type: 'app:bin_label', plugin: plugin.plugin }
  schema.plugins = [{
    ...plugin, active: true,
    projections: { 'app:availability_projection': { last_seq: 2, parked: true, bootstrapping: false } },
    problem: { message: 'Warehouse data could not be updated.', code: 'plugin_projection_invalid' },
  }]
  vi.mocked(pim.schema).mockResolvedValue(schema)
  vi.mocked(pim.schemaOptions).mockResolvedValue({
    ...options,
    types: [...options.types, { id: 'app:bin_label', title: 'Warehouse bin label', form: 'text', indexes: ['none'] }],
    plugins: [plugin],
    scopes: [{
      id: 'app:stock', title: 'Warehouse availability', access: 'read',
      filters: {
        available_units: { type: 'integer', ops: ['gt', 'gte', 'lt', 'lte', 'eq'] },
        warehouse_location: { type: 'text', ops: ['eq', 'in'] },
      },
    }],
  })
  const wrapper = mount(SchemaBuilder, { props: { catalogId: 'cat', title: 'Apparel' } })
  try {
    await flushPromises()
    await settingsTab(wrapper, 'Form layout')
    expect(wrapper.get('.pim-lcard.fixed').text()).toContain('Warehouse bin label')
    expect(wrapper.get('.pim-lcard.fixed').text()).not.toContain('app:')
    await settingsTab(wrapper, 'Plugins')
    for (const toggle of wrapper.findAll('.pim-definition-toggle[aria-expanded="false"]')) await toggle.trigger('click')
    expect(wrapper.text()).toContain('Adds fields for Bin label.')
    expect(wrapper.text()).toContain('Background update: Paused')
    expect(wrapper.text()).toContain('Available units · Greater than, At least, Less than, At most, Equals')
    expect(wrapper.text()).toContain('Warehouse location · Equals, Is one of')
    expect(wrapper.text()).not.toMatch(/warehouse\.bin_label|available_units|warehouse_location|app:availability_projection/)
    await wrapper.get('.pim-plugin-recovery .kx-disclosure-toggle').trigger('click')
    expect(wrapper.get('.pim-plugin-recovery .pim-error-code').text()).toContain('plugin_projection_invalid')
  } finally { wrapper.unmount() }
})

it.each([
  ['light', '#737373', '#ffffff'],
  ['dark', '#a1a1aa', '#1c1a19'],
])('keeps field help at or above 4.5:1 contrast in the %s theme', async (_theme, muted, background) => {
  const schema = createSchema()
  schema.declaration.aspects![0].attributes![0].id = 1
  vi.mocked(pim.schema).mockResolvedValue(schema)
  const wrapper = mount(SchemaBuilder, { props: { catalogId: 'cat', title: 'Apparel' } })
  const page = await browser.newPage()
  try {
    await flushPromises()
    await settingsTab(wrapper, 'Fields')
    await wrapper.get('.field-toggle').trigger('click')
    await wrapper.get('.pim-field-advanced .kx-disclosure-toggle').trigger('click')
    await render(page, `<main style="background:${background}; --p-text-muted-color:${muted}">${wrapper.html()}</main>`)
    const ratio = await page.getByText('renaming keeps stored values', { exact: true }).evaluate(note => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 1
      const ctx = canvas.getContext('2d')!
      function luminance() {
        const [red, green, blue] = Array.from(ctx.getImageData(0, 0, 1, 1).data).map(value => {
          const channel = value / 255
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
        })
        return 0.2126 * red + 0.7152 * green + 0.0722 * blue
      }
      ctx.fillStyle = getComputedStyle(note.closest('main')!).backgroundColor
      ctx.fillRect(0, 0, 1, 1)
      const background = luminance()
      ctx.fillStyle = getComputedStyle(note).color
      ctx.fillRect(0, 0, 1, 1)
      const foreground = luminance()
      return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)
    })
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  } finally {
    wrapper.unmount()
    await page.close()
  }
})
