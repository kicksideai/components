// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright'

const [session, board] = (await readFile('/dev/stdin', 'utf8')).trim().split('\n')
assert.ok(session && board, 'Provide a fresh session and scratch board on stdin')
const origin = 'http://localhost:' + (process.env.WORK_ADMIN_FIRE_PORT || '18160')
const candidatePort = process.env.WORK_ADMIN_ASSETS_PORT
const baseline = !!process.env.WORK_ADMIN_BASELINE
const browser = await chromium.launch()
const button = (root, name) => root.getByRole('button', { name, exact: true })
let failures = 0

async function run(width, colorScheme, walk) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 960 }, colorScheme })
  page.setDefaultTimeout(15000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const shell = page.frameLocator('iframe').first()
  const admin = shell.locator('kickside-work-admin')
  const rail = admin.getByRole('navigation', { name: 'Board settings sections' })
  const out = join('shots', width + '-' + colorScheme)
  await mkdir(out, { recursive: true })
  const shot = name => page.screenshot({ path: join(out, name + '.png'), fullPage: true, animations: 'disabled' })
  async function check(name, test) {
    try {
      await test()
      console.log('PASS', width, colorScheme, name)
    } catch (error) {
      failures++
      console.log('FAIL', width, colorScheme, name, '|', error.message.replaceAll(session, '[redacted]').replace(/\s+/g, ' ').slice(0, 800))
    }
  }
  async function section(name) {
    await button(rail, name).click()
    const content = admin.getByRole('region', { name, exact: true })
    await content.getByRole('heading', { name, exact: true }).first().waitFor()
    return content
  }
  async function review() {
    await button(admin, 'Review changes').click()
    const dialog = admin.getByRole('dialog', { name: 'Review changes' })
    await dialog.waitFor()
    return dialog
  }
  async function apply(dialog) {
    const response = page.waitForResponse(r => new URL(r.url()).pathname.endsWith('/apply_schema'))
    await button(dialog, 'Apply changes').click()
    const applied = await response
    const result = await applied.json()
    assert.ok(applied.ok() && result.success, 'Apply returned ' + applied.status() + ' ' + (result.error || ''))
    await dialog.waitFor({ state: 'hidden' })
    await admin.getByText('Unsaved changes', { exact: true }).waitFor({ state: 'hidden' })
  }
  async function schema() {
    const response = await page.request.post(origin + '/api/v1/work/boards/' + board + '/get_schema', {
      headers: { Authorization: 'Bearer ' + session }, data: { check_plugins: true },
    })
    assert.equal(response.status(), 200)
    return (await response.json()).data
  }

  try {
    if (candidatePort) {
      await page.route(url => url.pathname.startsWith('/kickside-work-admin/') && url.pathname.endsWith('.js'), async route => {
        const name = new URL(route.request().url()).pathname.split('/').pop()
        const response = await fetch('http://127.0.0.1:' + candidatePort + '/' + name)
        assert.ok(response.ok, 'Candidate asset ' + name)
        await route.fulfill({ body: Buffer.from(await response.arrayBuffer()), contentType: 'application/javascript' })
      })
    }
    await page.goto(origin + '/login')
    await page.evaluate(token => localStorage.setItem('@wippy_token_info', JSON.stringify({ token })), session)
    for (const [path, ready] of [
      ['security', () => shell.locator('.ks-scope-row').first()],
      ['settings', () => shell.getByRole('heading', { name: 'About KickSide', exact: true })],
    ]) {
      await page.goto(origin + '/system/' + path)
      await ready().waitFor()
      if (path === 'settings') await shell.locator('.ks-about-notices').getByText('Browser packages', { exact: true }).first().waitFor()
      await shot('reference-' + path)
    }
    await page.goto(origin + '/system/work/' + board + '/general')
    await button(rail, 'Plugins').waitFor()
    const plugins = await section('Plugins')
    const toggle = plugins.getByRole('switch', { name: 'Enable Work Planning' })
    const planning = plugins.locator('.work-definition').filter({ hasText: 'Work Planning' })
    await toggle.waitFor()
    if (walk) await check('one plugin state and one review-and-apply path', async () => {
      await toggle.click()
      await planning.getByText('Will enable on apply', { exact: true }).waitFor()
      assert.equal(await planning.getByText('Ready to use', { exact: true }).count(), 0)
      const types = planning.locator('fieldset').filter({ hasText: 'Plan these item types' })
      await button(types, 'Delivery task').click()
      await shot('plugins-pending')
      const activation = await review()
      await activation.getByText(/Plan these item types.*Delivery task/).waitFor()
      await apply(activation)
      await planning.getByText(/^(Enabled|Setting up)$/).waitFor()
      const activated = (await schema()).plugins.find(plugin => plugin.plugin === 'kickside.work.planning:plugin')
      assert.equal(activated.active, true)
      assert.deepEqual(activated.config.issue_types, ['task'])
      await section('General')
      await section('Plugins')
      const showConfiguration = await button(planning, 'Work Planning').getAttribute('aria-expanded') === 'false'
      if (showConfiguration) await button(planning, 'Work Planning').click()
      await button(types, 'Support request').click()
      assert.equal(await button(planning, 'Save plugin settings').count(), 0)
      const config = await review()
      await config.getByText(/Plan these item types.*Support request/).waitFor()
      await shot('plugin-review')
      await apply(config)
      assert.deepEqual((await schema()).plugins.find(plugin => plugin.plugin === 'kickside.work.planning:plugin').config.issue_types.toSorted(), ['support', 'task'])
      console.log('STEPS activation from General 5, later edit from General ' + (showConfiguration ? 5 : 4))
    })
    if (await button(planning, 'Work Planning').getAttribute('aria-expanded') === 'false') await button(planning, 'Work Planning').click()
    const configure = planning.locator('fieldset').filter({ hasText: 'Plan these item types' })
    if (await configure.isVisible()) await configure.scrollIntoViewIfNeeded()
    await shot('plugins')

    const links = await section('Links')
    await check('single symmetric label', async () => {
      const relation = links.locator('.work-definition').filter({ hasText: 'relates to' })
      assert.equal((await relation.locator('.work-definition-head').innerText()).match(/relates to/g)?.length, 1)
    })
    await shot('links-list')
    const blocks = links.locator('.work-definition').filter({ hasText: 'blocks' })
    await button(blocks, 'blocks').click()
    await check('named target picker and peer ID disclosure', async () => {
      const target = blocks.locator('fieldset').filter({ hasText: 'Target item types' })
      await button(target, 'Support request').waitFor()
      assert.equal(await blocks.getByRole('textbox', { name: 'Target type ID' }).count(), 0)
      await button(blocks, 'Peer board target types').waitFor()
      if (walk) {
        await button(target, 'Support request').click()
        const dialog = await review()
        await apply(dialog)
        assert.deepEqual((await schema()).declaration.relation_types.find(link => link.id === 'blocks').to_types, ['support'])
        console.log('STEPS change a local link target from General 5')
      }
    })
    if (baseline) await check('baseline local target via raw ID', async () => {
      const input = blocks.getByRole('textbox', { name: 'Target type ID' })
      await button(blocks, 'Add target type').click()
      await input.fill('support')
      await input.press('Enter')
      await apply(await review())
      assert.deepEqual((await schema()).declaration.relation_types.find(link => link.id === 'blocks').to_types, ['support'])
      console.log('STEPS baseline local link target from General 7')
    })
    const targetPicker = blocks.locator('fieldset').filter({ hasText: 'Target item types' })
    if (await targetPicker.isVisible()) await targetPicker.scrollIntoViewIfNeeded()
    await shot('links')

    const access = await section('Access')
    const advanced = button(access, 'Advanced · Item visibility')
    await check('closed Advanced visibility has no trailing border', async () => {
      assert.equal(await advanced.evaluate(node => getComputedStyle(node.parentElement).borderBottomWidth), '0px')
    })
    if (width === 390) await check('active highlight spans the padded rail', async () => {
      const [item, content] = await button(rail, 'Access').evaluate(node => {
        const nav = node.closest('nav')
        const style = getComputedStyle(nav)
        return [node.getBoundingClientRect().width, nav.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)]
      })
      assert.ok(Math.abs(item - content) < 1, 'active ' + item + ' px, rail content ' + content + ' px')
      console.log('MEASURE active Access and rail', width, colorScheme, item, content)
    })
    await advanced.click()
    await check('expanded Advanced visibility has no trailing border', async () => {
      assert.equal(await advanced.evaluate(node => getComputedStyle(node.parentElement).borderBottomWidth), '0px')
    })
    await check('visibility field shows no additional restriction', async () => {
      const visibility = access.getByRole('combobox', { name: 'Visibility field' })
      assert.equal((await visibility.innerText()).trim(), 'No additional restriction')
    })
    await access.getByRole('combobox', { name: 'Visibility field' }).evaluate(async node => {
      const disclosure = node.closest('.work-visibility-disclosure')
      await Promise.allSettled((disclosure?.getAnimations({ subtree: true }) ?? []).map(animation => animation.finished))
      node.scrollIntoView({ block: 'center' })
    })
    await shot('access')

    const types = await section('Item types')
    await check('compact item type rows', async () => {
      const rows = await types.locator('.work-definition-head:visible').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height))
      assert.ok(rows.length >= 2 && rows.every(height => height <= 68), 'row heights ' + rows.join(', '))
      console.log('MEASURE item type rows', width, colorScheme, rows.join(', '))
    })
    await shot('item-types')
    await check('no page errors', () => assert.deepEqual(errors, []))
  } finally {
    await page.close()
  }
}

try {
  if (baseline) await run(390, 'light', true)
  else for (const width of [1440, 390]) for (const theme of ['light', 'dark']) {
    await run(width, theme, !process.env.WORK_ADMIN_LAYOUT_ONLY && width === 1440 && theme === 'light')
  }
} finally {
  await browser.close()
}
process.exitCode = Number(failures > 0)
