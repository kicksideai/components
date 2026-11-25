// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { host } from '@wippy-fe/proxy'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MailAdmin from '../app/MailAdmin.vue'
import { library as libraryApi } from '../api'
import { calls, dana, get, ok, post, refuse, resource, revision, row, serve } from '../test/fixtures'
import { dialogButton } from '../test/mail'
import { notify } from '../test/setup'

const logo = resource('asset', 'logo', { title: 'Mail logo', state: 'customized', revision: 3, origin_label: 'Mail',
  asset: { source: 'upload', filename: 'logo.png', content_type: 'image/png', size: 2048 }, used_by: { messages: ['notice'] } })
const banner = resource('asset', 'banner', { title: 'Spring banner', state: 'created', revision: 1,
  asset: { source: 'upload', filename: 'banner.png', content_type: 'image/png', size: 4096 }, used_by: { messages: [] } })
const notice = resource('message', 'notice', { title: 'Notice', origin_label: 'Mail', used_by: { recent_senders: [] } })
const standard = resource('base', 'standard', { title: 'Standard', state: 'customized', revision: 7, author: 'user-1', author_label: dana, origin_label: 'Mail',
  html: '<html>mine</html>', original: { html: '<html>shipped</html>', text: 'shipped', schema: { type: 'object', properties: {} }, samples: {} },
  used_by: { messages: ['notice'] } })

function routes(extra: Parameters<typeof serve>[0] = []) {
  serve([
    ...extra,
    get('/api/v1/mail/library', (_path, options) => {
      const params = (options as { params: Record<string, string> }).params
      if (params.kind === 'asset') return ok({ items: [row(logo, { asset: logo.asset, used_by: { messages: 1 } }), row(banner, { asset: banner.asset, used_by: { messages: 0 } })] })
      if (params.kind === 'message') return ok({ items: [row(notice)] })
      if (params.kind === 'base') return ok({ items: [row(standard)] })
      return ok({ items: [row(standard), row(notice)] })
    }),
    get('/api/v1/mail/delivery', () => ok({ configured: true })),
    get('/api/v1/mail/library/asset/logo', () => ok(logo)),
    get('/api/v1/mail/library/asset/logo/history', () => ok({ items: [revision(logo, 3), revision(logo, 2, { version: 2 })] })),
    get('/api/v1/mail/library/asset/banner', () => ok(banner)),
    get('/api/v1/mail/library/asset/banner/history', () => ok({ items: [revision(banner, 1)] })),
    get('/api/v1/mail/library/base/standard', () => ok(standard)),
    get('/api/v1/mail/library/base/standard/history', () => ok({ items: [revision(standard, 7)] })),
    get('/api/v1/mail/library/message/notice', () => ok(notice)),
    get('/api/v1/mail/library/message/notice/history', () => ok({ items: [] })),
    post('/api/v1/mail/library/preview', () => ok({ subject: 'Hi', html: '<p>x</p>', text: 'x' })),
  ])
}
async function open(route: string) {
  const wrapper = mount(MailAdmin, { props: { route }, attachTo: document.body })
  await flushPromises()
  await flushPromises()
  return wrapper
}

describe('Images', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('lists images with thumbnails, size, the messages that show them, source and date', async () => {
    routes()
    const wrapper = await open('assets')
    expect(wrapper.find('h1').text()).toBe('Images')
    const rows = wrapper.findAll('tbody tr').map(node => node.text())
    expect(rows[0]).toContain('Mail logo')
    expect(rows[0]).toContain('2 KB')
    expect(rows[0]).toContain('1 message')
    expect(rows[1]).toContain('Spring banner')
    expect(rows[1]).toContain('—')
    expect(wrapper.findAll('.mail-asset-tile')).toHaveLength(2)
    wrapper.unmount()
  })

  it('opens an image in a drawer that takes focus and copies its link', async () => {
    routes()
    const writeText = vi.fn(() => Promise.resolve())
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const previousUrl = window.location.href
    window.history.replaceState(null, '', '/workspace/system/mail/assets/logo')
    const wrapper = await open('assets/logo')
    const drawer = document.body.querySelector<HTMLElement>('.mail-drawer-body')!
    expect(drawer.contains(document.activeElement)).toBe(true)
    expect(drawer.textContent).toContain('Mail logo')
    expect(drawer.textContent).toContain('{{ assets.logo }}')
    expect(drawer.textContent).toContain('Notice')
    dialogButton('Copy link')!.click()
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/workspace/system/mail/assets/logo`)
    wrapper.unmount()
    window.history.replaceState(null, '', previousUrl)
  })

  it('refuses to delete an image that a message shows, without asking first or calling the server', async () => {
    routes()
    const used = { ...banner, used_by: { messages: ['notice'] } }
    serve([get('/api/v1/mail/library/asset/banner', () => ok(used)), get('/api/v1/mail/library/asset/banner/history', () => ok({ items: [] })),
      get('/api/v1/mail/library', () => ok({ items: [banner] })), get('/api/v1/mail/library/message/notice', () => ok(notice)), post('/api/v1/mail/library/preview', () => ok({ subject: 'x', html: '<p>x</p>' }))])
    const wrapper = await open('assets/banner')
    dialogButton('Delete')!.click()
    await flushPromises()
    expect(host.confirm).not.toHaveBeenCalled()
    expect(calls('delete')).toHaveLength(0)
    expect(document.body.textContent).toContain('Spring banner is in use')
    wrapper.unmount()
  })
})

describe('Images named in templates', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('names every template whose source names the image when Mail refuses the delete', async () => {
    routes([
      get('/api/v1/mail/library/asset/banner', () => ok({ ...banner, used_by: { messages: [] } })),
      get('/api/v1/mail/library/asset/banner/history', () => ok({ items: [] })),
      get('/api/v1/mail/library/part/promo', () => ok(resource('part', 'promo', { title: 'Promo strip' }))),
    ])
    vi.mocked(host.confirm).mockResolvedValueOnce(true)
    const remove = vi.fn(() => refuse(409, { error: 'in use', kind: 'CONFLICT', details: { code: 'mail_resource_in_use', messages: [],
      resources: [{ kind: 'part', name: 'promo' }, { kind: 'message', name: 'notice' }] } }))
    serve([get('/api/v1/mail/library/asset/banner', () => ok({ ...banner, used_by: { messages: [] } })), get('/api/v1/mail/library/asset/banner/history', () => ok({ items: [] })),
      get('/api/v1/mail/library', (_p, o) => ok({ items: (o as { params: Record<string, string> }).params.kind === 'part' ? [row(resource('part', 'promo', { title: 'Promo strip' }))] : [row(notice)] })),
      { method: 'delete', match: (path: string) => path === '/api/v1/mail/library/asset/banner', reply: remove }])
    const wrapper = await open('assets/banner')
    dialogButton('Delete')!.click()
    await flushPromises()
    await flushPromises()
    expect(remove).toHaveBeenCalled()
    const text = document.body.textContent ?? ''
    expect(text).toContain('2 templates name Spring banner, in the current version or one kept in History. Remove it from them first.')
    expect(text).toContain('Promo strip')
    expect(text).toContain('Notice')
    wrapper.unmount()
  })
})

describe('Used by', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('lists the messages that use a base template by title and opens one', async () => {
    routes()
    const wrapper = await open('bases/standard/used-by')
    const link = wrapper.findAll('.mail-row-link').find(node => node.text() === 'Notice')!
    expect(link).toBeDefined()
    await link.trigger('click')
    await flushPromises()
    expect(wrapper.emitted('navigate')?.at(-1)).toEqual(['messages/notice/content'])
    wrapper.unmount()
  })

  it('says nothing about what it cannot list: a part has no Used by section', async () => {
    routes([get('/api/v1/mail/library/part/footer', () => ok(resource('part', 'footer', { title: 'Footer' }))),
      get('/api/v1/mail/library/part/footer/history', () => ok({ items: [] }))])
    const wrapper = await open('parts/footer/content')
    expect(wrapper.findAll('.kx-settings-rail-item').map(node => node.text())).toEqual(['All parts', 'Content', 'Inputs', 'History'])
    expect(wrapper.text()).not.toContain('not listed here yet')
    wrapper.unmount()
  })
})

describe('Versions', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('compares a customized resource with the version included with its module', async () => {
    routes()
    const wrapper = await open('bases/standard/content')
    dialogButton('Compare with original')!.click()
    await flushPromises()
    await vi.waitFor(() => { if (!document.body.querySelector('.cm-mergeView')) throw new Error('compare not shown') })
    const dialog = document.body.querySelector('.mail-dialog-wide')!
    expect(dialog.textContent).toContain('Standard: the version included with Mail')
    expect(dialog.textContent).toContain('Included version')
    expect(dialog.textContent).toContain('Current version')
    expect(dialog.querySelector('.cm-mergeView')!.textContent).toContain('shipped')
    expect(dialog.querySelector('.cm-mergeView')!.textContent).toContain('mine')
    wrapper.unmount()
  })
})

describe('New and duplicate', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('duplicates a resource under a new reference, starting from its copy', async () => {
    const copy = vi.fn(() => ok(resource('base', 'standard-copy', { title: 'Standard copy', state: 'created', revision: 1 })))
    const review = vi.fn(() => ok({ preview_id: 'copy-review' }))
    routes([post('/api/v1/mail/library/preview', review), post('/api/v1/mail/library', copy)])
    const wrapper = await open('bases/standard/content')
    dialogButton('Duplicate')!.click()
    await flushPromises()
    expect(document.body.textContent).toContain('Duplicate Standard')
    const inputs = document.body.querySelectorAll<HTMLInputElement>('.mail-dialog input.p-inputtext')
    expect(inputs[0].value).toBe('Standard copy')
    expect(inputs[1].value).toBe('standard-copy')
    dialogButton('Create base template')!.click()
    await flushPromises()
    expect(review).toHaveBeenCalledWith('/api/v1/mail/library/preview', expect.objectContaining({
      create: expect.objectContaining({ kind: 'base', name: 'standard-copy', from: { kind: 'base', name: 'standard' } }),
    }))
    expect(copy).toHaveBeenCalledWith('/api/v1/mail/library', expect.objectContaining({
      kind: 'base', name: 'standard-copy', from: { kind: 'base', name: 'standard' }, preview_id: 'copy-review',
    }))
    expect(wrapper.emitted('navigate')?.at(-1)).toEqual(['bases/standard-copy/content'])
    wrapper.unmount()
  })

  it('reads a committed copy again when the library invalidation arrives, without polling', async () => {
    const copy = { kind: 'base' as const, name: 'standard-copy', title: 'Standard copy', description: '',
      from: { kind: 'base' as const, name: 'standard' } }
    const projected = resource('base', copy.name, { state: 'created', revision: 1, seq: 42 })
    const read = vi.fn()
      .mockImplementationOnce(() => refuse(404, { kind: 'NotFound', error: 'Resource is unavailable' }))
      .mockImplementationOnce(() => ok(projected))
    serve([
      post('/api/v1/mail/library/preview', () => ok({ preview_id: 'copy-review' })),
      post('/api/v1/mail/library', () => ok({ seq: 42, committed: true, projected: false })),
      get('/api/v1/mail/library/base/standard-copy', read),
    ])
    vi.useFakeTimers()
    try {
      const created = libraryApi.copy(copy)
      await vi.advanceTimersByTimeAsync(600)
      expect(read).toHaveBeenCalledTimes(1)
      notify('mail.library')
      await expect(created).resolves.toEqual(projected)
      expect(read).toHaveBeenCalledTimes(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it('shows the server refusal of a reference that already exists beside the field', async () => {
    routes([post('/api/v1/mail/library/preview', () => refuse(409, { error: 'The resource already exists', kind: 'CONFLICT',
      details: { code: 'mail_revision_conflict' } }))])
    const wrapper = await open('bases')
    dialogButton('New base template')!.click()
    await flushPromises()
    const inputs = document.body.querySelectorAll<HTMLInputElement>('.mail-dialog input.p-inputtext')
    inputs[0].value = 'Standard'
    inputs[0].dispatchEvent(new Event('input'))
    await flushPromises()
    dialogButton('Create base template')!.click()
    await flushPromises()
    expect(document.body.textContent).toContain('A base template with this reference already exists. Choose another.')
    wrapper.unmount()
  })
})

describe('Refusals', () => {
  it('maps a missing delivery setup to product copy for a sender', async () => {
    routes([post('/api/v1/mail/library/send-test', () => refuse(400, { error: 'An active mail driver is required', kind: 'INVALID', details: { code: 'invalid_config', reason: 'Choose a delivery service for Mail.' } }))])
    const wrapper = await open('messages/notice/content')
    dialogButton('Send test to me')!.click()
    await flushPromises()
    expect(wrapper.text()).toContain('Mail delivery is not set up yet. Ask an administrator to set it up.')
    expect(wrapper.text()).not.toContain('driver')
    wrapper.unmount()
    document.body.innerHTML = ''
  })
})
