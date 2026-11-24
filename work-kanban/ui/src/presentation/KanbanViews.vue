<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import Button from 'primevue/button'
import Select from 'primevue/select'
import { Icon } from '@iconify/vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { computed, defineAsyncComponent, nextTick, onActivated, onDeactivated, onScopeDispose, ref, shallowRef, watch, type Component } from 'vue'
import KanbanSkeleton from '../app/KanbanSkeleton.vue'
import { sprintChoices } from '../backlog/sprints'
import BoardViewport from '../board/BoardViewport.vue'
import { planMove, type MovePlan } from '../board/move'
import type { MoveResult } from '../board/useBoardMove'
import type { MoveIntent } from '../board/window'
import { checkPlacements } from '../extensions/placements'
import type { Issue } from '../issue/types'
import { createCoordinator } from '../live/coordinator'
import { subscribeBoard } from '../live/subscribe'
import type { KanbanRoute } from '../route'
import { isAccessLoss, planningPlugin, WorkError, type WorkClient } from '../work/client'
import { workFailure } from '../work/errors'
import type { BoardOption, BoardSchema } from '../work/types'
import { principalRef, statusSeverity, type PresentationContext } from './context'
import FilterBar, { type ActiveFilter } from './FilterBar.vue'
import { applyWork, command } from './mutation'
import { readItemDetail } from './query'
import type { Cursor, FirstViewRead, ItemDetail, ItemSummary, ViewReader, WorkCommand, WorkOperation } from './query'
import { usePages, type Swimlane } from './usePages'

const BacklogEditor = defineAsyncComponent(() => import('../backlog/BacklogEditor.vue'))
const BacklogTable = defineAsyncComponent(() => import('../backlog/BacklogTable.vue'))
const props = defineProps<{
  board: BoardOption
  schema: BoardSchema
  route: KanbanRoute
  work: WorkClient
  compact?: boolean
  filterHost?: HTMLElement
  openIssueState?: Issue['state']
  revalidate?: () => Promise<void>
  invalidate?: ReturnType<typeof createCoordinator>['invalidate']
  firstView?: FirstViewRead
  readView?: ViewReader
  sequence?: number
  fieldControl?: Component
  usePrincipalNames?: (values: () => ReturnType<typeof principalRef>[]) =>
    (value: ReturnType<typeof principalRef>) => string | undefined
}>()
const emit = defineEmits<{
  openIssue: [item: ItemSummary, assignee?: string]
  prefetchIssue: [item: string]
  cancelPrefetch: []
  moveForm: [draft: { detail: ItemDetail, plan: MovePlan }]
  accessLost: []
}>()
const activeFilters = shallowRef<ActiveFilter[]>([])
const tabFilters = new Map<KanbanRoute['tab'], ActiveFilter[]>()
const laneId = ref('')
const statusHost = ref<HTMLElement>()
const boardViewport = ref<InstanceType<typeof BoardViewport>>()
const backlogTable = ref<InstanceType<typeof BacklogTable>>()
const originatingItem = shallowRef<{ item: string, status?: string }>()
const pending = shallowRef<ReadonlySet<string>>(new Set())
const mutationError = shallowRef<unknown>()
const uncertain = shallowRef<WorkCommand>()
const editor = shallowRef<ItemSummary>()
const writable = computed(() => props.board.access.read && props.board.access.write)
const placements = computed(() => checkPlacements(props.schema.extensions, props.board.access))
const planning = computed(() => props.schema.plugins?.some(plugin => plugin.plugin === planningPlugin && plugin.active) === true)
const pages = usePages({
  board: () => props.board, schema: () => props.schema, tab: () => props.route.tab, work: props.work, firstView: props.firstView,
  readView: () => props.readView,
  accessLost: () => {
    editor.value = undefined
    uncertain.value = undefined
    emit('accessLost')
    invalidate(undefined, true)
  },
})
const { context, lanes, backlog, backlogIndex, error, fetching, paging, subgroupLimited } = pages
const lane = computed(() => lanes.value.find(lane => lane.id === laneId.value) ?? lanes.value[0])
const boardPresentation = computed<{
  generation: number; lane: Swimlane; context: PresentationContext; paging: ReadonlyMap<string, unknown>;
} | undefined>(previous => {
  if (!props.board.access.read) return
  const generation = props.schema.generation
  if (props.route.tab !== 'board') return previous?.generation === generation ? previous : undefined
  if (lane.value) return { generation, lane: lane.value, context: context.value, paging: paging.value }
})
const hasCards = computed(() => lanes.value.some(lane => lane.columns.some(column => column.count > 0)))
const boardSummary = computed<string | undefined>(previous => {
  if (props.route.tab !== 'board' || !lanes.value.length || activeFilters.value.length) return previous
  const tones = new Map(context.value.statuses.map(status => [status.id, statusSeverity(status)]))
  let open = 0
  let started = 0
  let blocked = 0
  for (const { columns } of lanes.value) {
    for (const { count, state } of columns) {
      const tone = tones.get(state)
      if (tone !== 'success') open += count
      if (tone === 'info') started += count
      if (tone === 'danger') blocked += count
    }
  }
  return `${open.toLocaleString()} open · ${started.toLocaleString()} in progress · ${blocked.toLocaleString()} blocked`
})
const personName = props.usePrincipalNames?.(() => {
  const items = props.route.tab === 'backlog' ? backlog.value?.items
    : lane.value?.columns.filter(column => pages.visible.value.includes(column.id)).flatMap(column => column.items)
  return (items ?? []).map(item => principalRef(item.values.assignee))
})
let active = true
onScopeDispose(() => { active = false })

let live: ReturnType<typeof createCoordinator> | undefined
function invalidate(seq?: number, revalidate = false) {
  const notify = props.invalidate ?? live?.invalidate
  notify?.(seq, revalidate)
}
defineExpose({ refresh: pages.refresh, boardSummary })
watch(() => props.board.board_id, (id, _, onCleanup) => {
  if (props.invalidate) return
  const coordinator = createCoordinator(async request => {
    if (request.revalidate) await props.revalidate?.()
    if (active && props.board.board_id === id) await pages.refresh(request)
  })
  live = coordinator
  const stop = subscribeBoard(id, coordinator, () => ({ generation: props.schema.generation, title: props.board.title }))
  coordinator.invalidate()
  onCleanup(() => {
    stop()
    coordinator.stop()
    if (live === coordinator) live = undefined
  })
}, { immediate: true, flush: 'sync' })

let parked = false
onDeactivated(() => { parked = true })
onActivated(() => {
  if (!parked) return
  parked = false
  invalidate()
})

let shown = false
useHostVisibilityRefresh(() => {
  if (shown && !props.invalidate) invalidate(undefined, true)
  shown = true
})
watch([() => props.board.board_id, () => props.schema.generation], () => {
  tabFilters.clear()
  activeFilters.value = []
  laneId.value = ''
})
watch(() => props.route.tab, tab => {
  activeFilters.value = tabFilters.get(tab) ?? []
  editor.value = undefined
  mutationError.value = undefined
  uncertain.value = undefined
  pages.activate(props.sequence)
}, { immediate: true })
watch(() => props.schema.generation, () => invalidate())
watch(() => props.board.access.write, writable => {
  if (writable) return
  editor.value = undefined
  uncertain.value = undefined
})
watch(placements, current => {
  const ids = new Set(current.map(entry => entry.id))
  const retained = activeFilters.value.filter(filter => !filter.id.includes(':') || ids.has(filter.id))
  if (retained.length !== activeFilters.value.length) updateFilters(retained)
})

function updateFilters(filters: ActiveFilter[]) {
  tabFilters.set(props.route.tab, filters)
  activeFilters.value = filters
  pages.select(filters.map(filter => filter.selection))
  pages.activate(props.sequence)
}
function showItem(item: ItemSummary) {
  const status = typeof item.state === 'string' ? item.state : undefined
  originatingItem.value = { item: item.id, status }
  emit('openIssue', item, person(item))
}
function visibleColumns(ids: string[]) {
  if (props.route.tab !== 'board') return
  const previous = pages.visible.value
  pages.visible.value = ids
  if (previous.length && pages.visibleNeedsRefresh(ids.filter(id => !previous.includes(id)))) invalidate()
}
function holdColumns(ids: string[]) {
  const previous = pages.held.value
  if (previous.size === ids.length && ids.every(id => previous.has(id))) return
  pages.held.value = new Set(ids)
  if (previous.size && !ids.length) invalidate()
}
function visibleRow(column: string, row: number) {
  if (props.route.tab === 'board' && pages.visibleRow(column, row)) invalidate()
}
watch(() => props.route.issue, async (issue, previous) => {
  if (issue || !previous) return
  const origin = originatingItem.value ?? { item: previous }
  await nextTick()
  if (props.route.tab === 'board') void boardViewport.value?.restore(origin.item, origin.status)
  if (props.route.tab === 'backlog') backlogTable.value?.restore(origin.item)
})
function person(item: ItemSummary) {
  return personName?.(principalRef(item.values.assignee))
}
function detail(item: string) {
  return readItemDetail(props.work, props.board.board_id, item, ['transitions'])
}
function requiredFields(item: ItemSummary, target: string) {
  const process = context.value.itemTypes.find(type => type.id === item.type)?.process
  return context.value.definitions.find(definition => definition.id === process)?.states.find(state => state.id === target)?.require
}
async function destinations(item: ItemSummary) {
  if (!writable.value) return []
  const current = await detail(item.id)
  if (!current.access.write || current.item.state !== item.state) return []
  return [...new Set((current.transitions ?? []).filter(edge => planMove(
    current, { item: item.id, source: String(current.item.state), target: edge.to }, requiredFields(item, edge.to),
  )).map(edge => edge.to))]
}
function pendingItem(item: string, value: boolean) {
  const next = new Set(pending.value)
  if (value) next.add(item)
  else next.delete(item)
  pending.value = next
}

async function move(intent: MoveIntent): Promise<MoveResult> {
  if (!writable.value || pending.value.has(intent.item) || uncertain.value) return { status: 'rejected' }
  const board = props.board.board_id
  pendingItem(intent.item, true)
  mutationError.value = undefined
  try {
    const current = await detail(intent.item)
    if (!active || props.board.board_id !== board || !writable.value) return { status: 'rejected' }
    const plan = planMove(current, intent, requiredFields(current.item, intent.target))
    if (!plan) throw new Error('Work does not currently allow this move. Check the issue’s status and required fields.')
    if (plan.required.length) {
      originatingItem.value = { item: intent.item, status: intent.source }
      emit('moveForm', { detail: current, plan })
      return { status: 'fields' }
    }
    const result = await write(command(plan.operations))
    if (result) return { status: 'applied', sequence: result.seq ?? result.as_of }
  } catch (failure) {
    if (props.board.board_id === board) mutationError.value = failure
  } finally {
    pendingItem(intent.item, false)
  }
  return { status: 'rejected' }
}

async function write(request: WorkCommand) {
  if (!writable.value || uncertain.value && uncertain.value !== request) return
  const item = request.ops[0].item
  const board = props.board.board_id
  mutationError.value = undefined
  pendingItem(item, true)
  try {
    const result = await applyWork(props.work, board, request)
    if (!active || props.board.board_id !== board) return
    uncertain.value = undefined
    editor.value = undefined
    invalidate(result.seq ?? result.as_of)
    return result
  } catch (failure) {
    if (!active || props.board.board_id !== board) return
    if (failure instanceof WorkError && failure.retryable) {
      uncertain.value = request
      await pages.refresh()
    } else {
      uncertain.value = undefined
      if (isAccessLoss(failure)) invalidate(undefined, true)
    }
    mutationError.value = failure
  } finally {
    pendingItem(item, false)
  }
}

function edit(item: ItemSummary) {
  if (!writable.value || uncertain.value) return
  mutationError.value = undefined
  editor.value = item
}
function sprints(item: string, after?: Cursor) {
  return sprintChoices(props.work, props.board.board_id, item, after)
}
function apply(operations: WorkOperation[]) {
  if (operations.length) void write(command(operations))
}
</script>

<template>
  <section v-if="board.access.read" v-show="route.tab === 'board' || route.tab === 'backlog'"
    class="kanban-views" :aria-label="route.tab === 'board' ? 'Board' : 'Backlog view'">
    <div v-show="route.tab === 'board'" ref="statusHost" class="kanban-status-host" />
    <FilterBar v-if="route.tab === 'board' || route.tab === 'backlog'"
      :board="board.board_id" :context="context" :placements="placements" :selection="activeFilters"
      :control="filterHost" @apply="updateFilters" />
    <div v-if="error || mutationError && !editor" class="kx-notice error kanban-view-notice"
      :class="{ 'kanban-move-notice': route.tab === 'board' && !error }" role="alert">
      <Icon icon="tabler:alert-circle" aria-hidden="true" />
      <span>{{ workFailure(error || mutationError).message }}</span>
      <Button v-if="error" label="Retry" text size="small" @click="invalidate(undefined, true)" />
      <Button v-if="uncertain" label="Retry write" text size="small" :disabled="pending.size > 0" @click="write(uncertain)" />
      <Button v-if="!error && !uncertain" text rounded size="small" severity="secondary"
        aria-label="Dismiss move message" @click="mutationError = undefined">
        <template #icon><Icon icon="tabler:x" aria-hidden="true" /></template>
      </Button>
    </div>
    <KanbanSkeleton v-if="fetching && !lane && !backlog" :variant="route.tab === 'board' ? 'board' : 'rows'"
      label="Loading issues…" :compact="compact" />
    <template v-if="route.tab === 'board' && lane">
      <p v-if="subgroupLimited" class="kanban-view-notice" role="status">Work could not load the swimlanes. Showing status columns.</p>
      <EmptyState v-if="!hasCards" icon="tabler:layout-kanban" role="status"
        :title="activeFilters.length ? 'No issues match these filters.' : 'No issues on this board.'" />
      <Teleport v-if="lanes.length > 1" :to="statusHost" :disabled="!statusHost">
        <Select :model-value="lane.id" :options="lanes" option-value="id" option-label="title"
          aria-label="Swimlane" size="small" @update:model-value="laneId = $event" />
      </Teleport>
    </template>
    <div v-if="boardPresentation" v-show="route.tab === 'board'" class="kanban-board-pane">
      <BoardViewport ref="boardViewport" :key="boardPresentation.lane.id" :active="route.tab === 'board'"
        :columns="boardPresentation.lane.columns" :context="boardPresentation.context" :placements="placements"
        :writable="writable" :compact="compact" :pending-ids="pending" :paging="boardPresentation.paging" :destinations="destinations" :person="person" :move="move"
        :open-issue-state="openIssueState" :status-host="statusHost" :frozen="!!route.issue"
        @visible="visibleColumns" @hold="holdColumns" @window="visibleRow"
        @open="showItem" @more="pages.more" @prefetch="emit('prefetchIssue', $event)" @cancel-prefetch="emit('cancelPrefetch')" />
    </div>
    <KeepAlive :max="1">
      <BacklogTable v-if="route.tab === 'backlog' && backlog" ref="backlogTable" :page="backlog" :page-index="backlogIndex"
        :context="context" :writable="writable" :can-edit="!!fieldControl" :planning="planning"
        :fetching="fetching" :person="person" :pending-ids="pending" :sprints="sprints" @open="showItem" @page="pages.pageBacklog"
        @edit="edit" @apply="apply">
        <template #empty>
          <EmptyState icon="tabler:list-details" role="status"
            :title="activeFilters.length ? 'No issues match these filters.' : 'No issues in the backlog.'" />
        </template>
      </BacklogTable>
    </KeepAlive>
    <BacklogEditor v-if="editor && writable && fieldControl" :key="editor.id" :board="board.board_id" :work="work"
      :item="editor" :fields="context.fields" :field-control="fieldControl"
      :pending="pending.has(editor.id)" :locked="!!uncertain" :mutation-error="mutationError"
      @close="editor = undefined" @apply="apply" @retry="uncertain && write(uncertain)" />
  </section>
</template>
