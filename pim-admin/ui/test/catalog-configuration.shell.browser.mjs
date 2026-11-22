// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const chunks = []
for await (const chunk of process.stdin) chunks.push(chunk)
const { token, title } = JSON.parse(Buffer.concat(chunks).toString('utf8'))
const bundle = process.env.PIM_SETUP_BUNDLE
const baseline = process.env.PIM_SETUP_PHASE === 'baseline'
const port = process.env.PIM_SETUP_PORT ?? '18160'
const origin = 'http://localhost:18160'
const browser = await chromium.launch({
  args: ['--host-resolver-rules=MAP localhost 127.0.0.1:' + port],
})
const button = (root, name) => root.getByRole('button', { name, exact: true })
let failures = 0

async function check(name, test) {
  try {
    await test()
    console.log('PASS ' + name)
  } catch (error) {
    failures++
    console.log('FAIL ' + name + ' | ' + error.message.replaceAll(token, '[redacted]').replace(/\s+/g, ' ').slice(0, 700))
  }
}

async function visit(width, theme, task) {
  const shots = 'shots/' + width + '-' + theme
  if (!baseline) await mkdir(shots, { recursive: true })
  const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' })
  page.setDefaultTimeout(8000)
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
    const shot = async name => {
      if (!baseline) await page.screenshot({ path: shots + '/' + name + '.png', fullPage: true })
    }
    await page.goto(origin + '/login')
    await page.evaluate(value => localStorage.setItem('@wippy_token_info', JSON.stringify({ token: value })), token)
    await page.goto(origin + '/system/security')
    await shell.getByRole('tab', { name: 'Roles', exact: true }).waitFor({ timeout: 35000 })
    await button(shell, 'New role').first().waitFor()
    assert.equal(await shell.locator('body').evaluate(node => node.ownerDocument.defaultView.isSecureContext), true)
    await shot('security')
    await shell.getByRole('tab', { name: 'Settings', exact: true }).click()
    await shell.getByText('About KickSide', { exact: true }).first().waitFor()
    await shell.locator('wc-render-markdown .markdown-body').first().waitFor()
    await shot('settings')
    await shell.getByRole('tab', { name: 'Catalogs', exact: true }).click()
    const admin = shell.locator('kickside-pim-admin')
    const settings = admin.locator('kickside-pim-catalog-settings')
    const rail = settings.getByRole('navigation', { name: 'Catalog settings sections' })
    const region = name => settings.getByRole('region', { name, exact: true })
    async function section(name) {
      await button(rail, name).click()
      await region(name).getByRole('heading', { name, exact: true, level: 1 }).waitFor()
      return region(name)
    }
    async function add(root, action, label, value) {
      await button(root, action).click()
      const input = root.getByRole('textbox', { name: label, exact: true })
      await input.fill(value)
      await input.press('Enter')
    }
    async function review() {
      await button(settings, 'Review changes').click()
      const dialog = settings.getByRole('dialog', { name: 'Review changes' })
      await dialog.getByRole('heading', { name: 'Review changes' }).waitFor()
      return dialog
    }
    async function apply(dialog, name = 'Apply changes') {
      await button(dialog, name).click()
      await settings.getByText('Catalog changes applied.', { exact: true }).waitFor()
    }

    await task({ admin, settings, region, section, add, review, apply, shot })
    if (bundle) assert.ok(candidate.has('admin.js') && candidate.has('settings.js'), 'Both candidate entry points loaded')
  } finally {
    await page.close()
  }
}

async function walk({ admin, settings, region, section, add, review, apply, shot }, suffix) {
  const catalog = title + ' ' + suffix
  await button(admin, 'Create catalog').click()
  const create = admin.getByRole('dialog', { name: 'Create catalog' })
  await create.getByRole('textbox', { name: 'Catalog name' }).fill(catalog)
  await button(create, 'Create catalog').click()
  const overview = region('Overview')
  await overview.getByRole('heading', { name: 'Overview', exact: true }).waitFor()

  await check(suffix + ' catalog creation and Overview to Sources', async () => {
    const publishing = overview.locator('.pim-overview-card').filter({ hasText: 'Publishing and imports' })
    await publishing.getByText('0 channels · 0 sources', { exact: true }).waitFor()
    await button(publishing, 'View channels').waitFor()
    await overview.getByText('Catalog setup', { exact: true }).waitFor()
    await shot('overview')
    await button(publishing, 'Manage sources').scrollIntoViewIfNeeded()
    await shot('overview-publishing')
    await button(publishing, 'Manage sources').click()
    await region('Sources').getByRole('heading', { name: 'Sources', exact: true }).waitFor()
    console.log('STEPS catalog creation 3 / 2, then Sources 1 / 1 from Overview')
  })

  await check(suffix + ' field placement and family usage', async () => {
    const fields = await section('Fields')
    await add(fields, 'Add field group', 'Field group name', 'Basics')
    const group = fields.locator('.pim-definition-list').filter({ hasText: 'Basics' })
    await add(group, 'Add field', 'Field name', 'Size')
    await apply(await review())
    // The measured task starts with the group and its first field in place.
    await add(group, 'Add field', 'Field name', 'Care instructions')
    assert.equal(await group.getByText('Unused by families', { exact: true }).count(), 1)
    await group.getByText('Unused by families', { exact: true }).scrollIntoViewIfNeeded()
    await shot('fields')
    await button(fields, 'Open form layout').click()
    const layout = region('Form layout')
    await layout.getByText('No named family uses this group yet.', { exact: true }).waitFor()
    const placement = button(layout, 'Move Care instructions earlier')
    await placement.click()
    await shot('form-layout')
    await apply(await review(), 'Apply layout')
    assert.deepEqual(await layout.locator('.pim-lcard-name').allTextContents(), ['Care instructions', 'Size'])
    const width = layout.getByRole('group', { name: 'Width of Care instructions' })
    await button(width, '¼').click()
    await apply(await review(), 'Apply layout')
    await section('Fields')
    await section('Form layout')
    assert.equal(await button(width, '¼').getAttribute('aria-pressed'), 'true')
    assert.deepEqual(await layout.locator('.pim-lcard-name').allTextContents(), ['Care instructions', 'Size'])
    await button(layout, 'Open families').click()
    const families = region('Families')
    await add(families, 'Add family', 'Family name', 'Trail gear')
    await families.locator('.p-multiselect-dropdown').click()
    await families.getByRole('option', { name: 'Basics', exact: true }).click()
    if (await families.getByRole('combobox', { name: 'Field groups' }).getAttribute('aria-expanded') === 'true') {
      await families.locator('.p-multiselect-dropdown').click()
    }
    await section('Form layout')
    await layout.getByText('Used by Trail gear', { exact: true }).waitFor()
    await shot('form-layout-used')
    await section('Fields')
    assert.equal(await group.getByText('Used by Trail gear', { exact: true }).count(), 1)
    assert.equal(await group.locator('.pim-definition').getByText('Trail gear', { exact: true }).count(), 0)
    await shot('fields-used')
    await button(settings, 'Discard').click()
    console.log('STEPS add and place field 7 / 3')
  })

  await check(suffix + ' plugin activation and later configuration share review', async () => {
    const plugins = await section('Plugins')
    const inventory = plugins.locator('.pim-definition-list').first().locator('.pim-definition').filter({ hasText: /^Inventory/ })
    await inventory.getByRole('switch', { name: 'Enable Inventory' }).click()
    const hold = inventory.getByRole('spinbutton', { name: /Hold seconds/i })
    await hold.waitFor()
    await inventory.getByText(/Review changes.*Apply changes/).waitFor()
    await inventory.getByText(/an inventory reservation/i).waitFor()
    await plugins.getByText(/\d+ installed · 0 enabled here/).waitFor()
    await hold.fill('600')
    await hold.scrollIntoViewIfNeeded()
    await shot('plugins-pending')
    const activation = await review()
    await activation.getByText(/Hold seconds.*600/).waitFor()
    await shot('plugin-review')
    await apply(activation)
    assert.equal(await hold.inputValue(), '600')
    await plugins.getByText(/\d+ installed · 1 enabled here/).waitFor()

    await hold.fill('900')
    await settings.getByText('Catalog changes applied.', { exact: true }).waitFor({ state: 'hidden' })
    assert.equal(await button(inventory, 'Save configuration').count(), 0)
    const update = await review()
    await update.getByText(/Hold seconds.*900/).waitFor()
    await apply(update)
    await section('Overview')
    await section('Plugins')
    const row = inventory.locator('.pim-definition-toggle')
    if (await row.getAttribute('aria-expanded') !== 'true') await row.click()
    assert.equal(await hold.inputValue(), '900')
    await hold.scrollIntoViewIfNeeded()
    await shot('plugins-enabled')
    console.log('STEPS plugin activation 4 / 2, later edit from open row 3 / 2')
  })
}

try {
  const matrix = baseline ? [[1440, 'light']] : [[1440, 'light'], [1440, 'dark'], [390, 'light'], [390, 'dark']]
  for (const [width, theme] of matrix) {
    const suffix = width + '-' + theme
    await check('Fire shell ' + suffix, () => visit(width, theme, scope => walk(scope, suffix)))
  }
} finally {
  await browser.close()
}
process.exitCode = Number(failures > 0)
