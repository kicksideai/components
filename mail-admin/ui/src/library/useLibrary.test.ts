// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { calls, get, ok, refuse, resource, row, serve } from '../test/fixtures'
import { useLibrary } from './useLibrary'

const notice = row(resource('message', 'notice', { title: 'Notice' }))
const welcome = row(resource('message', 'welcome', { title: 'Customer welcome' }))

function withLibrary(render: (library: ReturnType<typeof useLibrary>) => string) {
  let library!: ReturnType<typeof useLibrary>
  const wrapper = mount(defineComponent({ setup() { library = useLibrary(); return () => h('p', render(library)) } }))
  return { wrapper, library: () => library }
}

describe('Library references', () => {
  it('looks up every reference shown together in one request by exact names', async () => {
    serve([get('/api/v1/mail/library', () => ok({ items: [notice, welcome], total: 2 }))])
    const { wrapper } = withLibrary(library => ['notice', 'welcome', 'gone'].map(name => library.title('message', name) ?? '…').join(', '))
    expect(wrapper.text()).toBe('…, …, …')
    await flushPromises()
    expect(wrapper.text()).toBe('Notice, Customer welcome, gone')
    expect(calls('get')).toEqual([['/api/v1/mail/library', { params: { kind: 'message', names: 'notice,welcome,gone', limit: '100' } }]])
    wrapper.unmount()
  })

  it('reads one page for a search and never follows the cursor on its own', async () => {
    serve([get('/api/v1/mail/library', () => ok({ items: [notice], total: 80, next_cursor: 'message/notice' }))])
    const { wrapper, library } = withLibrary(() => '')
    const page = await library().search('message', 'no')
    expect(page.next_cursor).toBe('message/notice')
    expect(calls('get')).toEqual([['/api/v1/mail/library', { params: { kind: 'message', q: 'no', limit: '50' } }]])
    wrapper.unmount()
  })

  it('leaves a failed reference unresolved until a successful refresh', async () => {
    let ready = false
    serve([get('/api/v1/mail/library', () => ready
      ? ok({ items: [notice], total: 1 })
      : refuse(503, { error: 'Library temporarily unavailable' }))])
    const { wrapper, library } = withLibrary(state => state.title('message', 'notice') ?? '…')
    await flushPromises()
    expect(wrapper.text()).toBe('…')
    expect(library().exists('message', 'notice')).toBeUndefined()
    expect(library().lookupError.value).toContain('Library references could not be loaded.')
    ready = true
    library().refresh()
    await flushPromises()
    expect(wrapper.text()).toBe('Notice')
    expect(library().lookupError.value).toBe('')
    wrapper.unmount()
  })

  it('does not cache search results from before a library refresh', async () => {
    let finish!: (value: Awaited<ReturnType<typeof ok>>) => void
    const pending = new Promise<Awaited<ReturnType<typeof ok>>>(resolve => { finish = resolve })
    serve([get('/api/v1/mail/library', () => pending)])
    const { wrapper, library } = withLibrary(() => '')
    const search = library().search('message', 'notice')
    library().refresh()
    finish(await ok({ items: [notice] }))
    await search
    serve([get('/api/v1/mail/library', () => ok({ items: [] }))])
    expect(library().exists('message', 'notice')).toBeUndefined()
    await flushPromises()
    expect(library().exists('message', 'notice')).toBe(false)
    wrapper.unmount()
  })
})
