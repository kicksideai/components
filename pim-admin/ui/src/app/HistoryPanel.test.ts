// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'
import { api } from '@wippy-fe/proxy'
import HistoryPanel from './HistoryPanel.vue'
import { pim } from '../api'
import { when } from '../forms'
import { deferred } from '../test/fixtures'
import { events, visibility } from '../test/setup'
import type { HistoryResult } from '../types'
vi.mock('../api', () => ({ pim: { history: vi.fn() } }))
const wrappers: VueWrapper[] = []
afterEach(() => wrappers.splice(0).forEach(w => w.unmount()))
const entry = (seq: number) => ({ seq, n: 1, subject: `Record ${seq}`, kind: 'schema', after: { generation: seq }, actor: 'owner', at: '2026-11-17T12:00:00Z' })
beforeEach(() => {
  vi.clearAllMocks(); events.clear()
  vi.mocked(api.post).mockResolvedValue({ data: { data: { principals: [{ id: 'owner', label: 'Avery' }] } } } as never)
  vi.mocked(pim.history).mockResolvedValue({ entries: [], as_of: 1 })
})
it('fits the history caption and stacked changes with intact metadata at 390px', async () => {
  const name = 'Administrator'
  const recorded = { ...entry(3), sku: 'DEMO-PRODUCT-42', source: 'manual', ctx: 'en · web' }
  vi.mocked(api.post).mockResolvedValue({ data: { data: { principals: [{ id: 'owner', label: name }] } } } as never)
  vi.mocked(pim.history).mockResolvedValue({ entries: [recorded], next: '3:1', as_of: 3 })
  const w = mount(HistoryPanel, { props: { catalogId: 'cat', canResolveActors: true } }); wrappers.push(w); await flushPromises()
  const css = ['shared/base.css', 'shared/settings.css', 'styles.css']
    .map(file => readFileSync(`src/${file}`, 'utf8').replace(/^@import .*;$/gm, ''))
    .join('\n')
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 900 } })
    await page.setContent(`<style>${css}</style><main style="margin-inline:16px">${w.html()}</main>`)
    const table = page.getByRole('table')
    expect(await table.isVisible()).toBe(false)
    const caption = page.getByText('Catalog changes, newest first', { exact: true })
    const row = page.getByRole('listitem')
    const change = row.getByText('Catalog settings applied', { exact: true })
    const actor = row.getByText(name, { exact: true })
    expect(await row.innerText()).toContain(when(recorded.at))
    expect(await row.innerText()).toContain(recorded.sku)
    expect(await row.innerText()).toContain('via Manual')
    expect(await row.innerText()).toContain(recorded.ctx)
    expect((await change.boundingBox())!.y).toBeLessThan((await actor.boundingBox())!.y)
    const lines = await actor.evaluate(el => {
      const range = document.createRange()
      range.selectNodeContents(el)
      return range.getClientRects().length
    })
    expect(lines).toBe(1)
    const panel = await page.locator('.pim-history').boundingBox()
    for (const el of [caption, row, change, actor, page.getByRole('button', { name: 'Load older' })]) {
      const box = await el.boundingBox()
      expect(box!.x).toBeGreaterThanOrEqual(panel!.x)
      expect(box!.x + box!.width).toBeLessThanOrEqual(panel!.x + panel!.width)
    }
    expect(await page.locator('.pim-history .pim-table').evaluate(el => el.scrollWidth === el.clientWidth)).toBe(true)
    await page.setViewportSize({ width: 1440, height: 900 })
    expect(await table.isVisible()).toBe(true)
    expect(await table.getByRole('columnheader').allTextContents()).toEqual(['When', 'Who', 'What', 'Change'])
    expect(await row.isVisible()).toBe(false)
  } finally { await browser.close() }
}, 15000)
it('pages newest first, resolves people through the catalog helper and refreshes from the first page', async () => {
  vi.mocked(pim.history).mockResolvedValueOnce({ entries: [entry(3)], next: '3:1', as_of: 3 }).mockResolvedValueOnce({ entries: [entry(2)], as_of: 3 })
  const w = mount(HistoryPanel, { props: { catalogId: 'cat', canResolveActors: true } }); wrappers.push(w); await flushPromises()
  expect(w.text()).toContain('Avery')
  expect(api.post).toHaveBeenLastCalledWith('/api/v1/pim-admin/catalogs/cat/principal_labels', { refs: [{ type: 'user', id: 'owner' }] })
  await w.findAll('button').find(b => b.text() === 'Load older')!.trigger('click'); await flushPromises()
  expect(pim.history).toHaveBeenLastCalledWith('cat', { limit: 50, before: '3:1' })
  expect(w.findAll('tbody tr').map(r => r.text())).toEqual([expect.stringContaining('Record 3'), expect.stringContaining('Record 2')])
  vi.mocked(pim.history).mockResolvedValue({ entries: [entry(4)], as_of: 4 })
  await visibility.task!(); await flushPromises()
  expect(pim.history).toHaveBeenLastCalledWith('cat', { limit: 50, before: undefined })
  expect(w.text()).toContain('1 change shown'); expect(w.findAll('tbody tr')).toHaveLength(1)
})
it('exposes loading, a failed read and Retry, and keeps unresolved actors readable', async () => {
  const pending = deferred<HistoryResult>(); vi.mocked(pim.history).mockReturnValueOnce(pending.promise)
  const w = mount(HistoryPanel, { props: { catalogId: 'cat', canResolveActors: true } }); wrappers.push(w); await flushPromises()
  expect(w.get('[role=status]').text()).toContain('Loading history')
  pending.reject(new Error('History unavailable')); await flushPromises()
  expect(w.get('[role=alert]').text()).toContain('History unavailable')
  vi.mocked(api.post).mockRejectedValue(new Error('Directory unavailable'))
  vi.mocked(pim.history).mockResolvedValue({ entries: [entry(1)], as_of: 1 })
  await w.findAll('button').find(b => b.text() === 'Retry')!.trigger('click'); await flushPromises()
  expect(w.find('[role=alert]').exists()).toBe(false)
  expect(w.text()).toContain('Catalog settings applied')
})
it('ignores a stale older page after refresh and disposes the old catalog subscription', async () => {
  const older = deferred<HistoryResult>()
  vi.mocked(pim.history).mockResolvedValueOnce({ entries: [entry(3)], next: '3:1', as_of: 3 }).mockReturnValueOnce(older.promise)
  const w = mount(HistoryPanel, { props: { catalogId: 'cat', canResolveActors: true } }); wrappers.push(w); await flushPromises()
  await w.findAll('button').find(b => b.text() === 'Load older')!.trigger('click')
  vi.mocked(pim.history).mockResolvedValue({ entries: [entry(5)], as_of: 5 })
  events.get('component.cat')!(); await flushPromises()
  older.resolve({ entries: [entry(2)], as_of: 3 }); await flushPromises()
  expect(w.findAll('tbody tr')).toHaveLength(1)
  await w.setProps({ catalogId: 'other' }); await flushPromises()
  expect(events.has('component.cat')).toBe(false)
  expect(pim.history).toHaveBeenLastCalledWith('other', { limit: 50, before: undefined })
  w.unmount(); expect(events.has('component.other')).toBe(false)
})
