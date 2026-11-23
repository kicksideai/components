<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Button from 'primevue/button'
import Select from 'primevue/select'
import { computed } from 'vue'
import ExtensionElement from '../extensions/ExtensionElement.vue'
import { extensionFilter } from '../extensions/placements'
import type { WorkExtension } from '../work/types'
import { indexedField, type PresentationContext } from './context'
import type { FilterSelection } from './query'

export interface ActiveFilter {
  id: string
  label: string
  selection: FilterSelection
}
const props = defineProps<{
  board: string
  context: PresentationContext
  placements: readonly WorkExtension[]
  selection: readonly ActiveFilter[]
}>()
const emit = defineEmits<{ apply: [filters: ActiveFilter[]] }>()
const choices = computed(() => {
  const indexed = props.context.fields.filter(indexedField)
  const fields = [
    { id: 'type', title: 'Type', options: props.context.itemTypes.map(row => ({ id: row.id, label: row.title })) },
    { id: 'state', title: 'Status', options: props.context.statuses.map(row => ({ id: row.id, label: row.name })) },
    ...indexed.filter(row => row.code === 'priority' && row.options?.length)
      .map(row => ({ id: row.code, title: row.title ?? row.code, options: row.options ?? [] })),
  ]
  for (const entry of props.placements) {
    if (entry.slot !== 'filter' || entry.tag || !entry.target.startsWith('field:')) continue
    const code = entry.target.slice('field:'.length)
    if (fields.some(field => field.id === code)) continue
    const options = props.context.fields.find(field => field.code === code)?.options
    if (options?.length) fields.push({ id: code, title: entry.title, options })
  }
  return fields
})
const extensions = computed(() => props.placements.filter(entry => entry.slot === 'filter' && entry.tag))
function replace(id: string, filter?: ActiveFilter) {
  const next = props.selection.filter(row => row.id !== id)
  if (filter) next.push(filter)
  emit('apply', next)
}
function selectedValue(id: string) {
  const where = props.selection.find(row => row.id === id)?.selection.where
  return where && 'value' in where ? where.value : undefined
}
function choose(field: (typeof choices.value)[number], id: string | null) {
  const option = field.options.find(entry => entry.id === id)
  replace(field.id, option ? {
    id: field.id, label: field.title + ': ' + (option.label ?? option.id),
    selection: { where: { field: field.id, op: 'eq', value: option.id } },
  } : undefined)
}
function contributed(entry: WorkExtension, raw: unknown) {
  if (raw === null) return replace(entry.id)
  const selection = extensionFilter(entry, raw)
  if (selection) replace(entry.id, { id: entry.id, label: entry.title, selection })
}
</script>

<template>
  <div class="kanban-filters" aria-label="Filters">
    <Select v-for="field in choices" :key="field.id" :model-value="selectedValue(field.id)"
      :options="field.options" option-label="label" option-value="id"
      :aria-label="field.title" :placeholder="field.title" size="small" show-clear
      @update:model-value="choose(field, $event)" />
    <ExtensionElement v-for="entry in extensions" :key="entry.id" :placement="entry"
      :input="{ board, target: entry.target, selection: selection.find(row => row.id === entry.id)?.selection }"
      @filter="contributed(entry, $event)" />
    <Button v-for="filter in selection.filter(row => !choices.some(field => field.id === row.id))" :key="filter.id"
      :label="filter.label" icon="pi pi-times" icon-pos="right" :aria-label="'Remove ' + filter.label"
      size="small" severity="secondary" outlined @click="replace(filter.id)" />
    <Button v-if="selection.length" label="Clear filters" size="small" text severity="secondary" @click="emit('apply', [])" />
  </div>
</template>
