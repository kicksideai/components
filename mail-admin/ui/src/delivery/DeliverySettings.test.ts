// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { host, loadByTagName } from '@wippy-fe/proxy'
import { describe, expect, it, vi } from 'vitest'
import DeliverySettings from './DeliverySettings.vue'
import { hostEmit, notify } from '../test/setup'
import { calls, get, message, ok, post, put, refuse, serve } from '../test/fixtures'
import type { Setting } from './api'

const drivers = [
  { id: 'mailgun', label: 'Mailgun', icon: 'tabler:mail', description: 'Sends through Mailgun.', settings_ns: 'kickside.mail.mailgun', settings_view: 'kickside-mailgun-settings' },
  { id: 'resend', label: 'Resend', icon: 'tabler:send', description: 'Sends through Resend.', settings_ns: 'kickside.mail.resend' },
]
const definitions: Record<string, Setting[]> = {
  'kickside.mail.mailgun': [
    { namespace: 'kickside.mail.mailgun', key: 'api_key', value_type: 'secret', is_secret: true, title: 'API key' },
    { namespace: 'kickside.mail.mailgun', key: 'domain', value_type: 'string', default: '', title: 'Sending domain' },
    { namespace: 'kickside.mail.mailgun', key: 'region', value_type: 'string', default: 'us', title: 'Region' },
  ],
  'kickside.mail.resend': [
    { namespace: 'kickside.mail.resend', key: 'api_key', value_type: 'secret', is_secret: true, title: 'API key' },
    { namespace: 'kickside.mail.resend', key: 'region', value_type: 'string', default: 'us', title: 'Region', schema: { enum: ['us', 'eu'] } },
  ],
}

// A Settings server that keeps values, writes in order and stops at the first refusal, as the platform does.
function settingsServer(initial: Record<string, Record<string, unknown>>, refuseKey?: { namespace: string; key: string; message: string }) {
  const state: Record<string, Record<string, unknown>> = JSON.parse(JSON.stringify(initial))
  const view = (namespace: string): Setting[] => (definitions[namespace] ?? []).map(item => item.is_secret
    ? { ...item, has_value: state[namespace]?.[item.key] !== undefined }
    : { ...item, value: state[namespace]?.[item.key] ?? item.default })
  const mailRows = () => ['driver', 'from_address', 'from_name', 'reply_to'].map(key => ({
    namespace: 'kickside.mail', key, value_type: 'string', value: state['kickside.mail']?.[key] ?? '',
  }))
  const routes = [
    get('/api/v1/mail/delivery/drivers', () => ok({ items: drivers.map(item => ({ ...item, settings: view(item.settings_ns) })) })),
    get('/api/v1/mail/delivery', () => ok({ configured: !!state['kickside.mail']?.driver, reason: state['kickside.mail']?.driver ? undefined : 'Choose a delivery service for Mail.' })),
    get('/api/v1/settings', () => Promise.resolve({ data: { success: true, settings: mailRows() } })),
    put('/api/v1/settings', (_path, body) => {
      for (const write of (body as { values: { namespace: string; key: string; value: unknown }[] }).values) {
        if (refuseKey && write.namespace === refuseKey.namespace && write.key === refuseKey.key) {
          return refuse(400, { namespace: write.namespace, key: write.key, message: refuseKey.message, error: `${write.namespace}:${write.key}: ${refuseKey.message}` })
        }
        state[write.namespace] = { ...state[write.namespace] }
        if (write.value === null) delete state[write.namespace][write.key]
        else state[write.namespace][write.key] = write.value
      }
      return ok({ updated: [] })
    }),
  ]
  return { state, routes }
}

const savedMailgun = { 'kickside.mail': { driver: 'mailgun', from_address: 'support@example.org', from_name: 'Example' }, 'kickside.mail.mailgun': { api_key: 'k', domain: 'mg.example.org', region: 'us' } }

async function open() {
  const wrapper = mount(DeliverySettings, { attachTo: document.body })
  await flushPromises()
  await flushPromises()
  return wrapper
}
const button = (wrapper: Awaited<ReturnType<typeof open>>, label: string) =>
  wrapper.findAll('button').find(node => node.text() === label || node.attributes('aria-label') === label)
async function reviewAndSave(wrapper: Awaited<ReturnType<typeof open>>) {
  await button(wrapper, 'Review changes')!.trigger('click')
  await flushPromises()
  ;[...document.body.querySelectorAll('button')].find(node => node.textContent?.trim() === 'Save')!.click()
  await flushPromises()
  await flushPromises()
}

describe('Mail delivery settings block', () => {
  it('renders generated rows for a driver without its own view and saves its settings before the service', async () => {
    const server = settingsServer({ ...savedMailgun, 'kickside.mail.resend': { api_key: 'old' } })
    serve(server.routes)
    const wrapper = await open()
    expect(loadByTagName).toHaveBeenCalledWith('kickside-mailgun-settings')
    expect(wrapper.find('kickside-mailgun-settings').exists()).toBe(true)

    wrapper.findComponent({ name: 'Select' }).vm.$emit('update:modelValue', 'resend')
    await flushPromises()
    expect(wrapper.find('kickside-mailgun-settings').exists()).toBe(false)
    expect(wrapper.text()).toContain('API key')
    expect(wrapper.text()).toContain('Set')
    expect(wrapper.find('input[type="password"]').exists()).toBe(false)

    await button(wrapper, 'Replace')!.trigger('click')
    await wrapper.find('input[type="password"]').setValue('re_new')
    await flushPromises()
    await reviewAndSave(wrapper)
    const [[, body]] = calls('put')
    expect((body as { values: unknown[] }).values).toEqual([
      { namespace: 'kickside.mail.resend', key: 'api_key', value: 're_new' },
      { namespace: 'kickside.mail', key: 'driver', value: 'resend' },
    ])
    expect(document.body.textContent).toContain('Saved: Resend: API key, Service: Resend.')
    expect(button(wrapper, 'Review changes')).toBeUndefined()
    wrapper.unmount()
  })

  it('lets a secret replacement be cancelled', async () => {
    serve(settingsServer({ ...savedMailgun, 'kickside.mail': { ...savedMailgun['kickside.mail'], driver: 'resend' }, 'kickside.mail.resend': { api_key: 'old' } }).routes)
    const wrapper = await open()
    await button(wrapper, 'Replace')!.trigger('click')
    await wrapper.find('input[type="password"]').setValue('typed')
    await flushPromises()
    expect(button(wrapper, 'Review changes')).toBeDefined()
    await button(wrapper, 'Cancel')!.trigger('click')
    await flushPromises()
    expect(wrapper.find('input[type="password"]').exists()).toBe(false)
    expect(button(wrapper, 'Review changes')).toBeUndefined()
    wrapper.unmount()
  })

  it('mounts the driver view with saved values and secret presence, and follows its change and validity events', async () => {
    serve(settingsServer(savedMailgun).routes)
    const wrapper = await open()
    const view = wrapper.find('kickside-mailgun-settings')
    expect(JSON.parse(view.attributes('values')!)).toEqual({ domain: 'mg.example.org', region: 'us' })
    expect(JSON.parse(view.attributes('secrets')!)).toEqual({ api_key: true })
    expect(view.attributes('values')).not.toContain('api_key')

    view.element.dispatchEvent(new CustomEvent('change', { detail: { values: { domain: 'bad domain' } } }))
    view.element.dispatchEvent(new CustomEvent('validity', { detail: { valid: false } }))
    await flushPromises()
    expect(button(wrapper, 'Review changes')!.attributes('disabled')).toBeDefined()
    expect(hostEmit).toHaveBeenLastCalledWith('dirty-change', { dirty: true })

    view.element.dispatchEvent(new CustomEvent('validity', { detail: { valid: true } }))
    await flushPromises()
    expect(button(wrapper, 'Review changes')!.attributes('disabled')).toBeUndefined()
    await button(wrapper, 'Discard')!.trigger('click')
    await flushPromises()
    expect(hostEmit).toHaveBeenLastCalledWith('dirty-change', { dirty: false })
    wrapper.unmount()
  })

  it('after a refusal, reads the true state and says which values were saved, which was refused and which wait', async () => {
    const server = settingsServer(savedMailgun, { namespace: 'kickside.mail.mailgun', key: 'domain', message: 'Enter a valid sending domain' })
    serve(server.routes)
    const wrapper = await open()
    wrapper.find('kickside-mailgun-settings').element.dispatchEvent(new CustomEvent('change', { detail: { values: { region: 'eu', domain: 'mg.example.net' } } }))
    await wrapper.find('input[aria-label="From name"]').setValue('Example Support')
    await flushPromises()
    await reviewAndSave(wrapper)
    expect(server.state['kickside.mail.mailgun'].region).toBe('eu')
    expect(server.state['kickside.mail'].from_name).toBe('Example')
    const text = document.body.textContent ?? ''
    expect(text).toContain('Saved: Mailgun: Region.')
    expect(text).toContain('Not saved: Mailgun: Sending domain. Enter a valid sending domain')
    expect(text).toContain('Still in your draft: From name.')
    const view = wrapper.find('kickside-mailgun-settings')
    expect(JSON.parse(view.attributes('values')!)).toEqual({ domain: 'mg.example.org', region: 'eu' })
    expect(JSON.parse(view.attributes('draft')!)).toEqual({ domain: 'mg.example.net' })
    expect(JSON.parse(view.attributes('errors')!)).toEqual({ domain: 'Enter a valid sending domain' })
    expect((wrapper.find('input[aria-label="From name"]').element as HTMLInputElement).value).toBe('Example Support')
    wrapper.unmount()
  })

  it('shows the server refusal of a sender name beside the field and keeps it in the draft', async () => {
    const server = settingsServer(savedMailgun, { namespace: 'kickside.mail', key: 'from_name', message: 'Use at most 255 characters without control characters or line breaks.' })
    serve(server.routes)
    const wrapper = await open()
    await wrapper.find('input[aria-label="From name"]').setValue('Acme\u0007')
    await flushPromises()
    await reviewAndSave(wrapper)
    const fieldError = () => wrapper.findAll('.mail-field-error').map(node => node.text()).join(' ')
    expect(fieldError()).toContain('Use at most 255 characters without control characters or line breaks.')
    expect((wrapper.find('input[aria-label="From name"]').element as HTMLInputElement).value).toBe('Acme\u0007')
    await wrapper.find('input[aria-label="From name"]').setValue('Acme')
    await flushPromises()
    expect(fieldError()).not.toContain('Use at most 255 characters')
    wrapper.unmount()
  })

  it('asks before leaving through its own links while there are unsaved changes', async () => {
    serve([
      post('/api/v1/mail/delivery/send-test', () => ok({ message_id: 'm-test', status: 'queued' })),
      get('/api/v1/mail/activity/m-test', () => ok(message('m-test', { status: 'failed', last_error: { kind: 'INVALID', code: 'message_rejected', message: 'Refused.' } }))),
      ...settingsServer(savedMailgun).routes,
    ])
    const wrapper = await open()
    await button(wrapper, 'Send test email')!.trigger('click')
    await flushPromises()
    await wrapper.find('input[aria-label="From name"]').setValue('Changed')
    await flushPromises()
    expect(button(wrapper, 'Templates')).toBeUndefined()
    vi.mocked(host.confirm).mockResolvedValueOnce(false)
    await button(wrapper, 'Open it in Activity')!.trigger('click')
    await flushPromises()
    expect(host.confirm).toHaveBeenCalledWith(expect.objectContaining({ header: 'Discard unsaved changes?' }))
    expect(host.navigate).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('tells someone without delivery administration to ask for access and names no service', async () => {
    serve([
      get('/api/v1/mail/delivery/drivers', () => refuse(403, { error: 'Forbidden', code: 'mail_delivery_denied', kind: 'PERMISSION_DENIED' })),
      get('/api/v1/mail/delivery', () => refuse(403, { error: 'Forbidden', kind: 'PERMISSION_DENIED' })),
      get('/api/v1/settings', () => refuse(403, { error: 'Forbidden', kind: 'PERMISSION_DENIED' })),
    ])
    const wrapper = await open()
    expect(wrapper.text()).toContain('Ask an administrator to grant you access to mail delivery.')
    expect(wrapper.text()).not.toMatch(/Mailgun|Resend/)
    wrapper.unmount()
  })

  it('explains an unconfigured service and holds the test, saying why in the row', async () => {
    serve(settingsServer({ 'kickside.mail': {} }).routes)
    const wrapper = await open()
    expect(wrapper.text()).toContain('Mail is not set up yet.')
    expect(wrapper.text()).toContain('Choose a delivery service for Mail.')
    expect(button(wrapper, 'Send test email')!.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Finish setting up delivery to send a test.')
    wrapper.unmount()
  })

  it('sends a test to the administrator and names the next step when the service refuses the credentials', async () => {
    let current = message('m-test', { status: 'queued' })
    serve([
      post('/api/v1/mail/delivery/send-test', () => ok({ message_id: 'm-test', status: 'queued' })),
      get('/api/v1/mail/activity/m-test', () => ok(current)),
      ...settingsServer(savedMailgun).routes,
    ])
    const wrapper = await open()
    await button(wrapper, 'Send test email')!.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Sending the test…')

    current = message('m-test', { status: 'failed', last_error: { kind: 'PERMISSION_DENIED', code: 'credentials_invalid', message: 'Ask a mail administrator to check delivery authorization.' } })
    notify('mail.activity')
    await flushPromises()
    expect(wrapper.text()).toContain('refused the credentials.')
    expect(wrapper.text()).toContain('Check the API key above, save, and send again.')
    wrapper.unmount()
  })
})
