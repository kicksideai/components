// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { host } from '@wippy-fe/proxy'
import { describe, expect, it, vi } from 'vitest'
import DeliverySettings from './DeliverySettings.vue'
import { hostEmit, notify } from '../test/setup'
import { calls, get, message, ok, post, put, refuse, serve } from '../test/fixtures'
import type { Setting } from './api'

const mailgun = 'kickside.mail.mailgun:transport'
const resend = 'kickside.mail.resend:transport'
const drivers = [
  { id: mailgun, title: 'Mailgun', icon: 'tabler:mail', description: 'Sends through Mailgun.', settings_ns: 'kickside.mail.mailgun', ready: true, idempotent: false },
  { id: resend, title: 'Resend', icon: 'tabler:send', description: 'Sends through Resend.', settings_ns: 'kickside.mail.resend', ready: true, idempotent: true },
]
const definitions: Record<string, Setting[]> = {
  'kickside.mail.mailgun': [
    { namespace: 'kickside.mail.mailgun', key: 'api_key', value_type: 'secret', is_secret: true, title: 'API key' },
    { namespace: 'kickside.mail.mailgun', key: 'domain', value_type: 'string', default: '', title: 'Sending domain', schema: { pattern: '^[a-z.]+$' } },
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
    get('/api/v1/mail/delivery', () => ok({ transports: drivers, ready: !!state['kickside.mail']?.driver, configured: !!state['kickside.mail']?.driver, reason: state['kickside.mail']?.driver ? undefined : 'Choose a delivery service for Mail.' })),
    get('/api/v1/settings', (_path, options) => {
      const namespace = (options as { params: { namespace: string } }).params.namespace
      return Promise.resolve({ data: { success: true, settings: namespace === 'kickside.mail' ? mailRows() : view(namespace) } })
    }),
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

const savedMailgun = { 'kickside.mail': { driver: mailgun, from_address: 'support@example.org', from_name: 'Example' }, 'kickside.mail.mailgun': { api_key: 'k', domain: 'mg.example.org', region: 'us' } }

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
  it('loads settings for the selected transport and saves them before switching service', async () => {
    const server = settingsServer({ ...savedMailgun, 'kickside.mail.resend': { api_key: 'old' } })
    serve(server.routes)
    const wrapper = await open()
    expect(wrapper.text()).toContain('Sending domain')

    wrapper.findComponent({ name: 'Select' }).vm.$emit('update:modelValue', resend)
    await flushPromises()
    expect(wrapper.text()).not.toContain('Sending domain')
    expect(calls('get')).toContainEqual(['/api/v1/settings', { params: { namespace: 'kickside.mail.resend' } }])
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
      { namespace: 'kickside.mail', key: 'driver', value: resend },
    ])
    expect(document.body.textContent).toContain('Saved: Resend: API key, Service: Resend.')
    expect(button(wrapper, 'Review changes')).toBeUndefined()
    wrapper.unmount()
  })

  it('lets a secret replacement be cancelled', async () => {
    serve(settingsServer({ ...savedMailgun, 'kickside.mail': { ...savedMailgun['kickside.mail'], driver: resend }, 'kickside.mail.resend': { api_key: 'old' } }).routes)
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

  it('shows masked settings and keeps invalid provider fields in the draft', async () => {
    serve(settingsServer(savedMailgun).routes)
    const wrapper = await open()
    const domain = () => wrapper.find('input[aria-label="Sending domain"]')
    expect((domain().element as HTMLInputElement).value).toBe('mg.example.org')
    expect(wrapper.find('input[type="password"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Set')

    await domain().setValue('bad domain')
    await flushPromises()
    expect(button(wrapper, 'Review changes')!.attributes('disabled')).toBeDefined()
    expect(hostEmit).toHaveBeenLastCalledWith('dirty-change', { dirty: true })

    await domain().setValue('mg.example.net')
    await flushPromises()
    expect(button(wrapper, 'Review changes')!.attributes('disabled')).toBeUndefined()
    await domain().setValue('bad domain')
    await button(wrapper, 'Discard')!.trigger('click')
    await flushPromises()
    expect(hostEmit).toHaveBeenLastCalledWith('dirty-change', { dirty: false })
    expect((domain().element as HTMLInputElement).value).toBe('mg.example.org')
    await wrapper.find('input[aria-label="From name"]').setValue('Updated name')
    expect(button(wrapper, 'Review changes')!.attributes('disabled')).toBeUndefined()
    wrapper.unmount()
  })

  it('after a refusal, reads the true state and says which values were saved, which was refused and which wait', async () => {
    const server = settingsServer(savedMailgun, { namespace: 'kickside.mail.mailgun', key: 'region', message: 'Choose the service region' })
    serve(server.routes)
    const wrapper = await open()
    await wrapper.find('input[aria-label="Sending domain"]').setValue('mg.example.net')
    await wrapper.find('input[aria-label="Region"]').setValue('eu')
    await wrapper.find('input[aria-label="From name"]').setValue('Example Support')
    await flushPromises()
    await reviewAndSave(wrapper)
    expect(server.state['kickside.mail.mailgun'].domain).toBe('mg.example.net')
    expect(server.state['kickside.mail'].from_name).toBe('Example')
    const text = document.body.textContent ?? ''
    expect(text).toContain('Saved: Mailgun: Sending domain.')
    expect(text).toContain('Not saved: Mailgun: Region. Choose the service region')
    expect(text).toContain('Still in your draft: From name.')
    expect((wrapper.find('input[aria-label="Sending domain"]').element as HTMLInputElement).value).toBe('mg.example.net')
    expect((wrapper.find('input[aria-label="Region"]').element as HTMLInputElement).value).toBe('eu')
    expect(wrapper.findAll('.mail-field-error').map(node => node.text())).toContain('Choose the service region')
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
