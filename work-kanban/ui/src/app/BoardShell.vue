<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import SystemTabs from '@kickside/ui-kit/SystemTabs.vue'
import Button from 'primevue/button'
import Select from 'primevue/select'
import { computed, ref, watch } from 'vue'
import { tabs, type KanbanTab } from '../route'
import type { BoardOption } from '../work/types'

const props = defineProps<{
  boards: BoardOption[]
  active?: BoardOption
  summary?: string
  tab?: KanbanTab
  tabs: KanbanTab[]
  panel: string
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
const showRefresh = ref(false)
watch(() => props.refreshing, (refreshing, _, cleanup) => {
  showRefresh.value = false
  if (!refreshing) return
  const timer = setTimeout(() => { showRefresh.value = true }, 200)
  cleanup(() => clearTimeout(timer))
}, { immediate: true })
const description = computed(() => props.summary ?? 'Track issues and plan sprints.')
const tabLabels = { board: 'Board', backlog: 'Backlog', sprints: 'Sprints', search: 'Search' }
const pickerParts = {
  label: { class: 'kanban-picker-title' },
  pcFilter: { root: { 'aria-label': 'Search boards' } },
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
  <div class="kanban-chrome">
    <header class="kx-head kanban-head">
      <div class="kx-head-icon"><Icon icon="tabler:layout-kanban" aria-hidden="true" /></div>
      <div class="kx-head-text">
        <h1 class="kanban-visually-hidden">Kanban</h1>
        <Select
          ref="picker" append-to="self" class="kanban-board-picker" filter
          :pt="pickerParts" filter-placeholder="Search boards"
          :model-value="active?.board_id" :options="boards" option-label="title" option-value="board_id"
          placeholder="Select a board" aria-label="Board switcher" :title="active?.title"
          empty-message="No boards" empty-filter-message="No matching boards on loaded pages"
          @update:model-value="value => typeof value === 'string' && emit('select', value)"
        >
          <template #dropdownicon><Icon icon="tabler:selector" aria-hidden="true" /></template>
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
        <p class="kx-head-sub" :title="description">{{ description }}</p>
      </div>
      <div class="kx-head-actions kanban-actions">
        <Button v-if="active && tab === 'board'" class="kanban-icon-action" type="button" text severity="secondary"
          aria-label="Compact card density" :aria-pressed="compact" :title="compact ? 'Show standard cards' : 'Show compact cards'"
          @click="emit('density')">
          <template #icon="{ class: iconClass }">
            <Icon :icon="compact ? 'tabler:layout-list' : 'tabler:layout-rows'" :class="iconClass" aria-hidden="true" />
          </template>
        </Button>
        <slot name="filters" />
        <Button v-if="active" type="button" text severity="secondary" class="kanban-icon-action"
          aria-label="Refresh issues" title="Refresh issues" :loading="showRefresh" :disabled="refreshing" @click="emit('refresh')">
          <template #icon="{ class: iconClass }"><Icon icon="tabler:refresh" :class="iconClass" aria-hidden="true" /></template>
        </Button>
        <slot name="create-issue" />
      </div>
    </header>
    <SystemTabs
      class="kanban-tabs" :value="tab ?? ''" label="Work views"
      :items="props.tabs.map(value => ({ value, label: tabLabels[value], controls: panel }))"
      @update:value="changeTab"
    />
  </div>
</template>
