// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { mkdir, readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright'

const [session, fixtureId] = (await readFile('/dev/stdin', 'utf8')).trim().split('\n')
assert.ok(session && fixtureId, 'Pass a fresh administrator session and a unique fixture ID on stdin')
const origin = 'http://localhost:18160'
const port = process.env.WORK_SETUP_FIRE_PORT || '18160'
const baseline = process.env.WORK_SETUP_BASELINE === '1'
const scope = process.env.WORK_SETUP_CHECKS || 'tasks'
const candidate = process.env.WORK_SETUP_STATIC
const output = process.env.WORK_SETUP_SHOTS || 'shots'
const [width, theme] = (process.env.WORK_SETUP_VIEW || '').split('-')
const views = width ? [[Number(width), theme]] : [[1440, 'light'], [1440, 'dark'], [390, 'light'], [390, 'dark']]
const args = port === '18160' ? [] : ['--host-resolver-rules=MAP localhost 127.0.0.1:' + port]
const browser = await chromium.launch({ args })
const button = (root, name) => root.getByRole('button', { name, exact: true })
const textbox = (root, name) => root.getByRole('textbox', { name, exact: true })
let failures = 0

async function run(width, theme, index) {
  const page = await browser.newPage({
    viewport: { width, height: width === 390 ? 844 : 960 }, colorScheme: theme, reducedMotion: 'reduce',
  })
  page.setDefaultTimeout(10000)
  const shell = page.frameLocator('iframe').first()
  const root = shell.locator('kickside-work-admin')
  const rail = root.getByRole('navigation', { name: 'Board settings sections' })
  const pane = name => root.getByRole('region', { name, exact: true })
  const folder = join(output, width + '-' + theme)
  await mkdir(folder, { recursive: true })
  let steps = 0
  const click = async locator => { await locator.click(); steps++ }
  const fill = async (locator, value) => { await locator.fill(value); steps++ }
  const shot = name => page.screenshot({ path: join(folder, name + '.png'), fullPage: true })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  async function check(name, operation) {
    try {
      const details = await operation()
      console.log('PASS %s %s%s', width + '-' + theme, name, details ? ' | ' + details : '')
    } catch (error) {
      failures++
      console.log('FAIL %s %s | %s', width + '-' + theme, name, String(error.message).replaceAll(session, '[redacted]').replace(/\s+/g, ' '))
    }
  }
  async function tab(name) {
    await shell.getByRole('tab', { name, exact: true }).click()
  }
  async function createBoard(kind, pack) {
    const all = button(rail, 'All boards')
    if (await all.isVisible()) await all.click()
    steps = 0
    const title = 'Flow setup ' + fixtureId + ' ' + index + kind
    await click(button(root.locator('.work-board-directory'), 'Create board'))
    const dialog = root.getByRole('dialog', { name: 'New board' })
    await fill(textbox(dialog, 'Title'), title)
    await fill(textbox(dialog, 'Item key prefix'), 'Z' + fixtureId.toUpperCase() + index + kind)
    await click(button(dialog, 'Continue'))
    if (pack) await click(dialog.getByRole('button', { name: /Project Tracker/ }))
    else await dialog.getByRole('button', { name: /^Empty board/ }).waitFor()
    await click(button(dialog, 'Create board'))
    await pane('General').getByRole('heading', { name: 'General', exact: true }).waitFor()
    await dialog.waitFor({ state: 'hidden' })
    return title
  }
  async function shareDialog() {
    await click(button(pane('Access'), 'Share board'))
    const dialog = shell.getByRole('dialog', { name: 'Share', exact: true })
    await dialog.waitFor()
    return dialog
  }

  try {
    if (candidate) {
      const files = new Set(await readdir(candidate))
      await page.route(url => url.pathname.startsWith('/kickside-work-admin/') && url.pathname.endsWith('.js'), route => {
        const file = new URL(route.request().url()).pathname.split('/').at(-1)
        assert.ok(files.has(file), 'Unknown Work Admin asset ' + file)
        return route.fulfill({ path: join(candidate, file), contentType: 'application/javascript' })
      })
    }
    await page.goto(origin + '/login')
    await page.evaluate(token => localStorage.setItem('@wippy_token_info', JSON.stringify({ token })), session)
    await page.goto(origin + '/system/security')
    await shell.locator('.ks-scope-row').first().waitFor()
    await shot('reference-security')
    await tab('Settings')
    await button(shell, 'All settings').waitFor()
    await shell.locator('.ks-about-notices').getByText('Browser packages', { exact: true }).first().waitFor()
    await shot('reference-settings')
    await tab('Work')
    await root.waitFor()

    if (scope !== 'permissions') {
      await check('item setup', async () => {
        await createBoard('E', false)
        await shot('empty-board-general')
        steps = 0
        const type = 'Request'
        const field = 'Customer reference'
        const workflow = 'Request review'
        const items = pane('Item types')
        const row = items.locator('article').filter({ hasText: type })
        await click(button(rail, 'Item types'))
        await click(button(items, 'Add item type'))
        await fill(textbox(items, 'Item type name'), type)
        await click(button(items, 'Add item type'))
        if (baseline) {
          await click(button(items, type))
          await check('field creation action', () => button(row, 'Create a field').waitFor({ timeout: 2000 }))
          await check('workflow creation action', () => button(row, 'Create a workflow').waitFor({ timeout: 2000 }))
          await click(button(rail, 'Fields'))
          await click(button(pane('Fields'), 'Add field'))
        } else {
          await button(row, 'Create a field').waitFor()
          await shot('item-type-selectors')
          await click(button(row, 'Create a field'))
          assert.match(await pane('Fields').getByRole('combobox', { name: 'Filter fields by item type' }).innerText(), /Request/)
        }
        const fields = pane('Fields')
        await fill(textbox(fields, 'Field name'), field)
        if (baseline) {
          await click(button(fields, type))
        } else {
          assert.equal(await button(fields, type).getAttribute('aria-pressed'), 'true')
          await shot('field-creation')
        }
        await click(button(fields, 'Add field'))
        if (baseline) {
          await click(button(rail, 'Workflow'))
          await click(button(pane('Workflow'), 'New process'))
        } else {
          await button(row, field).waitFor()
          await click(button(row, 'Create a workflow'))
        }
        const create = root.getByRole('dialog', { name: 'New process', exact: true })
        await fill(textbox(create, 'New process name'), workflow)
        await shot('workflow-creation')
        await click(button(create, 'Create process'))
        if (baseline) {
          await click(button(rail, 'Item types'))
          if (!await row.getByRole('combobox', { name: 'Workflow' }).isVisible()) await click(button(row, type))
          await click(row.getByRole('combobox', { name: 'Workflow' }))
          await click(row.getByRole('option', { name: workflow }))
        }
        assert.match(await row.getByRole('combobox', { name: 'Workflow' }).innerText(), /Request review/)
        await button(row, field).waitFor()
        await shot('item-type-return')
        if (width === 390) {
          await button(row, field).scrollIntoViewIfNeeded()
          await shot('item-type-field-attached')
        }
        await click(button(root, 'Review changes'))
        const review = root.getByRole('dialog', { name: 'Review changes', exact: true })
        const changes = review.getByRole('table')
        for (const name of [type, field, workflow]) await changes.getByText(name, { exact: false }).first().waitFor()
        await shot('review-three-definitions')
        assert.equal(await review.getByText(/^Existing items .* will follow the updated workflow\.$/).count(), 0,
          'A new workflow has no existing items')
        await click(button(review, 'Apply changes'))
        await root.getByText('Board changes applied.', { exact: true }).waitFor()
        assert.equal(steps, 12)
        await button(row, type).click()
        await button(row, 'Create a field').click()
        await textbox(fields, 'Field name').fill('Canceled field')
        await button(fields, 'Cancel').click()
        await button(row, 'Create a workflow').click()
        await textbox(create, 'New process name').fill('Canceled workflow')
        await button(create, 'Cancel').click()
        await button(row, field).waitFor()
        assert.match(await row.getByRole('combobox', { name: 'Workflow' }).innerText(), /Request review/)
        assert.equal(await button(root, 'Review changes').count(), 0, 'Canceled editors leave the saved type unchanged')
        return '19 → ' + steps + ' steps'
      })
      if (baseline) {
        if (await root.getByRole('dialog', { name: 'Review changes' }).isVisible()) {
          await page.keyboard.press('Escape')
        }
        if (await button(root, 'Discard').isVisible()) await button(root, 'Discard').click()
      }
    }

    if (scope === 'permissions') {
      await check('permission descriptions next to their choices', async () => {
        await createBoard('P', false)
        await button(rail, 'Access').click()
        const dialog = await shareDialog()
        await dialog.getByRole('button', { name: 'Write', exact: true }).first().waitFor()
        await shot('share-permission-effects')
        const missing = []
        for (const [name, description] of [
          ['Read', 'View this item'], ['Write', 'Edit this item'],
          ['Delete', 'Delete this item'], ['Admin', 'Manage access and sharing'],
        ]) {
          const choice = dialog.getByRole('button', { name: new RegExp('^' + name + '\\b') }).first()
          if (!await choice.getByText(description, { exact: true }).isVisible()) missing.push(name)
        }
        assert.deepEqual(missing, [], 'Permission effects must be visible without hovering')
      })
    } else {
      await check('create a team board and share it', async () => {
        const title = await createBoard('T', true)
        await shot('team-board-general')
        const cue = button(pane('General'), 'Share board')
        await cue.waitFor({ timeout: baseline ? 2000 : 10000 })
        await click(cue)
        const sharingStart = steps - 1
        await pane('Access').waitFor()
        await shot('board-access')
        const dialog = await shareDialog()
        await dialog.getByText('Share · ' + title, { exact: true }).waitFor()
        await click(dialog.getByText('Select a person or group…', { exact: true }))
        const search = dialog.getByRole('combobox', { name: 'Search people or groups' })
        await fill(search, process.env.WORK_SETUP_PRINCIPAL || 'Samira')
        const principal = dialog.getByRole('option').first()
        const principalLabel = await principal.locator('.kpp-copy strong').innerText()
        await click(principal)
        await click(dialog.getByRole('button', { name: /^Write\b/ }).first())
        await shot('share-read-and-write')
        await click(button(dialog, 'Share'))
        const grant = dialog.locator('.kxs-row').filter({ hasText: principalLabel })
        for (const capability of ['Read', 'Write']) {
          await button(grant, capability).and(grant.locator('.kxs-cap-on')).waitFor()
        }
        await shot('share-grant-saved')
        assert.equal(steps, 13)
        assert.equal(steps - sharingStart, 7)
        return 'team board 13 → ' + steps + ' steps, grant from General 7 → ' + (steps - sharingStart) + ' steps'
      })
    }
    await check('browser errors', () => assert.deepEqual(errors, []))
  } finally {
    await page.close()
  }
}
try {
  for (const [index, [width, theme]] of views.entries()) {
    try { await run(width, theme, index) }
    catch (error) {
      failures++
      console.log('FAIL %s-%s setup | %s', width, theme, String(error.message).replaceAll(session, '[redacted]').replace(/\s+/g, ' '))
    }
  }
} finally {
  await browser.close()
}
process.exitCode = failures ? 1 : 0
