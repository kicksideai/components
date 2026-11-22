<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { nextTick, ref } from 'vue'
import ContentAction from '../ContentAction.vue'
import StateSettings from './StateSettings.vue'
import TransitionRules from './TransitionRules.vue'
import TransitionSettings from './TransitionSettings.vue'
import { categories, categoryTitle, stateMeaning, stateTitle, transitionTitle } from './process'
import type { Declaration, InstalledRule, Process, State, Transition } from '../../types'

type Opener = HTMLElement | SVGElement
const props = defineProps<{
  process: Process; draft: Declaration; boardId?: string; guards: InstalledRule[]; error: string
  selectedState?: State; selectedTransition?: Transition; insertedRoute?: string; processCounts?: Record<string, number>
}>()
const emit = defineEmits<{
  close: []; 'focus-editor': []; validity: [key: string, valid: boolean]; kind: [state: State, kind: string]
  connect: [from: string, to: string, opener?: Opener]; 'remove-state': [state: State]; 'remove-transition': [transition: Transition]
}>()
const panel = ref<HTMLElement>(), editingName = ref(false), choosingTarget = ref(false), target = ref('')
let opener: Opener | undefined

function reset() {
  opener = undefined
  editingName.value = false
  choosingTarget.value = false
  target.value = ''
}
async function open(from?: Opener) {
  reset()
  opener = from
  await nextTick()
  if (!panel.value) return
  panel.value.scrollTop = 0
  panel.value.focus({ preventScroll: true })
  if ((panel.value.closest('.work-settings-shell')?.clientWidth ?? Infinity) <= 700) {
    panel.value.scrollIntoView?.({ block: 'nearest' })
  }
}
async function close() {
  const from = opener
  emit('close')
  await nextTick()
  if (from?.isConnected) from.focus()
  else emit('focus-editor')
}
async function editName() {
  editingName.value = true
  await nextTick()
  panel.value?.querySelector<HTMLInputElement>('[aria-label="State name"]')?.focus()
}
async function showTarget(open: boolean) {
  target.value = ''
  choosingTarget.value = open
  await nextTick()
  const control = open ? '[role="combobox"]' : 'button'
  panel.value?.querySelector<HTMLElement>('.work-next-transition ' + control)?.focus()
}
function removeByShortcut(event: KeyboardEvent) {
  if (!props.selectedTransition || event.defaultPrevented || event.repeat) return
  event.preventDefault()
  emit('remove-transition', props.selectedTransition)
}
defineExpose({ open, close, reset, editName, removeByShortcut })
</script>
<template>
  <Transition name="work-panel">
    <aside
      v-if="selectedState || selectedTransition"
      ref="panel"
      class="work-process-sideform"
      tabindex="-1"
      :aria-label="selectedState ? 'State inspector' : 'Transition inspector'"
      :aria-keyshortcuts="selectedTransition ? 'Delete Backspace' : undefined"
      @keydown.delete.self="removeByShortcut"
      @keydown.backspace.self="removeByShortcut"
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
          /><Button severity="secondary" text size="small" aria-label="Close state editor" @click="close"
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
          @kind="emit('kind', state, $event)"
          @validity="(key, valid) => emit('validity', key.includes('duration:') ? key : process.id + ':' + state.id + ':' + key, valid)"
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
              <Button label="Add transition" size="small" :disabled="!target" @click="emit('connect', state.id, target, opener)" />
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
            @click="emit('remove-state', state)"
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
            @click="emit('remove-transition', transition)"
            ><template #icon><Icon icon="tabler:trash" /></template
          ></Button>
          <Button
            severity="secondary"
            text
            size="small"
            aria-label="Close transition editor"
            @click="close"
            ><Icon icon="tabler:x"
          /></Button>
        </header>
        <p class="work-process-meaning">
          {{
            transition.from === 'any'
              ? 'Any state'
              : transition.from.map((id) => stateTitle(process.states.find((s) => s.id === id))).join(', ')
          }}
          → {{ stateTitle(process.states.find((s) => s.id === transition.to)) }}
        </p>
        <TransitionRules :transition="transition" :process="process" :draft="draft" :guards="guards" />
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
          :guards="guards"
          @validity="
            (key, valid) =>
              emit('validity', process.id + ':transition-' + transition.id + ':' + key, valid)
          "
        />
      </template>
    </aside>
  </Transition>
</template>
