<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { api } from '@wippy-fe/proxy'
import { useEvents, useHostVisibilityRefresh, useProps } from '@wippy-fe/webcomponent-vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import { computed, nextTick, ref, shallowRef, watch } from 'vue'
import { BoardPluginPanel, CreateIssue, FieldControl, IssueDrawer, usePrincipalNames } from '../issue'
import { title } from '../issue/model'
import type { Issue } from '../issue/types'
import { createCoordinator } from '../live/coordinator'
import { subscribeBoard } from '../live/subscribe'
import { checkPlacements, DrawerExtensions, KanbanViews, type ItemDetail, type MovePlan } from '../presentation'
import { parseRoute, type Navigate } from '../route'
import { createWorkClient, isAccessLoss } from '../work/client'
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
const compact = ref(false)
const filterHost = ref<HTMLElement>()
const views = ref<InstanceType<typeof KanbanViews>>()
const drawer = ref<InstanceType<typeof IssueDrawer>>()
const plugin = ref<InstanceType<typeof BoardPluginPanel>>()
const sequence = ref<number>()
const move = shallowRef<{ item: string; plan: MovePlan }>()
const plannedMove = computed(() => move.value?.item === route.value?.issue ? move.value?.plan : undefined)
let live: ReturnType<typeof createCoordinator> | undefined

const page = usePage(route, work, request => emit('navigate', request), (id, revalidate) => {
  const coordinator = createCoordinator(async request => {
    if (request.revalidate) {
      await revalidate()
      await nextTick()
    }
    if (live !== coordinator || !ready.value) return
    const minSeq = Math.max(sequence.value ?? 0, request.minSeq ?? 0,
      request.revalidate ? schema.value?.as_of ?? 0 : 0) || undefined
    if (request.revalidate && sequence.value === minSeq) void drawer.value?.refresh(minSeq)
    sequence.value = minSeq
    await views.value?.refresh({ ...request, minSeq })
  })
  live = coordinator
  const stop = subscribeBoard(id, coordinator, () => schema.value && board.value?.board_id === id
    ? { generation: schema.value.generation, title: board.value.title }
    : undefined)
  return () => {
    stop()
    coordinator.stop()
    if (live === coordinator) {
      live = undefined
      sequence.value = undefined
      move.value = undefined
    }
  }
})
const { boards, board, schema, allowedTabs, loading, error, missing, hasMore, paging, pagingError } = page
const ready = computed(() => !!route.value && board.value?.board_id === route.value.board && !!schema.value)
const unavailableTab = computed(() => route.value && !allowedTabs.value.includes(route.value.tab) ? route.value.tab : undefined)
const placements = computed(() => board.value ? checkPlacements(schema.value?.extensions, board.value.access) : [])
const panel = computed(() => placements.value.find(entry => entry.slot === 'board_panel' && entry.target === 'board:' + route.value?.tab))
watch(() => route.value?.issue, item => {
  if (item !== move.value?.item) move.value = undefined
})
let revealed = false
useHostVisibilityRefresh(() => {
  if (revealed) {
    if (live) invalidate(undefined, true)
    else void page.refresh(true)
  }
  revealed = true
})

function invalidate(seq?: number, revalidate = false) {
  live?.invalidate(seq, revalidate)
}
function refresh() {
  if (live) invalidate(undefined, true)
  else void page.refresh(true)
  void plugin.value?.refresh()
}
function denied(problem: unknown) {
  if (isAccessLoss(problem)) invalidate(undefined, true)
}
function openMove({ detail, plan }: { detail: ItemDetail; plan: MovePlan }) {
  move.value = { item: detail.item.id, plan }
  page.openIssue(detail.item.id)
}
function drawerSummary(issue: Issue) {
  const { id, key, type, state, version } = issue
  return { id, key, type, state, version, values: { title: title(issue) } }
}
function createdIssue(id: string, seq?: number) {
  invalidate(seq)
  page.openIssue(id)
}

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
      :issue-open="!!route?.issue" :compact="compact" :refreshing="loading"
      @select="page.select" @load-more="page.loadMore" @create="newBoard = true" @copy="copy" @tab="page.openTab"
      @density="compact = !compact" @refresh="refresh"
    >
      <template v-if="ready && (route?.tab === 'board' || route?.tab === 'backlog')" #filters>
        <div ref="filterHost" />
      </template>
      <template v-if="ready && board && schema && board.access.write" #create-issue>
        <CreateIssue :key="board.board_id" :board="board" :schema="schema" :work="work" @created="createdIssue" @denied="denied" />
      </template>
    </BoardShell>
    <div v-if="copyStatus" class="kanban-copy-status" role="status">{{ copyStatus }}</div>
    <div v-if="error" class="kanban-notice kx-notice error" role="alert">
      <Icon icon="tabler:alert-circle" aria-hidden="true" />
      <span>{{ workFailure(error).message }}</span>
      <Button label="Retry" text size="small" @click="live ? refresh() : page.refresh(true)" />
    </div>
    <div v-if="!route" class="kanban-notice" role="status">This Kanban link is not valid.</div>
    <div v-else-if="missing" class="kanban-notice" role="status">This board is no longer available in Kanban.</div>
    <div v-else-if="!ready && loading" class="kanban-notice kx-loading" role="status">
      <Icon icon="tabler:loader-2" aria-hidden="true" /> Loading boards…
    </div>
    <div v-else-if="board && !schema && !error" class="kanban-notice" role="status">
      Work has not finished setting up this board.
      <Button label="Retry" text size="small" @click="page.refresh(true)" />
    </div>
    <div v-else-if="!board && !error" class="kx-empty" role="status">
      <span class="kx-empty-ico"><Icon icon="tabler:layout-kanban" aria-hidden="true" /></span>
      <p class="kx-empty-title">No Kanban boards are available.</p>
    </div>
    <template v-else-if="ready && route && board && schema">
      <KanbanViews ref="views" :key="board.board_id" :board="board" :schema="schema" :route="route" :work="work"
        :field-control="FieldControl" :use-principal-names="usePrincipalNames" :invalidate="invalidate"
        :compact="compact" :filter-host="filterHost"
        @open-issue="page.openIssue" @move-form="openMove" />
      <div v-if="unavailableTab" class="kanban-notice" role="status">
        {{ unavailableTab === 'sprints' ? 'Sprints' : 'Search' }} is not enabled for this board.
      </div>
      <BoardPluginPanel v-else-if="route.tab === 'sprints' || route.tab === 'search'" ref="plugin" :key="board.board_id + ':' + route.tab"
        :role="route.tab" :board="board" :schema="schema" :work="work" :sequence="sequence" :placement="panel"
        @open="page.openIssue" @changed="invalidate" @denied="denied" />
      <IssueDrawer v-if="!unavailableTab" ref="drawer" :key="board.board_id" :board="board" :schema="schema"
        :work="work" :issue="route.issue" :sequence="sequence" :planned-move="plannedMove"
        @close="page.closeIssue" @open="page.openIssue" @changed="invalidate" @denied="denied" @copy="copy('issue')"
        @move-finished="move = undefined">
        <template #extensions="{ issue }">
          <DrawerExtensions :board="board.board_id" :item="drawerSummary(issue)" :placements="placements" />
        </template>
      </IssueDrawer>
    </template>
    <NewBoardDialog v-model:visible="newBoard" :work="work" @created="page.created" />
  </section>
</template>
