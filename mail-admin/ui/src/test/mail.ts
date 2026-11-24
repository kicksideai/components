// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mount } from '@vue/test-utils'
import { defineComponent, h, provide, reactive, ref, type Component } from 'vue'
import { vi } from 'vitest'
import { mailContextKey, type MailContext } from '../context'
import { useLibrary } from '../library/useLibrary'

// Mounts one Mail component inside the context the Mail tab provides, with a real library catalog.
export function mountWithMail(component: Component, initial: Record<string, unknown> = {}, overrides: Partial<MailContext> = {}) {
  const props = reactive({ ...initial })
  const context = {} as MailContext
  const Host = defineComponent({
    setup() {
      Object.assign(context, {
        library: useLibrary(),
        capabilities: ref({ send: true, edit_library: true, administer_delivery: true }),
        delivery: ref({ configured: true }),
        go: vi.fn(), create: vi.fn(), upload: vi.fn(), setDirty: vi.fn(), setTitle: vi.fn(),
        ...overrides,
      })
      provide(mailContextKey, context)
      return () => h(component, props)
    },
  })
  const wrapper = mount(Host, { attachTo: document.body })
  return { wrapper, props, context }
}

export const dialogButton = (label: string) =>
  [...document.body.querySelectorAll<HTMLButtonElement>('button')].find(node => node.textContent?.trim() === label || node.getAttribute('aria-label') === label)
