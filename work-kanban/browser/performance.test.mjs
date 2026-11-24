// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { afterAll, beforeAll, expect, test } from 'vitest'

const origin = 'http://localhost:' + process.env.KANBAN_FIRE_PORT
const fixtureOrigin = 'http://127.0.0.1:' + (process.env.KANBAN_FIRE_HTTP_PORT ?? process.env.KANBAN_FIRE_PORT)
const { chromium } = createRequire(import.meta.url)(process.env.KANBAN_FIRE_PLAYWRIGHT)
const stress = JSON.parse(await readFile(process.env.KANBAN_FIRE_FIXTURE, 'utf8'))
const { after: release } = JSON.parse(await readFile(new URL('../.run/visual.json', import.meta.url), 'utf8'))
const phase = process.env.KANBAN_BENCH_BASELINE ? 'before' : 'after'
let browser
beforeAll(async () => { browser = await chromium.connect(process.env.KANBAN_FIRE_WS) })
afterAll(async () => { await browser?.close() })

const cases = [['stress', stress.board], ['release', release.main]]
const frame = node => node.evaluate(el => new Promise(resolve => {
  const window = el.ownerDocument.defaultView
  window.requestAnimationFrame(() => window.requestAnimationFrame(resolve))
}))
async function open(board) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce',
    storageState: { cookies: [], origins: [{ origin, localStorage: [
      { name: '@wippy_token_info', value: JSON.stringify({ token: process.env.KANBAN_FIRE_OWNER }) },
    ] }] },
  })
  await context.addInitScript(() => {
    const metrics = window.kanbanBrowserMetrics = { firstCard: 0, shifts: [], tasks: [], interaction: null }
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue
        metrics.shifts.push([entry.startTime, entry.value, entry.sources.map(({ node, previousRect, currentRect }) =>
          [node?.className ?? null, previousRect.toJSON(), currentRect.toJSON()])])
      }
    }).observe({ type: 'layout-shift', buffered: true })
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) metrics.tasks.push([entry.startTime, entry.duration])
    }).observe({ type: 'longtask', buffered: true })
    const attach = Element.prototype.attachShadow
    Element.prototype.attachShadow = function (options) {
      const root = attach.call(this, options)
      if (this.localName !== 'kickside-work-kanban') return root
      const observer = new MutationObserver(() => {
        if (!root.querySelector('.kanban-card')) return
        observer.disconnect()
        requestAnimationFrame(() => requestAnimationFrame(() => { metrics.firstCard = performance.timeOrigin + performance.now() }))
      })
      observer.observe(root, { childList: true, subtree: true })
      return root
    }
  })
  const page = await context.newPage()
  const requests = []
  const resources = []
  const errors = []
  page.on('request', request => {
    const path = new URL(request.url()).pathname
    if (path.startsWith('/api/v1/work/')) requests.push(path.split('/').at(-1))
  })
  page.on('requestfinished', request => {
    const url = new URL(request.url())
    const { startTime, responseEnd } = request.timing()
    resources.push({ path: url.pathname, host: url.hostname, startTime, responseEnd })
  })
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(origin + '/work-kanban/board/' + board, { waitUntil: 'domcontentloaded' })
  const app = page.frameLocator('iframe').first().locator('kickside-work-kanban')
  const card = app.locator('.kanban-card-title').first()
  await card.waitFor()
  await frame(card)
  return { context, page, app, card, requests, resources, errors }
}

function writeEvidence(name, metrics) {
  return writeFile(join(process.env.KANBAN_FIRE_EVIDENCE, `perf-${phase}-${name}.json`), JSON.stringify(metrics, null, 2) + '\n')
}

function cls(shifts) {
  let score = 0
  let max = 0
  let start = -Infinity
  let last = -Infinity
  for (const [time, value] of shifts) {
    if (time - last > 1000 || time - start > 5000) { start = time; score = 0 }
    last = time
    score += value
    max = Math.max(max, score)
  }
  return max
}

test.each(cases)('%s board meets first paint, switch, panel and scroll budgets', async (name, board) => {
  const { context, page, app, card, requests, resources, errors } = await open(board)
  const metrics = { switches: {}, requests: {}, errors }
  async function measure(label, action, selector, { absent = false, title } = {}) {
    const from = requests.length
    await app.evaluate((host, { selector, absent, title }) => {
      const root = host.shadowRoot
      window.kanbanBrowserMetrics.interaction = new Promise(resolve => {
        root.addEventListener('click', event => {
          const ready = () => {
            if (title && root.querySelector('.kanban-board-picker')?.getAttribute('title') !== title) return false
            const element = root.querySelector(selector)
            return absent ? !element : !!element?.getClientRects().length
          }
          // Checked once per frame: a layout read per DOM mutation would add the probe's own work to the interaction.
          const complete = () => {
            if (!ready()) return requestAnimationFrame(complete)
            requestAnimationFrame(() => requestAnimationFrame(() => resolve(performance.now() - event.timeStamp)))
          }
          requestAnimationFrame(complete)
        }, { capture: true, once: true })
      })
    }, { selector, absent, title })
    await action()
    metrics.switches[label] = Math.round(await app.evaluate(() => Promise.race([
      window.kanbanBrowserMetrics.interaction,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Interaction did not paint')), 12000)),
    ])))
    metrics.requests[label] = requests.slice(from)
  }
  const tab = name => app.getByRole('tab', { name, exact: true })
  const picker = app.getByRole('combobox', { name: 'Board switcher' })
  async function boardOption(title) {
    await picker.click()
    await app.getByRole('searchbox', { name: 'Search boards' }).fill(title)
    const option = app.getByRole('option', { name: title, exact: true })
    while (!(await option.isVisible())) {
      const more = app.getByRole('button', { name: 'Load more boards' })
      await more.click({ timeout: 5000 })
      await more.evaluate(node => new Promise(resolve => node.ownerDocument.defaultView.requestAnimationFrame(resolve))).catch(() => {})
    }
    return option
  }
  try {
    const navigation = await page.evaluate(() => performance.timeOrigin)
    const firstCard = await app.evaluate(() => window.kanbanBrowserMetrics.firstCard)
    metrics.firstCardMs = Math.round(firstCard - navigation)
    metrics.coldNetwork = resources.map(({ path, host, startTime, responseEnd }) => ({
      path, host, start: Math.round(startTime - navigation), duration: Math.round(responseEnd),
    })).filter(resource => resource.start <= metrics.firstCardMs).sort((a, b) => a.start - b.start)
    expect.soft(metrics.firstCardMs).toBeGreaterThan(0)
    expect.soft(metrics.firstCardMs).toBeLessThanOrEqual(2000)
    const backlog = '.kanban-backlog-table table'
    const cardTitle = '.kanban-card-title'
    await measure('firstBacklog', () => tab('Backlog').click(), backlog)
    await measure('warmBoardTab', () => tab('Board').click(), cardTitle)
    await measure('warmBacklog', () => tab('Backlog').click(), backlog)
    for (const [name, selector] of [
      ['Sprints', '.kanban-sprints [data-sprint]'],
      ['Search', '.kanban-search input[type="search"]'],
    ]) {
      await measure('first' + name, () => tab(name).click(), selector)
      await tab('Board').click()
      await card.waitFor()
      await measure('warm' + name, () => tab(name).click(), selector)
    }
    await tab('Board').click()
    await card.waitFor()
    const heading = '.kanban-issue-title'
    let finishDetail
    const detailGate = new Promise(resolve => { finishDetail = resolve })
    let detailReads = 0
    const itemRead = `**/api/v1/work/boards/${board}/get`
    await page.route(itemRead, async route => {
      detailReads++
      await detailGate
      await route.continue()
    })
    try {
      const title = (await card.textContent()).trim()
      await card.hover()
      await expect.poll(() => detailReads).toBe(1)
      await measure('openIssue', () => card.click(), heading)
      expect.soft((await app.locator(heading).textContent()).trim()).toBe(title)
      expect.soft(detailReads).toBe(1)
      expect.soft(await app.getByRole('region', { name: 'Description', exact: true }).count()).toBe(0)
    } finally {
      finishDetail()
      await page.unrouteAll({ behavior: 'wait' })
    }
    await app.getByRole('region', { name: 'Description', exact: true }).waitFor()
    const close = app.getByRole('button', { name: 'Close issue details' })
    await measure('closeIssue', () => close.click(), heading, { absent: true })
    const switchTitle = name === 'release' ? '00 Release Operations Stress' : 'Release Operations'
    const title = name === 'release' ? 'Release Operations' : '00 Release Operations Stress'
    await (await boardOption(switchTitle)).click()
    await page.waitForURL(url => !url.pathname.includes(board))
    await card.waitFor()
    const selected = await boardOption(title)
    await measure('warmBoardSwitch', () => selected.click(), cardTitle, { title })
    await page.waitForURL(url => url.pathname.endsWith('/' + board))
    const findings = await app.locator('.kanban-board-viewport').evaluate(async viewport => {
      const metrics = window.kanbanBrowserMetrics
      const start = performance.now()
      const lane = viewport.querySelector('.kanban-column-body')
      const height = lane.scrollHeight - lane.clientHeight
      const width = viewport.scrollWidth - viewport.clientWidth
      for (let index = 0; index < 120; index++) {
        await new Promise(requestAnimationFrame)
        lane.scrollTop = height * (index % 15) / 15
        viewport.scrollLeft = width * (index % 30) / 30
      }
      await new Promise(requestAnimationFrame)
      return { scrollLongTasks: metrics.tasks.filter(([time, duration]) => time >= start && duration > 50), shifts: metrics.shifts }
    })
    metrics.cls = cls(findings.shifts)
    metrics.layoutShifts = findings.shifts
    metrics.scrollLongTasks = findings.scrollLongTasks
    for (const key of ['warmBoardTab', 'warmBacklog', 'warmSprints', 'warmSearch', 'warmBoardSwitch']) {
      expect.soft(metrics.switches[key], key).toBeLessThanOrEqual(300)
      for (const read of ['get_schema', 'list_views']) {
        expect.soft(metrics.requests[key].filter(path => path === read).length, key + ' ' + read)
          .toBeLessThanOrEqual(key === 'warmBoardSwitch' ? 1 : 0)
      }
    }
    expect.soft(metrics.switches.warmBoardTab).toBeLessThanOrEqual(50)
    expect.soft(metrics.requests.warmBoardTab.filter(path => ['query', 'run', 'get_schema', 'list_views'].includes(path))).toEqual([])
    expect.soft(metrics.switches.openIssue).toBeLessThanOrEqual(100)
    expect.soft(metrics.scrollLongTasks).toEqual([])
    expect.soft(metrics.cls).toBeLessThanOrEqual(0.01)
    expect.soft(errors).toEqual([])
  } finally {
    await writeEvidence(name, metrics)
    await context.close()
  }
}, 90_000)

test.each(cases)('%s heap stays flat over ten minutes of live updates', async (name, board) => {
  const { context, page, app, requests } = await open(board)
  const metrics = { heap: [], lastVisibleMs: null }
  const update = async (item, title, key, restoring = false) => {
    const response = await fetch(fixtureOrigin + '/api/v1/work/boards/' + board + '/apply', {
      method: 'POST',
      headers: { authorization: 'Bearer ' + process.env.KANBAN_FIRE_WRITER, 'content-type': 'application/json' },
      body: JSON.stringify({ key, mode: 'atomic', ops: [{ op: 'set', item, values: { title } }] }),
    })
    const reply = await response.json()
    const outcome = reply.data?.outcomes?.[0]
    if (!response.ok || outcome?.status !== 'applied' && !(restoring && outcome?.status === 'unchanged')) {
      throw new Error(`Live update was not applied (${response.status}, ${outcome?.status ?? reply.code ?? 'unknown'}, ${outcome?.findings?.map(finding => finding.code).join(', ') ?? ''})`)
    }
  }
  try {
    const cdp = await context.newCDPSession(page)
    const card = app.locator('.kanban-card[data-card-id]').first()
    const originalTitle = (await card.locator('.kanban-card-title').textContent()).trim()
    const item = await card.getAttribute('data-card-id')
    const id = crypto.randomUUID()
    const start = performance.now()
    const sample = async () => {
      await cdp.send('HeapProfiler.collectGarbage')
      const { usedSize } = await cdp.send('Runtime.getHeapUsage')
      metrics.heap.push({ elapsedMs: Math.round(performance.now() - start), usedBytes: usedSize })
    }
    const reads = requests.length
    try {
      await sample()
      for (let i = 1; i <= 1000; i++) {
        const delay = start + i * 600 - performance.now()
        if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay))
        const title = `Live browser benchmark ${id.slice(0, 8)} ${i}`
        await update(item, title, id + '-' + i)
        if (i % 100 !== 0) continue
        const commit = performance.now()
        await app.locator(`[data-card-id="${item}"] .kanban-card-title`).getByText(title, { exact: true })
          .waitFor({ timeout: 2000 })
        metrics.lastVisibleMs = Math.round(performance.now() - commit)
        await sample()
      }
    } finally {
      await update(item, originalTitle, id + '-restore', true)
      metrics.reads = requests.slice(reads).reduce((counts, path) => {
        counts[path] = (counts[path] ?? 0) + 1
        return counts
      }, {})
    }
    const settled = metrics.heap[1].usedBytes
    const budget = Math.max(2 * 1024 * 1024, settled * 0.05)
    for (const { usedBytes } of metrics.heap.slice(2)) expect.soft(usedBytes - settled).toBeLessThanOrEqual(budget)
    expect.soft(metrics.heap.at(-1).elapsedMs).toBeGreaterThanOrEqual(600_000)
    expect.soft(metrics.lastVisibleMs).toBeLessThanOrEqual(2000)
    expect.soft(metrics.reads.get_schema ?? 0).toBe(0)
  } finally {
    await writeEvidence(name + '-live', metrics)
    await context.close()
  }
}, 660_000)
