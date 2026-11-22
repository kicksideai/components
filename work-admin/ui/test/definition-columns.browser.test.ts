// @vitest-environment node
// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'

it('aligns kind cells with nonzero dimensions in a browser for short and long titles', async () => {
  const externalUrl = process.env.WORK_ADMIN_FIXTURE_URL
  const server = externalUrl ? undefined : await createServer({
    configFile: false,
    root: process.cwd(),
    plugins: [vue({ template: { compilerOptions: { isCustomElement: tag => tag.startsWith('wc-') } } })],
    resolve: { dedupe: ['vue'] },
    server: { host: '127.0.0.1', port: 0 },
  })
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined
  try {
    await server?.listen()
    browser = await chromium.launch()
    const page = await browser.newPage({ viewport: { width: 1500, height: 900 } })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(new URL('/test/definition-columns.html', externalUrl || server!.resolvedUrls!.local[0]).href)
    const rows = page.locator('.work-definition-head')
    try { await rows.first().waitFor({ timeout: 10000 }) } catch (error) { throw new Error(errors.join('\n') || String(error)) }
    expect(await rows.count()).toBe(4)
    for (const width of [1500, 1100]) {
      await page.setViewportSize({ width, height: 900 })
      const cells = await rows.locator('.work-definition-kind').evaluateAll(elements => elements.map(element => {
        const { left, width, height } = element.getBoundingClientRect()
        return { left, width, height }
      }))
      for (const cell of cells) {
        expect(cell.width).toBeGreaterThan(0)
        expect(cell.height).toBeGreaterThan(0)
        expect(cell.left).toBeCloseTo(cells[0].left, 1)
      }
    }
  } finally {
    await browser?.close()
    await server?.close()
  }
}, 30000)
