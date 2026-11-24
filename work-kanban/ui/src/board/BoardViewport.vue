<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import type { MenuItem } from 'primevue/menuitem'
import Select from 'primevue/select'
import { computed, nextTick, onMounted, onScopeDispose, ref, shallowRef, useId, watch } from 'vue'
import type { WorkExtension } from '../work/types'
import { workFailure } from '../work/errors'
import type { PresentationContext } from '../presentation/context'
import type { ItemSummary } from '../presentation/query'
import type { BoardColumn } from '../presentation/usePages'
import IssueCard from './IssueCard.vue'
import { useBoardMove, type MoveResult } from './useBoardMove'
import { boardWindow, maxMountedColumns, rowWindow, type MoveIntent } from './window'

const props = defineProps<{
  columns: BoardColumn[]
  context: PresentationContext
  placements: readonly WorkExtension[]
  writable: boolean
  compact?: boolean
  move: (intent: MoveIntent) => Promise<MoveResult>
  pendingIds: ReadonlySet<string>
  paging: ReadonlyMap<string, unknown>
  person: (item: ItemSummary) => string | undefined
  destinations: (item: ItemSummary) => Promise<string[]>
}>()
const emit = defineEmits<{
  open: [item: string], more: [column: BoardColumn],
  visible: [ids: string[]], hold: [ids: string[]], window: [column: string, firstRow: number],
}>()
const viewport = ref<HTMLElement>()
const menu = ref<InstanceType<typeof Menu>>()
const actions = shallowRef<MenuItem[]>([])
const width = ref(0)
const height = ref(0)
const x = ref(0)
const focusItem = ref<string>()
const y = shallowRef(new Map<string, number>())
const instructions = useId()
const gap = 10
const rowGap = 6
const rowStride = computed(() => props.compact ? 66 : 86)
const mobile = computed(() => width.value <= 520)
const stride = computed(() => mobile.value
  ? Math.max(204, Math.round(width.value * .64)) + gap
  : Math.max(196, (width.value + gap) / Math.min(5, props.columns.length || 1)))
const contentWidth = computed(() => Math.max(width.value, stride.value * props.columns.length - gap))
const motion = useBoardMove({
  viewport, columns: () => props.columns, columnElement,
  columnStride: () => stride.value, rowStride: () => rowStride.value,
  canMove, hold: ids => emit('hold', ids), move: intent => props.move(intent), reveal,
  focus: (id, state) => restore(id, state, true),
})
const { pick, moving, lift, liftItem, liftBox, landing, announcement } = motion
const visible = computed<number[]>(prior => {
  if (!width.value || !height.value) return []
  const indices = boardWindow(x.value, width.value, stride.value, props.columns.length)
  const retained = pick.value ? [pick.value.source.column, pick.value.target.column]
    .map(id => props.columns.findIndex(column => column.id === id)) : []
  for (const index of new Set(retained)) {
    if (index < 0 || indices.includes(index)) continue
    if (indices.length === maxMountedColumns) {
      const overscan = indices.find(candidate => candidate * stride.value < x.value - stride.value
        && !retained.includes(candidate)) ?? [...indices].reverse().find(candidate => !retained.includes(candidate))
      if (overscan !== undefined) indices.splice(indices.indexOf(overscan), 1)
    }
    indices.push(index)
  }
  if (retained.length) indices.sort((a, b) => a - b)
  return prior?.length === indices.length && indices.every((index, offset) => index === prior[offset]) ? prior : indices
})
const activeColumn = computed(() => {
  if (x.value === 0) return props.columns[0]?.id
  if (x.value >= contentWidth.value - width.value - 1) return props.columns.at(-1)?.id
  return props.columns[Math.round(x.value / stride.value)]?.id
})
const jumpOptions = computed(() => props.columns.map(column => ({ id: column.id, title: column.title + ' (' + column.count + ')' })))
const firstFocusable = computed(() => visible.value.find(index => props.columns[index].items.length > 0))
let observer: ResizeObserver | undefined
let menuRequest = 0
let frame = 0
let pendingX: number | undefined
const pendingScroll = new Map<string, number>()
watch(() => visible.value.map(index => props.columns[index].id).join('\0'), () => {
  emit('visible', visible.value.map(index => props.columns[index].id))
}, { immediate: true })
watch(() => props.columns, async (next, previous) => {
  const offsets = new Map(y.value)
  const stride = rowStride.value
  for (const index of visible.value) {
    const column = next[index]
    const prior = previous.find(row => row.id === column.id)
    const body = columnElement(index)?.querySelector<HTMLElement>('.kanban-column-body')
    if (!prior || !body || prior === column || !body.scrollTop) continue
    if (pick.value?.source.column === column.id || pick.value?.target.column === column.id) continue
    const oldIndex = Math.floor(body.scrollTop / stride)
    const anchor = prior.items[oldIndex]
    const newIndex = anchor && column.items.findIndex(item => item.id === anchor.id)
    if (newIndex !== undefined && newIndex >= 0 && oldIndex !== newIndex) {
      offsets.set(column.id, body.scrollTop + (newIndex - oldIndex) * stride)
    }
  }
  if ([...offsets].every(([id, offset]) => y.value.get(id) === offset)) return
  await applyOffsets(offsets)
})
watch(rowStride, (next, prior) => {
  const offsets = new Map([...y.value, ...pendingScroll])
  pendingScroll.clear()
  for (const [id, offset] of offsets) offsets.set(id, offset * next / prior)
  void applyOffsets(offsets)
})
onMounted(() => {
  const element = viewport.value
  if (!element) return
  width.value = element.clientWidth
  height.value = element.clientHeight
  observer = new ResizeObserver(([size]) => {
    if (!size || size.contentRect.width <= 0) return
    width.value = size.contentRect.width
    height.value = size.contentRect.height
  })
  observer.observe(element)
})
onScopeDispose(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
  menuRequest++
})

interface RenderedColumn {
  column: BoardColumn
  index: number
  rows: { row: number; base: number; item?: ItemSummary }[]
  window: number[]
  slots: number
  count: number
  target: boolean
  preview: typeof pick.value
}
async function applyOffsets(offsets: Map<string, number>) {
  y.value = offsets
  await nextTick()
  for (const index of visible.value) {
    const body = columnElement(index)?.querySelector<HTMLElement>('.kanban-column-body')
    if (body) body.scrollTop = offsets.get(props.columns[index].id) ?? 0
  }
}
const rendered = computed<RenderedColumn[]>(prior => {
  const next = visible.value.map(renderColumn)
  return prior?.length === next.length && next.every((column, index) => column === prior[index]) ? prior : next

  function renderColumn(index: number): RenderedColumn {
    const column = props.columns[index]
    const current = pick.value
    const source = current?.source.column === column.id
    const target = current?.target.column === column.id
    let remove = -1
    if (current && (source || target && current.placed)) {
      const row = current.source.row
      remove = column.items[row]?.id === current.item.id ? row : column.items.findIndex(item => item.id === current.item.id)
    }
    const length = column.items.length - Number(remove >= 0)
    const insertion = current && target ? Math.min(current.target.row, length) : -1
    const slots = length + Number(insertion >= 0)
    const visibleRows = rowWindow(y.value.get(column.id) ?? 0, Math.max(0, height.value - 40), rowStride.value, slots)
    const preview = source || target ? current : undefined
    const existing = prior?.find(entry => entry.index === index)
    if (existing?.column === column && existing.preview === preview
      && visibleRows.length === existing.window.length
      && visibleRows[0] === existing.window[0]) return existing
    const rows = visibleRows.map(row => {
      if (row === insertion) return { row, base: row, item: current?.placed ? current.item : undefined }
      const index = row - Number(insertion >= 0 && row > insertion)
      const base = index + Number(remove >= 0 && index >= remove)
      return { row, base, item: column.items[base] }
    })
    const delta = current?.placed ? Number(target && remove < 0) - Number(source && !target && remove >= 0) : 0
    return { column, index, rows, window: visibleRows, slots, count: column.count + delta, target: target && !current?.placed, preview }
  }
})
function cardTabIndex(item: ItemSummary, column: number, row: number) {
  return focusItem.value === item.id || (!focusItem.value && column === firstFocusable.value && row === 0) ? 0 : -1
}
function canMove(item: string) {
  return props.writable && !props.pendingIds.has(item)
}
function rtl() {
  return viewport.value && getComputedStyle(viewport.value).direction === 'rtl'
}
function scrollRows(column: string, event: Event) {
  pendingScroll.set(column, (event.currentTarget as HTMLElement).scrollTop)
  scheduleWindow()
}
function horizontal(event: Event) {
  pendingX = Math.abs((event.currentTarget as HTMLElement).scrollLeft)
  scheduleWindow()
}
function scheduleWindow() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    if (pendingX !== undefined) {
      x.value = pendingX
      pendingX = undefined
    }
    if (pendingScroll.size) {
      y.value = new Map([...y.value, ...pendingScroll])
      for (const [id, offset] of pendingScroll) emit('window', id, Math.floor(offset / rowStride.value))
      pendingScroll.clear()
    }
  })
}
const vColumnScroll = {
  mounted(element: HTMLElement, { value }: { value: string }) {
    element.scrollTop = y.value.get(value) ?? 0
  },
}
async function jump(id: string) {
  const index = props.columns.findIndex(column => column.id === id)
  const element = viewport.value
  if (index < 0 || !element) return
  x.value = Math.min(index * stride.value, element.scrollWidth - element.clientWidth)
  await nextTick()
  element.scrollLeft = rtl() ? -x.value : x.value
}
function columnElement(index: number) {
  return viewport.value?.querySelector<HTMLElement>('[data-column-index="' + index + '"]')
}
async function reveal(id: string, row: number) {
  const index = props.columns.findIndex(column => column.id === id)
  const start = index * stride.value
  if (start < x.value || start + stride.value - gap > x.value + width.value) await jump(id)
  await nextTick()
  const body = columnElement(index)?.querySelector<HTMLElement>('.kanban-column-body')
  if (!body || row < 0) return
  const top = row * rowStride.value
  if (top < body.scrollTop) body.scrollTop = top
  else if (top + rowStride.value > body.scrollTop + body.clientHeight) body.scrollTop = top + rowStride.value - body.clientHeight
  y.value = new Map(y.value).set(id, body.scrollTop)
  await nextTick()
}
async function restore(id: string, status?: string, handle = false) {
  const preview = pick.value
  const column = preview?.placed && preview.item.id === id
    ? props.columns.find(column => column.id === preview.target.column)
    : props.columns.find(column => column.items.some(item => item.id === id)) ?? props.columns.find(column => column.state === status)
  if (!column) {
    viewport.value?.focus()
    return
  }
  const row = preview?.placed && preview.item.id === id ? preview.target.row : column.items.findIndex(item => item.id === id)
  await reveal(column.id, row)
  const node = columnElement(props.columns.indexOf(column))
  const selector = '[data-card-id="' + CSS.escape(id) + '"] ' + (handle ? '.kanban-card-menu' : '.kanban-card-title')
  const element = node?.querySelector<HTMLElement>(selector)
  if (!element) {
    node?.focus({ preventScroll: true })
    return
  }
  focusItem.value = id
  element.focus({ preventScroll: true })
}
defineExpose({ restore })

function rove(event: KeyboardEvent, columnIndex: number, itemIndex: number) {
  if (!(event.target instanceof HTMLElement) || !event.target.classList.contains('kanban-card-title')) return
  let nextColumn = columnIndex
  let nextItem = itemIndex
  if (event.key === 'ArrowDown') nextItem++
  else if (event.key === 'ArrowUp') nextItem--
  else if (event.key === 'ArrowRight') nextColumn++
  else if (event.key === 'ArrowLeft') nextColumn--
  else return
  const column = props.columns[nextColumn]
  const item = column?.items[Math.min(nextItem, column.items.length - 1)]
  if (!column || !item) return
  event.preventDefault()
  void restore(item.id, column.state)
}

async function request(event: MouseEvent, sourceId: string, itemId: string, targetId: string, offset?: -1 | 1) {
  if (pick.value || moving.value || !canMove(itemId)) return
  const columnIndex = props.columns.findIndex(column => column.id === sourceId)
  const column = props.columns[columnIndex]
  const target = props.columns.find(column => column.id === targetId)
  if (!column || !target) return
  const row = column.items.findIndex(item => item.id === itemId)
  const item = column.items[row]
  const source = columnElement(columnIndex)?.querySelector('[data-card-id="' + CSS.escape(itemId) + '"]')
  if (!source || !item) return
  const targetRow = offset ? Math.max(0, Math.min(row + offset, column.items.length - 1)) : target.items.length
  motion.start(item, { column: column.id, row }, source.getBoundingClientRect(), event.detail === 0)
  motion.setTarget({ column: target.id, row: targetRow })
  await reveal(target.id, targetRow)
  await motion.finish()
}

async function openMenu(event: MouseEvent, column: BoardColumn, item: ItemSummary, index: number) {
  const requestId = ++menuRequest
  const count = column.items.length
  const commands: MenuItem[] = [
    { label: 'Move up', disabled: index === 0, command: () => request(event, column.id, item.id, column.id, -1) },
    { label: 'Move down', disabled: index === count - 1, command: () => request(event, column.id, item.id, column.id, 1) },
  ]
  actions.value = [...commands, { label: 'Checking eligible statuses…', disabled: true }]
  menu.value?.toggle(event)
  try {
    const states = await props.destinations(item)
    if (requestId !== menuRequest) return
    actions.value = [...commands, ...states.map(state => ({
      label: props.context.statusLabels[state] ?? state,
      command: () => {
        const target = props.columns.find(column => column.state === state)
        if (target) void request(event, column.id, item.id, target.id)
      },
    }))]
  } catch (error) {
    if (requestId === menuRequest) actions.value = [...commands, { label: workFailure(error).message, disabled: true }]
  }
}

function pageProblem(column: BoardColumn) {
  const problem = props.paging.get(column.id)
  return problem === undefined || problem === true ? undefined : workFailure(problem).message
}
</script>

<template>
  <div v-if="columns.length > 5" class="kanban-window-tools">
    <Select :model-value="activeColumn" :options="jumpOptions"
      option-value="id" option-label="title" aria-label="Jump to status" size="small" @update:model-value="jump" />
  </div>
  <nav v-else-if="mobile && columns.length > 1" class="kanban-status-nav" aria-label="Jump to status">
    <Button v-for="column in columns" :key="column.id" :label="column.title"
      :aria-current="activeColumn === column.id ? 'true' : undefined" size="small"
      outlined severity="secondary" @click="jump(column.id)" />
  </nav>
  <section ref="viewport" class="kanban-board-viewport kx-focus-outline"
    :data-moving="!!pick || moving || undefined" :data-compact="compact || undefined"
    aria-label="Workflow board" tabindex="0" @scroll.passive="horizontal" @keydown="motion.keyboard">
    <div class="kanban-board-track" :style="{ width: contentWidth + 'px' }">
      <section v-for="{ column, index, rows, slots, count, target } in rendered" :key="column.id"
        v-memo="[column, index, rows, slots, count, target, stride, rowStride, context, placements, compact, writable,
          pendingIds, paging, focusItem, firstFocusable, ...rows.map(({ item }) => item && person(item))]"
        class="kanban-column kx-focus-outline"
        :style="{ width: stride - gap + 'px', insetInlineStart: index * stride + 'px' }"
        :data-state="column.state" :data-column-index="index" :data-drop-target="target || undefined"
        :aria-label="column.title" tabindex="-1">
        <header class="kanban-column-head">
          <h2>{{ column.title }}</h2>
          <span class="kanban-column-count">{{ count }}</span>
        </header>
        <div v-column-scroll="column.id" class="kanban-column-body" @scroll.passive="scrollRows(column.id, $event)">
          <div class="kanban-row-track" :style="{ height: slots * rowStride + 'px' }">
            <div v-for="{ row, base, item } in rows" :key="item?.id ?? 'drop-slot'"
              class="kanban-row" :style="{
                insetBlockStart: base * rowStride + 'px', height: rowStride - rowGap + 'px',
                transform: row === base ? undefined : 'translateY(' + (row - base) * rowStride + 'px)',
              }"
              @keydown="item && rove($event, index, row)">
              <IssueCard v-if="item" :item="item" :context="context" :placements="placements" :compact="compact"
                :writable="writable" :pending="pendingIds.has(item.id)" :person="person(item)" :move-help="instructions"
                :tab-index="cardTabIndex(item, index, row)"
                @open="emit('open', item.id)" @focus="focusItem = item.id"
                @menu="openMenu($event, column, item, row)"
                @pickup="motion.pickup($event, { column: column.id, row }, item)"
                @pointer="motion.begin($event, { column: column.id, row }, item)" />
              <div v-else class="kanban-drop-slot" aria-hidden="true" />
            </div>
          </div>
          <div v-if="column.after" class="kanban-column-footer">
            <p v-if="pageProblem(column)" role="alert">{{ pageProblem(column) }}</p>
            <Button :label="pageProblem(column) ? 'Retry' : 'Load more issues'" text size="small" severity="secondary"
              :loading="paging.get(column.id) === true" @click="emit('more', column)" />
          </div>
          <p v-else-if="!slots" class="kanban-column-empty">No issues</p>
        </div>
      </section>
    </div>
  </section>
  <div v-if="liftBox && liftItem" v-show="!landing" ref="lift" class="kanban-drag-lift" :style="liftBox" inert aria-hidden="true">
    <IssueCard :item="liftItem" :context="context" :placements="[]" :compact="compact"
      :writable="writable" :pending="false" :person="person(liftItem)" :tab-index="-1" />
  </div>
  <span :id="instructions" class="kanban-visually-hidden">Press Space to pick up, use arrow keys to move, and press Space to drop or Escape to cancel.</span>
  <span class="kanban-visually-hidden" role="status">{{ announcement }}</span>
  <Menu ref="menu" :model="actions" popup />
</template>
