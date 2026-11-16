// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterAll, beforeAll, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { chromium, type Browser } from 'playwright'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import BuilderFields from './BuilderFields.vue'
import BuilderDimensions from './BuilderDimensions.vue'
import BuilderFamilies from './BuilderFamilies.vue'
import BuilderVocabularies from './BuilderVocabularies.vue'
import BuilderChannels from './BuilderChannels.vue'
import BuilderPlugins from './BuilderPlugins.vue'
import { createSchema, definitionFixtures } from '../../test/fixtures'

let browser: Browser
beforeAll(async () => {
  browser = await chromium.launch()
})
afterAll(async () => { await browser?.close() })
const { options } = definitionFixtures()
const css = ['base.css', 'settings.css'].map(file => readFileSync(resolve('src/shared', file), 'utf8')).join('\n')
  + '\n' + readFileSync(resolve('src/styles.css'), 'utf8').replace(/^@import .*;$/gm, '')
for (const width of [1500, 1100]) for (const component of [BuilderFields, BuilderDimensions, BuilderFamilies, BuilderVocabularies, BuilderChannels, BuilderPlugins]) for (const rail of [0, 232]) {
  it(`aligns ${component.__name} columns at ${width}px with a ${rail}px settings rail`, async () => {
    const page = await browser.newPage({ viewport: { width, height: 1000 } })
    const { draft, options } = definitionFixtures()
    const wrapper = mount(component, { props: { catalogId: 'cat', draft, schema: createSchema(), options } })
    try {
      for (const list of wrapper.findAll('.pim-definition-list')) await list.get('.pim-definition-toggle').trigger('click')
      await page.setContent('<div id="host"></div>')
      await page.locator('#host').evaluate((host, data) => {
        const shadow = host.attachShadow({ mode: 'open' })
        const style = document.createElement('style')
        style.textContent = data.css + `\n:host { display:block; width:${data.paneWidth}px; } .form { border:1px solid; }`
        shadow.append(style)
        const content = document.createElement('div'); content.innerHTML = data.html; shadow.append(content)
      }, { html: wrapper.html(), css: css + '\n.pim-definition-lead [icon] { display:inline-block; width:14px; height:14px; flex:none; }', paneWidth: width - 224 - 48 - rail })
      const clearances = await page.locator('.pim-definition-head').evaluateAll(rows => rows.map(row => {
        const title = row.querySelector('[data-column=name]')!.getBoundingClientRect()
        const icons = [...row.querySelectorAll('.pim-definition-lead [icon]')].map(icon => icon.getBoundingClientRect().right)
        return title.left - Math.max(...icons)
      }))
      expect(clearances.every(space => space >= 0), 'row icons overlap the title').toBe(true)
      const forms = await page.locator('.pim-definition-body').evaluateAll(nodes => nodes.map(body => {
        const bounds = body.getBoundingClientRect()
        const list = body.closest('.pim-definition-list')!.getBoundingClientRect()
        return { left: bounds.left - list.left, right: list.right - bounds.right }
      }))
      expect(forms.length).toBeGreaterThan(0)
      for (const form of forms) {
        expect(form.left, `${component.__name}: expanded form starts outside the pane`).toBeGreaterThanOrEqual(0)
        expect(form.right, `${component.__name}: expanded form extends outside the pane`).toBeGreaterThanOrEqual(-1)
      }
      const labels = await page.locator('.pim-definition-body .pim-f-label').evaluateAll(nodes => nodes.map(label => {
        const field = label.closest('.pim-f')!.getBoundingClientRect()
        return field.right - label.getBoundingClientRect().right
      }))
      expect(labels.every(space => space >= -1), `${component.__name}: field labels overlap the next column`).toBe(true)
      const scrolledForms = await page.locator('.pim-definition-scroll').evaluateAll(nodes => nodes.flatMap(scroll => {
        scroll.scrollLeft = scroll.scrollWidth
        const list = scroll.closest('.pim-definition-list')!.getBoundingClientRect()
        const bounds = [...scroll.querySelectorAll('.pim-definition-body')].map(body => body.getBoundingClientRect())
        scroll.scrollLeft = 0
        return bounds.map(body => ({ left: body.left - list.left, right: list.right - body.right }))
      }))
      for (const form of scrolledForms) {
        expect(form.left, `${component.__name}: scrolling headings hides the expanded form`).toBeGreaterThanOrEqual(0)
        expect(form.right, `${component.__name}: scrolling headings clips the expanded form`).toBeGreaterThanOrEqual(-1)
      }
      const lists = await page.locator('.pim-definition-list').evaluateAll(nodes => nodes.map(list =>
        [...list.querySelectorAll('.pim-definition-head')].map(row => Object.fromEntries([...row.querySelectorAll<HTMLElement>('[data-column]')].map(cell => [cell.dataset.column!, cell.getBoundingClientRect().left]))),
      ))
      expect(lists.length).toBeGreaterThan(0)
      for (const rows of lists) {
        expect(rows).toHaveLength(4)
        for (const row of rows.slice(1)) for (const column of Object.keys(rows[0])) {
          expect(row[column], `${component.__name}, ${rail}px rail, ${column}`).toBeCloseTo(rows[0][column], 1)
          expect(row[column]).toBeGreaterThan(0)
        }
        if (rows[0].kind !== undefined) {
          expect(rows[0].kind).toBeGreaterThan(rows[0].code)
          expect(rows[0].code).toBeGreaterThan(rows[0].name)
        }
      }
    } finally { wrapper.unmount(); await page.close() }
  })
}
it('keeps indexed dimension controls and their remove action on one compact row', async () => {
  const declaration = {
    aspects: [{ namespace: 'core', attributes: [{ code: 'name', type: 'text', scope: ['locale', 'channel'], index: 'text', index_contexts: [{ locale: 'en', channel: 'web' }] }] }],
    dimensions: [{ name: 'locale', members: ['en'] }, { name: 'channel', members: ['web'] }],
  }
  const wrapper = mount(BuilderFields, { props: { draft: declaration, schema: createSchema(), options } })
  const page = await browser.newPage()
  try {
    await wrapper.get('.field-toggle').trigger('click')
    await page.setContent('<div id="host"></div>')
    await page.locator('#host').evaluate((host, data) => {
      const shadow = host.attachShadow({ mode: 'open' })
      shadow.innerHTML = '<style>' + data.css + '\n:host {display:block;width:900px}</style>' + data.html
    }, { html: wrapper.html(), css })
    const cells = await page.locator('.pim-context-row').evaluate(row => [...row.querySelectorAll('.p-select, button')].map(el => {
      const rect = el.getBoundingClientRect(); return { left: rect.left, right: rect.right, bottom: rect.bottom, width: rect.width }
    }))
    expect(cells).toHaveLength(3)
    expect(cells[0].width).toBeLessThanOrEqual(180)
    for (let i = 1; i < cells.length; i++) {
      expect(cells[i].left).toBeGreaterThanOrEqual(cells[i - 1].right)
      expect(cells[i].bottom).toBeCloseTo(cells[0].bottom, 1)
    }
  } finally { wrapper.unmount(); await page.close() }
})
