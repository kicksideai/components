// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import { computed, onScopeDispose, ref, shallowRef, watch } from 'vue'
import type { KanbanTab } from '../route'
import { isAccessLoss, type WorkClient } from '../work/client'
import type { BoardOption, BoardSchema } from '../work/types'
import type { Invalidation } from '../live/coordinator'
import { presentationContext } from './context'
import {
  and, backlogPageSize, boardFirstPageSize, bucketQuery, columnPageSize, findView, pageIdentity,
  queryFor, requireComplete, type Cursor, type FilterSelection, type ItemSummary,
  type Json, type Predicate, type QueryBucket, type QueryPage, type SavedView,
} from './query'

export interface BoardColumn {
  id: string
  state: string
  title: string
  count: number
  items: ItemSummary[]
  lane?: Predicate
  after?: Cursor
}

export interface Swimlane {
  id: string
  title?: string
  columns: BoardColumn[]
}

interface Options {
  board: () => BoardOption
  schema: () => BoardSchema
  tab: () => KanbanTab
  work: WorkClient
  accessLost: () => void
}

const groupedPageLimit = 200
const deepWindowStart = groupedPageLimit - columnPageSize
interface ColumnEdge { row: number, cursor: Cursor }

function precedingEdge(edges: ColumnEdge[] | undefined, row: number, length: number) {
  if (!edges) return
  for (let index = edges.length - 1; index >= 0; index--) {
    const edge = edges[index]
    if (edge.row <= row && edge.row < length) return edge
  }
}

function mergeRows(first: ItemSummary[], second: ItemSummary[], count: number) {
  const seen = new Set<string>()
  return [...first, ...second].filter(item => !seen.has(item.id) && !!seen.add(item.id)).slice(0, count)
}

function subgroupPredicate(field: string, value: Json | undefined): Predicate {
  return value == null ? { field, op: 'is_null', value: true } : { field, op: 'eq', value }
}

function groupColumns(context: ReturnType<typeof presentationContext>, groups: QueryBucket[], lane?: Predicate) {
  const byStatus = new Map(groups.filter(group => typeof group.value === 'string').map(group => [group.value as string, group]))
  const states = [...new Set([...context.statuses.map(state => state.id), ...byStatus.keys()])]
  return states.map((state): BoardColumn => {
    const group = byStatus.get(state)
    return {
      id: lane ? JSON.stringify([lane, state]) : state, state, title: context.statusLabels[state] ?? state,
      count: group?.count ?? 0, items: group?.items ?? [], after: group?.after, lane,
    }
  })
}

function groupLanes(context: ReturnType<typeof presentationContext>, page: QueryPage, subgroup?: string): Swimlane[] {
  if (!subgroup) return [{ id: '', columns: groupColumns(context, page.groups ?? []) }]
  const groupsByValue = new Map<string, { value?: Json, buckets: QueryBucket[] }>()
  for (const status of page.groups ?? []) {
    for (const bucket of status.groups ?? []) {
      const key = JSON.stringify(bucket.value ?? null)
      const lane = groupsByValue.get(key) ?? { value: bucket.value, buckets: [] }
      lane.buckets.push({ ...bucket, value: status.value, field: 'state' })
      groupsByValue.set(key, lane)
    }
  }
  const field = context.fields.find(entry => entry.code === subgroup)
  if (!groupsByValue.size) return [{ id: '', columns: groupColumns(context, []) }]
  return Array.from(groupsByValue, ([id, lane]) => {
    const value = lane.value
    const title = value == null ? 'No ' + (field?.title ?? subgroup)
      : field?.options?.find(option => option.id === value)?.label ?? String(value)
    return { id, title, columns: groupColumns(context, lane.buckets, subgroupPredicate(subgroup, value)) }
  })
}

export function usePages(options: Options) {
  const views = new Map<string, SavedView>()
  const filters = shallowRef<FilterSelection[]>([])
  const saved = shallowRef<SavedView>()
  const lanes = shallowRef<Swimlane[]>([])
  const backlog = shallowRef<QueryPage>()
  const anchors = shallowRef<(Cursor | undefined)[]>([undefined])
  const backlogIndex = ref(0)
  const error = shallowRef<unknown>()
  const fetching = ref(false)
  const subgroupLimited = ref(false)
  const paging = shallowRef(new Map<string, unknown>())
  const context = computed(() => presentationContext(options.schema(), saved.value))
  const begin = latestRequest()
  const visible = shallowRef<readonly string[]>([])
  const held = shallowRef<ReadonlySet<string>>(new Set())
  let columnEdges = new Map<string, ColumnEdge[]>()
  let rowOffsets = new Map<string, number>()
  let generation = 0
  let sequence = 0
  const snapshot = () => ({
    filters: filters.value, saved: saved.value, lanes: lanes.value, backlog: backlog.value, anchors: anchors.value,
    backlogIndex: backlogIndex.value, visible: visible.value, subgroupLimited: subgroupLimited.value,
    columnEdges, rowOffsets,
  })
  const tabPages = new Map<KanbanTab, ReturnType<typeof snapshot>>()

  function problem(failure: unknown) {
    if (isAccessLoss(failure)) {
      tabPages.clear()
      views.clear()
      reset()
      options.accessLost()
    }
    error.value = failure
  }

  function reset() {
    generation++
    begin()
    saved.value = undefined
    visible.value = []
    held.value = new Set()
    columnEdges = new Map()
    rowOffsets = new Map()
    lanes.value = []
    backlog.value = undefined
    anchors.value = [undefined]
    backlogIndex.value = 0
    error.value = undefined
    subgroupLimited.value = false
    fetching.value = false
    paging.value = new Map()
  }

  const viewKey = () => JSON.stringify([options.board().board_id, options.schema().generation, options.tab()])
  watch([() => options.board().board_id, () => options.schema().generation, options.tab], ([board, schema, tab], [priorBoard, priorSchema, priorTab]) => {
    if (board !== priorBoard) sequence = 0
    if (board !== priorBoard || schema !== priorSchema) {
      tabPages.clear()
      views.clear()
    } else tabPages.set(priorTab, snapshot())
    filters.value = []
    reset()
    const cached = tabPages.get(tab)
    if (cached) {
      filters.value = cached.filters
      saved.value = cached.saved
      lanes.value = cached.lanes
      backlog.value = cached.backlog
      anchors.value = cached.anchors
      backlogIndex.value = cached.backlogIndex
      visible.value = cached.visible
      subgroupLimited.value = cached.subgroupLimited
      columnEdges = cached.columnEdges
      rowOffsets = cached.rowOffsets
    }
  }, { flush: 'sync' })
  watch(() => options.board().access.read, readable => {
    if (!readable) {
      tabPages.clear()
      reset()
    }
  }, { flush: 'sync' })
  onScopeDispose(() => {
    generation++
    begin()
  })

  function select(next: FilterSelection[]) {
    filters.value = next
    reset()
  }

  function fence(minSeq?: number) {
    return Math.max(sequence, minSeq ?? 0) || undefined
  }

  async function refresh({ minSeq, revalidate }: Invalidation = { revalidate: false }, targetPage?: number) {
    const kind = options.tab()
    if (kind !== 'board' && kind !== 'backlog') return
    const board = options.board()
    if (!board.access.read) {
      reset()
      return
    }
    const key = viewKey()
    const current = begin()
    const oldView = saved.value
    const selected = filters.value
    fetching.value = true
    error.value = undefined
    try {
      const view = (!revalidate && views.get(key))
        || await findView(options.work, board.board_id, kind === 'board' ? 'kanban_board' : 'kanban_backlog')
      if (!current()) return
      if (oldView && pageIdentity(board.board_id, options.schema().generation, oldView, selected)
          !== pageIdentity(board.board_id, options.schema().generation, view, selected)) {
        lanes.value = []
        backlog.value = undefined
        anchors.value = [undefined]
        backlogIndex.value = 0
        columnEdges.clear()
        rowOffsets.clear()
      }
      views.set(key, view)
      const query = queryFor(view, selected)
      const min_seq = fence(minSeq)
      if (kind === 'backlog') {
        const pageIndex = targetPage ?? backlogIndex.value
        const after = anchors.value[pageIndex]
        const limit = backlogPageSize
        const page = requireComplete(selected.length || view.view.group_by
          ? await options.work.boardRead<QueryPage>(board.board_id, 'query', { ...query, limit, after, min_seq })
          : await options.work.runView<QueryPage>(view.view_id, { limit, after, min_seq }))
        if (!current()) return
        backlog.value = page
        backlogIndex.value = pageIndex
        sequence = Math.max(sequence, page.as_of)
      } else {
        const all = lanes.value.flatMap(lane => lane.columns)
        const visibleColumns = all.filter(column => visible.value.includes(column.id) && !held.value.has(column.id))
        const subgroup = view.view.sub_group_by
        const targeted = !!all.length && !revalidate && !subgroup
        if (targeted && !visibleColumns.length) return
        const where = targeted
          ? and(query.where, { field: 'state', op: 'in', value: visibleColumns.map(column => column.state) })
          : query.where
        const limit = Math.min(groupedPageLimit, Math.max(boardFirstPageSize, ...visibleColumns.map(column => column.items.length)))
        const grouped = { ...query, where, group_by: 'state', sub_group_by: subgroup, limit, min_seq }
        let page = targeted || selected.length
          ? await options.work.boardRead<QueryPage>(board.board_id, 'query', grouped)
          : await options.work.runView<QueryPage>(view.view_id, { limit, min_seq })
        if (!current()) return
        const limited = !!subgroup && (page.group_limited === true || !!page.group_after)
        if (limited) {
          page = await options.work.boardRead<QueryPage>(board.board_id, 'query', { ...grouped, sub_group_by: undefined })
          if (!current()) return
        }
        requireComplete(page)
        const nextLanes = groupLanes(presentationContext(options.schema(), view), page, limited ? undefined : subgroup)
        const retained = new Map(all.map(column => [column.id, column]))
        const updated = new Set(visibleColumns.map(column => column.id))
        const refreshed = await Promise.all(nextLanes.map(async lane => ({
          ...lane, columns: await Promise.all(lane.columns.map(async column => {
            const prior = retained.get(column.id)
            if (!prior) return column
            if (held.value.has(column.id) || (targeted && !updated.has(column.id))) return prior
            if (prior.items.length <= groupedPageLimit || column.count <= column.items.length) return column
            const offset = rowOffsets.get(column.id) ?? 0
            const edge = updated.has(column.id) && offset >= deepWindowStart
              ? precedingEdge(columnEdges.get(column.id), offset, prior.items.length)
              : undefined
            const tailStart = prior.items.findIndex(item => item.id === column.items.at(-1)?.id) + 1
            const base = mergeRows(column.items, prior.items.slice(tailStart || column.items.length), column.count)
            if (!edge) return { ...column, items: base, after: base.length < column.count ? prior.after : undefined }
            const start = base.findIndex(item => item.id === edge.cursor.id) + 1 || edge.row
            const size = Math.min(2 * columnPageSize, prior.items.length - edge.row)
            const window = requireComplete(await options.work.boardRead<QueryPage>(board.board_id, 'query',
              bucketQuery(query, { ...column, after: edge.cursor }, min_seq, size)))
            const items = mergeRows([...base.slice(0, start), ...(window.items ?? [])], base.slice(start + size), column.count)
            const cursor = start + size >= base.length ? window.after : prior.after
            return { ...column, items, after: items.length < column.count ? cursor : undefined }
          })),
        })))
        if (!current()) return
        const displayed = new Map(lanes.value.flatMap(lane => lane.columns.map(column => [column.id, column] as const)))
        lanes.value = refreshed.map(lane => ({
          ...lane,
          columns: lane.columns.map(column => {
            const displayedColumn = displayed.get(column.id)
            const pagingChanged = displayedColumn !== retained.get(column.id) || paging.value.get(column.id) === true
            return displayedColumn && (pagingChanged || held.value.has(column.id)) ? displayedColumn : column
          }),
        }))
        subgroupLimited.value = limited
        sequence = Math.max(sequence, page.as_of)
      }
      saved.value = view
    } catch (failure) {
      if (current()) problem(failure)
    } finally {
      if (current()) fetching.value = false
    }
  }

  function pagingStatus(id: string, status?: unknown) {
    const next = new Map(paging.value)
    if (status === undefined) next.delete(id)
    else next.set(id, status)
    paging.value = next
  }

  async function more(column: BoardColumn) {
    if (paging.value.get(column.id) === true || !column.after || !saved.value) return
    const current = generation
    const board = options.board().board_id
    const edge = column.after
    const request = bucketQuery(queryFor(saved.value, filters.value), column, fence())
    pagingStatus(column.id, true)
    try {
      const page = requireComplete(await options.work.boardRead<QueryPage>(board, 'query', request))
      if (current !== generation) return
      const seen = new Set(column.items.map(item => item.id))
      const additions = (page.items ?? []).filter(item => !seen.has(item.id))
      if (additions.length && lanes.value.some(lane => lane.columns.includes(column))) {
        columnEdges.set(column.id, [...(columnEdges.get(column.id) ?? []), { row: column.items.length, cursor: edge }])
      }
      lanes.value = lanes.value.map(lane => ({
        ...lane,
        columns: lane.columns.map(row => row === column ? {
          ...row, after: page.after, items: [...row.items, ...additions],
        } : row),
      }))
      sequence = Math.max(sequence, page.as_of)
      pagingStatus(column.id)
    } catch (failure) {
      if (current !== generation) return
      pagingStatus(column.id, failure)
      if (isAccessLoss(failure)) problem(failure)
    }
  }

  function visibleRow(column: string, row: number) {
    const prior = rowOffsets.get(column) ?? 0
    rowOffsets.set(column, row)
    return row >= deepWindowStart && Math.floor(row / columnPageSize) !== Math.floor(prior / columnPageSize)
  }

  async function pageBacklog(direction: -1 | 1) {
    const current = backlog.value
    if (fetching.value || !current) return
    if (direction === 1) {
      if (!current.after) return
      anchors.value = [...anchors.value.slice(0, backlogIndex.value + 1), current.after]
    } else if (!backlogIndex.value) return
    await refresh(undefined, backlogIndex.value + direction)
  }

  return {
    context, lanes, backlog, backlogIndex, error, fetching, paging, subgroupLimited, visible, held,
    select, refresh, more, pageBacklog, visibleRow,
  }
}
