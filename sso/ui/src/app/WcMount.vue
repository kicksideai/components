<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { loadByTagName } from '@wippy-fe/proxy'

// Mounts a provider's own admin-card web component by tag. The card's bundle is
// resolved + registered through loadByTagName (the views API maps a registered
// view.component tag to its module URL), then instantiated; the element receives
// its config slice as a `config` attribute and reports edits back through the
// `config-changed` event. Mirrors the canonical peer-mount pattern (mcp traits,
// the knowledge create dialog).
const props = defineProps<{ tag: string, config?: any }>()
const emit = defineEmits<{ (e: 'change', value: any): void }>()

const host = ref<HTMLElement | null>(null)
const failed = ref(false)
let el: HTMLElement | null = null

function onConfigChanged(e: Event) { emit('change', (e as CustomEvent).detail) }

async function ensureRegistered(tag: string) {
  if (customElements.get(tag)) return
  try { await loadByTagName(tag, { timeoutMs: 8000 }) } catch { /* createElement yields an inert element if undefined */ }
}

async function mount() {
  failed.value = false
  if (!host.value) return
  if (el) { el.removeEventListener('config-changed', onConfigChanged); el = null }
  host.value.innerHTML = ''
  if (!props.tag) { failed.value = true; return }
  try {
    await ensureRegistered(props.tag)
    el = document.createElement(props.tag)
    try { el.setAttribute('config', JSON.stringify(props.config || {})) } catch { /* non-serializable */ }
    el.addEventListener('config-changed', onConfigChanged)
    el.style.display = 'block'
    host.value.appendChild(el)
    failed.value = !customElements.get(props.tag)
  } catch {
    failed.value = true
  }
}

// Re-mount when the tag changes; a config change after mount is owned by the card
// itself (it manages its own drafts), so we do not re-push config on every edit.
onMounted(mount)
watch(() => props.tag, mount)
onBeforeUnmount(() => { if (el) el.removeEventListener('config-changed', onConfigChanged) })
</script>

<template>
  <div class="ks-wcmount">
    <div v-if="failed" class="ks-wcmount-fail">Provider card “{{ tag }}” is not available.</div>
    <div v-else ref="host"></div>
  </div>
</template>
