// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import SchemaBuilder from './builder/SchemaBuilder.vue'
import { pim } from '../api'
import { createSchema } from '../test/fixtures'
vi.mock('../api', () => ({ pim: Object.fromEntries(['schema', 'schemaOptions', 'history'].map(name => [name, vi.fn()])) }))
const id = '95fc46c1-4d10-4786-aad3-b05bfb37e89c'
const opaque = /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}|\bkickside\.[\w.]+:[\w.-]+/i
const wrappers: VueWrapper[] = []
afterEach(() => wrappers.splice(0).forEach(w => w.unmount()))
beforeEach(() => {
  vi.mocked(pim.schema).mockResolvedValue(createSchema())
  vi.mocked(pim.schemaOptions).mockResolvedValue({ types: [], scopes: [], plugins: [], link_kinds: [] })
})
it('layout displays titles without opaque identifiers, including missing catalog titles', async () => {
  for (const title of ['Apparel', '']) {
    const w = mount(SchemaBuilder, { props: { catalogId: id, title } }); wrappers.push(w); await flushPromises()
    await w.findAll('[role=tab]').find(b => b.text() === 'Form layout')!.trigger('click')
    expect(w.text()).not.toMatch(opaque)
  }
})
it('keeps history and grid reference values readable without machine identifiers', async () => {
  const { default: HistoryPanel } = await import('./HistoryPanel.vue')
  const { display } = await import('../forms')
  vi.mocked(pim.history).mockResolvedValue({ entries: [{ seq: 1, n: 1, subject: 'p:' + id, kind: 'value', attribute: 'stock.ships_from', after: { ref: ['inventory.location', id] }, actor: 'admin@example.test', at: '2026-11-08T20:00:00Z' }], as_of: 1 })
  const w = mount(HistoryPanel, { props: { catalogId: id } }); wrappers.push(w); await flushPromises()
  expect(w.text()).not.toMatch(opaque)
  expect(w.text()).toContain('Ships from set to Linked location')
  expect(display({ ref: ['component', id] })).toBe('Linked component')
})
