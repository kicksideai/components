<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Select from 'primevue/select'
import type { Declaration, Process } from '../../types'
import { effectiveMigration, stateTitle } from './process'
const props = defineProps<{ draft: Declaration; original: Declaration; disabled?: boolean }>()
function map(process: Process, source: string, target: string | null) {
  if (target) (process.map ??= {})[source] = target
  else if (process.map) delete process.map[source]
}
function removed(process: Process) { return props.original.processes?.find(p => p.id === process.id)?.states.filter(s => !process.states.some(next => next.id === s.id)) ?? [] }
</script>
<template>
  <section class="work-stack work-settings-card" aria-label="Existing items" :inert="disabled || undefined">
    <h3>Existing items</h3>
    <p class="work-muted work-small">
      Choose how existing items follow these changes, then review the impact before applying.
    </p>
    <div v-for="process in draft.processes ?? []" :key="process.id" class="work-stack">
      <label class="work-stack work-tight"
        >{{ process.name || 'Untitled process'
        }}<Select
          :disabled="disabled"
          :model-value="effectiveMigration(process)"
          :aria-label="'Existing items in ' + (process.name || 'this process')"
          appendTo="self"
          optionLabel="label"
          optionValue="value"
          :options="[
            { label: 'Follow new process', value: 'follow' },
            { label: 'Keep current process', value: 'pin' },
          ]"
          @update:model-value="process.migration = $event"
      /></label>
      <template v-if="effectiveMigration(process) !== 'pin'"
        ><label v-for="state in removed(process)" :key="state.id" class="work-stack work-tight"
          >Move items from {{ stateTitle(state) }} to<Select
            :disabled="disabled"
            :model-value="process.map?.[state.id]"
            placeholder="Choose a surviving state"
            appendTo="self"
            showClear
            optionLabel="label"
            optionValue="value"
            :options="process.states.map((s) => ({ label: stateTitle(s), value: s.id }))"
            @update:model-value="map(process, state.id, $event)" /></label
      ></template>
    </div>
  </section>
</template>
