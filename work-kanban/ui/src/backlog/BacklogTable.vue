<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Menu from 'primevue/menu'
import type { MenuItem } from 'primevue/menuitem'
import Tag from 'primevue/tag'
import { onScopeDispose, ref, shallowRef } from 'vue'
import { statusSeverity, type PresentationContext } from '../presentation/context'
import { titleOf, type Cursor, type ItemSummary, type QueryPage, type WorkOperation } from '../presentation/query'

import { workFailure } from '../work/errors'
import type { SprintChoice, SprintChoices } from './sprints'

const props = defineProps<{
  page: QueryPage
  pageIndex: number
  context: PresentationContext
  writable: boolean
  canEdit: boolean
  planning: boolean
  fetching: boolean
  pendingIds: ReadonlySet<string>
  person: (item: ItemSummary) => string | undefined
  sprints: (item: string, after?: Cursor) => Promise<SprintChoices>
}>()
const emit = defineEmits<{
  open: [item: string], page: [direction: -1 | 1], edit: [item: ItemSummary], apply: [operations: WorkOperation[]],
}>()
const menu = ref<InstanceType<typeof Menu>>()
const actions = shallowRef<MenuItem[]>([])
const viewport = ref<HTMLElement>()
let menuRequest = 0
onScopeDispose(() => { menuRequest++ })

function status(item: ItemSummary) {
  return typeof item.state === 'string' ? item.state : Object.values(item.state).join(', ')
}
function actionMenu(event: MouseEvent, item: ItemSummary) {
  const request = ++menuRequest
  const edit: MenuItem[] = props.canEdit ? [{ label: 'Edit fields', command: () => emit('edit', item) }] : []
  actions.value = props.planning ? [...edit, { label: 'Checking eligible sprints…', disabled: true }] : edit
  menu.value?.toggle(event)
  if (props.planning) void load()
  async function load(after?: Cursor, existing: SprintChoice[] = []) {
    try {
      const result = await props.sprints(item.id, after)
      if (request !== menuRequest) return
      const choices = [...existing, ...result.choices]
      actions.value = [
        ...edit,
        ...choices.map(choice => ({
          label: 'Move to ' + choice.label,
          disabled: !choice.operation,
          command: () => { if (choice.operation) emit('apply', [choice.operation]) },
        })),
        ...(!choices.length ? [{ label: 'No eligible sprints', disabled: true }] : []),
        ...(result.after ? [{ label: 'Load more sprints', command: (menuEvent: { originalEvent: Event }) => {
          menuEvent.originalEvent.preventDefault()
          void load(result.after, choices)
        } }] : []),
      ]
    } catch (error) {
      if (request === menuRequest) actions.value = [...edit, { label: workFailure(error).message, disabled: true }]
    }
  }
}
function restore(item: string) {
  const button = viewport.value?.querySelector<HTMLElement>('[data-backlog-id="' + CSS.escape(item) + '"] button')
  if (button) button.focus()
  else viewport.value?.focus()
}
defineExpose({ restore })
</script>

<template>
  <section ref="viewport" class="kanban-backlog kx-focus-outline" aria-label="Backlog" tabindex="-1" :aria-busy="fetching">
    <DataTable :value="page.items" data-key="id" size="small" class="kanban-backlog-table"
      :pt="{ table: { 'aria-label': 'Backlog issues' } }">
      <template #empty><slot name="empty">No issues in the backlog.</slot></template>
      <Column header="Issue">
        <template #body="{ data }">
          <div class="kanban-backlog-issue" :data-backlog-id="data.id">
            <Button class="kanban-backlog-title" text size="small" severity="secondary"
              :aria-label="data.key + ' ' + titleOf(data)" @click="emit('open', data.id)">
              <span class="kanban-backlog-key">{{ data.key }}</span>
              <span class="kanban-backlog-summary" dir="auto">{{ titleOf(data) }}</span>
            </Button>
          </div>
        </template>
      </Column>
      <Column header="Status" header-class="kanban-backlog-status" body-class="kanban-backlog-status">
        <template #body="{ data }">
          <Tag class="kx-tag-sm" :value="context.statusLabels[status(data)] ?? status(data)"
            :severity="statusSeverity(context.statuses.find(state => state.id === status(data)))" />
        </template>
      </Column>
      <Column header="Priority" header-class="kanban-backlog-secondary" body-class="kanban-backlog-secondary">
        <template #body="{ data }">
          <Tag v-if="data.values.priority" class="kx-tag-sm"
            :severity="data.values.priority === 'highest' ? 'danger' : data.values.priority === 'high' ? 'warn' : 'secondary'"
            :value="context.priorityLabels[data.values.priority] ?? data.values.priority" />
        </template>
      </Column>
      <Column header="Assignee" header-class="kanban-backlog-secondary" body-class="kanban-backlog-secondary">
        <template #body="{ data }">{{ person(data) ?? '—' }}</template>
      </Column>
      <Column header="Points" header-class="kanban-backlog-secondary" body-class="kanban-backlog-secondary">
        <template #body="{ data }">{{ data.values.story_points ?? '—' }}</template>
      </Column>
      <Column v-if="writable && (canEdit || planning)" header-class="kanban-backlog-actions" body-class="kanban-backlog-actions">
        <template #header><span class="kanban-visually-hidden">Actions</span></template>
        <template #body="{ data }">
          <Button :aria-label="'Actions for ' + data.key" text size="small" severity="secondary"
            :disabled="pendingIds.has(data.id)" @click="actionMenu($event, data)">
            <template #icon><Icon icon="tabler:dots" /></template>
          </Button>
        </template>
      </Column>
    </DataTable>
    <div v-if="page.after || pageIndex" class="kanban-backlog-pager">
      <Button label="Previous" text size="small" severity="secondary" :disabled="!pageIndex || fetching" @click="emit('page', -1)" />
      <span aria-current="page">Page {{ pageIndex + 1 }}</span>
      <Button label="Next" text size="small" severity="secondary" :disabled="!page.after || fetching" @click="emit('page', 1)" />
    </div>
    <Menu ref="menu" :model="actions" popup />
  </section>
</template>
