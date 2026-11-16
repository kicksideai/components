<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { computed, nextTick, ref, watch } from 'vue'
import NativeDialog from '../../NativeDialog.vue'
import ContentAction from '../ContentAction.vue'
import ProcessGraph from './ProcessGraph.vue'
import ProcessList from './ProcessList.vue'
import TransitionSettings from './TransitionSettings.vue'
import { categories, categoryTitle, uniqueId, stateUses, transitionUses, stateTitle, transitionTitle, stateMeaning, mainPath } from './process'
import { type RemovalGuard, type SchemaChange, changeReason, removeEntry } from './model'
import type { Declaration, Process, State, Transition } from '../../types'
import StateSettings from './StateSettings.vue'
const props = defineProps<{ draft: Declaration; advanced: boolean; guardRemoval?: RemovalGuard; issues?: SchemaChange[]; boardId?: string }>()
const emit = defineEmits<{ validity: [key: string, valid: boolean] }>()
const processes = computed(() => props.draft.processes ?? [])
const creating = ref(false), newName = ref(''), selected = ref(''), error = ref(''), mode = ref('Map'), target = ref('')
const selectedState = ref<State>(), selectedTransition = ref<Transition>(), graph = ref<InstanceType<typeof ProcessGraph>>()
const inspector = ref<HTMLElement>(), editingName = ref(false)
async function editName() { editingName.value = true; await nextTick(); inspector.value?.querySelector<HTMLInputElement>('[aria-label="State name"]')?.focus() }
const process = computed(() => processes.value.find(p => p.id === selected.value) ?? processes.value[0])
function clear() { editingName.value = false; selectedState.value = undefined; selectedTransition.value = undefined; error.value = '' }
function chooseState(state: State) { editingName.value = false; selectedState.value = state; selectedTransition.value = undefined; target.value = ''; error.value = '' }
function chooseTransition(transition: Transition) { editingName.value = false; selectedTransition.value = transition; selectedState.value = undefined; error.value = '' }
watch(process, clear)
function selectProcess(value: string) { if (value === '__new') creating.value = true; else selected.value = value }
function add() {
  const name = newName.value.trim()
  if (!name) return
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'process'
  const prefix = (/^[a-z]/.test(base) ? base : 'process_' + base).slice(0, 40)
  const code = processes.value.some(p => p.id === prefix) ? uniqueId(prefix, processes.value) : prefix
  ;(props.draft.processes ??= []).push({ id: code, name, initial: 'todo', states: [{ id: 'todo', name: 'To do', category: 'unstarted' }], transitions: [] })
  selected.value = code; newName.value = ''; creating.value = false
}
async function addState(p: Process) {
  const state: State = { id: uniqueId('state', p.states), name: 'New state', category: 'started' }
  const main = mainPath(p), last = main.at(-1)
  const after = selectedState.value ?? (last?.category === 'completed' ? main.at(-2) : last)
  const outgoing = after && (p.transitions?.find(t => t.default && t.from !== 'any' && t.from.includes(after.id)) ?? p.transitions?.find(t => t.from !== 'any' && t.from.includes(after.id) && p.states.findIndex(s => s.id === t.to) > p.states.indexOf(after)))
  p.states.splice(after ? p.states.indexOf(after) + 1 : p.states.length, 0, state)
  if (after && after.category !== 'completed' && after.category !== 'canceled') {
    if (outgoing) {
      const target = outgoing.to
      outgoing.to = state.id
      ;(p.transitions ??= []).push({ id: uniqueId('transition', p.transitions ?? []), name: 'Continue', from: [state.id], to: target, ...(outgoing.auto && outgoing.default ? { auto: true, default: true } : {}) })
    } else (p.transitions ??= []).push({ id: uniqueId('transition', p.transitions ?? []), name: 'Continue', from: [after.id], to: state.id })
  }
  chooseState(state)
  await editName()
}
function connect(from: string, to: string) {
  const p = process.value
  if (!p || !to || from === to) return
  let id = `to_${to}`, index = 2
  while (p.transitions?.some(transition => transition.id === id)) id = `to_${to}_${index++}`
  const transition: Transition = { id, name: `To ${stateTitle(p.states.find(s => s.id === to)).toLowerCase()}`, from: [from], to }
  ;(p.transitions ??= []).push(transition); chooseTransition(transition)
}
function addTransition(p: Process) {
  const transition: Transition = { id: uniqueId('transition', p.transitions ?? []), name: 'To ' + stateTitle(p.states.at(-1)), from: [p.initial], to: p.states.at(-1)?.id ?? p.initial }
  ;(p.transitions ??= []).push(transition); chooseTransition(transition)
}
function removeTransition(p: Process, transition: Transition) {
  const uses = transitionUses(p, transition)
  if (uses.length) { error.value = `Used by ${uses.join(', ')}. Update those references first.`; return }
  p.transitions?.splice(p.transitions.indexOf(transition), 1); clear()
}
function removeState(p: Process, state: State) {
  const uses = stateUses(p, state)
  if (uses.length) { error.value = `${stateTitle(state)} is used by ${uses.join(', ')}. Update these references first.`; return }
  p.states.splice(p.states.indexOf(state), 1); clear()
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
  <section class="work-process-editor work-stack" aria-label="Process editor" @keydown.esc="clear">
    <p v-if="error" class="kx-err" role="alert">{{ error }}</p>
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
      <div class="work-process-controls" role="toolbar" aria-label="Process tools">
        <Select
          v-if="processes.length > 1"
          :model-value="process.id"
          aria-label="Process"
          appendTo="self"
          optionLabel="label"
          optionValue="value"
          :options="[
            ...processes.map((p) => ({ label: p.name || 'Untitled process', value: p.id })),
            { label: 'New process…', value: '__new' },
          ]"
          @update:model-value="selectProcess"
        />
        <span v-else class="work-process-title">{{ process.name || 'Process' }}</span>
        <Button label="Add state" severity="secondary" outlined size="small" @click="addState(process)"
          ><template #icon><Icon icon="tabler:plus" /></template
        ></Button>
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
          <Button label="Fit" title="Fit to width and show the full process" text severity="secondary" size="small" @click="graph?.fit()"
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
          v-model="mode"
          :options="['Map', 'List']"
          :allow-empty="false"
          aria-label="Process layout"
        />
        <Button
          v-if="processes.length === 1"
          label="New process"
          aria-label="New process"
          text
          severity="secondary"
          size="small"
          @click="creating = true"
          ><template #icon><Icon icon="tabler:plus" /></template
        ></Button>
      </div>
      <ProcessGraph
        v-if="mode === 'Map'"
        ref="graph"
        :process="process"
        :draft="draft"
        :selected-state="selectedState"
        :selected-transition="selectedTransition"
        @state="chooseState"
        @transition="chooseTransition"
        @connect="connect"
        @clear="clear"
      />
      <ProcessList
        v-else
        :process="process"
        :selected-state="selectedState"
        :selected-transition="selectedTransition"
        @state="chooseState"
        @transition="chooseTransition"
        @remove-state="removeState(process, $event)"
        @remove-transition="removeTransition(process, $event)"
        @add-transition="addTransition(process)"
      />
      <aside
        v-if="selectedState || selectedTransition"
        ref="inspector"
        class="work-process-sideform"
        :aria-label="selectedState ? 'State inspector' : 'Transition inspector'"
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
            /><Button severity="secondary" text size="small" aria-label="Close state editor" @click="clear"
              ><Icon icon="tabler:x"
            /></Button>
          </header>
          <p class="work-process-meaning">{{ stateMeaning(state, draft) }}</p>

          <StateSettings
            :state="state"
            :process="process"
            :draft="draft"
            :advanced="advanced"
            :board-id="boardId"
            @validity="(key, valid) => emit('validity', process!.id + ':' + state!.id + ':' + key, valid)"
          />
          <label class="work-stack work-tight"
            >Phase<Select
              v-model="state.category"
              appendTo="self"
              optionLabel="label"
              optionValue="value"
              :options="
                ['triage', 'backlog', ...categories].map((value) => ({ label: categoryTitle(value), value }))
              "
          /></label>
          <h4 class="work-process-group">Next stop</h4>
          <Select
            v-model="target"
            aria-label="Add transition to…"
            placeholder="Add transition to…"
            appendTo="self"
            optionLabel="label"
            optionValue="value"
            :options="
              process.states.filter((s) => s !== state).map((s) => ({ label: stateTitle(s), value: s.id }))
            "
          />
          <Button
            label="Add transition"
            severity="secondary"
            outlined
            size="small"
            :disabled="!target"
            @click="connect(state.id, target)"
            ><template #icon><Icon icon="tabler:arrow-right" /></template
          ></Button>
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
          <header class="work-row">
            <h3>Transition</h3>
            <span class="work-spacer"></span
            ><Button
              severity="secondary"
              text
              size="small"
              aria-label="Close transition editor"
              @click="clear"
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
            :advanced="advanced"
            :board-id="boardId"
            @validity="
              (key, valid) =>
                emit('validity', process!.id + ':transition-' + transition!.id + ':' + key, valid)
            "
          />
          <footer class="work-process-inspector-foot">
            <Button
              label="Remove transition"
              severity="danger"
              text
              size="small"
              @click="removeTransition(process, transition)"
              ><template #icon><Icon icon="tabler:trash" /></template
            ></Button>
          </footer>
        </template>
      </aside>
    </div>
    <Button v-else label="New process" severity="secondary" outlined @click="creating = true"
      ><template #icon><Icon icon="tabler:plus" /></template
    ></Button>
    <div v-if="mode === 'List' && process" class="work-row">
      <Button label="Remove process" severity="danger" text size="small" @click="remove(process)"
        ><template #icon><Icon icon="tabler:trash" /></template
      ></Button>
    </div>
    <NativeDialog :visible="creating" label="New process" @close="creating = false"
      ><form class="work-dialog-box" aria-label="New process" @submit.stop.prevent="add">
        <h2>New process</h2>
        <label class="work-stack work-tight"
          >Name<InputText v-model="newName" aria-label="New process name" autofocus required
        /></label>
        <div class="work-dialog-actions">
          <Button label="Cancel" severity="secondary" outlined @click="creating = false" /><Button
            label="Create process"
            type="submit"
            :disabled="!newName.trim()"
          />
        </div></form
    ></NativeDialog>
  </section>
</template>
