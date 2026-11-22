// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
// Run in Chromium on Fire with a short-lived administrator session on stdin.
import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { chromium } from 'playwright'

const input = []
for await (const chunk of process.stdin) input.push(chunk)
const token = Buffer.concat(input).toString().trim()
assert.ok(token, 'Administrator session expected on stdin')
const tunnelPort = process.env.ADMIN_SYSTEM_FIRE_PORT || '18187'
assert.match(tunnelPort, /^\d{1,5}$/)
const browser = await chromium.launch({ args: ['--host-resolver-rules=MAP localhost 127.0.0.1:' + tunnelPort] })
const page = await browser.newPage()
page.on('pageerror', error => console.log('PAGE ERROR ' + error.message.replaceAll(token, '[redacted]')))
const origin = 'http://localhost:18160'
if (process.argv[2] === 'candidate') await page.route(url => url.origin === origin, async route => {
  const path = new URL(route.request().url()).pathname
  const file = path.split('/').at(-1)
  const owner = ['work', 'pim'].find(name => path.startsWith('/kickside-' + name + '-admin/'))
  const replacement = owner && owner + '-adoption-dist/' + file
  if (replacement && await access(replacement).then(() => true, () => false)) await route.fulfill({ path: replacement })
  else await route.continue()
})
const shell = page.frameLocator('iframe').first()
const exact = (role, name, root = shell) => root.getByRole(role, { name, exact: true })
let failures = 0
page.setDefaultTimeout(8000)

async function test(name, run) {
  if (process.argv[3] && !name.startsWith(process.argv[3])) return
  try {
    await run()
    console.log('PASS ' + name)
  } catch (error) {
    failures++
    console.log('FAIL ' + name + ' at ' + new URL(page.url()).pathname + ' | ' + error.message.split('\nCall log:')[0].replaceAll(token, '[redacted]'))
  }
}

async function open(tab) {
  await page.goto(origin + '/system/' + tab)
  await exact('heading', 'System').waitFor()
}

async function verifyReload(tab, section, rows, activate) {
  await open(tab)
  await activate()
  await exact('button', section).click()
  const sectionKey = section === 'Item types' ? 'items' : section.toLowerCase()
  await page.waitForURL(url => url.pathname.endsWith('/' + sectionKey))
  const row = rows.first()
  const title = (await row.textContent()).trim()
  await row.click()
  await page.waitForURL(url => url.pathname.split('/').filter(Boolean).length === 5)
  const location = page.url()
  await page.reload()
  await rows.first().waitFor()
  assert.equal((await rows.first().textContent()).trim(), title)
  assert.equal(await rows.first().getAttribute('aria-expanded'), 'true')
  await page.goBack()
  await page.waitForURL(url => url.pathname.split('/').filter(Boolean).length === 4)
  assert.equal(await row.getAttribute('aria-expanded'), 'false')
  await page.goForward()
  await page.waitForURL(location)
  assert.equal(await row.getAttribute('aria-expanded'), 'true')
}

const catalog = () => shell.getByRole('button', { name: /Alder & Coast/ }).click()
const work = shell.locator('kickside-work-board-settings')
const pim = shell.locator('kickside-pim-catalog-settings')
try {
  await page.goto(origin + '/login')
  await page.evaluate(value => localStorage.setItem('@wippy_token_info', JSON.stringify({ token: value })), token)
  await test('Work board, section, and item type survive refresh, Back, and Forward', async () => {
    await verifyReload('work', 'Item types', work.locator('.work-type-card .work-definition-toggle'), async () => {})
  })
  await test('PIM catalog, section, and family survive refresh, Back, and Forward', async () => {
    await verifyReload('pim', 'Families', pim.locator('.pim-definition-toggle'), catalog)
  })
  await test('Work pack and healthy plugin expose their technical handoff', async () => {
    await open('work')
    await exact('button', 'Technical details', work).click()
    await work.getByText('kickside.work.tracker:pack', { exact: true }).waitFor()
    await exact('button', 'Plugins', work).click()
    const plugin = work.locator('.work-definition').filter({ hasText: 'Planning' }).first()
    await plugin.locator('.work-definition-toggle').click()
    await exact('button', 'Technical details', plugin).click()
    for (const text of ['kickside.work.planning:plugin', 'WorkConfigurePlugin']) await plugin.getByText(text, { exact: true }).first().waitFor()
  })
  await test('PIM healthy plugin and filter set expose their technical handoff', async () => {
    await open('pim')
    await catalog()
    await exact('button', 'Plugins', pim).click()
    const plugin = pim.locator('.pim-definition').filter({ hasText: 'Inventory' }).first()
    await plugin.locator('.pim-definition-toggle').click()
    await exact('button', 'Technical details', plugin).click()
    await plugin.getByText('Interface version', { exact: true }).waitFor()
    await plugin.getByText('PIMConfigurePlugin', { exact: true }).waitFor()
    await exact('button', 'Filter set technical details', pim).click()
    await pim.getByText('PIMQuery', { exact: true }).first().waitFor()
  })
  await test('Work workflow state inspector survives refresh', async () => {
    await open('work')
    await exact('button', 'Workflow', work).click()
    const state = work.getByRole('button', { name: /^Edit state / }).first()
    await state.click()
    await page.waitForURL(url => /\/workflow\/[^/]+$/.test(url.pathname))
    await work.getByLabel('State inspector', { exact: true }).waitFor()
    await page.reload()
    await work.getByLabel('State inspector', { exact: true }).waitFor()
  })
  await test('Work draft stays on cancelled tab switch and warns on browser reload', async () => {
    await open('work')
    const prefix = work.getByRole('textbox', { name: 'Item key prefix' })
    const initial = await prefix.inputValue()
    await prefix.fill('TEST')
    await exact('tab', 'Catalogs').click()
    await exact('button', 'Keep editing', page).click()
    assert.equal(await prefix.inputValue(), 'TEST')
    const dialogPromise = page.waitForEvent('dialog', { timeout: 8000 })
    const reload = page.reload().catch(() => undefined)
    const dialog = await dialogPromise
    assert.equal(dialog.type(), 'beforeunload')
    await dialog.dismiss()
    await reload
    assert.equal(await prefix.inputValue(), 'TEST')
    await prefix.fill(initial)
  })
} finally {
  await browser.close()
}
process.exitCode = failures ? 1 : 0
