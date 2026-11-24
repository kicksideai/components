// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import MailAdmin from '../app/MailAdmin.vue'
import { notify } from '../test/setup'
import { calls, get, message, ok, post, refuse, resource, serve } from '../test/fixtures'

const failedId = '0b9f1c2e-1111-4222-8333-444455556666'
const failed = message(failedId, {
  status: 'failed', subject: 'Invoice reminder', template: 'notice', to: ['billing@example.org'], attempts: 3,
  finished_at: Date.now() - 30_000, can_resend: true, driver_id: 'fixture',
  last_error: { kind: 'INVALID', code: 'message_rejected', message: 'The service does not accept mail from this sender yet.', provider_detail: 'sender not verified' },
  origin: { kind: 'workflow', id: 'run-1', label: 'Overdue invoices' },
})
const sent = message('1b9f1c2e-1111-4222-8333-444455556666', { subject: 'Weekly report', to: ['team@example.org', 'lead@example.org'], sent_at: Date.now() })

function routes(extra: Parameters<typeof serve>[0] = []) {
  serve([
    get('/api/v1/mail/library', () => ok({ items: [resource('message', 'notice', { title: 'Notice' })] })),
    get('/api/v1/mail/delivery', () => ok({ configured: true })),
    get('/api/v1/mail/activity', (_path, options) => {
      const params = (options as { params: Record<string, string> }).params
      const items = params.q ? [sent].filter(item => item.subject.toLowerCase().includes(params.q)) : params.status === 'failed' ? [failed] : [failed, sent]
      return ok({ items, has_more: false, total: items.length, failed_today: 1 })
    }),
    get(`/api/v1/mail/activity/${failedId}`, () => ok(failed)),
    ...extra,
  ])
}

async function open(route: string) {
  const wrapper = mount(MailAdmin, { props: { route }, attachTo: document.body })
  await flushPromises()
  return wrapper
}

describe('Mail activity', () => {
  it('lists messages with status, template, sender and origin, and names today\'s failures', async () => {
    routes()
    const wrapper = await open('activity')
    expect(wrapper.find('h1').text()).toBe('Activity')
    const rows = wrapper.findAll('tbody tr').map(row => row.text())
    expect(rows[0]).toContain('Failed')
    expect(rows[0]).toContain('Invoice reminder')
    expect(rows[0]).toContain('To billing@example.org')
    expect(rows[0]).toContain('Notice')
    expect(rows[0]).toContain('Dana Lee')
    expect(rows[0]).toContain('Workflow · Overdue invoices')
    expect(rows[1]).toContain('To team@example.org +1')
    expect(wrapper.find('.kx-notice.error').text()).toContain('1 message failed today.')
    expect(wrapper.find('.mail-count').text()).toBe('2 messages')
    wrapper.unmount()
  })

  it('passes status, message, period and search to the server', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    routes()
    const wrapper = await open('activity/template/notice')
    const pages = () => calls('get').filter(([path]) => path === '/api/v1/mail/activity')
      .map(([, options]) => (options as { params: Record<string, string> }).params).filter(params => params.limit === '50')
    const last = () => pages().at(-1)!
    expect(last().message).toBe('notice')
    await wrapper.findAll('.p-togglebutton').find(node => node.text() === 'Sent')!.trigger('click')
    await flushPromises()
    expect(last().status).toBe('sent')
    expect(Number(last().since)).toBeGreaterThan(Date.now() - 31 * 24 * 60 * 60 * 1000)
    await wrapper.find('input[type="search"]').setValue('weekly')
    vi.advanceTimersByTime(300)
    await flushPromises()
    expect(last().q).toBe('weekly')
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('opens a failed message with its reason and sends it again', async () => {
    const resend = vi.fn(() => ok({ message_id: '2b9f1c2e-1111-4222-8333-444455556666', status: 'queued' }))
    routes([post(`/api/v1/mail/activity/${failedId}/resend`, resend)])
    const wrapper = await open(`activity/${failedId}`)
    const drawer = wrapper.find('.mail-drawer-body')
    expect(drawer.find('h2').text()).toBe('Invoice reminder')
    expect(drawer.find('.mail-failure').text()).toContain('The service does not accept mail from this sender yet.')
    expect(drawer.text()).toContain('Failed after 3 attempts')
    await drawer.findAll('button').find(node => node.text() === 'Send again')!.trigger('click')
    await flushPromises()
    expect(resend).toHaveBeenCalled()
    expect(wrapper.find('.mail-failure').text()).toContain('Sent again as a new message.')
    await wrapper.findAll('button').find(node => node.text() === 'Open the new message')!.trigger('click')
    expect(wrapper.emitted('navigate')?.at(-1)).toEqual(['activity/2b9f1c2e-1111-4222-8333-444455556666'])
    wrapper.unmount()
  })

  it('shows a sender their own email with the neutral reason and no service details', async () => {
    const neutral = { ...failed, driver_id: undefined, provider_message_id: undefined,
      last_error: { kind: 'INVALID', code: 'message_rejected', message: 'Ask a mail administrator to check why the message was refused.' } }
    serve([
      get('/api/v1/mail/library', () => ok({ items: [] })),
      get('/api/v1/mail/capabilities', () => ok({ send: true, edit_library: true, administer_delivery: false })),
      get('/api/v1/mail/activity', () => ok({ items: [neutral], has_more: false, total: 1, failed_today: 1 })),
      get(`/api/v1/mail/activity/${failedId}`, () => ok(neutral)),
    ])
    const wrapper = await open(`activity/${failedId}`)
    expect(wrapper.find('.system-section-head p').text()).toBe('Email you sent in the last 30 days.')
    const drawer = wrapper.find('.mail-drawer-body')
    expect(drawer.find('.mail-failure').text()).toContain('Ask a mail administrator to check why the message was refused.')
    expect(drawer.text()).not.toContain('Delivery service')
    expect(drawer.text()).not.toContain('fixture')
    wrapper.unmount()
  })

  it('refreshes the list and the open message on a message change', async () => {
    routes()
    const wrapper = await open(`activity/${failedId}`)
    const count = (path: string) => calls('get').filter(([called]) => called === path).length
    const list = count('/api/v1/mail/activity'), one = count(`/api/v1/mail/activity/${failedId}`)
    notify('mail.message.changed', { data: { message_id: failedId, status: 'sent' } })
    await flushPromises()
    expect(count('/api/v1/mail/activity')).toBeGreaterThan(list)
    expect(count(`/api/v1/mail/activity/${failedId}`)).toBe(one + 1)
    wrapper.unmount()
  })
})
