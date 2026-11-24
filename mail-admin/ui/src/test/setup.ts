// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { PrimeVuePlugin } from '@wippy-fe/theme/primevue-plugin'
import { ref } from 'vue'
export const hostProps = ref<Record<string, unknown>>({})
export const hostEmit = vi.fn()
export const subscriptions = new Map<string, Set<(message?: unknown) => void>>()
export const visibility = new Set<() => Promise<void>>()
export function notify(topic: string, message?: unknown) { for (const fn of subscriptions.get(topic) ?? []) fn(message) }
vi.mock('@wippy-fe/proxy', () => ({
  api: { get: vi.fn(), post: vi.fn(), delete: vi.fn(), put: vi.fn() },
  host: { navigate: vi.fn(), confirm: vi.fn().mockResolvedValue(false) },
  loadByTagName: vi.fn().mockResolvedValue(undefined),
  on: vi.fn((topic: string, fn: (message?: unknown) => void) => {
    const listeners = subscriptions.get(topic) ?? new Set<(message?: unknown) => void>(); listeners.add(fn); subscriptions.set(topic, listeners)
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

vi.mock('@iconify/vue', () => ({ Icon: { template: '<svg aria-hidden="true"></svg>' } }))

// The code editor runs in the browser; unit tests edit its text through a plain field.
vi.mock('../editor/CodeEditor.vue', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    __esModule: true,
    default: defineComponent({
      props: { modelValue: { type: String, default: '' }, label: { type: String, default: '' }, readOnly: Boolean },
      emits: ['update:modelValue'],
      setup(props, { emit, expose }) {
        expose({ insert: (text: string) => emit('update:modelValue', props.modelValue + text), focus: () => {} })
        return () => h('textarea', { class: 'code-editor-stub', 'aria-label': props.label, value: props.modelValue, readonly: props.readOnly,
          onInput: (event: Event) => emit('update:modelValue', (event.target as HTMLTextAreaElement).value) })
      },
    }),
  }
})
