// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { host } from '@wippy-fe/proxy'
import { describe, expect, it, vi } from 'vitest'
import MailAdmin from './MailAdmin.vue'
import { hostVisible, notify, subscriptions } from '../test/setup'
import { calls, get, ok, refuse, resource, row, serve } from '../test/fixtures'
import type { LibraryRow } from '../types'

const rows: LibraryRow[] = [
  row(resource('base', 'standard', { title: 'Standard', description: 'The card layout.' }), { used_by: { messages: 2 } }),
  row(resource('base', 'newsletter', { title: 'Newsletter', state: 'created', author: 'user-1', revision: 4, updated_at: Date.now() }), { used_by: { messages: 0 } }),
  row(resource('part', 'footer', { title: 'Footer', state: 'customized', author: 'user-1', revision: 3, updated_at: Date.now() })),
  row(resource('message', 'notice', { title: 'Notice' }), { used_by: { recent_sources: 1 } }),
  row(resource('message', 'weekly', { title: 'Weekly report', base: 'standard', state: 'created', author: 'user-1', revision: 2 })),
  row(resource('asset', 'logo', { title: 'Mail logo' }), { used_by: { messages: 2 } }),
]

function serveLibrary(capabilities = { send: true, edit_library: true, administer_delivery: true }, items = rows) {
  serve([
    get('/api/v1/mail/library', () => ok({ items: [...items] })),
    get('/api/v1/mail/capabilities', () => ok(capabilities)),
    get('/api/v1/mail/delivery', () => ok({ configured: true })),
  ])
}

async function open(route = '') {
  const wrapper = mount(MailAdmin, { props: { route }, attachTo: document.body })
  await flushPromises()
  return wrapper
}

const railLabels = (wrapper: Awaited<ReturnType<typeof open>>) =>
  wrapper.findAll('nav[aria-label="Mail sections"] .kx-settings-rail-label').map(node => node.text())
const rowNames = (wrapper: Awaited<ReturnType<typeof open>>) => wrapper.findAll('.mail-name').map(node => node.text())
const libraryParams = () => calls('get').filter(([path]) => path === '/api/v1/mail/library')
  .map(([, options]) => (options as { params: Record<string, string> }).params)

describe('Mail administration shell', () => {
  it('lists every resource with its kind, source and usage from the summary rows', async () => {
    serveLibrary()
    const wrapper = await open()
    expect(railLabels(wrapper)).toEqual(['All resources', 'Messages', 'Base templates', 'Parts', 'Images', 'Activity'])
    expect(libraryParams().every(params => params.view === 'summary')).toBe(true)
    // The server's order, as it pages.
    expect(rowNames(wrapper)).toEqual(['Standard', 'Newsletter', 'Footer', 'Notice', 'Weekly report', 'Mail logo'])
    const text = wrapper.findAll('tbody tr').map(node => node.text())
    expect(text[0]).toContain('Included with Mail')
    expect(text[0]).toContain('2 messages')
    expect(text[2]).toContain('Customized')
    expect(text[1]).toContain('Created by Dana Lee')
    expect(text[3]).toContain('1 recent sender')
    expect(text[5]).toContain('Image')
    wrapper.unmount()
  })

  it('asks the server for the state and the search, which covers names and content', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    serveLibrary()
    const wrapper = await open()
    await wrapper.findAll('.p-togglebutton').find(button => button.text() === 'Customized')!.trigger('click')
    await flushPromises()
    expect(libraryParams().at(-1)?.state).toBe('customized')
    await wrapper.find('input[type="search"]').setValue('#183b60')
    vi.advanceTimersByTime(300)
    await flushPromises()
    expect(libraryParams().at(-1)).toMatchObject({ q: '#183b60', state: 'customized', view: 'summary' })
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('says when nothing matches the search', async () => {
    serveLibrary(undefined, [])
    const wrapper = await open()
    expect(wrapper.find('.mail-nomatch').text()).toBe('Nothing matches. Try another name or a word from the template.')
    wrapper.unmount()
  })

  it('shows Activity to a sender without delivery administration and hides it from an editor who cannot send', async () => {
    serveLibrary({ send: true, edit_library: true, administer_delivery: false })
    let wrapper = await open()
    expect(railLabels(wrapper)).toContain('Activity')
    wrapper.unmount()
    serveLibrary({ send: false, edit_library: true, administer_delivery: false })
    wrapper = await open()
    expect(railLabels(wrapper)).not.toContain('Activity')
    expect(calls('get').some(([path]) => path === '/api/v1/mail/delivery')).toBe(false)
    wrapper.unmount()
  })

  it('reads one page of the library on mount and on return to the page, and shows more on request', async () => {
    serve([
      get('/api/v1/mail/library', (_path, options) => {
        const cursor = (options as { params: Record<string, string> }).params.cursor
        return ok(cursor ? { items: rows.slice(3), total: 6 } : { items: rows.slice(0, 3), next_cursor: 'c1', total: 6 })
      }),
      get('/api/v1/mail/delivery', () => ok({ configured: true })),
    ])
    const wrapper = await open()
    expect(libraryParams()).toHaveLength(1)
    expect(wrapper.find('.mail-count').text()).toBe('3 of 6 resources')
    hostVisible.value = false
    await flushPromises()
    hostVisible.value = true
    await flushPromises()
    expect(libraryParams().filter(params => !params.cursor)).toHaveLength(1)
    await wrapper.findAll('.mail-more button').at(-1)!.trigger('click')
    await flushPromises()
    expect(libraryParams().at(-1)?.cursor).toBe('c1')
    expect(rowNames(wrapper)).toHaveLength(6)
    wrapper.unmount()
  })

  it('keeps the rows when Show more fails and offers Retry beside them', async () => {
    serve([
      get('/api/v1/mail/library', (_path, options) => (options as { params: Record<string, string> }).params.cursor
        ? refuse(500, { error: 'down', kind: 'INTERNAL' }) : ok({ items: rows.slice(0, 3), next_cursor: 'c1' })),
      get('/api/v1/mail/delivery', () => ok({ configured: true })),
    ])
    const wrapper = await open()
    await wrapper.findAll('.mail-more button').at(-1)!.trigger('click')
    await flushPromises()
    expect(rowNames(wrapper)).toHaveLength(3)
    expect(wrapper.find('.mail-more .kx-err').text()).toContain('More resources could not be loaded.')
    expect(wrapper.findAll('.mail-more button').at(-1)!.text()).toBe('Retry')
    wrapper.unmount()
  })

  it('shows no directory gear: the shared actions cannot take Mail’s label or be hidden from people without delivery administration', async () => {
    serveLibrary({ send: true, edit_library: true, administer_delivery: false })
    const wrapper = await open()
    expect(wrapper.find('button[aria-label="Application defaults"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('shows the no-permission notice and the error with Retry', async () => {
    serve([get('/api/v1/mail/library', () => refuse(403, { error: 'Edit mail library access is required', kind: 'PERMISSION_DENIED', details: { code: 'mail_library_denied' } }))])
    let wrapper = await open()
    expect(wrapper.find('[role="alert"]').text()).toBe('Ask an administrator to grant you access to the mail library.')
    wrapper.unmount()

    serve([get('/api/v1/mail/library', () => refuse(500, { error: 'database unavailable', kind: 'INTERNAL' }))])
    wrapper = await open()
    expect(wrapper.find('.kx-err').text()).toContain('The mail library could not be loaded. Try again in a moment.')
    serveLibrary()
    await wrapper.find('.kx-err button').trigger('click')
    await flushPromises()
    expect(rowNames(wrapper)).toHaveLength(6)
    wrapper.unmount()
  })

  it('refetches the visible library page after a topic-only invalidation', async () => {
    serveLibrary()
    const interval = vi.spyOn(globalThis, 'setInterval')
    const wrapper = await open()
    const before = libraryParams().length
    const updatedRows = [
      ...rows.map(item => item.name === 'footer' ? { ...item, title: 'Footer renamed', revision: 4 } : item),
      row(resource('part', 'signature', { title: 'Signature', state: 'created', revision: 9 })),
    ]
    serveLibrary(undefined, updatedRows)
    notify('mail.library')
    await flushPromises()
    expect(libraryParams()).toHaveLength(before + 1)
    expect(rowNames(wrapper)).toEqual(['Standard', 'Newsletter', 'Footer renamed', 'Notice', 'Weekly report', 'Mail logo', 'Signature'])
    expect(interval).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('stops listening to changes once it is gone', async () => {
    serveLibrary()
    const wrapper = await open()
    expect(subscriptions.get('mail.library')?.size).toBeGreaterThan(0)
    wrapper.unmount()
    expect(subscriptions.has('mail.library')).toBe(false)
    expect(subscriptions.has('mail.activity')).toBe(false)
  })
})
