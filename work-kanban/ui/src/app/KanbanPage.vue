<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { api } from '@wippy-fe/proxy'
import { useEvents, useHostVisibilityRefresh, useProps } from '@wippy-fe/webcomponent-vue'
import { Icon } from '@iconify/vue'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import Button from 'primevue/button'
import { computed, defineAsyncComponent, nextTick, onScopeDispose, ref, shallowRef, useId, watch } from 'vue'
import { title } from '../issue/model'
import { usePrincipalNames } from '../issue/principals'
import type { Issue } from '../issue/types'
import { provideMarkdown } from '../issue/markdownContext'
import { readIssue } from '../issue/work'
import { createCoordinator } from '../live/coordinator'
import { subscribeBoard } from '../live/subscribe'
import BoardPluginPanel from '../planning/BoardPluginPanel.vue'
import { checkPlacements, DrawerExtensions, KanbanViews, type ItemDetail, type MovePlan } from '../presentation'
import type { ItemSummary } from '../presentation/query'
import { routeInSurface, type KanbanRoute, type Navigate } from '../route'
import { createWorkClient, isAccessLoss } from '../work/client'
import { workFailure } from '../work/errors'
import GlyphSprite from '../presentation/GlyphSprite.vue'
import BoardShell from './BoardShell.vue'
import KanbanSkeleton from './KanbanSkeleton.vue'
import { usePage } from './usePage'

const CreateIssue = defineAsyncComponent(() => import('../create/CreateIssue.vue'))
const FieldControl = defineAsyncComponent(() => import('../issue/FieldControl.vue'))
const loadIssueDrawer = () => import('../issue/IssueDrawer.vue')
const IssueDrawer = defineAsyncComponent(loadIssueDrawer)
const NewBoardDialog = defineAsyncComponent(() => import('./NewBoardDialog.vue'))
const props = useProps<{ route: string }>()
const tabPanel = useId()
const emit = useEvents<{ navigate: Navigate }>()
const pendingPath = ref<string>()
const route = computed<KanbanRoute | undefined>(previous => {
  const next = routeInSurface(pendingPath.value ?? props.value.route, previous)
  return next?.board === previous?.board && next?.tab === previous?.tab && next?.issue === previous?.issue
    ? previous : next
})
watch(() => props.value.route, () => { pendingPath.value = undefined }, { flush: 'sync' })

function navigate(request: Navigate) {
  const next = routeInSurface(request.path, route.value)
  if (next?.board && (next.board === route.value?.board || next.board === board.value?.board_id)) pendingPath.value = request.path
  emit('navigate', request)
}
const work = createWorkClient(options => api.request(options))
const newBoard = ref(false)
const newBoardOpened = ref(false)
const creatingIssue = ref(false)
const createBoardId = ref<string>()
const copyStatus = ref('')
const compact = ref(false)
const fullIssue = ref(false)
const surface = ref<HTMLElement>()
const body = ref<HTMLElement>()
const main = ref<HTMLElement>()
const filterHost = ref<HTMLElement>()
const views = ref<InstanceType<typeof KanbanViews>>()
const drawer = ref<InstanceType<typeof IssueDrawer>>()
const openIssueState = computed(() => {
  const item = drawer.value?.openedItem
  return item?.id === route.value?.issue ? item?.state : undefined
})
const plugin = ref<InstanceType<typeof BoardPluginPanel>>()
const sequence = ref<number>()
const move = shallowRef<{ item: string; plan: MovePlan }>()
const plannedMove = computed(() => move.value?.item === route.value?.issue ? move.value?.plan : undefined)
let live: ReturnType<typeof createCoordinator> | undefined

const page = usePage(route, work, navigate, (id, revalidate) => {
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
const { boards, board, schema, firstView, readView, allowedTabs, loading, error, missing, hasMore, paging, pagingError } = page
const ready = computed(() => !!route.value && board.value?.board_id === route.value.board && !!schema.value)
const unavailableTab = computed(() => route.value && !allowedTabs.value.includes(route.value.tab) ? route.value.tab : undefined)
const primedDrawer = ref<string>()
const drawerBoardId = computed(() => ready.value && (route.value?.issue || primedDrawer.value === board.value?.board_id)
  ? board.value?.board_id : undefined)
const openedSummary = shallowRef<{ board: string; item: ItemSummary; assignee?: string }>()
const issueSummary = computed(() => openedSummary.value?.board === route.value?.board
  && openedSummary.value?.item.id === route.value?.issue ? openedSummary.value : undefined)
let issueRead: { board: string, issue: string, writable: boolean, sequence?: number, result: ReturnType<typeof readIssue> } | undefined
let prefetchTimer: ReturnType<typeof setTimeout> | undefined
function cancelPrefetch() {
  clearTimeout(prefetchTimer)
  prefetchTimer = undefined
}
function prefetchIssue(item: string) {
  cancelPrefetch()
  if (route.value?.issue) return
  const target = board.value?.board_id
  void loadIssueDrawer().catch(() => {})
  prefetchTimer = setTimeout(() => prepareIssue(item, target), 80)
}
onScopeDispose(cancelPrefetch)
watch(() => route.value?.tab, cancelPrefetch)
function prepareIssue(item: string, target = board.value?.board_id) {
  if (!target || target !== board.value?.board_id) return
  const writable = board.value.access.write
  if (issueRead?.board === target && issueRead.issue === item
      && issueRead.writable === writable && issueRead.sequence === sequence.value) return
  const result = readIssue(work, target, item, writable, sequence.value)
  const read = { board: target, issue: item, writable, sequence: sequence.value, result }
  issueRead = read
  void result.catch(() => { if (issueRead === read) issueRead = undefined })
}
function initialIssue(target: string, item: string, writable: boolean, minSeq?: number) {
  const read = issueRead
  if (read?.board === target && read.issue === item && read.writable === writable && read.sequence === minSeq) {
    return read.result
  }
}
function openIssue(item: string, target?: string) {
  cancelPrefetch()
  prepareIssue(item, target)
  page.openIssue(item, target)
}
function openSummary(item: ItemSummary, assignee?: string) {
  if (board.value) openedSummary.value = { board: board.value.board_id, item, assignee }
  openIssue(item.id)
}
watch([drawerBoardId, () => route.value?.issue], ([target, item]) => {
  if (target && item) prepareIssue(item, target)
  else {
    cancelPrefetch()
    openedSummary.value = undefined
  }
}, { flush: 'sync' })
watch(() => board.value?.board_id, () => { issueRead = undefined })
watch(() => ready.value && board.value?.board_id, (target, _, cleanup) => {
  if (!target) return
  const window = main.value?.ownerDocument.defaultView
  if (!window?.requestIdleCallback) return
  let id = 0
  let active = true
  const paint = window.requestAnimationFrame(() => {
    id = window.requestIdleCallback(() => {
      void loadIssueDrawer().then(() => { if (active) primedDrawer.value = target }, () => {})
    }, { timeout: 600 })
  })
  cleanup(() => {
    active = false
    window.cancelAnimationFrame(paint)
    window.cancelIdleCallback(id)
  })
})
const issueKeys = new Map<string, Promise<string>>()
watch(() => board.value?.board_id, () => issueKeys.clear())
provideMarkdown({
  board: computed(() => board.value?.board_id), schema,
  resolve(key) {
    const target = board.value?.board_id
    if (!target) return Promise.reject(new Error('No board is open.'))
    let request = issueKeys.get(key)
    if (!request) {
      request = work.boardRead<{ item: { id: string } }>(target, 'get', { item: { key } }).then(detail => detail.item.id)
      request.catch(() => issueKeys.delete(key))
      issueKeys.set(key, request)
    }
    return request
  },
})
const placements = computed(() => board.value ? checkPlacements(schema.value?.extensions, board.value.access) : [])
const panel = computed(() => placements.value.find(entry => entry.slot === 'board_panel' && entry.target === 'board:' + route.value?.tab))
watch(route, () => {
  fullIssue.value = false
  copyStatus.value = ''
})
watch(() => route.value?.issue, item => {
  if (item !== move.value?.item) move.value = undefined
})
let issueOpener: HTMLElement | undefined
watch(() => route.value?.issue, (item, previous) => {
  if (item && !previous) {
    const root = main.value?.getRootNode()
    const focused = root instanceof ShadowRoot || root instanceof Document ? root.activeElement : undefined
    if (focused instanceof HTMLElement && main.value?.contains(focused)) issueOpener = focused
  } else if (!item) {
    const opener = issueOpener
    issueOpener = undefined
    void nextTick(() => { if (opener?.isConnected) opener.focus({ preventScroll: true }) })
  }
}, { flush: 'sync' })
watch(() => board.value?.board_id, () => {
  creatingIssue.value = false
  createBoardId.value = undefined
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
  openSummary(detail.item)
}
function drawerSummary(issue: Issue) {
  const { id, key, type, state, version } = issue
  return { id, key, type, state, version, values: { title: title(issue) } }
}
function createdIssue(id: string, seq?: number) {
  invalidate(seq)
  openIssue(id)
}
function openCreate() {
  createBoardId.value = board.value?.board_id
  creatingIssue.value = true
}
function openNewBoard() {
  newBoardOpened.value = true
  newBoard.value = true
}

async function copy(kind: 'board' | 'issue') {
  const path = page.links()?.[kind]
  if (!path) return
  try {
    await navigator.clipboard.writeText(new URL(path, document.baseURI).href)
    copyStatus.value = kind === 'board' ? 'Board link copied.' : 'Issue link copied.'
  } catch {
    copyStatus.value = 'Could not copy the link.'
  }
}
</script>

<template>
  <section ref="surface" class="kanban-page" aria-label="Kanban" :data-issue-full="fullIssue" :data-issue-open="!!(drawer && route?.issue)">
    <BoardShell
      :boards="boards" :active="board" :summary="views?.boardSummary" :tab="route?.tab" :tabs="allowedTabs" :panel="tabPanel"
      :has-more="hasMore" :paging="paging" :page-error="pagingError ? workFailure(pagingError).message : undefined"
      :issue-open="!!route?.issue" :compact="compact" :refreshing="loading"
      @select="page.select" @load-more="page.loadMore" @create="openNewBoard" @copy="copy" @tab="page.openTab"
      @density="compact = !compact" @refresh="refresh"
    >
      <template v-if="ready && (route?.tab === 'board' || route?.tab === 'backlog')" #filters>
        <div ref="filterHost" class="kanban-filter-host" />
      </template>
      <template v-if="ready && board && schema && board.access.write" #create-issue>
        <Button type="button" label="Create issue" @click="openCreate">
          <template #icon="{ class: iconClass }"><Icon icon="tabler:plus" :class="iconClass" aria-hidden="true" /></template>
        </Button>
        <CreateIssue v-if="createBoardId === board.board_id" v-model:visible="creatingIssue" :key="board.board_id"
          :board="board" :schema="schema" :work="work" @created="createdIssue" @denied="denied" />
      </template>
    </BoardShell>
    <div ref="body" class="kanban-body">
      <div ref="main" class="kanban-main" :inert="fullIssue || undefined">
        <div :id="tabPanel" class="kanban-content" role="tabpanel" :aria-label="route?.tab ?? 'Board'">
          <div v-if="copyStatus && !route?.issue" class="kanban-copy-status" role="status">{{ copyStatus }}</div>
          <div v-if="error" class="kanban-notice kx-notice error" role="alert">
            <Icon icon="tabler:alert-circle" aria-hidden="true" />
            <span>{{ workFailure(error).message }}</span>
            <Button label="Retry" text size="small" @click="live ? refresh() : page.refresh(true)" />
          </div>
          <div v-if="!route" class="kanban-notice" role="status">This Kanban link is not valid.</div>
          <div v-else-if="missing" class="kanban-notice" role="status">This board is no longer available in Kanban.</div>
          <div v-else-if="!ready && loading" class="kanban-views">
            <KanbanSkeleton :variant="route.tab === 'board' ? 'board' : 'rows'" label="Loading boards…" :compact="compact" />
          </div>
          <div v-else-if="board && !schema && !error" class="kanban-notice" role="status">
            Work has not finished setting up this board.
            <Button label="Retry" text size="small" @click="page.refresh(true)" />
          </div>
          <EmptyState v-else-if="!board && !error" role="status" icon="tabler:layout-kanban"
            title="No Kanban boards are available." cta="New board" cta-icon="tabler:plus" @cta="openNewBoard" />
          <template v-else-if="ready && route && board && schema">
            <KeepAlive :max="3">
              <KanbanViews ref="views" :key="board.board_id" :board="board" :schema="schema" :route="route" :work="work"
                :first-view="firstView" :read-view="readView" :sequence="sequence"
                :field-control="FieldControl" :use-principal-names="usePrincipalNames" :invalidate="invalidate"
                :compact="compact" :filter-host="filterHost" :open-issue-state="openIssueState"
                @open-issue="openSummary" @move-form="openMove"
                @prefetch-issue="prefetchIssue" @cancel-prefetch="cancelPrefetch" />
            </KeepAlive>
            <div v-if="unavailableTab" class="kanban-notice" role="status">
              {{ unavailableTab === 'sprints' ? 'Sprints' : 'Search' }} is not enabled for this board.
            </div>
            <KeepAlive v-else :key="board.board_id" :max="2">
              <BoardPluginPanel v-if="route.tab === 'sprints' || route.tab === 'search'" ref="plugin" :key="route.tab"
                :role="route.tab" :board="board" :schema="schema" :work="work" :sequence="sequence" :placement="panel"
                @open="openIssue" @changed="invalidate" @denied="denied" />
            </KeepAlive>
          </template>
        </div>
      </div>
      <div v-if="route?.issue" class="kanban-visually-hidden" role="status">{{ copyStatus }}</div>
      <template v-if="ready && route && board && schema">
        <IssueDrawer v-if="drawerBoardId" ref="drawer" :key="drawerBoardId" :board="board" :schema="schema"
          :work="work" :surface="body" :initial-issue="initialIssue" :issue="route.issue"
          :summary-item="issueSummary?.item" :summary-assignee="issueSummary?.assignee" :sequence="sequence"
          :planned-move="plannedMove" :full-page="fullIssue" :copy-status="copyStatus"
          @close="page.closeIssue" @open="openIssue" @changed="invalidate" @denied="denied" @copy="copy('issue')"
          @move-finished="move = undefined" @full-page="fullIssue = $event">
          <template #extensions="{ issue }">
            <DrawerExtensions :board="board.board_id" :item="drawerSummary(issue)" :placements="placements" />
          </template>
        </IssueDrawer>
      </template>
    </div>
    <GlyphSprite />
    <NewBoardDialog v-if="newBoardOpened" v-model:visible="newBoard" :work="work" @created="page.created" />
  </section>
</template>
