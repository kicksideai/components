<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { computed, ref, watch } from 'vue'
import { ensureTag } from '../mount'
import { display, humanize } from '../../forms'
import type { PluginIssue } from '../../types'

const props = defineProps<{ schema: Record<string, unknown>; modelValue: Record<string, unknown>; disabled?: boolean; problem?: PluginIssue; problemLabel?: string; pluginId?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: Record<string, unknown>] }>()
const state = ref<'pending' | 'failed' | 'ready'>('pending')
const overrides = computed(() => {
  const fields = props.schema.properties as Record<string, { title?: string }> | undefined
  return Object.entries(props.modelValue).map(([key, value]) => ({
    key, label: fields?.[key]?.title ?? humanize(key), value: value !== null && typeof value === 'object' ? JSON.stringify(value) : display(value),
  }))
})
async function load() {
  state.value = 'pending'
  state.value = await ensureTag('wc-schema-form') ? 'ready' : 'failed'
}
watch(() => props.disabled, disabled => { if (!disabled) void load() }, { immediate: true })
function change(event: Event) {
  const value: unknown = (event as CustomEvent).detail
  if (value && typeof value === 'object' && !Array.isArray(value)) emit('update:modelValue', value as Record<string, unknown>)
}
</script>

<template>
  <Message v-if="problem" severity="warn" role="alert">
    <template v-if="problemLabel">{{ problemLabel }} is required. Enter a value below.</template>
    <template v-else>The saved settings don’t meet the plugin’s requirements. Update the configuration below.</template>
  </Message>
  <Disclosure v-if="problem" class="small pim-error-code pim-ia-disclosure" label="Technical details">
    <p v-if="pluginId">Plugin <code>{{ pluginId }}</code></p>
    <p>{{ problem.message }}</p>
  </Disclosure>
  <template v-if="disabled">
    <dl v-if="overrides.length" class="pim-config-overrides">
      <template v-for="override in overrides" :key="override.key">
        <dt>{{ override.label }}</dt><dd>{{ override.value }}</dd>
      </template>
    </dl>
    <span v-else class="muted small">No overrides</span>
  </template>
  <div v-else>
    <wc-schema-form v-if="state === 'ready'" :schema="JSON.stringify(props.schema)" :config="JSON.stringify(modelValue)" @config-changed="change" />
    <span v-else-if="state === 'pending'" class="muted small" role="status">Configuration form is loading.</span>
    <Message v-else role="alert" severity="error">Configuration form could not be loaded. <Button type="button" @click="load" severity="secondary" outlined size="small">Retry</Button></Message>
    <Button v-if="!problem" type="button" @click="emit('update:modelValue', {})" severity="secondary" outlined size="small"><Icon icon="tabler:restore" aria-hidden="true" /> Reset overrides</Button>
  </div>
</template>
