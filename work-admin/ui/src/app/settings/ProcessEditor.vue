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
import ContentAction from '../ContentAction.vue'
import ProcessGraph from './ProcessGraph.vue'
import ProcessList from './ProcessList.vue'
import TransitionRules from './TransitionRules.vue'
import TransitionSettings from './TransitionSettings.vue'
import { categories, categoryTitle, uniqueId, stateUses, transitionUses, stateTitle, transitionTitle, stateMeaning, mainPath } from './process'
import { type RemovalGuard, type SchemaChange, changeReason, removeEntry } from './model'
import type { Declaration, InstalledRule, ItemType, Process, State, StateCounts, Transition } from '../../types'
import { sectionRow } from './sectionRow'
import StateSettings from './StateSettings.vue'
const props = defineProps<{ draft: Declaration; guardRemoval?: RemovalGuard; issues?: SchemaChange[]; boardId?: string; counts?: StateCounts; countTypes?: ItemType[]; guards?: InstalledRule[]; createForItemType?: boolean; creationOpener?: HTMLElement }>()
const emit = defineEmits<{ validity: [key: string, valid: boolean]; created: [id: string]; 'cancel-creation': [] }>()
const location = inject(sectionRow, undefined)
const processes = computed(() => props.draft.processes ?? [])
const creating = ref(false), newName = ref(''), selected = ref(''), error = ref(''), mode = ref('Map'), target = ref('')
watch(() => props.createForItemType, (active, previous) => {
  if (!active && !previous) return
  newName.value = ''
  creating.value = !!active
}, { immediate: true })
const choosingTarget = ref(false)
const selectedState = ref<State>(), selectedTransition = ref<Transition>(), graph = ref<InstanceType<typeof ProcessGraph>>()
const editor = ref<HTMLElement>(), inspector = ref<HTMLElement>(), tools = ref<HTMLElement>(), editingName = ref(false)
const insertions = new WeakMap<State, { entry: Transition; continuation?: Transition; automatic: boolean }>()
type InspectorOpener = HTMLElement | SVGElement
let inspectorOpener: InspectorOpener | undefined
async function editName() { editingName.value = true; await nextTick(); inspector.value?.querySelector<HTMLInputElement>('[aria-label="State name"]')?.focus() }
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

function clear() { editingName.value = false; choosingTarget.value = false; selectedState.value = undefined; selectedTransition.value = undefined; error.value = ''; inspectorOpener = undefined }
async function closeInspector() {
  const opener = inspectorOpener
  const selected = location?.selected.value
  if (selected?.startsWith('workflow/')) location?.choose('workflow', selected.slice('workflow/'.length), false)
  clear()
  await nextTick()
  if (opener?.isConnected) opener.focus()
  else focusEditor()
}
function focusEditor() {
  if (mode.value === 'Map') graph.value?.focus()
  else tools.value?.focus()
}
async function focusInspector() {
  await nextTick()
  if (!inspector.value) return
  inspector.value.scrollTop = 0
  inspector.value.focus({ preventScroll: true })
  if ((inspector.value.closest('.work-settings-shell')?.clientWidth ?? Infinity) <= 700) {
    inspector.value.scrollIntoView?.({ block: 'nearest' })
  }
}
function chooseState(state: State, opener?: InspectorOpener) {
  inspectorOpener = opener; editingName.value = false; choosingTarget.value = false; selectedState.value = state; selectedTransition.value = undefined; target.value = ''; error.value = ''
  if (process.value) location?.choose('workflow', process.value.id + '.state.' + state.id, true)
  void focusInspector()
}
async function showTarget(open: boolean) {
  target.value = ''
  choosingTarget.value = open
  await nextTick()
  const control = open ? '[role="combobox"]' : 'button'
  inspector.value?.querySelector<HTMLElement>('.work-next-transition ' + control)?.focus()
}
function chooseTransition(transition: Transition, opener?: InspectorOpener) {
  inspectorOpener = opener; editingName.value = false; selectedTransition.value = transition; selectedState.value = undefined; error.value = ''
  if (process.value) location?.choose('workflow', process.value.id + '.transition.' + transition.id, true)
  void focusInspector()
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
  await editName()
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
function connect(from: string, to: string, opener = inspectorOpener) {
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
function removeSelectedTransition(event: KeyboardEvent) {
  if (!selectedTransition.value || event.defaultPrevented || event.repeat) return
  event.preventDefault()
  void removeTransition(selectedTransition.value)
}
function removeState(p: Process, state: State) {
  const uses = stateUses(p, state)
  if (uses.length) { error.value = `${stateTitle(state)} is used by ${uses.join(', ')}. Update these references first.`; return }
  p.states.splice(p.states.indexOf(state), 1); void closeInspector()
}
async function remove(p: Process) {
  const used = props.draft.item_types?.filter(type => type.process === p.id).map(type => type.title || 'Untitled item type') ?? []
  if (used.length) { error.value = `Used by ${used.join(', ')}. Choose a different process for those item types first.`; return }
  const refusal = await props.guardRemoval?.('processes', p.id)
  if (refusal) { error.value = refusal; return }
  removeEntry(props.draft, 'processes', p.id); selected.value = ''; clear()
}
</script>
<template>
  <section ref="editor" class="work-process-editor work-stack" aria-label="Process editor" @keydown.esc="inspector && closeInspector()">
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
      <div ref="tools" class="work-process-controls" role="toolbar" aria-label="Process tools" tabindex="-1">
        <Select
          v-if="processes.length > 1"
          :model-value="process.id"
          aria-label="Process"
          appendTo="self"
          optionLabel="label"
          optionValue="value"
          :options="processes.map(p => ({ label: p.name || 'Untitled process', value: p.id }))"
          @update:model-value="selected = $event"
        />
        <strong v-else>{{ process.name || 'Untitled process' }}</strong>
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
          aria-label="Process layout"
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
        @remove-transition="removeSelectedTransition"
        @connect="connect"
        @clear="closeInspector"
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
      <Transition name="work-panel">
      <aside
        v-if="selectedState || selectedTransition"
        ref="inspector"
        class="work-process-sideform"
        tabindex="-1"
        :aria-label="selectedState ? 'State inspector' : 'Transition inspector'"
        :aria-keyshortcuts="selectedTransition ? 'Delete Backspace' : undefined"
        @keydown.delete.self="removeSelectedTransition"
        @keydown.backspace.self="removeSelectedTransition"
      >
        <template v-for="state in selectedState ? [selectedState] : []" :key="state.id">
          <header class="work-row">
            <ContentAction
              v-if="!editingName"
              class="work-process-state-title"
              aria-label="Rename state"
              @activate="editName"
              ><span>{{ stateTitle(state) }}</span></ContentAction
            ><InputText
              v-else
              v-model="state.name"
              class="work-process-name"
              aria-label="State name"
              @blur="editingName = false"
            /><Button severity="secondary" text size="small" aria-label="Close state editor" @click="closeInspector"
              ><Icon icon="tabler:x"
            /></Button>
          </header>
          <div v-if="insertedRoute" class="work-stack work-tight">
            <p class="work-field-label">New route</p>
            <p>{{ insertedRoute }}</p>
          </div>
          <p class="work-process-meaning">{{ stateMeaning(state, draft) }}</p>
          <p v-if="processCounts" class="work-muted">{{ processCounts[state.id] ?? 0 }} {{ processCounts[state.id] === 1 ? 'item' : 'items' }} currently here</p>

          <StateSettings
            :state="state"
            :process="process"
            :draft="draft"
            :board-id="boardId"
            @kind="setInsertionKind(state, $event)"
            @validity="(key, valid) => emit('validity', key.includes('duration:') ? key : process!.id + ':' + state!.id + ':' + key, valid)"
          />
          <label class="work-stack work-tight"
            >Phase<Select
              aria-label="Phase"
              v-model="state.category"
              appendTo="self"
              optionLabel="label"
              optionValue="value"
              :options="
                ['triage', 'backlog', ...categories].map((value) => ({ label: categoryTitle(value), value }))
              "
          /></label>
          <div class="work-next-transition work-stack work-tight">
            <Button v-if="!choosingTarget" label="Add transition" severity="secondary" outlined size="small"
              aria-expanded="false" :disabled="process.states.length < 2" @click="showTarget(true)">
              <template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template>
            </Button>
            <template v-else>
              <Select v-model="target" aria-label="Next state" placeholder="Choose the next state" appendTo="self"
                optionLabel="label" optionValue="value"
                :options="process.states.filter(s => s !== state).map(s => ({ label: stateTitle(s), value: s.id }))" />
              <div class="work-row work-wrap">
                <Button label="Add transition" size="small" :disabled="!target" @click="connect(state.id, target)" />
                <Button label="Cancel" severity="secondary" text size="small" @click="showTarget(false)" />
              </div>
            </template>
          </div>
          <footer class="work-process-inspector-foot">
            <Button
              label="Remove state"
              severity="danger"
              text
              size="small"
              @click="removeState(process, state)"
              ><template #icon><Icon icon="tabler:trash" /></template
            ></Button>
          </footer>
        </template>
        <template v-for="transition in selectedTransition ? [selectedTransition] : []" :key="transition.id">
          <header class="work-row work-transition-actions">
            <h3>Transition</h3>
            <Button
              type="button"
              label="Remove transition"
              severity="danger"
              text
              size="small"
              @click="removeTransition(transition)"
              ><template #icon><Icon icon="tabler:trash" /></template
            ></Button>
            <Button
              severity="secondary"
              text
              size="small"
              aria-label="Close transition editor"
              @click="closeInspector"
              ><Icon icon="tabler:x"
            /></Button>
          </header>
          <p class="work-process-meaning">
            {{
              transition.from === 'any'
                ? 'Any state'
                : transition.from.map((id) => stateTitle(process!.states.find((s) => s.id === id))).join(', ')
            }}
            → {{ stateTitle(process.states.find((s) => s.id === transition!.to)) }}
          </p>
          <TransitionRules :transition="transition" :process="process" :draft="draft" :guards="visibleGuards" />
          <p v-if="error" class="kx-err" role="alert">{{ error }}</p>
          <label class="work-stack work-tight"
            >Name<InputText
              v-model="transition.name"
              :placeholder="transitionTitle(transition)"
              aria-label="Transition name"
          /></label>
          <TransitionSettings
            :transition="transition"
            :process="process"
            :draft="draft"
            :board-id="boardId"
            :guards="visibleGuards"
            @validity="
              (key, valid) =>
                emit('validity', process!.id + ':transition-' + transition!.id + ':' + key, valid)
            "
          />
        </template>
      </aside>
      </Transition>
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
