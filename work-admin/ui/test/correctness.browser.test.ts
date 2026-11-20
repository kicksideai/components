// @vitest-environment node
// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterAll, beforeAll, expect, it } from 'vitest'
import { chromium, type Browser, type Page, type Route } from 'playwright'
import { createServer, type ViteDevServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { cicd } from '../src/app/settings/__fixtures__/processes'
import { schema } from '../src/test/fixtures'
let server: ViteDevServer, browser: Browser
beforeAll(async () => {
  server = await createServer({ configFile: false, root: process.cwd(), cacheDir: 'node_modules/.vite-correctness-browser', plugins: [vue({ template: { compilerOptions: { isCustomElement: t => t.startsWith('kickside-') || t.startsWith('wc-') } } })], server: { host: '127.0.0.1', port: 0 } })
  await server.listen(); browser = await chromium.launch()
}, 60000)
afterAll(async () => { await browser?.close(); await server?.close() })
async function shot(page: Page, name: string) {
  if (process.env.WORK_ADMIN_SCREENSHOTS) {
    await mkdir(process.env.WORK_ADMIN_SCREENSHOTS, { recursive: true })
    await page.screenshot({ path: resolve(process.env.WORK_ADMIN_SCREENSHOTS, name + '.png'), fullPage: true })
  }
}
async function fixture(mode: string, missing = false) {
  const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } })
  page.setDefaultTimeout(5000)
  const errors: string[] = [], requests: { path: string; body: Record<string, unknown> }[] = []
  page.on('pageerror', e => errors.push(e.message))
  let view = schema(), hold = false, held: Route | undefined, createdTitle = '', description = ''
  if (mode === 'process') { view.declaration.processes = [cicd]; view.compiled.processes = [cicd] }
  const access = { read: true, write: true, admin: true }
  await page.route('**/api/v1/**', async route => {
    const path = new URL(route.request().url()).pathname, body = route.request().postDataJSON() as Record<string, unknown> ?? {}
    requests.push({ path, body })
    const reply = (data: unknown) => route.fulfill({ json: { success: true, data } })
    if (path.endsWith('/packs')) return reply({ packs: [{ id: 'broken:pack', title: 'Broken installed pack', problem: { code: 'invalid_pack', message: 'Pack data is malformed' } }, { id: 'release:pack', title: 'Release pipeline', version: '1.0.0', icon: 'tabler:route', description: 'Release work', requires: [], plugins: [] }] })
    if (path.endsWith('/options')) return reply({ access, schema_options: { plugins: [] }, installed_types: [] })
    if (path.endsWith('/get_schema')) {
      if (path.includes('/new/')) return reply({ generation: 1, declaration: { key_prefix: 'WORK' }, compiled: {}, key_prefix: 'WORK', as_of: 1 })
      if (hold) { hold = false; held = route; return }
      if (missing) return route.fulfill({ status: 404, json: { success: false, kind: 'NotFound', details: { code: 'board_schema_missing' }, error: 'board has no schema' } })
      return reply(view)
    }
    if (path.endsWith('/plan_schema')) return reply({ generation: view.generation + 1, class: 'cosmetic', changes: [{ what: 'field.rename', class: 'cosmetic', code: 'title' }], refused: [] })
    if (path.endsWith('/apply_schema')) {
      view = { ...view, generation: view.generation + 1, declaration: body.declaration as typeof view.declaration }
      hold = true
      return reply({ generation: view.generation, class: 'cosmetic' })
    }
    if (path.endsWith('/update')) { description = String(body.description); return reply({ board_id: 'new', status: 'updated' }) }
    if (path.endsWith('/boards')) {
      if (route.request().method() === 'POST') { createdTitle = String(body.title); return reply({ board_id: 'new', generation: 1 }) }
      return reply({ boards: [{ board_id: 'b', title: 'Delivery', access }, { board_id: 'other', title: 'Other board', access }, ...(createdTitle ? [{ board_id: 'new', title: createdTitle, description, access }] : [])] })
    }
    throw new Error('Unexpected fixture request: ' + path)
  })
  await page.goto(`${server.resolvedUrls!.local[0]}test/correctness.html?mode=${mode}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  return { page, errors, requests, release: async () => { await held!.fulfill({ json: { success: true, data: view } }) }, isHeld: () => !!held }
}
it('creates with the declared body, updates description, and keeps an invalid pack unavailable', async () => {
  const { page, errors, requests } = await fixture('admin')
  try {
    await page.getByRole('button', { name: 'Create board', exact: true }).click()
    await page.getByLabel('Title', { exact: true }).fill('Delivery board')
    await page.getByLabel('Description', { exact: true }).fill('Team delivery')
    await page.getByRole('button', { name: 'Continue', exact: true }).click()
    await expect.poll(() => page.getByText('Pack data is malformed').isVisible()).toBe(true)
    await shot(page, 'W07-unavailable-pack')
    await page.getByRole('dialog', { name: 'New board', exact: true }).getByRole('button', { name: 'Create board', exact: true }).click()
    await expect.poll(() => page.locator('kickside-work-board-settings').getAttribute('board-id')).toBe('new')
    expect(Object.keys(requests.find(r => r.path.endsWith('/boards') && 'idempotency_key' in r.body)!.body).sort()).toEqual(['declaration', 'idempotency_key', 'title'])
    expect(requests.find(r => r.path.endsWith('/update'))?.body).toEqual({ description: 'Team delivery' })
    await shot(page, 'W01-created-with-description'); expect(errors).toEqual([])
  } finally { await page.close() }
}, 30000)
it('resets a successful Apply once when its read is superseded by a notification', async () => {
  const f = await fixture('settings'), { page } = f
  try {
    await page.locator('.work-field-row .work-definition-toggle').first().click()
    await page.getByLabel('Field title', { exact: true }).first().fill('Summary')
    await page.getByRole('button', { name: 'Review changes', exact: true }).click()
    await page.getByRole('button', { name: 'Apply', exact: true }).click()
    await expect.poll(f.isHeld).toBe(true)
    await page.evaluate(() => (window as unknown as { fixtureNotify: (topic: string) => void }).fixtureNotify('component.b'))
    await expect.poll(() => page.locator('.kx-head-sub').textContent()).toContain('generation 2')
    await f.release()
    await expect.poll(() => page.getByText('Applied generation 2', { exact: false }).isVisible()).toBe(true)
    expect(await page.getByText('Unsaved changes', { exact: true }).count()).toBe(0)
    await shot(page, 'W03-applied-generation-reset'); expect(f.errors).toEqual([])
  } finally { await page.close() }
}, 30000)
it('blocks Review for invalid durations and permits generation-zero initialization', async () => {
  const { page, errors, requests } = await fixture('settings', true)
  try {
    await page.getByRole('tab', { name: 'Policy', exact: true }).click()
    await page.getByLabel('Item key prefix', { exact: true }).fill('INIT')
    await page.getByLabel('Default attempt timeout', { exact: true }).fill('0')
    await page.getByLabel('Default attempt timeout', { exact: true }).press('Tab')
    await expect.poll(() => page.getByRole('button', { name: 'Review changes', exact: true }).isDisabled()).toBe(true)
    await shot(page, 'W13-invalid-duration-blocks-review')
    await page.getByRole('tab', { name: 'Review', exact: true }).click()
    expect(requests.some(r => r.path.endsWith('/plan_schema'))).toBe(false)
    await page.getByRole('tab', { name: 'Policy', exact: true }).click()
    await page.getByLabel('Default attempt timeout', { exact: true }).fill('2')
    await page.getByLabel('Default attempt timeout', { exact: true }).press('Tab')
    await page.getByRole('button', { name: 'Review changes', exact: true }).click()
    await expect.poll(() => requests.find(r => r.path.endsWith('/plan_schema'))?.body.expected_generation).toBe(0)
    expect(await page.getByText('Board administrator access is required.').count()).toBe(0)
    await shot(page, 'W12-initialize-generation-zero'); expect(errors).toEqual([])
  } finally { await page.close() }
}, 30000)
it('asks before discarding a board draft and preserves it when the operator cancels', async () => {
  const { page, errors } = await fixture('admin')
  try {
    await page.getByLabel('Settings for Delivery', { exact: true }).click()
    await page.locator('.work-field-row .work-definition-toggle').first().click()
    await page.getByLabel('Field title', { exact: true }).first().fill('Unsaved summary')
    await page.getByLabel('Settings for Other board', { exact: true }).click()
    await expect.poll(() => page.locator('#confirm').isVisible()).toBe(true)
    await shot(page, 'W11-confirm-board-switch')
    await page.locator('#keep').click()
    expect(await page.getByLabel('Field title', { exact: true }).first().inputValue()).toBe('Unsaved summary')
    await page.getByLabel('Settings for Other board', { exact: true }).click(); await page.locator('#discard').click()
    await expect.poll(() => page.locator('kickside-work-board-settings').getAttribute('board-id')).toBe('other')
    expect(errors).toEqual([])
  } finally { await page.close() }
}, 30000)

it('fits board fields and the add action in a 390px settings surface', async () => {
  const { page } = await fixture('admin')
  try {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.getByLabel('Settings for Delivery', { exact: true }).click()
    const fields = page.getByRole('region', { name: 'Fields editor' })
    await fields.waitFor()
    const details = await page.getByRole('region', { name: 'Board settings detail' }).boundingBox()
    const shell = await page.locator('.work-admin-shell').boundingBox()
    expect(details?.width).toBe(shell?.width)
    expect(await page.getByRole('navigation', { name: 'Board settings navigation' }).isVisible()).toBe(false)
    const list = fields.locator('.work-definition-scroll')
    expect(await list.evaluate(el => el.scrollWidth - el.clientWidth)).toBe(0)
    const add = await fields.getByRole('button', { name: 'Add field', exact: true }).boundingBox()
    expect(add!.x + add!.width).toBeLessThanOrEqual(390)
    await page.getByRole('button', { name: 'Back to boards', exact: true }).click()
    expect(await page.getByLabel('Settings for Delivery', { exact: true }).isVisible()).toBe(true)
  } finally { await page.close() }
}, 30000)

it.each([1500, 900])('keeps the reviewed CI/CD map complete after opening the real settings inspector at %s', async width => {
  const { page, errors } = await fixture('process')
  try {
    await page.setViewportSize({ width, height: 1000 })
    await page.getByRole('tab', { name: 'Process', exact: true }).click()
    const canvas = page.getByLabel('Process map', { exact: true })
    await canvas.press('0')
    expect(await page.locator('.work-edge-label-bg').count()).toBe(11)
    await page.getByRole('button', { name: 'Edit state Planned', exact: true }).click()
    await expect.poll(() => page.getByLabel('State settings', { exact: true }).isVisible()).toBe(true)
    await canvas.press('0')
    expect(await page.locator('.work-edge-label-bg').count()).toBe(11)
    await shot(page, `W02-cicd-inspector-${width}`); expect(errors).toEqual([])
  } finally { await page.close() }
}, 30000)
