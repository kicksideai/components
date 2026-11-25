// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { host, loadByTagName } from '@wippy-fe/proxy'
import { describe, expect, it, vi } from 'vitest'
import DeliverySettings from './DeliverySettings.vue'
import { notify } from '../test/setup'
import { calls, get, message, ok, post, put, refuse, serve } from '../test/fixtures'
import type { DeliveryStatus, TransportStatus } from '../types'

const mailgun = 'kickside.mail.mailgun:transport'
const resend = 'kickside.mail.resend:transport'
const transports: TransportStatus[] = [
  { id: mailgun, title: 'Mailgun', icon: 'tabler:mail', description: 'Sends through Mailgun.', settings_ns: 'kickside.mail.mailgun', ready: true, idempotent: false },
  { id: resend, title: 'Resend', icon: 'tabler:send', description: 'Sends through Resend.', settings_ns: 'kickside.mail.resend', ready: false,
    idempotent: true, code: 'api_key_required', reason: 'Add a Resend API key.' },
]

// Mail's delivery status read, and the Settings write of the driver key that checks the revision it was read at.
function server(initial: { driver?: string; revision?: number } = {}) {
  const state = { driver: initial.driver, revision: initial.revision ?? (initial.driver ? 4 : 0) }
  const status = (): DeliveryStatus => {
    const chosen = transports.find(item => item.id === state.driver)
    return {
      transports, driver_revision: state.revision, driver: chosen && { id: chosen.id, label: chosen.title },
      configured: !!chosen?.ready, ready: !!chosen?.ready,
      reason: !chosen ? 'Choose a delivery service for Mail.' : chosen.ready ? undefined : chosen.reason,
    }
  }
  const routes = [
    get('/api/v1/mail/delivery', () => ok(status())),
    put('/api/v1/settings', (_path, body) => {
      const write = body as { namespace: string; key: string; value: string; expected_revision: number }
      if (write.expected_revision !== state.revision) {
        return refuse(409, { conflict: true, namespace: write.namespace, key: write.key, revision: state.revision, message: 'setting changed' })
      }
      state.driver = write.value
      state.revision++
      return Promise.resolve({ data: { success: true, updated: [{ namespace: write.namespace, key: write.key, revision: state.revision }] } })
    }),
  ]
  return { state, routes }
}

async function open() {
  const wrapper = mount(DeliverySettings, { attachTo: document.body })
  await flushPromises()
  await flushPromises()
  return wrapper
}
const button = (wrapper: Awaited<ReturnType<typeof open>>, label: string) =>
  wrapper.findAll('button').find(node => node.text() === label || node.attributes('aria-label') === label)
const providers = (wrapper: Awaited<ReturnType<typeof open>>) =>
  wrapper.findAll('kickside-settings-provider').map(node => JSON.parse(node.attributes('config') ?? '{}') as { namespace: string; title: string })
async function choose(wrapper: Awaited<ReturnType<typeof open>>, id: string) {
  wrapper.findComponent({ name: 'Select' }).vm.$emit('update:modelValue', id)
  await flushPromises()
  await flushPromises()
}

describe('Mail delivery settings block', () => {
  it('lists the admitted services with their readiness and setup issue, and has no field for a typed ID', async () => {
    serve(server({ driver: resend }).routes)
    const wrapper = await open()
    const select = wrapper.findComponent({ name: 'Select' })
    expect(select.props('options')).toEqual([
      expect.objectContaining({ value: mailgun, label: 'Mailgun', ready: true }),
      expect.objectContaining({ value: resend, label: 'Resend', ready: false, reason: 'Add a Resend API key.' }),
    ])
    expect(select.props('modelValue')).toBe(resend)
    expect(wrapper.text()).toContain('Add a Resend API key.')
    expect(wrapper.findAll('input[type="text"], input:not([type])').length).toBe(0)
    wrapper.unmount()
  })

  it('shows the sender fields, then the chosen service settings, through the platform settings provider', async () => {
    serve(server({ driver: mailgun }).routes)
    const wrapper = await open()
    expect(loadByTagName).toHaveBeenCalledWith('kickside-settings-provider', expect.anything())
    expect(providers(wrapper).map(item => item.namespace)).toEqual(['kickside.mail', 'kickside.mail.mailgun'])
    expect(providers(wrapper)[1].title).toBe('Mailgun')
    wrapper.unmount()
  })

  it('emits a composed navigation event to the host', async () => {
    serve(server({ driver: mailgun }).routes)
    const wrapper = await open()
    const navigate = vi.fn()
    document.body.addEventListener('navigate', navigate, { once: true })
    try {
      await button(wrapper, 'Templates')!.trigger('click')
      expect(navigate).toHaveBeenCalledWith(expect.objectContaining({
        detail: { path: '/system/mail' }, bubbles: true, composed: true,
      }))
    } finally {
      document.body.removeEventListener('navigate', navigate)
      wrapper.unmount()
    }
  })

  it('shows an Activity read failure while keeping the send receipt', async () => {
    serve([
      post('/api/v1/mail/delivery/send-test', () => ok({ message_id: 'm-test', status: 'queued' })),
      get('/api/v1/mail/activity/m-test', () => refuse(503, { error: 'Activity temporarily unavailable' })),
      ...server({ driver: mailgun }).routes,
    ])
    const wrapper = await open()
    await button(wrapper, 'Send test email')!.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('The test email status could not be loaded.')
    expect(wrapper.text()).toContain('Sending the test…')
    wrapper.unmount()
  })

  it('switches the service from the revision it read, then shows that service settings', async () => {
    vi.mocked(host.confirm).mockResolvedValueOnce(true)
    const { state, routes } = server({ driver: mailgun, revision: 7 })
    serve(routes)
    const wrapper = await open()
    await choose(wrapper, resend)
    expect(host.confirm).toHaveBeenCalledOnce()
    expect(calls('put')).toEqual([['/api/v1/settings', { namespace: 'kickside.mail', key: 'driver', value: resend, expected_revision: 7 }]])
    expect(state.driver).toBe(resend)
    expect(providers(wrapper).map(item => item.namespace)).toEqual(['kickside.mail', 'kickside.mail.resend'])
    expect(wrapper.text()).toContain('Mail now sends through Resend.')
    wrapper.unmount()
  })

  it('keeps the saved service when the switch is not confirmed', async () => {
    vi.mocked(host.confirm).mockResolvedValueOnce(false)
    serve(server({ driver: mailgun }).routes)
    const wrapper = await open()
    await choose(wrapper, resend)
    expect(calls('put')).toEqual([])
    expect(wrapper.findComponent({ name: 'Select' }).props('modelValue')).toBe(mailgun)
    wrapper.unmount()
  })

  it('reads the service again when someone else changed it meanwhile and writes nothing over it', async () => {
    const { state, routes } = server()
    serve(routes)
    const wrapper = await open()
    state.driver = mailgun
    state.revision = 1
    await choose(wrapper, resend)
    expect(calls('put')).toEqual([['/api/v1/settings', { namespace: 'kickside.mail', key: 'driver', value: resend, expected_revision: 0 }]])
    expect(state.driver).toBe(mailgun)
    expect(wrapper.findComponent({ name: 'Select' }).props('modelValue')).toBe(mailgun)
    expect(wrapper.text()).toContain('Someone changed the delivery service while you were here.')
    wrapper.unmount()
  })

  it('shows the server refusal beside the service and keeps the saved one', async () => {
    serve([
      get('/api/v1/mail/delivery', () => ok({ transports, driver_revision: 0, configured: false, ready: false, reason: 'Choose a delivery service for Mail.' })),
      put('/api/v1/settings', () => refuse(400, { namespace: 'kickside.mail', key: 'driver', message: 'The active mail driver is not admitted',
        error: 'kickside.mail:driver: The active mail driver is not admitted' })),
    ])
    const wrapper = await open()
    await choose(wrapper, mailgun)
    expect(host.confirm).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('The active mail driver is not admitted')
    expect(wrapper.findComponent({ name: 'Select' }).props('modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('tells someone without delivery administration to ask for access and names no service', async () => {
    serve([get('/api/v1/mail/delivery', () => refuse(403, { error: 'Forbidden', kind: 'PERMISSION_DENIED' }))])
    const wrapper = await open()
    expect(wrapper.text()).toContain('Ask an administrator to grant you access to mail delivery.')
    expect(wrapper.text()).not.toMatch(/Mailgun|Resend/)
    expect(providers(wrapper)).toEqual([])
    wrapper.unmount()
  })

  it('explains an unconfigured service and holds the test, saying why in the row', async () => {
    serve(server().routes)
    const wrapper = await open()
    expect(wrapper.text()).toContain('Mail is not set up yet.')
    expect(wrapper.text()).toContain('Choose a delivery service for Mail.')
    expect(button(wrapper, 'Send test email')!.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Choose a service to send a test.')
    wrapper.unmount()
  })

  it('sends a test to the administrator and names the next step when the service refuses the credentials', async () => {
    let current = message('m-test', { status: 'queued' })
    serve([
      post('/api/v1/mail/delivery/send-test', () => ok({ message_id: 'm-test', status: 'queued' })),
      get('/api/v1/mail/activity/m-test', () => ok(current)),
      ...server({ driver: mailgun }).routes,
    ])
    const wrapper = await open()
    await button(wrapper, 'Send test email')!.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Sending the test…')

    current = message('m-test', { status: 'failed', last_error: { kind: 'PERMISSION_DENIED', code: 'credentials_invalid', message: 'Ask a mail administrator to check delivery authorization.' } })
    notify('mail.activity')
    await flushPromises()
    expect(wrapper.text()).toContain('Mailgun refused the credentials.')
    expect(wrapper.text()).toContain('Check the API key above, save, and send again.')
    wrapper.unmount()
  })
})
