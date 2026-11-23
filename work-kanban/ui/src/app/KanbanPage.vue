<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { subscribeComponentMeta } from '@kickside/ui-kit/componentRealtime'
import { api, on } from '@wippy-fe/proxy'
import { useEvents, useHostVisibilityRefresh, useProps } from '@wippy-fe/webcomponent-vue'
import Button from 'primevue/button'
import { computed, ref } from 'vue'
import { parseRoute, type Navigate } from '../route'
import { createWorkClient } from '../work/client'
import { workFailure } from '../work/errors'
import BoardShell from './BoardShell.vue'
import NewBoardDialog from './NewBoardDialog.vue'
import { usePage } from './usePage'

const props = useProps<{ route: string }>()
const emit = useEvents<{ navigate: Navigate }>()
const route = computed(() => parseRoute(props.value.route))
const work = createWorkClient(options => api.request(options))
const newBoard = ref(false)
const copyStatus = ref('')
const page = usePage(route, work, request => emit('navigate', request), (board, refresh) => {
  const stopMeta = subscribeComponentMeta(board, refresh)
  const stopReconnect = on('@reconnect', refresh)
  return () => { stopMeta?.(); stopReconnect() }
})
const { boards, board, schema, allowedTabs, loading, error, missing, hasMore, paging, pagingError } = page
const ready = computed(() => !!route.value && board.value?.board_id === route.value.board && !!schema.value)
const unavailableTab = computed(() => route.value && !allowedTabs.value.includes(route.value.tab) ? route.value.tab : undefined)
let revealed = false
useHostVisibilityRefresh(() => {
  if (revealed) void page.refresh(true)
  revealed = true
})

async function copy(kind: 'board' | 'issue') {
  const path = page.links()?.[kind]
  if (!path) return
  try {
    await navigator.clipboard.writeText(new URL(path, location.origin).href)
    copyStatus.value = kind === 'board' ? 'Board link copied.' : 'Issue link copied.'
  } catch {
    copyStatus.value = 'Could not copy the link.'
  }
}
</script>

<template>
  <section class="kanban-page" aria-label="Kanban">
    <BoardShell
      :boards="boards" :active="board" :tab="route?.tab" :tabs="allowedTabs"
      :has-more="hasMore" :paging="paging" :page-error="pagingError ? workFailure(pagingError).message : undefined"
      :issue-open="!!route?.issue"
      @select="page.select" @load-more="page.loadMore" @create="newBoard = true" @copy="copy" @tab="page.openTab"
    >
      <template v-if="ready && board?.access.write" #create-issue><slot name="create-issue" /></template>
    </BoardShell>
    <div v-if="copyStatus" class="kanban-copy-status" role="status">{{ copyStatus }}</div>
    <div v-if="error" class="kanban-notice kx-notice error" role="alert">
      {{ workFailure(error).message }}
      <Button label="Retry" text size="small" @click="page.refresh(true)" />
    </div>
    <div v-if="!route" class="kanban-notice" role="status">This Kanban link is not valid.</div>
    <div v-else-if="missing" class="kanban-notice" role="status">This board is no longer available in Kanban.</div>
    <div v-else-if="!ready && loading" class="kanban-notice" role="status">Loading boards…</div>
    <div v-else-if="board && !schema && !error" class="kanban-notice" role="status">
      Work has not finished setting up this board.
      <Button label="Retry" text size="small" @click="page.refresh(true)" />
    </div>
    <div v-else-if="!board && !error" class="kanban-notice" role="status">No Kanban boards are available.</div>
    <div v-else-if="ready && unavailableTab" class="kanban-notice" role="status">
      {{ unavailableTab === 'sprints' ? 'Sprints' : 'Search' }} is not enabled for this board.
    </div>
    <slot
      v-else-if="ready && route && board && schema" :key="board.board_id"
      :board="board" :schema="schema" :route="route" :work="work"
      :open-issue="page.openIssue" :close-issue="page.closeIssue"
    />
    <NewBoardDialog v-model:visible="newBoard" :work="work" @created="page.created" />
  </section>
</template>
