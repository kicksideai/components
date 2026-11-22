// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const origin = process.env.PIM_TEST_ORIGIN ?? 'http://localhost:19382'
const endpoint = '/api/v1/pim/catalogs/recovery'
const manifest = 'fixture.supplier:plugin'
const projection = 'fixture.supplier:replica'
const diagnostics = (root, text) => root.locator('.kx-disclosure').filter({ hasText: text })
const configSchema = {
  type: 'object',
  properties: { issuer: { type: 'string', title: 'Certificate issuer', minLength: 2 } },
  required: ['issuer'],
}
const issue = (code, message, details = {}) => ({ kind: 'INVALID', code, message, ...details })
const cursor = overrides => ({ last_seq: 81, parked: false, bootstrapping: false, ...overrides })
const ready = {
  plugin: manifest, installed: true, active: true, title: 'Supplier compliance',
  config_schema: configSchema, config: { issuer: 'Northstar' }, requires: [], tools: [],
  lifecycle: { state: 'ready' }, projections: {},
}
const missingRefs = {
  fields: ['supplier.certificate'], scopes: ['fixture.supplier:region'],
  shell_bindings: ['fixture.supplier:catalog_ui'],
  checks: [], plugins: [],
}
async function applyConfiguration(page, button) {
  await button(page, 'Review changes').click()
  const review = page.getByRole('dialog', { name: 'Review changes' })
  await button(review, 'Apply changes').click()
}

const cases = [
  {
    name: 'failed', status: 'Setup failed', action: 'Check status',
    state: { lifecycle: { state: 'failed', error: issue('plugin_interface_version_unsupported', 'The installed package ' + manifest + ' uses interface version 2.') } },
    async verify({ row, state, requests, button }) {
      await row.getByText(/restore a compatible package/i).waitFor()
      await diagnostics(row, manifest).getByText(/uses interface version 2/).waitFor({ state: 'hidden' })
      await button(row, 'Technical details').click()
      await diagnostics(row, manifest).getByText(/uses interface version 2/).waitFor()
      state.plugin = ready
      const reads = requests.schema
      await button(row, 'Check status').click()
      await row.getByText('Enabled', { exact: true }).waitFor()
      assert.ok(requests.schema > reads)
    },
  },
  {
    name: 'degraded', status: 'Background update paused', action: 'Reset background updates',
    state: { projections: { [projection]: cursor({ parked: true, error: 'Supplier mapping crashed in ' + projection + '.' }) } },
    async verify({ row, state, requests, button, page }) {
      await row.getByText(/the background worker stopped/i).waitFor()
      await row.getByText(/last applied position 81/i).waitFor()
      await button(row, 'Technical details').click()
      await diagnostics(row, projection).getByText(/Supplier mapping crashed/).waitFor()
      await page.clock.pauseAt(await page.evaluate(() => Date.now()) + 1_000)
      await button(row, 'Reset background updates').click()
      const dialog = page.getByRole('dialog')
      await button(dialog, 'Reset background updates').click()
      await row.getByText('Catching up', { exact: true }).waitFor()
      assert.deepEqual(requests.configure, [{ plugin: manifest, config: ready.config, reset: true }])
      const catchingUp = requests.schema
      state.plugin = { ...ready, projections: { [projection]: cursor({ last_seq: 100 }) } }
      await page.clock.runFor(10_000)
      await row.getByText('Enabled', { exact: true }).waitFor()
      assert.equal(requests.schema, catchingUp + 1, 'a pending projection should be polled')
      const settled = requests.schema
      await page.clock.runFor(10_000)
      assert.equal(requests.schema, settled, 'settled projections should stop polling')
    },
  },
  {
    name: 'repair-parked-worker', status: 'Background update paused', action: 'Reset background updates',
    state: {
      config_schema: {
        type: 'object',
        properties: { region: { type: 'string' }, crash: { type: 'boolean', title: 'Crash on update' } },
      },
      config: { region: 'EU', crash: true },
      projections: { [projection]: cursor({ parked: true, error: 'Supplier mapping crashed.' }) },
    },
    async verify({ row, requests, button, page }) {
      const crash = row.getByRole('checkbox', { name: 'Crash on update' })
      await crash.waitFor()
      assert.equal(await crash.isChecked(), true)
      await crash.uncheck()
      await applyConfiguration(page, button)
      await row.getByText('Enabled', { exact: true }).waitFor()
      assert.deepEqual(requests.configure, [{ plugin: manifest, config: { region: 'EU', crash: false } }])
    },
  },
  {
    name: 'configuration-field-label', status: 'Degraded', action: 'Check status',
    state: {
      config_schema: { type: 'object', properties: { hold_seconds: { type: 'integer', minimum: 1 } } },
      config: { hold_seconds: 30 },
      projections: { [projection]: cursor({ last_seq: 100, error: 'The supplier feed is unavailable.' }) },
    },
    async verify({ row }) {
      const field = row.getByRole('spinbutton', { name: 'Hold seconds', exact: true })
      await field.waitFor()
      assert.equal(await field.inputValue(), '30')
    },
  },
  {
    name: 'worker-error', status: 'Degraded', action: 'Check status',
    state: { projections: { [projection]: cursor({ last_seq: 100, error: 'The supplier feed is unavailable.' }) } },
    async verify({ row, state, requests, button }) {
      await row.getByText(/background worker reported an error/i).waitFor()
      await row.getByText(/last applied position 100/i).waitFor()
      await button(row, 'Technical details').click()
      await diagnostics(row, projection).getByText(projection, { exact: true }).waitFor()
      await diagnostics(row, projection).getByText(/supplier feed is unavailable/i).waitFor()
      state.plugin = ready
      await button(row, 'Check status').click()
      await row.getByText('Enabled', { exact: true }).waitFor()
      assert.deepEqual(requests.configure, [])
    },
  },
  {
    name: 'explicit-pause', status: 'Background update paused', action: 'Resume background update',
    state: { projections: { [projection]: cursor({ parked: true, status: 'paused', cursor_id: 'paused-cursor' }) } },
    async verify({ row, requests, button }) {
      await row.getByText(/this update was paused/i).waitFor()
      await button(row, 'Resume background update').click()
      await row.getByText('Enabled', { exact: true }).waitFor()
      assert.deepEqual(requests.resume, [{ cursor_id: 'paused-cursor' }])
      assert.deepEqual(requests.configure, [])
    },
  },
  {
    name: 'misconfigured', status: 'Configuration needed',
    state: {
      config: {}, problem: issue('plugin_config_invalid', manifest + ' config: missing required property issuer.', { field: 'issuer' }),
      lifecycle: { state: 'failed', error: issue('plugin_config_invalid', manifest + ' config: missing required property issuer.', { field: 'issuer' }) },
    },
    async verify({ row, requests, button, page, capture }) {
      await row.getByText(/certificate issuer is required/i).waitFor()
      await button(row, 'Technical details').click()
      await diagnostics(row, manifest).getByText(/missing required property issuer/).waitFor()
      const field = row.getByRole('textbox', { name: /certificate issuer/i })
      await field.fill('Reject me')
      await applyConfiguration(page, button)
      await page.getByText(/Choose an approved certificate issuer/).waitFor()
      await capture('save-refusal')
      await row.getByRole('alert').getByText('Certificate issuer: Choose an approved certificate issuer.').waitFor()
      assert.equal(await field.inputValue(), 'Reject me')
      await field.fill('Approved issuer')
      await applyConfiguration(page, button)
      await row.getByText('Enabled', { exact: true }).waitFor()
      assert.equal(await field.inputValue(), 'Approved issuer')
      assert.deepEqual(requests.configure, ['Reject me', 'Approved issuer'].map(issuer => ({ plugin: manifest, config: { issuer } })))
    },
  },
  {
    name: 'activation-configuration-refusal', status: 'Disabled', action: 'Enable Supplier compliance',
    state: { active: false, config: {} },
    async verify({ row, requests, button, page, capture }) {
      await row.getByRole('switch', { name: 'Enable Supplier compliance' }).check()
      await button(page, 'Review changes').click()
      await page.getByText(/A required plugin setting is missing/).waitFor()
      await capture('review-refusal')
      await row.getByRole('alert').getByText('Certificate issuer: A required plugin setting is missing.').waitFor()
      const field = row.getByRole('textbox', { name: /certificate issuer/i })
      await field.fill('Approved issuer')
      await button(page, 'Review changes').click()
      await button(page, 'Apply changes').waitFor()
      assert.equal(requests.plan.length, 2)
      assert.deepEqual(requests.plan[0].plugin_configs, {}, 'Unset overrides must be resolved by the backend')
      assert.deepEqual(requests.plan[1].plugin_configs, { [manifest]: { issuer: 'Approved issuer' } })
    },
  },
  {
    name: 'history-pruned', status: 'Reset required', action: 'Reset background updates',
    state: {
      lifecycle: { state: 'failed', error: issue('plugin_projection_history_pruned', 'Plugin projection history was pruned.',
        { projection, start_seq: 20, max_pruned_seq: 35 }) },
    },
    async verify({ row, requests, button, page }) {
      await row.getByText(/history.*removed/i).waitFor()
      await row.getByText(/earliest retained position.*36/i).waitFor()
      await button(row, 'Technical details').click()
      await diagnostics(row, projection).getByText(projection, { exact: true }).waitFor()
      await button(row, 'Reset background updates').click()
      const dialog = page.getByRole('dialog')
      await dialog.getByText(/start from a new catalog event/i).waitFor()
      await button(dialog, 'Cancel').click()
      assert.deepEqual(requests.configure, [])
      await button(row, 'Reset background updates').click()
      await button(dialog, 'Reset background updates').click()
      await row.getByText('Catching up', { exact: true }).waitFor()
      assert.deepEqual(requests.configure, [{ plugin: manifest, config: ready.config, reset: true }])
    },
  },
  {
    name: 'uninstalled', status: 'Uninstalled · still referenced', action: 'Review references',
    state: {
      installed: false, title: undefined, references: missingRefs,
      problem: issue('plugin_missing', 'Plugin manifest is unavailable.'),
      lifecycle: { state: 'failed', error: issue('plugin_missing', 'Plugin manifest is unavailable.') },
    },
    async verify({ row, requests, button, page }) {
      assert.equal(await row.getByRole('switch').count(), 0)
      await row.getByText(/package was removed/i).waitFor()
      await button(row, 'Review references').click()
      const dialog = page.getByRole('dialog', { name: 'Plugin references' })
      await dialog.getByText('Certificate', { exact: true }).waitFor()
      await dialog.getByText('Region', { exact: true }).waitFor()
      await dialog.getByText('Catalog app', { exact: true }).waitFor()
      await button(dialog, 'Technical details').click()
      for (const ref of Object.values(missingRefs).flat()) await diagnostics(dialog, ref).getByText(ref, { exact: true }).waitFor()
      await dialog.getByText(/replace or remove these references/i).waitFor()
      assert.equal(await dialog.getByRole('button', { name: 'Review removal' }).count(), 0)
      assert.equal(requests.plan.length, 0)
      await button(dialog, 'Clear catalog app binding').click()
      await button(page.getByRole('dialog', { name: 'Clear catalog app binding?' }), 'Clear binding').click()
      await dialog.getByText(missingRefs.shell_bindings[0], { exact: true }).waitFor({ state: 'hidden' })
      assert.deepEqual(requests.settings, [{ ui_app: '' }])
      await button(dialog, 'Review removal').click()
      await button(page, 'Apply changes').waitFor()
      assert.deepEqual(requests.plan[0].declaration.remove, { plugins: [manifest], scopes: missingRefs.scopes })
    },
  },
  {
    name: 'attachment-binding-absent', status: 'Uninstalled · still referenced', action: 'Review references',
    state: {
      installed: false, title: undefined, references: { fields: [], scopes: [], shell_bindings: [] },
      lifecycle: { state: 'failed', error: issue('unknown_plugin', 'Plugin manifest is unavailable.') },
    },
    async verify({ row, requests, button, page }) {
      await button(row, 'Review references').click()
      await button(page.getByRole('dialog', { name: 'Plugin references' }), 'Review removal').click()
      await page.getByRole('alert').getByText(/restore the plugin package before removing it/i).waitFor()
      assert.equal(await button(page, 'Apply changes').count(), 0)
      assert.equal(requests.plan.length, 1)
    },
  },
]

const browser = await chromium.launch()
const button = (root, name) => root.getByRole('button', { name, exact: true })
const shots = new URL((process.env.PIM_TEST_SHOTS ?? 'shots') + '/', import.meta.url)
const layouts = process.env.PIM_TEST_MATRIX === 'quick'
  ? [[1440, 'light']] : [[1440, 'light'], [1440, 'dark'], [390, 'light'], [390, 'dark']]
const importMap = await fetch(origin + '/imports.json').then(response => {
  assert.ok(response.ok, 'host import map is available through the reverse tunnel')
  return response.text()
})
await mkdir(shots, { recursive: true })
let failed = 0

try {
  for (const [width, theme] of layouts) {
    for (const test of cases.filter(test => !process.env.PIM_TEST_CASE || test.name === process.env.PIM_TEST_CASE)) {
      const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 960 }, colorScheme: theme })
      if (test.name === 'degraded') await page.clock.install()
      page.setDefaultTimeout(9000)
      const pageErrors = []
      page.on('pageerror', error => pageErrors.push(error.message))
      const loadingErrors = []
      page.on('requestfailed', request => loadingErrors.push(request.url() + ' ' + request.failure()?.errorText))
      page.on('console', message => { if (message.type() === 'error') loadingErrors.push(message.text()) })
      const state = { plugin: { ...ready, ...test.state } }
      const requests = { schema: 0, configure: [], plan: [], settings: [], resume: [] }
      const title = state.plugin.title ?? 'Unavailable plugin'
      const name = `${test.name}-${width}-${theme}`
      const capture = suffix => page.screenshot({
        path: new URL(name + '-' + suffix + '.png', shots).pathname,
        animations: 'disabled',
        fullPage: true,
      })
      await page.route(origin + '/recovery', route => route.fulfill({
        contentType: 'text/html',
        body: `<!doctype html><html lang="en" class="w-theme-${theme}"><meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>body{margin:0}kickside-pim-catalog-settings{display:block;height:100dvh}</style>
          <script type="importmap">${importMap}</script>
          <script type="module">
            import { applyThemeMode } from '@wippy-fe/proxy'
            import '/admin/settings.js?declare-tag=kickside-pim-catalog-settings'
            applyThemeMode('${theme}')
          </script><body>
          <kickside-pim-catalog-settings catalog-id="recovery" embedded="true"></kickside-pim-catalog-settings>
          <dialog aria-labelledby="confirm-title"><h2 id="confirm-title"></h2><p></p><form method="dialog"><button value="cancel"></button> <button value="confirm"></button></form></dialog>
          </body></html>`,
      }))
      await page.addInitScript(() => {
        const invoke = async (method, path, data) => {
          const response = await fetch(path, {
            method, headers: { 'Content-Type': 'application/json' },
            ...(data === undefined ? {} : { body: JSON.stringify(data) }),
          })
          const json = await response.json()
          if (!response.ok) throw Object.assign(new Error(json.message), { response: { status: response.status, data: json } })
          return { data: json }
        }
        window.__WIPPY_APP_CONFIG__ = {}
        window.__WIPPY_APP_API__ = {
          config: {}, logger: console, on: () => () => {},
          api: { get: path => invoke('GET', path), post: (path, data) => invoke('POST', path, data), put: (path, data) => invoke('PUT', path, data) },
          state: { get: () => undefined, set: () => undefined, subscribe: () => () => {} },
          async loadByTagName(tag) {
            if (tag !== 'wc-schema-form') throw Error('Unexpected widget ' + tag)
            await import('/widgets/schema_form.js?declare-tag=wc-schema-form')
          },
          host: {
            confirm({ header, message, acceptLabel, rejectLabel }) {
              const dialog = document.querySelector('body > dialog')
              dialog.querySelector('h2').textContent = header
              dialog.querySelector('p').textContent = message
              dialog.querySelector('[value=confirm]').textContent = acceptLabel
              dialog.querySelector('[value=cancel]').textContent = rejectLabel
              dialog.showModal()
              return new Promise(resolve => dialog.addEventListener('close', () => resolve(dialog.returnValue === 'confirm'), { once: true }))
            },
          },
        }
      })
      await page.route(origin + '/api/v1/threads/recovery/projections/resume', route => {
        requests.resume.push(route.request().postDataJSON())
        state.plugin = ready
        return route.fulfill({ json: { success: true, status: 'active' } })
      })
      await page.route(origin + endpoint + '/**', async route => {
        const path = new URL(route.request().url()).pathname.slice(endpoint.length)
        const declaration = { plugins: test.state.active === false ? [] : [{ use: manifest }], ...(test.state.references ? { scopes: test.state.references.scopes } : {}) }
        if (path === '/summary') return route.fulfill({ json: { title: 'Plugin recovery catalog' } })
        if (path === '/schema') {
          requests.schema++
          return route.fulfill({ json: {
            declaration, schema_generation: 2, generation: 2, as_of: 100,
            access: { read: true, write: true, admin: true }, plugins: [state.plugin],
            attributes: {}, families: {}, channels: {}, dimensions: [], vocabularies: {}, sources: {},
          } })
        }
        if (path === '/schema/options') return route.fulfill({ json: {
          plugins: [state.plugin], scopes: test.name === 'uninstalled' ? [{ id: missingRefs.scopes[0], title: 'Region', access: 'read', filters: {} }] : [],
          types: [], link_kinds: [],
        } })
        if (path === '/plugins/configure') {
          const body = route.request().postDataJSON()
          requests.configure.push(body)
          if (body.config.issuer === 'Reject me') return route.fulfill({
            status: 400, json: {
              details: { code: 'plugin_config_invalid', plugin: manifest, field: 'issuer' },
              message: 'Choose an approved certificate issuer.',
            },
          })
          state.plugin = { ...ready, config: body.config, ...(body.reset ? { projections: { [projection]: cursor({ bootstrapping: true }) } } : {}) }
          return route.fulfill({ json: { seq: 100 } })
        }
        if (path === '/settings') {
          requests.settings.push(route.request().postDataJSON())
          state.plugin = { ...state.plugin, references: { ...state.plugin.references, shell_bindings: [] } }
          return route.fulfill({ json: { catalog_id: 'recovery' } })
        }
        if (path === '/schema/plan') {
          const body = route.request().postDataJSON()
          requests.plan.push(body)
          if (test.name === 'activation-configuration-refusal' && !body.plugin_configs?.[manifest]) return route.fulfill({
            status: 400, json: {
              details: { code: 'plugin_config_invalid', plugin: manifest, field: 'issuer' },
              message: 'A required plugin setting is missing.',
            },
          })
          if (test.name === 'attachment-binding-absent') return route.fulfill({
            status: 503, json: { details: { code: 'plugin_cleanup_unavailable' },
              message: 'Restore the package that provides the attachment deletion binding before deactivating this plugin.' },
          })
          return route.fulfill({ json: { generation: 2, class: 'semantic', changes: [{ code: 'plugin ' + manifest, what: 'removed', class: 'semantic' }], refused: [] } })
        }
        return route.fulfill({ status: 404, json: { message: 'Unknown fixture path' } })
      })
      try {
        await page.goto(origin + '/recovery')
        await page.getByRole('navigation', { name: 'Catalog settings sections' }).getByRole('button', { name: 'Plugins', exact: true }).click()
        const row = page.locator('.pim-definition').filter({ has: page.getByRole('button', { name: new RegExp(title) }) })
        await row.getByText(test.status, { exact: true }).waitFor({ timeout: 3000 })
        const toggle = row.getByRole('button', { name: new RegExp(title) })
        if (await toggle.getAttribute('aria-expanded') === 'false') await toggle.click()
        if (test.action && test.state.active !== false) {
          await button(row, test.action).waitFor()
          assert.ok(await button(row, test.action).evaluate(element => {
            const body = element.closest('.pim-definition-body')
            return body && element.getBoundingClientRect().width < body.getBoundingClientRect().width - 16
          }), 'recovery action uses an intrinsic button width')
        }
        for (const id of [manifest, projection, ...Object.values(missingRefs).flat()]) {
          const exposed = await row.getByText(id).evaluateAll(elements => elements.some(element => element.getClientRects().length > 0))
          assert.equal(exposed, false, 'technical IDs are hidden before disclosure')
        }
        assert.equal(await row.getByText('Enabled', { exact: true }).count(), 0)
        assert.ok(await row.evaluate(element => {
          const rect = element.getBoundingClientRect()
          return rect.left >= -1 && rect.right <= innerWidth + 1 && element.scrollWidth <= element.clientWidth + 1
        }), 'plugin row fits the viewport')
        assert.equal(await page.locator('html').evaluate((html, expected) => html.classList.contains('w-theme-' + expected), theme), true)
        await row.screenshot({ path: new URL(name + '.png', shots).pathname, animations: 'disabled' })
        await capture('initial')
        await test.verify({ row, state, requests, button, page, capture })
        if (test.name === 'attachment-binding-absent') {
          await page.getByRole('alert').filter({ hasText: 'Restore the plugin package before removing it.' })
            .screenshot({ path: new URL(name + '-refusal.png', shots).pathname, animations: 'disabled' })
        }
        assert.deepEqual(pageErrors, [])
        console.log(`PASS ${name}`)
      } catch (error) {
        failed++
        console.log(`FAIL ${name} | ${error.message}`)
        console.log(await page.locator('kickside-pim-catalog-settings').evaluate(element => ({
          registered: !!customElements.get(element.localName),
          text: element.shadowRoot?.querySelector('.pim-builder')?.textContent?.slice(0, 1600),
          children: Array.from(element.shadowRoot?.children ?? []).map(child => child.localName + ' ' + child.className).filter(child => !child.startsWith('style')),
          navigation: Array.from(element.shadowRoot?.querySelectorAll('nav,[role=listbox]') ?? []).map(child => child.outerHTML.slice(0, 400)),
        })))
        console.log([...pageErrors, ...loadingErrors].slice(0, 8).join('\n'))
        await capture('failure').catch(() => {})
      } finally {
        await page.context().close()
      }
    }
  }
} finally {
  await browser.close()
}
process.exitCode = failed > 0 ? 1 : 0
