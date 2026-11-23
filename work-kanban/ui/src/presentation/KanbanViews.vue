<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Button from 'primevue/button'
import Select from 'primevue/select'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { computed, nextTick, onScopeDispose, ref, shallowRef, watch, type Component } from 'vue'
import BacklogEditor from '../backlog/BacklogEditor.vue'
import BacklogTable from '../backlog/BacklogTable.vue'
import { sprintChoices } from '../backlog/sprints'
import BoardViewport from '../board/BoardViewport.vue'
import { planMove, type MovePlan } from '../board/move'
import type { MoveIntent } from '../board/window'
import { checkPlacements } from '../extensions/placements'
import { createCoordinator } from '../live/coordinator'
import { subscribeBoard } from '../live/subscribe'
import type { KanbanRoute } from '../route'
import { isAccessLoss, planningPlugin, WorkError, type WorkClient } from '../work/client'
import { workFailure } from '../work/errors'
import type { BoardOption, BoardSchema } from '../work/types'
import { principalRef } from './context'
import FilterBar, { type ActiveFilter } from './FilterBar.vue'
import { applyWork, command } from './mutation'
import { readItemDetail } from './query'
import type { Cursor, ItemDetail, ItemSummary, WorkCommand, WorkOperation } from './query'
import { usePages } from './usePages'

const props = defineProps<{
  board: BoardOption
  schema: BoardSchema
  route: KanbanRoute
  work: WorkClient
  revalidate?: () => Promise<void>
  invalidate?: ReturnType<typeof createCoordinator>['invalidate']
  fieldControl?: Component
  usePrincipalNames?: (values: () => ReturnType<typeof principalRef>[]) =>
    (value: ReturnType<typeof principalRef>) => string | undefined
}>()
const emit = defineEmits<{
  openIssue: [item: string]
  moveForm: [draft: { detail: ItemDetail, plan: MovePlan }]
  accessLost: []
}>()
const activeFilters = shallowRef<ActiveFilter[]>([])
const tabFilters = new Map<KanbanRoute['tab'], ActiveFilter[]>()
const laneId = ref('')
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
  board: () => props.board, schema: () => props.schema, tab: () => props.route.tab, work: props.work,
  accessLost: () => {
    editor.value = undefined
    uncertain.value = undefined
    emit('accessLost')
    invalidate(undefined, true)
  },
})
const { context, lanes, backlog, backlogIndex, error, fetching, paging, subgroupLimited } = pages
const lane = computed(() => lanes.value.find(lane => lane.id === laneId.value) ?? lanes.value[0])
const hasCards = computed(() => lanes.value.some(lane => lane.columns.some(column => column.count > 0)))
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
defineExpose({ refresh: pages.refresh })
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

let shown = false
useHostVisibilityRefresh(() => {
  if (shown && !props.invalidate) invalidate(undefined, true)
  shown = true
})
watch([() => props.board.board_id, () => props.schema.generation], () => {
  tabFilters.clear()
  activeFilters.value = []
})
watch(() => props.route.tab, tab => {
  activeFilters.value = tabFilters.get(tab) ?? []
  laneId.value = ''
  editor.value = undefined
  mutationError.value = undefined
  uncertain.value = undefined
  invalidate()
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
  invalidate()
}
function showItem(item: string) {
  const status = lane.value?.columns.find(column => column.items.some(row => row.id === item))?.state
  originatingItem.value = { item, status }
  emit('openIssue', item)
}
function visibleColumns(ids: string[]) {
  const previous = pages.visible.value
  pages.visible.value = ids
  if (previous.length && ids.some(id => !previous.includes(id))) invalidate()
}
function holdColumns(ids: string[]) {
  const previous = pages.held.value
  if (previous.size === ids.length && ids.every(id => previous.has(id))) return
  pages.held.value = new Set(ids)
  if (previous.size && !ids.length) invalidate()
}
function visibleRow(column: string, row: number) {
  if (pages.visibleRow(column, row)) invalidate()
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

async function move(intent: MoveIntent) {
  if (!writable.value || pending.value.has(intent.item) || uncertain.value) return
  const board = props.board.board_id
  pendingItem(intent.item, true)
  mutationError.value = undefined
  try {
    const current = await detail(intent.item)
    if (!active || props.board.board_id !== board || !writable.value) return
    const plan = planMove(current, intent, requiredFields(current.item, intent.target))
    if (!plan) throw new Error('Work does not currently allow this move. Check the issue’s status and required fields.')
    if (plan.required.length) {
      originatingItem.value = { item: intent.item, status: intent.source }
      emit('moveForm', { detail: current, plan })
    } else await write(command(plan.operations))
  } catch (failure) {
    if (props.board.board_id === board) mutationError.value = failure
  } finally {
    pendingItem(intent.item, false)
  }
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
  <section v-if="board.access.read && (route.tab === 'board' || route.tab === 'backlog')" class="kanban-views" :aria-label="route.tab === 'board' ? 'Board' : 'Backlog view'">
    <FilterBar :board="board.board_id" :context="context" :placements="placements" :selection="activeFilters" @apply="updateFilters" />
    <div v-if="error || mutationError && !editor" class="kx-notice error kanban-view-notice" role="alert">
      <span>{{ workFailure(error || mutationError).message }}</span>
      <small v-if="workFailure(error || mutationError).code">{{ workFailure(error || mutationError).code }}</small>
      <Button v-if="error" label="Retry" text size="small" @click="invalidate(undefined, true)" />
      <Button v-if="uncertain" label="Retry write" text size="small" :disabled="pending.size > 0" @click="write(uncertain)" />
    </div>
    <p v-if="fetching && !lane && !backlog" class="kx-loading" role="status">Loading issues…</p>
    <template v-if="route.tab === 'board' && lane">
      <p v-if="subgroupLimited" class="kanban-view-notice" role="status">Work could not load the swimlanes. Showing status columns.</p>
      <p v-if="!hasCards" class="kanban-view-notice" role="status">{{ activeFilters.length ? 'No issues match these filters.' : 'No issues on this board.' }}</p>
      <Select v-if="lanes.length > 1" :model-value="lane.id" :options="lanes" option-value="id" option-label="title"
        aria-label="Swimlane" size="small" @update:model-value="laneId = $event" />
      <BoardViewport ref="boardViewport" :key="lane.id" :columns="lane.columns" :context="context" :placements="placements"
        :writable="writable" :pending-ids="pending" :paging="paging" :destinations="destinations" :person="person"
        @visible="visibleColumns" @hold="holdColumns" @window="visibleRow"
        @open="showItem" @move="move" @more="pages.more" />
    </template>
    <BacklogTable v-if="route.tab === 'backlog' && backlog" ref="backlogTable" :page="backlog" :page-index="backlogIndex"
      :context="context" :writable="writable" :can-edit="!!fieldControl" :planning="planning"
      :fetching="fetching" :person="person" :pending-ids="pending" :sprints="sprints" @open="showItem" @page="pages.pageBacklog"
      @edit="edit" @apply="apply">
      <template #empty>{{ activeFilters.length ? 'No issues match these filters.' : 'No issues in the backlog.' }}</template>
    </BacklogTable>
    <BacklogEditor v-if="editor && writable && fieldControl" :key="editor.id" :board="board.board_id" :work="work"
      :item="editor" :fields="context.fields" :field-control="fieldControl"
      :pending="pending.has(editor.id)" :locked="!!uncertain" :mutation-error="mutationError"
      @close="editor = undefined" @apply="apply" @retry="uncertain && write(uncertain)" />
  </section>
</template>
