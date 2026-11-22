// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
// Run on Fire. Stdin contains one fresh session and the disposable catalog fixtures.
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const chunks = []
for await (const chunk of process.stdin) chunks.push(chunk)
const [token, rawFixtures] = Buffer.concat(chunks).toString('utf8').trim().split('\n')
assert.ok(token, 'A fresh session is required')
const { catalogs, account } = JSON.parse(rawFixtures)
const origin = 'http://localhost:18160'
const port = process.env.PIM_SETUP_PORT ?? '18160'
const bundle = process.env.PIM_SETUP_BUNDLE
const output = process.env.PIM_SETUP_OUTPUT
const browser = await chromium.launch({
  args: port === '18160' ? [] : ['--host-resolver-rules=MAP localhost 127.0.0.1:' + port],
})
const button = (root, name) => root.getByRole('button', { name, exact: true })
const row = (root, name) => root.locator('.pim-definition').filter({ hasText: name }).first()
const option = (root, name) => root.getByRole('option', { name, exact: true })
const text = (root, value) => root.getByText(value, { exact: true })
async function add(root, action, label, name) {
  await button(root, action).click()
  const editor = root.locator('.pim-add-editor')
  await editor.getByRole('textbox', { name: label, exact: true }).fill(name)
  await button(editor, action).click()
}
async function persisted(api, path, data) {
  const url = 'http://127.0.0.1:' + port + '/api/v1' + path
  const headers = { Authorization: 'Bearer ' + token }
  const response = data ? await api.post(url, { headers, data }) : await api.get(url, { headers })
  assert.equal(response.status(), 200, path)
  const result = await response.json()
  assert.equal(result.success, true, path)
  return result.data
}

async function visit({ id, title, width, theme }) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 960 }, colorScheme: theme, reducedMotion: 'reduce' })
  page.setDefaultTimeout(5500)
  const loaded = new Set()
  if (bundle) {
    await page.route(/\/kickside-pim-admin\/[-A-Za-z0-9_]+\.js(?:\?.*)?$/, async route => {
      const asset = new URL(route.request().url()).pathname.split('/').at(-1)
      await route.fulfill({ path: bundle + '/' + asset, contentType: 'text/javascript' })
      loaded.add(asset)
    })
  }

  try {
    const shell = page.frameLocator('iframe').first()
    async function shot(name, surface) {
      if (!output) return
      await mkdir(output + '/' + width + '-' + theme, { recursive: true })
      // The outer shell scrolls independently of the settings panel.
      // Expand each scrolling ancestor to make all of the selected surface visible.
      const restore = await surface.evaluateHandle(target => {
        const changes = []
        for (let node = target; node; node = node.parentElement ?? node.getRootNode().host) {
          const style = node.ownerDocument.defaultView.getComputedStyle(node)
          if (!/(auto|scroll|hidden|clip)/.test(style.overflowY) || node.scrollHeight <= node.clientHeight) continue
          changes.push([node, node.style.cssText])
          Object.assign(node.style, { height: 'auto', minHeight: node.scrollHeight + 'px', maxHeight: 'none', overflow: 'visible', flexShrink: '0' })
        }
        return () => changes.reverse().forEach(([node, css]) => { node.style.cssText = css })
      })
      try {
        const height = await surface.evaluate(node => Math.ceil(node.getBoundingClientRect().bottom + 100))
        const viewport = page.viewportSize()
        await page.setViewportSize({ width, height: Math.max(viewport.height, height) })
        await surface.evaluate(node => node.ownerDocument.fonts.ready)
        await page.mouse.move(0, 0)
        await page.screenshot({ path: output + '/' + width + '-' + theme + '/' + name + '.png', fullPage: true, animations: 'disabled' })
        await page.setViewportSize(viewport)
      } finally {
        await restore.evaluate(undo => undo())
        await restore.dispose()
      }
    }
    await page.goto(origin + '/login')
    await page.evaluate(value => localStorage.setItem('@wippy_token_info', JSON.stringify({ token: value })), token)
    if (output) {
      await page.goto(origin + '/system/security')
      await shell.getByRole('tab', { name: 'Roles', exact: true }).waitFor({ timeout: 35000 })
      await button(shell, 'New role').first().waitFor()
      await shot('security', shell.locator('kickside-security').first())
      await page.goto(origin + '/system/settings')
      await shell.getByRole('tab', { name: 'Settings', exact: true, selected: true }).waitFor({ timeout: 35000 })
      await button(shell, 'Products').click()
      const reference = shell.locator('.ks-row').first()
      await reference.waitFor()
      await shot('settings', shell.locator('.ks-pane'))
    }
    await page.goto(origin + '/system/pim')
    await shell.getByRole('tab', { name: 'Catalogs', exact: true, selected: true }).waitFor({ timeout: 35000 })
    assert.equal(await shell.locator('body').evaluate(node => node.ownerDocument.defaultView.isSecureContext), true)
    const admin = shell.locator('kickside-pim-admin')
    await text(admin, title).click()
    const settings = admin.locator('kickside-pim-catalog-settings')
    const rail = settings.getByRole('navigation', { name: 'Catalog settings sections' })
    const section = name => settings.getByRole('region', { name, exact: true })
    const visitSection = async name => { await button(rail, name).click(); return section(name) }
    const root = '/pim/catalogs/' + encodeURIComponent(id)
    async function returnButton(panel, label) {
      const control = button(panel, label)
      assert.ok(await control.evaluate(element => {
        const { left, right } = element.getBoundingClientRect()
        return left >= 0 && right <= element.ownerDocument.documentElement.clientWidth
      }), label + ' fits within the viewport')
      return control
    }
    async function apply() {
      await button(settings, 'Review changes').click()
      const dialog = settings.getByRole('dialog')
      await button(dialog, 'Apply changes').click()
      await dialog.waitFor({ state: 'hidden' })
      await text(settings, 'Catalog changes applied.').waitFor()
    }
    async function check(label, walk) {
      try {
        await walk()
        console.log('PASS ' + label)
      } catch (error) {
        console.log('FAIL ' + label + ' | ' + error.message.replaceAll(token, '[redacted]').replaceAll(account.search, '[administrator]').replaceAll(account.label, '[administrator]').trim())
        process.exitCode = 1
      }
    }

    await check('source permissions, sender identifier and delivery', async () => {
      const sources = await visitSection('Sources')
      await add(sources, 'Add source', 'Source name', 'Supplier feed')
      const source = row(sources, 'Supplier feed')
      await text(source, 'Source identifier').waitFor()
      assert.equal(await source.locator('code.mono').innerText(), 'supplier_feed')
      assert.match(await source.innerText(), /Send this exact identifier in the source field/)
      await text(source, 'If you leave this empty, anyone who can write to the catalog can use this source.').waitFor()
      await text(source, 'If you leave this empty, this source cannot update any field values.').waitFor()
      await source.getByRole('textbox', { name: 'Service account ID' }).waitFor()
      await text(source, 'Ask whoever manages the service account for its principal ID.').waitFor()
      assert.ok((await source.innerText()).indexOf('People and service accounts') < (await source.innerText()).indexOf('Handle incoming updates'))
      await shot('source-defaults', sources)
      await button(source, 'Basics').click()
      const picker = source.locator('wc-principal-picker')
      await picker.getByRole('button', { name: /Add a person/ }).click()
      await picker.getByRole('combobox', { name: 'Search people or groups' }).fill(account.search)
      const matches = picker.getByRole('option')
      await matches.first().waitFor()
      assert.equal(await matches.count(), 1, 'exact account search')
      await matches.first().click()
      await text(source, '1 allowed account').waitFor()
      await shot('source-configured', sources)
      await apply()
      const schema = await persisted(page.request, root + '/schema')
      const saved = schema.declaration.sources.find(item => item.id === 'supplier_feed')
      assert.deepEqual(saved.writes, ['basics'])
      assert.equal(saved.principals.length, 1)
      const result = await persisted(page.request, root + '/apply', { source: 'supplier_feed', items: [{
        product: { sku: 'FLOW-SUPPLIER' }, create: { family: 'apparel' }, set: [{ attr: 'basics.care', value: 'Machine wash' }],
      }] })
      assert.equal(result.outcomes[0].outcome, 'created')
    })

    await check('channel-to-family requirement handoff and saved selection', async () => {
      const channels = await visitSection('Channels')
      await add(channels, 'Add channel', 'Channel name', 'Online store')
      const channel = row(channels, 'Online store')
      await button(channel, 'Create a requirement in Families').waitFor()
      await text(channel, 'Applies to every family unless you choose specific families.').waitFor()
      await shot('channel-empty', channels)
      await button(channel, 'Create a requirement in Families').click()
      const families = section('Families')
      const family = row(families, 'Apparel')
      await add(family, 'Add requirement', 'Requirement name', 'Store ready')
      const required = family.getByRole('combobox', { name: 'Required', exact: true })
      await required.click()
      await option(family, 'Care').click()
      await shot('channel-requirement', families)
      await (await returnButton(families, 'Back to Online store')).click()
      await button(channel, 'Store ready · Apparel').click()
      await button(channel, 'Apparel').click()
      await shot('channel-configured', channels)
      await apply()
      const schema = await persisted(page.request, root + '/schema')
      assert.deepEqual(schema.channels.online_store.requirements, ['store_ready'])
      assert.deepEqual(schema.channels.online_store.families, ['apparel'])
      assert.deepEqual(schema.declaration.families.find(f => f.code === 'apparel').requirements[0].require, ['basics.care'])
    })

    await check('variant-to-field handoff, return and saved variant field', async () => {
      const families = await visitSection('Families')
      await add(families, 'Add family', 'Family name', 'Footwear')
      const family = row(families, 'Footwear')
      await button(family, 'Add level').click()
      await button(family, 'Create a field in Fields').waitFor()
      await shot('variant-empty', families)
      await button(family, 'Create a field in Fields').click()
      const fields = section('Fields')
      await add(fields, 'Add field group', 'Field group name', 'Sizes')
      const group = fields.locator('.pim-definition-list').filter({ hasText: 'Sizes' })
      await add(group, 'Add field', 'Field name', 'Size')
      await group.getByRole('combobox', { name: 'Type', exact: true }).click()
      await option(group, 'Integer').click()
      await shot('variant-field', fields)
      await (await returnButton(fields, 'Back to Footwear')).click()
      const groups = family.locator('.p-multiselect-dropdown')
      await groups.click()
      await option(family, 'Sizes').click()
      await groups.click()
      await text(family, 'Choose a field').click()
      await option(family, 'Size').click()
      await shot('variant-configured', families)
      await apply()
      const schema = await persisted(page.request, root + '/schema')
      assert.deepEqual(schema.declaration.families.find(f => f.code === 'footwear').variation[0].axes, ['sizes.size'])
    })

    if (bundle) assert.ok(loaded.has('admin.js') && loaded.has('settings.js'), 'Both candidate entries loaded')
  } finally {
    await page.close()
  }
}

try {
  for (const fixture of catalogs) await visit(fixture)
} finally {
  await browser.close()
}
