<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { computed } from 'vue'
import { statusSeverity } from '../presentation/context'
import IssueAssignee from '../presentation/IssueAssignee.vue'
import IssuePriority from '../presentation/IssuePriority.vue'
import IssueStatus from '../presentation/IssueStatus.vue'
import IssueType from '../presentation/IssueType.vue'
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
function typeLabel(item: Issue) {
  return props.schema.item_types.find(row => row.id === item.type)?.title
}
function tone(item: Issue) {
  const process = props.schema.processes.find(row => row.id === props.schema.item_types.find(type => type.id === item.type)?.process)
  return statusSeverity(process?.states.find(row => row.id === item.state))
}
</script>

<template>
  <DataTable :value="rows" data-key="id" size="small" class="kanban-issue-results" :pt="{ table: { 'aria-label': label } }">
    <Column header="Issue">
      <template #body="{ data }">
        <div class="kanban-backlog-issue">
          <IssueType :type="data.type" :label="typeLabel(data)" />
          <button type="button" class="kanban-backlog-title kanban-result-link kx-focus-outline"
            :aria-label="data.key + ' ' + title(data)" :title="title(data)" @click="emit('open', data.id)">
            <span class="kanban-backlog-key">{{ data.key }}</span><span dir="auto" class="kanban-backlog-summary">{{ title(data) }}</span>
          </button>
        </div>
      </template>
    </Column>
    <Column header="Status" header-class="kanban-result-status" body-class="kanban-result-status">
      <template #body="{ data }"><IssueStatus :label="stateLabel(schema, data)" :tone="tone(data)" /></template>
    </Column>
    <Column v-if="details === 'search'" header="Priority" header-class="kanban-result-extra" body-class="kanban-result-extra">
      <template #body="{ data }">
        <IssuePriority v-if="typeof data.values.priority === 'string'" :priority="data.values.priority" :label="priority(data)" text />
        <span v-else class="kanban-empty-value">—</span>
      </template>
    </Column>
    <Column v-if="details === 'search'" header="Assignee" header-class="kanban-result-extra" body-class="kanban-result-extra">
      <template #body="{ data }">
        <IssueAssignee v-if="principal(data.values.assignee)" :id="principal(data.values.assignee)!.id"
          :name="name(data.values.assignee) ?? 'Person unavailable'" text />
        <span v-else class="kanban-empty-value">—</span>
      </template>
    </Column>
    <Column v-if="details === 'planning' && points" header="Points" header-class="kanban-result-extra" body-class="kanban-result-extra">
      <template #body="{ data }">
        <span v-if="typeof data.values.story_points === 'number'" class="kanban-points">{{ data.values.story_points }}</span>
        <span v-else class="kanban-empty-value">—</span>
      </template>
    </Column>
  </DataTable>
</template>
