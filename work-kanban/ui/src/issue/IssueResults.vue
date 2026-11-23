<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { stateLabel, title } from './model'
import { principal, usePrincipalNames } from './principals'
import type { Issue, Schema } from './types'

const props = defineProps<{ rows: Issue[]; schema: Schema; label: string; details: 'search' | 'planning' }>()
const emit = defineEmits<{ open: [id: string] }>()
const option = computed(() => props.schema.fields.find(row => row.code === 'priority')?.options ?? [])
const points = computed(() => props.schema.fields.some(row => row.code === 'story_points'))
const name = usePrincipalNames(() => props.details === 'search' ? props.rows.map(row => principal(row.values.assignee)) : [])

function priority(item: Issue) {
  return option.value.find(row => row.id === item.values.priority)?.label
}
</script>

<template>
  <DataTable :value="rows" data-key="id" size="small" class="kanban-issue-results" :pt="{ table: { 'aria-label': label } }">
    <Column header="Issue">
      <template #body="{ data }">
        <Button type="button" severity="secondary" text size="small" class="kanban-result-link"
          :aria-label="data.key + ' ' + title(data)" @click="emit('open', data.id)">
          <span class="kanban-result-key">{{ data.key }}</span><span dir="auto" class="kanban-result-title">{{ title(data) }}</span>
        </Button>
      </template>
    </Column>
    <Column header="Status" header-class="kanban-result-status" body-class="kanban-result-status">
      <template #body="{ data }"><Tag severity="secondary" class="kx-tag-sm" :value="stateLabel(schema, data)" /></template>
    </Column>
    <Column v-if="details === 'search'" header="Priority" header-class="kanban-result-extra" body-class="kanban-result-extra">
      <template #body="{ data }">
        <Tag v-if="priority(data)" :severity="data.values.priority === 'highest' ? 'danger' : data.values.priority === 'high' ? 'warn' : 'secondary'"
          :value="priority(data)" class="kx-tag-sm" />
        <span v-else>—</span>
      </template>
    </Column>
    <Column v-if="details === 'search'" header="Assignee" header-class="kanban-result-extra" body-class="kanban-result-extra">
      <template #body="{ data }">{{ name(data.values.assignee) ?? (data.values.assignee ? 'Person unavailable' : '—') }}</template>
    </Column>
    <Column v-if="details === 'planning' && points" header="Points" header-class="kanban-result-extra" body-class="kanban-result-extra">
      <template #body="{ data }">{{ data.values.story_points ?? '—' }}</template>
    </Column>
  </DataTable>
</template>
