// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { api, host } from '@wippy-fe/proxy'
import { describe, expect, it, vi } from 'vitest'
import MailAdmin from '../app/MailAdmin.vue'
import { notify } from '../test/setup'
import { calls, get, ok, post, refuse, remove, resource, revision, serve } from '../test/fixtures'
import type { Resource } from '../types'

const standard = resource('base', 'standard', { title: 'Standard', state: 'customized', revision: 7, author: 'user-1', updated_at: Date.UTC(2026, 10, 20, 9) })
const newsletter = resource('base', 'newsletter', { title: 'Newsletter', state: 'created', revision: 5, author: 'user-1', updated_at: Date.now() })
const signature = resource('part', 'signature', { title: 'Signature', state: 'created', revision: 6, author: 'user-1',
  schema: { type: 'object', required: ['name'], properties: { name: { type: 'string', description: 'Sender name.' }, role: { type: 'string', default: 'Team' } } },
  samples: { name: 'Reporting team' } })
const notice = resource('message', 'notice', { title: 'Notice' })
const welcome = resource('message', 'welcome', { title: 'Customer welcome', base: 'newsletter', state: 'created', revision: 3, author: 'user-1' })
const library = [standard, newsletter, signature, notice, welcome]

function routes(item: Resource, extra: Parameters<typeof serve>[0] = []) {
  serve([
    get('/api/v1/mail/library', () => ok({ items: [...library] })),
    get('/api/v1/mail/delivery', () => ok({ configured: true })),
    get(`/api/v1/mail/library/${item.kind}/${item.name}`, () => ok(item)),
    get(`/api/v1/mail/library/${item.kind}/${item.name}/history`, () => ok({ items: [revision(item, item.revision), revision(item, item.revision - 1, { note: 'Brand refresh' })] })),
    ...extra,
  ])
}

async function open(route: string) {
  const wrapper = mount(MailAdmin, { props: { route }, attachTo: document.body })
  await flushPromises()
  return wrapper
}

const button = (wrapper: Awaited<ReturnType<typeof open>>, label: string) =>
  wrapper.findAll('button').find(node => node.text() === label)

describe('Library resource read view', () => {
  it('shows a customized resource with its source and resets it to the original after confirmation', async () => {
    let current: Resource = { ...standard, used_by: { messages: [] } }
    const reset = vi.fn(() => { current = { ...standard, state: 'original', revision: 8, author: undefined, updated_at: undefined, used_by: { messages: [] } }; return ok(current) })
    serve([
      get('/api/v1/mail/library', () => ok({ items: [...library] })),
      get('/api/v1/mail/delivery', () => ok({ configured: true })),
      get('/api/v1/mail/library/base/standard', () => ok(current)),
      post('/api/v1/mail/library/base/standard/reset', reset),
    ])
    const wrapper = await open('bases/standard/content')
    expect(wrapper.find('.mail-customized').text()).toContain('Customized by Dana Lee on')
    expect(wrapper.find('.mail-code').text()).toContain('standard html')
    await wrapper.findAll('.p-togglebutton').find(node => node.text() === 'Plain text')!.trigger('click')
    expect(wrapper.find('.mail-code').text()).toContain('standard text')

    vi.mocked(host.confirm).mockResolvedValueOnce(true)
    await button(wrapper, 'Reset to original')!.trigger('click')
    await flushPromises()
    expect(host.confirm).toHaveBeenCalledWith(expect.objectContaining({ header: 'Reset Standard to the original?', acceptLabel: 'Reset to original' }))
    expect(reset).toHaveBeenCalledWith('/api/v1/mail/library/base/standard/reset', { expected_revision: 7 })
    expect(wrapper.find('.mail-customized').exists()).toBe(false)
    expect(wrapper.text()).toContain('Standard is back to the original. Your changes are in History.')
    wrapper.unmount()
  })

  it('keeps the resource unchanged when the reset is not confirmed', async () => {
    routes({ ...standard, used_by: { messages: [] } })
    const wrapper = await open('bases/standard/content')
    await button(wrapper, 'Reset to original')!.trigger('click')
    await flushPromises()
    expect(calls('post').filter(([path]) => path.endsWith('/reset'))).toHaveLength(0)
    wrapper.unmount()
  })

  it('restores an earlier version from History with the current revision as the expected one', async () => {
    const restore = vi.fn(() => ok({ ...newsletter, revision: 6 }))
    routes({ ...newsletter, used_by: { messages: ['welcome'] } }, [post('/api/v1/mail/library/base/newsletter/restore', restore)])
    const wrapper = await open('bases/newsletter/history')
    const rows = wrapper.findAll('.mail-history-row')
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('Current')
    expect(rows[1].text()).toContain('Brand refresh')
    expect(rows[1].text()).toContain('Dana Lee')
    vi.mocked(host.confirm).mockResolvedValueOnce(true)
    await rows[1].find('button').trigger('click')
    await flushPromises()
    expect(restore).toHaveBeenCalledWith('/api/v1/mail/library/base/newsletter/restore', { revision: 4, expected_revision: 5 })
    wrapper.unmount()
  })

  it('refuses to delete a base template that messages use, without calling the server', async () => {
    routes({ ...newsletter, used_by: { messages: ['welcome'] } })
    const wrapper = await open('bases/newsletter/content')
    await button(wrapper, 'Delete')!.trigger('click')
    await flushPromises()
    expect(host.confirm).not.toHaveBeenCalled()
    expect(api.delete).not.toHaveBeenCalled()
    expect(document.body.textContent).toContain('Newsletter is in use')
    expect(document.body.textContent).toContain('1 message uses it: Customer welcome. Remove it from that message first.')
    wrapper.unmount()
  })

  it('shows the server refusal when a part that messages include is deleted', async () => {
    routes(signature, [remove('/api/v1/mail/library/part/signature', () => refuse(409, {
      error: 'Footer, line 4', kind: 'CONFLICT', details: { code: 'mail_resource_in_use', messages: ['welcome', 'notice'] },
    }))])
    const wrapper = await open('parts/signature/content')
    vi.mocked(host.confirm).mockResolvedValueOnce(true)
    await button(wrapper, 'Delete')!.trigger('click')
    await flushPromises()
    expect(host.confirm).toHaveBeenCalledWith(expect.objectContaining({ header: 'Delete Signature?', acceptLabel: 'Delete part' }))
    expect(api.delete).toHaveBeenCalledWith('/api/v1/mail/library/part/signature', { data: { expected_revision: 6 } })
    expect(document.body.textContent).toContain('2 messages include it: Customer welcome, Notice. Remove it from them first.')
    wrapper.unmount()
  })

  it('deletes an unused resource and returns to its kind', async () => {
    routes({ ...newsletter, used_by: { messages: [] } }, [remove('/api/v1/mail/library/base/newsletter', () => ok(true))])
    const wrapper = await open('bases/newsletter/content')
    vi.mocked(host.confirm).mockResolvedValueOnce(true)
    await button(wrapper, 'Delete')!.trigger('click')
    await flushPromises()
    expect(host.confirm).toHaveBeenCalledWith(expect.objectContaining({ message: 'It is not used anywhere. You can\'t undo this.', acceptClass: 'p-button-danger' }))
    expect(wrapper.emitted('navigate')?.at(-1)).toEqual(['bases'])
    wrapper.unmount()
  })

  it('offers no Delete for included resources', async () => {
    routes({ ...standard, used_by: { messages: [] } })
    const wrapper = await open('bases/standard/content')
    expect(button(wrapper, 'Delete')).toBeUndefined()
    expect(button(wrapper, 'Duplicate')).toBeDefined()
    wrapper.unmount()
  })

  it('lists part inputs with their defaults and samples', async () => {
    routes(signature)
    const wrapper = await open('parts/signature/variables')
    expect(wrapper.find('h1').text()).toBe('Inputs')
    const rows = wrapper.findAll('tbody tr').map(row => row.text())
    expect(rows[0]).toContain('name')
    expect(rows[0]).toContain('Required')
    expect(rows[0]).toContain('Reporting team')
    expect(rows[1]).toContain('Team')
    wrapper.unmount()
  })

  it('shows recent senders of a message and links to its Activity', async () => {
    routes({ ...notice, used_by: { recent_senders: [{ sender: 'user-1', origin: { kind: 'automation', id: 'a1', label: 'Monday report' }, count: 4 }] } })
    const wrapper = await open('messages/notice/used-by')
    expect(wrapper.text()).toContain('Dana Lee')
    expect(wrapper.text()).toContain('Automation · Monday report')
    expect(wrapper.text()).toContain('4 messages')
    await button(wrapper, 'Open in Activity')!.trigger('click')
    expect(wrapper.emitted('navigate')?.at(-1)).toEqual(['activity/template/notice'])
    wrapper.unmount()
  })

  it('reloads on a change to this resource and shows the gone state after deletion elsewhere', async () => {
    let gone = false
    serve([
      get('/api/v1/mail/library', () => ok({ items: [...library] })),
      get('/api/v1/mail/delivery', () => ok({ configured: true })),
      get('/api/v1/mail/library/message/welcome', () => gone
        ? refuse(404, { error: 'Mail library resource was not found', kind: 'NOT_FOUND', details: { code: 'mail_resource_not_found' } })
        : ok(welcome)),
    ])
    const wrapper = await open('messages/welcome/content')
    expect(wrapper.find('h1').text()).toBe('Message')
    gone = true
    notify('mail.library.changed', { data: { kind: 'message', name: 'welcome', revision: 3 } })
    await flushPromises()
    expect(wrapper.text()).toContain('This resource no longer exists')
    expect(wrapper.text()).toContain('It was deleted while you were away.')
    wrapper.unmount()
  })
})
