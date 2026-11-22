<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Button from 'primevue/button'
import { record } from '../../values'
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import ToggleSwitch from 'primevue/toggleswitch'
import Select from 'primevue/select'
import Chip from 'primevue/chip'
import AddDefinitionRow from './AddDefinitionRow.vue'
import JsonInput from './JsonInput.vue'
import { ensureTag } from '../mount'
import { configErrors, configFields, stringArray } from './config'
const props = defineProps<{ schema: Record<string, unknown>; modelValue: Record<string, unknown>; disabled?: boolean; suggestDefaults?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: Record<string, unknown>]; validity: [valid: boolean]; 'validation-message': [message: string] }>()
const invalid = ref(new Set<string>()), ready = ref(false), widgetLoading = ref(false)
const id = useId()
const fields = computed(() => configFields(props.schema))
const errors = computed(() => configErrors(props.schema, props.modelValue, !props.suggestDefaults))
const picked = computed(() => fields.value.filter(f => typeof f.schema.picker === 'string'))
const scalar = computed(() => fields.value.filter(f => typeof f.schema.picker !== 'string'))
const pickerSchema = computed(() => ({ ...props.schema, properties: Object.fromEntries(picked.value.map(f => [f.key, { ...f.schema, title: f.title }])), required: Array.isArray(props.schema.required) ? props.schema.required.filter(key => picked.value.some(f => f.key === key)) : [] }))
const pickerValues = computed(() => Object.fromEntries(picked.value.map(f => [f.key, props.modelValue[f.key]])))
const valid = computed(() => !Object.keys(errors.value).length && !invalid.value.size && (!picked.value.length || ready.value))
const firstError = computed(() => {
  for (const field of fields.value) {
    if (errors.value[field.key]) return field.title + ': ' + errors.value[field.key]
    if (invalid.value.has(field.key)) return field.title + ': Enter valid JSON.'
  }
  if (!valid.value) return 'Open plugin settings to check the configuration widget.'
  return ''
})
watch(valid, value => emit('validity', value), { immediate: true })
watch(firstError, value => emit('validation-message', value), { immediate: true })
async function loadPicker() { widgetLoading.value = true; ready.value = await ensureTag('wc-schema-form'); widgetLoading.value = false }
watch(() => picked.value.length > 0, present => { if (present) void loadPicker() }, { immediate: true })
onBeforeUnmount(() => { emit('validity', true); emit('validation-message', '') })
function shown(key: string, fallback: unknown) { return props.modelValue[key] ?? (props.suggestDefaults ? undefined : fallback) }
function update(key: string, value: unknown) { const next = { ...props.modelValue }; if (value === undefined || value === null) delete next[key]; else next[key] = value; emit('update:modelValue', next) }
function strings(key: string): string[] { const value = props.modelValue[key]; return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [] }
function validity(key: string, valid: boolean) { if (valid) invalid.value.delete(key); else invalid.value.add(key) }
function pickerChange(event: Event) { emit('update:modelValue', { ...props.modelValue, ...record((event as CustomEvent<unknown>).detail) }) }
</script>
<template>
  <div class="work-stack">
    <wc-schema-form v-if="picked.length && ready" class="work-config-widget" :inert="disabled || undefined" :schema="JSON.stringify(pickerSchema)" :config="JSON.stringify(pickerValues)" @config-changed="pickerChange" />
    <p v-else-if="picked.length && widgetLoading" role="status" class="work-muted work-small">The configuration widget is loading.</p>
    <p v-else-if="picked.length" role="alert" class="kx-err">The configuration widget is unavailable.<Button label="Reload configuration widget" severity="secondary" outlined @click="loadPicker" /></p>
    <div class="work-config-fields">
      <div v-for="field in scalar" :key="field.key" class="work-config-field">
        <span v-if="stringArray(field.schema)" class="work-config-label">{{ field.title }}<span v-if="field.required" class="work-muted"> (required)</span></span>
        <label v-else class="work-config-label" :for="id + '-' + field.key">{{ field.title }}<span v-if="field.required" class="work-muted"> (required)</span></label>
        <Select v-if="Array.isArray(field.schema.enum)" :input-id="id + '-' + field.key" :model-value="shown(field.key, field.schema.default)" :options="field.schema.enum" appendTo="self" :aria-label="field.title" :aria-required="field.required || undefined" :disabled="disabled" @update:model-value="update(field.key, $event)" />
        <div v-else-if="stringArray(field.schema)" class="work-config-chips">
          <Chip v-for="(value, index) in strings(field.key)" :key="index" :label="value" :removable="!disabled" @remove="update(field.key, strings(field.key).filter((_, i) => i !== index))" />
          <AddDefinitionRow v-if="!disabled" action="Add value" :label="'Add ' + field.title.toLocaleLowerCase()"
            @add="update(field.key, [...strings(field.key), $event])" />
        </div>
        <InputNumber v-else-if="['integer', 'number'].includes(String(field.schema.type))" :input-id="id + '-' + field.key" :model-value="shown(field.key, field.schema.default) as number | undefined" :max-fraction-digits="field.schema.type === 'integer' ? 0 : 8" :use-grouping="false" :aria-label="field.title" :disabled="disabled" :invalid="!!errors[field.key]" :pt="{ pcInputText: { root: { 'aria-required': field.required || undefined } } }" @update:model-value="update(field.key, $event)" />
        <Select v-else-if="field.schema.type === 'boolean' && suggestDefaults" :input-id="id + '-' + field.key" :model-value="modelValue[field.key]" :aria-label="field.title" :aria-required="field.required || undefined" :disabled="disabled" appendTo="self"
          optionLabel="label" optionValue="value" :options="[{ label: 'Use deployment setting', value: null }, { label: 'On', value: true }, { label: 'Off', value: false }]"
          placeholder="Use deployment setting" @update:model-value="update(field.key, $event)" />
        <ToggleSwitch v-else-if="field.schema.type === 'boolean'" :input-id="id + '-' + field.key" :model-value="Boolean(shown(field.key, field.schema.default))" :aria-label="field.title" :disabled="disabled" @update:model-value="update(field.key, $event)" />
        <JsonInput v-else-if="['array', 'object'].includes(String(field.schema.type))" :label="field.title" :model-value="modelValue[field.key]" :shape="field.schema.type === 'array' ? 'array' : 'object'" :example="field.schema.default ?? (field.schema.type === 'array' ? [] : {})" @update:model-value="update(field.key, $event)" @validity="validity(field.key, $event)" />
        <InputText v-else :id="id + '-' + field.key" :model-value="(shown(field.key, field.schema.default) ?? '') as string" :disabled="disabled" :invalid="!!errors[field.key]" :aria-label="field.title" :aria-required="field.required || undefined" @update:model-value="update(field.key, $event)" />
        <p v-if="field.description" class="work-muted work-small">{{ field.description }}</p>
        <p v-if="suggestDefaults && modelValue[field.key] === undefined && field.schema.default !== undefined" class="work-muted work-small">Suggested value: {{ field.schema.default }}</p>
        <p v-if="errors[field.key]" role="alert" class="work-error work-small">{{ errors[field.key] }}</p>
      </div>
    </div>
  </div>
</template>
