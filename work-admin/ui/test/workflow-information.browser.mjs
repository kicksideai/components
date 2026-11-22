// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { mkdir, readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright'

const origin = 'http://localhost:18160'
const tunnel = process.env.WORKFLOW_FIRE_PORT || '18160'
const candidate = process.env.WORKFLOW_ASSETS
const output = process.env.WORKFLOW_SHOTS
const [session, fixtureLine] = (await readFile('/dev/stdin', 'utf8')).trim().split('\n')
const fixture = fixtureLine ? JSON.parse(fixtureLine) : undefined
assert.ok(session, 'Pass the Fire session on stdin')
const browser = await chromium.launch({
  args: tunnel === '18160' ? [] : ['--host-resolver-rules=MAP localhost 127.0.0.1:' + tunnel],
})
const button = (root, name) => root.getByRole('button', { name, exact: true })
const rule = 'Requires all blockers to be resolved.'
let failures = 0

async function run(width, colorScheme) {
  const page = await browser.newPage({
    viewport: { width, height: width === 390 ? 844 : 900 },
    colorScheme,
    reducedMotion: 'reduce',
  })
  page.setDefaultTimeout(15000)
  const shell = page.frameLocator('iframe').first()
  const admin = shell.locator('kickside-work-admin')
  const settings = admin.locator('kickside-work-board-settings')
  const rail = settings.getByRole('navigation', { name: 'Board settings sections' })
  const workflow = settings.getByRole('region', { name: 'Workflow editor' })
  const transition = workflow.getByRole('complementary', { name: 'Transition inspector' })
  const state = workflow.getByRole('complementary', { name: 'State inspector' })
  const approval = state.getByRole('region', { name: 'Approval sources' })
  const picker = approval.locator('wc-principal-picker')
  const workRequests = []
  const assetsServed = new Set()
  const directory = output && join(output, width + '-' + colorScheme)

  page.on('request', request => {
    if (new URL(request.url()).pathname.endsWith('/principal_labels')) {
      workRequests.push(request.postDataJSON()?.refs ?? [])
    }
  })
  if (candidate) {
    const assets = new Set(await readdir(candidate))
    await page.route(url => url.origin === origin && url.pathname.startsWith('/kickside-work-admin/') &&
      url.pathname.endsWith('.js'), async route => {
      const file = new URL(route.request().url()).pathname.split('/').at(-1)
      assert.ok(assets.has(file), 'Candidate Work Admin asset missing: ' + file)
      await route.fulfill({ path: join(candidate, file), contentType: 'application/javascript' })
      assetsServed.add(file)
    })
  }
  if (directory) await mkdir(directory, { recursive: true })

  async function check(label, action) {
    try {
      await action()
      console.log('PASS ' + width + ' ' + colorScheme + ' ' + label)
    } catch (error) {
      failures++
      const message = String(error.message).replaceAll(session, '[redacted]').replace(/\s+/g, ' ')
      console.log('FAIL ' + width + ' ' + colorScheme + ' ' + label + ' | ' + message.slice(0, 450))
    }
  }

  async function shot(name, anchor) {
    if (!directory) return
    await anchor?.scrollIntoViewIfNeeded()
    await page.screenshot({ path: join(directory, name + '.png'), fullPage: true })
  }

  async function openWorkflow(title = 'Release Operations') {
    const board = button(admin, 'Settings for ' + title)
    await page.goto(origin + '/system/work')
    await board.or(button(rail, 'All boards')).first().waitFor()
    if (await button(rail, 'All boards').isVisible()) await button(rail, 'All boards').click()
    await board.click()
    await button(rail, 'Workflow').click()
    await button(workflow, 'List').waitFor()
    if (await button(workflow, 'List').getAttribute('aria-pressed') !== 'true') await button(workflow, 'List').click()
    await workflow.getByRole('table', { name: 'Transitions' }).waitFor()
  }

  async function pick(query, name) {
    await picker.locator('.kpp-control').click()
    await shell.getByRole('combobox', { name: 'Search people or groups' }).fill(query)
    await shell.getByRole('option', { name }).first().click()
  }

  try {
    await page.goto(origin + '/login')
    await page.evaluate(token => localStorage.setItem('@wippy_token_info', JSON.stringify({ token })), session)

    if (process.env.WORKFLOW_TRACKER && width === 1440 && colorScheme === 'light') {
      await check('Tracker shows the same rule and identifies the unresolved blocker', async () => {
        const path = fixture?.trackerBoard ? '/tracker/board/' + encodeURIComponent(fixture.trackerBoard) : '/tracker'
        await page.goto(origin + path)
        const tracker = shell.locator('kickside-work-tracker')
        await tracker.getByRole('button', { name: /^ROPS-18 / }).click({ timeout: 15000 })
        const resume = button(tracker, 'Resume work')
        await resume.hover()
        const title = await resume.evaluate(element => element.closest('[title]')?.getAttribute('title'))
        if (!title) await tracker.getByText(rule, { exact: true }).waitFor()
        else assert.equal(title, rule)
        await shot('tracker-rule', resume)
        await tracker.getByRole('tab', { name: 'Relationships' }).click()
        const blocker = tracker.getByRole('dialog', { name: 'Issue details' })
        await blocker.getByRole('button', { name: /ROPS-15/ }).click()
        await blocker.getByText('In Progress', { exact: true }).waitFor()
        await shot('tracker-blocker')
      })
    }

    await check('transition list shows the blocker requirement', async () => {
      await openWorkflow()
      const moves = workflow.getByRole('table', { name: 'Transitions' })
      const resume = moves.locator('tr:has(button[aria-label="Edit transition Resume work"])')
      await resume.getByText(rule, { exact: true }).waitFor()
      await resume.evaluate(row => row.scrollIntoView({ block: 'center' }))
      await shot('transition-list', resume)
    })
    await check('transition editor puts the same rule before field controls', async () => {
      await button(workflow, 'Edit transition Resume work').click()
      const explanation = transition.getByText(rule, { exact: true })
      await explanation.waitFor()
      assert.ok(await explanation.evaluate(el => {
        const next = el.closest('aside').querySelector('[aria-label="To state"]')
        return next && !!(el.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING)
      }))
      await shot('transition-editor', explanation)
    })
    await check('required fields are named in the transition list and editor', async () => {
      if (await transition.isVisible()) await button(transition, 'Close transition editor').click()
      const resolve = workflow.locator('tr:has(button[aria-label="Edit transition Resolve"])')
      await button(resolve, 'Edit transition Resolve').click()
      const required = button(transition.getByRole('group', { name: 'Required fields' }).first(), 'Resolution')
      if (await required.getAttribute('aria-pressed') !== 'true') await required.click()
      await transition.getByText('Required: Resolution', { exact: true }).waitFor()
      await button(transition, 'Close transition editor').click()
      await resolve.getByText('Required: Resolution', { exact: true }).waitFor()
      await openWorkflow()
    })
    await check('first Approval click has no empty principal lookup', async () => {
      if (await transition.isVisible()) await button(transition, 'Close transition editor').click()
      await button(workflow, 'Edit state In Progress').click()
      await button(workflow, 'Add state').click()
      await state.getByRole('textbox', { name: 'State name' }).fill('Release approval')
      await button(state, 'Approval').click()
      await picker.locator('.kpp-control').waitFor()
      await state.getByText('Choose the group that can approve this state.', { exact: true }).waitFor()
      assert.equal(workRequests.flat().filter(ref => !ref.id).length, 0, 'Approval sent an empty principal reference')
      assert.equal(await state.getByText(/invalid_principal_refs/).count(), 0)
    })
    await check('state name shows the resulting route', async () => {
      const route = state.getByText('In Progress → Release approval → In Review', { exact: true })
      await route.waitFor()
      await shot('state-route', route)
    })
    await check('approval source is visible beside the picker', async () => {
      await approval.getByRole('combobox', { name: 'Approval source' }).waitFor()
      await shot('approval-picker', picker)
    })
    await check('review explains the rerouted transition', async () => {
      await pick('Administr', /^Administrator\b/)
      await button(settings, 'Review changes').click()
      const review = shell.getByRole('dialog', { name: 'Review changes' })
      await review.getByText('Destination changes from In Review to Release approval.', { exact: true }).waitFor()
      const apply = button(review, 'Apply changes')
      assert.equal(await apply.isEnabled(), true)
      await shot('approval-review', review.getByRole('heading', { name: 'Impact on this board' }))
      await button(review, 'Keep editing').click()
    })
    await check('named people can be chosen directly', async () => {
      const review = shell.getByRole('dialog', { name: 'Review changes' })
      if (await review.isVisible()) await button(review, 'Keep editing').click()
      await state.getByRole('combobox', { name: 'Approval source' }).click()
      await state.getByRole('option', { name: 'People and groups' }).click()
      await pick('Default Administrator', /^Default Administrator\b/)
      await state.getByText('Default Administrator', { exact: true }).waitFor()
      await shot('approval-people', picker)
    })
    await check('directory failures after a valid selection remain visible', async () => {
      await state.getByRole('combobox', { name: 'Approval source' }).click()
      await state.getByRole('option', { name: 'Group members' }).click()
      const endpoint = url => url.pathname.endsWith('/principal_labels')
      await page.route(endpoint, route => route.fulfill({
        status: 503,
        json: { success: false, error: 'Directory is unavailable in this test' },
      }))
      try {
        await pick('Administr', /^Administrator\b/)
        await state.getByRole('alert').getByText('Directory is unavailable in this test', { exact: false }).waitFor()
      } finally {
        await page.unroute(endpoint)
      }
    })
    if (candidate) await check('candidate assets were used', async () => {
      assert.ok(assetsServed.has('admin.js') || assetsServed.has('settings.js'))
    })
    if (directory) {
      await check('Security reference', async () => {
        await page.goto(origin + '/system/security')
        await shell.locator('kickside-security .kx-empty').first().waitFor()
        await shot('security')
      })
      await check('Settings reference', async () => {
        await page.goto(origin + '/system/settings')
        const tab = shell.getByRole('tab', { name: 'Settings', exact: true })
        if (await tab.getAttribute('aria-selected') !== 'true') await tab.click()
        await shell.locator('kickside-settings nav').first().waitFor()
        await shot('settings')
      })
    }
    if (fixture && width === 1440 && colorScheme === 'light') {
      await check('applies and reloads a group approval on the scratch board', async () => {
        await openWorkflow(fixture.title)
        await button(workflow, 'Edit state In Progress').click()
        await button(workflow, 'Add state').click()
        await state.getByRole('textbox', { name: 'State name' }).fill('Release approval')
        await button(state, 'Approval').click()
        await pick('Administr', /^Administrator\b/)
        await button(settings, 'Review changes').click()
        const review = shell.getByRole('dialog', { name: 'Review changes' })
        await review.getByText('Destination changes from In Review to Release approval.', { exact: true }).waitFor()
        const continuation = review.locator('tr').filter({ hasText: 'Release approval → In Review' })
        await continuation.getByText('Runs automatically.', { exact: true }).waitFor()
        const applied = page.waitForResponse(response => response.request().method() === 'POST' &&
          new URL(response.url()).pathname === '/api/v1/work/boards/' + encodeURIComponent(fixture.boardId) + '/apply_schema')
        await button(review, 'Apply changes').click()
        assert.equal((await applied).ok(), true, 'Work rejected the reviewed workflow')
        await review.waitFor({ state: 'hidden' })
        await openWorkflow(fixture.title)
        await workflow.getByRole('textbox', { name: 'Name of Release approval', exact: true }).waitFor()
        await button(workflow, 'Edit state Release approval').click()
        await picker.getByText('Administrator', { exact: true }).waitFor()
      })
    }
  } finally {
    await page.close()
  }
}

try {
  const configurations = output
    ? [[1440, 'light'], [1440, 'dark'], [390, 'light'], [390, 'dark']]
    : [[1440, 'light']]
  for (const [width, colorScheme] of configurations) await run(width, colorScheme)
} finally {
  await browser.close()
}
process.exitCode = failures ? 1 : 0
