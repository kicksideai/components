<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import FieldControl from '../FieldControl.vue'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import ToggleSwitch from 'primevue/toggleswitch'
import type { Declaration, InstalledRule, Process, Transition } from '../../types'
import ChipPicker from './ChipPicker.vue'
import ConditionEditor from './ConditionEditor.vue'
import JsonInput from './JsonInput.vue'
import { stateTitle } from './process'
const props = defineProps<{ transition: Transition; process: Process; draft: Declaration; boardId?: string; guards?: InstalledRule[] }>()
const emit = defineEmits<{ validity: [key: string, valid: boolean] }>()
function addEffect() { (props.transition.set ??= []).push({ field: props.draft.fields?.[0]?.code ?? '', value: '' }) }
function changeEffect(index: number, mode: string) {
  const old = props.transition.set?.[index]
  if (!old || !props.transition.set) return
  props.transition.set[index] = { field: old.field, ...(mode === 'clear' ? { clear: true } : mode === 'copy' ? { copy: '' } : { value: '' }) }
}
function isEffect(value: unknown): value is NonNullable<Transition['set']>[number] {
  if (!value || typeof value !== 'object' || !('field' in value) || typeof value.field !== 'string') return false
  if ('clear' in value) return value.clear === true && !('copy' in value) && !('value' in value)
  if ('copy' in value) return typeof value.copy === 'string' && !('value' in value)
  return 'value' in value
}
function commitEffects(value: unknown) {
  if (value !== undefined && (!Array.isArray(value) || !value.every(isEffect))) {
    return 'Each effect needs a field and exactly one of value, clear (true), or copy (a source field).'
  }
  props.transition.set = value
}
function commitGuards(value: unknown) {
  if (value !== undefined && (!Array.isArray(value) || !value.every((guard: unknown) => typeof guard === 'string'))) {
    return 'Enter guard IDs as strings.'
  }
  props.transition.guards = value
}
</script>
<template>
  <div class="work-stack work-transition-settings">
    <label class="work-stack work-tight"
      >To state<Select
        v-model="transition.to"
        aria-label="To state"
        appendTo="self"
        optionLabel="label"
        optionValue="value"
        :options="process.states.map((s) => ({ label: stateTitle(s), value: s.id }))"
    /></label>
    <label class="work-row"
      ><span class="work-spacer">Works from any state</span
      ><ToggleSwitch
        :model-value="transition.from === 'any'"
        aria-label="Works from any state"
        @update:model-value="transition.from = $event ? 'any' : []"
    /></label>
    <ChipPicker
      v-if="transition.from !== 'any'"
      label="From states"
      :options="process.states.map((s) => ({ value: s.id, label: stateTitle(s) }))"
      v-model="transition.from"
    />
    <h4 class="work-process-group">Must be filled</h4>
    <ChipPicker
      label="Required fields"
      :options="draft.fields?.map((f) => ({ value: f.code, label: f.title || f.code })) ?? []"
      v-model="transition.require"
    />
    <h4 class="work-process-group">Only when</h4>
    <ConditionEditor
      label="Allow this transition when"
      :draft="draft"
      :board-id="boardId"
      :model-value="transition.when"
      @update:model-value="transition.when = $event"
      @validity="emit('validity', 'when', $event)"
    />
    <ChipPicker v-if="guards?.length || transition.guards?.length" label="Installed checks"
      :options="[...(guards ?? []).map(check => ({ value: check.id, label: check.title })), ...(transition.guards ?? []).filter(id => !guards?.some(check => check.id === id)).map(id => ({ value: id, label: guards ? 'Unavailable check' : 'Configured check' }))]"
      v-model="transition.guards" />
    <p v-for="check in guards?.filter(check => transition.guards?.includes(check.id)) ?? []" :key="check.id" class="work-muted work-small">
      {{ check.description || check.title + ' can stop this transition.' }}
      <span v-if="check.reads?.length"> Checks {{ check.reads.map(code => draft.fields?.find(field => field.code === code)?.title || 'a configured field').join(', ') }}.</span>
    </p>
    <Disclosure class="work-disclosure" label="Advanced transition settings">
      <div class="work-stack">
    <label class="work-row"
      ><span class="work-spacer">Happens automatically</span
      ><ToggleSwitch :model-value="transition.auto" @update:model-value="transition.auto = $event; if (!$event) delete transition.default" aria-label="Automatic transition"
    /></label>
    <label class="work-row"
      ><span class="work-spacer">Default automatic transition</span
      ><ToggleSwitch v-model="transition.default" :disabled="!transition.auto" aria-label="Default transition"
    /></label>
    <h4 class="work-process-group">Also sets</h4>
    <div
      v-for="(effect, index) in transition.set ?? []"
      :key="index"
      class="work-process-value work-stack work-tight"
    >
      <label class="work-stack work-tight"
        >Field<Select
          v-model="effect.field"
          appendTo="self"
          optionLabel="label"
          optionValue="value"
          :options="draft.fields?.map((f) => ({ value: f.code, label: f.title || f.code })) ?? []"
      /></label>
      <div class="work-row">
        <Select
          :model-value="effect.clear ? 'clear' : effect.copy !== undefined ? 'copy' : 'value'"
          aria-label="Value action"
          appendTo="self"
          :options="[
            { label: 'Set value', value: 'value' },
            { label: 'Clear value', value: 'clear' },
            { label: 'Copy field', value: 'copy' },
          ]"
          optionLabel="label"
          optionValue="value"
          @update:model-value="changeEffect(index, $event)"
        /><Button
          text
          severity="danger"
          :aria-label="'Remove value ' + (index + 1)"
          @click="transition.set?.splice(index, 1)"
          ><Icon icon="tabler:trash"
        /></Button>
      </div>
      <Select
        v-if="effect.copy !== undefined"
        v-model="effect.copy"
        aria-label="Copy from field"
        appendTo="self"
        optionLabel="label"
        optionValue="value"
        :options="draft.fields?.map((f) => ({ value: f.code, label: f.title || f.code })) ?? []"
      />
      <template v-else-if="!effect.clear"
        ><FieldControl
          v-for="field in draft.fields?.filter((f) => f.code === effect.field) ?? []"
          :key="field.code"
          :board-id="boardId ?? ''"
          :field="field"
          v-model="effect.value"
          @validity="emit('validity', 'effect-' + index, $event)"
      /></template>
    </div>
    <Button label="Add value" severity="secondary" outlined size="small" @click="addEffect"
      ><template #icon><Icon icon="tabler:plus" /></template
    ></Button>

    <label class="work-stack work-tight">Offer to people<Select :model-value="transition.people" aria-label="Offer to people" appendTo="self" optionLabel="label" optionValue="value" :options="[{ label: 'Work default', value: undefined }, { label: 'Offer explicitly', value: true }, { label: 'Process engine only', value: false }]" @update:model-value="transition.people = $event" />
      <span class="work-muted work-small">Work default can hide a stage route from the list while still allowing it by name. Process engine only reserves the route for the engine and board administrators using force.</span>
    </label>
    <label class="work-stack work-tight">Evaluation order<InputNumber :model-value="transition.order ?? null" aria-label="Transition order" :min="0" :useGrouping="false" @update:model-value="transition.order = $event ?? undefined" /></label>
    <JsonInput
      label="Set values"
      :model-value="transition.set"
      shape="array"
      :commit="commitEffects"
      @validity="emit('validity', 'set', $event)"
    />
    <JsonInput
      label="Guards"
      :model-value="transition.guards"
      shape="array"
      :commit="commitGuards"
      @validity="emit('validity', 'guards', $event)"
    />

      </div>
    </Disclosure>
  </div>
</template>
