// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { api, host } from '@wippy-fe/proxy'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MailAdmin from '../app/MailAdmin.vue'
import { notify } from '../test/setup'
import { calls, dana, get, ok, post, put, refuse, remove, resource, revision, row, serve } from '../test/fixtures'
import type { Resource } from '../types'

const standard = resource('base', 'standard', { title: 'Standard', state: 'customized', revision: 7, author: 'user-1', author_label: dana, origin_label: 'Mail', updated_at: Date.UTC(2026, 10, 20, 9) })
const newsletter = resource('base', 'newsletter', { title: 'Newsletter', state: 'created', revision: 5, author: 'user-1', author_label: dana, updated_at: Date.now() })
const button = resource('part', 'button', { title: 'Button', state: 'original', revision: 0, origin_label: 'Mail',
  schema: { type: 'object', required: ['action_url'], properties: { action_url: { type: 'string', description: 'Destination address.' }, action_label: { type: 'string', default: 'Open' } } },
  samples: { action_url: 'https://example.org' } })
const notice = resource('message', 'notice', { title: 'Notice', origin_label: 'Mail' })
const welcome = resource('message', 'welcome', { title: 'Customer welcome', base: 'newsletter', state: 'created', revision: 3, author: 'user-1' })
const library = [standard, newsletter, button, notice, welcome].map(item => row(item))

function routes(item: Resource, extra: Parameters<typeof serve>[0] = []) {
  serve([
    ...extra,
    get('/api/v1/mail/library', () => ok({ items: [...library] })),
    get('/api/v1/mail/delivery', () => ok({ configured: true })),
    get(`/api/v1/mail/library/${item.kind}/${item.name}`, () => ok(item)),
    get(`/api/v1/mail/library/${item.kind}/${item.name}/history`, () => ok({ items: [revision(item, item.revision), revision(item, item.revision - 1, { version: item.revision - 1, note: 'Brand refresh' })] })),
    post('/api/v1/mail/library/preview', () => ok({ subject: 'Hello', html: '<html><body><img src="cid:mail-library-logo"> Preview</body></html>', text: 'Preview', inline_assets: { 'mail-library-logo': 'data:image/png;base64,AAAA' } })),
  ])
}

async function open(route: string) {
  const wrapper = mount(MailAdmin, { props: { route }, attachTo: document.body })
  await flushPromises()
  return wrapper
}
async function body(wrapper: Awaited<ReturnType<typeof open>>) {
  await vi.waitFor(() => { if (!wrapper.find('.mail-code-body textarea.code-editor-stub').exists()) throw new Error('editor not loaded') })
  return wrapper.find('.mail-code-body textarea.code-editor-stub')
}
afterEach(() => { vi.useRealTimers() })
const control = (wrapper: Awaited<ReturnType<typeof open>>, label: string) =>
  wrapper.findAll('button').find(node => node.text() === label)

describe('Library resource editor', () => {
  it('renders the draft preview with inline images from the returned data URIs', async () => {
    routes(notice)
    const wrapper = await open('messages/notice/content')
    const frame = wrapper.find('iframe.mail-preview-frame')
    expect(frame.attributes('sandbox')).toBe('')
    expect(frame.attributes('srcdoc')).toContain('src="data:image/png;base64,AAAA"')
    expect(wrapper.find('.mail-preview-envelope').text()).toContain('Hello')
    wrapper.unmount()
  })

  it('marks a draft unsaved, previews it, and saves it with the loaded revision and a note', async () => {
    const save = vi.fn((_path: string, sent?: unknown) => ok({ ...welcome, ...(sent as object), revision: 4 }))
    routes(welcome, [put('/api/v1/mail/library/message/welcome', save)])
    const wrapper = await open('messages/welcome/content')
    await body(wrapper)
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    await (await body(wrapper)).setValue('{{ block body() }}<p>Hi</p>{{ end }}')
    expect(wrapper.text()).toContain('Unsaved changes')
    vi.advanceTimersByTime(500)
    await flushPromises()
    const previews = calls('post').filter(([path]) => path === '/api/v1/mail/library/preview')
    expect((previews.at(-1)![1] as { resources: { html: string }[] }).resources[0].html).toBe('{{ block body() }}<p>Hi</p>{{ end }}')
    await control(wrapper, 'Review changes')!.trigger('click')
    expect(document.body.textContent).toContain('HTML')
    await wrapper.find('#mail-review input').setValue('Shorter greeting')
    await wrapper.find('#mail-review').trigger('submit')
    await flushPromises()
    expect(save).toHaveBeenCalledWith('/api/v1/mail/library/message/welcome', expect.objectContaining({ expected_revision: 3, note: 'Shorter greeting', html: '{{ block body() }}<p>Hi</p>{{ end }}' }))
    expect(wrapper.text()).toContain('Saved Customer welcome.')
    expect(wrapper.text()).not.toContain('Unsaved changes')
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('places an engine error under its face and blocks the review while it stands', async () => {
    routes(welcome)
    const wrapper = await open('messages/welcome/content')
    await body(wrapper)
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    vi.mocked(api.post).mockImplementation(((path: string) => path === '/api/v1/mail/library/preview'
      ? refuse(400, { error: 'unexpected end of template', kind: 'INVALID', details: { code: 'template_render_failed', face: 'html', resource: { kind: 'message', name: 'welcome' } } })
      : refuse(404, {})) as never)
    await (await body(wrapper)).setValue('{{ block body() }}')
    vi.advanceTimersByTime(500)
    await flushPromises()
    const note = wrapper.find('.mail-source-column .mail-problem')
    expect(note.find('.mail-problem-lead').text()).toBe('The HTML of this message does not render.')
    expect(note.find('.mail-problem-detail').text()).toBe('unexpected end of template')
    expect(wrapper.find('.mail-preview-problem').text()).toContain('The preview shows the last version that rendered.')
    expect(control(wrapper, 'Review changes')!.attributes('disabled')).toBeDefined()
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('warns when Gmail may clip the email, beside a preview that still shows', async () => {
    routes(notice, [post('/api/v1/mail/library/preview', () => ok({ subject: 'Hi', html: '<p>long</p>', text: 'x',
      warnings: [{ code: 'gmail_html_clipping', message: 'Gmail may clip this email.', bytes: 130_000, threshold_bytes: 104_448 }] }))])
    const wrapper = await open('messages/notice/content')
    expect(wrapper.find('.mail-preview-warning').text()).toBe('Gmail may clip this email: its HTML is 127 KB, above Gmail’s 102 KB. Readers then see only the start until they open the rest.')
    expect(wrapper.find('iframe.mail-preview-frame').exists()).toBe(true)
    wrapper.unmount()
  })

  it('blocks saving an email larger than Mail can send, saying the limit', async () => {
    routes(welcome)
    const wrapper = await open('messages/welcome/content')
    await body(wrapper)
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    vi.mocked(api.post).mockImplementation(((path: string) => path === '/api/v1/mail/library/preview'
      ? refuse(400, { error: 'HTML body exceeds the byte limit', kind: 'INVALID', details: { code: 'html_too_large', face: 'html', resource: { kind: 'message', name: 'welcome' }, limit: 'max_html_bytes', maximum: 262144 } })
      : refuse(404, {})) as never)
    await (await body(wrapper)).setValue('{{ block body() }}' + 'x'.repeat(10) + '{{ end }}')
    vi.advanceTimersByTime(500)
    await flushPromises()
    const note = wrapper.find('.mail-source-column .mail-problem')
    expect(note.find('.mail-problem-lead').text()).toBe('The HTML of this message is larger than Mail can send. Keep each rendered face under 256 KB.')
    expect(note.find('.mail-problem-detail').exists()).toBe(false)
    expect(control(wrapper, 'Review changes')!.attributes('disabled')).toBeDefined()
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('refuses a subject with a line break in place and blocks the review', async () => {
    routes(welcome)
    const wrapper = await open('messages/welcome/content')
    await body(wrapper)
    const subject = wrapper.find('textarea[aria-label="Subject"]')
    await subject.setValue('Hello\nthere')
    await flushPromises()
    expect(wrapper.text()).toContain('A subject is one line. Remove the line break.')
    expect(control(wrapper, 'Review changes')!.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Put the subject on one line first.')
    wrapper.unmount()
  })

  it('names the messages a save would break', async () => {
    const failure = (name: string) => ({ code: 'template_render_failed', face: 'html', message: 'there is no field or method badge', resource: { kind: 'message', name } })
    const save = vi.fn(() => refuse(400, { error: 'template render failed', kind: 'INVALID', details: {
      code: 'template_render_failed', face: 'html', resource: { kind: 'message', name: 'notice' },
      dependent_messages: ['notice', 'welcome'], errors: [failure('notice'), failure('welcome')] } }))
    routes(button, [put('/api/v1/mail/library/part/button', save)])
    const wrapper = await open('parts/button/content')
    await (await body(wrapper)).setValue('<a>{{ .badge.label }}</a>')
    await control(wrapper, 'Review changes')!.trigger('click')
    await wrapper.find('#mail-review').trigger('submit')
    await flushPromises()
    expect(document.body.textContent).toContain('2 messages would break.')
    expect(document.body.textContent).toContain('there is no field or method badge')
    expect(document.body.textContent).toContain('Customer welcome')
    const saveButton = [...document.body.querySelectorAll<HTMLButtonElement>('.mail-dialog button')].find(node => node.textContent?.trim() === 'Save')!
    expect(saveButton.disabled).toBe(true)
    expect(save).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('holds Send test while delivery is not set up and says why in the page', async () => {
    serve([
      get('/api/v1/mail/library', () => ok({ items: library })),
      get('/api/v1/mail/delivery', () => ok({ configured: false, reason: 'Choose a delivery service for Mail.' })),
      get('/api/v1/mail/library/message/notice', () => ok(notice)),
      get('/api/v1/mail/library/message/notice/history', () => ok({ items: [] })),
      post('/api/v1/mail/library/preview', () => ok({ subject: 'Hello', html: '<p>x</p>', text: 'x' })),
    ])
    const wrapper = await open('messages/notice/content')
    await flushPromises()
    expect(control(wrapper, 'Send test to me')!.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Mail delivery is not set up yet, so a test cannot be sent.')
    expect(control(wrapper, 'Open delivery settings')).toBeDefined()
    wrapper.unmount()
  })

  it('keeps the draft and blocks saving when someone else saves the resource meanwhile', async () => {
    let current: Resource = welcome
    serve([
      get('/api/v1/mail/library', () => ok({ items: [...library] })),
      get('/api/v1/mail/library/message/welcome', () => ok(current)),
      get('/api/v1/mail/library/message/welcome/history', () => ok({ items: [] })),
      post('/api/v1/mail/library/preview', () => ok({ subject: 'Hi', html: '<p>x</p>', text: 'x' })),
    ])
    const wrapper = await open('messages/welcome/content')
    await (await body(wrapper)).setValue('mine')
    current = { ...welcome, revision: 9, html: 'theirs', author_label: { kind: 'user', id: 'user-2', label: 'Marco Ruiz' } }
    notify('mail.library.changed', { data: { kind: 'message', name: 'welcome', revision: 9 } })
    await flushPromises()
    expect(wrapper.text()).toContain('Marco Ruiz saved Customer welcome while you were editing.')
    expect(control(wrapper, 'Review changes')!.attributes('disabled')).toBeDefined()
    await control(wrapper, 'Discard and load')!.trigger('click')
    await flushPromises()
    expect(wrapper.text()).not.toContain('Unsaved changes')
    expect(((await body(wrapper)).element as HTMLTextAreaElement).value).toBe('theirs')
    wrapper.unmount()
  })

  it('asks before leaving a draft through the rail', async () => {
    routes(welcome)
    const wrapper = await open('messages/welcome/content')
    await (await body(wrapper)).setValue('changed')
    vi.mocked(host.confirm).mockResolvedValueOnce(false)
    await wrapper.findAll('.kx-settings-rail-item').find(item => item.text() === 'All messages')!.trigger('click')
    await flushPromises()
    expect(host.confirm).toHaveBeenCalledWith(expect.objectContaining({ header: 'Discard unsaved changes?' }))
    expect(wrapper.emitted('navigate')).toBeUndefined()
    expect(wrapper.emitted('dirty-change')?.at(-1)).toEqual([true])
    wrapper.unmount()
  })

  it('resets a customized resource after confirmation', async () => {
    const reset = vi.fn(() => ok({ ...standard, state: 'original', revision: 8 }))
    routes({ ...standard, used_by: { messages: [] } }, [post('/api/v1/mail/library/base/standard/reset', reset)])
    const wrapper = await open('bases/standard/content')
    expect(wrapper.find('.mail-customized').text()).toContain('Customized by Dana Lee on')
    vi.mocked(host.confirm).mockResolvedValueOnce(true)
    await control(wrapper, 'Reset to original')!.trigger('click')
    await flushPromises()
    expect(reset).toHaveBeenCalledWith('/api/v1/mail/library/base/standard/reset', { expected_revision: 7 })
    wrapper.unmount()
  })

  it('lists History and restores a version through the draft, review and save', async () => {
    const save = vi.fn((_path: string, sent?: unknown) => ok({ ...newsletter, ...(sent as object), revision: 6 }))
    const restore = vi.fn(() => ok({ ...newsletter, revision: 6 }))
    const older = revision({ ...newsletter, html: '<p>The older frame</p>' }, 4, { version: 4, note: 'Brand refresh' })
    routes({ ...newsletter, used_by: { messages: [] } }, [put('/api/v1/mail/library/base/newsletter', save), post('/api/v1/mail/library/base/newsletter/restore', restore),
      get('/api/v1/mail/library/base/newsletter/history', () => ok({ items: [revision(newsletter, 5), older] }))])
    const wrapper = await open('bases/newsletter/history')
    const rows = wrapper.findAll('.mail-history-row')
    expect(rows[0].text()).toContain('Version 5 · Edited')
    expect(rows[0].text()).toContain('Current')
    expect(rows[1].text()).toContain('Brand refresh')
    await rows[1].findAll('button').find(node => node.text() === 'Restore')!.trigger('click')
    await flushPromises()
    // Nothing is saved yet: the version is the draft, on the content section.
    expect(host.confirm).not.toHaveBeenCalled()
    expect(restore).not.toHaveBeenCalled()
    expect(save).not.toHaveBeenCalled()
    expect(wrapper.emitted('navigate')?.at(-1)).toEqual(['bases/newsletter/content'])
    expect(wrapper.text()).toContain('Version 4 is loaded as your draft. Review and save to restore it.')
    await control(wrapper, 'Review changes')!.trigger('click')
    await flushPromises()
    const note = document.body.querySelector<HTMLInputElement>('.mail-dialog input')!
    expect(note.value).toBe('Restore version 4')
    ;[...document.body.querySelectorAll('button')].find(node => node.textContent?.trim() === 'Save')!.click()
    await flushPromises()
    expect(save).toHaveBeenCalledWith('/api/v1/mail/library/base/newsletter', expect.objectContaining({ expected_revision: 5, note: 'Restore version 4', html: '<p>The older frame</p>' }))
    wrapper.unmount()
  })

  it('asks before Restore replaces an unsaved draft, and keeps the draft when told to', async () => {
    routes(welcome)
    const wrapper = await open('messages/welcome/content')
    await (await body(wrapper)).setValue('my unsaved text')
    await wrapper.setProps({ route: 'messages/welcome/history' })
    await flushPromises()
    vi.mocked(host.confirm).mockResolvedValueOnce(false)
    await wrapper.findAll('.mail-history-row')[1].findAll('button').find(node => node.text() === 'Restore')!.trigger('click')
    await flushPromises()
    expect(host.confirm).toHaveBeenCalledWith(expect.objectContaining({ header: 'Replace your unsaved changes with version 2?' }))
    await wrapper.setProps({ route: 'messages/welcome/content' })
    await flushPromises()
    expect(((await body(wrapper)).element as HTMLTextAreaElement).value).toBe('my unsaved text')
    wrapper.unmount()
  })

  it('refuses to delete a base template that messages use, without calling the server', async () => {
    routes({ ...newsletter, used_by: { messages: ['welcome'] } })
    const wrapper = await open('bases/newsletter/content')
    await control(wrapper, 'Delete')!.trigger('click')
    await flushPromises()
    expect(api.delete).not.toHaveBeenCalled()
    expect(document.body.textContent).toContain('1 message uses it: Customer welcome. Remove it from that message first.')
    wrapper.unmount()
  })

  it('deletes an unused resource and returns to its kind', async () => {
    routes({ ...newsletter, used_by: { messages: [] } }, [remove('/api/v1/mail/library/base/newsletter', () => ok(true))])
    const wrapper = await open('bases/newsletter/content')
    vi.mocked(host.confirm).mockResolvedValueOnce(true)
    await control(wrapper, 'Delete')!.trigger('click')
    await flushPromises()
    expect(wrapper.emitted('navigate')?.at(-1)).toEqual(['bases'])
    wrapper.unmount()
  })

  it('edits part inputs into the draft schema and samples', async () => {
    routes(button)
    const wrapper = await open('parts/button/variables')
    expect(wrapper.find('h1').text()).toBe('Inputs')
    const first = wrapper.findAll('.mail-variable-card')[0]
    expect((first.find('input').element as HTMLInputElement).value).toBe('action_url')
    await control(wrapper, 'Add input')!.trigger('click')
    const added = wrapper.findAll('.mail-variable-card').at(-1)!
    await added.find('input').setValue('badge')
    await added.find('input[aria-label="Sample value of badge"]').setValue('New')
    await flushPromises()
    expect(wrapper.text()).toContain('Unsaved changes')
    await added.find('input').setValue('bad name')
    await flushPromises()
    expect(wrapper.text()).toContain('Use letters, digits and underscores')
    expect(control(wrapper, 'Review changes')!.attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('shows the gone state when the resource is deleted elsewhere', async () => {
    let gone = false
    serve([
      get('/api/v1/mail/library', () => ok({ items: [...library] })),
      get('/api/v1/mail/library/message/welcome', () => gone
        ? refuse(404, { error: 'Mail library resource was not found', kind: 'NOT_FOUND', details: { code: 'mail_resource_not_found' } })
        : ok(welcome)),
      get('/api/v1/mail/library/message/welcome/history', () => ok({ items: [] })),
      post('/api/v1/mail/library/preview', () => ok({ subject: 'Hi', html: '<p>x</p>', text: 'x' })),
    ])
    const wrapper = await open('messages/welcome/content')
    gone = true
    notify('mail.library.changed', { data: { kind: 'message', name: 'welcome', revision: 3 } })
    await flushPromises()
    expect(wrapper.text()).toContain('This resource no longer exists')
    wrapper.unmount()
  })
})
