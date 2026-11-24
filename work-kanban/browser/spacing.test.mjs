// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { afterAll, beforeAll, expect, test } from 'vitest'

const origin = 'http://localhost:' + process.env.KANBAN_FIRE_PORT
const { after: release } = JSON.parse(await readFile(new URL('../.run/visual.json', import.meta.url), 'utf8'))
const { chromium } = createRequire(import.meta.url)(process.env.KANBAN_FIRE_PLAYWRIGHT)
let browser
beforeAll(async () => { browser = await chromium.connect(process.env.KANBAN_FIRE_WS) })
afterAll(async () => { await browser?.close() })

async function spacing(app, selector) {
  return app.evaluate((element, selector) => {
    const root = element.shadowRoot
    const find = query => root.querySelector(query)
    const box = el => el?.getBoundingClientRect()
    const px = property => parseFloat(property)
    const head = find('.kanban-head')
    const tabs = find('.kanban-tabs')
    const current = find(selector)
    const lane = find('.kanban-column')
    const laneHead = box(find('.kanban-column-head'))
    const first = box(lane?.querySelector('.kanban-card'))
    const next = box(lane?.querySelectorAll('.kanban-card')[1])
    const shell = box(element)
    const area = box(current)
    const css = current && getComputedStyle(current)
    const rule = box(tabs)
    const font = el => {
      if (!el) return null
      const { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } = getComputedStyle(el)
      return { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing }
    }
    const headCss = head && getComputedStyle(head)
    const result = {
      header: head && {
        title: head.querySelector('h1')?.textContent,
        iconWidth: box(head.querySelector('.kx-head-icon'))?.width,
        iconHeight: box(head.querySelector('.kx-head-icon'))?.height,
        top: px(headCss.paddingBlockStart),
        left: px(headCss.paddingInlineStart),
        right: px(headCss.paddingInlineEnd),
        bottom: px(headCss.paddingBlockEnd),
        actionsRight: shell.right - Math.max(...Array.from(head.querySelectorAll('.kx-head-actions button'), node => box(node).right)),
      },
      sharedTabs: !!find('.kanban-tabs.kx-system-tabs'),
      top: css && px(css.paddingBlockStart),
      left: css && px(css.paddingInlineStart),
      right: css && px(css.paddingInlineEnd),
      bottom: css && px(css.paddingBlockEnd),
      fonts: Object.fromEntries(Object.entries({
        header: '.kanban-picker-title', subtitle: '.kanban-head .kx-head-sub', tab: '.kanban-tabs [role="tab"]',
        lane: '.kanban-column-head h2', card: '.kanban-card-title', issueTitle: '.kanban-issue-title', issueLabel: '.kanban-issue-fields dt',
      }).map(([name, query]) => [name, font(find(query))]).filter(([, value]) => !!value)),
      chrome: {
        background: getComputedStyle(find('.kanban-page')).backgroundColor,
        tabRule: getComputedStyle(tabs).borderBottomColor,
        tabRuleWidth: px(getComputedStyle(tabs).borderBottomWidth),
        leftInset: rule.left - shell.left, rightInset: shell.right - rule.right,
      },
    }
    if (!selector.includes('issue')) {
      result.contentLeft = area?.left + result.left - shell.left
      result.contentRight = shell.right - (area?.right - result.right)
      result.ruleToContent = area?.top + result.top - rule?.bottom
    }
    if (selector === '.kanban-views' && lane && first && next) {
      const status = find('.kanban-status-host')
      const statusBox = status?.getClientRects().length ? box(status) : undefined
      result.statusToLanes = statusBox ? box(lane).top - statusBox.bottom : undefined
      result.ruleToLanes = box(lane).top - rule.bottom
      result.laneHeadToCard = first.top - laneHead.bottom
      result.cardToCard = next.top - first.bottom
      result.laneToPageBottom = shell.bottom - box(lane).bottom
      result.laneBottomBorder = px(getComputedStyle(lane).borderBlockEndWidth)
    }
    return result
  }, selector)
}

test.each([[1440, 'light'], [1440, 'dark'], [390, 'light'], [390, 'dark']])(
  'uses the shell gutter and rhythm across views at %i in %s', async (width, colorScheme) => {
    const gutter = width === 390 ? 16 : 24
    const context = await browser.newContext({
      viewport: { width, height: width === 390 ? 844 : 900 },
      colorScheme, reducedMotion: 'reduce',
      storageState: { cookies: [], origins: [{ origin, localStorage: [
        { name: '@wippy_token_info', value: JSON.stringify({ token: process.env.KANBAN_FIRE_OWNER }) },
      ] }] },
    })
    const page = await context.newPage()
    const metrics = {}
    const phase = process.env.KANBAN_BENCH_BASELINE ? 'before' : 'after'
    const capture = name => page.screenshot({
      path: join(process.env.KANBAN_FIRE_EVIDENCE, `spacing-${phase}-${width}-${colorScheme}-${name}.png`),
      animations: 'disabled',
    })
    try {
      await page.goto(origin + '/work-kanban/board/' + release.main, { waitUntil: 'domcontentloaded' })
      const app = page.frameLocator('iframe').first().locator('kickside-work-kanban')
      const card = app.locator('.kanban-card-title').first()
      await card.waitFor()
      await page.evaluate(() => document.fonts.ready)
      await capture('board')
      metrics.board = await spacing(app, '.kanban-views')
      expect.soft(metrics.board.header).toEqual({
        title: 'Kanban', iconWidth: 40, iconHeight: 40, top: gutter, left: gutter, right: gutter, bottom: gutter / 2,
        actionsRight: gutter,
      })
      expect.soft(metrics.board.sharedTabs).toBe(true)
      for (const typography of Object.values(metrics.board.fonts)) expect.soft(typography.fontFamily).toMatch(/^"?Inter\b/)
      expect.soft(metrics.board.chrome.leftInset).toBe(0)
      expect.soft(metrics.board.chrome.rightInset).toBe(0)
      expect.soft(metrics.board.chrome.tabRuleWidth).toBe(1)
      if (metrics.board.statusToLanes === undefined) expect.soft(metrics.board.ruleToLanes).toBeCloseTo(gutter)
      else expect.soft(metrics.board.statusToLanes).toBeCloseTo(gutter / 2)
      expect.soft(metrics.board.laneHeadToCard).toBeCloseTo(gutter / 4)
      expect.soft(metrics.board.cardToCard).toBeCloseTo(gutter / 4)
      expect.soft(metrics.board.laneToPageBottom).toBeCloseTo(gutter)
      expect.soft(metrics.board.laneBottomBorder).toBeGreaterThan(0)
      const caption = await card.evaluate(node => ({ text: node.textContent.trim(), tooltip: node.title }))
      expect.soft(caption.tooltip).toBe(caption.text)
      await card.focus()
      await page.keyboard.press('Enter')
      const titleInPanel = app.locator('.kanban-issue-title')
      await titleInPanel.waitFor()
      await app.getByRole('region', { name: 'Description', exact: true }).waitFor()
      await capture('panel')
      metrics.panel = await spacing(app, '.kanban-issue-header')
      metrics.panelBody = await spacing(app, '.kanban-issue-body')
      await app.getByRole('button', { name: 'Open full page' }).click()
      await capture('issue')
      metrics.issue = await spacing(app, '.kanban-issue-header')
      metrics.issueBody = await spacing(app, '.kanban-issue-body')
      await page.keyboard.press('Escape')
      await titleInPanel.waitFor({ state: 'hidden' })
      for (const [tab, selector] of [['Backlog', '.kanban-views'], ['Sprints', '.kanban-sprints'], ['Search', '.kanban-search']]) {
        await app.getByRole('tab', { name: tab, exact: true }).click()
        const view = app.locator(selector)
        if (!(await view.isVisible())) {
          const external = app.locator(tab === 'Sprints' ? 'kickside-work-sprints' : 'kickside-work-search')
          await view.or(external).first().waitFor({ timeout: 10000 }).catch(() => {})
        }
        const content = await view.count() ? selector : '.kanban-plugin-content'
        metrics[tab.toLowerCase()] = await spacing(app, content)
        await capture(tab.toLowerCase())
      }
      for (const name of ['board', 'backlog', 'sprints', 'search']) {
        const measured = metrics[name]
        expect.soft(measured.contentLeft, name + ' left gutter').toBeCloseTo(gutter)
        expect.soft(measured.contentRight, name + ' right gutter').toBeCloseTo(gutter)
        expect.soft(measured.ruleToContent, name + ' rule to content').toBeCloseTo(gutter)
        expect.soft(measured.bottom, name + ' bottom gutter').toBeCloseTo(gutter)
      }
      for (const name of ['panel', 'issue']) {
        expect.soft(metrics[name].top, name + ' top gutter').toBeCloseTo(gutter)
        for (const box of [metrics[name], metrics[name + 'Body']]) {
          expect.soft(box.left, name + ' left gutter').toBeCloseTo(gutter)
          expect.soft(box.right, name + ' right gutter').toBeCloseTo(gutter)
        }
      }
    } finally {
      await writeFile(join(process.env.KANBAN_FIRE_EVIDENCE, `spacing-${phase}-${width}-${colorScheme}.json`),
        JSON.stringify(metrics, null, 2) + '\n')
      await context.close()
    }
  }, 60_000)
