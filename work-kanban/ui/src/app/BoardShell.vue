<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import SystemTabs from '@kickside/ui-kit/SystemTabs.vue'
import Button from 'primevue/button'
import Select from 'primevue/select'
import { ref } from 'vue'
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
  compact: boolean
  refreshing: boolean
}>()
const emit = defineEmits<{
  select: [board: string], loadMore: [], create: [], copy: [kind: 'board' | 'issue'], tab: [tab: KanbanTab],
  density: [], refresh: [],
}>()
const picker = ref<InstanceType<typeof Select>>()
const tabLabels = { board: 'Board', backlog: 'Backlog', sprints: 'Sprints', search: 'Search' }
const pickerParts = {
  root: { style: {
    background: 'var(--kanban-picker-background, transparent)',
    borderColor: 'var(--kanban-picker-border, transparent)',
    boxShadow: 'var(--kanban-picker-shadow, none)',
  } },
  pcFilter: { root: { 'aria-label': 'Search boards' } },
  label: { class: 'kanban-picker-title' },
  dropdown: { class: 'kanban-picker-chevron' },
  overlay: { class: 'kanban-picker-overlay' },
  listContainer: { class: 'kanban-picker-list' },
}

function create() {
  picker.value?.hide()
  emit('create')
}
function copy(kind: 'board' | 'issue') {
  picker.value?.hide()
  emit('copy', kind)
}

function changeTab(value: string) {
  const tab = tabs.find(candidate => candidate === value)
  if (tab) emit('tab', tab)
}
</script>

<template>
  <header class="kanban-toolbar">
    <div class="kanban-board-context">
      <Select
        ref="picker" append-to="self" class="kanban-board-picker" filter
        :pt="pickerParts" filter-placeholder="Search boards"
        :model-value="active?.board_id" :options="boards" option-label="title" option-value="board_id"
        placeholder="Select a board" aria-label="Board switcher" :title="active?.title"
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
            <Button v-if="active" type="button" size="small" text severity="secondary" label="Copy board link" @click.stop="copy('board')">
              <template #icon><Icon icon="tabler:link" aria-hidden="true" /></template>
            </Button>
            <Button v-if="issueOpen" type="button" size="small" text severity="secondary" label="Copy issue link" @click.stop="copy('issue')">
              <template #icon><Icon icon="tabler:link" aria-hidden="true" /></template>
            </Button>
          </div>
        </template>
      </Select>
    </div>
    <div v-if="active" class="kanban-toolbar-secondary">
      <SystemTabs
        class="kanban-tabs" :value="tab ?? ''" label="Work views"
        :items="props.tabs.map(value => ({ value, label: tabLabels[value] }))"
        @update:value="changeTab"
      />
      <div class="kanban-toolbar-controls">
        <slot name="filters" />
        <Button v-if="tab === 'board'" class="kanban-toolbar-action kanban-icon-action" type="button" text rounded severity="secondary"
          aria-label="Compact card density" :aria-pressed="compact" :title="compact ? 'Show standard cards' : 'Show compact cards'"
          @click="emit('density')">
          <template #icon><Icon :icon="compact ? 'tabler:layout-rows' : 'tabler:align-justified'" aria-hidden="true" /></template>
        </Button>
      </div>
    </div>
    <div v-if="active" class="kanban-toolbar-controls kanban-toolbar-actions">
      <Button class="kanban-toolbar-action kanban-icon-action" type="button" text rounded severity="secondary"
        aria-label="Refresh issues" title="Refresh issues" :loading="refreshing" @click="emit('refresh')">
        <template #icon><Icon icon="tabler:refresh" aria-hidden="true" /></template>
      </Button>
      <slot name="create-issue" />
    </div>
  </header>
</template>
