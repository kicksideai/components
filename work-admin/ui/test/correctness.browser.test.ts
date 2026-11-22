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
  if (!process.env.WORK_ADMIN_FIXTURE_URL) {
    server = await createServer({ configFile: false, root: process.cwd(), cacheDir: 'node_modules/.vite-correctness-browser', plugins: [vue({ template: { compilerOptions: { isCustomElement: t => t.startsWith('kickside-') || t.startsWith('wc-') } } })], server: { host: '127.0.0.1', port: 0 } })
    await server.listen()
  }
  browser = await chromium.launch()
}, 60000)
afterAll(async () => { await browser?.close(); await server?.close() })
async function shot(page: Page, name: string) {
  if (process.env.WORK_ADMIN_SCREENSHOTS) {
    await mkdir(process.env.WORK_ADMIN_SCREENSHOTS, { recursive: true })
    await page.screenshot({ path: resolve(process.env.WORK_ADMIN_SCREENSHOTS, name + '.png'), fullPage: true })
  }
}
const longBoardName = 'UnbrokenBoardName'.repeat(10)

async function fixture(mode: string, missing = false, width = 1500, input: { hasTouch?: boolean; colorScheme?: 'light' | 'dark' } = {}) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, ...input })
  page.setDefaultTimeout(5000)
  const errors: string[] = [], requests: { path: string; body: Record<string, unknown> }[] = []
  page.on('pageerror', e => errors.push(e.message))
  let view = schema(), hold = false, held: Route | undefined, createdTitle = '', description = '', discoveryAttempts = 0, packApplies = 0
  let boardTitle = 'Delivery', boardApp: string | undefined
  const plugin = {
    plugin: 'fixture:enhancements', title: 'Board enhancements', description: 'Adds tools for planning and tracking work on this board.',
    installed: true, requires: [], tools: [], active: false, lifecycle: { state: 'ready' as const }, projections: {},
    config_schema: { type: 'object', properties: { threshold: { type: 'integer', title: 'Threshold' }, aliases: { title: 'Aliases', type: 'array', items: { type: 'string' } } } },
  }
  const requiredPlugin = {
    ...plugin, config_schema: {
      type: 'object', required: ['threshold'], properties: {
        threshold: { type: 'integer', title: 'Threshold', minimum: 1 },
        batch: { type: 'integer', title: 'Batch size', default: 5 },
      },
    },
  }
  if (mode === 'board-setup' || mode === 'admin-plugin-draft') {
    view.declaration.plugins = [{ use: 'fixture:enhancements' }]
    view.plugins = [{ plugin: 'fixture:enhancements', active: true, installed: true, requires: [], tools: [], lifecycle: { state: 'ready' }, projections: {}, config: { threshold: 1 } }]
  }
  if (mode === 'projection-reset') {
    view.declaration.plugins = [{ use: plugin.plugin }]
    view.plugins = [{ ...plugin, active: true, projections: { events: { parked: true, bootstrapping: false, last_seq: 0, error: 'Worker stopped' } } }]
  }
  if (mode === 'board-setup') {
    view.declaration.fields!.push(...['Acceptance criteria', 'Resolution notes', 'Escalation reason', 'External issue tracker reference', 'Final trailing choice']
      .map((title, index) => ({ code: 'extra_' + index, title, form: 'text' as const })))
  }
  if (mode === 'process') { view.declaration.processes = [cicd]; view.compiled.processes = [cicd] }
  if (mode === 'process-editing') {
    const process = view.declaration.processes![0]
    view.declaration.fields![0].title = 'Title'
    process.name = 'Delivery process'
    process.states[1].kind = 'automated'
    process.states[1].run = { stage: 'Verify', on_pass: 'finish' }
    process.transitions!.push({ id: 'cancel', name: 'Return to queue', from: 'any', to: 'todo' })
  }
  const access = { read: true, write: true, admin: true }
  await page.route('**/api/v1/**', async route => {
    const path = new URL(route.request().url()).pathname, body = route.request().postDataJSON() as Record<string, unknown> ?? {}
    requests.push({ path, body })
    const reply = (data: unknown) => route.fulfill({ json: { success: true, data } })
    if (path.includes('/component-access/grants/')) return route.fulfill({ json: { success: true, access: [] } })
    if (path.endsWith('/components/access-model')) return route.fulfill({ json: { success: true, capabilities: [] } })
    if (path.endsWith('/query')) return reply({ items: [], groups: [] })
    if (path.endsWith('/packs')) {
      discoveryAttempts++
      if (['create-discovery', 'install-pack'].includes(mode) && discoveryAttempts === 1) {
        return route.fulfill({ status: 503, json: { success: false, error: 'Pack discovery offline' } })
      }
      return reply({ packs: [{ id: 'broken:pack', title: 'Broken installed pack', problem: { code: 'invalid_pack', message: 'Pack data is malformed' } }, { id: 'release:pack', title: 'Release pipeline', version: '1.0.0', icon: 'tabler:route', description: 'Release work', requires: [], plugins: [] }] })
    }
    if (path.endsWith('/options')) return reply({ access, schema_options: { plugins: [mode === 'plugin-validation' ? requiredPlugin : plugin] }, board_apps: [{ id: 'fixture:tracker', title: 'Tracker' }], installed_types: [{ id: 'fixture:rating', title: 'Rating' }] })
    if (path.endsWith('/pack_plan')) return reply({
      pack: 'release:pack', version: '1.0.0', digest: 'pack', generation: 2,
      class: 'cosmetic', declaration: view.declaration, changes: [], refused: [], conflicts: [], maps: {},
      views: [{ id: 'change-register', title: 'Change register' }],
      automations: [{ id: 'review-notification' }], traits: ['app:review_trait'], plugins: [plugin.plugin],
    })
    if (path.endsWith('/pack_apply')) {
      packApplies++
      view = { ...view, generation: 2 }
      return reply({ operation_id: 'operation-12', job_id: 'job-34', status: packApplies === 1 ? 'pending' : 'done', generation: 2 })
    }
    if (path.endsWith('/state_counts')) return reply({ task: { todo: 2, doing: 1 } })
    if (path.endsWith('/configure_plugin')) {
      const config = body.config as Record<string, unknown>
      if (config?.threshold === 99) return route.fulfill({ status: 422, json: { success: false, error: 'Threshold rejected' } })
      view.plugins![0].config = config
      return reply({ attachment_id: 'enhancements' })
    }
    if (path.endsWith('/get_schema')) {
      if (path.includes('/new/')) return reply({ generation: 1, declaration: { key_prefix: 'WORK' }, compiled: {}, key_prefix: 'WORK', as_of: 1 })
      if (hold) { hold = false; held = route; return }
      if (missing) return route.fulfill({ status: 404, json: { success: false, kind: 'NotFound', details: { code: 'board_schema_missing' }, error: 'board has no schema' } })
      return reply(view)
    }
    if (path.endsWith('/plan_schema')) {
      const declaration = body.declaration as typeof view.declaration
      const changes = mode === 'process-editing'
        ? view.declaration.processes![0].transitions!.filter(edge => !declaration.processes![0].transitions!.some(current => current.id === edge.id))
          .map(edge => ({ what: 'transition.remove', class: 'cosmetic', code: 'process delivery', detail: edge.id }))
        : [{ what: 'field.rename', class: 'cosmetic', code: 'title' }]
      return reply({ generation: view.generation + 1, class: 'cosmetic', changes, refused: [] })
    }
    if (path.endsWith('/apply_schema')) {
      view = { ...view, generation: view.generation + 1, declaration: body.declaration as typeof view.declaration }
      hold = true
      return reply({ generation: view.generation, class: 'cosmetic' })
    }
    if (path.endsWith('/update')) {
      if (path.includes('/b/')) {
        if (typeof body.title === 'string') boardTitle = body.title
        if (typeof body.ui_app === 'string') boardApp = body.ui_app
        return reply({ board_id: 'b', status: 'updated' })
      }
      description = String(body.description)
      return reply({ board_id: 'new', status: 'updated' })
    }
    if (path.endsWith('/boards')) {
      if (route.request().method() === 'POST') { createdTitle = String(body.title); return reply({ board_id: 'new', generation: 1 }) }
      return reply({ boards: [{ board_id: 'b', title: boardTitle, ui_app: boardApp, item_count: 3, open_count: 3, access }, { board_id: 'other', title: 'Other board', access }, { board_id: 'long', title: longBoardName, access }, ...(createdTitle ? [{ board_id: 'new', title: createdTitle, description, access }] : [])] })
    }
    throw new Error('Unexpected fixture request: ' + path)
  })
  const origin = process.env.WORK_ADMIN_FIXTURE_URL || server.resolvedUrls!.local[0]
  await page.goto(new URL(`/test/correctness.html?mode=${mode}`, origin).href, { waitUntil: 'domcontentloaded', timeout: 30000 })
  return { page, errors, requests, release: async () => { await held!.fulfill({ json: { success: true, data: view } }) }, isHeld: () => !!held }
}

function boardSection(page: Page, name: string) {
  return page.getByRole('navigation', { name: 'Board settings sections' }).getByRole('button', { name, exact: true })
}
it('opens Item types, Fields and Links directly from Board setup and keeps their drafts', async () => {
  const { page } = await fixture('board-setup', false, 390)
  try {
    for (const name of ['Item types', 'Fields', 'Links']) {
      const section = boardSection(page, name)
      await section.press('Enter')
      expect(await section.getAttribute('aria-current')).toBe('true')
      const content = page.getByRole('region', { name, exact: true })
      await content.getByRole('heading', { name, exact: true }).first().waitFor()
      expect(await content.getByRole('tablist').count()).toBe(0)
      if (name === 'Item types') {
        await content.getByRole('button', { name: 'Task', exact: true }).press('Enter')
        await content.getByRole('textbox', { name: 'Title', exact: true }).fill('Delivery task')
      }
      if (name === 'Fields') {
        const filter = content.getByRole('combobox', { name: 'Filter fields by item type' })
        expect(await filter.innerText()).toBe('All item types')
        await filter.click()
        await content.getByRole('option', { name: 'Delivery task', exact: true }).click()
        expect(await filter.innerText()).toBe('Delivery task')
      }
    }
    await boardSection(page, 'Item types').press('Enter')
    expect(await page.getByRole('textbox', { name: 'Title', exact: true }).inputValue()).toBe('Delivery task')
  } finally { await page.close() }
}, 30000)

it('uses one keyboard-operable disclosure to edit the fields assigned to an item type', async () => {
  const { page } = await fixture('board-setup')
  try {
    await boardSection(page, 'Item types').click()
    expect(await page.getByRole('button', { name: 'Fields for Task', includeHidden: true }).count()).toBe(0)
    const row = page.locator('.work-definition').filter({ has: page.getByRole('button', { name: 'Task', exact: true }) })
    const toggle = row.getByRole('button', { name: 'Task', exact: true })
    expect(await toggle.getAttribute('aria-expanded')).toBe('false')
    expect(await row.locator('.work-definition-head').getByRole('button').count()).toBe(1)
    await toggle.press('Enter')
    expect(await toggle.getAttribute('aria-expanded')).toBe('true')
    await row.getByRole('group', { name: 'Fields', exact: true }).first().waitFor()
    await toggle.press('Space')
    expect(await toggle.getAttribute('aria-expanded')).toBe('false')
  } finally { await page.close() }
}, 30000)

it('shows plugin activation on the switch and marks a pending change', async () => {
  const { page } = await fixture('board-setup')
  try {
    await boardSection(page, 'Plugins').click()
    const panel = page.getByRole('region', { name: 'Plugins', exact: true })
    const toggle = panel.getByRole('switch', { name: 'Enable Board enhancements' })
    await toggle.waitFor()
    expect(await panel.getByText('On', { exact: true }).count()).toBe(0)
    expect(await panel.getByText(/enabled in this setup/).count()).toBe(0)
    expect(await toggle.getAttribute('aria-checked')).toBe('true')
    await toggle.press('Space')
    expect(await toggle.getAttribute('aria-checked')).toBe('false')
    await panel.getByText('Pending review', { exact: true }).waitFor()
  } finally { await page.close() }
}, 30000)

it.each([1440, 390])('keeps the plugin description beside the switch at %i px', async width => {
  const { page } = await fixture('board-setup', false, width)
  try {
    await boardSection(page, 'Plugins').click()
    const panel = page.getByRole('region', { name: 'Plugins', exact: true })
    const title = panel.getByRole('button', { name: 'Board enhancements', exact: true })
    const description = panel.getByText('Adds tools for planning and tracking work on this board.')
    const toggle = panel.getByRole('switch', { name: 'Enable Board enhancements' })
    await toggle.waitFor()
    const [t, d, s] = (await Promise.all([title.boundingBox(), description.boundingBox(), toggle.boundingBox()]))!
    expect(d!.y).toBeGreaterThanOrEqual(t!.y + t!.height - 1)
    expect(d!.x + d!.width).toBeLessThan(s!.x)
    expect(Math.abs(s!.y + s!.height / 2 - (t!.y + d!.y + d!.height) / 2)).toBeLessThanOrEqual(4)
    const refresh = panel.getByRole('button', { name: 'Refresh status', exact: true })
    expect(await refresh.evaluate(button => !!button.closest('header'))).toBe(true)
  } finally { await page.close() }
}, 30000)

it.each([
  ['Item types', 'Add item type', 'Item type name', 'Customer request'],
  ['Fields', 'Add field', 'Field name', 'Customer account'],
  ['Links', 'Add link type', 'Link name', 'Depends on'],
])('opens and cancels the inline add row for %s', async (section, action, label, value) => {
  const { page } = await fixture('board-setup', false, 390)
  try {
    await boardSection(page, section).click()
    const panel = page.getByRole('region', { name: section, exact: true })
    const add = panel.getByRole('button', { name: action, exact: true })
    const name = panel.getByRole('textbox', { name: label, exact: true })
    expect(await panel.getByRole('textbox').count()).toBe(0)
    await add.press('Enter')
    expect(await name.evaluate(input => (input.getRootNode() as Document | ShadowRoot).activeElement === input)).toBe(true)
    await name.fill(value)
    await name.press('Escape')
    expect(await name.count()).toBe(0)
    expect(await add.evaluate(button => (button.getRootNode() as Document | ShadowRoot).activeElement === button)).toBe(true)
    await add.press('Enter')
    await name.fill(value)
    await name.press('Enter')
    await panel.getByRole('button', { name: value, exact: true }).waitFor({ timeout: 2000 })
    expect(await name.count()).toBe(0)
  } finally { await page.close() }
}, 30000)

it('adds workflows and states from actions with no permanent add input', async () => {
  const { page } = await fixture('board-setup', false, 390)
  try {
    await boardSection(page, 'Workflow').click()
    const panel = page.getByRole('region', { name: 'Workflow', exact: true })
    const processName = panel.getByRole('textbox', { name: 'New process name' })
    expect(await processName.isVisible()).toBe(false)
    await panel.getByRole('button', { name: 'New process', exact: true }).press('Enter')
    await processName.fill('Customer intake')
    await processName.press('Enter')
    const process = panel.getByRole('combobox', { name: 'Process', exact: true })
    await expect.poll(() => process.innerText()).toBe('Customer intake')
    await process.click()
    expect(await panel.getByRole('option', { name: 'New process…', exact: true }).count()).toBe(0)
    await process.press('Escape')
    const stateName = panel.getByRole('textbox', { name: 'State name', exact: true })
    expect(await stateName.isVisible()).toBe(false)
    await panel.getByRole('button', { name: 'Add state', exact: true }).press('Enter')
    await stateName.fill('Waiting for customer')
    await stateName.press('Enter')
    await panel.getByRole('button', { name: 'Close state editor' }).press('Enter')
    await panel.getByRole('button', { name: 'Edit state Waiting for customer' }).press('Enter')
    const inspector = panel.getByRole('complementary', { name: 'State inspector' })
    const destination = inspector.getByRole('combobox', { name: 'Next state', exact: true })
    expect(await destination.isVisible()).toBe(false)
    await inspector.getByRole('button', { name: 'Add transition', exact: true }).press('Enter')
    await destination.press('ArrowDown')
    await inspector.getByRole('option', { name: 'To do', exact: true }).click()
    await inspector.getByRole('button', { name: 'Add transition', exact: true }).click()
    await panel.getByRole('textbox', { name: 'Transition name', exact: true }).waitFor()
  } finally { await page.close() }
}, 30000)

it('adds a link target, visibility level and plugin value on demand', async () => {
  const { page } = await fixture('board-setup')
  try {
    await boardSection(page, 'Links').click()
    await page.getByRole('button', { name: 'blocks', exact: true }).click()
    const target = page.getByRole('textbox', { name: 'Target type ID' })
    expect(await target.isVisible()).toBe(false)
    await page.getByRole('button', { name: 'Add target type', exact: true }).click()
    await target.fill('release')
    await target.press('Enter')
    await page.getByRole('button', { name: 'Remove target type release' }).waitFor()

    await boardSection(page, 'Access').click()
    const visibilityField = page.getByRole('combobox', { name: 'Visibility field', exact: true })
    await page.getByText('Advanced · Item visibility', { exact: true }).click()
    await visibilityField.click()
    await page.getByRole('option', { name: 'Description', exact: true }).click()
    const level = page.getByRole('textbox', { name: 'New visibility level' })
    expect(await level.isVisible()).toBe(false)
    await page.getByRole('button', { name: 'Add level', exact: true }).click()
    await level.fill('Internal')
    await level.press('Enter')
    await page.getByText('Internal', { exact: true }).waitFor()

    await boardSection(page, 'Plugins').click()
    await page.getByRole('button', { name: 'Board enhancements', exact: true }).click()
    const alias = page.getByRole('textbox', { name: 'Add aliases' })
    expect(await alias.isVisible()).toBe(false)
    await page.getByRole('button', { name: 'Add value', exact: true }).click()
    await alias.fill('Triage')
    await alias.press('Enter')
    await page.getByText('Triage', { exact: true }).waitFor()
  } finally { await page.close() }
}, 30000)

it('leads General with board details and keeps the board summary compact', async () => {
  const { page, requests } = await fixture('board-setup')
  try {
    const panel = page.getByRole('region', { name: 'General', exact: true })
    const details = panel.getByRole('region', { name: 'Board details', exact: true })
    const summary = panel.getByRole('region', { name: 'Board summary', exact: true })
    const name = details.getByRole('textbox', { name: 'Board name', exact: true })
    const app = details.getByRole('combobox', { name: 'Board app', exact: true })
    const prefix = details.getByRole('textbox', { name: 'Item key prefix', exact: true })
    await prefix.waitFor()
    expect(await panel.getByText('Board at a glance', { exact: true }).count()).toBe(0)
    expect(await panel.getByText('Starting setup', { exact: true }).count()).toBe(0)
    expect(await panel.getByText('Opens in Installation default', { exact: true }).count()).toBe(0)
    expect((await details.boundingBox())!.y).toBeLessThan((await summary.boundingBox())!.y)
    await summary.getByText(/3 open · 3 total/).waitFor()
    expect(await summary.getByRole('heading', { name: 'Items by state' }).count()).toBe(0)
    expect(await summary.getByRole('heading', { name: 'Board pack', exact: true }).count()).toBe(0)
    expect(await details.getByRole('button', { name: 'Edit board', exact: true }).count()).toBe(0)
    expect(await name.inputValue()).toBe('Delivery')
    const controls = await Promise.all([name.boundingBox(), app.locator('..').boundingBox(), prefix.boundingBox()])
    expect(controls.every(rect => rect?.x === controls[0]?.x && rect?.width === controls[0]?.width)).toBe(true)
    await name.fill('Release operations')
    await app.click()
    await details.getByRole('option', { name: 'Tracker', exact: true }).click()
    await prefix.fill('RELEASE')
    await details.getByRole('button', { name: 'Save board details', exact: true }).click()
    await expect.poll(() => requests.find(request => request.path.endsWith('/update'))?.body).toEqual({
      title: 'Release operations', ui_app: 'fixture:tracker',
    })
    await panel.getByRole('button', { name: 'Review changes', exact: true }).click()
    await expect.poll(() => (requests.find(request => request.path.endsWith('/plan_schema'))?.body.declaration as ReturnType<typeof schema>['declaration'] | undefined)?.key_prefix).toBe('RELEASE')
  } finally { await page.close() }
}, 30000)

it.each(['light', 'dark'] as const)('wraps every item type field choice into the 390 px editor in %s', async colorScheme => {
  const { page } = await fixture('board-setup', false, 390, { colorScheme, hasTouch: true })
  try {
    await boardSection(page, 'Item types').click()
    await page.getByRole('button', { name: 'Task', exact: true }).click()
    const picker = page.getByRole('group', { name: 'Fields', exact: true }).first()
    const last = picker.getByRole('button', { name: 'Final trailing choice', exact: true })
    await last.waitFor()
    const [p, l] = await Promise.all([picker.boundingBox(), last.boundingBox()])
    expect(l!.x + l!.width).toBeLessThanOrEqual(Math.min(p!.x + p!.width, 390))
    expect(l!.y).toBeGreaterThan((await picker.getByRole('button', { name: 'Title', exact: true }).boundingBox())!.y)
    await last.tap()
    expect(await last.getAttribute('aria-pressed')).toBe('true')
  } finally { await page.close() }
}, 30000)

async function processEditing(width: number, theme: 'light' | 'dark', hasTouch = false) {
  const context = await fixture('process-editing', false, width, { colorScheme: theme, hasTouch })
  await boardSection(context.page, 'Workflow').click()
  const map = context.page.getByRole('region', { name: 'Process map' })
  await map.press('0')
  return { ...context, map }
}

it.each(['light', 'dark'] as const)('removes a map transition with the visible action and reviews the draft in %s', async theme => {
  const { page, map, requests } = await processEditing(1440, theme)
  try {
    await map.getByRole('button', { name: 'Edit transition Reopen' }).first().locator('.work-edge-label-bg').click()
    const inspector = page.getByRole('complementary', { name: 'Transition inspector' })
    const remove = inspector.getByRole('button', { name: 'Remove transition', exact: true })
    await remove.waitFor()
    const visible = await remove.evaluate(button => button.getBoundingClientRect().bottom <= button.closest('aside')!.getBoundingClientRect().bottom)
    await shot(page, `map-removal-1440-${theme}`)
    // Exercise the existing action even when its placement fails the visibility assertion.
    await remove.click()
    expect(await map.getByRole('button', { name: 'Edit transition Reopen' }).count()).toBe(0)
    await page.getByRole('button', { name: 'Review changes', exact: true }).click()
    await page.getByText('Delivery process · Transition removed', { exact: true }).waitFor()
    expect((requests.find(request => request.path.endsWith('/plan_schema'))!.body.declaration as ReturnType<typeof schema>['declaration']).processes![0].transitions!.map(edge => edge.id)).not.toContain('reopen')
    expect(visible).toBe(true)
  } finally { await page.close() }
}, 30000)

it.each(['Delete', 'Backspace'])('removes the selected map transition with %s and keeps draft review reachable', async key => {
  const { page, map } = await processEditing(390, 'light')
  try {
    const edge = map.getByRole('button', { name: 'Edit transition Return to queue' })
    await edge.press('Enter')
    const inspector = page.getByRole('complementary', { name: 'Transition inspector' })
    const name = inspector.getByRole('textbox', { name: 'Transition name' })
    await name.fill('Return to queues')
    await name.press('Backspace')
    expect(await name.inputValue()).toBe('Return to queue')
    await inspector.getByRole('button', { name: 'Close transition editor' }).press('Enter')
    await page.keyboard.press('Enter')
    await page.keyboard.press(key)
    expect(await edge.count()).toBe(0)
    expect(await map.evaluate(el => (el.getRootNode() as Document).activeElement === el)).toBe(true)
    await page.getByRole('button', { name: 'Review changes', exact: true }).press('Enter')
    await page.getByText('Delivery process · Transition removed', { exact: true }).waitFor()
  } finally { await page.close() }
}, 30000)

it('keeps a transition used by a stage when removal is requested on the map', async () => {
  const { page, map } = await processEditing(1440, 'light')
  try {
    await map.getByRole('button', { name: 'Edit transition Complete' }).first().press('Enter')
    const inspector = page.getByRole('complementary', { name: 'Transition inspector' })
    await page.keyboard.press('Delete')
    await inspector.getByRole('alert').filter({ hasText: 'Used by success handler in In progress' }).waitFor()
    expect(await map.getByRole('button', { name: 'Edit transition Complete' }).count()).toBe(2)
  } finally { await page.close() }
}, 30000)

it.each(['light', 'dark'] as const)('connects states by touch and edits the transition at 390 px in %s', async theme => {
  const { page, map, requests } = await processEditing(390, theme, true)
  try {
    const source = map.getByRole('button', { name: 'Connect from To do' })
    await source.tap()
    await map.getByRole('status').filter({ hasText: 'Choose the next stop' }).waitFor({ timeout: 1500 })
    await map.getByRole('button', { name: 'Edit state Done' }).locator('.work-state-card').tap()
    const inspector = page.getByRole('complementary', { name: 'Transition inspector' })
    const name = inspector.getByRole('textbox', { name: 'Transition name' })
    await name.waitFor()
    const bounds = (await name.boundingBox())!
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(1000)
    await name.fill('Send forward')
    await inspector.getByRole('combobox', { name: 'To state', exact: true }).tap()
    await page.getByRole('option', { name: 'In progress', exact: true }).tap()
    const sources = inspector.getByRole('group', { name: 'From states', exact: true }).first()
    await sources.getByRole('button', { name: 'Done', exact: true }).tap()
    await sources.getByRole('button', { name: 'To do', exact: true }).tap()
    await inspector.getByRole('group', { name: 'Required fields', exact: true }).first().getByRole('button', { name: 'Title', exact: true }).tap()
    await inspector.getByText('Advanced transition settings', { exact: true }).tap()
    await inspector.getByText('Edit as JSON · Guards', { exact: true }).tap()
    await inspector.getByRole('textbox', { name: 'Guards', exact: true }).fill('["fixture:guard"]')
    await shot(page, `map-transition-settings-390-${theme}`)
    await page.getByRole('button', { name: 'List', exact: true }).tap()
    const row = page.getByRole('row').filter({ has: page.getByRole('button', { name: 'Edit transition Send forward', exact: true }) })
    expect(await row.innerText()).toContain('Done')
    expect(await row.innerText()).toContain('In progress')
    await page.getByRole('button', { name: 'Review changes', exact: true }).tap()
    await expect.poll(() => requests.some(request => request.path.endsWith('/plan_schema'))).toBe(true)
    const draft = requests.find(request => request.path.endsWith('/plan_schema'))!.body.declaration as ReturnType<typeof schema>['declaration']
    expect(draft.processes![0].transitions!.at(-1)).toMatchObject({ name: 'Send forward', from: ['done'], to: 'doing', require: ['title'], guards: ['fixture:guard'] })
  } finally { await page.close() }
}, 30000)

it('moves keyboard focus directly to the stage and transition inspectors', async () => {
  const { page, map } = await processEditing(390, 'dark')
  try {
    await map.getByRole('button', { name: 'Edit state In progress' }).press('Enter')
    const state = page.getByRole('complementary', { name: 'State inspector' })
    expect(await state.evaluate(element => (element.getRootNode() as Document).activeElement === element)).toBe(true)
    await state.getByRole('textbox', { name: 'Run label' }).fill('Verify build')
    await state.getByRole('region', { name: 'Stage Flow' }).waitFor()
    await state.getByRole('button', { name: 'Close state editor' }).press('Enter')
    await map.getByRole('button', { name: 'Connect from To do' }).press('Enter')
    await map.getByRole('button', { name: 'Edit state Done' }).press('Space')
    const transition = page.getByRole('complementary', { name: 'Transition inspector' })
    expect(await transition.evaluate(el => (el.getRootNode() as Document).activeElement === el)).toBe(true)
    expect(await transition.getByRole('textbox', { name: 'Transition name' }).inputValue()).toBe('To done')
  } finally { await page.close() }
}, 30000)

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

it.each([
  { tab: 'Fields', kind: 'Text', action: 'Move Title later', editor: 'Field title' },
  { tab: 'Item types', kind: 'Delivery', action: 'Task', editor: 'Title' },
  { tab: 'Links', kind: 'Different each way', action: 'Remove link type', editor: 'Shown on this item' },
  { tab: 'Plugins', kind: undefined, action: 'Enable Board enhancements', editor: 'Threshold' },
])('fits $tab rows and keeps their editing controls reachable at 390 px', async ({ tab, kind, action, editor }) => {
  const { page } = await fixture('admin', false, 390)
  try {
    await page.getByRole('button', { name: 'Settings for Delivery', exact: true }).click()
    await boardSection(page, tab).click()
    const list = page.locator('.work-definition-scroll:visible')
    const row = list.locator('.work-definition').first()
    await row.waitFor()
    expect(await list.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
    const pane = page.getByRole('region', { name: 'Board settings detail' })
    expect((await pane.boundingBox())!.width).toBeGreaterThan(320)
    const header = row.locator('.work-definition-head')
    if (kind) expect(await header.getByText(kind, { exact: true }).isVisible()).toBe(true)
    const editAction = tab === 'Plugins' ? header.getByRole('switch', { name: action }) : header.getByRole('button', { name: action })
    const actionBox = await editAction.boundingBox()
    const listBox = (await list.boundingBox())!
    expect(actionBox!.x + actionBox!.width).toBeLessThanOrEqual(listBox.x + listBox.width + 1)
    if (tab === 'Plugins') {
      expect(await editAction.getAttribute('aria-checked')).toBe('false')
      await editAction.click()
    }
    await row.locator('.work-definition-toggle').click()
    await row.getByLabel(editor, { exact: true }).waitFor()
  } finally { await page.close() }
}, 30000)

it('returns from narrow board settings through the shared discard confirmation', async () => {
  const { page } = await fixture('admin', false, 390)
  try {
    const board = page.getByRole('button', { name: 'Settings for Delivery', exact: true })
    const back = page.getByRole('button', { name: 'All boards', exact: true })
    await board.press('Enter')
    await board.waitFor({ state: 'hidden' })
    expect(await back.evaluate(element => (element.getRootNode() as ShadowRoot).activeElement === element)).toBe(true)
    await boardSection(page, 'Fields').click()
    await page.locator('.work-field-row .work-definition-toggle').first().click()
    const title = page.getByLabel('Field title', { exact: true }).first()
    await title.fill('Draft title')
    await back.click()
    await page.locator('#keep').click()
    expect(await title.inputValue()).toBe('Draft title')
    await back.click()
    await page.locator('#discard').click()
    await board.waitFor()
    expect(await board.evaluate(element => (element.getRootNode() as ShadowRoot).activeElement === element)).toBe(true)
  } finally { await page.close() }
}, 30000)

it.each([1440, 390])('wraps a long board name in navigation and settings at %s px', async width => {
  const { page } = await fixture('admin', false, width)
  try {
    const board = page.getByRole('button', { name: 'Settings for ' + longBoardName, exact: true })
    const rail = page.getByRole('complementary', { name: /^Boards/ })
    await board.waitFor()
    expect.soft(await rail.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1)
    await board.click()
    const settings = page.getByRole('navigation', { name: 'Board settings sections', exact: true })
    const title = settings.getByText(longBoardName, { exact: true })
    await title.waitFor()
    expect(await title.evaluate(element => {
      const rail = element.closest('nav')!.getBoundingClientRect()
      const text = document.createRange()
      text.selectNodeContents(element)
      const lines = Array.from(text.getClientRects())
      return lines.length > 1 && lines.every(line => line.left >= rail.left && line.right <= rail.right)
    })).toBe(true)
    expect(await page.getByRole('textbox', { name: 'Board name', exact: true }).isVisible()).toBe(true)
  } finally { await page.close() }
}, 30000)

it('exposes field controls by their labels and separates the keyboard reorder handle', async () => {
  const { page } = await fixture('settings')
  try {
    await boardSection(page, 'Fields').click()
    const row = page.locator('.work-field-row').first()
    const disclosure = row.locator('.work-definition-toggle')
    await disclosure.press('Enter')
    await row.getByText('Advanced field settings', { exact: true }).click()
    for (const name of ['Kind', 'Values allowed', 'Allow filters to use']) {
      expect.soft(await row.getByRole('combobox', { name, exact: true }).count(), name).toBe(1)
    }
    await row.getByRole('combobox', { name: 'Kind', exact: true }).click()
    await page.getByRole('option', { name: 'Rating', exact: true }).waitFor()
    await page.keyboard.press('Escape')
    expect(await disclosure.getByRole('button').count()).toBe(0)
    const handle = row.getByRole('button', { name: /use the arrow keys to reorder/ })
    await handle.focus()
    await page.keyboard.press('Tab')
    expect(await disclosure.evaluate(element => (element.getRootNode() as Document | ShadowRoot).activeElement === element)).toBe(true)
    await handle.focus()
    await page.keyboard.press('ArrowDown')
    expect(await page.locator('.work-field-row').nth(1).getByRole('button', { name: 'Title', exact: true }).count()).toBe(1)
  } finally { await page.close() }
}, 30000)

it.each([
  { mode: 'Map', type: 'state', close: 'Escape' },
  { mode: 'Map', type: 'transition', close: 'button' },
  { mode: 'List', type: 'state', close: 'button' },
  { mode: 'List', type: 'transition', close: 'Escape' },
])('returns focus to the $mode $type action after closing the inspector with $close', async ({ mode, type, close }) => {
  const { page } = await fixture('process', false, 390)
  try {
    await boardSection(page, 'Workflow').click()
    await expect.poll(() => page.getByRole('button', { name: 'List', exact: true }).getAttribute('aria-pressed')).toBe('true')
    if (mode === 'Map') await page.getByRole('button', { name: 'Map', exact: true }).click()
    const scope = page.getByLabel(mode === 'Map' ? 'Process map' : 'Process list', { exact: true })
    const opener = scope.getByRole('button', { name: new RegExp(`^Edit ${type}`) }).first()
    await opener.press('Enter')
    const inspector = page.getByRole('complementary', { name: type === 'state' ? 'State inspector' : 'Transition inspector' })
    if (type === 'state') await inspector.getByRole('button', { name: 'Rename state' }).press('Enter')
    const input = inspector.getByRole('textbox', { name: type === 'state' ? 'State name' : 'Transition name' })
    await input.focus()
    if (close === 'Escape') await input.press('Escape')
    else await inspector.getByRole('button', { name: `Close ${type} editor` }).press('Enter')
    await inspector.waitFor({ state: 'hidden' })
    expect(await opener.evaluate(element => (element.getRootNode() as Document | ShadowRoot).activeElement === element)).toBe(true)
  } finally { await page.close() }
}, 30000)

it('keeps process list details readable beside the edit actions at 390 px', async () => {
  const { page } = await fixture('process', false, 390)
  try {
    await boardSection(page, 'Workflow').click()
    await page.getByRole('button', { name: 'List', exact: true }).click()
    const tables = page.getByRole('region', { name: 'Process list' }).getByRole('table')
    for (const table of await tables.all()) {
      const row = table.locator('tbody').getByRole('row').first()
      const cells = row.getByRole('cell')
      for (const index of [1, 2]) {
        const width = await cells.nth(index).evaluate(element => {
          const style = getComputedStyle(element)
          return element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
        })
        expect(width).toBeGreaterThan(64)
      }
      const action = row.getByRole('button', { name: /^Edit / })
      const bounds = (await table.boundingBox())!
      const button = (await action.boundingBox())!
      expect(button.x + button.width).toBeLessThanOrEqual(bounds.x + bounds.width)
    }
    expect(await tables.count()).toBe(2)
  } finally { await page.close() }
}, 30000)
it('resets a successful Apply once when its read is superseded by a notification', async () => {
  const f = await fixture('settings'), { page } = f
  try {
    await boardSection(page, 'Fields').click()
    await page.locator('.work-field-row .work-definition-toggle').first().click()
    await page.getByLabel('Field title', { exact: true }).first().fill('Summary')
    await page.getByRole('button', { name: 'Review changes', exact: true }).click()
    await page.getByRole('button', { name: 'Apply changes', exact: true }).click()
    await expect.poll(f.isHeld).toBe(true)
    await page.evaluate(() => (window as unknown as { fixtureNotify: (topic: string) => void }).fixtureNotify('component.b'))
    await expect.poll(() => page.getByText('Unsaved changes', { exact: true }).count()).toBe(0)
    await f.release()
    await expect.poll(() => page.getByText('Board changes applied.', { exact: true }).isVisible()).toBe(true)
    expect(await page.getByText('Unsaved changes', { exact: true }).count()).toBe(0)
    await shot(page, 'W03-applied-generation-reset'); expect(f.errors).toEqual([])
  } finally { await page.close() }
}, 30000)
it('blocks Review for an invalid item key and permits generation-zero initialization', async () => {
  const { page, errors, requests } = await fixture('settings', true)
  try {
    const prefix = page.getByLabel('Item key prefix', { exact: true })
    await prefix.fill('invalid!')
    await page.getByRole('button', { name: 'Review changes', exact: true }).click()
    expect(await page.getByRole('dialog', { name: 'Review changes' }).count()).toBe(0)
    expect(requests.some(r => r.path.endsWith('/plan_schema'))).toBe(false)
    await prefix.fill('INIT')
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
    await boardSection(page, 'Fields').click()
    await page.locator('.work-field-row .work-definition-toggle').first().click()
    await page.getByLabel('Field title', { exact: true }).first().fill('Unsaved summary')
    const back = page.getByRole('button', { name: 'All boards', exact: true })
    await back.click()
    await expect.poll(() => page.locator('#confirm').isVisible()).toBe(true)
    await shot(page, 'W11-confirm-board-switch')
    await page.locator('#keep').click()
    expect(await page.getByLabel('Field title', { exact: true }).first().inputValue()).toBe('Unsaved summary')
    await back.click(); await page.locator('#discard').click()
    await page.getByLabel('Settings for Other board', { exact: true }).click()
    await expect.poll(() => page.locator('kickside-work-board-settings').getAttribute('board-id')).toBe('other')
    expect(errors).toEqual([])
  } finally { await page.close() }
}, 30000)

it('guards unsaved active plugin settings until saved or discarded', async () => {
  const { page, requests } = await fixture('admin-plugin-draft')
  try {
    const delivery = page.getByRole('button', { name: 'Settings for Delivery', exact: true })
    const back = page.getByRole('button', { name: 'All boards', exact: true })
    const threshold = page.getByRole('spinbutton', { name: 'Threshold', exact: true })
    const save = page.getByRole('button', { name: 'Save plugin settings' })
    async function openPlugin() {
      await delivery.click()
      await boardSection(page, 'Plugins').click()
      await page.getByRole('button', { name: 'Board enhancements', exact: true }).click()
    }
    async function keepEditing() {
      await back.click()
      await page.getByRole('dialog', { name: 'Discard changes?' }).waitFor({ timeout: 2000 })
      await page.locator('#keep').click()
    }

    await openPlugin()
    await threshold.fill('7')
    await boardSection(page, 'General').click()
    await keepEditing()
    await boardSection(page, 'Plugins').click()
    expect(await threshold.inputValue()).toBe('7')
    expect(await page.getByRole('button', { name: 'Review changes', exact: true }).count()).toBe(0)

    await threshold.fill('99')
    await save.click()
    await expect.poll(() => requests.find(r => r.path.endsWith('/configure_plugin'))?.body.config).toEqual({ threshold: 99 })
    await page.getByRole('alert').filter({ hasText: /Threshold rejected|Could not configure plugin/ }).waitFor()
    await keepEditing()
    expect(await threshold.inputValue()).toBe('99')

    await threshold.fill('8')
    await save.click()
    await page.getByText('Plugin configuration saved.').waitFor()
    await back.click()
    await delivery.waitFor()
    expect(await page.locator('#confirm').isVisible()).toBe(false)

    await openPlugin()
    expect(await threshold.inputValue()).toBe('8')
    await threshold.fill('10')
    await page.getByRole('button', { name: 'Reset', exact: true }).click()
    expect(await threshold.inputValue()).toBe('8')
    expect(await save.isEnabled()).toBe(false)
    await back.click()
    await delivery.waitFor()

    await openPlugin()
    await threshold.fill('11')
    await back.click()
    await page.getByRole('dialog', { name: 'Discard changes?' }).waitFor()
    await page.locator('#discard').click()
    await openPlugin()
    expect(await threshold.inputValue()).toBe('8')
    expect(requests.filter(r => r.path.endsWith('/configure_plugin'))).toHaveLength(2)
  } finally { await page.close() }
}, 30000)

it('shows the pack version and planned resources before applying', async () => {
  const { page, requests } = await fixture('settings')
  try {
    await page.getByRole('button', { name: 'Install pack', exact: true }).click()
    await page.getByRole('combobox', { name: 'Pack to install' }).click()
    await page.getByRole('option', { name: /Release pipeline/ }).click()
    await page.getByRole('button', { name: 'Review pack', exact: true }).click()
    const resources = page.getByRole('region', { name: 'Pack resources' })
    for (const name of ['1.0.0', 'Change register', 'review-notification', 'app:review_trait', 'Board enhancements']) {
      await resources.getByText(name, { exact: true }).waitFor({ timeout: 2000 })
    }
    expect(requests.some(r => r.path.endsWith('/pack_apply'))).toBe(false)
  } finally { await page.close() }
}, 30000)

it('shows a collapsed plugin configuration error and submits only explicit overrides', async () => {
  const { page, requests } = await fixture('plugin-validation')
  try {
    await boardSection(page, 'Plugins').click()
    await page.getByRole('switch', { name: 'Enable Board enhancements' }).click()
    await page.getByText('Configuration needed', { exact: true }).waitFor({ timeout: 2000 })
    await page.getByText('Threshold: A value is required.', { exact: true }).waitFor()
    const review = page.getByRole('button', { name: 'Review changes', exact: true })
    expect(await review.isEnabled()).toBe(false)
    await page.getByRole('button', { name: 'Board enhancements', exact: true }).click()
    const threshold = page.getByRole('spinbutton', { name: 'Threshold', exact: true })
    expect(await threshold.getAttribute('aria-required')).toBe('true')
    await threshold.fill('7')
    const batch = page.getByRole('spinbutton', { name: 'Batch size', exact: true })
    await batch.focus()
    expect(await batch.inputValue()).toBe('')
    await page.getByText('Suggested value: 5', { exact: true }).waitFor()
    await review.click()
    await expect.poll(() => requests.find(r => r.path.endsWith('/plan_schema'))?.body.plugin_configs)
      .toEqual({ 'fixture:enhancements': { threshold: 7 } })
  } finally { await page.close() }
}, 30000)

it('retries pack discovery inside New board and explains an invalid pack', async () => {
  const { page } = await fixture('create-discovery')
  try {
    await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Change Review')
    await page.getByRole('button', { name: 'Continue', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'New board' })
    await dialog.getByText('Pack discovery offline', { exact: false }).waitFor()
    await dialog.getByRole('button', { name: 'Reload packs', exact: true }).click({ timeout: 2000 })
    await dialog.getByText(/Pack data is malformed.*invalid_pack/).waitFor()
    await dialog.getByText('Release pipeline', { exact: true }).waitFor()
  } finally { await page.close() }
}, 30000)

it('recovers pack discovery and continues the frozen operation with the same key', async () => {
  const { page, requests } = await fixture('install-pack')
  try {
    await page.getByRole('button', { name: 'Install pack', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Install pack' })
    await dialog.getByText('Pack discovery offline', { exact: false }).waitFor({ timeout: 2000 })
    await dialog.getByRole('button', { name: 'Reload packs', exact: true }).click()
    await dialog.getByRole('combobox', { name: 'Pack to install' }).click()
    const malformed = dialog.getByRole('option', { name: /Broken installed pack.*Pack data is malformed.*invalid_pack/ })
    expect(await malformed.getAttribute('aria-disabled')).toBe('true')
    await dialog.getByRole('option', { name: /Release pipeline/ }).click()
    await dialog.getByRole('button', { name: 'Review pack', exact: true }).click()
    await page.getByRole('button', { name: 'Apply changes', exact: true }).click()
    const operation = page.getByRole('region', { name: 'Pack installation' })
    for (const text of ['Pending', 'operation-12', 'job-34']) await operation.getByText(text, { exact: true }).waitFor()
    await operation.getByRole('button', { name: 'Continue pack installation' }).click()
    await operation.getByText('Pack applied.', { exact: true }).waitFor()
    const applied = requests.filter(r => r.path.endsWith('/pack_apply'))
    expect(applied).toHaveLength(2)
    expect(applied[0].body.key).toEqual(expect.any(String))
    expect(applied[0].body).toEqual(applied[1].body)
  } finally { await page.close() }
}, 30000)

it('explains projection reset before recovery and lets the operator cancel', async () => {
  const { page, requests } = await fixture('projection-reset')
  try {
    await boardSection(page, 'Plugins').click()
    await page.getByRole('button', { name: 'Board enhancements', exact: true }).click()
    await page.getByText(/Worker stopped/).waitFor()
    const reset = page.getByRole('button', { name: 'Reset projection', exact: true })
    await reset.click()
    const confirm = page.getByRole('dialog', { name: 'Reset projection?' })
    await confirm.getByText(/rebuild from current items or replay retained events/i).waitFor({ timeout: 2000 })
    await confirm.getByRole('button', { name: 'Cancel', exact: true }).click()
    expect(requests.some(r => r.path.endsWith('/configure_plugin'))).toBe(false)
    await reset.click()
    await confirm.getByRole('button', { name: 'Reset projection', exact: true }).click()
    await expect.poll(() => requests.find(r => r.path.endsWith('/configure_plugin'))?.body).toEqual({ plugin: 'fixture:enhancements' })
  } finally { await page.close() }
}, 30000)

it('confirms leaving an edited board description and clears the prompt after Cancel', async () => {
  const { page, errors } = await fixture('admin')
  try {
    await page.getByLabel('Settings for Delivery', { exact: true }).click()
    await page.getByRole('button', { name: 'Board description and icon' }).click()
    const description = page.getByRole('textbox', { name: 'Description', exact: true })
    await description.fill('Unsaved release notes')
    const back = page.getByRole('button', { name: 'All boards', exact: true })
    await back.click()
    await expect.poll(() => page.locator('#confirm').isVisible()).toBe(true)
    await page.locator('#keep').click()
    expect(await description.inputValue()).toBe('Unsaved release notes')
    await page.getByRole('button', { name: 'Cancel', exact: true }).click()
    await back.click()
    await page.getByLabel('Settings for Other board', { exact: true }).click()
    await expect.poll(() => page.locator('kickside-work-board-settings').getAttribute('board-id')).toBe('other')
    expect(await page.locator('#confirm').isVisible()).toBe(false)
    expect(errors).toEqual([])
  } finally { await page.close() }
}, 30000)

it('fits board fields and the add action in a 390px settings surface', async () => {
  const { page } = await fixture('admin')
  try {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.getByLabel('Settings for Delivery', { exact: true }).click()
    await boardSection(page, 'Fields').click()
    const fields = page.getByRole('region', { name: 'Fields editor' })
    await fields.waitFor()
    const details = await page.getByRole('region', { name: 'Board settings detail' }).boundingBox()
    const shell = await page.locator('.work-admin-shell').boundingBox()
    expect(details?.width).toBe(shell?.width)
    expect(await page.getByRole('navigation', { name: 'Board settings sections' }).isVisible()).toBe(true)
    expect(await page.getByRole('complementary', { name: /^Boards/ }).count()).toBe(0)
    expect(await page.getByRole('searchbox', { name: 'Search boards' }).count()).toBe(0)
    const list = fields.locator('.work-definition-scroll')
    expect(await list.evaluate(el => el.scrollWidth - el.clientWidth)).toBe(0)
    const add = await fields.getByRole('button', { name: 'Add field', exact: true }).boundingBox()
    expect(add!.x + add!.width).toBeLessThanOrEqual(390)
    await page.getByRole('button', { name: 'All boards', exact: true }).click()
    expect(await page.getByLabel('Settings for Delivery', { exact: true }).isVisible()).toBe(true)
  } finally { await page.close() }
}, 30000)

it.each([1500, 900])('keeps CI/CD transitions available at readable zoom with the real settings inspector at %s', async width => {
  const { page, errors } = await fixture('process')
  try {
    await page.setViewportSize({ width, height: 1000 })
    await boardSection(page, 'Workflow').click()
    const canvas = page.getByLabel('Process map', { exact: true })
    await canvas.press('0')
    expect(await page.locator('.work-edge-label-bg').count()).toBe(11)
    const zoom = await canvas.locator('svg[aria-label="States and transitions"]').evaluate(element => {
      const svg = element as SVGSVGElement
      return svg.getBoundingClientRect().width / svg.viewBox.baseVal.width
    })
    expect(zoom).toBeGreaterThanOrEqual(0.79)
    await page.getByRole('button', { name: 'Edit state Planned', exact: true }).click()
    await expect.poll(() => page.getByLabel('State settings', { exact: true }).isVisible()).toBe(true)
    await canvas.press('0')
    expect(await page.locator('.work-edge-label-bg').count()).toBe(11)
    await shot(page, `W02-cicd-inspector-${width}`); expect(errors).toEqual([])
  } finally { await page.close() }
}, 30000)
