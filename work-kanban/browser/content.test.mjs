// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { afterAll, beforeAll, expect, test } from 'vitest'

const origin = 'http://localhost:' + process.env.KANBAN_FIRE_PORT
const { fleet: [small] } = JSON.parse(await readFile(process.env.KANBAN_FIRE_FIXTURE, 'utf8'))
const artifacts = process.env.KANBAN_FIRE_EVIDENCE
let browser

beforeAll(async () => {
  const { chromium } = createRequire(import.meta.url)(process.env.KANBAN_FIRE_PLAYWRIGHT)
  browser = await chromium.connect(process.env.KANBAN_FIRE_WS)
}, 20_000)
afterAll(async () => { await browser?.close() })

const button = (root, name) => root.getByRole('button', { name, exact: true })
const drawer = root => root.getByRole('dialog', { name: /^KS|Issue details/ })

async function open(width, colorScheme) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(marker => {
    if (window.top === window && location.pathname === '/login') localStorage.setItem('@wippy_token_info', JSON.stringify({ token: marker }))
  }, process.env.KANBAN_FIRE_OWNER)
  await page.goto(origin + '/login', { waitUntil: 'domcontentloaded' })
  await page.goto(origin + '/work-kanban/board/' + small, { waitUntil: 'domcontentloaded' })
  const shell = page.frameLocator('iframe').first()
  const app = shell.locator('kickside-work-kanban')
  await app.getByRole('combobox', { name: 'Board switcher' }).waitFor()
  const onboarding = button(shell, 'Close onboarding')
  if (await onboarding.isVisible()) await onboarding.click()
  return { app, page, context, errors }
}

async function create(app, title) {
  await button(app.locator('.kanban-head'), 'Create issue').click()
  const form = app.getByRole('dialog', { name: 'Create issue' })
  await form.getByRole('textbox', { name: 'Summary' }).fill(title)
  await button(form, 'Create issue').click()
  const issue = drawer(app)
  await issue.getByRole('heading', { name: title }).waitFor()
  return (await issue.locator('.kanban-issue-identity').textContent()).trim()
}

test.each([[1440, 'light'], [390, 'dark']])('renders and edits rich descriptions and comments at %i in %s', async (width, scheme) => {
  const { app, page, context, errors } = await open(width, scheme)
  try {
    const run = crypto.randomUUID().slice(0, 8)
    const targetTitle = 'Referenced ' + run
    const target = await create(app, targetTitle)
    const subject = 'Rich content ' + run
    await create(app, subject)
    const issue = drawer(app)

    await button(issue, 'Add description…').click()
    const editor = issue.getByRole('textbox', { name: 'Description' })
    const lines = ['## Rollout', '', '- first step', '- [ ] check the canary', '', '```js', 'const ready = true', '```',
      '', 'Blocked by ' + target + ', see [the runbook](https://example.com/runbook).']
    await editor.fill(lines.join('\n') + '\n' + Array.from({ length: 30 }, (_, index) => 'Detail line ' + (index + 1)).join('\n\n'))
    await editor.press(process.platform === 'darwin' ? 'Meta+Enter' : 'Control+Enter')
    const rendered = issue.locator('.kanban-issue-description .kanban-markdown')
    await rendered.locator('h2', { hasText: 'Rollout' }).waitFor()
    expect(await rendered.locator('pre.hljs code').textContent()).toContain('const ready = true')
    expect(await rendered.locator('li').count()).toBeGreaterThanOrEqual(2)
    const reference = rendered.locator('a', { hasText: target })
    await reference.waitFor()
    expect(await rendered.locator('a', { hasText: 'the runbook' }).getAttribute('href')).toBe('https://example.com/runbook')
    const more = button(issue, 'Show more')
    await more.waitFor()
    await more.click()
    await button(issue, 'Show less').waitFor()
    await page.screenshot({ path: join(artifacts, `content-description-${width}-${scheme}.png`) })

    await expect.poll(() => reference.getAttribute('href')).toMatch(/\/work-kanban\/board\/[^/]+\/issue\/[^/]+$/)

    const composer = issue.getByRole('textbox', { name: 'Add a comment' })
    const resting = (await composer.boundingBox()).height
    await composer.click()
    await expect.poll(async () => (await composer.boundingBox()).height).toBeGreaterThan(resting)
    await button(issue, 'Bold').click()
    expect(await composer.inputValue()).toBe('**bold text**')
    await composer.fill('Looks good, tracking ' + target + ' too.')
    await composer.press(process.platform === 'darwin' ? 'Meta+Enter' : 'Control+Enter')
    const card = issue.locator('.issue-comment-card', { hasText: 'Looks good' })
    await card.waitFor()
    const time = card.locator('time')
    expect(await time.textContent()).toMatch(/just now|second|minute/)
    expect(await time.getAttribute('title')).toMatch(/\d/)
    await card.hover()
    await card.getByRole('button', { name: /^Edit comment/ }).click()
    const edit = issue.getByRole('textbox', { name: 'Edit comment' })
    await edit.fill('Looks great after review.')
    await button(issue, 'Save').click()
    const edited = issue.locator('.issue-comment-card', { hasText: 'Looks great after review.' })
    await edited.getByText('edited', { exact: true }).waitFor()
    await page.screenshot({ path: join(artifacts, `content-comments-${width}-${scheme}.png`) })

    await button(issue, 'History').click()
    expect(await issue.locator('.issue-comment-card').count()).toBe(0)
    await issue.locator('.issue-event-entry').first().waitFor()
    await button(issue, 'All').click()

    await edited.hover()
    await edited.getByRole('button', { name: /^Delete comment/ }).click()
    await button(issue, 'Delete comment').click()
    await edited.waitFor({ state: 'detached' })

    await composer.click()
    await composer.pressSequentially(' @')
    await issue.locator('.kanban-mention-popover').waitFor()
    await composer.press('Escape')

    const tab = context.waitForEvent('page')
    await reference.click()
    const opened = await tab
    await opened.waitForURL(url => url.pathname.includes('/issue/'))
    await opened.frameLocator('iframe').first().locator('kickside-work-kanban')
      .getByRole('heading', { name: targetTitle }).waitFor()
    expect(errors).toEqual([])
  } finally {
    await context.close()
  }
}, 90_000)
