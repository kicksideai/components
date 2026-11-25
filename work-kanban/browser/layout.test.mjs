// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { afterAll, beforeAll, expect, test } from 'vitest'

const origin = 'http://localhost:' + process.env.KANBAN_FIRE_PORT
const { after: { main: board } } = JSON.parse(await readFile(new URL('../.run/visual.json', import.meta.url)))
const route = '/work-kanban/board/' + board
let browser

beforeAll(async () => {
  const { chromium } = createRequire(import.meta.url)(process.env.KANBAN_FIRE_PLAYWRIGHT)
  browser = await chromium.connect(process.env.KANBAN_FIRE_WS)
})
afterAll(async () => { await browser?.close() })

const button = (root, name) => root.getByRole('button', { name, exact: true })

async function openBoard(page, scheme) {
  await page.addInitScript(marker => {
    if (window.top === window && location.pathname === '/login') {
      localStorage.setItem('@wippy_token_info', JSON.stringify({ token: marker }))
    }
  }, process.env.KANBAN_FIRE_OWNER)
  await page.goto(origin + '/login', { waitUntil: 'domcontentloaded' })
  await page.goto(origin + route, { waitUntil: 'domcontentloaded' })
  const shell = page.frameLocator('iframe').first()
  const app = shell.locator('kickside-work-kanban')
  await app.locator('.kanban-card').first().waitFor()
  const close = button(shell, 'Close onboarding')
  if (await close.isVisible()) await close.click()
  const dark = () => app.evaluate(element => {
    const toolbar = element.shadowRoot.querySelector('.kanban-head')
    const probe = document.createElement('span')
    probe.style.color = 'var(--p-content-background)'
    toolbar.append(probe)
    const channels = getComputedStyle(probe).color.match(/\d+/g).slice(0, 3).map(Number)
    probe.remove()
    return channels.reduce((sum, channel) => sum + channel, 0) < 384
  })
  if (await dark() !== (scheme === 'dark')) {
    const nav = button(shell, 'Open navigation')
    if (await nav.isVisible()) await nav.click()
    await button(shell.getByRole('navigation', { name: 'Main navigation' }), 'System').click()
    await shell.getByRole('tab', { name: 'Appearance', exact: true }).click()
    await button(shell.getByRole('group', { name: 'Color scheme' }), scheme === 'dark' ? 'Dark' : 'Light').click()
    await page.goto(origin + route, { waitUntil: 'domcontentloaded' })
    await app.locator('.kanban-card').first().waitFor()
  }
  await expect.poll(dark).toBe(scheme === 'dark')
  return app
}

async function measure(app) {
  return app.evaluate(element => {
    const root = element.shadowRoot
    const node = selector => root.querySelector(selector)
    const all = selector => Array.from(root.querySelectorAll(selector))
    const canvas = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
    const rgb = color => {
      canvas.clearRect(0, 0, 1, 1)
      canvas.fillStyle = color
      canvas.fillRect(0, 0, 1, 1)
      return Array.from(canvas.getImageData(0, 0, 1, 1).data).slice(0, 3)
    }
    const box = el => {
      const { x, y, width, height, right } = el.getBoundingClientRect()
      return { x, y, width, height, right }
    }
    const control = el => {
      const icon = el.querySelector('svg')
      return { ...box(el), icon: icon && { ...box(icon), rgb: rgb(getComputedStyle(icon).color) } }
    }
    const viewport = node('.kanban-board-viewport')
    const head = node('.kanban-head')
    const drawer = node('.kanban-issue-header')
    return {
      head: { ...box(head), visible: getComputedStyle(head).visibility === 'visible' },
      picker: box(node('.kanban-board-picker')),
      tabStrip: { ...box(node('.kanban-tabs')), scrollWidth: node('.kanban-tabs').scrollWidth },
      tabs: all('.kanban-tabs [role="tab"]').map(box),
      controls: [...head.querySelectorAll('.kx-head-actions button')].map(control),
      header: box(head),
      refresh: control(node('.kanban-head [aria-label="Refresh issues"]')),
      createLabel: node('.kanban-head .kx-head-actions > button:last-of-type').textContent.trim(),
      viewport: { ...box(viewport), clientWidth: viewport.clientWidth, scrollWidth: viewport.scrollWidth, scroll: viewport.scrollLeft },
      columns: all('.kanban-column').map(el => ({ state: el.dataset.state, ...box(el) })),
      keys: all('.kanban-card-key').map(el => {
        const range = document.createRange()
        range.selectNodeContents(el)
        return { key: el.textContent.trim(), width: box(el).width, textWidth: range.getBoundingClientRect().width }
      }),
      drawer: drawer && { ...box(drawer), rgb: rgb(getComputedStyle(drawer).backgroundColor), buttons: [...drawer.querySelectorAll('button')].map(control) },
    }
  })
}

function checkRow(result) {
  expect.soft(result.tabs[0].right).toBeLessThanOrEqual(result.tabStrip.right + 1)
  expect.soft(result.header.y + result.header.height).toBeLessThanOrEqual(result.tabStrip.y + 1)
  expect.soft(result.tabStrip.x).toBe(result.header.x)
  expect.soft(result.tabStrip.right).toBe(result.header.right)
  expect.soft(result.controls.length).toBeGreaterThan(1)
  for (const control of result.controls) {
    expect.soft(control.height).toBe(result.refresh.height)
    expect.soft(control.y + control.height / 2).toBeCloseTo(result.refresh.y + result.refresh.height / 2)
  }
}

function checkBoard(result, width) {
  expect.soft(result.columns.length).toBeGreaterThan(0)
  expect.soft(Math.min(...result.columns.map(column => column.width))).toBeGreaterThanOrEqual(width === 390 ? 260 : 216)
  if (width === 390) expect.soft(result.viewport.scrollWidth).toBeGreaterThan(result.viewport.clientWidth)
  expect.soft(result.keys.length).toBeGreaterThan(0)
  expect.soft(result.keys.filter(key => key.textWidth > key.width + 0.5)).toEqual([])
}

function contrast(foreground, background) {
  const luminance = rgb => {
    const channels = rgb.map(value => {
      const channel = Number(value) / 255
      return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4
    })
    return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2]
  }
  const levels = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (levels[0] + .05) / (levels[1] + .05)
}

test.each([[1440, 'light'], [1440, 'dark'], [390, 'light'], [390, 'dark']])(
  'keeps native header and tabs, readable keys and standard issue actions at %i px in %s', async (width, scheme) => {
    const context = await browser.newContext({
      viewport: { width, height: width === 390 ? 844 : 900 }, colorScheme: scheme, reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const file = (name, ext) => join(process.env.KANBAN_FIRE_EVIDENCE, 'split-' + name + '-' + width + '-' + scheme + '.' + ext)
    try {
      const app = await openBoard(page, scheme)
      const card = app.locator('.kanban-card[data-key="ROPS-13"]')
      await card.getByRole('img', { name: 'Samira Chen', exact: true }).waitFor()
      const closed = await measure(app)
      await page.screenshot({ path: file('board', 'png') })
      await card.locator('.kanban-card-title').click()
      const drawer = app.locator('.kanban-issue-drawer')
      await button(drawer, 'Open full page').waitFor()
      const opened = await measure(app)
      await page.mouse.move(0, 0)
      await page.screenshot({ path: file('drawer', 'png') })
      await writeFile(file('metrics', 'json'), JSON.stringify({ closed, opened }, null, 2))
      expect.soft(opened.head.visible).toBe(true)
      expect.soft(opened.head.height).toBe(closed.head.height)
      expect.soft(opened.picker.x).toBe(closed.picker.x)
      expect.soft(opened.tabs[0].x).toBe(closed.tabs[0].x)
      for (const result of [closed, opened]) {
        checkRow(result)
        checkBoard(result, width)
      }
      expect.soft(opened.createLabel).toBe('Create issue')
      expect.soft(closed.createLabel).toBe('Create issue')
      if (width === 390) expect.soft(opened.drawer.y).toBeCloseTo(opened.tabStrip.y + opened.tabStrip.height)
      expect.soft(opened.drawer.buttons).toHaveLength(3)
      for (const action of opened.drawer.buttons) {
        const refresh = opened.refresh
        expect.soft(action.height).toBe(closed.refresh.height)
        expect.soft(action.width).toBe(closed.refresh.width)
        expect.soft(action.icon?.width).toBe(refresh.icon?.width)
        expect.soft(action.icon?.rgb).toEqual(refresh.icon?.rgb)
        if (action.icon) expect.soft(contrast(action.icon.rgb, opened.drawer.rgb)).toBeGreaterThanOrEqual(4.5)
      }
      const filter = button(app, 'Filter')
      await filter.click()
      const filterPopover = app.getByRole('dialog', { name: 'Issue filters' })
      await filterPopover.waitFor()
      const filterBox = await filterPopover.boundingBox()
      expect.soft(filterBox.x).toBeGreaterThanOrEqual(0)
      expect.soft(filterBox.x + filterBox.width).toBeLessThanOrEqual(width)
      expect(errors).toEqual([])
    } finally {
      await context.close()
    }
  }, 65_000,
)

test.each([1120, 390])('reveals a deep-linked issue in an offscreen column at %i px', async width => {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
  const page = await context.newPage()
  try {
    const app = await openBoard(page, 'light')
    const viewport = app.locator('.kanban-board-viewport')
    await viewport.evaluate(el => { el.scrollLeft = el.scrollWidth })
    const card = app.locator('[data-state="blocked"] .kanban-card').first()
    await card.waitFor()
    const id = await card.getAttribute('data-card-id')
    await page.goto(origin + route + '/issue/' + id, { waitUntil: 'domcontentloaded' })
    await button(app.locator('.kanban-issue-drawer'), 'Open full page').waitFor()
    await expect.poll(async () => {
      const { viewport, columns } = await measure(app)
      const lane = columns.find(column => column.state === 'blocked')
      return !!lane && viewport.scroll > 0 && lane.x >= viewport.x - 1 && lane.right <= viewport.right + 1
    }).toBe(true)
    await writeFile(join(process.env.KANBAN_FIRE_EVIDENCE, 'split-reveal-' + width + '.json'),
      JSON.stringify(await measure(app), null, 2))
  } finally {
    await context.close()
  }
}, 50_000)
