// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { api, host } from '@wippy-fe/proxy'
import { describe, expect, it, vi } from 'vitest'
import MailAdmin from './MailAdmin.vue'
import { notify } from '../test/setup'
import { calls as sent, get, ok, refuse, resource, serve } from '../test/fixtures'

const library = [
  resource('base', 'standard', { title: 'Standard', description: 'The card layout.' }),
  resource('base', 'newsletter', { title: 'Newsletter', state: 'created', author: 'user-1', revision: 4, updated_at: Date.now() }),
  resource('part', 'footer', { title: 'Footer', state: 'customized', author: 'user-1', revision: 3, updated_at: Date.now(), html: '<p style="color:#183b60">Acme</p>' }),
  resource('message', 'notice', { title: 'Notice' }),
  resource('message', 'weekly', { title: 'Weekly report', base: 'standard', state: 'created', author: 'user-1', revision: 2 }),
]

function serveLibrary(delivery: () => Promise<unknown> = () => ok({ configured: true })) {
  serve([
    get('/api/v1/mail/library', () => ok({ items: [...library] })),
    get('/api/v1/mail/delivery', delivery),
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

describe('Mail administration shell', () => {
  it('lists every resource with its kind, source and usage on the landing section', async () => {
    serveLibrary()
    const wrapper = await open()
    expect(railLabels(wrapper)).toEqual(['All resources', 'Messages', 'Base templates', 'Parts', 'Assets', 'Activity'])
    expect(wrapper.find('h1').text()).toBe('All resources')
    expect(rowNames(wrapper)).toEqual(['Newsletter', 'Standard', 'Footer', 'Notice', 'Weekly report'])
    const standard = wrapper.findAll('tbody tr')[1]
    expect(standard.text()).toContain('Base template')
    expect(standard.text()).toContain('Included')
    expect(standard.text()).toContain('2 messages')
    const footer = wrapper.findAll('tbody tr')[2]
    expect(footer.text()).toContain('Customized')
    expect(wrapper.findAll('tbody tr')[0].text()).toContain('Created by Dana Lee')
    expect(wrapper.find('.mail-count').text()).toBe('5 resources')
    wrapper.unmount()
  })

  it('filters by state and searches names and template content', async () => {
    serveLibrary()
    const wrapper = await open()
    const customized = wrapper.findAll('.p-togglebutton').find(button => button.text() === 'Customized')!
    await customized.trigger('click')
    expect(rowNames(wrapper)).toEqual(['Footer'])
    await wrapper.findAll('.p-togglebutton').find(button => button.text() === 'All')!.trigger('click')
    await wrapper.find('input[type="search"]').setValue('#183b60')
    expect(rowNames(wrapper)).toEqual(['Footer'])
    await wrapper.find('input[type="search"]').setValue('nothing like this')
    expect(wrapper.find('.mail-nomatch').text()).toBe('Nothing matches. Try another name or a word from the template.')
    wrapper.unmount()
  })

  it('shows kind sections with their own columns', async () => {
    serveLibrary()
    const wrapper = await open('messages')
    expect(wrapper.find('h1').text()).toBe('Messages')
    expect(wrapper.findAll('th').map(cell => cell.text())).toEqual(['Name', 'Base template', 'Source', 'Updated'])
    expect(rowNames(wrapper)).toEqual(['Notice', 'Weekly report'])
    expect(wrapper.findAll('tbody tr')[1].text()).toContain('Standard')
    wrapper.unmount()
  })

  it('opens a resource into its own rail and returns to its kind', async () => {
    serveLibrary()
    vi.mocked(api.get).mockImplementation(((path: string) => {
      if (path === '/api/v1/mail/library') return ok({ items: library })
      if (path === '/api/v1/mail/library/base/standard') return ok({ ...library[0], used_by: { messages: ['weekly'] } })
      if (path === '/api/v1/mail/delivery') return ok({ configured: true })
      return refuse(404, {})
    }) as never)
    const wrapper = await open()
    await wrapper.findAll('.mail-name')[1].trigger('click')
    expect(wrapper.emitted('navigate')?.at(-1)).toEqual(['bases/standard/content'])
    await wrapper.setProps({ route: 'bases/standard/content' })
    await flushPromises()
    expect(railLabels(wrapper)).toEqual(['All base templates', 'Layout', 'Used by', 'History'])
    expect(wrapper.find('.kx-settings-rail-group').text()).toBe('Standard')
    expect(wrapper.find('h1').text()).toBe('Layout')
    expect(wrapper.find('.system-section-head p').text()).toBe('The frame around the 1 message that uses Standard.')
    const back = wrapper.findAll('.kx-settings-rail-item').find(item => item.text() === 'All base templates')!
    await back.trigger('click')
    expect(wrapper.emitted('navigate')?.at(-1)).toEqual(['bases'])
    wrapper.unmount()
  })

  it('leaves Activity out for callers without delivery administration', async () => {
    serveLibrary(() => refuse(403, { error: 'forbidden', kind: 'PERMISSION_DENIED' }))
    const wrapper = await open()
    expect(railLabels(wrapper)).not.toContain('Activity')
    wrapper.unmount()
  })

  it('opens Delivery settings from the rail gear', async () => {
    serveLibrary()
    const wrapper = await open()
    await wrapper.find('.kx-railhead-acts button[aria-label="Application defaults"]').trigger('click')
    expect(host.navigate).toHaveBeenCalledWith('/system/settings/mail')
    wrapper.unmount()
  })

  it('shows the no-permission notice and the error with Retry', async () => {
    serve([get('/api/v1/mail/library', () => refuse(403, { error: 'Edit mail library access is required', kind: 'PERMISSION_DENIED', details: { code: 'mail_library_denied' } })),
      get('/api/v1/mail/delivery', () => ok({ configured: true }))])
    let wrapper = await open()
    expect(wrapper.find('[role="alert"]').text()).toBe('Ask an administrator to grant you access to the mail library.')
    wrapper.unmount()

    serve([get('/api/v1/mail/library', () => refuse(500, { error: 'database unavailable', kind: 'INTERNAL' })),
      get('/api/v1/mail/delivery', () => ok({ configured: true }))])
    wrapper = await open()
    expect(wrapper.find('.kx-err').text()).toContain('database unavailable')
    serveLibrary()
    await wrapper.find('.kx-err button').trigger('click')
    await flushPromises()
    expect(rowNames(wrapper)).toHaveLength(5)
    wrapper.unmount()
  })

  it('refetches the library on a library change without polling', async () => {
    serveLibrary()
    const interval = vi.spyOn(globalThis, 'setInterval')
    const wrapper = await open()
    const calls = () => sent('get').filter(([path]) => path === '/api/v1/mail/library').length
    const before = calls()
    library.push(resource('part', 'signature', { title: 'Signature', state: 'created', author: 'user-1', revision: 9 }))
    notify('mail.library.changed', { topic: 'mail.library.changed', data: { kind: 'part', name: 'signature', revision: 9 } })
    await flushPromises()
    expect(calls()).toBe(before + 1)
    expect(rowNames(wrapper)).toContain('Signature')
    expect(interval).not.toHaveBeenCalled()
    library.pop()
    wrapper.unmount()
  })
})
