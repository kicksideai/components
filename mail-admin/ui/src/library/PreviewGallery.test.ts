// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PreviewGallery from './PreviewGallery.vue'
import { calls, get, ok, post, resource, row, serve } from '../test/fixtures'
import { mountWithMail } from '../test/mail'

const messages = Array.from({ length: 10 }, (_, index) => row(resource('message', `m-${index}`, { title: `Message ${index}` })))

function routes(pending: ((value: unknown) => void)[]) {
  serve([
    get('/api/v1/mail/library', () => ok({ items: messages })),
    post('/api/v1/mail/library/preview', () => new Promise(resolve => { pending.push(resolve) })),
  ])
}
// Every tile is in view: the observer reports each element as soon as it is observed.
class InView {
  constructor(private readonly callback: IntersectionObserverCallback) {}
  observe(target: Element) { this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver) }
  disconnect() {}
  unobserve() {}
}
beforeEach(() => { vi.stubGlobal('IntersectionObserver', InView) })

const previews = () => calls('post').filter(([path]) => path === '/api/v1/mail/library/preview').length

describe('Preview all messages', () => {
  afterEach(() => { document.body.innerHTML = ''; vi.unstubAllGlobals() })

  it('lists messages itself when opened and renders at most three at a time, with progress', async () => {
    const pending: ((value: unknown) => void)[] = []
    routes(pending)
    const { wrapper, props } = mountWithMail(PreviewGallery, { visible: false })
    await flushPromises()
    expect(calls('get')).toHaveLength(0)
    props.visible = true
    await flushPromises()
    expect(previews()).toBe(3)
    expect(document.body.textContent).toContain('0 of 10 messages rendered.')
    pending.shift()!({ data: { success: true, data: { subject: 'Hi', html: '<p>x</p>', text: 'x' } } })
    await flushPromises()
    expect(previews()).toBe(4)
    expect(document.body.textContent).toContain('1 of 10 messages rendered.')
    wrapper.unmount()
  })

  it('stops starting renders once closed and drops the answers still on their way', async () => {
    const pending: ((value: unknown) => void)[] = []
    routes(pending)
    const { wrapper, props } = mountWithMail(PreviewGallery, { visible: false })
    props.visible = true
    await flushPromises()
    expect(previews()).toBe(3)
    props.visible = false
    await flushPromises()
    for (const resolve of pending.splice(0)) resolve({ data: { success: true, data: { subject: 'Late', html: '<p>late</p>', text: 'late' } } })
    await flushPromises()
    expect(previews()).toBe(3)
    expect(document.body.textContent).not.toContain('Late')
    wrapper.unmount()
  })

  it('renders every message under a policy that refuses outside requests', async () => {
    serve([
      get('/api/v1/mail/library', () => ok({ items: messages.slice(0, 1) })),
      post('/api/v1/mail/library/preview', () => ok({ subject: 'Hi', html: '<html><head><title>x</title></head><body><p>x</p></body></html>', text: 'x' })),
    ])
    const { wrapper, props } = mountWithMail(PreviewGallery, { visible: false })
    props.visible = true
    await flushPromises()
    const frame = document.body.querySelector('.mail-gallery iframe')!
    expect(frame.getAttribute('sandbox')).toBe('')
    expect(frame.getAttribute('srcdoc')).toMatch(/^<!doctype html><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'">/)
    wrapper.unmount()
  })
})
