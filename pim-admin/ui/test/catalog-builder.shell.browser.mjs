// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const chunks = []
for await (const chunk of process.stdin) chunks.push(chunk)
const token = Buffer.concat(chunks).toString('utf8').trim()
assert.ok(token, 'An authenticated dev-host session is required')
const phase = process.env.PIM_BUILDER_PHASE ?? 'before'
const port = process.env.PIM_BUILDER_PORT ?? '18160'
const origin = 'http://localhost:18160'
const bundle = process.env.PIM_BUILDER_BUNDLE
const catalog = process.env.PIM_BUILDER_CATALOG ?? 'Alder & Coast'
const browser = await chromium.launch({
  args: port === '18160' ? [] : ['--host-resolver-rules=MAP localhost 127.0.0.1:' + port],
})
const button = (root, name) => root.getByRole('button', { name, exact: true })
let failures = 0

async function check(label, run) {
  try {
    await run()
    console.log('PASS ' + label)
  } catch (error) {
    failures++
    console.log('FAIL ' + label + ' | ' + error.message.replaceAll(token, '[redacted]').replace(/\s+/g, ' ').slice(0, 500))
  }
}

async function addRow(root, action, label, name) {
  const opener = button(root, action)
  const input = root.getByRole('textbox', { name: label, exact: true })
  assert.equal(await input.count(), 0, label + ' starts closed')
  await opener.press('Enter')
  await input.waitFor()
  assert.equal(await input.evaluate(node => node.getRootNode().activeElement === node), true, label + ' receives focus')
  await input.fill(name)
  await input.press('Escape')
  await input.waitFor({ state: 'detached' })
  assert.equal(await opener.evaluate(node => node.getRootNode().activeElement === node), true)
  await opener.click()
  await input.waitFor()
  assert.equal(await input.inputValue(), '')
  await input.fill(name)
  await input.press('Enter')
  await input.waitFor({ state: 'detached' })
}

async function visit(width, theme) {
  const shots = phase + '-' + width + '-' + theme
  await mkdir(shots, { recursive: true })
  const page = await browser.newPage({
    viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce',
  })
  page.setDefaultTimeout(10000)
  const candidate = new Set()
  if (bundle) {
    await page.route(/\/kickside-pim-admin\/[-A-Za-z0-9_]+\.js(?:\?.*)?$/, async route => {
      const asset = new URL(route.request().url()).pathname.split('/').at(-1)
      await route.fulfill({ path: bundle + '/' + asset, contentType: 'text/javascript' })
      candidate.add(asset)
    })
  }
  try {
    const shell = page.frameLocator('iframe').first()
    const shot = name => page.screenshot({ path: shots + '/' + name + '.png', fullPage: true })
    await page.goto(origin + '/login')
    await page.evaluate(value => localStorage.setItem('@wippy_token_info', JSON.stringify({ token: value })), token)
    await page.goto(origin + '/')
    await shell.getByRole('navigation', { name: 'Main navigation' }).waitFor({ state: 'attached', timeout: 35000 })
    await page.goto(origin + '/system/security')
    await shell.getByRole('tab', { name: 'Roles', exact: true }).waitFor()
    await button(shell, 'New role').first().waitFor()
    assert.equal(await shell.locator('body').evaluate(node => node.ownerDocument.defaultView.isSecureContext), true)
    await shot('security')
    await shell.getByRole('tab', { name: 'Settings', exact: true }).click()
    await shell.getByText('About KickSide', { exact: true }).first().waitFor()
    await shell.locator('wc-render-markdown .markdown-body').first().waitFor()
    await shot('settings')
    await shell.getByRole('tab', { name: 'Catalogs', exact: true }).click()
    const admin = shell.locator('kickside-pim-admin')
    await admin.getByText(catalog, { exact: true }).first().click()
    const settings = admin.locator('kickside-pim-catalog-settings')
    const rail = settings.getByRole('navigation', { name: 'Catalog settings sections' })
    async function section(name) {
      await button(rail, name).click()
      const region = settings.getByRole('region', { name, exact: true })
      await region.getByRole('heading', { name, exact: true }).waitFor()
      return region
    }

    let fields = await section('Fields')
    let identity = fields.locator('.pim-definition-list').filter({ has: page.getByRole('heading', { name: 'Identity' }) })
    await identity.locator('.pim-row-title').first().waitFor()
    await shot('fields')
    let channels = await section('Channels')
    await channels.getByText('Storefront', { exact: true }).waitFor()
    await shot('channels')
    let families = await section('Families')
    await families.getByText('Trail packs', { exact: true }).click()
    await families.getByText('Distinguish variants by', { exact: true }).first().waitFor()
    await shot('families')
    await families.getByText('Distinguish variants by', { exact: true }).first().scrollIntoViewIfNeeded()
    await shot('families-groups')
    console.log('PASS visual capture ' + shots)
    if (bundle) assert.ok(candidate.has('admin.js') && candidate.has('settings.js'), 'Both candidate entry points loaded')
    if (width !== 1440 || theme !== 'light') return

    await check('P1 add family and nested release requirement', async () => {
      await addRow(families, 'Add family', 'Family name', 'Browser draft family')
      const family = families.locator('.pim-definition').filter({ hasText: 'Browser draft family' })
      await addRow(family, 'Add requirement', 'Requirement name', 'Browser draft requirement')
      await family.getByText('Browser draft requirement', { exact: true }).waitFor()
      await button(settings, 'Discard').click()
    })
    await check('P3 family groups, variant action and scoped removal', async () => {
      families = await section('Families')
      const family = families.locator('.pim-definition').filter({ has: page.getByText('Trail packs', { exact: true }) })
      const toggle = family.locator('.pim-definition-toggle')
      if (await toggle.getAttribute('aria-expanded') === 'true') await toggle.click()
      await button(family, 'Remove family').waitFor({ state: 'detached' })
      await toggle.click()
      const groups = family.getByRole('combobox', { name: 'Field groups' })
      const dropdown = family.locator('.p-multiselect-dropdown')
      const identityChip = family.locator('.p-chip').filter({ hasText: /^Identity$/ })
      await identityChip.waitFor()
      await dropdown.click()
      assert.equal(await groups.getAttribute('aria-expanded'), 'true')
      await shot('families-select')
      const identityOption = shell.getByRole('option', { name: 'Identity', exact: true })
      assert.equal(await identityOption.getAttribute('aria-selected'), 'true')
      await identityOption.click()
      await identityChip.waitFor({ state: 'detached' })
      if (await groups.getAttribute('aria-expanded') === 'false') await dropdown.click()
      assert.equal(await identityOption.getAttribute('aria-selected'), 'false')
      await dropdown.click()
      await identityOption.waitFor({ state: 'hidden' })
      const addLevel = button(family, 'Add level')
      const control = await addLevel.boundingBox()
      const row = await family.boundingBox()
      assert.ok(control.width < row.width / 2, 'Add level fits its label')
      await addLevel.click()
      await family.getByText('Level 3', { exact: true }).waitFor()
      await button(family, 'Remove family').waitFor()
      await button(settings, 'Discard').click()
    })
    await check('P1 add channel', async () => {
      channels = await section('Channels')
      await addRow(channels, 'Add channel', 'Channel name', 'Browser draft channel')
      await channels.getByText('Browser draft channel', { exact: true }).waitFor()
      await button(settings, 'Discard').click()
    })
    fields = await section('Fields')
    identity = fields.locator('.pim-definition-list').filter({ has: page.getByRole('heading', { name: 'Identity' }) })
    await check('P1 add group and field', async () => {
      await addRow(fields, 'Add field group', 'Field group name', 'Browser draft group')
      const group = fields.locator('.pim-definition-list').filter({ has: page.getByRole('heading', { name: 'Browser draft group' }) })
      await addRow(group, 'Add field', 'Field name', 'Browser draft field')
      await group.getByText('Browser draft field', { exact: true }).waitFor()
      await shot('fields-editing')
      await button(settings, 'Discard').click()
    })
    await check('P2 reorder fields with keyboard and keep focus in the row', async () => {
      assert.equal(await identity.locator('[draggable="true"]').count(), 0)
      const earlier = button(identity, 'Move Brand earlier')
      await earlier.press('Enter')
      assert.deepEqual((await identity.locator('.pim-row-title').allTextContents()).slice(0, 2), ['Brand', 'Name'])
      const later = button(identity, 'Move Brand later')
      assert.equal(await later.evaluate(node => node.getRootNode().activeElement === node), true)
      await later.press('Space')
      assert.deepEqual((await identity.locator('.pim-row-title').allTextContents()).slice(0, 2), ['Name', 'Brand'])
    })
    await check('P4 field group settings open a scoped dialog', async () => {
      const control = button(identity, 'Identity settings')
      await control.click()
      const dialog = settings.getByRole('dialog', { name: 'Identity settings' })
      await dialog.waitFor()
      assert.equal(await dialog.getByRole('combobox', { name: 'Sources allowed to write' }).count(), 1)
      await shot('field-group-settings')
      await page.keyboard.press('Escape')
      await dialog.waitFor({ state: 'hidden' })
      assert.equal(await control.evaluate(node => node.getRootNode().activeElement === node), true)
    })
  } finally {
    await page.close()
  }
}

try {
  for (const width of [1440, 390]) {
    for (const theme of ['light', 'dark']) {
      await check(phase + ' ' + width + ' ' + theme, () => visit(width, theme))
    }
  }
} finally {
  await browser.close()
}
process.exitCode = Number(failures > 0)
