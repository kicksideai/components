// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
// Runs on Fire against the isolated KickSide host and six prepared catalogs.
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const origin = process.env.PIM_TEST_ORIGIN ?? 'http://localhost:19496'
const input = []
for await (const chunk of process.stdin) input.push(chunk)
const session = Buffer.concat(input).toString('utf8').trim()
assert.ok(session, 'An isolated administrator session is required')

const cases = [
  { key: 'failed', catalog: 'Supplier import', title: 'Supplier import', status: 'Setup failed',
    cause: /restore a compatible package/i, action: 'Review references', manifest: 'failure' },
  { key: 'degraded', catalog: 'Certificate checks', title: 'Certificate checks', status: 'Background update paused',
    cause: /background worker stopped/i, action: 'Reset background updates', manifest: 'degraded', projection: 'degraded_replica' },
  { key: 'misconfigured', catalog: 'Supplier validation', title: 'Supplier validation', status: 'Configuration needed',
    cause: /certificate issuer is required/i, manifest: 'configuration' },
  { key: 'history-pruned', catalog: 'Supplier audit', title: 'Supplier audit', status: 'Reset required',
    cause: /history this background update needs was removed/i, action: 'Reset background updates', manifest: 'history', projection: 'history_replica' },
  { key: 'uninstalled', catalog: 'Supplier directory', title: 'Supplier directory', status: 'Uninstalled · still referenced',
    cause: /package was removed/i, action: 'Review references', manifest: 'uninstalled' },
  { key: 'deletion-binding-absent', catalog: 'Supplier export', title: 'Supplier export', status: 'Uninstalled · still referenced',
    cause: /package was removed/i, action: 'Review references', manifest: 'missing' },
]

const button = (scope, name) => scope.getByRole('button', { name, exact: true })
const tab = (scope, name) => scope.getByRole('tab', { name, exact: true })
const errorText = error => error.message.replaceAll(session, '[redacted]').split('\n').filter(Boolean).slice(0, 11).join(' | ')
const layouts = [[1440, 'light'], [1440, 'dark'], [390, 'light'], [390, 'dark']]
const screenshots = new URL('full-shell-shots/', import.meta.url)
await mkdir(screenshots, { recursive: true })
const browser = await chromium.launch()
let failures = 0

async function capture(page, name) {
  await page.screenshot({ path: new URL(name + '.png', screenshots).pathname, animations: 'disabled', fullPage: true })
}

async function paint(locator) {
  await locator.evaluate(async node => {
    await node.ownerDocument.fonts.ready
    const view = node.ownerDocument.defaultView
    await new Promise(resolve => view.requestAnimationFrame(() => view.requestAnimationFrame(resolve)))
  })
}

async function inspectHost(buttonLocator, theme) {
  const style = await buttonLocator.evaluate(node => {
    const view = node.ownerDocument.defaultView
    const computed = view.getComputedStyle(node)
    const root = view.getComputedStyle(node.ownerDocument.documentElement)
    return {
      secureContext: view.isSecureContext,
      prime: node.classList.contains('p-button'),
      padding: parseFloat(computed.paddingInlineStart),
      borderRadius: parseFloat(computed.borderTopLeftRadius),
      font: computed.fontFamily,
      background: computed.getPropertyValue('--p-content-background').trim(),
      dark: view.matchMedia('(prefers-color-scheme: dark)').matches,
      themeClass: node.ownerDocument.documentElement.className,
    }
  })
  assert.ok(style.secureContext && style.prime && style.padding >= 6 && style.borderRadius >= 3, JSON.stringify(style))
  assert.ok(style.background && !/Times New Roman/.test(style.font), JSON.stringify(style))
  assert.equal(style.dark, theme === 'dark')
  return style
}

async function systemTab(shell, name) {
  const target = tab(shell, name)
  if (!await target.isVisible()) {
    const menu = button(shell, 'Open navigation')
    if (await menu.isVisible()) await menu.click()
    const navigation = shell.getByRole('navigation', { name: 'Main navigation' })
    await button(navigation, 'System').click()
  }
  await target.click()
  assert.equal(await target.getAttribute('aria-selected'), 'true')
}

async function dismissModelPrompt(shell) {
  const prompt = shell.getByRole('dialog').filter({ hasText: 'Set up a model' })
  await prompt.waitFor({ timeout: 3000 }).catch(() => {})
  if (await prompt.isVisible()) await button(prompt, 'Cancel').click()
}

async function openCatalog(shell, scenario) {
  await systemTab(shell, 'Catalogs')
  const directory = shell.locator('kickside-pim-admin')
  const back = button(directory, 'Back to catalogs')
  const search = directory.getByRole('searchbox', { name: /^(Search catalogs|Find a catalog)$/ })
  await back.or(search).first().waitFor()
  if (await back.isVisible()) await back.click()
  await search.fill(scenario.catalog + ' catalog')
  await directory.locator('.pim-catalog-row, .pim-rail-row')
    .filter({ hasText: scenario.catalog + ' catalog' }).first().click()
  const settings = directory.locator('kickside-pim-catalog-settings')
  const nav = settings.getByRole('navigation', { name: 'Catalog settings sections' })
  await button(nav, 'Plugins').click()
  return settings
}

function confirmation(page, shell, name) {
  return Promise.any([page, shell].map(async root => {
    const dialog = root.locator('[role="dialog"],[role="alertdialog"],dialog').filter({ hasText: name })
    await dialog.waitFor()
    return dialog
  }))
}

async function verifyState(page, shell, scenario, layout, exercise) {
  const settings = await openCatalog(shell, scenario)
  const row = settings.locator('.pim-definition').filter({
    has: shell.getByText(scenario.title, { exact: true }),
  })
  await row.getByText(scenario.status, { exact: true }).waitFor()
  if (scenario.key !== 'failed') {
    const unavailable = settings.locator('.pim-definition')
      .filter({ has: shell.getByText('Supplier import', { exact: true }) })
    await unavailable.getByText('Unavailable', { exact: true }).waitFor()
    assert.equal(await unavailable.locator('button[aria-expanded]').getAttribute('aria-expanded'), 'false')
  }
  await row.getByText(scenario.cause).waitFor()
  const action = scenario.action ? button(row, scenario.action) : row.getByRole('textbox', { name: /certificate issuer/i })
  await action.waitFor()
  assert.equal(await row.getByText('Enabled', { exact: true }).count(), 0)
  const width = await action.evaluate(element => ({
    row: element.closest('.pim-definition-body').getBoundingClientRect().width,
    action: element.getBoundingClientRect().width,
  }))
  if (scenario.action) assert.ok(width.action < width.row - 16, JSON.stringify(width))
  if (layout.startsWith('390-')) {
    const review = button(settings, 'Review changes')
    const compact = await review.evaluate(node =>
      node.getBoundingClientRect().width < node.closest('.kx-head').getBoundingClientRect().width - 48)
    assert.ok(compact, 'Review changes should use the same compact button as Work Admin')
  }
  const ids = row.getByText(/fixture\.recovery:/)
  assert.equal(await ids.and(row.locator(':visible')).count(), 0, 'Technical IDs must be inside the closed disclosure')
  const style = await inspectHost(action, layout.split('-').at(-1))
  if (scenario.key === 'misconfigured') {
    await row.getByRole('textbox', { name: /certificate issuer/i }).waitFor()
  }
  await row.evaluate(node => node.scrollIntoView({ block: 'center', inline: 'nearest' }))
  await paint(row)
  for (const item of [row.locator('.pim-row-title'), row.getByText(scenario.cause), action]) {
    const visible = await item.evaluate(node => new Promise(resolve => {
      const observer = new IntersectionObserver(([entry]) => {
        observer.disconnect()
        resolve(entry.intersectionRatio >= 0.95)
      })
      observer.observe(node)
    }))
    assert.ok(visible, 'The title, cause and recovery action must fit in the shell capture')
  }
  await capture(page, scenario.key + '-' + layout)

  if (scenario.status.startsWith('Uninstalled') || scenario.key === 'failed') {
    await action.click()
    const dialog = settings.getByRole('dialog', { name: 'Plugin references' })
    await dialog.getByText(scenario.title, { exact: true }).waitFor()
    assert.equal(await dialog.getByText(/fixture\.recovery:/).and(dialog.locator(':visible')).count(), 0)
    if (scenario.key === 'uninstalled') {
      await dialog.getByText('Certificate', { exact: true }).waitFor()
      await dialog.getByText('Approved suppliers', { exact: true }).waitFor()
      const clear = button(dialog, 'Clear catalog app binding')
      await clear.waitFor()
      assert.ok(await clear.evaluate(node => node.getBoundingClientRect().width < node.closest('dialog').getBoundingClientRect().width - 50))
      await paint(dialog)
      await capture(page, 'uninstalled-references-' + layout)
      if (exercise) {
        await button(dialog, 'Clear catalog app binding').click()
        await button(await confirmation(page, shell, 'Clear catalog app binding?'), 'Clear binding').click()
        await button(dialog, 'Review removal').waitFor()
        console.log('PASS clear unavailable catalog app binding through the host confirmation')
      }
    }
    await button(dialog, 'Technical details').click()
    await dialog.getByText('fixture.recovery:' + scenario.manifest, { exact: true }).waitFor()
    await button(dialog, 'Technical details').click()
    if (scenario.key === 'deletion-binding-absent') {
      const response = page.waitForResponse(result => new URL(result.url()).pathname.endsWith('/schema/plan'))
      await button(dialog, 'Review removal').click()
      const rejected = await response
      assert.equal(rejected.status(), 503)
      assert.equal((await rejected.json()).details.code, 'plugin_cleanup_unavailable')
      const alert = settings.getByRole('alert').filter({ hasText: 'Restore the plugin package before removing it.' })
      await alert.waitFor()
      assert.equal(await button(settings, 'Apply changes').count(), 0)
      await alert.scrollIntoViewIfNeeded()
      await paint(alert)
      await capture(page, 'deletion-binding-refusal-' + layout)
      await button(settings, 'Discard').click()
    } else {
      await button(dialog, 'Close').click()
    }
  } else {
    const technical = button(row, 'Technical details')
    await technical.click()
    if (scenario.projection) {
      await row.getByText('fixture.recovery:' + scenario.projection, { exact: true }).waitFor()
    } else {
      await row.getByText('fixture.recovery:' + scenario.manifest, { exact: true }).waitFor()
    }
    await technical.click()
    if (scenario.action === 'Reset background updates') {
      await action.click()
      const confirm = await confirmation(page, shell, 'Reset background updates?')
      await confirm.getByText(/start from a new catalog event/i).waitFor()
      if (exercise) {
        const response = page.waitForResponse(result => new URL(result.url()).pathname.endsWith('/plugins/configure'))
        await button(confirm, scenario.action).click()
        const configured = await response
        assert.equal(configured.status(), 200)
        assert.equal(configured.request().postDataJSON().reset, true)
        await settings.getByText('Background update reset requested.').waitFor()
        console.log(`PASS ${scenario.key} configured reset through the catalog API`)
      } else {
        await button(confirm, 'Cancel').click()
      }
    }
    if (scenario.key === 'misconfigured' && exercise) {
      await row.getByRole('textbox', { name: /certificate issuer/i }).fill('Northstar')
      await button(settings, 'Review changes').click()
      await button(settings.getByRole('dialog', { name: 'Review changes' }), 'Apply changes').click()
      await row.getByText('Enabled', { exact: true }).waitFor()
      assert.equal(await row.getByRole('textbox', { name: /certificate issuer/i }).inputValue(), 'Northstar')
      console.log('PASS real configuration repair returned the plugin to Enabled')
    }
  }
  console.log(`PASS ${scenario.key} ${layout} | ${style.font} | PrimeVue button padding ${style.padding}px | host content ${style.background}`)
}

async function compare(page, shell, layout) {
  await systemTab(shell, 'Settings')
  const settings = shell.locator('kickside-settings')
  await settings.waitFor()
  await settings.getByText('Products', { exact: true }).first().click()
  await settings.getByText(/^Loading(?:…|\.\.\.)$/).first().waitFor({ state: 'hidden' })
  await paint(settings)
  await capture(page, 'system-settings-' + layout)

  await systemTab(shell, 'Work')
  const admin = shell.locator('kickside-work-admin')
  const board = admin.locator('kickside-work-board-settings')
  const entry = button(admin, 'Settings for Supplier reviews')
  await entry.or(board).first().waitFor()
  if (await entry.isVisible()) await entry.click()
  const rail = board.getByRole('navigation', { name: 'Board settings sections' })
  await button(rail, 'Plugins').click()
  await board.getByRole('heading', { name: 'Board capabilities', exact: true }).waitFor()
  await paint(board)
  await capture(page, 'work-admin-plugins-' + layout)
  console.log('PASS System Settings and Work Plugins comparison ' + layout)
}

try {
  for (const [width, theme] of layouts.filter(([w, t]) => !process.env.PIM_TEST_LAYOUT || process.env.PIM_TEST_LAYOUT === `${w}-${t}`)) {
    const layout = `${width}-${theme}`
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 960 }, colorScheme: theme })
    page.setDefaultTimeout(12000)
    const pageErrors = []
    const fullShellRequests = new Set()
    page.on('pageerror', error => pageErrors.push(error.message.replaceAll(session, '[redacted]')))
    page.on('response', response => {
      if (response.ok()) fullShellRequests.add(new URL(response.url()).pathname)
    })
    const shell = page.frameLocator('iframe').first()
    try {
      await page.goto(origin + '/login')
      await page.evaluate(token => localStorage.setItem('@wippy_token_info', JSON.stringify({ token })), session)
      await page.goto(origin + '/')
      await shell.locator('body').waitFor({ timeout: 35000 })
      await dismissModelPrompt(shell)
      if (process.env.PIM_TEST_CASE === 'comparison' || !process.env.PIM_TEST_CASE) {
        try {
          await compare(page, shell, layout)
        } catch (error) {
          failures++
          console.log(`FAIL comparison ${layout} | ${errorText(error)}`)
          await capture(page, 'comparison-' + layout + '-failed')
        }
      }
      for (const scenario of cases.filter(row => !process.env.PIM_TEST_CASE || row.key === process.env.PIM_TEST_CASE)) {
        try {
          await verifyState(page, shell, scenario, layout, process.env.PIM_EXERCISE === '1' && layout === '390-dark')
        } catch (error) {
          failures++
          console.log(`FAIL ${scenario.key} ${layout} | ${errorText(error)}`)
          await capture(page, scenario.key + '-' + layout + '-failed').catch(() => {})
          await page.goto(origin + '/')
          await dismissModelPrompt(shell)
        }
      }
      assert.deepEqual(pageErrors, [], 'No uncaught errors in the shell')
      if (!process.env.PIM_TEST_CASE) {
        assert.ok(fullShellRequests.has('/kickside-pim-admin/admin.js') && fullShellRequests.has('/kickside-pim-admin/settings.js'),
          'The host served both PIM Admin entry points')
      }
    } catch (error) {
      failures++
      console.log(`FAIL shell ${layout} | ${errorText(error)}`)
      await capture(page, 'shell-' + layout + '-failed').catch(() => {})
    } finally {
      await page.context().close()
    }
  }
} finally {
  await browser.close()
}
process.exitCode = failures ? 1 : 0
