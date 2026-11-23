<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import type { MenuItem } from 'primevue/menuitem'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import { computed, nextTick, onMounted, onScopeDispose, ref, shallowRef, watch } from 'vue'
import type { WorkExtension } from '../work/types'
import { workFailure } from '../work/errors'
import type { PresentationContext } from '../presentation/context'
import type { ItemSummary } from '../presentation/query'
import type { BoardColumn } from '../presentation/usePages'
import IssueCard from './IssueCard.vue'
import { boardWindow, moveIntent, rowWindow, type MoveIntent } from './window'

const props = defineProps<{
  columns: BoardColumn[]
  context: PresentationContext
  placements: readonly WorkExtension[]
  writable: boolean
  pendingIds: ReadonlySet<string>
  paging: ReadonlyMap<string, unknown>
  person: (item: ItemSummary) => string | undefined
  destinations: (item: ItemSummary) => Promise<string[]>
}>()
const emit = defineEmits<{
  open: [item: string], more: [column: BoardColumn], move: [intent: MoveIntent],
  visible: [ids: string[]], hold: [ids: string[]], window: [column: string, firstRow: number],
}>()
const viewport = ref<HTMLElement>()
const menu = ref<InstanceType<typeof Menu>>()
const actions = shallowRef<MenuItem[]>([])
const width = ref(1100)
const height = ref(650)
const x = ref(0)
const compact = ref(false)
const focusItem = ref<string>()
const y = shallowRef(new Map<string, number>())
const drag = shallowRef<{ item: string, source: string, column: string }>()
const gap = 8
const rowStride = computed(() => compact.value ? 82 : 94)
const mobile = computed(() => width.value <= 520)
const stride = computed(() => mobile.value ? width.value + gap : Math.max(176, Math.min(286, (width.value + gap) / Math.min(5, props.columns.length || 1))))
const pinned = computed(() => drag.value ? props.columns.findIndex(column => column.id === drag.value?.column) : undefined)
const visible = computed(() => boardWindow(x.value, width.value, stride.value, props.columns.length, pinned.value))
const activeColumn = computed(() => props.columns[Math.round(x.value / stride.value)]?.id)
const jumpOptions = computed(() => props.columns.map(column => ({ id: column.id, title: column.title + ' (' + column.count + ')' })))
const firstFocusable = computed(() => visible.value.find(index => props.columns[index].items.length > 0))
let observer: ResizeObserver | undefined
let menuRequest = 0
let frame = 0
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
    const oldIndex = Math.floor(body.scrollTop / stride)
    const anchor = prior.items[oldIndex]
    const newIndex = anchor && column.items.findIndex(item => item.id === anchor.id)
    if (newIndex !== undefined && newIndex >= 0 && oldIndex !== newIndex) {
      offsets.set(column.id, body.scrollTop + (newIndex - oldIndex) * stride)
    }
  }
  if ([...offsets].every(([id, offset]) => y.value.get(id) === offset)) return
  y.value = offsets
  await nextTick()
  for (const index of visible.value) {
    const body = columnElement(index)?.querySelector<HTMLElement>('.kanban-column-body')
    if (body) body.scrollTop = offsets.get(props.columns[index].id) ?? 0
  }
})
onMounted(() => {
  const element = viewport.value
  if (!element) return
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
  emit('hold', [])
})

function rows(column: BoardColumn) {
  const index = drag.value?.column === column.id ? column.items.findIndex(item => item.id === drag.value?.item) : undefined
  return rowWindow(y.value.get(column.id) ?? 0, Math.max(0, height.value - 46), rowStride.value, column.items.length, index)
}
function scrollRows(column: string, event: Event) {
  pendingScroll.set(column, (event.currentTarget as HTMLElement).scrollTop)
  if (frame) return
  frame = requestAnimationFrame(() => {
    y.value = new Map([...y.value, ...pendingScroll])
    for (const [id, offset] of pendingScroll) emit('window', id, Math.floor(offset / rowStride.value))
    pendingScroll.clear()
    frame = 0
  })
}
function horizontal(event: Event) {
  x.value = (event.currentTarget as HTMLElement).scrollLeft
}
const vColumnScroll = {
  mounted(element: HTMLElement, { value }: { value: string }) {
    element.scrollTop = y.value.get(value) ?? 0
  },
}
async function jump(id: string) {
  const index = props.columns.findIndex(column => column.id === id)
  if (index >= 0 && viewport.value) {
    x.value = Math.min(index * stride.value, viewport.value.scrollWidth - viewport.value.clientWidth)
    await nextTick()
    if (viewport.value) viewport.value.scrollLeft = x.value
  }
}
function columnElement(index: number) {
  return viewport.value?.querySelector<HTMLElement>('[data-column-index="' + index + '"]')
}
async function restore(id: string, status?: string) {
  let columnIndex = props.columns.findIndex(column => column.items.some(item => item.id === id))
  if (columnIndex < 0 && status) columnIndex = props.columns.findIndex(column => column.state === status)
  const column = props.columns[columnIndex]
  if (!column) {
    viewport.value?.focus()
    return
  }
  if (!visible.value.includes(columnIndex)) await jump(column.id)
  await nextTick()
  const node = columnElement(columnIndex)
  const index = column.items.findIndex(item => item.id === id)
  if (index < 0 || !node) {
    node?.focus()
    return
  }
  const body = node.querySelector<HTMLElement>('.kanban-column-body')
  if (body) {
    const start = index * rowStride.value
    if (start < body.scrollTop || start + rowStride.value > body.scrollTop + body.clientHeight) {
      body.scrollTop = start
      y.value = new Map(y.value).set(column.id, body.scrollTop)
      await nextTick()
    }
  }
  focusItem.value = id
  node.querySelector<HTMLElement>('[data-card-id="' + CSS.escape(id) + '"] .kanban-card-title')?.focus()
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

function beginDrag(event: DragEvent, column: BoardColumn, item: ItemSummary) {
  if (!props.writable || props.pendingIds.has(item.id) || !event.dataTransfer) {
    event.preventDefault()
    return
  }
  drag.value = { item: item.id, source: column.state, column: column.id }
  emit('hold', [column.id])
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', item.id)
}
function over(event: DragEvent, column: BoardColumn) {
  if (!drag.value) return
  event.preventDefault()
  emit('hold', [...new Set([drag.value.column, column.id])])
}
function endDrag() {
  if (!drag.value) return
  drag.value = undefined
  emit('hold', [])
}
function request(intent?: MoveIntent) {
  if (intent && props.writable && !props.pendingIds.has(intent.item)) emit('move', intent)
}
function drop(event: DragEvent, column: BoardColumn) {
  const dragged = drag.value
  if (!dragged) return
  event.preventDefault()
  const card = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-card-id]') : null
  const rect = card?.getBoundingClientRect()
  const side = rect && event.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
  request(moveIntent(dragged.item, dragged.source, column.state, column.items.map(item => item.id), card?.dataset.cardId, side))
  endDrag()
}

async function openMenu(event: MouseEvent, column: BoardColumn, item: ItemSummary, index: number) {
  const requestId = ++menuRequest
  const ids = column.items.map(row => row.id)
  const commands: MenuItem[] = [
    { label: 'Move up', disabled: index === 0, command: () => request(moveIntent(item.id, column.state, column.state, ids, ids[index - 1], 'before')) },
    { label: 'Move down', disabled: index === ids.length - 1, command: () => request(moveIntent(item.id, column.state, column.state, ids, ids[index + 1], 'after')) },
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
        if (target) request(moveIntent(item.id, column.state, target.state, target.items.map(row => row.id)))
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
  <div class="kanban-window-tools">
    <Select v-if="mobile || columns.length > 5" :model-value="activeColumn" :options="jumpOptions"
      option-value="id" option-label="title" aria-label="Jump to status" size="small" @update:model-value="jump" />
    <Button :label="compact ? 'Compact' : 'Standard'" :aria-pressed="compact" size="small" text severity="secondary"
      aria-label="Compact card density" @click="compact = !compact" />
  </div>
  <section ref="viewport" class="kanban-board-viewport kx-focus-outline" :class="{ 'kanban-board-mobile': mobile }"
    aria-label="Workflow board" tabindex="0" @scroll.passive="horizontal">
    <div class="kanban-board-track" :style="{ width: Math.max(width, stride * columns.length - gap) + 'px' }">
      <section v-for="columnIndex in visible" :key="columns[columnIndex].id" class="kanban-column kx-focus-outline"
        :style="{ width: stride - gap + 'px', insetInlineStart: columnIndex * stride + 'px' }"
        :data-state="columns[columnIndex].state" :data-column-index="columnIndex"
        :aria-label="columns[columnIndex].title" tabindex="-1"
        @dragover="over($event, columns[columnIndex])" @drop="drop($event, columns[columnIndex])">
        <header class="kanban-column-head">
          <h2>{{ columns[columnIndex].title }}</h2>
          <Tag class="kx-tag-sm" severity="secondary" :value="columns[columnIndex].count" />
        </header>
        <div v-column-scroll="columns[columnIndex].id"
          class="kanban-column-body" @scroll.passive="scrollRows(columns[columnIndex].id, $event)">
          <div class="kanban-row-track" :style="{ height: columns[columnIndex].items.length * rowStride + 'px' }">
            <div v-for="itemIndex in rows(columns[columnIndex])" :key="columns[columnIndex].items[itemIndex].id"
              class="kanban-row" :style="{ insetBlockStart: itemIndex * rowStride + 'px', height: rowStride - gap + 'px' }"
              :draggable="writable && !pendingIds.has(columns[columnIndex].items[itemIndex].id)"
              @dragstart="beginDrag($event, columns[columnIndex], columns[columnIndex].items[itemIndex])" @dragend="endDrag"
              @keydown="rove($event, columnIndex, itemIndex)">
              <IssueCard :item="columns[columnIndex].items[itemIndex]" :context="context" :placements="placements"
                :writable="writable" :pending="pendingIds.has(columns[columnIndex].items[itemIndex].id)"
                :person="person(columns[columnIndex].items[itemIndex])"
                :tab-index="focusItem === columns[columnIndex].items[itemIndex].id || (!focusItem && columnIndex === firstFocusable && itemIndex === 0) ? 0 : -1"
                @open="emit('open', columns[columnIndex].items[itemIndex].id)"
                @focus="focusItem = columns[columnIndex].items[itemIndex].id"
                @menu="openMenu($event, columns[columnIndex], columns[columnIndex].items[itemIndex], itemIndex)" />
            </div>
          </div>
          <div v-if="columns[columnIndex].after" class="kanban-column-footer">
            <p v-if="pageProblem(columns[columnIndex])" role="alert">{{ pageProblem(columns[columnIndex]) }}</p>
            <Button :label="pageProblem(columns[columnIndex]) ? 'Retry' : 'Load more issues'" text size="small" severity="secondary"
              :loading="paging.get(columns[columnIndex].id) === true" @click="emit('more', columns[columnIndex])" />
          </div>
          <p v-else-if="!columns[columnIndex].items.length" class="kanban-column-empty">No issues</p>
        </div>
      </section>
    </div>
  </section>
  <Menu ref="menu" :model="actions" popup />
</template>
