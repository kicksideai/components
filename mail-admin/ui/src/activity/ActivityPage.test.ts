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

const activityCapabilities = get('/api/v1/mail/capabilities', () => ok({ send: true, edit_library: true, administer_delivery: true }))
const deliveryStatus = get('/api/v1/mail/delivery', () => ok({ configured: true }))

function routes(extra: Parameters<typeof serve>[0] = []) {
  serve([
    activityCapabilities,
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
    expect(drawer.find('.mail-failure').text()).toContain('The delivery service rejected the message itself.')
    expect(drawer.find('.mail-failure').text()).toContain('Check the recipients, the subject and the attachments.')
    expect(drawer.text()).toContain('Failed after 3 attempts')
    await drawer.findAll('button').find(node => node.text() === 'Send again')!.trigger('click')
    await flushPromises()
    expect(resend).toHaveBeenCalled()
    expect(wrapper.find('.mail-failure').text()).toContain('Sent again as a new message.')
    await wrapper.findAll('button').find(node => node.text() === 'Open the new message')!.trigger('click')
    expect(wrapper.emitted('navigate')?.at(-1)).toEqual(['activity/2b9f1c2e-1111-4222-8333-444455556666'])
    wrapper.unmount()
  })

  it('offers Send again whenever Mail says the message can be resent, beside the delivery settings', async () => {
    const refused = { ...failed, last_error: { kind: 'INVALID', code: 'authorization_refused', message: 'Ask a mail administrator to check why the message was refused.' } }
    serve([
      activityCapabilities,
      get('/api/v1/mail/library', () => ok({ items: [] })),
      get('/api/v1/mail/delivery', () => ok({ configured: true, driver: { id: 'fixture', label: 'Acme Mail' } })),
      get('/api/v1/mail/activity', () => ok({ items: [refused], has_more: false, total: 1, failed_today: 1 })),
      get(`/api/v1/mail/activity/${failedId}`, () => ok(refused)),
    ])
    const wrapper = await open(`activity/${failedId}`)
    const text = wrapper.find('.mail-failure').text()
    expect(text).toContain('Acme Mail refused to send for this account.')
    expect(wrapper.findAll('button').some(node => node.text() === 'Send again')).toBe(true)
    const navigate = vi.fn()
    wrapper.element.addEventListener('navigate', navigate)
    await wrapper.findAll('button').find(node => node.text() === 'Open delivery settings')!.trigger('click')
    expect(navigate).toHaveBeenCalledWith(expect.objectContaining({
      detail: { path: '/system/settings/mail' }, bubbles: true, composed: true,
    }))
    wrapper.unmount()
  })

  it('says when the count is a minimum, and what a search covers', async () => {
    serve([
      activityCapabilities,
      get('/api/v1/mail/library', () => ok({ items: [] })),
      get('/api/v1/mail/delivery', () => ok({ configured: true })),
      get('/api/v1/mail/activity', (_path, options) => ok({ items: [sent], has_more: true, next_cursor: 'x', total: 10000, total_is_lower_bound: true, failed_today: 0,
        ...((options as { params: Record<string, string> }).params.q ? {} : {}) })),
    ])
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const wrapper = await open('activity')
    expect(wrapper.find('.mail-count').text()).toBe(`${(10000).toLocaleString()}+ messages`)
    expect(wrapper.text()).not.toContain('Search looks through the newest 10,000 messages')
    await wrapper.find('input[type="search"]').setValue('weekly')
    vi.advanceTimersByTime(300)
    await flushPromises()
    expect(wrapper.text()).toContain('Search looks through the newest 10,000 messages that match the other filters.')
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('keeps a direct Activity link private for a sender without delivery administration', async () => {
    serve([
      deliveryStatus,
      get('/api/v1/mail/library', () => ok({ items: [] })),
      get('/api/v1/mail/capabilities', () => ok({ send: true, edit_library: true, administer_delivery: false })),
    ])
    const wrapper = await open(`activity/${failedId}`)
    expect(wrapper.find('[role="alert"]').text()).toContain('Ask an administrator to grant you access to mail delivery.')
    expect(calls('get').some(([path]) => path.startsWith('/api/v1/mail/activity'))).toBe(false)
    wrapper.unmount()
  })

  it('refetches filtered Activity and the open message after a topic-only invalidation', async () => {
    routes()
    const wrapper = await open(`activity/${failedId}`)
    await wrapper.findAll('.p-togglebutton').find(node => node.text() === 'Failed')!.trigger('click')
    await flushPromises()
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.find('.kx-notice.error').text()).toContain('1 message failed today.')
    const resolved = { ...failed, status: 'sent', subject: 'Invoice reminder (sent)', last_error: undefined }
    serve([
      activityCapabilities,
      deliveryStatus,
      get('/api/v1/mail/activity', () => ok({ items: [], has_more: false, total: 0, failed_today: 0 })),
      get(`/api/v1/mail/activity/${failedId}`, () => ok(resolved)),
      get('/api/v1/mail/library', () => ok({ items: [] })),
    ])
    notify('mail.activity')
    await flushPromises()
    expect(wrapper.findAll('tbody tr')).toHaveLength(0)
    expect(wrapper.find('.mail-count').text()).toBe('0 messages')
    expect(wrapper.find('.kx-notice.error').exists()).toBe(false)
    expect(wrapper.find('.mail-drawer-title').text()).toContain('Invoice reminder (sent)')
    const last = calls('get').filter(([path]) => path === '/api/v1/mail/activity').at(-1)
    expect(last?.[1]).toMatchObject({ params: { status: 'failed', limit: '50' } })
    wrapper.unmount()
  })
})
