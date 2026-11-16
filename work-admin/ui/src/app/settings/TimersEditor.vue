<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Checkbox from 'primevue/checkbox'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import type { Declaration, State, Timer } from '../../types'
import JsonInput from './JsonInput.vue'
import DurationControl from './DurationControl.vue'
import { uniqueId } from './process'
const props = defineProps<{ state: State; draft: Declaration }>()
const emit = defineEmits<{ validity: [key: string, valid: boolean] }>()
function timers() { return props.state.timers ?? [] }
function add() { const values = props.state.timers ?? (props.state.timers = []); values.push({ id: uniqueId('timer', values), after: 'P1D', then: { emit: 'reminder' } }) }
function mode(timer: Timer, value: string) { delete timer.after; delete timer.at_field; if (value === 'after') timer.after = 'P1D'; else timer.at_field = '' }
function optional(timer: Timer, key: 'repeat' | 'by', value: string) { if (value) timer[key] = value; else { delete timer[key]; if (key === 'by') delete timer.table } }
function effect(timer: Timer, value: string) { timer.then = value === 'emit' ? { emit: '' } : { transition: '' } }
</script>
<template>
  <section class="work-stack">
    <h4>Timers</h4>
    <article v-for="(timer, index) in timers()" :key="index" class="work-settings-card work-stack">
      <div class="work-settings-grid">
        <label class="work-stack work-tight"
          >Timer ID<InputText v-model="timer.id" required pattern="[a-z][a-z0-9_]*" /></label
        ><label class="work-stack work-tight"
          >Deadline<Select
            :model-value="timer.at_field !== undefined ? 'at_field' : 'after'"
            @update:model-value="mode(timer, $event)"
            appendTo="self"
            optionLabel="label"
            optionValue="value"
            optionDisabled="disabled"
            :options="[
              { label: 'After duration', value: 'after', disabled: false },
              { label: 'At field', value: 'at_field', disabled: false },
            ]" /></label
        ><DurationControl v-if="timer.after !== undefined" v-model="timer.after" label="After" /><label
          v-else
          class="work-stack work-tight"
          >At field<Select
            v-model="timer.at_field"
            appendTo="self"
            optionLabel="label"
            optionValue="value"
            optionDisabled="disabled"
            :options="[
              ...(draft.fields?.filter((f) => f.form === 'time') ?? []).map((field) => ({
                label: field.code,
                value: field.code,
                disabled: false,
              })),
            ]" /></label
        ><label class="work-stack work-tight"
          >Duration by field<Select
            :model-value="timer.by ?? ''"
            @update:model-value="optional(timer, 'by', $event)"
            appendTo="self"
            optionLabel="label"
            optionValue="value"
            optionDisabled="disabled"
            :options="[
              { label: 'Fixed duration', value: '', disabled: false },
              ...(draft.fields ?? []).map((field) => ({
                label: field.code,
                value: field.code,
                disabled: false,
              })),
            ]"
        /></label>
      </div>
      <JsonInput
        v-if="timer.by"
        label="Duration table"
        hint="Map field values to ISO durations."
        :model-value="timer.table"
        shape="object"
        @update:model-value="timer.table = $event as Record<string, string>"
        @validity="emit('validity', 'table-' + index, $event)"
      />
      <div class="work-settings-grid">
        <DurationControl v-model="timer.repeat" label="Repeat every" :disabled="timer.interrupting" /><label
          class="work-row"
          ><Checkbox
            v-model="timer.interrupting"
            @update:model-value="timer.interrupting && delete timer.repeat"
            binary
          />Interrupting</label
        ><label class="work-stack work-tight"
          >Then<Select
            :model-value="timer.then?.transition !== undefined ? 'transition' : 'emit'"
            @update:model-value="effect(timer, $event)"
            appendTo="self"
            optionLabel="label"
            optionValue="value"
            optionDisabled="disabled"
            :options="[
              { label: 'Emit event', value: 'emit', disabled: false },
              { label: 'Transition', value: 'transition', disabled: false },
            ]" /></label
        ><label v-if="timer.then" class="work-stack work-tight"
          >{{ timer.then.transition !== undefined ? 'Transition ID' : 'Event name'
          }}<InputText v-if="timer.then.transition !== undefined" v-model="timer.then.transition" /><InputText
            v-else
            v-model="timer.then.emit"
        /></label>
      </div>
      <Button
        severity="secondary"
        @click="timers().splice(index, 1)"
        aria-label="Remove timer"
        text
        size="small"
        ><Icon icon="tabler:trash" aria-hidden="true"
      /></Button>
    </article>
    <Button label="Add timer" severity="secondary" @click="add" outlined
      ><template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template
    ></Button>
  </section>
</template>
