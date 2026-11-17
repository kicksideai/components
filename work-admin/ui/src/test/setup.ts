// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import { ref } from 'vue'
export const hostProps = ref<Record<string, unknown>>({})
export const hostEmit = vi.fn()
export const subscriptions = new Map<string, Set<() => void>>()
export const visibility = new Set<() => Promise<void>>()
export function notify(topic: string) { for (const fn of subscriptions.get(topic) ?? []) fn() }
vi.mock('@wippy-fe/proxy', () => ({
  api: { get: vi.fn(), post: vi.fn() },
  host: { navigate: vi.fn(), confirm: vi.fn().mockResolvedValue(false) },
  loadByTagName: vi.fn().mockResolvedValue(undefined),
  on: vi.fn((topic: string, fn: () => void) => {
    const listeners = subscriptions.get(topic) ?? new Set<() => void>(); listeners.add(fn); subscriptions.set(topic, listeners)
    return () => { listeners.delete(fn); if (!listeners.size) subscriptions.delete(topic) }
  }),
}))
vi.mock('@wippy-fe/webcomponent-vue', async () => {
  const { onMounted, onUnmounted } = await import('vue')
  return {
    useProps: () => hostProps,
    useEvents: () => hostEmit,
    useHostVisibilityRefresh: (task: () => Promise<void>) => {
      visibility.add(task); onMounted(task); onUnmounted(() => visibility.delete(task))
    },
  }
})
config.global.plugins = [PrimeVuePlugin]
config.global.stubs = { teleport: true }
if (typeof HTMLDialogElement !== 'undefined') {
  if (!HTMLDialogElement.prototype.showModal) HTMLDialogElement.prototype.showModal = function () { this.open = true }
  if (!HTMLDialogElement.prototype.close) HTMLDialogElement.prototype.close = function () { this.open = false }
}

vi.mock('@iconify/vue', () => ({ Icon: { template: '<svg aria-hidden="true"></svg>' } }))
