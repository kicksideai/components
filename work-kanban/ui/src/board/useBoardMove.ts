// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { nextTick, onScopeDispose, ref, shallowRef, watch, type Ref } from 'vue'
import type { ItemSummary } from '../presentation/query'
import type { BoardColumn } from '../presentation/usePages'
import { moveIntent, type MoveIntent } from './window'

interface Slot { column: string; row: number }
interface Pick {
  item: ItemSummary
  source: Slot
  target: Slot
  keyboard: boolean
  placed?: boolean
}
interface Point { x: number; y: number }
interface Pointer {
  id: number
  source: Slot
  item: ItemSummary
  rect: DOMRect
  start: Point
  point: Point
  overBoard: boolean
  rtl: boolean
}
export type MoveResult =
  | { status: 'applied'; sequence?: number }
  | { status: 'fields' | 'rejected' }

interface Options {
  viewport: Ref<HTMLElement | undefined>
  active: () => boolean
  columns: () => readonly BoardColumn[]
  columnElement: (index: number) => HTMLElement | null | undefined
  columnStride: () => number
  rowStride: () => number
  rowGap: () => number
  canMove: (id: string) => boolean
  hold: (columns: string[]) => void
  move: (intent: MoveIntent) => Promise<MoveResult>
  reveal: (column: string, row: number) => Promise<void>
  focus: (item: string, status: string) => Promise<void>
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
const transform = ({ x, y }: Point) => 'translate3d(' + x + 'px,' + y + 'px,0)'
const position = (event: PointerEvent): Point => ({ x: event.clientX, y: event.clientY })
function edgeSpeed(value: number, start: number, end: number) {
  const edge = Math.min(48, (end - start) / 3)
  if (value < start + edge) return -Math.round(18 * clamp((start + edge - value) / edge, 0, 1))
  if (value > end - edge) return Math.round(18 * clamp((value - end + edge) / edge, 0, 1))
  return 0
}

export function useBoardMove(options: Options) {
  const pick = shallowRef<Pick>()
  const lift = ref<HTMLElement>()
  const liftItem = shallowRef<ItemSummary>()
  const liftBox = shallowRef<{ width: string; height: string; transform: string }>()
  const landing = ref(false)
  const announcement = ref('')
  const moving = ref(false)
  let pointer: Pointer | undefined
  let frame = 0
  let owner: Window | null | undefined
  let animation: Animation | undefined
  let lastPoint: Point
  let committed: { sequence?: number; source: BoardColumn; target: BoardColumn } | undefined
  let disposed = false

  const column = (id: string) => options.columns().find(column => column.id === id)
  const indexOf = (id: string) => options.columns().findIndex(column => column.id === id)
  const body = (id: string) => options.columnElement(indexOf(id))?.querySelector<HTMLElement>('.kanban-column-body')
  function pointLift(point: Point) {
    lastPoint = point
    if (lift.value) lift.value.style.transform = transform(point)
    else if (liftBox.value) liftBox.value = { ...liftBox.value, transform: transform(point) }
  }
  function showLift(rect: DOMRect) {
    lastPoint = { x: rect.left, y: rect.top }
    liftBox.value = { width: rect.width + 'px', height: rect.height + 'px', transform: transform(lastPoint) }
  }
  function setTarget(target: Slot) {
    const current = pick.value
    if (!current || current.target.column === target.column && current.target.row === target.row) return
    pick.value = { ...current, target }
    if (current.target.column !== target.column) options.hold([...new Set([current.source.column, target.column])])
    announcement.value = column(target.column)?.title + ', position ' + (target.row + 1) + '.'
  }
  function start(item: ItemSummary, source: Slot, rect: DOMRect, keyboard: boolean) {
    pick.value = { item, source, target: source, keyboard }
    liftItem.value = item
    showLift(rect)
    options.hold([source.column])
    announcement.value = 'Picked up ' + item.key + '. ' + column(source.column)?.title + ', position ' + (source.row + 1) + '.'
    if (keyboard) options.viewport.value?.focus({ preventScroll: true })
  }

  function begin(event: PointerEvent, source: Slot, item: ItemSummary) {
    if (event.button !== 0 || !event.isPrimary || pointer || pick.value || moving.value || !options.canMove(item.id)) return
    const card = (event.currentTarget as HTMLElement).closest('[data-card-id]')
    if (!card) return
    const start = position(event)
    pointer = { id: event.pointerId, source, item, rect: card.getBoundingClientRect(), start, point: start,
      overBoard: true, rtl: getComputedStyle(card).direction === 'rtl' }
  }
  function pointerMove(event: PointerEvent) {
    const down = pointer
    if (!down || event.pointerId !== down.id) return
    down.point = position(event)
    if (!pick.value) {
      if (Math.hypot(down.point.x - down.start.x, down.point.y - down.start.y) < 5) return
      options.viewport.value?.setPointerCapture(down.id)
      start(down.item, down.source, down.rect, false)
    }
    if (!frame) frame = requestAnimationFrame(tick)
  }
  function pointerTarget(down: Pointer, current: Pick) {
    const viewport = options.viewport.value
    if (!viewport) return
    const { x, y } = down.point
    const rect = viewport.getBoundingClientRect()
    down.overBoard = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    if (!down.overBoard) return
    const oldX = viewport.scrollLeft
    const along = down.rtl ? rect.right - x - oldX : x - rect.left + oldX
    const index = clamp(Math.floor(along / options.columnStride()), 0, options.columns().length - 1)
    const target = options.columns()[index]
    const scroll = options.columnElement(index)?.querySelector<HTMLElement>('.kanban-column-body')
    if (!target || !scroll) return
    const scrollRect = scroll.getBoundingClientRect()
    const oldY = scroll.scrollTop
    const stride = options.rowStride()
    const maximum = target.items.length - Number(target.id === current.source.column)
    let offset = y - scrollRect.top - options.rowGap() + oldY
    const prior = current.target.column === target.id ? current.target.row : undefined
    if (prior !== undefined && offset >= prior * stride) {
      offset = Math.max(prior * stride, offset - stride)
    }
    setTarget({ column: target.id, row: clamp(Math.floor(offset / stride + .5), 0, maximum) })
    const dx = edgeSpeed(x, rect.left, rect.right)
    const dy = edgeSpeed(y, scrollRect.top, rect.bottom)
    const maxX = dx ? viewport.scrollWidth - viewport.clientWidth : 0
    const nextX = dx ? clamp(oldX + dx, down.rtl ? -maxX : 0, down.rtl ? 0 : maxX) : oldX
    const nextY = dy ? clamp(oldY + dy, 0, scroll.scrollHeight - scroll.clientHeight) : oldY
    return { viewport, scroll, oldX, oldY, nextX, nextY }
  }
  function tick() {
    frame = 0
    const down = pointer
    const current = pick.value
    if (!down || !current) return
    const scroll = pointerTarget(down, current)
    followPointer(down)
    if (!scroll) return
    const { oldX, oldY, nextX, nextY } = scroll
    if (oldX !== nextX) scroll.viewport.scrollLeft = nextX
    if (oldY !== nextY) scroll.scroll.scrollTop = nextY
    if (oldX !== nextX || oldY !== nextY) frame = requestAnimationFrame(tick)
  }
  function followPointer(down: Pointer) {
    pointLift({
      x: down.rect.left + down.point.x - down.start.x,
      y: down.rect.top + down.point.y - down.start.y,
    })
  }

  function releasePointer() {
    if (pointer && options.viewport.value?.hasPointerCapture(pointer.id)) options.viewport.value.releasePointerCapture(pointer.id)
    pointer = undefined
    cancelAnimationFrame(frame)
    frame = 0
  }
  function pointerEnd(event: PointerEvent) {
    const down = pointer
    if (!down || event.pointerId !== down.id) return
    const current = pick.value
    if (current && event.type === 'pointerup') {
      down.point = position(event)
      pointerTarget(down, current)
      followPointer(down)
    }
    releasePointer()
    if (!current) return
    if (event.type === 'pointerup' && down.overBoard) void finish()
    else void cancel()
  }

  function destinationRect(slot: Slot) {
    const node = body(slot.column)
    if (!node) return
    const track = node.querySelector('.kanban-row-track')?.getBoundingClientRect()
    if (!track) return
    const top = track.top + slot.row * options.rowStride()
    const clip = node.getBoundingClientRect()
    const viewport = options.viewport.value?.getBoundingClientRect()
    if (!viewport || top + options.rowStride() < clip.top || top > clip.bottom || track.right < viewport.left || track.left > viewport.right) return
    return { x: track.left, y: top }
  }
  async function glide(target?: Point) {
    const element = lift.value
    if (!element || owner?.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const to = target ? { transform: transform(target) } : { opacity: 0 }
    animation?.cancel()
    animation = element.animate([{ transform: transform(lastPoint) }, to], {
      duration: 150, easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'forwards',
    })
    await animation.finished.catch(() => undefined)
    if (target) pointLift(target)
    animation?.cancel()
  }
  function intentFor(current: Pick, source: BoardColumn, target: BoardColumn) {
    const others = target.items.filter(item => item.id !== current.item.id)
    const next = others[current.target.row]
    return moveIntent(current.item.id, source.state, target.state, target.items.map(item => item.id),
      next?.id, next ? 'before' : 'after')
  }
  function clearLift() {
    liftBox.value = undefined
    liftItem.value = undefined
    landing.value = false
  }
  async function cancel(restoreFocus = true) {
    const current = pick.value
    if (!current || moving.value) return
    releasePointer()
    moving.value = true
    pick.value = undefined
    options.hold([])
    await nextTick()
    await glide(destinationRect(current.source))
    clearLift()
    announcement.value = 'Move cancelled.'
    moving.value = false
    const source = column(current.source.column)
    if (restoreFocus && current.keyboard && source) await options.focus(current.item.id, source.state)
  }
  function confirmed() {
    const current = pick.value
    if (!committed || !current) return
    const source = column(current.source.column)
    const target = column(current.target.column)
    if (!source || !target || (committed.sequence === undefined
      ? source !== committed.source && target !== committed.target
      : (source.asOf ?? -1) >= committed.sequence && (target.asOf ?? -1) >= committed.sequence)) {
      pick.value = undefined
      committed = undefined
      moving.value = false
    }
  }
  watch(options.columns, confirmed)
  async function finish() {
    const current = pick.value
    if (!current || moving.value) return
    const source = column(current.source.column)
    const target = column(current.target.column)
    const intent = source && target && intentFor(current, source, target)
    if (!source || !target || !intent || !options.canMove(current.item.id)) {
      await cancel()
      return
    }
    moving.value = true
    const at = destinationRect(current.target)
    pick.value = { ...current, placed: true }
    options.hold([])
    const write = options.move(intent)
    await nextTick()
    await glide(at)
    landing.value = true
    const result = await write
    if (disposed) return
    if (result.status === 'applied') {
      clearLift()
      announcement.value = 'Moved ' + current.item.key + ' to ' + target.title + '.'
      committed = { sequence: result.sequence, source, target }
      confirmed()
      if (current.keyboard) await options.focus(current.item.id, target.state)
      return
    }
    landing.value = false
    pick.value = undefined
    await nextTick()
    await glide(destinationRect(current.source))
    clearLift()
    announcement.value = result.status === 'fields' ? 'Complete the required fields to move ' + current.item.key + '.' : 'Move refused. ' + current.item.key + ' returned to ' + source.title + '.'
    moving.value = false
    if (current.keyboard && result.status !== 'fields') await options.focus(current.item.id, source.state)
  }
  function pickup(event: KeyboardEvent, source: Slot, item: ItemSummary) {
    if (event.key !== ' ' || pick.value || moving.value || !options.canMove(item.id)) return
    const card = (event.currentTarget as HTMLElement).closest('[data-card-id]')
    if (!card) return
    event.preventDefault()
    event.stopPropagation()
    start(item, source, card.getBoundingClientRect(), true)
  }
  async function keyboard(event: KeyboardEvent) {
    const current = pick.value
    if (!current?.keyboard || current.placed || moving.value) return
    const { key } = event
    if (key === 'Tab') { void cancel(false); return }
    if (![' ', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return
    event.preventDefault()
    if (key === ' ' || key === 'Enter') { await finish(); return }
    const horizontal = key === 'ArrowLeft' || key === 'ArrowRight'
    const delta = key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 1
    const rtl = options.viewport.value && getComputedStyle(options.viewport.value).direction === 'rtl'
    const index = indexOf(current.target.column)
    const target = options.columns()[clamp(index + (horizontal ? delta * (rtl ? -1 : 1) : 0), 0, options.columns().length - 1)]
    if (!target) return
    const row = clamp(current.target.row + (horizontal ? 0 : delta), 0, target.items.length - Number(target.id === current.source.column))
    setTarget({ column: target.id, row })
    await options.reveal(target.id, row)
    const at = destinationRect({ column: target.id, row })
    if (at && pick.value?.target.column === target.id && pick.value.target.row === row) pointLift(at)
  }
  function escape(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !pick.value || moving.value) return
    event.preventDefault()
    event.stopPropagation()
    void cancel()
  }
  function blur() {
    if (pick.value && !moving.value) void cancel(false)
    else if (pointer) releasePointer()
  }
  watch([options.viewport, options.active], ([element, active], _, cleanup) => {
    const window = element?.ownerDocument.defaultView
    if (!active || !window) return
    owner = window
    window.addEventListener('pointermove', pointerMove, { passive: true })
    window.addEventListener('pointerup', pointerEnd)
    window.addEventListener('pointercancel', pointerEnd)
    window.addEventListener('keydown', escape, true)
    window.addEventListener('blur', blur)
    cleanup(() => {
      window.removeEventListener('pointermove', pointerMove)
      window.removeEventListener('pointerup', pointerEnd)
      window.removeEventListener('pointercancel', pointerEnd)
      window.removeEventListener('keydown', escape, true)
      window.removeEventListener('blur', blur)
      releasePointer()
      if (pick.value && !moving.value) void cancel(false)
    })
  }, { flush: 'post' })
  onScopeDispose(() => {
    disposed = true
    releasePointer()
    animation?.cancel()
    options.hold([])
  })

  return { pick, moving, lift, liftItem, liftBox, landing, announcement, begin, pickup, keyboard, finish, start, setTarget }
}
