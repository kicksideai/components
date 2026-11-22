<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { Icon } from '@iconify/vue'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import NativeDialog from '../../NativeDialog.vue'
import ProcessGraph from './ProcessGraph.vue'
import ProcessList from './ProcessList.vue'
import ProcessInspector from './ProcessInspector.vue'
import { uniqueId, stateUses, transitionUses, stateTitle, mainPath } from './process'
import { type RemovalGuard, type SchemaChange, changeReason, removeEntry } from './model'
import type { Declaration, InstalledRule, ItemType, Process, State, StateCounts, Transition } from '../../types'
import { sectionRow } from './sectionRow'
const props = defineProps<{ draft: Declaration; guardRemoval?: RemovalGuard; issues?: SchemaChange[]; boardId?: string; counts?: StateCounts; countTypes?: ItemType[]; guards?: InstalledRule[]; createForItemType?: boolean; creationOpener?: HTMLElement }>()
const emit = defineEmits<{ validity: [key: string, valid: boolean]; created: [id: string]; 'cancel-creation': [] }>()
const location = inject(sectionRow, undefined)
const processes = computed(() => props.draft.processes ?? [])
const creating = ref(false), newName = ref(''), selected = ref(''), error = ref(''), mode = ref('Map')
watch(() => props.createForItemType, (active, previous) => {
  if (!active && !previous) return
  newName.value = ''
  creating.value = !!active
}, { immediate: true })
const selectedState = ref<State>(), selectedTransition = ref<Transition>(), graph = ref<InstanceType<typeof ProcessGraph>>()
const editor = ref<HTMLElement>(), inspector = ref<InstanceType<typeof ProcessInspector>>(), tools = ref<HTMLElement>()
const insertions = new WeakMap<State, { entry: Transition; continuation?: Transition; automatic: boolean }>()
type InspectorOpener = HTMLElement | SVGElement
const process = computed(() => processes.value.find(p => p.id === selected.value) ?? processes.value[0])
const insertedRoute = computed(() => {
  const state = selectedState.value
  const workflow = process.value
  const insertion = state && insertions.get(state)
  if (!state || !workflow || !insertion) return
  const { entry, continuation } = insertion
  if (!workflow.transitions?.includes(entry) || entry.to !== state.id) return
  const names = [
    entry.from === 'any' ? 'Any state' : entry.from.map(id => stateTitle(workflow.states.find(s => s.id === id))).join(', '),
    stateTitle(state),
  ]
  if (continuation && workflow.transitions.includes(continuation) && (continuation.from === 'any' || continuation.from.includes(state.id))) {
    names.push(stateTitle(workflow.states.find(s => s.id === continuation.to)))
  }
  return names.join(' → ')
})
const modeChosen = ref(false)
function setMode(value: string) {
  modeChosen.value = true
  mode.value = value
}
function defaultMode() {
  if (!modeChosen.value && editor.value?.clientWidth)
    mode.value = editor.value.clientWidth < 480 && (process.value?.states.length ?? 0) > 6 ? 'List' : 'Map'
}
let observer: ResizeObserver | undefined
onMounted(() => {
  defaultMode()
  if (editor.value && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(defaultMode)
    observer.observe(editor.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())
watch(process, () => { modeChosen.value = false; defaultMode() })

function clear() {
  inspector.value?.reset()
  selectedState.value = undefined
  selectedTransition.value = undefined
  error.value = ''
}
function closeInspector() {
  const selected = location?.selected.value
  if (selected?.startsWith('workflow/')) location?.choose('workflow', selected.slice('workflow/'.length), false)
  clear()
}
function focusEditor() {
  if (mode.value === 'Map') graph.value?.focus()
  else tools.value?.focus()
}
function chooseState(state: State, opener?: InspectorOpener) {
  selectedState.value = state
  selectedTransition.value = undefined
  error.value = ''
  if (process.value) location?.choose('workflow', process.value.id + '.state.' + state.id, true)
  void inspector.value?.open(opener)
}
function chooseTransition(transition: Transition, opener?: InspectorOpener) {
  selectedTransition.value = transition
  selectedState.value = undefined
  error.value = ''
  if (process.value) location?.choose('workflow', process.value.id + '.transition.' + transition.id, true)
  void inspector.value?.open(opener)
}
watch([process, mode], clear)
watch([() => location?.selected.value, processes], async ([selectedRoute], previous) => {
  if (!selectedRoute?.startsWith('workflow/')) {
    if (previous?.[0]?.startsWith('workflow/')) clear()
    return
  }
  const [processId, kind, id] = selectedRoute.slice('workflow/'.length).split('.')
  const workflow = processes.value.find(row => row.id === processId)
  if (!workflow) return
  if (process.value !== workflow) {
    selected.value = workflow.id
    await nextTick()
    if (location?.selected.value !== selectedRoute) return
  }
  const state = kind === 'state' ? workflow.states.find(row => row.id === id) : undefined
  const transition = kind === 'transition' ? workflow.transitions?.find(row => row.id === id) : undefined
  if (state === selectedState.value && transition === selectedTransition.value) return
  clear()
  selectedState.value = state
  selectedTransition.value = transition
}, { immediate: true, flush: 'post' })
const processCounts = computed(() => {
  if (!props.counts || !process.value) return
  const types = props.countTypes?.filter(type => type.process === process.value?.id) ?? []
  return Object.fromEntries(process.value.states.map(state => [state.id,
    types.reduce((count, type) => count + (props.counts?.[type.id]?.[state.id] ?? 0), 0),
  ]))
})
const visibleGuards = computed(() => (props.guards ?? []).filter(guard =>
  props.draft.plugins?.some(plugin => plugin.use === guard.plugin)))
const staleLimits = computed(() => Object.keys(props.draft.policy?.wip ?? {}).filter(id =>
  !processes.value.some(workflow => workflow.states.some(state => state.id === id))))
function add() {
  const name = newName.value.trim()
  if (!name) return
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'process'
  const prefix = (/^[a-z]/.test(base) ? base : 'process_' + base).slice(0, 40)
  const code = processes.value.some(p => p.id === prefix) ? uniqueId(prefix, processes.value) : prefix
  ;(props.draft.processes ??= []).push({ id: code, name, initial: 'todo', states: [{ id: 'todo', name: 'To do', category: 'unstarted' }], transitions: [] })
  selected.value = code; newName.value = ''; creating.value = false
  emit('created', code)
}
function cancelCreate() {
  creating.value = false
  emit('cancel-creation')
}
async function addState(p: Process, opener: HTMLElement) {
  const state: State = { id: uniqueId('state', p.states), name: 'New state', category: 'started' }
  const main = mainPath(p), last = main.at(-1)
  const after = selectedState.value ?? (last?.category === 'completed' ? main.at(-2) : last)
  const afterIndex = after ? p.states.indexOf(after) : -1
  const index = after ? afterIndex + 1 : p.states.length
  const outgoing = after && p.transitions?.filter(t =>
    t.from !== 'any' && t.from.length === 1 && t.from[0] === after.id && !transitionUses(p, t).length)
  const entry = outgoing?.find(t => t.default) ?? outgoing?.find(t => p.states.findIndex(s => s.id === t.to) > afterIndex)
  p.states.splice(index, 0, state)
  const inserted = p.states[index]
  if (after && after.category !== 'completed' && after.category !== 'canceled') {
    const transitions = (p.transitions ??= [])
    const automatic = entry?.auto === true && entry.default === true
    const continuation: Transition = {
      id: uniqueId('transition', transitions),
      name: 'Continue',
      from: [entry ? inserted.id : after.id],
      to: entry?.to ?? inserted.id,
      ...(automatic ? { auto: true, default: true } : {}),
    }
    if (entry) entry.to = inserted.id
    transitions.push(continuation)
    const added = transitions[transitions.length - 1]
    insertions.set(inserted, { entry: entry ?? added, continuation: entry ? added : undefined, automatic })
  }
  chooseState(inserted, opener)
  await inspector.value?.editName()
}
function setInsertionKind(state: State, kind: string) {
  const insertion = insertions.get(state)
  const continuation = insertion?.continuation
  if (!continuation || insertion.automatic || continuation.from === 'any' ||
      continuation.from.length !== 1 || continuation.from[0] !== state.id) return
  if (kind === 'gate') {
    continuation.auto = true
    continuation.default = true
  } else {
    delete continuation.auto
    delete continuation.default
  }
}
function connect(from: string, to: string, opener?: InspectorOpener) {
  const p = process.value
  if (!p || !to || from === to) return
  const transitions = (p.transitions ??= [])
  const base = `to_${to}`
  let id = base.slice(0, 40), index = 2
  while (transitions.some(transition => transition.id === id)) {
    const suffix = `_${index++}`
    id = base.slice(0, 40 - suffix.length) + suffix
  }
  const transition: Transition = { id, name: `To ${stateTitle(p.states.find(s => s.id === to)).toLowerCase()}`, from: [from], to }
  transitions.push(transition)
  chooseTransition(transition, opener)
}
function addTransition(p: Process, opener: HTMLElement) {
  const source = selectedState.value ?? p.states.find(state => state.id === p.initial) ?? p.states[0]
  const destination = p.states.find(state => state.id !== source?.id)
  if (!source || !destination) return
  const transition: Transition = { id: uniqueId('transition', p.transitions ?? []), name: 'To ' + stateTitle(destination), from: [source.id], to: destination.id }
  ;(p.transitions ??= []).push(transition); chooseTransition(transition, opener)
}
async function removeTransition(transition: Transition) {
  const p = process.value
  const index = p?.transitions?.indexOf(transition) ?? -1
  if (!p || index < 0) return
  const uses = transitionUses(p, transition)
  if (uses.length) { error.value = `Used by ${uses.join(', ')}. Update those references first.`; return }
  p.transitions!.splice(index, 1)
  clear()
  await nextTick()
  focusEditor()
}
function removeState(p: Process, state: State) {
  const uses = stateUses(p, state)
  if (uses.length) { error.value = `${stateTitle(state)} is used by ${uses.join(', ')}. Update these references first.`; return }
  p.states.splice(p.states.indexOf(state), 1); void inspector.value?.close()
}
async function remove(p: Process) {
  const used = props.draft.item_types?.filter(type => type.process === p.id).map(type => type.title || 'Untitled item type') ?? []
  if (used.length) { error.value = `Used by ${used.join(', ')}. Choose a different workflow for those item types first.`; return }
  const refusal = await props.guardRemoval?.('processes', p.id)
  if (refusal) { error.value = refusal; return }
  removeEntry(props.draft, 'processes', p.id); selected.value = ''; clear()
}
</script>
<template>
  <section ref="editor" class="work-process-editor work-stack" aria-label="Workflow editor" @keydown.esc="(selectedState || selectedTransition) && inspector?.close()">
    <p v-if="error && !selectedTransition" class="kx-err" role="alert">{{ error }}</p>
    <p
      v-for="issue in issues?.filter((i) => i.code === 'process ' + process?.id) ?? []"
      :key="issue.what + issue.detail"
      class="work-error work-small"
      role="alert"
    >
      {{ changeReason(issue) }} · {{ issue.what }}
    </p>
    <div
      v-if="process"
      class="work-process-builder"
      :class="{ 'work-process-inspecting': selectedState || selectedTransition }"
    >
      <div ref="tools" class="work-process-controls" role="toolbar" aria-label="Workflow tools" tabindex="-1">
        <Select
          v-if="processes.length > 1"
          :model-value="process.id"
          aria-label="Workflow"
          appendTo="self"
          optionLabel="label"
          optionValue="value"
          :options="processes.map(p => ({ label: p.name || 'Untitled workflow', value: p.id }))"
          @update:model-value="selected = $event"
        />
        <strong v-else>{{ process.name || 'Untitled workflow' }}</strong>
        <Button label="Add state" severity="secondary" outlined @click="addState(process, $event.currentTarget as HTMLElement)"
          ><template #icon><Icon icon="tabler:plus" /></template
        ></Button>
        <Button label="Add transition" severity="secondary" outlined :disabled="process.states.length < 2"
          @click="addTransition(process, $event.currentTarget as HTMLElement)" />
        <Select
          v-model="process.initial"
          :aria-label="'Starts in ' + stateTitle(process.states.find((s) => s.id === process!.initial))"
          appendTo="self"
          optionLabel="label"
          optionValue="value"
          :options="process.states.map((s) => ({ label: stateTitle(s), value: s.id }))"
          ><template #value
            ><span class="work-muted"
              >Starts in {{ stateTitle(process.states.find((s) => s.id === process!.initial)) }}</span
            ></template
          ></Select
        >
        <span class="work-spacer"></span>
        <div v-if="mode === 'Map'" class="work-map-zoom" role="group" aria-label="Map zoom">
          <Button label="Fit" title="Fit the map to a readable width" text severity="secondary" size="small" @click="graph?.fit()"
            ><template #icon><Icon icon="tabler:arrows-maximize" /></template
          ></Button>
          <Button
            v-if="mode === 'Map'"
            aria-label="Zoom out"
            title="Zoom out"
            text
            severity="secondary"
            size="small"
            @click="graph?.zoomOut()"
            ><Icon icon="tabler:minus"
          /></Button>
          <Button
            v-if="mode === 'Map'"
            aria-label="Zoom in"
            title="Zoom in"
            text
            severity="secondary"
            size="small"
            @click="graph?.zoomIn()"
            ><Icon icon="tabler:plus"
          /></Button>
        </div>
        <SelectButton
          :model-value="mode"
          @update:model-value="setMode"
          :options="['Map', 'List']"
          :allow-empty="false"
          aria-label="Workflow layout"
        />
        <Button
          label="New process"
          aria-label="New process"
          text
          severity="secondary"
          @click="creating = true"
          ><template #icon><Icon icon="tabler:plus" /></template
        ></Button>
      </div>
      <ProcessGraph
        v-if="mode === 'Map'"
        ref="graph"
        :process="process"
        :draft="draft"
        fit-on-open
        :selected-state="selectedState"
        :selected-transition="selectedTransition"
        @state="chooseState"
        @transition="chooseTransition"
        @remove-transition="inspector?.removeByShortcut($event)"
        @connect="connect"
        @clear="inspector?.close()"
      />
      <ProcessList
        v-else
        :process="process"
        :draft="draft"
        :guards="visibleGuards"
        :selected-state="selectedState"
        :selected-transition="selectedTransition"
        :counts="processCounts"
        @state="chooseState"
        @transition="chooseTransition"
        @remove-state="removeState(process, $event)"
        @remove-transition="removeTransition"
      />
      <ProcessInspector
        ref="inspector"
        :process="process"
        :draft="draft"
        :board-id="boardId"
        :guards="visibleGuards"
        :error="error"
        :selected-state="selectedState"
        :selected-transition="selectedTransition"
        :inserted-route="insertedRoute"
        :process-counts="processCounts"
        @close="closeInspector"
        @focus-editor="focusEditor"
        @kind="setInsertionKind"
        @connect="connect"
        @remove-state="removeState(process, $event)"
        @remove-transition="removeTransition"
        @validity="(key, valid) => emit('validity', key, valid)"
      />
    </div>
    <Button v-else label="New process" severity="secondary" outlined @click="creating = true"
      ><template #icon><Icon icon="tabler:plus" /></template
    ></Button>
    <Disclosure v-if="process" class="work-disclosure" label="Advanced workflow settings">
      <div class="work-stack">
        <Disclosure class="work-small" label="Technical details">
          <p>Workflow definitions are <code>processes</code> in <code>WorkGetSchema</code> and <code>WorkApplySchema</code>.</p>
        </Disclosure>
        <label class="work-stack work-tight">Workflow name<InputText v-model="process.name" aria-label="Workflow name" /></label>
        <p v-if="staleLimits.length" class="work-muted">Some item limits belong to removed states.</p>
        <Button v-for="(id, index) in staleLimits" :key="id" :label="'Clear limit for removed state ' + (index + 1)" severity="secondary" text @click="delete draft.policy!.wip![id]" />
        <Button label="Remove workflow" severity="danger" text size="small" @click="remove(process)" />
      </div>
    </Disclosure>
    <NativeDialog :visible="creating" :return-focus="creationOpener" label="New process" @close="cancelCreate"
      ><form class="work-dialog-box" aria-label="New process" @submit.stop.prevent="add">
        <h2>New process</h2>
        <label class="work-stack work-tight"
          >Name<InputText v-model="newName" aria-label="New process name" autofocus required
        /></label>
        <div class="work-dialog-actions">
          <Button label="Cancel" severity="secondary" outlined @click="cancelCreate" /><Button
            label="Create process"
            type="submit"
            :disabled="!newName.trim()"
          />
        </div></form
    ></NativeDialog>
  </section>
</template>
