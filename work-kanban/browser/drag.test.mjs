// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { afterAll, beforeAll, expect, test } from 'vitest'

const origin = 'http://localhost:' + process.env.KANBAN_FIRE_PORT
const { board, issues } = JSON.parse(await readFile(process.env.KANBAN_FIRE_FIXTURE, 'utf8'))
const artifacts = process.env.KANBAN_FIRE_EVIDENCE
let browser

beforeAll(async () => {
  const { chromium } = createRequire(import.meta.url)(process.env.KANBAN_FIRE_PLAYWRIGHT)
  browser = await chromium.connect(process.env.KANBAN_FIRE_WS)
}, 20_000)
afterAll(async () => { await browser?.close() })

async function open({ width = 1440, reducedMotion = 'no-preference', boardId = board } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width === 390, reducedMotion })
  const page = await context.newPage()
  await page.addInitScript(marker => {
    if (window.top === window && location.pathname === '/login') {
      localStorage.setItem('@wippy_token_info', JSON.stringify({ token: marker }))
    }
  }, process.env.KANBAN_FIRE_OWNER)
  await page.goto(origin + '/login', { waitUntil: 'domcontentloaded' })
  await page.goto(origin + '/work-kanban/board/' + boardId, { waitUntil: 'domcontentloaded' })
  const shell = page.frameLocator('iframe').first()
  const app = shell.locator('kickside-work-kanban')
  const source = app.locator('[data-state=todo]')
  const target = app.locator('[data-state=doing]')
  const card = source.locator('[data-card-id]').first()
  await card.waitFor({ timeout: 15_000 })
  const id = await card.getAttribute('data-card-id')
  const handle = card.getByRole('button', { name: /^Move / })
  const viewport = app.getByRole('region', { name: 'Workflow board' })
  const placeholder = app.locator('.kanban-drop-slot')
  const lift = app.locator('.kanban-drag-lift')
  return { context, page, app, source, target, id, handle, viewport, placeholder, lift }
}

function center(box) {
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

async function refuseMove(page) {
  let release
  const waiting = new Promise(resolve => { release = resolve })
  await page.route('**/api/v1/work/boards/' + board + '/apply', async route => {
    await waiting
    await route.fulfill({ json: { success: true, data: { outcomes: [{ status: 'rejected', findings: [
      { code: 'rule_failed', message: 'This issue is locked by the release gate.' },
    ] }] } } })
  })
  return release
}

test('lifts under the pointer, opens a ranked slot, settles in place and rolls back a refused move', async () => {
  const { context, page, app, source, target, id, handle, placeholder, lift } = await open()
  const release = await refuseMove(page)
  try {
    const start = center(await handle.boundingBox())
    const first = target.locator('[data-card-id]').first()
    const neighbor = await first.getAttribute('data-card-id')
    const prior = await first.boundingBox()
    await page.mouse.move(start.x, start.y)
    await page.mouse.down()
    await page.mouse.move(start.x - 10, start.y + 8, { steps: 4 })
    await lift.waitFor({ timeout: 1500 })
    await page.screenshot({ path: join(artifacts, 'drag-01-lift.png') })
    const finish = { x: prior.x + prior.width / 2, y: prior.y + 8 }
    await page.mouse.move(finish.x, finish.y, { steps: 14 })
    await target.locator('.kanban-drop-slot').waitFor()
    expect(await target.getAttribute('data-drop-target')).toBe('true')
    await expect.poll(async () => (await first.boundingBox()).y).toBeGreaterThan(prior.y + 50)
    const raised = await lift.boundingBox()
    expect(finish.x).toBeGreaterThanOrEqual(raised.x)
    expect(finish.x).toBeLessThanOrEqual(raised.x + raised.width)
    const slot = await placeholder.boundingBox()
    await page.screenshot({ path: join(artifacts, 'drag-02-target.png') })
    const sent = page.waitForRequest(req => req.url().endsWith('/apply') && req.postDataJSON()?.ops?.[0]?.item === id)
    await page.mouse.up()
    const moved = target.locator('[data-card-id="' + id + '"]')
    await moved.waitFor({ timeout: 1500 })
    const settled = await moved.boundingBox()
    expect(Math.abs(settled.y - slot.y)).toBeLessThanOrEqual(1)
    expect(await source.locator('[data-card-id="' + id + '"]').count()).toBe(0)
    expect((await sent).postDataJSON().ops).toEqual([
      expect.objectContaining({ op: 'transition', item: id }), expect.objectContaining({ op: 'rank', item: id, before: neighbor }),
    ])
    await page.screenshot({ path: join(artifacts, 'drag-03-settle.png') })
    release()
    await app.getByRole('alert').getByText('This issue is locked by the release gate.').waitFor()
    await source.locator('[data-card-id="' + id + '"]').waitFor()
    await lift.waitFor({ state: 'hidden' })
    expect(await target.locator('[data-card-id="' + id + '"]').count()).toBe(0)
    await page.screenshot({ path: join(artifacts, 'drag-04-rollback.png') })
  } finally { release(); await context.close() }
}, 35_000)

test('keyboard pickup previews a destination and Escape restores the handle without writing', async () => {
  const { context, page, target, handle, placeholder, lift } = await open({ reducedMotion: 'reduce' })
  let writes = 0
  page.on('request', req => { if (req.url().endsWith('/apply')) writes++ })
  try {
    await handle.focus()
    await page.keyboard.press('Space')
    await placeholder.waitFor({ timeout: 1500 })
    await page.keyboard.press('ArrowRight')
    await target.locator('.kanban-drop-slot').waitFor()
    expect(await target.getAttribute('data-drop-target')).toBe('true')
    expect(await target.locator('.kanban-row').first().evaluate(node => getComputedStyle(node).transitionDuration)).toBe('0s')
    await page.keyboard.press('Escape')
    await placeholder.waitFor({ state: 'hidden' })
    await lift.waitFor({ state: 'hidden' })
    expect(await handle.evaluate(node => node.getRootNode().activeElement === node)).toBe(true)
    expect(writes).toBe(0)
  } finally { await context.close() }
}, 25_000)

test('keyboard drop keeps the destination position after Work commits and restores handle focus', async () => {
  const write = async (path, data) => {
    const response = await fetch('http://127.0.0.1:' + process.env.KANBAN_FIRE_PORT + '/api/v1/work/boards' + path, {
      method: 'POST', headers: { authorization: 'Bearer ' + process.env.KANBAN_FIRE_OWNER, 'content-type': 'application/json' },
      body: JSON.stringify(data),
    })
    expect(response.ok).toBe(true)
    return (await response.json()).data
  }
  const { board_id: boardId } = await write('', {
    title: 'Keyboard drop ' + crypto.randomUUID().slice(0, 8),
    pack: 'kickside.work.kanban:pack', version: '1.0.0', idempotency_key: crypto.randomUUID(), starter: false,
  })
  const { outcomes: [issue] } = await write('/' + boardId + '/apply', {
    key: crypto.randomUUID(), mode: 'atomic', ops: [{ op: 'create', type: 'epic', values: { title: 'Keyboard drop case' } }],
  })
  const { context, page, target, handle } = await open({ boardId, reducedMotion: 'reduce' })
  try {
    await handle.focus()
    await page.keyboard.press('Space')
    await page.keyboard.press('ArrowRight')
    const slot = target.locator('.kanban-drop-slot')
    await slot.waitFor()
    const before = await slot.boundingBox()
    const result = page.waitForResponse(response => response.url().endsWith('/apply') && response.request().postDataJSON()?.ops?.[0]?.item === issue.item)
    await page.keyboard.press('Space')
    expect((await (await result).json()).data.outcomes[0].status).toBe('applied')
    const placed = target.locator('[data-card-id="' + issue.item + '"]')
    const nextHandle = placed.getByRole('button', { name: /^Move / })
    await expect.poll(() => nextHandle.evaluate(node => node.getRootNode().activeElement === node)).toBe(true)
    expect(Math.abs((await placed.boundingBox()).y - before.y)).toBeLessThanOrEqual(1)
    await page.reload()
    await placed.waitFor()
  } finally { await context.close() }
}, 40_000)

test('touch drag at 390 px scrolls across columns and keeps the card picked up', async () => {
  const { context, page, app, handle, viewport, placeholder, lift } = await open({ width: 390 })
  try {
    const finger = await context.newCDPSession(page)
    const start = center(await handle.boundingBox())
    const bounds = await viewport.boundingBox()
    const touch = (type, point) => finger.send('Input.dispatchTouchEvent', { type, touchPoints: point ? [point] : [] })
    await touch('touchStart', start)
    await touch('touchMove', { x: start.x + 12, y: start.y + 4 })
    await lift.waitFor({ timeout: 1500 })
    await touch('touchMove', { x: bounds.x + bounds.width - 5, y: start.y })
    await expect.poll(() => viewport.evaluate(node => node.scrollLeft)).toBeGreaterThan(70)
    const target = app.locator('[data-drop-target=true]')
    expect(await target.getAttribute('data-state')).not.toBe('todo')
    await target.locator('.kanban-drop-slot').waitFor()
    await touch('touchCancel')
    await lift.waitFor({ state: 'hidden' })
    await placeholder.waitFor({ state: 'hidden' })
  } finally { await context.close() }
}, 25_000)

test('keeps drag frames within 20 ms p95 while scrolling a 5,000-issue board on Fire', async () => {
  expect(issues).toBe(5000)
  const { context, page, source, handle, viewport, lift } = await open()
  const cdp = await context.newCDPSession(page)
  const complete = new Promise(resolve => cdp.once('Tracing.tracingComplete', resolve))
  try {
    const body = source.locator('.kanban-column-body')
    await source.getByRole('button', { name: 'Load more issues', exact: true }).click()
    await expect.poll(() => body.evaluate(node => node.scrollHeight - node.clientHeight)).toBeGreaterThan(100)
    await body.evaluate(node => { node.scrollTop = 0 })
    const bounds = await body.boundingBox()
    const start = center(await handle.boundingBox())
    await cdp.send('Tracing.start', { categories: 'devtools.timeline,blink.user_timing,cc', transferMode: 'ReturnAsStream' })
    let metrics
    try {
      await page.mouse.move(start.x, start.y)
      await page.mouse.down()
      await page.mouse.move(start.x, start.y + 12, { steps: 4 })
      await lift.waitFor({ timeout: 1500 })
      await page.mouse.move(start.x, bounds.y + bounds.height - 12, { steps: 12 })
      const samples = await viewport.evaluate(async node => {
        const frames = []
        let previous = await new Promise(requestAnimationFrame)
        let peak = 0
        for (let i = 0; i < 90; i++) {
          const time = await new Promise(requestAnimationFrame)
          frames.push(time - previous)
          previous = time
          peak = Math.max(peak, node.querySelectorAll('[data-card-id]').length)
        }
        frames.sort((a, b) => a - b)
        return { frames, peak, p95: frames[Math.ceil(frames.length * .95) - 1] }
      })
      expect(await body.evaluate(node => node.scrollTop)).toBeGreaterThan(100)
      metrics = samples
    } finally {
      await page.keyboard.press('Escape')
      await page.mouse.up()
      await cdp.send('Tracing.end')
      const { stream } = await complete
      let trace = ''
      while (true) {
        const part = await cdp.send('IO.read', { handle: stream })
        trace += part.base64Encoded ? Buffer.from(part.data, 'base64').toString() : part.data
        if (part.eof) break
      }
      await cdp.send('IO.close', { handle: stream })
      await writeFile(join(artifacts, 'fire-drag-trace.json'), trace)
    }
    await writeFile(join(artifacts, 'fire-drag-frame-times.json'), JSON.stringify(metrics, null, 2))
    expect(metrics.peak).toBeLessThanOrEqual(150)
    expect(metrics.p95).toBeLessThanOrEqual(20)
  } finally { await context.close() }
}, 40_000)
