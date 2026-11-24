// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { loadByTagName } from '@wippy-fe/proxy'
import { ref } from 'vue'

const loaded = new Map<string, Promise<boolean>>()

export function ensureTag(tag: string): Promise<boolean> {
  let pending = loaded.get(tag)
  if (!pending) {
    pending = Promise.resolve(loadByTagName(tag)).then(() => true, () => { loaded.delete(tag); return false })
    loaded.set(tag, pending)
  }
  return pending
}

// Loads a shared web component on demand and reports its loading state.
export function useTag(tag: string) {
  const state = ref<'idle' | 'pending' | 'ready' | 'failed'>('idle')
  async function load() {
    if (state.value === 'pending' || state.value === 'ready') return
    state.value = 'pending'
    state.value = await ensureTag(tag) ? 'ready' : 'failed'
  }
  return { state, load }
}
