<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import type { Json, JsonObject, ResourceContent } from '../types'
import { faceLabels, type Problem } from './problems'
import ValueField, { type ValueType } from './ValueField.vue'

// Variables of a message and inputs of a part: reference name, label, type, required, description, default for a
// part's input, and the sample value used in previews and tests. Each one is a card, so the editor fits narrow panes.
const props = defineProps<{ draft: ResourceContent; label: string; problem?: Problem; disabled?: boolean }>()
const emit = defineEmits<{ invalid: [invalid: boolean] }>()

interface Row {
  id: number; name: string; title: string; type: ValueType; itemType?: string; required: boolean; description: string
  sample: Json | undefined; fallback: Json | undefined; schema: JsonObject; valueErrors: Record<'sample' | 'fallback', string>
}

const types: { value: ValueType; label: string }[] = [
  { value: 'string', label: 'Text' }, { value: 'number', label: 'Number' }, { value: 'integer', label: 'Whole number' },
  { value: 'boolean', label: 'Yes or no' }, { value: 'array', label: 'List' }, { value: 'object', label: 'Record' },
]
let next = 0
function rowsOf(draft: ResourceContent): Row[] {
  const required = new Set(draft.schema.required ?? [])
  return Object.entries(draft.schema.properties).map(([name, schema]) => {
    const items = schema.items as JsonObject | undefined
    return {
      id: next++, name, schema,
      title: typeof schema.title === 'string' ? schema.title : '',
      type: (types.some(type => type.value === schema.type) ? schema.type : 'string') as ValueType,
      itemType: typeof items?.type === 'string' ? items.type : undefined,
      required: required.has(name),
      description: typeof schema.description === 'string' ? schema.description : '',
      sample: draft.samples[name], fallback: schema.default,
      valueErrors: { sample: '', fallback: '' },
    }
  })
}
const rows: Ref<Row[]> = ref([])
rows.value = rowsOf(props.draft)
watch(() => props.draft, draft => { rows.value = rowsOf(draft) })

function fits(row: Row, value: Json | undefined): boolean {
  if (value === undefined) return true
  switch (row.type) {
    case 'string': return typeof value === 'string'
    case 'number': return typeof value === 'number'
    case 'integer': return typeof value === 'number' && Number.isInteger(value)
    case 'boolean': return typeof value === 'boolean'
    case 'array': return Array.isArray(value)
    default: return !!value && typeof value === 'object' && !Array.isArray(value)
  }
}
// A changed type keeps a value only when it still fits.
function retype(row: Row, type: ValueType) {
  row.type = type
  if (!fits(row, row.sample)) row.sample = undefined
  if (!fits(row, row.fallback)) row.fallback = undefined
}

const problems = computed(() => rows.value.map(row => {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(row.name)) return 'Use letters, digits and underscores, starting with a letter.'
  if (rows.value.some(other => other !== row && other.name === row.name)) return 'Another one has this name.'
  return row.valueErrors.sample || row.valueErrors.fallback || ''
}))

watch(problems, value => emit('invalid', value.some(Boolean)), { immediate: true })
watch(rows, value => {
  if (problems.value.some(Boolean)) return
  const schemaProps: Record<string, JsonObject> = {}
  const values: JsonObject = {}
  for (const row of value) {
    const schema: JsonObject = { ...row.schema, type: row.type }
    for (const [key, field] of [['title', row.title], ['description', row.description]] as const) {
      if (field) schema[key] = field
      else delete schema[key]
    }
    if (row.fallback !== undefined) schema.default = row.fallback
    else delete schema.default
    schemaProps[row.name] = schema
    if (row.sample !== undefined) values[row.name] = row.sample
  }
  const required = value.filter(row => row.required).map(row => row.name)
  props.draft.schema = { ...props.draft.schema, properties: schemaProps, required: required.length ? required : undefined }
  props.draft.samples = values
}, { deep: true })

function add() {
  let index = rows.value.length + 1
  while (rows.value.some(row => row.name === `value_${index}`)) index++
  rows.value.push({ id: next++, name: `value_${index}`, title: '', type: 'string', required: false, description: '', sample: undefined, fallback: undefined,
    schema: {}, valueErrors: { sample: '', fallback: '' } })
}
const isPart = computed(() => props.draft.kind === 'part')
const serverProblem = computed(() => props.problem && (props.problem.face === 'variables' || props.problem.face === 'samples')
  ? `${faceLabels[props.problem.face]}: ${props.problem.engine ?? props.problem.message}` : '')
</script>

<template>
  <fieldset class="mail-variables" :disabled="disabled" :inert="disabled || undefined">
    <legend class="mail-sr-only">{{ label }}</legend>
    <p v-if="serverProblem" class="kx-err inline" role="alert">{{ serverProblem }}</p>
    <p v-if="!rows.length" class="mail-muted">{{ draft.title }} takes no {{ label.toLowerCase() }} yet.</p>
    <ul v-else class="mail-variable-list" :aria-label="label">
      <li v-for="(row, index) in rows" :key="row.id" class="mail-variable-card" :class="{ 'mail-variable-invalid': problems[index] }">
        <div class="mail-variable-grid">
          <label class="mail-field">
            <span class="mail-field-label">Name in templates</span>
            <InputText v-model="row.name" class="mail-mono-input" :invalid="!!problems[index] && !row.valueErrors.sample && !row.valueErrors.fallback" />
          </label>
          <label class="mail-field">
            <span class="mail-field-label">Label</span>
            <InputText v-model="row.title" :placeholder="row.name" />
          </label>
          <div class="mail-field">
            <span :id="'type-' + row.id" class="mail-field-label">Type</span>
            <Select :model-value="row.type" :options="types" option-label="label" option-value="value" append-to="self" :aria-labelledby="'type-' + row.id"
              @update:model-value="type => retype(row, type)" />
          </div>
          <label class="mail-variable-check">
            <Checkbox v-model="row.required" binary />
            <span>Required</span>
          </label>
          <Button text severity="secondary" class="mail-variable-remove" :aria-label="'Remove ' + row.name" :title="'Remove ' + row.name" @click="rows.splice(index, 1)">
            <template #icon><Icon icon="tabler:trash" aria-hidden="true" /></template>
          </Button>
        </div>
        <label class="mail-field">
          <span class="mail-field-label">Description</span>
          <InputText v-model="row.description" placeholder="What senders put here" />
        </label>
        <div class="mail-variable-values">
          <div v-if="isPart" class="mail-field">
            <span class="mail-field-label">Default</span>
            <ValueField v-model="row.fallback" :type="row.type" :item-type="row.itemType" :label="'Default of ' + row.name"
              @invalid="message => row.valueErrors.fallback = message" />
          </div>
          <div class="mail-field">
            <span class="mail-field-label">Sample value</span>
            <ValueField v-model="row.sample" :type="row.type" :item-type="row.itemType" :label="'Sample value of ' + row.name"
              @invalid="message => row.valueErrors.sample = message" />
          </div>
        </div>
        <small v-if="problems[index]" class="mail-field-error" role="alert">{{ row.name }}: {{ problems[index] }}</small>
      </li>
    </ul>
    <div>
      <Button :label="isPart ? 'Add input' : 'Add variable'" severity="secondary" outlined size="small" @click="add">
        <template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template>
      </Button>
    </div>
  </fieldset>
</template>
