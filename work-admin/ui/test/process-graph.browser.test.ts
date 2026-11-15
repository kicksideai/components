// @vitest-environment node
// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterAll, beforeAll, expect, it } from 'vitest'
import { chromium, type Browser, type Page } from 'playwright'
import { createServer, type ViteDevServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

let server: ViteDevServer
let browser: Browser

beforeAll(async () => {
  // Other browser fixtures use different Vite configs; do not invalidate their dependencies.
  server = await createServer({ configFile: false, root: process.cwd(), cacheDir: 'node_modules/.vite-process-graph-browser', plugins: [vue()], server: { host: '127.0.0.1', port: 0 } })
  await server.listen()
  browser = await chromium.launch()
}, 60000)

afterAll(async () => {
  await browser?.close()
  await server?.close()
})

const cases = ['light', 'dark'].flatMap(theme => [1390, 552].flatMap(width =>
  ['small', 'branching', 'looping', 'large', 'parallel'].map(name => ({ theme, width, name }))))

async function throttle(page: Page) {
  if (process.env.WORK_ADMIN_CPU_THROTTLE) {
    const session = await page.context().newCDPSession(page)
    await session.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.WORK_ADMIN_CPU_THROTTLE) })
  }
}

it.each(['Fit', 'resize'])('fits branching geometry in the first DOM update after %s, before resize notification', async action => {
  const page = await browser.newPage({ viewport: { width: action === 'Fit' ? 552 : 1390, height: 900 } })
  try {
    await throttle(page)
    await page.goto(`${server.resolvedUrls!.local[0]}test/process-graph.html?process=branching`)
    const canvas = page.getByLabel('Process map', { exact: true })
    const svg = canvas.locator(':scope > svg')
    const waitForViewport = () => expect.poll(() => svg.evaluate(element => {
      const box = (element as SVGSVGElement).viewBox.baseVal
      const rect = element.getBoundingClientRect()
      return Math.abs(box.width / box.height - rect.width / rect.height)
    })).toBeLessThan(.000001)
    await waitForViewport()
    if (action === 'resize') {
      await canvas.press('0')
      await waitForViewport()
    }
    // Mutation observers run after Vue commits the Fit update, before the browser
    // delivers the resulting ResizeObserver notification. Read that exact frame.
    const geometry = await canvas.evaluate((element, action) => new Promise<{ bottom: number; height: number; viewBox: string | null }>(resolve => {
      const svg = element.querySelector('svg')!
      const observer = new MutationObserver(() => {
        observer.disconnect()
        const rect = svg.getBoundingClientRect()
        resolve({
          bottom: Math.max(...Array.from(svg.querySelectorAll('.work-state-card'), card => card.getBoundingClientRect().bottom - rect.top)),
          height: rect.height,
          viewBox: svg.getAttribute('viewBox'),
        })
      })
      observer.observe(svg, { attributes: true, attributeFilter: ['viewBox', 'style'] })
      if (action === 'Fit') element.dispatchEvent(new KeyboardEvent('keydown', { key: '0', bubbles: true }))
      else (element as HTMLElement).style.width = '552px'
    }), action)
    expect(geometry.bottom, JSON.stringify(geometry)).toBeLessThanOrEqual(geometry.height + 1)
  } finally {
    await page.close()
  }
}, 30000)

it.each(cases)('renders real diagram geometry for $name in $theme at $width px', async ({ theme, width, name }) => {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  try {
    await throttle(page)
    await page.goto(`${server.resolvedUrls!.local[0]}test/process-graph.html?process=${name}&theme=${theme}`)
    const canvas = page.getByLabel('Process map', { exact: true })
    await canvas.waitFor()
    await canvas.press('0')
    const cards = page.locator('.work-state-card')
    expect(await cards.count()).toBe(await page.evaluate(() => (window as unknown as { fixtureStateCount: number }).fixtureStateCount))
    const geometry = await cards.evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect()
      const svg = element.closest('svg')!.getBoundingClientRect()
      return { x: rect.x - svg.x, y: rect.y - svg.y, width: rect.width, height: rect.height, availableWidth: svg.width, availableHeight: svg.height }
    }))
    for (const card of geometry) {
      expect(card.width).toBeGreaterThan(100)
      expect(card.height).toBeGreaterThan(45)
      expect(card.x).toBeGreaterThanOrEqual(-1)
      expect(card.y).toBeGreaterThanOrEqual(-1)
      expect(card.x + card.width).toBeLessThanOrEqual(card.availableWidth + 1)
      expect(card.y + card.height).toBeLessThanOrEqual(card.availableHeight + 1)
    }
    for (let i = 0; i < geometry.length; i++) for (const other of geometry.slice(i + 1)) {
      const card = geometry[i]
      expect(card.x < other.x + other.width && card.x + card.width > other.x && card.y < other.y + other.height && card.y + card.height > other.y).toBe(false)
    }
    expect(await page.locator('.work-node-name').first().evaluate(element => getComputedStyle(element).fill)).not.toBe('rgb(0, 0, 0)')
    if (process.env.WORK_ADMIN_SCREENSHOTS) {
      await mkdir(process.env.WORK_ADMIN_SCREENSHOTS, { recursive: true })
      await canvas.screenshot({ path: resolve(process.env.WORK_ADMIN_SCREENSHOTS, `${name}-${theme}-${width}.png`) })
    }
    expect(errors).toEqual([])
  } finally {
    await page.close()
  }
}, 30000)
