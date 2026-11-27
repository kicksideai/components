// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises } from '@vue/test-utils'
import FileUpload from 'primevue/fileupload'
import { afterEach, describe, expect, it, vi } from 'vitest'
import UploadAsset from './UploadAsset.vue'
import { notify, subscriptions } from '../test/setup'
import { calls, get, ok, post, refuse, resource, serve } from '../test/fixtures'
import { dialogButton, mountWithMail } from '../test/mail'

const png = (size: number) => new File([new Uint8Array(size)], 'brand-mark.png', { type: 'image/png' })

async function choose(wrapper: ReturnType<typeof mountWithMail>['wrapper'], file: File, title?: string) {
  wrapper.findComponent(FileUpload).vm.$emit('select', { files: [file] })
  await flushPromises()
  if (title) {
    const input = document.body.querySelectorAll<HTMLInputElement>('.mail-dialog input.p-inputtext')[0]
    input.value = title
    input.dispatchEvent(new Event('input'))
    await flushPromises()
  }
}

describe('Upload image', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('refuses an image larger than 1 MB before uploading anything', async () => {
    serve([])
    const { wrapper, props } = mountWithMail(UploadAsset, { visible: false })
    props.visible = true
    await flushPromises()
    await choose(wrapper, png(1024 * 1024 + 1))
    expect(document.body.textContent).toContain('Images must be 1 MB or smaller.')
    expect(dialogButton('Upload image')!.disabled).toBe(true)
    await choose(wrapper, png(1024 * 1024))
    expect(document.body.textContent).not.toContain('Images must be 1 MB or smaller.')
    expect(calls('post')).toHaveLength(0)
    wrapper.unmount()
  })

  it('shows processing until the platform completes the upload, then adds that upload to the library', async () => {
    let status = 'processing'
    // Mail answers that the upload is still processing until the platform completes it.
    const added = vi.fn(() => status === 'completed' ? ok(resource('asset', 'brand-mark', { title: 'Brand mark', state: 'created', revision: 1 }))
      : refuse(409, { error: 'Upload is still processing', kind: 'CONFLICT', details: { code: 'upload_still_processing', status: 'processing', upload_id: 'up-7' } }))
    serve([
      get('/api/v1/mail/library', () => ok({ items: [] })),
      get('/api/v1/uploads/up-7', () => Promise.resolve({ data: { success: true, component_id: 'uploads-1', upload: { uuid: 'up-7', status } } })),
      post('/api/v1/mail/library', added),
    ])
    vi.mocked((await import('@wippy-fe/proxy')).api.post).mockImplementation(((path: string) => path === '/api/v1/uploads'
      ? Promise.resolve({ data: { success: true, uuid: 'up-7' } }) : path === '/api/v1/mail/library' ? added() : Promise.reject(new Error(path))) as never)
    const { wrapper, props, context } = mountWithMail(UploadAsset, { visible: false })
    props.visible = true
    await flushPromises()
    await choose(wrapper, png(2048), 'Brand mark')
    document.body.querySelector<HTMLFormElement>('#mail-upload')!.dispatchEvent(new Event('submit'))
    await flushPromises()
    expect(document.body.textContent).toContain('Processing the image…')
    expect(added).toHaveBeenCalledTimes(1)

    notify('component.uploads-1', { event: 'component.meta.changed', component_id: 'uploads-1', meta: { queued_count: '1' } })
    await flushPromises()
    expect(added).toHaveBeenCalledTimes(1)

    status = 'completed'
    notify('component.uploads-1', { event: 'component.meta.changed', component_id: 'uploads-1', meta: { queued_count: '0' } })
    await flushPromises()
    expect(added).toHaveBeenCalledTimes(2)
    expect(document.body.textContent).not.toContain('still being processed')
    expect(vi.mocked((await import('@wippy-fe/proxy')).api.post).mock.calls.filter(([path]: unknown[]) => path === '/api/v1/mail/library').at(-1)?.[1]).toMatchObject({ kind: 'asset', name: 'brand-mark', upload_id: 'up-7', title: 'Brand mark' })
    expect(context.go).toHaveBeenCalledWith({ name: 'library', section: 'assets', asset: 'brand-mark' })
    wrapper.unmount()
  })

  it('stops waiting for the platform as soon as the dialog closes during processing', async () => {
    serve([
      get('/api/v1/uploads/up-9', () => Promise.resolve({ data: { success: true, component_id: 'uploads-9', upload: { uuid: 'up-9', status: 'processing' } } })),
    ])
    vi.mocked((await import('@wippy-fe/proxy')).api.post).mockImplementation(((path: string) => path === '/api/v1/uploads'
      ? Promise.resolve({ data: { success: true, uuid: 'up-9' } })
      : refuse(409, { error: 'Upload is still processing', kind: 'CONFLICT', details: { code: 'upload_still_processing', status: 'processing', upload_id: 'up-9' } })) as never)
    const { wrapper, props } = mountWithMail(UploadAsset, { visible: false })
    props.visible = true
    await flushPromises()
    await choose(wrapper, png(2048), 'Brand mark')
    document.body.querySelector<HTMLFormElement>('#mail-upload')!.dispatchEvent(new Event('submit'))
    await flushPromises()
    expect(subscriptions.has('component.uploads-9')).toBe(true)
    props.visible = false
    await flushPromises()
    expect(subscriptions.has('component.uploads-9')).toBe(false)
    wrapper.unmount()
  })

  it('says the image could not be processed when the platform fails the upload, and adds nothing', async () => {
    serve([
      get('/api/v1/mail/library', () => ok({ items: [] })),
      get('/api/v1/uploads/up-8', () => Promise.resolve({ data: { success: true, component_id: 'uploads-1', upload: { uuid: 'up-8', status: 'error', error: 'corrupt' } } })),
    ])
    vi.mocked((await import('@wippy-fe/proxy')).api.post).mockImplementation(((path: string) => path === '/api/v1/uploads'
      ? Promise.resolve({ data: { success: true, uuid: 'up-8' } })
      : refuse(409, { error: 'Upload is still processing', kind: 'CONFLICT', details: { code: 'upload_still_processing', status: 'processing', upload_id: 'up-8' } })) as never)
    const { wrapper, props } = mountWithMail(UploadAsset, { visible: false })
    props.visible = true
    await flushPromises()
    await choose(wrapper, png(2048), 'Brand mark')
    document.body.querySelector<HTMLFormElement>('#mail-upload')!.dispatchEvent(new Event('submit'))
    await flushPromises()
    expect(document.body.textContent).toContain('The image could not be processed. Try another file, or upload it again.')
    expect(calls('post').filter(([path]) => path === '/api/v1/mail/library')).toHaveLength(1)
    wrapper.unmount()
  })
})
