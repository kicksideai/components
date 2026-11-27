<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import Textarea from 'primevue/textarea'
import type { Json } from '../types'

// One value of a declared type. Text, numbers, yes or no, lists of plain values and records of text get their own
// controls; a value that holds nested data is edited as written data.
export type ValueType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object'
const props = defineProps<{ type: ValueType; itemType?: string; label: string; disabled?: boolean }>()
const value = defineModel<Json | undefined>()
const emit = defineEmits<{ invalid: [message: string] }>()

const scalar = (item: Json) => item === null || ['string', 'number', 'boolean'].includes(typeof item)
const plainList = (item: Json | undefined) => item === undefined || (Array.isArray(item) && item.every(scalar))
const plainRecord = (item: Json | undefined) => item === undefined
  || (!!item && typeof item === 'object' && !Array.isArray(item) && Object.values(item).every(entry => typeof entry === 'string'))
const written = ref(false)
watch(() => props.type, () => { written.value = false })
const mode = computed(() => {
  if (written.value) return 'written'
  if (props.type === 'array') return plainList(value.value) ? 'list' : 'written'
  if (props.type === 'object') return plainRecord(value.value) ? 'record' : 'written'
  return props.type
})

const lines = computed({
  get: () => Array.isArray(value.value) ? value.value.map(item => item === null ? '' : String(item)).join('\n') : '',
  set: (text: string) => {
    const items = text.split('\n').map(line => line.trim()).filter(Boolean)
    const numeric = props.itemType === 'number' || props.itemType === 'integer'
    value.value = items.length ? items.map(item => numeric && item !== '' && !Number.isNaN(Number(item)) ? Number(item) : item) : undefined
  },
})

interface Entry { key: string; value: string }
const entries = ref<Entry[]>([])
watch(value, current => {
  if (mode.value !== 'record') return
  const object = (current ?? {}) as Record<string, string>
  if (JSON.stringify(Object.fromEntries(entries.value.filter(entry => entry.key).map(entry => [entry.key, entry.value]))) === JSON.stringify(object)) return
  entries.value = Object.entries(object).map(([key, text]) => ({ key, value: text }))
}, { immediate: true })
function syncEntries() {
  const filled = entries.value.filter(entry => entry.key.trim())
  value.value = filled.length ? Object.fromEntries(filled.map(entry => [entry.key.trim(), entry.value])) : undefined
}

const text = ref('')
const textError = ref('')
watch([value, mode], () => { if (mode.value === 'written' && !textError.value) text.value = value.value === undefined ? '' : JSON.stringify(value.value, null, 2) }, { immediate: true })
function parseText(raw: string) {
  text.value = raw
  if (!raw.trim()) { textError.value = ''; value.value = undefined; return }
  try {
    const parsed = JSON.parse(raw) as Json
    const fits = props.type === 'array' ? Array.isArray(parsed) : !!parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    textError.value = fits ? '' : props.type === 'array' ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.'
    if (fits) value.value = parsed
  } catch {
    textError.value = props.type === 'array' ? 'Write a list, for example ["a", "b"].' : 'Write a record, for example {"key": "value"}.'
  }
}
watch(textError, message => emit('invalid', message), { immediate: true })

const yesNo = [{ label: 'Yes', value: true }, { label: 'No', value: false }]
</script>

<template>
  <div class="mail-value-field">
    <InputText v-if="mode === 'string'" :model-value="typeof value === 'string' ? value : ''" :aria-label="label" :disabled="disabled" fluid
      @update:model-value="next => value = next ? next : undefined" />
    <InputNumber v-else-if="mode === 'number' || mode === 'integer'" :model-value="typeof value === 'number' ? value : null" :aria-label="label"
      :max-fraction-digits="mode === 'integer' ? 0 : 6" :use-grouping="false" :disabled="disabled" fluid
      @update:model-value="next => value = next ?? undefined" />
    <SelectButton v-else-if="mode === 'boolean'" :model-value="typeof value === 'boolean' ? value : null" :options="yesNo" option-label="label"
      option-value="value" :aria-label="label" :disabled="disabled" @update:model-value="next => value = typeof next === 'boolean' ? next : undefined" />
    <template v-else-if="mode === 'list'">
      <Textarea v-model="lines" :aria-label="label" rows="3" auto-resize :disabled="disabled" fluid placeholder="One item per line" />
    </template>
    <template v-else-if="mode === 'record'">
      <div v-for="(entry, index) in entries" :key="index" class="mail-value-entry">
        <InputText v-model="entry.key" :aria-label="label + ', name ' + (index + 1)" placeholder="Name" :disabled="disabled" @update:model-value="syncEntries" />
        <InputText v-model="entry.value" :aria-label="label + ', value ' + (index + 1)" placeholder="Value" :disabled="disabled" @update:model-value="syncEntries" />
        <Button text severity="secondary" size="small" :aria-label="'Remove ' + (entry.key || 'entry')" :disabled="disabled" @click="entries.splice(index, 1); syncEntries()">
          <template #icon><Icon icon="tabler:x" aria-hidden="true" /></template>
        </Button>
      </div>
      <Button label="Add a name and value" severity="secondary" text size="small" :disabled="disabled" @click="entries.push({ key: '', value: '' })">
        <template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template>
      </Button>
    </template>
    <template v-else>
      <Textarea :model-value="text" :aria-label="label" rows="3" auto-resize class="mail-mono-input" :invalid="!!textError" :disabled="disabled" fluid
        @update:model-value="parseText" />
      <small v-if="textError" class="mail-field-error" role="alert">{{ textError }}</small>
    </template>
    <Button v-if="(type === 'array' || type === 'object') && mode !== 'written'" link size="small" class="mail-inline-link"
      label="Write it as data" :disabled="disabled" @click="written = true" />
  </div>
</template>
