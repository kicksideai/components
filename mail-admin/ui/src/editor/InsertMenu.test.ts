// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import InsertMenu from './InsertMenu.vue'
import { calls, get, ok, resource, row, serve } from '../test/fixtures'
import { dialogButton, mountWithMail } from '../test/mail'
import type { ResourceContent } from '../types'

const button = resource('part', 'button', { title: 'Button',
  schema: { type: 'object', properties: { action_url: { type: 'string' }, action_label: { type: 'string', default: 'Open' }, wide: { type: 'boolean' } } },
  samples: { action_url: 'https://example.org' } })
const logo = resource('asset', 'mail-logo', { title: 'Mail logo', asset: { source: 'upload' } })
const draft: ResourceContent = { ...resource('message', 'welcome', { title: 'Welcome',
  schema: { type: 'object', properties: { first_name: { type: 'string', description: 'Who it greets' }, site: { type: 'string' } } } }) }

function routes() {
  serve([
    get('/api/v1/mail/library', (_path, options) => {
      const kind = (options as { params: Record<string, string> }).params.kind
      return ok({ items: kind === 'part' ? [row(button)] : kind === 'asset' ? [row(logo)] : [] })
    }),
    get('/api/v1/mail/library/part/button', () => ok(button)),
    get('/api/v1/mail/library/asset/mail-logo', () => ok(logo)),
  ])
}

async function openMenu(face: 'html' | 'text' = 'html') {
  routes()
  const mounted = mountWithMail(InsertMenu, { draft, face })
  await flushPromises()
  const anchor = document.createElement('button')
  document.body.appendChild(anchor)
  ;(mounted.wrapper.findComponent(InsertMenu).vm as unknown as { toggle: (event: Event) => void }).toggle({ currentTarget: anchor, target: anchor } as unknown as Event)
  await flushPromises()
  return mounted
}
const item = (label: string) => [...document.body.querySelectorAll<HTMLElement>('.p-menu-item')].find(node => node.textContent?.trim() === label)
const choose = async (label: string) => {
  item(label)!.querySelector<HTMLElement>('.p-menu-item-link, a')!.click()
  await flushPromises()
}
const inserted = (wrapper: ReturnType<typeof mountWithMail>['wrapper']) => wrapper.findComponent(InsertMenu).emitted('insert')

describe('Insert', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('inserts a variable by its name', async () => {
    const { wrapper } = await openMenu()
    await choose('first_name')
    expect(inserted(wrapper)).toEqual([['{{ first_name }}']])
    wrapper.unmount()
  })

  it('inserts a variable that shares a global name through vars, and a workspace value by its global name', async () => {
    const { wrapper } = await openMenu()
    await choose('site')
    expect(inserted(wrapper)?.at(-1)).toEqual(['{{ vars.site }}'])
    wrapper.unmount()
    document.body.innerHTML = ''
    const again = await openMenu()
    await choose('Workspace name')
    expect(inserted(again.wrapper)?.at(-1)).toEqual(['{{ site.title }}'])
    again.wrapper.unmount()
  })

  it('inserts an include of a part with each input filled from its sample or default', async () => {
    const { wrapper } = await openMenu()
    await choose('Button')
    expect(inserted(wrapper)).toEqual([['{{ include "/part/button" map("action_url", "https://example.org", "action_label", "Open") }}']])
    wrapper.unmount()
  })

  it('inserts an image with the alternative text the person gives', async () => {
    const { wrapper } = await openMenu()
    await choose('Mail logo')
    const alt = document.body.querySelector<HTMLInputElement>('#mail-insert-image input')!
    expect(alt.value).toBe('Mail logo')
    alt.value = 'Acme "logo"'
    alt.dispatchEvent(new Event('input'))
    await flushPromises()
    dialogButton('Insert image')!.click()
    await flushPromises()
    expect(inserted(wrapper)).toEqual([
      ['<img src="{{ assets["mail-logo"] }}" alt="Acme &quot;logo&quot;" style="display:block;border:0;max-width:100%;height:auto;">'],
    ])
    wrapper.unmount()
  })

  it('offers no image in plain text and reads parts only once it opens', async () => {
    routes()
    const { wrapper } = mountWithMail(InsertMenu, { draft, face: 'text' })
    await flushPromises()
    expect(calls('get')).toHaveLength(0)
    wrapper.unmount()
    const opened = await openMenu('text')
    expect(item('Mail logo')).toBeUndefined()
    expect(calls('get').map(([, options]) => (options as { params?: Record<string, string> })?.params?.kind)).toEqual(['part'])
    opened.wrapper.unmount()
  })
})
