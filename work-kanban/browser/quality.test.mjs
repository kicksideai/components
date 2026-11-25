// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { createRequire } from 'node:module'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterAll, beforeAll, expect, test } from 'vitest'

const origin = 'http://localhost:' + process.env.KANBAN_FIRE_PORT
const { after: release } = JSON.parse(await readFile(new URL('../.run/visual.json', import.meta.url), 'utf8'))
const { chromium } = createRequire(import.meta.url)(process.env.KANBAN_FIRE_PLAYWRIGHT)
let browser
beforeAll(async () => { browser = await chromium.connect(process.env.KANBAN_FIRE_WS) })
afterAll(async () => { await browser?.close() })

async function setup(width, colorScheme = 'dark') {
  const context = await browser.newContext({
    viewport: { width, height: width === 390 ? 844 : 900 }, colorScheme, reducedMotion: 'reduce',
    storageState: { cookies: [], origins: [{ origin, localStorage: [
      { name: '@wippy_token_info', value: JSON.stringify({ token: process.env.KANBAN_FIRE_OWNER }) },
    ] }] },
  })
  const page = await context.newPage()
  const app = page.frameLocator('iframe').first().locator('kickside-work-kanban')
  const go = (board = release.main) => page.goto(origin + '/work-kanban/board/' + board, { waitUntil: 'domcontentloaded' })
  return { context, page, app, go }
}

function contrast(app, selectors) {
  return app.evaluate((host, selectors) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    const context = canvas.getContext('2d', { willReadFrequently: true })
    const root = host.shadowRoot
    const rgb = () => Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3)
    const draw = color => { context.fillStyle = color; context.fillRect(0, 0, 1, 1) }
    const luminance = rgb => {
      const [red, green, blue] = rgb.map(value => {
        const channel = value / 255
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue
    }
    const parent = node => node.parentElement ?? (node.getRootNode() instanceof ShadowRoot ? host : null)
    const result = {}
    for (const selector of selectors) {
      const node = root.querySelector(selector)
      if (!node) continue
      const layers = []
      for (let current = node; current; current = parent(current)) layers.unshift(getComputedStyle(current).backgroundColor)
      context.clearRect(0, 0, 1, 1)
      for (const layer of layers) draw(layer)
      const background = rgb()
      draw(getComputedStyle(node).color)
      const foreground = rgb()
      const [light, dark] = [luminance(background), luminance(foreground)].sort((a, b) => b - a)
      result[selector] = { ratio: (light + 0.05) / (dark + 0.05), foreground, background }
    }
    return result
  }, selectors)
}

test.each([1440, 390])('AA contrast, keyboard focus, tooltip and reduced motion at %i', async width => {
  const { context, page, app, go } = await setup(width)
  try {
    await go()
    const card = app.locator('.kanban-card-title').first()
    await card.waitFor()
    const laneSignal = app.locator('.kanban-column-head [data-status-tone]').first()
    await expect.poll(() => laneSignal.isVisible()).toBe(true)
    const typeSignal = app.locator('.kanban-card-type[data-type]').first()
    await expect.poll(() => typeSignal.isVisible()).toBe(true)
    await expect.poll(() => app.locator('.kanban-head .kx-head-sub').textContent()).toMatch(/\d+ open/)
    await card.hover()
    expect(await card.locator('..').evaluate(node => getComputedStyle(node).boxShadow)).not.toBe('none')
    const opener = card
    await opener.focus()
    await page.keyboard.press('ArrowDown')
    const focused = app.locator('.kanban-card-title:focus-visible')
    await focused.waitFor()
    expect(await focused.evaluate(node => {
      const css = getComputedStyle(node)
      return css.outlineStyle !== 'none' || css.boxShadow !== 'none'
    })).toBe(true)
    expect(await focused.getAttribute('title')).toBe((await focused.textContent()).trim())
    expect(await focused.locator('..').evaluate(node => getComputedStyle(node).transitionDuration.split(', ').every(time => time === '0s'))).toBe(true)
    const id = await focused.locator('..').getAttribute('data-card-id')
    const board = await contrast(app, ['.kanban-picker-title', '.kanban-head .kx-head-sub', '.kanban-column-head h2', '.kanban-card-title',
      '.kanban-card-key', '.kanban-card-priority'])
    await page.keyboard.press('Enter')
    await app.locator('.kanban-issue-title').waitFor()
    const panel = await contrast(app, ['.kanban-issue-title', '.kanban-issue-fields dt',
      '.kanban-issue-header button[aria-label="Close issue details"]'])
    await page.keyboard.press('Escape')
    await expect.poll(() => app.locator(`[data-card-id="${id}"] .kanban-card-title:focus`).count()).toBe(1)
    const findings = { ...board, ...panel }
    await writeFile(join(process.env.KANBAN_FIRE_EVIDENCE, 'quality-contrast-' + width + '.json'),
      JSON.stringify(findings, null, 2) + '\n')
    expect.soft(Object.keys(findings)).toHaveLength(9)
    for (const [label, value] of Object.entries(findings)) {
      expect.soft(value.ratio, label).toBeGreaterThanOrEqual(/priority|Close issue/.test(label) ? 3 : 4.5)
    }
  } finally {
    await context.close()
  }
}, 35_000)

test('board and issue loading reserve content space and recover from a view read error', async () => {
  const { context, page, app, go } = await setup(1440, 'light')
  try {
    let allowWork
    const gate = new Promise(resolve => { allowWork = resolve })
    await page.route('**/api/v1/work/views/*/run', async route => {
      await gate
      await route.continue()
    })
    await go()
    const skeletonCard = app.locator('.kanban-skeleton-card').first()
    await skeletonCard.waitFor()
    const skeletonHeight = (await skeletonCard.boundingBox()).height
    allowWork()
    const card = app.locator('.kanban-card').first()
    await card.waitFor()
    expect(skeletonHeight).toBeCloseTo((await card.boundingBox()).height)
    await page.unrouteAll({ behavior: 'wait' })

    let allowIssue
    const issueGate = new Promise(resolve => { allowIssue = resolve })
    await page.route('**/api/v1/work/boards/*/get', async route => {
      await issueGate
      await route.continue()
    })
    await card.locator('.kanban-card-title').click()
    const drawer = app.getByRole('dialog')
    const skeleton = drawer.getByRole('status').filter({ hasText: 'Loading issue details…' })
    await skeleton.waitFor({ state: 'attached' })
    const summary = drawer.locator('.kanban-issue-title')
    await summary.waitFor()
    const summaryBox = await summary.boundingBox()
    expect((await summary.textContent()).trim()).toBe((await card.locator('.kanban-card-title').textContent()).trim())
    const shell = await drawer.boundingBox()
    allowIssue()
    await drawer.getByRole('region', { name: 'Description', exact: true }).waitFor()
    expect(await summary.boundingBox()).toEqual(summaryBox)
    expect(await drawer.boundingBox()).toEqual(shell)
    await drawer.getByRole('button', { name: 'Close issue details' }).click()
    await drawer.waitFor({ state: 'hidden' })
    await page.unrouteAll({ behavior: 'wait' })

    let failed = false
    await page.route('**/api/v1/work/views/*/run', async route => {
      if (failed || route.request().postDataJSON()?.limit !== 25) return route.continue()
      failed = true
      await route.fulfill({ status: 503, json: { success: false, code: 'Unavailable' } })
    })
    await app.getByRole('tab', { name: 'Backlog' }).click()
    const error = app.locator('.kanban-view-notice[role="alert"]')
    await error.waitFor()
    expect(await error.textContent()).toMatch(/work/i)
    await error.getByRole('button', { name: 'Retry' }).click()
    await app.getByRole('table', { name: 'Backlog issues' }).waitFor()
    await error.waitFor({ state: 'hidden' })
    await go(release.empty)
    await app.getByText('No issues on this board.', { exact: true }).waitFor()
  } finally {
    await context.close()
  }
}, 40_000)
