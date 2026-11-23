<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { loadByTagName } from '@wippy-fe/proxy'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import DatePicker from 'primevue/datepicker'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import { computed, ref, useId, watch } from 'vue'
import { principal } from './principals'
import type { Field, FieldValue, Reference, Scalar } from './types'
import { title } from './model'
import { queryIssues, type IssueWork } from './work'
import { useCursorPage } from './cursor'

const props = defineProps<{
  field: Field
  modelValue?: FieldValue
  required?: boolean
  disabled?: boolean
  autofocus?: boolean
  board: string
  work: IssueWork
}>()
const emit = defineEmits<{ 'update:modelValue': [value: FieldValue] }>()
const id = useId()
const picker = ref(false)
const pickerError = ref(false)
const isLong = computed(() => ['description', 'acceptance_criteria', 'planning_goal'].includes(props.field.code))
const many = computed(() => ['set', 'list'].includes(props.field.cardinality ?? ''))
const isPrincipal = computed(() => props.field.type === 'principal' || props.field.form === 'principal')
const isItem = computed(() => props.field.type === 'item')
const options = computed(() => [...(props.field.options ?? [])]
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map(row => ({ id: row.id, label: row.label ?? row.id })))
const stringValue = computed(() => typeof props.modelValue === 'string' ? props.modelValue : undefined)
const numericValue = computed(() => typeof props.modelValue === 'number' ? props.modelValue : undefined)
const listValue = computed(() => Array.isArray(props.modelValue) ? props.modelValue : [])
const dateValue = computed(() => {
  if (!stringValue.value) return
  const value = new Date(/^\d{4}-\d{2}-\d{2}$/.test(stringValue.value) ? stringValue.value + 'T00:00:00' : stringValue.value)
  return Number.isNaN(value.valueOf()) ? undefined : value
})
const refValue = computed(() => {
  const value = props.modelValue
  return value && typeof value === 'object' && 'item' in value ? value : undefined
})
const refs = useCursorPage(after => {
  const type = props.field.config?.item_type
  const states = props.field.config?.item_states
  const terms = [
    ...(type ? [{ field: 'type', op: 'eq', value: type }] : []),
    ...(states?.length ? [{ field: 'state', op: 'in', value: states }] : []),
  ]
  const where = terms.length > 1 ? { and: terms } : terms[0]
  return queryIssues(props.work, props.board, { where, limit: 20, after })
}, item => item.id)
const { rows, after, error: refError } = refs
const refOptions = computed(() => {
  const values = rows.value.map(item => ({ id: item.id, label: item.key + ' · ' + title(item) }))
  if (refValue.value && !values.some(option => option.id === refValue.value?.item)) {
    values.push({ id: refValue.value.item, label: 'Current reference' })
  }
  return values
})
const pickerValue = computed(() => many.value ? '{}' : JSON.stringify(props.modelValue ?? {}))
const rawList = ref('')
watch(() => props.modelValue, value => {
  if (many.value && !isPrincipal.value && !options.value.length && !isItem.value) {
    const source = Array.isArray(value) ? value.map(String) : []
    if (JSON.stringify(splitList(rawList.value)) !== JSON.stringify(source)) rawList.value = source.join(', ')
  }
}, { immediate: true })

watch(isPrincipal, async (enabled, _, onCleanup) => {
  if (!enabled) return
  let active = true
  onCleanup(() => { active = false })
  try {
    await loadByTagName('wc-principal-picker')
    if (active) picker.value = true
  } catch {
    if (active) pickerError.value = true
  }
}, { immediate: true })

function splitList(value: string) {
  return value.split(',').map(part => part.trim()).filter(Boolean)
}
function set(value: FieldValue) {
  emit('update:modelValue', value ?? undefined)
}
function editList(value?: string) {
  rawList.value = value ?? ''
  const source = splitList(rawList.value)
  if (['int', 'dec'].includes(props.field.form ?? '')) {
    set(source.map(Number).filter(Number.isFinite))
  } else set(source)
}
function pick(event: Event) {
  const payload = (event as CustomEvent<{ type?: string; id?: string; principal_id?: string }>).detail
  const kind = payload?.type
  const id = payload?.id ?? payload?.principal_id
  if ((kind !== 'user' && kind !== 'group') || !id) return
  const value = { kind, id } as const
  if (!many.value) set(value)
  else if (!listValue.value.some(row => principal(row)?.id === id && principal(row)?.kind === kind)) set([...listValue.value, value])
}
function drop(index: number) {
  set(listValue.value.filter((_, position) => position !== index))
}
function refChanged(value?: string) {
  set(value ? { board: props.board, item: value } satisfies Reference : undefined)
}
function dateChanged(value: string | Date | (Date | string | null)[] | null | undefined) {
  if (typeof value === 'string' || value == null) set(value)
  else if (value instanceof Date) set(value.toISOString())
}
function personName(value: Scalar) {
  return principal(value)?.kind === 'group' ? 'Selected group' : 'Selected person'
}
</script>

<template>
  <div class="issue-field-control">
    <label :for="id">{{ field.title }} <span v-if="required" aria-hidden="true">*</span></label>
    <div v-if="isPrincipal" :inert="disabled || undefined" class="issue-principal-picker">
      <wc-principal-picker v-if="picker" :id="id" :aria-label="field.title" :value="pickerValue" kinds="user,group"
        :placeholder="many ? 'Add a person or group…' : 'Select a person or group…'" @config-changed="pick" />
      <span v-else :role="pickerError ? 'alert' : 'status'">{{ pickerError ? 'The principal picker is unavailable.' : 'Loading people…' }}</span>
      <Button v-if="!many && modelValue && !required" type="button" size="small" text :label="'Clear ' + field.title" @click="set(undefined)" />
      <ul v-if="many && listValue.length" class="issue-selected-principals">
        <li v-for="(value, index) in listValue" :key="index">
          <Button type="button" size="small" text :label="'Remove ' + personName(value).toLowerCase() + ' ' + (index + 1)" @click="drop(index)" />
        </li>
      </ul>
    </div>
    <MultiSelect v-else-if="many && options.length" :input-id="id" :aria-label="field.title" :aria-required="required"
      :model-value="listValue" :options="options" option-label="label" option-value="id" :disabled="disabled" fluid
      @update:model-value="set" />
    <Select v-else-if="options.length" :input-id="id" :aria-label="field.title" :aria-required="required" :model-value="stringValue"
      :options="options" option-label="label" option-value="id" placeholder="Choose an option" :show-clear="!required" :disabled="disabled" fluid
      @update:model-value="set" />
    <Select v-else-if="isItem" :input-id="id" :aria-label="field.title" :aria-required="required" :model-value="refValue?.item"
      :options="refOptions" option-label="label" option-value="id" :show-clear="!required" :disabled="disabled" fluid
      @show="!refs.loaded.value && refs.load()" @update:model-value="refChanged">
      <template #footer>
        <span v-if="refError" role="alert">Could not load references.</span>
        <Button v-if="after || refError" type="button" text size="small" :label="refError ? 'Retry' : 'Load more'" @click.stop="refError ? refs.retry() : refs.load(true)" />
      </template>
    </Select>
    <InputText v-else-if="many" :id="id" :model-value="rawList" placeholder="Separate values with commas"
      :required="required" :disabled="disabled" fluid @update:model-value="editList" />
    <InputNumber v-else-if="field.form === 'int' || field.form === 'dec'" :input-id="id" :aria-label="field.title"
      :model-value="numericValue" :max-fraction-digits="field.form === 'int' ? 0 : 16"
      :use-grouping="false" :required="required" :disabled="disabled" fluid @update:model-value="set" />
    <DatePicker v-else-if="field.form === 'time'" :input-id="id" :aria-label="field.title" :model-value="dateValue"
      date-format="yy-mm-dd" :show-time="field.config?.format !== 'date'" :required="required" :disabled="disabled" fluid
      :update-model-type="field.config?.format === 'date' ? 'string' : 'date'" @update:model-value="dateChanged" />
    <Checkbox v-else-if="field.form === 'bool'" :input-id="id" :model-value="modelValue === true" binary
      :disabled="disabled" @update:model-value="set" />
    <Textarea v-else-if="isLong" :id="id" :model-value="stringValue" :required="required" :disabled="disabled" rows="4" fluid @update:model-value="set" />
    <InputText v-else :id="id" :model-value="stringValue" :required="required" :disabled="disabled" :autofocus="autofocus" dir="auto"
      fluid @update:model-value="set" />
  </div>
</template>
