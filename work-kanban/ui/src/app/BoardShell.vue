<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import SystemTabs from '@kickside/ui-kit/SystemTabs.vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import Select from 'primevue/select'
import { computed, ref } from 'vue'
import { tabs, type KanbanTab } from '../route'
import type { BoardOption } from '../work/types'

const props = defineProps<{
  boards: BoardOption[]
  active?: BoardOption
  tab?: KanbanTab
  tabs: KanbanTab[]
  hasMore: boolean
  paging: boolean
  pageError?: string
  issueOpen: boolean
}>()
const emit = defineEmits<{
  select: [board: string], loadMore: [], create: [], copy: [kind: 'board' | 'issue'], tab: [tab: KanbanTab]
}>()
const picker = ref<InstanceType<typeof Select>>()
const menu = ref<InstanceType<typeof Menu>>()
const tabLabels = { board: 'Board', backlog: 'Backlog', sprints: 'Sprints', search: 'Search' }
const actions = computed(() => [
  { label: 'Copy board link', command: () => emit('copy', 'board') },
  ...(props.issueOpen ? [{ label: 'Copy issue link', command: () => emit('copy', 'issue') }] : []),
])

function create() {
  picker.value?.hide()
  emit('create')
}

function changeTab(value: string) {
  const tab = tabs.find(candidate => candidate === value)
  if (tab) emit('tab', tab)
}
</script>

<template>
  <header class="kanban-toolbar">
    <div class="kanban-board-tools">
      <Select
        ref="picker" append-to="self" class="kanban-board-picker" filter
        :pt="{ pcFilter: { root: { 'aria-label': 'Search boards' } } }" filter-placeholder="Search boards"
        :model-value="active?.board_id" :options="boards" option-label="title" option-value="board_id"
        placeholder="Select a board" aria-label="Board switcher"
        empty-message="No boards" empty-filter-message="No matching boards on loaded pages"
        @update:model-value="value => typeof value === 'string' && emit('select', value)"
      >
        <template #footer>
          <div class="kanban-board-picker-actions">
            <small v-if="pageError" role="alert">{{ pageError }}</small>
            <Button
              v-if="hasMore" type="button" size="small" text :loading="paging"
              :label="pageError ? 'Retry loading boards' : 'Load more boards'" @click.stop="emit('loadMore')"
            />
            <Button type="button" size="small" text label="New board" @click.stop="create">
              <template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template>
            </Button>
          </div>
        </template>
      </Select>
      <Button v-if="active" type="button" text severity="secondary" aria-label="Board actions" @click="menu?.toggle($event)">
        <template #icon><Icon icon="tabler:dots" aria-hidden="true" /></template>
      </Button>
      <Menu ref="menu" popup append-to="self" :model="actions" />
    </div>
    <SystemTabs
      v-if="active" class="kanban-tabs" :value="tab ?? ''" label="Work views"
      :items="props.tabs.map(value => ({ value, label: tabLabels[value] }))"
      @update:value="changeTab"
    />
    <div v-if="active?.access.write" class="kanban-create-issue"><slot name="create-issue" /></div>
  </header>
</template>
