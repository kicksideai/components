<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { ensureTag } from '../mount'
import { configFieldLabel, display } from '../../forms'
import type { PluginIssue } from '../../types'

interface SchemaForm extends HTMLElement {
  reportValidity(): boolean
}
interface FieldValidity { valid: boolean; errors: Record<string, string> }

const props = defineProps<{ schema: Record<string, unknown>; modelValue: Record<string, unknown>; disabled?: boolean; problem?: PluginIssue; pluginId?: string; refusal?: { field: string; message: string }; fieldHelp?: Record<string, string> }>()
const emit = defineEmits<{ 'update:modelValue': [value: Record<string, unknown>]; validity: [valid: boolean, localErrors: boolean] }>()
const widget = ref<SchemaForm>()
const widgetVersion = ref(0)
const state = ref<'pending' | 'failed' | 'ready'>('pending')
const formSchema = computed(() => {
  const fields = props.schema.properties
  if (!fields || typeof fields !== 'object') return props.schema
  return {
    ...props.schema,
    properties: Object.fromEntries(Object.entries(fields).map(([key, field]) => [
      key, field && typeof field === 'object' ? {
        ...field, title: configFieldLabel(props.schema, key),
        ...(!('description' in field) && props.fieldHelp?.[key] ? { description: props.fieldHelp[key] } : {}),
      } : field,
    ])),
  }
})
const issue = computed(() => props.refusal ?? (props.problem?.field
  ? { field: props.problem.field, message: /missing required property/i.test(props.problem.message) ? 'A value is required.' : props.problem.message }
  : undefined))
const fieldErrors = computed(() => {
  const error = issue.value
  return error && Object.hasOwn(formSchema.value.properties ?? {}, error.field) ? { [error.field]: error.message } : {}
})
const formError = computed(() => {
  if (Object.keys(fieldErrors.value).length || props.disabled) return ''
  return props.refusal?.message ?? (props.problem ? 'The saved settings don’t meet the plugin’s requirements. Update the configuration below.' : '')
})
const overrides = computed(() => Object.entries(props.modelValue).map(([key, value]) => ({
  key, label: configFieldLabel(props.schema, key), value: value !== null && typeof value === 'object' ? JSON.stringify(value) : display(value),
})))
async function load() {
  state.value = 'pending'
  state.value = await ensureTag('wc-schema-form') ? 'ready' : 'failed'
}
watch(() => props.disabled, disabled => { if (!disabled) void load() }, { immediate: true })
function reportValidity() {
  return widget.value?.reportValidity()
}

function validity(event: Event) {
  const detail = (event as CustomEvent<FieldValidity>).detail
  const localErrors = Object.entries(detail.errors).some(([key, message]) => fieldErrors.value[key] !== message)
  emit('validity', detail.valid, localErrors)
}

function reset() {
  widgetVersion.value++
  emit('update:modelValue', {})
}

onBeforeUnmount(() => emit('validity', true, false))
defineExpose({ reportValidity })

function change(event: Event) {
  const value: unknown = (event as CustomEvent).detail
  if (value && typeof value === 'object' && !Array.isArray(value)) emit('update:modelValue', value as Record<string, unknown>)
}
</script>

<template>
  <Message v-if="formError" severity="warn" role="alert">{{ formError }}</Message>
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
    <wc-schema-form v-if="state === 'ready'" :key="widgetVersion" ref="widget" allow-unset :schema="JSON.stringify(formSchema)" :config="JSON.stringify(modelValue)"
      :field-errors="JSON.stringify(fieldErrors)" @config-changed="change" @validity-changed="validity" />
    <span v-else-if="state === 'pending'" class="muted small" role="status">Configuration form is loading.</span>
    <Message v-else role="alert" severity="error">Configuration form could not be loaded. <Button type="button" @click="load" severity="secondary" outlined size="small">Retry</Button></Message>
    <Button v-if="!problem" type="button" @click="reset" severity="secondary" outlined size="small"><Icon icon="tabler:restore" aria-hidden="true" /> Reset overrides</Button>
  </div>
</template>
