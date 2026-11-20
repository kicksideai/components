<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { installGraphStyles } from './processGraphStyles'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import { initialGraphView } from './graphViewport'
import { computed, onMounted, onBeforeUnmount, ref, useId, watch } from 'vue'
import type { Declaration, Process, State, Transition } from '../../types'
import { graphLines } from './processLayout'
import { processLayout, stateTitle, transitionTitle, type GraphNode } from './process'
const props = defineProps<{ process: Process; draft: Declaration; selectedState?: State; selectedTransition?: Transition }>()
const emit = defineEmits<{ state: [value: State, opener: SVGElement]; transition: [value: Transition, opener: SVGElement]; connect: [from: string, to: string, opener: SVGElement]; clear: [] }>()
const prefix = useId().replace(/:/g, '_'), connecting = ref(''), canvas = ref<HTMLElement>(), svg = ref<SVGSVGElement>()
const viewportWidth = ref(900), overview = ref(false)
const baseHeight = computed(() => viewportWidth.value < 700 ? 420 : 480)
const layout = computed(() => processLayout(props.process, props.draft, { width: viewportWidth.value, height: baseHeight.value }))
const zoom = ref(1), pan = ref({ x: 0, y: 0 }), ghost = ref({ x: 0, y: 0 })
// The SVG height and viewBox must change together, without waiting for a resize
// notification about a height this component set itself.
const viewport = computed(() => ({ width: viewportWidth.value, height: overview.value ? Math.max(baseHeight.value, layout.value.height * Math.min(1, viewportWidth.value / layout.value.width)) : baseHeight.value }))
const visibleStates = computed(() => layout.value.nodes.filter(n => n.x - n.width / 2 >= pan.value.x && n.x + n.width / 2 <= pan.value.x + viewport.value.width / zoom.value && n.y - n.height / 2 >= pan.value.y && n.y + n.height / 2 <= pan.value.y + viewport.value.height / zoom.value).length)
function initialView() {
  overview.value = false
  const view = initialGraphView(layout.value, viewport.value, props.process.initial)
  zoom.value = view.zoom; pan.value = view.pan
}
const viewBox = computed(() => `${pan.value.x} ${pan.value.y} ${viewport.value.width / zoom.value} ${viewport.value.height / zoom.value}`)
const source = computed(() => layout.value.nodes.find(n => n.state.id === connecting.value))
function fit() {
  overview.value = true
  zoom.value = Math.min(1, viewport.value.width / layout.value.width)
  pan.value = { x: (layout.value.width - viewport.value.width / zoom.value) / 2, y: 0 }
}
function magnify(factor: number) {
  const next = Math.max(.02, Math.min(3, zoom.value * factor)), ratio = 1 / zoom.value - 1 / next
  pan.value = { x: pan.value.x + viewport.value.width * ratio / 2, y: pan.value.y + viewport.value.height * ratio / 2 }; zoom.value = next
}
function reveal(node: { x: number; y: number; width: number; height: number }) {
  const width = viewport.value.width / zoom.value, height = viewport.value.height / zoom.value
  if (node.x - node.width / 2 < pan.value.x || node.x + node.width / 2 > pan.value.x + width || node.y - node.height / 2 < pan.value.y || node.y + node.height / 2 > pan.value.y + height) pan.value = { x: node.x - width / 2, y: node.y - height / 2 }
}
function revealSelection() {
  const selected = layout.value.nodes.find(n => n.state === props.selectedState) ?? layout.value.edges.find(e => e.transition === props.selectedTransition)
  if (selected) reveal(selected)
}
watch([layout, () => props.selectedState, () => props.selectedTransition], revealSelection, { flush: 'post' })
watch(() => props.process.id, () => { connecting.value = ''; pointers.clear(); initialView() }, { flush: 'post' })
function canvasKey(event: KeyboardEvent) {
  if (event.target !== canvas.value) return
  if (event.key === '+' || event.key === '=') { event.preventDefault(); magnify(1.2) }
  if (event.key === '-') { event.preventDefault(); magnify(1 / 1.2) }
  if (event.key === '0') { event.preventDefault(); fit() }
  const delta = 60 / zoom.value
  if (event.key.startsWith('Arrow')) {
    event.preventDefault()
    pan.value = { x: pan.value.x + (event.key === 'ArrowRight' ? delta : event.key === 'ArrowLeft' ? -delta : 0), y: pan.value.y + (event.key === 'ArrowDown' ? delta : event.key === 'ArrowUp' ? -delta : 0) }
  }
}
function finish(state: State, event: Event) { if (connecting.value && connecting.value !== state.id) emit('connect', connecting.value, state.id, event.currentTarget as SVGElement); connecting.value = '' }
function start(event: PointerEvent, node: GraphNode) {
  connecting.value = node.state.id; ghost.value = { x: node.x, y: node.y }
  const element = event.target
  if (element instanceof Element && element.hasPointerCapture?.(event.pointerId)) element.releasePointerCapture(event.pointerId)
}
function keyboard(event: KeyboardEvent, state: State) {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (connecting.value) finish(state, event); else emit('state', state, event.currentTarget as SVGElement) }
  if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) {
    event.preventDefault()
    const stops = Array.from(svg.value?.querySelectorAll<SVGElement>('.work-graph-node') ?? [])
    const index = layout.value.nodes.findIndex(n => n.state === state), direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1
    stops[(index + direction + stops.length) % stops.length]?.focus()
  }
}
function escape() { connecting.value = ''; pointers.clear(); emit('clear') }
const pointers = new Map<number, { x: number; y: number }>()
let previousDistance = 0
function pointerDown(event: PointerEvent) {
  if ((event.target as Element).closest('[role="button"]')) return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  canvas.value?.setPointerCapture?.(event.pointerId)
  if (pointers.size === 2) { const [a, b] = [...pointers.values()]; previousDistance = Math.hypot(a.x - b.x, a.y - b.y) }
}
function pointerMove(event: PointerEvent) {
  const rect = svg.value?.getBoundingClientRect()
  if (!rect?.width) return
  if (connecting.value) { ghost.value = { x: pan.value.x + (event.clientX - rect.left) * viewport.value.width / zoom.value / rect.width, y: pan.value.y + (event.clientY - rect.top) * viewport.value.height / zoom.value / rect.height }; return }
  const old = pointers.get(event.pointerId)
  if (!old) return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()], distance = Math.hypot(a.x - b.x, a.y - b.y)
    if (previousDistance) magnify(distance / previousDistance)
    previousDistance = distance
  } else pan.value = { x: pan.value.x - (event.clientX - old.x) * viewport.value.width / zoom.value / rect.width, y: pan.value.y - (event.clientY - old.y) * viewport.value.height / zoom.value / rect.height }
}
function pointerUp(event: PointerEvent) { pointers.delete(event.pointerId); previousDistance = 0; connecting.value = '' }
function wheel(event: WheelEvent) { if (event.ctrlKey) { event.preventDefault(); magnify(Math.exp(-event.deltaY * .01)) } }
let observer: ResizeObserver | undefined
onMounted(() => {
  if (canvas.value) installGraphStyles(canvas.value)
  if (typeof ResizeObserver !== 'undefined' && svg.value) {
    let initial = true
    observer = new ResizeObserver(() => {
      const rect = svg.value?.getBoundingClientRect()
      if (!rect?.width || !rect.height) return
      const previousWidth = viewport.value.width
      viewportWidth.value = rect.width
      if (initial || Math.abs(rect.width - previousWidth) > 1) {
        if (overview.value) fit(); else initialView()
        initial = false
      }
      revealSelection()
    })
    observer.observe(svg.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())
defineExpose({ fit, zoomIn: () => magnify(1.2), zoomOut: () => magnify(1 / 1.2) })
function icon(state: State) {
  return state.category === 'completed' ? 'check' : state.category === 'canceled' ? 'x' : state.id === props.process.initial ? 'arrow-bar-to-right' : ({ gate: 'shield-check', automated: 'bolt', parallel: 'arrows-split' })[state.kind ?? ''] ?? 'user'
}
</script>
<template>
  <section ref="canvas" class="work-process-canvas" aria-label="Process map" tabindex="0"
    @keydown="canvasKey" @keydown.esc.stop="escape" @pointerdown="pointerDown" @pointermove="pointerMove" @pointerup="pointerUp" @pointercancel="escape" @wheel="wheel">
    <p v-if="connecting" class="work-process-instruction" role="status">Choose the next stop. Escape cancels.</p>
    <svg ref="svg" :style="{ height: viewport.height + 'px' }" :viewBox="viewBox" role="group" aria-label="States and transitions">
      <defs><marker :id="prefix + '-arrow'" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="work-graph-arrow" /></marker></defs>
      <path v-for="lane in layout.parallels" :key="lane.key" :d="lane.path" class="work-lane-line" :marker-end="`url(#${prefix}-arrow)`"><title>Parallel lane from {{ stateTitle(lane.state) }}</title></path>
      <g v-for="edge in layout.edges" :key="edge.key" class="work-graph-edge" :class="['work-edge-' + edge.type, { 'work-selected': selectedTransition === edge.transition }]"
        role="button" tabindex="0" :aria-label="'Edit transition ' + transitionTitle(edge.transition)" :aria-pressed="selectedTransition === edge.transition"
        @focus="reveal(edge)" @click="emit('transition', edge.transition, $event.currentTarget as SVGElement)" @keydown.enter.prevent="emit('transition', edge.transition, $event.currentTarget as SVGElement)" @keydown.space.prevent="emit('transition', edge.transition, $event.currentTarget as SVGElement)">
        <path :d="edge.path" class="work-edge-hit" />
        <path :d="edge.path" class="work-edge-line" :marker-end="`url(#${prefix}-arrow)`" />
        <rect :x="edge.x - edge.width / 2" :y="edge.y - edge.height / 2" :width="edge.width" :height="edge.height" rx="6" class="work-edge-label-bg" />
        <text :x="edge.x" :y="edge.y - (edge.lines.length - 1) * 8 + 4" class="work-edge-label" text-anchor="middle"><tspan v-for="(line, i) in edge.lines" :key="i" :x="edge.x" :dy="i ? 16 : 0">{{ line }}</tspan></text>
      </g>
      <g v-for="node in layout.nodes" :key="node.state.id" class="work-graph-node" :class="['work-stop-' + node.state.category, { 'work-selected': selectedState === node.state }]"
        role="button" tabindex="0" :aria-label="'Edit state ' + stateTitle(node.state)" :aria-pressed="selectedState === node.state"
        @click="emit('state', node.state, $event.currentTarget as SVGElement)" @keydown="keyboard($event, node.state)" @focus="reveal(node)" @pointerup.stop="finish(node.state, $event)">
        <rect :x="node.x - node.width / 2" :y="node.y - node.height / 2" :width="node.width" :height="node.height" rx="10" class="work-state-card" />
        <circle :cx="node.x - node.width / 2 + 22" :cy="node.y - node.height / 2 + 25" r="10" class="work-stop-ring" />
        <Icon :icon="'tabler:' + icon(node.state)" :x="node.x - node.width / 2 + 15" :y="node.y - node.height / 2 + 18" width="14" height="14" class="work-stop-icon" aria-hidden="true" />
        <text :x="node.x - node.width / 2 + 42" :y="node.y - node.height / 2 + 29" class="work-node-name"><tspan v-for="(line, i) in node.title" :key="i" :x="node.x - node.width / 2 + 42" :dy="i ? 18 : 0">{{ line }}</tspan></text>
        <text :x="node.x - node.width / 2 + 16" :y="node.y - node.height / 2 + 33 + node.title.length * 18" class="work-node-meta"><tspan v-for="(line, i) in node.caption" :key="i" :x="node.x - node.width / 2 + 16" :dy="i ? 16 : 0">{{ line }}</tspan><tspan v-if="draft.policy?.wip?.[node.state.id]" class="work-limit-text"> · limit {{ draft.policy.wip[node.state.id].limit }}</tspan></text>
        <g v-for="(transition, badge) in node.badges" :key="transition.id" class="work-any-transition" role="button" tabindex="0" :aria-label="'Edit transition ' + transitionTitle(transition)"
          @click.stop="emit('transition', transition, $event.currentTarget as SVGElement)" @keydown.enter.stop.prevent="emit('transition', transition, $event.currentTarget as SVGElement)" @keydown.space.stop.prevent="emit('transition', transition, $event.currentTarget as SVGElement)">
          <text :x="node.x - node.width / 2 + 16" :y="node.y - node.height / 2 + 33 + node.title.length * 18 + node.caption.length * 16 + node.badges.slice(0, badge).reduce((n, t) => n + graphLines(transitionTitle(t) + ' works from any state').length * 18, 0)" class="work-node-meta"><tspan v-for="(line, i) in graphLines(transitionTitle(transition) + ' works from any state')" :key="i" :x="node.x - node.width / 2 + 16" :dy="i ? 18 : 0">{{ line }}</tspan></text>
        </g>
        <circle v-if="!['completed', 'canceled'].includes(node.state.category)" :cx="layout.direction === 'TB' ? node.x : node.x + node.width / 2" :cy="layout.direction === 'TB' ? node.y + node.height / 2 : node.y" r="7" class="work-node-connector" role="button" tabindex="0" :aria-label="'Connect from ' + stateTitle(node.state)"
          @pointerdown.stop.prevent="start($event, node)" @click.stop="emit('state', node.state, $event.currentTarget as SVGElement)" @keydown.enter.stop.prevent="connecting = node.state.id; ghost = { x: node.x, y: node.y }" @keydown.space.stop.prevent="connecting = node.state.id" />
      </g>
      <path v-if="source" :d="`M ${layout.direction === 'TB' ? source.x : source.x + source.width / 2} ${layout.direction === 'TB' ? source.y + source.height / 2 : source.y} L ${ghost.x} ${ghost.y}`" class="work-connect-ghost" />
    </svg>
    <div v-if="!overview && visibleStates < process.states.length" class="work-process-more" role="status">
      <span>{{ visibleStates }} of {{ process.states.length }} states in view · More {{ layout.direction === 'TB' ? 'below' : 'to the right' }}</span>
      <Button label="Show full process" size="small" text @click="fit()" />
    </div>
    <div class="work-process-legend"><span>{{ process.states.length }} states · {{ Math.round(zoom * 100) }}%</span><span><i></i>Transition</span><span><i class="work-return-key"></i>Return / loop</span><span>Drag to pan · Ctrl + scroll to zoom · Fit for full process</span></div>
  </section>
</template>
