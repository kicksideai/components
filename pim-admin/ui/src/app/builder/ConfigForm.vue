<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { onMounted, ref } from 'vue'
import { ensureTag } from '../mount'

const props = defineProps<{ schema: Record<string, unknown>; modelValue: Record<string, unknown>; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: Record<string, unknown>] }>()
const state = ref<'pending' | 'failed' | 'ready'>('pending')
async function load() {
  state.value = 'pending'
  state.value = await ensureTag('wc-schema-form') ? 'ready' : 'failed'
}
onMounted(load)
function change(event: Event) {
  const value: unknown = (event as CustomEvent).detail
  if (value && typeof value === 'object' && !Array.isArray(value)) emit('update:modelValue', value as Record<string, unknown>)
}
</script>

<template>
  <div :inert="disabled || undefined">
    <wc-schema-form v-if="state === 'ready'" :schema="JSON.stringify(props.schema)" :config="JSON.stringify(modelValue)" @config-changed="change" />
    <span v-else-if="state === 'pending'" class="muted small" role="status">Configuration form is loading.</span>
    <Message v-else role="alert" severity="error">Configuration form could not be loaded. <Button type="button" :disabled="disabled" @click="load" severity="secondary" outlined size="small">Retry</Button></Message>
    <Button type="button" :disabled="disabled" @click="emit('update:modelValue', {})" severity="secondary" outlined size="small"><Icon icon="tabler:restore" aria-hidden="true" /> Reset overrides</Button>
  </div>
</template>
