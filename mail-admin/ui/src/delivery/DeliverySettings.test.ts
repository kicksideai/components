// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { loadByTagName } from '@wippy-fe/proxy'
import { describe, expect, it, vi } from 'vitest'
import DeliverySettings from './DeliverySettings.vue'
import { notify } from '../test/setup'
import { calls, get, message, ok, post, put, refuse, serve } from '../test/fixtures'
import type { Setting } from './api'

const drivers = [
  { id: 'mailgun', label: 'Mailgun', icon: 'tabler:mail', description: 'Sends through Mailgun.', settings_ns: 'kickside.mail.mailgun', settings_view: 'kickside-mailgun-settings' },
  { id: 'resend', label: 'Resend', icon: 'tabler:send', description: 'Sends through Resend.', settings_ns: 'kickside.mail.resend' },
]
const setting = (namespace: string, key: string, extra: Partial<Setting> = {}): Setting =>
  ({ namespace, key, value: '', value_type: 'string', default: '', title: key, ...extra })
const mail = (driver: string) => [
  setting('kickside.mail', 'driver', { value: driver }),
  setting('kickside.mail', 'from_address', { value: 'support@example.org', title: 'From address' }),
  setting('kickside.mail', 'from_name', { value: 'Example' }),
  setting('kickside.mail', 'reply_to'),
]
const resend = [
  setting('kickside.mail.resend', 'api_key', { value_type: 'secret', is_secret: true, has_value: true, title: 'API key' }),
  setting('kickside.mail.resend', 'region', { value: 'us', title: 'Region', schema: { enum: ['us', 'eu'] } }),
]
const mailgun = [
  setting('kickside.mail.mailgun', 'api_key', { value_type: 'secret', is_secret: true, has_value: true }),
  setting('kickside.mail.mailgun', 'domain', { value: 'mg.example.org' }),
  setting('kickside.mail.mailgun', 'region', { value: 'us' }),
]
const byNamespace: Record<string, Setting[]> = { 'kickside.mail.resend': resend, 'kickside.mail.mailgun': mailgun }

function serveDelivery(driver: string, extra: Parameters<typeof serve>[0] = [], status = { configured: true }) {
  serve([
    ...extra,
    get('/api/v1/mail-admin/drivers', () => ok({ items: drivers })),
    get('/api/v1/mail/delivery', () => ok(status)),
    get('/api/v1/settings', (_path, options) => {
      const namespace = (options as { params: { namespace: string } }).params.namespace
      return Promise.resolve({ data: { success: true, settings: namespace === 'kickside.mail' ? mail(driver) : byNamespace[namespace] ?? [] } })
    }),
  ])
}

async function open() {
  const wrapper = mount(DeliverySettings, { attachTo: document.body })
  await flushPromises()
  await flushPromises()
  return wrapper
}
const button = (wrapper: Awaited<ReturnType<typeof open>>, label: string) =>
  wrapper.findAll('button').find(node => node.text() === label || node.attributes('aria-label') === label)

describe('Mail delivery settings block', () => {
  it('renders generated rows for a driver without its own view and saves its settings before the service', async () => {
    serveDelivery('mailgun', [put('/api/v1/settings', () => ok({ updated: [] }))])
    const wrapper = await open()
    expect(loadByTagName).toHaveBeenCalledWith('kickside-mailgun-settings')
    expect(wrapper.find('kickside-mailgun-settings').exists()).toBe(true)

    const select = wrapper.findComponent({ name: 'Select' })
    select.vm.$emit('update:modelValue', 'resend')
    await flushPromises()
    expect(wrapper.find('kickside-mailgun-settings').exists()).toBe(false)
    expect(wrapper.text()).toContain('API key')
    expect(wrapper.text()).toContain('Set')
    expect(wrapper.find('input[type="password"]').exists()).toBe(false)

    await button(wrapper, 'Replace')!.trigger('click')
    await wrapper.find('.mail-delivery-rows input[type="password"]').setValue('re_new')
    await flushPromises()
    await button(wrapper, 'Review changes')!.trigger('click')
    await flushPromises()
    expect(document.body.textContent).toContain('Service: Resend')
    expect(document.body.textContent).toContain('Resend: API key')
    const save = [...document.body.querySelectorAll('button')].find(node => node.textContent?.trim() === 'Save')!
    save.click()
    await flushPromises()
    const [[, body]] = calls('put')
    expect((body as { values: unknown[] }).values).toEqual([
      { namespace: 'kickside.mail.resend', key: 'api_key', value: 're_new' },
      { namespace: 'kickside.mail', key: 'driver', value: 'resend' },
    ])
    wrapper.unmount()
  })

  it('mounts the driver view with saved values and secret presence, and follows its change and validity events', async () => {
    serveDelivery('mailgun')
    const wrapper = await open()
    const view = wrapper.find('kickside-mailgun-settings')
    expect(JSON.parse(view.attributes('values')!)).toEqual({ domain: 'mg.example.org', region: 'us' })
    expect(JSON.parse(view.attributes('secrets')!)).toEqual({ api_key: true })
    expect(view.attributes('values')).not.toContain('api_key')

    view.element.dispatchEvent(new CustomEvent('change', { detail: { values: { domain: 'bad domain' } } }))
    view.element.dispatchEvent(new CustomEvent('validity', { detail: { valid: false } }))
    await flushPromises()
    expect(button(wrapper, 'Review changes')!.attributes('disabled')).toBeDefined()

    view.element.dispatchEvent(new CustomEvent('validity', { detail: { valid: true } }))
    await flushPromises()
    expect(button(wrapper, 'Review changes')!.attributes('disabled')).toBeUndefined()
    wrapper.unmount()
  })

  it('returns a refused value to the driver view and keeps the draft', async () => {
    serveDelivery('mailgun', [put('/api/v1/settings', () => refuse(400, { namespace: 'kickside.mail.mailgun', key: 'domain', message: 'Enter a valid sending domain' }))])
    const wrapper = await open()
    wrapper.find('kickside-mailgun-settings').element.dispatchEvent(new CustomEvent('change', { detail: { values: { domain: 'mg.example.net' } } }))
    await flushPromises()
    await button(wrapper, 'Review changes')!.trigger('click')
    await flushPromises();
    [...document.body.querySelectorAll('button')].find(node => node.textContent?.trim() === 'Save')!.click()
    await flushPromises()
    expect(JSON.parse(wrapper.find('kickside-mailgun-settings').attributes('errors')!)).toEqual({ domain: 'Enter a valid sending domain' })
    expect(document.body.textContent).toContain('Some changes were not saved.')
    expect(button(wrapper, 'Discard')).toBeDefined()
    wrapper.unmount()
  })

  it('tells someone without delivery administration to ask for access and names no service', async () => {
    serve([
      get('/api/v1/mail-admin/drivers', () => refuse(403, { error: 'Forbidden', code: 'mail_delivery_denied', kind: 'PERMISSION_DENIED' })),
      get('/api/v1/mail/delivery', () => refuse(403, { error: 'Forbidden', kind: 'PERMISSION_DENIED' })),
      get('/api/v1/settings', () => refuse(403, { error: 'Forbidden', kind: 'PERMISSION_DENIED' })),
    ])
    const wrapper = await open()
    expect(wrapper.text()).toContain('Ask an administrator to grant you access to mail delivery.')
    expect(wrapper.text()).not.toMatch(/Mailgun|Resend/)
    wrapper.unmount()
  })

  it('explains an unconfigured service and holds the test until it is set up', async () => {
    serveDelivery('', [], { configured: false, reason: 'Choose a delivery service.' } as never)
    const wrapper = await open()
    expect(wrapper.text()).toContain('Mail is not set up yet.')
    expect(wrapper.text()).toContain('Choose a delivery service.')
    expect(button(wrapper, 'Send test email')!.attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('sends a test to the administrator and shows the service refusal when it fails', async () => {
    let current = message('m-test', { status: 'queued' as never, kind: 'test' } as never)
    serveDelivery('mailgun', [
      post('/api/v1/mail/delivery/send-test', () => ok({ message_id: 'm-test', status: 'queued' })),
      get('/api/v1/mail/activity/m-test', () => ok(current)),
    ])
    const wrapper = await open()
    await button(wrapper, 'Send test email')!.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Sending the test…')

    current = message('m-test', { status: 'failed', last_error: { message: 'mailgun: 401 Invalid private key' } } as never)
    notify('mail.message.changed', { message_id: 'm-test', status: 'failed' })
    await flushPromises()
    expect(wrapper.text()).toContain('The service did not accept the test.')
    expect(wrapper.find('code.mail-problem-detail').text()).toBe('mailgun: 401 Invalid private key')
    wrapper.unmount()
  })
})
