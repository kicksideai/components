// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { afterAll, beforeAll, expect, test } from 'vitest'

const origin = 'http://localhost:' + process.env.KANBAN_FIRE_PORT
const { board, fleet: [small], child, story, epic, extreme, off, sprintMember, nextSprint, sprintBoard = small } = JSON.parse(await readFile(process.env.KANBAN_FIRE_FIXTURE, 'utf8'))
const artifacts = process.env.KANBAN_FIRE_EVIDENCE
let browser

beforeAll(async () => {
  const { chromium } = createRequire(import.meta.url)(process.env.KANBAN_FIRE_PLAYWRIGHT)
  browser = await chromium.connect(process.env.KANBAN_FIRE_WS)
}, 20_000)
afterAll(async () => { await browser?.close() })

const route = (id, tab = '', issue) => '/work-kanban/board/' + id + (tab ? '/' + tab : '') + (issue ? '/issue/' + issue : '')
const button = (root, name) => root.getByRole('button', { name, exact: true })
const drawer = root => root.getByRole('dialog', { name: /^KS|Issue details/ })

async function open({ width = 1440, colorScheme = 'light', reader = false, path = route(board) } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 844 }, colorScheme, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(marker => {
    if (window.top === window && location.pathname === '/login') localStorage.setItem('@wippy_token_info', JSON.stringify({ token: marker }))
  }, reader ? process.env.KANBAN_FIRE_READER : process.env.KANBAN_FIRE_OWNER)
  await page.goto(origin + '/login', { waitUntil: 'domcontentloaded' })
  await page.goto(origin + path, { waitUntil: 'domcontentloaded' })
  const shell = page.frameLocator('iframe').first()
  const app = shell.locator('kickside-work-kanban')
  await app.getByRole('combobox', { name: 'Board switcher' }).waitFor()
  const onboarding = button(shell, 'Close onboarding')
  if (await onboarding.isVisible()) await onboarding.click()
  return { app, shell, page, context, errors }
}

test('creates an issue with Work’s root default, patches in the drawer, posts and reads History', async () => {
  const { app, page, context, errors } = await open({ path: route(small) })
  try {
    const summary = 'Fire create ' + crypto.randomUUID().slice(0, 8)
    await button(app, 'Create issue').click()
    const form = app.getByRole('dialog', { name: 'Create issue' })
    await form.getByRole('textbox', { name: 'Summary' }).fill(summary)
    expect(await form.getByRole('combobox', { name: 'Issue type' }).textContent()).toContain('Epic')
    await page.screenshot({ path: join(artifacts, 'fire-create-issue.png') })
    const request = page.waitForRequest(req => req.url().endsWith('/apply') && req.postDataJSON()?.ops?.[0]?.op === 'create')
    await button(form, 'Create issue').click()
    expect((await request).postDataJSON()?.ops[0]).toMatchObject({ op: 'create', type: 'epic', values: { title: summary } })
    const issue = drawer(app)
    await issue.getByRole('heading', { name: summary }).waitFor()
    await page.reload()
    await issue.getByRole('heading', { name: summary }).waitFor()
    await button(issue, 'Edit Summary').click()
    await issue.getByRole('textbox', { name: 'Summary' }).fill(summary + ' reviewed')
    await issue.getByRole('textbox', { name: 'Summary' }).press('Enter')
    await issue.getByRole('heading', { name: summary + ' reviewed' }).waitFor()
    await button(issue, 'Status: To Do').click()
    const menu = issue.getByRole('dialog', { name: 'Change status' })
    expect(await button(menu, 'Mark blocked').getAttribute('aria-disabled')).toBe('true')
    await menu.getByText('Link an open blocker to use this transition.', { exact: true }).waitFor()
    await button(menu, 'Start work').click()
    await button(issue, 'Status: In Progress').waitFor()
    await issue.getByRole('textbox', { name: 'Add a comment' }).fill('Fire verifies the drawer comment.')
    await button(issue, 'Post comment').click()
    await issue.getByText('Fire verifies the drawer comment.', { exact: true }).waitFor()
    await issue.getByRole('tab', { name: 'History' }).click()
    await issue.getByRole('listitem').filter({ hasText: summary + ' reviewed' }).getByText('Changed Summary', { exact: true }).waitFor()
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
}, 50_000)

test('keeps the neighbor rank in the atomic move when the drawer collects Resolution', async () => {
  const { app, shell, page, context, errors } = await open({ path: route(small) })
  try {
    const idempotencyKey = crypto.randomUUID()
    const suffix = idempotencyKey.slice(0, 8)
    const headers = { authorization: 'Bearer ' + process.env.KANBAN_FIRE_OWNER }
    const created = await page.request.post(origin + '/api/v1/work/boards', {
      headers,
      data: {
        title: 'Ranked transition fixture ' + suffix, idempotency_key: idempotencyKey,
        pack: 'kickside.work.kanban:pack', version: '1.0.0', starter: false,
      },
    })
    expect(created.ok()).toBe(true)
    const { data: { board_id: rankBoard } } = await created.json()
    const endpoint = origin + '/api/v1/work/boards/' + rankBoard + '/apply'
    const apply = async ops => {
      const response = await page.request.post(endpoint, { headers, data: { key: crypto.randomUUID(), mode: 'atomic', ops } })
      expect(response.ok()).toBe(true)
      const { data } = await response.json()
      expect(data.outcomes.every(row => row.status === 'applied')).toBe(true)
      return data.outcomes
    }
    const [source, neighbor] = await apply([
      { op: 'create', type: 'epic', values: { title: 'Resolve with rank ' + suffix } },
      { op: 'create', type: 'epic', values: { title: 'Rank neighbor ' + suffix } },
    ])
    for (const { item } of [source, neighbor]) {
      await apply([
        { op: 'transition', item, transition: 'start' },
        { op: 'transition', item, transition: 'review' },
      ])
    }
    await apply([{ op: 'transition', item: neighbor.item, transition: 'finish', values: { resolution: 'fixed' } }])
    await page.goto(origin + route(rankBoard), { waitUntil: 'domcontentloaded' })
    const row = app.locator('[data-card-id="' + source.item + '"]')
    await button(row, 'Move ' + source.key).click()
    await app.getByRole('menuitem', { name: 'Done', exact: true }).click()
    const issue = app.getByRole('dialog', { name: source.key })
    await issue.getByRole('heading', { name: 'Confirm status change' }).waitFor()
    await issue.getByRole('combobox', { name: 'Resolution', exact: true }).click()
    await shell.getByRole('option', { name: 'Fixed', exact: true }).click()
    const response = page.waitForResponse(result => result.url() === endpoint
      && result.request().postDataJSON()?.ops?.[0]?.item === source.item)
    await button(issue, 'Confirm move').click()
    const result = await response
    expect(result.request().postDataJSON()).toMatchObject({ mode: 'atomic', ops: [
      { op: 'transition', item: source.item, transition: 'finish', values: { resolution: 'fixed' } },
      { op: 'rank', item: source.item, after: neighbor.item },
    ] })
    expect((await result.json()).data.outcomes.map(row => row.status)).toEqual(['applied', 'applied'])
    await issue.getByText('Done', { exact: true }).first().waitFor()
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
}, 55_000)

test('reads parents without card pages and pages an authorized dense Relationships section', async () => {
  const { app, page, context, errors } = await open({ path: route(board, 'search', child) })
  try {
    const issue = drawer(app)
    await issue.getByRole('heading', { name: 'Check staging rollback' }).waitFor()
    await issue.getByRole('navigation', { name: 'Parent issue' }).getByRole('link', { name: /Deployment readiness story/ }).click()
    await page.waitForURL(url => url.pathname.endsWith('/issue/' + story))
    await issue.getByRole('navigation', { name: 'Parent issue' }).getByRole('link').click()
    await page.waitForURL(url => url.pathname.endsWith('/issue/' + epic))
    await page.goto(origin + route(board, 'search', extreme), { waitUntil: 'domcontentloaded' })
    await issue.getByRole('heading', { name: /配備/ }).waitFor()
    expect(Array.from(await issue.locator('.kanban-issue-title').textContent())).toHaveLength(300)
    await button(issue, 'More fields').click()
    await issue.getByText('Fixture Reviewer 01', { exact: true }).first().waitFor()
    await issue.getByRole('button', { name: /Show 8 more Reviewers/ }).click()
    await issue.getByText('Fixture Reviewer 12', { exact: true }).waitFor()
    await issue.getByRole('tab', { name: 'Relationships' }).click()
    const links = issue.getByRole('link', { name: /open linked issue/ })
    await links.first().waitFor()
    expect(await links.count()).toBe(20)
    await button(issue, 'Load more links').click()
    await expect.poll(() => links.count()).toBe(40)
    await button(issue, 'Load more links').click()
    await expect.poll(() => links.count()).toBe(60)
    await page.screenshot({ path: join(artifacts, 'fire-dense-relationships.png') })
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
}, 60_000)

test.each(['light', 'dark'])('at 390 px Search, keyboard focus and transient drawer recovery work in %s mode', async colorScheme => {
  const { app, page, context, errors } = await open({ width: 390, colorScheme, path: route(board, 'search') })
  try {
    const field = app.getByRole('searchbox', { name: 'Search issues' })
    await field.fill('Check staging rollback')
    const result = app.getByRole('button', { name: /Check staging rollback/ })
    await result.waitFor()
    await result.focus()
    await page.route('**/api/v1/work/boards/**/get', interceptor => interceptor.abort(), { times: 1 })
    await page.keyboard.press('Enter')
    const issue = drawer(app)
    await button(issue, 'Retry issue').click()
    await issue.getByRole('heading', { name: 'Check staging rollback' }).waitFor()
    const geometry = await issue.boundingBox()
    expect(geometry.x).toBeGreaterThanOrEqual(0)
    expect(geometry.x + geometry.width).toBeLessThanOrEqual(390)
    expect(geometry.width).toBe(390)
    await page.screenshot({ path: join(artifacts, 'fire-drawer-390-' + colorScheme + '.png') })
    await page.keyboard.press('Escape')
    await issue.waitFor({ state: 'hidden' })
    await expect.poll(() => result.evaluate(node => node.getRootNode().activeElement === node)).toBe(true)
    expect(await field.inputValue()).toBe('Check staging rollback')
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
}, 50_000)

test('a reader can trace an issue while Work rejects a direct write', async () => {
  const { app, page, context, errors } = await open({ reader: true, path: route(board, '', child) })
  try {
    const issue = drawer(app)
    await issue.getByRole('heading', { name: 'Check staging rollback' }).waitFor()
    expect(await button(issue, 'Edit Summary').count()).toBe(0)
    expect(await button(app, 'Create issue').count()).toBe(0)
    expect(await issue.getByRole('textbox', { name: 'Add a comment' }).count()).toBe(0)
    await issue.getByRole('tab', { name: 'Relationships' }).click()
    const denied = await page.request.post(origin + '/api/v1/work/boards/' + board + '/apply', {
      headers: { authorization: 'Bearer ' + process.env.KANBAN_FIRE_READER },
      data: { key: crypto.randomUUID(), mode: 'atomic', ops: [{ op: 'set', item: child, values: { title: 'Unauthorized' } }] },
    })
    expect(denied.status()).toBe(403)
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
}, 40_000)

test('previews and commits the same Planning snapshot and rolls unfinished work forward', async () => {
  const { app, page, context, errors } = await open({ path: route(sprintBoard, 'sprints') })
  try {
    await app.getByText('Current sprint fixture', { exact: true }).waitFor()
    await app.getByRole('button', { name: /Sprint rollover issue/ }).waitFor()
    const previewAnswer = page.waitForResponse(response => response.url().endsWith('/sprints/plan_close') && response.ok())
    await button(app, 'Close sprint').click()
    const dialog = app.getByRole('dialog', { name: 'Close sprint' })
    await dialog.getByText('1 unfinished issue will move to Next sprint fixture.').waitFor()
    const preview = (await (await previewAnswer).json()).data
    await page.screenshot({ path: join(artifacts, 'fire-sprint-preview.png') })
    const commit = page.waitForRequest(request => request.url().endsWith('/sprints/close'))
    await button(dialog, 'Close sprint').click()
    expect((await commit).postDataJSON()).toMatchObject({ snapshot: preview.snapshot, token: preview.token, key: expect.any(String) })
    await dialog.waitFor({ state: 'hidden' })
    const response = await page.request.post(origin + '/api/v1/work/boards/' + sprintBoard + '/get', {
      headers: { authorization: 'Bearer ' + process.env.KANBAN_FIRE_OWNER }, data: { item: { id: sprintMember } },
    })
    expect((await response.json()).data.item.values.current_sprint.item).toBe(nextSprint)
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
}, 40_000)

test('keeps the board and Backlog available on an inactive Search deep link', async () => {
  expect(off, 'the fixture board has both optional plugins disabled').toBeTruthy()
  const { app, context, errors } = await open({ path: route(off, 'search') })
  try {
    await app.getByText('Search is not enabled for this board.', { exact: true }).waitFor()
    expect(await app.getByRole('tab').allTextContents()).toEqual(['Board', 'Backlog'])
    await app.getByRole('tab', { name: 'Board', exact: true }).click()
    await app.getByText('Core Work without plugins', { exact: true }).waitFor()
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
}, 30_000)

test('keeps the System tab treatment and aligns the Kanban tabs with the toolbar controls', async () => {
  const { app, shell, page, context, errors } = await open({ path: route(small) })
  const nav = shell.getByRole('navigation', { name: 'Main navigation' })
  const readTab = tab => tab.evaluate(node => {
    const css = getComputedStyle(node)
    return {
      background: css.backgroundColor, display: css.display, padding: css.padding,
      fontSize: css.fontSize, fontWeight: css.fontWeight,
      border: css.borderBottomWidth, borderColor: css.borderBottomColor,
      height: node.getBoundingClientRect().height,
    }
  })
  try {
    const kanbanTabs = app.getByRole('tablist', { name: 'Work views' })
    await kanbanTabs.waitFor()
    const board = await readTab(kanbanTabs.getByRole('tab', { name: 'Board', exact: true }))
    const backlog = await readTab(kanbanTabs.getByRole('tab', { name: 'Backlog', exact: true }))
    await kanbanTabs.screenshot({ path: join(artifacts, 'fire-kanban-tabs.png') })
    await button(nav, 'System').click()
    const system = shell.locator('.system-tabs')
    await system.waitFor()
    await system.screenshot({ path: join(artifacts, 'fire-system-tabs.png') })
    const selected = await readTab(system.locator('[role="tab"][aria-selected="true"]').first())
    const unselected = await readTab(system.locator('[role="tab"][aria-selected="false"]').first())
    for (const name of ['Knowledge', 'Automations']) {
      await button(nav, name).click()
      await shell.getByRole('heading', { name, exact: true }).first().waitFor()
      await page.screenshot({ path: join(artifacts, 'fire-reference-' + name.toLowerCase() + '.png') })
    }
    const toolbar = { display: 'flex', padding: '0px 8px', fontSize: '14px', fontWeight: '500', height: 34 }
    expect(board).toEqual({ ...selected, ...toolbar })
    expect(backlog).toEqual({ ...unselected, ...toolbar })
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
}, 50_000)

test('resizes the non-modal panel, remembers its width, and opens the same URL full-width', async () => {
  const { app, page, context, errors } = await open({ path: route(board, 'search') })
  try {
    const boardView = app.getByRole('region', { name: 'Board', exact: true })
    const search = app.getByRole('searchbox', { name: 'Search issues' })
    await search.fill('Check staging rollback')
    await app.getByRole('button', { name: /Check staging rollback/ }).click()
    await page.waitForURL(url => url.pathname === route(board, '', child))
    const issue = drawer(app)
    await issue.getByRole('heading', { name: 'Check staging rollback' }).waitFor()
    expect(await search.isVisible()).toBe(true)
    expect(await issue.getAttribute('aria-modal')).not.toBe('true')
    const handle = issue.getByRole('separator', { name: 'Issue panel width' })
    const start = await handle.boundingBox()
    const initial = (await issue.boundingBox()).width
    await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2)
    await page.mouse.down()
    await page.mouse.move(start.x - 65, start.y + start.height / 2, { steps: 6 })
    await page.mouse.up()
    const resized = (await issue.boundingBox()).width
    expect(resized - initial).toBeGreaterThan(50)
    await page.reload()
    await issue.getByRole('heading', { name: 'Check staging rollback' }).waitFor()
    await expect.poll(async () => (await issue.boundingBox()).width).toBeCloseTo(resized)
    await handle.press('Home')
    expect((await issue.boundingBox()).width).toBe(Number(await handle.getAttribute('aria-valuemin')))
    await handle.press('End')
    expect((await issue.boundingBox()).width).toBe(Number(await handle.getAttribute('aria-valuemax')))
    await button(app, 'Compact card density').click()
    expect(await button(app, 'Compact card density').getAttribute('aria-pressed')).toBe('true')
    const url = page.url()
    await button(issue, 'Open full page').click()
    const full = app.getByRole('region', { name: /^KS/ })
    await full.waitFor()
    expect((await full.boundingBox()).width).toBeCloseTo((await app.boundingBox()).width)
    expect(page.url()).toBe(url)
    expect(await boardView.isVisible()).toBe(false)
    await page.screenshot({ path: join(artifacts, 'fire-issue-full-page.png') })
    await button(full, 'Open side panel').click()
    await issue.waitFor()
    await page.goBack()
    await issue.waitFor({ state: 'hidden' })
    await page.waitForURL(url => url.pathname === route(board, 'search'))
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
}, 55_000)


test('inline fields cancel on Escape, save on blur, and keep the comment composer compact', async () => {
  const { app, context, errors } = await open({ path: route(small) })
  try {
    await button(app, 'Create issue').click()
    const create = app.getByRole('dialog', { name: 'Create issue' })
    const original = 'Inline field ' + crypto.randomUUID().slice(0, 8)
    await create.getByRole('textbox', { name: 'Summary' }).fill(original)
    await button(create, 'Create issue').click()
    const issue = drawer(app)
    await issue.getByRole('heading', { name: original }).waitFor()
    const trigger = button(issue, 'Edit Summary')
    await trigger.press('Enter')
    const editor = issue.getByRole('textbox', { name: 'Summary' })
    await editor.fill('Discard this draft')
    await editor.press('Escape')
    await issue.getByRole('heading', { name: original }).waitFor()
    await expect.poll(() => trigger.evaluate(node => node.getRootNode().activeElement === node)).toBe(true)
    await trigger.click()
    const updated = original + ' saved on blur'
    await editor.fill(updated)
    await editor.press('Tab')
    await issue.getByRole('heading', { name: updated }).waitFor()
    await button(issue, 'Edit Priority').click()
    const priority = issue.getByRole('combobox', { name: 'Priority', exact: true })
    await priority.click()
    await issue.getByRole('option', { name: 'High', exact: true }).click()
    await button(issue, 'Close issue details').focus()
    await expect.poll(() => button(issue, 'Edit Priority').textContent()).toBe('High')
    const comment = issue.getByRole('textbox', { name: 'Add a comment' })
    await button(issue, 'Close issue details').focus()
    const before = (await comment.boundingBox()).height
    expect(await button(issue, 'Post comment').count()).toBe(0)
    await comment.focus()
    expect((await comment.boundingBox()).height).toBeGreaterThan(before)
    await comment.fill('Draft note')
    await button(issue, 'Post comment').waitFor()
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
}, 50_000)
