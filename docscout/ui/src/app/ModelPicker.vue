<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { loadByTagName } from '@wippy-fe/proxy'
defineProps<{ value: string; capability: 'embed' | 'generate'; labelledBy: string }>()
const emit = defineEmits<{ select: [value: string] }>()
const ready = ref(!!customElements.get('wc-model-picker'))
const error = ref('')
onMounted(async () => {
 if (ready.value) return
 try { await loadByTagName('wc-model-picker', { timeoutMs: 8000 }); ready.value = true }
 catch (err) { error.value = err instanceof Error ? err.message : String(err) }
})
function select(event: Event) {
 const value: unknown = (event as CustomEvent).detail
 if (typeof value === 'string') emit('select', value)
}
</script>
<template>
 <wc-model-picker v-if="ready" :value="value" :capability="capability" :aria-labelledby="labelledBy" @select="select" />
 <p v-else-if="error" class="dz-error" role="alert">Could not load model picker: {{ error }}</p>
 <span v-else class="dz-muted" role="status">Loading models…</span>
</template>
