<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Tag from 'primevue/tag'
import type { Json, JsonObject, Resource } from '../types'

const props = defineProps<{ resource: Resource; label: string }>()

interface Row { name: string; type: string; required: boolean; description: string; sample: string; fallback: string }

function typeOf(schema: JsonObject): string {
  const type = schema.type
  if (type === 'array') {
    const items = schema.items
    const inner = items && typeof items === 'object' && !Array.isArray(items) ? (items as JsonObject).type : undefined
    return inner === 'object' ? 'List of records' : inner ? 'List of ' + String(inner) + 's' : 'List'
  }
  const names: Record<string, string> = { string: 'Text', integer: 'Whole number', number: 'Number', boolean: 'Yes or no', object: 'Record' }
  return typeof type === 'string' ? names[type] ?? type : 'Any'
}

function shown(value: Json | undefined): string {
  if (value === undefined || value === null) return '—'
  return typeof value === 'string' ? value : JSON.stringify(value)
}

const rows = computed<Row[]>(() => {
  const required = new Set(props.resource.schema.required ?? [])
  return Object.entries(props.resource.schema.properties).map(([name, schema]) => ({
    name,
    type: typeOf(schema),
    required: required.has(name),
    description: typeof schema.description === 'string' ? schema.description : '',
    sample: shown(props.resource.samples[name]),
    fallback: shown(schema.default),
  }))
})
const hasDefaults = computed(() => rows.value.some(row => row.fallback !== '—'))
</script>

<template>
  <p v-if="!rows.length" class="mail-muted" role="status">{{ resource.title }} takes no {{ label.toLowerCase() }}.</p>
  <DataTable v-else :value="rows" data-key="name" class="mail-table" :pt="{ table: { 'aria-label': label } }">
    <Column header="Name">
      <template #body="{ data }">
        <span class="mail-mono">{{ data.name }}</span>
        <Tag v-if="data.required" severity="secondary" value="Required" class="kx-tag-sm mail-required" />
      </template>
    </Column>
    <Column header="Type" field="type" />
    <Column header="Description">
      <template #body="{ data }"><span class="mail-sub mail-inline">{{ data.description || '—' }}</span></template>
    </Column>
    <Column v-if="hasDefaults" header="Default">
      <template #body="{ data }"><span class="mail-value">{{ data.fallback }}</span></template>
    </Column>
    <Column header="Sample value">
      <template #body="{ data }"><span class="mail-value">{{ data.sample }}</span></template>
    </Column>
  </DataTable>
</template>
