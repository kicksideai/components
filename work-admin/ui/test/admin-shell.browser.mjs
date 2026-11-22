// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { mkdir, readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright'

const origin = 'http://localhost:18160'
const tunnel = process.env.ADMIN_SHELL_FIRE_PORT || '18160'
const evidence = process.env.ADMIN_SHELL_SHOTS || 'shots'
const runs = Number(process.env.ADMIN_SHELL_RUNS || 1)
assert.ok(Number.isSafeInteger(runs) && runs > 0, 'ADMIN_SHELL_RUNS must be a positive integer')
const session = (await readFile('/dev/stdin', 'utf8')).trim()
assert.ok(session, 'A fresh local administrator session must be piped on stdin')

const button = (root, name) => root.getByRole('button', { name, exact: true })
const reviewDialog = root => root.locator('dialog[aria-label="Review changes"]')
const animationEnd = async node => {
  // Closing a native dialog can cancel its CSS transitions when it leaves the top layer.
  await Promise.allSettled(node.getAnimations({ subtree: true }).map(animation => animation.finished))
}
const css = (locator) => locator.evaluate(node => {
  const box = node.getBoundingClientRect()
  const style = getComputedStyle(node)
  return {
    width: Math.round(box.width), x: Math.round(box.x), y: Math.round(box.y),
    background: style.backgroundColor, padding: style.padding, border: style.borderInlineEnd,
  }
})
const settledBackground = async locator => {
  await locator.evaluate(animationEnd)
  return locator.evaluate(node => getComputedStyle(node).backgroundColor)
}

let failures = 0

async function run(browser, width, colorScheme, capture) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 960 }, colorScheme })
  page.setDefaultTimeout(15000)
  const shell = page.frameLocator('iframe').first()
  const errors = []
  page.on('pageerror', error => errors.push(error.message.replaceAll(session, '[redacted]')))
  const out = join(evidence, width + '-' + colorScheme)
  if (capture) await mkdir(out, { recursive: true })

  async function check(id, operation) {
    try {
      await operation()
      console.log('PASS ' + width + ' ' + colorScheme + ' ' + id)
    } catch (error) {
      failures++
      console.log('FAIL ' + width + ' ' + colorScheme + ' ' + id + ' | ' + String(error.message).replaceAll(session, '[redacted]').replace(/\s+/g, ' ').slice(0, 1000))
    }
  }

  async function shot(name) {
    if (!capture) return
    await page.screenshot({ path: join(out, name + '.png'), fullPage: true })
  }

  async function navigate(tab) {
    const target = shell.getByRole('tab', { name: tab[0].toUpperCase() + tab.slice(1), exact: true })
    await target.waitFor()
    if (await target.getAttribute('aria-selected') !== 'true') await target.click()
  }

  const assets = new Set()
  async function installCandidateRoutes() {
    if (!process.env.ADMIN_SHELL_STATIC) return
    for (const module of ['work-admin', 'pim-admin']) {
      const path = join(process.env.ADMIN_SHELL_STATIC, module)
      const files = new Set(await readdir(path))
      await page.route(url => url.pathname.startsWith('/kickside-' + module + '/') && url.pathname.endsWith('.js'), async route => {
        const name = new URL(route.request().url()).pathname.split('/').at(-1)
        assert.ok(files.has(name), 'Unexpected deployed asset in candidate: ' + name)
        await route.fulfill({ path: join(path, name), contentType: 'application/javascript' })
        assets.add(module + '/' + name)
      })
    }
  }

  async function admin({ route, label, plural, tag, first, other }) {
    await navigate(route)
    const root = shell.locator('kickside-' + tag)
    const rail = root.getByRole('navigation', { name: label + ' settings sections', exact: true })
    const all = button(rail, 'All ' + plural.toLowerCase())
    const picker = root.locator('.work-board-directory, .pim-catalog-picker')
    const rows = picker.locator('.picker-row:enabled')
    const row = tag === 'pim-admin' ? rows.filter({ hasText: 'Alder & Coast' }) : rows.first()
    const header = () => root.locator('.system-section-head:visible')
    const clean = async () => {
      assert.equal(await button(header(), 'Review changes').count(), 0, 'clean header review')
      assert.equal(await button(header(), 'Discard').count(), 0, 'clean header discard')
      assert.equal(await header().getByText('Unsaved changes', { exact: true }).count(), 0)
      assert.equal(await button(header(), 'Share board').count(), 0, 'sharing belongs in Access')
    }

    await root.waitFor()
    await Promise.race([all.waitFor(), row.waitFor()])
    if (await all.isVisible()) await all.click()
    await row.waitFor()
    await shot(route + '-picker')
    const pickerBox = await css(picker)
    const pickerBodyPadding = (await css(picker.locator('.kx-rail-body'))).padding
    const pickerHeadText = await picker.locator('.kx-railhead').innerText()
    const pickerHead = picker.locator('.kx-railhead-title')
    const pickerHeadBox = await css(pickerHead)
    await check(route + ' S5 single-group label', async () => {
      assert.equal(await picker.getByText('Available', { exact: true }).count(), 0)
    })
    await row.click()
    await button(rail, first).waitFor()
    await header().getByRole('heading', { name: first, exact: true }).waitFor()
    await shot(route + '-' + first.toLowerCase())
    await check(route + ' S1 stable rail and header', async () => {
      if (tag === 'work-admin') {
        assert.ok(await rail.evaluate(node => node.parentElement.classList.contains('kx-settings-rail-standalone')))
        assert.equal(await root.locator('.kx-railhead:visible').count(), 0, 'directory heading stays in the picker')
        if (width === 1440) assert.equal((await css(rail)).width, pickerBox.width)
        return
      }
      const frame = root.locator('.kx-settings-list-rail:visible').or(rail).first()
      assert.deepEqual(await css(frame), pickerBox, 'rail dimensions, background and padding')
      assert.equal((await css(frame.locator('.kx-rail-body'))).padding, pickerBodyPadding, 'scroll body padding')
      assert.equal(await frame.locator('.kx-railhead').innerText(), pickerHeadText, 'same title and count')
      const openedHeadBox = await css(root.locator('.kx-railhead-title:visible'))
      assert.deepEqual([openedHeadBox.x, openedHeadBox.y], [pickerHeadBox.x, pickerHeadBox.y], 'rail title position')
    })
    await check(route + ' directory actions belong to the picker', async () => {
      assert.equal(await root.locator('.kx-railhead:visible button').count(), 0)
      assert.ok(await all.isVisible())
    })
    await check(route + ' S3 clean actions', clean)
    const activeColor = await settledBackground(button(rail, first))
    const sections = tag === 'work-admin' && await button(rail, 'Items').count()
      ? other.map(name => name === 'Item types' ? 'Items' : name).filter(name => !['Fields', 'Links'].includes(name))
      : other
    for (const section of sections) {
      const item = button(rail, section)
      await item.click()
      await header().getByRole('heading', { name: section, exact: true }).waitFor()
      const hoveredColor = await settledBackground(item)
      await shot(route + '-' + (section === 'Item types' ? 'items' : section.toLowerCase().replaceAll(' ', '-')))
      await check(route + ' S2 ' + section + ' selection', async () => {
        assert.equal(await item.getAttribute('aria-current'), 'true')
        assert.equal(await rail.locator('[aria-current="true"]').count(), 1)
        assert.equal(hoveredColor, activeColor, 'pointer must not replace primary tint')
        await page.mouse.move(width - 2, 2)
        assert.equal(await settledBackground(item), activeColor, 'selected tint persists after pointer leaves')
        assert.notEqual(await settledBackground(button(rail, first)), activeColor)
      })
      await check(route + ' S4 ' + section + ' header', async () => {
        assert.equal(await header().locator('h1').count(), 1)
        assert.equal(await header().locator('p').count(), 1)
        assert.equal(await root.locator('.work-section-facts:visible, .pim-section-facts:visible, .work-section-summary:visible').count(), 0)
        const duplicates = {
          Items: 'Choose the fields, parent relationships and workflow for each kind of work.',
          'Item types': 'Choose the fields, parent relationships and workflow for each kind of work.',
          Workflow: 'Select a state or a named transition to edit it.',
          Plugins: 'Board capabilities',
          Families: 'Product families',
          Fields: 'Field groups',
          Channels: 'Release destinations',
        }
        if (duplicates[section]) {
          const pane = root.getByRole('region', { name: section, exact: true })
          const repeats = pane.getByText(duplicates[section], { exact: true }).and(root.locator(':visible'))
          const inHeader = header().getByText(duplicates[section], { exact: true })
          assert.equal(await repeats.count(), await inHeader.count(), 'section description is not repeated in the body')
        }
      })
    }

    if (tag === 'work-admin') {
      await check(route + ' S3 board sharing in Access', async () => {
        await button(rail, 'Access').click()
        await button(root, 'Share board').waitFor()
        await shot(route + '-access')
        assert.equal(await button(root, 'Share board').count(), 1)
        assert.equal(await button(header(), 'Share board').count(), 0)
      })
      await button(rail, first).click()
      const prefix = root.locator('input[form]:visible').first()
      await prefix.fill('ZZSHELL')
    } else {
      await button(rail, 'Fields').click()
      const fields = root.getByRole('region', { name: 'Fields', exact: true })
      const filter = fields.getByRole('combobox', { name: 'Show fields for a family' })
      await check('Fields family filter fits beside Add field group', async () => {
        const a = await filter.boundingBox()
        const b = await button(fields, 'Add field group').boundingBox()
        assert.ok(a && b && a.width <= 240 && a.x + a.width < b.x && Math.abs(a.y - b.y) <= 6)
      })
      const identity = fields.locator('.pim-definition-list').filter({ has: page.getByRole('heading', { name: 'Identity', exact: true }) })
      await check('Fields reorder actions have a distinct column and omit unavailable moves', async () => {
        const actions = identity.locator('[data-column="actions"]')
        const usage = identity.locator('[data-column="usage"]')
        const first = actions.first()
        const middle = actions.nth(1)
        const last = actions.last()
        assert.equal(await first.getByRole('button', { name: /earlier$/ }).count(), 0)
        assert.equal(await last.getByRole('button', { name: /later$/ }).count(), 0)
        assert.equal(await middle.getByRole('button').count(), 2)
        const [up, down] = await Promise.all([middle.getByRole('button', { name: /earlier$/ }).boundingBox(), middle.getByRole('button', { name: /later$/ }).boundingBox()])
        const used = await usage.nth(1).boundingBox()
        assert.ok(used && up && down && up.x - (used.x + used.width) >= 8, 'clear separation after Used by')
        assert.ok(down.x - (up.x + up.width) >= 4, 'icon button gap')
        if (width === 1440) await identity.getByText('Actions', { exact: true }).waitFor()
        await button(middle, 'Move Brand earlier').press('Enter')
        const moveBack = button(first, 'Move Brand later')
        assert.ok(await moveBack.evaluate(node => node.getRootNode().activeElement === node), 'focus follows the moved field')
        await moveBack.click()
      })
      await button(rail, 'Families').click()
      const families = root.getByRole('region', { name: 'Families', exact: true })
      await families.getByRole('button', { name: /^Trail packs/ }).click()
      await shot('catalogs-family-open')
      await check('Families show unique field names without a group suffix', async () => {
        assert.equal(await button(families, 'Remove Color').count(), 1)
        assert.equal(await button(families, 'Remove Color (Specifications)').count(), 0)
      })
      await check('Families disambiguate matching field names with muted groups', async () => {
        await button(rail, 'Fields').click()
        await button(identity, 'Add field').click()
        await identity.getByRole('textbox', { name: 'Field name' }).fill('Sku code')
        await button(identity, 'Add field').click()
        await button(rail, 'Families').click()
        await families.getByRole('button', { name: /^Trail packs/ }).click()
        await button(families, 'Add requirement').click()
        await families.getByRole('textbox', { name: 'Requirement name' }).fill('Browser label check')
        await button(families, 'Add requirement').click()
        const picker = families.getByRole('combobox', { name: 'Required', exact: true }).last()
        await picker.click()
        for (const group of ['Identity', 'Packaging']) {
          const option = families.getByRole('option', { name: 'Sku code ' + group, exact: true })
          const secondary = option.getByText(group, { exact: true })
          assert.equal(await secondary.count(), 1)
          assert.ok(await secondary.evaluate(node => getComputedStyle(node).color !== getComputedStyle(node.parentElement).color))
        }
        await families.getByRole('option', { name: 'Sku code Identity', exact: true }).scrollIntoViewIfNeeded()
        await shot('catalogs-family-matching-fields')
        await families.getByRole('option', { name: 'Sku code Identity', exact: true }).click()
        await button(families, 'Remove Sku code Identity').waitFor()
      })
      // Remove the draft-only field when present before starting the review flow.
      const draftDiscard = button(header(), 'Discard')
      if (await draftDiscard.isVisible()) await draftDiscard.click()
      await button(rail, 'Channels').click()
      const add = button(root, 'Add channel')
      if (await add.isEnabled()) await add.click()
      await root.getByRole('textbox', { name: 'Channel name' }).or(root.getByPlaceholder('Channel name')).first().fill('Shell test draft')
      await add.click()
    }
    await shot(route + '-dirty')
    await check(route + ' S3 dirty actions and discard', async () => {
      const changes = header().getByText('Unsaved changes', { exact: true })
      const discard = button(header(), 'Discard')
      const review = button(header(), 'Review changes')
      await changes.waitFor()
      assert.ok(await discard.isEnabled())
      assert.ok(await review.isEnabled())
      const labels = await header().locator('button').allTextContents().then(labels => labels.map(text => text.trim()))
      await review.click()
      const dialog = reviewDialog(root)
      await dialog.and(root.locator('dialog[open]:not([aria-busy="true"])')).waitFor()
      assert.equal(await dialog.getAttribute('aria-modal'), 'true')
      await dialog.evaluate(animationEnd)
      assert.ok(await button(dialog, 'Apply changes').isEnabled(), 'the impact plan is ready')
      await shot(route + '-review')
      await page.keyboard.press('Escape')
      await dialog.and(root.locator('dialog:not([open])')).waitFor({ state: 'attached' })
      await dialog.evaluate(animationEnd)
      await root.getByRole('dialog', { name: 'Review changes' }).waitFor({ state: 'hidden' })
      await discard.click()
      const confirm = shell.getByRole('dialog', { name: /Discard/ })
      if (await confirm.isVisible()) await button(confirm, 'Discard').click()
      await changes.waitFor({ state: 'hidden' })
      assert.deepEqual(labels, ['Discard', 'Review changes'])
      await clean()
    })
    await check(route + ' create action in the directory rail', async () => {
      await all.click()
      await button(picker.locator('.kx-railhead'), 'Create ' + label.toLowerCase()).click()
      const dialog = root.getByRole('dialog', { name: tag === 'work-admin' ? 'New board' : 'Create catalog', exact: true })
      await dialog.waitFor()
      await page.keyboard.press('Escape')
      await dialog.waitFor({ state: 'hidden' })
      await row.waitFor()
    })
  }

  try {
    await installCandidateRoutes()
    await page.goto(origin + '/login')
    await page.evaluate(token => localStorage.setItem('@wippy_token_info', JSON.stringify({ token })), session)
    await page.goto(origin + '/system/security')
    for (const name of ['security', 'settings']) {
      await check('System ' + name + ' reference', async () => {
        await navigate(name)
        if (name === 'security') {
          const role = shell.locator('.ks-scope-row').first()
          await role.waitFor()
          await shot(name)
          await role.click()
          await shell.locator('.ks .ks-builder-title').waitFor()
          assert.ok(await role.isVisible())
          assert.ok(await button(shell.locator('.ks .kx-railhead'), 'New role').isVisible())
          assert.ok(await button(shell.locator('.ks .kx-railhead'), 'Refresh').isVisible())
        }
        else {
          await shell.getByRole('button', { name: 'All settings', exact: true }).waitFor()
          await shell.getByRole('heading', { name: 'About KickSide', exact: true }).waitFor()
          await shell.locator('.ks-about-notices').getByText('Browser packages', { exact: true }).first().waitFor()
        }
        await shot(name === 'security' ? 'security-role-open' : name)
      })
    }
    await check('Work admin flow', () => admin({
      route: 'work', label: 'Board', plural: 'Boards', tag: 'work-admin', first: 'General', other: ['Item types', 'Fields', 'Links', 'Workflow', 'Plugins'],
    }))
    await check('PIM admin flow', () => admin({
      route: 'catalogs', label: 'Catalog', plural: 'Catalogs', tag: 'pim-admin', first: 'Overview', other: ['Families', 'Fields', 'Channels'],
    }))
    await check('no uncaught browser errors', () => assert.deepEqual(errors, []))
    if (process.env.ADMIN_SHELL_STATIC) await check('candidate entry points served', () => {
      for (const module of ['work-admin', 'pim-admin']) {
        for (const entry of ['admin.js', 'settings.js']) assert.ok(assets.has(module + '/' + entry), module + '/' + entry)
      }
    })
  } catch (error) {
    if (capture) await page.screenshot({ path: join(out, 'startup-failure.png'), fullPage: true })
    await check('shell startup', () => { throw error })
    if (errors.length) console.log(errors.join(' | '))
  } finally {
    await page.close()
  }
}

for (let index = 1; index <= runs; index++) {
  const browser = await chromium.launch({
    args: tunnel === '18160' ? [] : ['--host-resolver-rules=MAP localhost 127.0.0.1:' + tunnel],
  })
  try {
    for (const width of [1440, 390]) {
      for (const scheme of ['light', 'dark']) await run(browser, width, scheme, index === 1)
    }
  } finally {
    await browser.close()
  }
  if (failures) break
  console.log('PASS Fire run ' + index + '/' + runs)
}
if (failures) process.exitCode = 1
