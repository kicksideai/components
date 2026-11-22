// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
// Run on Fire with a fresh dev-host session on stdin.
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const input = []
for await (const chunk of process.stdin) input.push(chunk)
const token = Buffer.concat(input).toString('utf8').trim()
assert.ok(token, 'An authenticated dev-host session is required')
const stage = process.env.PIM_VISUAL_STAGE ?? 'before'
const origin = 'http://localhost:18160'
const port = process.env.PIM_VISUAL_PORT ?? '19390'
const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP localhost 127.0.0.1:' + port] })
const button = (root, name) => root.getByRole('button', { name, exact: true })
const output = new URL('./visual-' + stage + '/', import.meta.url)
await mkdir(output, { recursive: true })
const failures = []
const measurements = {}
const dimensions = [[1440, 960], [390, 844]]
const sections = ['Overview', 'Families', 'Fields', 'Form layout', 'Dimensions', 'Vocabularies', 'Channels', 'Sources', 'Access', 'Plugins']
const selectors = {
  Overview: ['.kx-settings-rail', '.kx-settings-rail-leading', '.kx-settings-rail-item', '.pim-overview-card', '.kx-card-name', '.kx-card-desc', '.pim-overview-action', '.pim-overview-action svg', '.kx-disclosure .p-accordionpanel'],
  Catalogs: ['.kx-railhead', '.picker-row', '.kx-empty', '.kx-empty-ico', '.kx-empty-title'],
  Families: ['.pim-definition-list', '.pim-add-row', '.pim-add-editor'],
  Fields: ['.pim-family-filter', '.pim-ia-action .pim-add-row button', '.pim-add-editor', '.pim-add-editor input', '.pim-add-editor button'],
  'Form layout': ['.pim-lcard', '.pim-lcard-move button'],
  Dimensions: ['.pim-definition-list', '.pim-add-row'],
  Vocabularies: ['.pim-definition-list', '.pim-add-row'],
  Channels: ['.pim-definition-list', '.pim-add-row', '.pim-add-editor', '.pim-add-editor input', '.pim-add-editor button'],
  Sources: ['.pim-definition-list', '.pim-add-row', '.pim-add-editor', '.pim-add-editor input', '.pim-add-editor button'],
  Access: ['.pim-access-card, .pim-card-body', '.pim-access-card h3, .pim-card-body h3', '.pim-access-summary, .pim-card-body p', '.pim-access-roles'],
  Plugins: ['.pim-definition-list', '.pim-definition-body', '.kx-disclosure', 'wc-schema-form input'],
  Security: ['.kx-settings-rail', '.picker-row', '.kx-head', '.p-button', '[role="tablist"]'],
  Settings: ['.kx-settings-rail', '.kx-settings-rail-item', '.ks-row', '.ks-row-head', '.ks-row-main p', '.p-button', '[role="tablist"]'],
}
const prefix = name => name.toLowerCase().replaceAll(' ', '-')
async function measure(shell, names) {
  return Object.fromEntries(await Promise.all(names.map(async selector => [
    selector,
    await shell.locator(selector).evaluateAll(nodes => nodes.filter(node => node.getClientRects().length).slice(0, 8).map(node => {
      const { x, y, width, height } = node.getBoundingClientRect()
      const style = getComputedStyle(node)
      return {
        x, y, width, height, scrollHeight: node.scrollHeight, clientHeight: node.clientHeight,
        text: (node.getAttribute('aria-label') || node.textContent || '').trim().slice(0, 90),
        color: style.color, primary: style.getPropertyValue('--p-primary-color').trim(),
        fontSize: style.fontSize, fontWeight: style.fontWeight, opacity: style.opacity,
        padding: style.padding, gap: style.gap, margin: style.margin, borderTop: style.borderTopWidth,
        borderBottom: style.borderBottomWidth,
      }
    })),
  ])))
}

try {
  for (const [width, height] of dimensions) for (const theme of ['light', 'dark']) {
    const layout = width + '-' + theme
    const page = await browser.newPage({ viewport: { width, height }, colorScheme: theme, reducedMotion: 'reduce' })
    page.setDefaultTimeout(12000)
    const shell = page.frameLocator('iframe').first()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    if (stage === 'after') {
      await page.route(/\/kickside-pim-admin\/[-A-Za-z0-9_]+\.js(?:\?.*)?$/, async route => {
        const name = new URL(route.request().url()).pathname.split('/').at(-1)
        await route.fulfill({ path: new URL('./candidate/' + name, import.meta.url).pathname, contentType: 'text/javascript' })
      })
    }
    const results = measurements[layout] = {}
    const capture = async (section, label = prefix(section)) => {
      await page.mouse.move(0, 0)
      await shell.locator('body').evaluate(async body => {
        await body.ownerDocument.fonts.ready
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      })
      results[label] = await measure(shell, selectors[section])
      await page.screenshot({ path: new URL(layout + '-' + label + '.png', output).pathname, fullPage: true, animations: 'disabled' })
    }
    const verify = (label, run) => {
      try { run(); console.log('PASS ' + layout + ' | ' + label) }
      catch (error) { failures.push(label); console.log('FAIL ' + layout + ' | ' + label + ' | ' + error.message) }
    }
    try {
      await page.goto(origin + '/login')
      await page.evaluate(session => localStorage.setItem('@wippy_token_info', JSON.stringify({ token: session })), token)
      for (const reference of ['Security', 'Settings']) {
        await page.goto(origin + '/system/' + prefix(reference))
        await shell.getByRole('tab', { name: reference, exact: true, selected: true }).waitFor({ timeout: 35000 })
        if (reference === 'Security') await shell.getByPlaceholder(/Find a role/i).waitFor()
        else {
          await button(shell, 'Products').click()
          await shell.locator('.ks-row').first().waitFor()
        }
        await capture(reference)
      }
      await page.goto(origin + '/system/pim')
      await shell.getByRole('tab', { name: 'Catalogs', exact: true, selected: true }).waitFor({ timeout: 35000 })
      const directory = shell.locator('kickside-pim-admin')
      const catalog = directory.locator('.pim-catalog-row').filter({ hasText: 'Alder & Coast' }).first()
      await catalog.waitFor({ timeout: 35000 })
      await capture('Catalogs')
      await catalog.click()
      const settings = directory.locator('kickside-pim-catalog-settings')
      const rail = settings.getByRole('navigation', { name: 'Catalog settings sections' })
      const section = name => settings.getByRole('region', { name, exact: true })
      await settings.locator('.pim-overview-card').first().waitFor()
      await capture('Overview')
      if (stage === 'after') {
        const framed = await rail.evaluate(node => node.classList.contains('kx-settings-rail-framed'))
        verify('opened catalog uses the Settings rail without a directory header', () => assert.equal(framed, false))
        verify('Overview action and copy align with their title', () => {
          const overview = results.overview
          for (const [index, title] of overview['.kx-card-name'].entries()) {
            assert.equal(overview['.kx-card-desc'][index].x, title.x)
            assert.equal(overview['.pim-overview-action'][index].x, title.x)
            assert.equal(overview['.pim-overview-action'][index].fontSize, '13px')
          }
        })
      }
      const products = settings.locator('.pim-overview-card').first().getByRole('button')
      const action = await products.innerText()
      verify('Overview action names its Families destination', () => assert.match(action, /View families/i))
      await products.click()
      await section('Families').waitFor()
      const addForms = { Families: 'Add family', Fields: 'Add field group', Channels: 'Add channel', Sources: 'Add source' }
      for (const name of sections.slice(1)) {
        if (name !== 'Families') await button(rail, name).click()
        const panel = section(name)
        await panel.locator('.pim-ia-content').waitFor()
        await capture(name)
        if (addForms[name]) {
          const addName = addForms[name]
          await button(panel, addName).click()
          const editor = panel.locator('.pim-add-editor')
          const add = button(editor, addName)
          const cancel = button(editor, 'Cancel')
          const input = editor.getByRole('textbox')
          assert.ok(await add.isDisabled())
          assert.ok(await input.evaluate(input => input.getRootNode().activeElement === input))
          await capture(name, prefix(name) + '-add-empty')
          const addBox = await add.boundingBox()
          const cancelBox = await cancel.boundingBox()
          const inputBox = await input.boundingBox()
          verify(name + ' keeps Add and Cancel together with an 8 px gap', () => {
            assert.ok(Math.abs(addBox.y - cancelBox.y) < 1)
            assert.ok(Math.abs(addBox.x + addBox.width + 8 - cancelBox.x) < 1)
            if (width === 1440) assert.ok(Math.abs(inputBox.y - addBox.y) < 1)
          })
          await input.fill('123')
          assert.ok(await add.isDisabled())
          await input.fill('Visual audit draft')
          assert.ok(await add.isEnabled())
          if (name === 'Channels') await capture(name, 'channels-add-ready')
          await cancel.click()
          assert.ok(await button(panel, addName).evaluate(element => element.getRootNode().activeElement === element))
          await button(panel, addName).click()
          assert.equal(await editor.getByRole('textbox').inputValue(), '')
          await editor.getByRole('textbox').press('Escape')
          await editor.waitFor({ state: 'hidden' })
        }
        if (name === 'Plugins') {
          const inventory = panel.locator('.pim-definition').filter({ hasText: 'Inventory' }).first()
          if (await inventory.count()) {
            const toggle = inventory.locator('button[aria-expanded]')
            if (await toggle.getAttribute('aria-expanded') === 'false') await toggle.click()
            await inventory.locator('wc-schema-form').waitFor()
            await capture(name, 'plugins-inventory')
          }
        }
      }
      if (stage === 'after') {
        verify('leading add toolbars have one outer edge and trailing toolbars retain a divider', () => {
          for (const section of ['families', 'channels', 'sources', 'dimensions', 'vocabularies']) {
            assert.equal(results[section]['.pim-definition-list'][0].borderTop, '1px')
            const expected = ['dimensions', 'vocabularies'].includes(section) ? '1px' : '0px'
            assert.equal(results[section]['.pim-add-row'][0].borderTop, expected)
          }
        })
        verify('Fields and Form layout use matching control sizes', () => {
          assert.equal(results.fields['.pim-family-filter'][0].height, results.fields['.pim-ia-action .pim-add-row button'][0].height)
          assert.equal(results['form-layout']['.pim-lcard-move button'][0].height, 30)
        })
        verify('Access matches the Settings spacing and heading hierarchy', () => {
          const access = results.access
          assert.ok(access['.pim-access-card, .pim-card-body'].every(card => card.padding === '16px'))
          assert.ok(access['.pim-access-card h3, .pim-card-body h3'].every(heading => heading.fontSize === '14px' && heading.fontWeight === '600'))
          const [summary] = access['.pim-access-summary, .pim-card-body p']
          assert.equal(summary.fontSize, '12px')
          assert.equal(summary.margin, '3px 0px 0px')
        })
      }
      verify('no uncaught browser errors', () => assert.deepEqual(errors, []))
    } catch (error) {
      failures.push(layout)
      console.log('FAIL ' + layout + ' | ' + error.message.replaceAll(token, '[redacted]'))
    } finally {
      await page.close()
    }
  }
} finally {
  await writeFile(new URL('measurements.json', output), JSON.stringify(measurements, null, 2) + '\n')
  await browser.close()
}
if (failures.length) process.exitCode = 1
