// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { vi } from 'vitest'
import { ref } from 'vue'

export const hostProps = ref<Record<string, unknown>>({})
export const events = new Map<string, (message?: unknown) => void>()
export const hostEmit = vi.fn()
export const visibility = { task: undefined as undefined | (() => Promise<void>) }
vi.mock('@wippy-fe/proxy', () => ({
  on: vi.fn((topic: string, fn: (message?: unknown) => void) => { events.set(topic, fn); return () => events.delete(topic) }),
  api: { get: vi.fn(), post: vi.fn() },
  host: { confirm: vi.fn().mockResolvedValue(true) },
  loadByTagName: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@wippy-fe/webcomponent-vue', async () => {
  const { onMounted } = await import('vue')
  return {
    useProps: vi.fn(() => hostProps),
    useEvents: () => hostEmit,
    useHostVisibilityRefresh: (task: () => Promise<void>) => { visibility.task = task; onMounted(task) },
  }
})
vi.mock('@iconify/vue', () => ({ Icon: { template: '<span />' } }))
