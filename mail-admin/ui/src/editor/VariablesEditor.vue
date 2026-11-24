<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import type { Json, JsonObject, ResourceContent } from '../types'
import { faceLabels, type Problem } from './problems'

// Variables of a message and inputs of a part: name, type, required, description and sample value.
const props = defineProps<{ draft: ResourceContent; label: string; problem?: Problem; disabled?: boolean }>()
const emit = defineEmits<{ invalid: [invalid: boolean] }>()

type Kind = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object'
interface Row { id: number; name: string; type: Kind; required: boolean; description: string; sample: string; fallback: string; schema: JsonObject }

const types: { value: Kind; label: string }[] = [
  { value: 'string', label: 'Text' }, { value: 'number', label: 'Number' }, { value: 'integer', label: 'Whole number' },
  { value: 'boolean', label: 'Yes or no' }, { value: 'array', label: 'List' }, { value: 'object', label: 'Record' },
]
let next = 0
function text(value: Json | undefined): string {
  if (value === undefined || value === null) return ''
  return typeof value === 'string' ? value : JSON.stringify(value)
}
function rowsOf(draft: ResourceContent): Row[] {
  const required = new Set(draft.schema.required ?? [])
  const values = draft.samples
  return Object.entries(draft.schema.properties).map(([name, schema]) => ({
    id: next++, name, schema,
    type: (types.some(type => type.value === schema.type) ? schema.type : 'string') as Kind,
    required: required.has(name),
    description: typeof schema.description === 'string' ? schema.description : '',
    sample: text(values[name]), fallback: text(schema.default),
  }))
}
const rows = ref<Row[]>(rowsOf(props.draft))
watch(() => props.draft, draft => { rows.value = rowsOf(draft) })

function parse(row: Row, raw: string): { value?: Json; invalid?: string } {
  if (raw === '') return {}
  if (row.type === 'string') return { value: raw }
  try {
    const value = JSON.parse(raw) as Json
    const ok = row.type === 'array' ? Array.isArray(value)
      : row.type === 'object' ? !!value && typeof value === 'object' && !Array.isArray(value)
        : row.type === 'boolean' ? typeof value === 'boolean'
          : typeof value === 'number' && (row.type === 'number' || Number.isInteger(value))
    return ok ? { value } : { invalid: `Enter a ${types.find(type => type.value === row.type)?.label.toLowerCase()} value.` }
  } catch {
    return { invalid: row.type === 'array' ? 'Enter a list, for example ["a", "b"].' : row.type === 'object' ? 'Enter a record, for example {"key": "value"}.'
      : row.type === 'boolean' ? 'Enter true or false.' : 'Enter a number.' }
  }
}
const problems = computed(() => rows.value.map(row => {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(row.name)) return 'Use letters, digits and underscores, starting with a letter.'
  if (rows.value.some(other => other !== row && other.name === row.name)) return 'Another one has this name.'
  return parse(row, row.sample).invalid ?? parse(row, row.fallback).invalid ?? ''
}))

watch(problems, value => emit('invalid', value.some(Boolean)), { immediate: true })
watch(rows, value => {
  if (problems.value.some(Boolean)) return
  const schemaProps: Record<string, JsonObject> = {}
  const values: JsonObject = {}
  for (const row of value) {
    const schema: JsonObject = { ...row.schema, type: row.type }
    if (row.description) schema.description = row.description
    else delete schema.description
    const fallback = parse(row, row.fallback).value
    if (fallback !== undefined) schema.default = fallback
    else delete schema.default
    schemaProps[row.name] = schema
    const sample = parse(row, row.sample).value
    if (sample !== undefined) values[row.name] = sample
  }
  const required = value.filter(row => row.required).map(row => row.name)
  props.draft.schema = { ...props.draft.schema, properties: schemaProps, required: required.length ? required : undefined }
  props.draft.samples = values
}, { deep: true })

function add() {
  let index = rows.value.length + 1
  while (rows.value.some(row => row.name === `value_${index}`)) index++
  rows.value.push({ id: next++, name: `value_${index}`, type: 'string', required: false, description: '', sample: '', fallback: '', schema: {} })
}
const isPart = computed(() => props.draft.kind === 'part')
const serverProblem = computed(() => props.problem && (props.problem.face === 'variables' || props.problem.face === 'samples')
  ? `${faceLabels[props.problem.face]}: ${props.problem.message}` : '')
</script>

<template>
  <fieldset class="mail-variables" :disabled="disabled" :inert="disabled || undefined">
    <legend class="mail-sr-only">{{ label }}</legend>
    <p v-if="serverProblem" class="kx-err inline" role="alert">{{ serverProblem }}</p>
    <p v-if="!rows.length" class="mail-muted">{{ draft.title }} takes no {{ label.toLowerCase() }} yet.</p>
    <div v-else class="mail-variable-grid" role="table" :aria-label="label">
      <div class="mail-variable-row mail-variable-head" role="row">
        <span role="columnheader">Name</span><span role="columnheader">Type</span><span role="columnheader">Required</span>
        <span role="columnheader">Description</span>
        <span v-if="isPart" role="columnheader">Default</span>
        <span role="columnheader">Sample value</span><span role="columnheader"><span class="mail-sr-only">Remove</span></span>
      </div>
      <div v-for="(row, index) in rows" :key="row.id" class="mail-variable-row" :class="{ 'mail-variable-invalid': problems[index] }" role="row">
        <span role="cell"><InputText v-model="row.name" class="mail-mono-input" :aria-label="'Name of ' + (row.name || 'value')" :invalid="!!problems[index]" /></span>
        <span role="cell"><Select v-model="row.type" :options="types" option-label="label" option-value="value" append-to="self" :aria-label="'Type of ' + row.name" /></span>
        <span role="cell" class="mail-variable-check"><Checkbox v-model="row.required" binary :aria-label="row.name + ' is required'" /></span>
        <span role="cell"><InputText v-model="row.description" :aria-label="'Description of ' + row.name" /></span>
        <span v-if="isPart" role="cell"><InputText v-model="row.fallback" :aria-label="'Default of ' + row.name" /></span>
        <span role="cell"><InputText v-model="row.sample" :aria-label="'Sample value of ' + row.name" /></span>
        <span role="cell">
          <Button text severity="secondary" :aria-label="'Remove ' + row.name" :title="'Remove ' + row.name" @click="rows.splice(index, 1)">
            <template #icon><Icon icon="tabler:trash" aria-hidden="true" /></template>
          </Button>
        </span>
        <small v-if="problems[index]" class="mail-field-error mail-variable-error" role="alert">{{ row.name }}: {{ problems[index] }}</small>
      </div>
    </div>
    <div>
      <Button :label="isPart ? 'Add input' : 'Add variable'" severity="secondary" outlined size="small" @click="add">
        <template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template>
      </Button>
    </div>
  </fieldset>
</template>
