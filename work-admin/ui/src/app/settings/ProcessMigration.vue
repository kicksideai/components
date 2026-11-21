<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import Select from 'primevue/select'
import type { Process, State } from '../../types'
import { stateTitle } from './process'

interface OccupiedState { process: Process; state: State; count: number }
defineProps<{ removed: OccupiedState[]; renamed: (OccupiedState & { name: string })[]; disabled?: boolean; confirmed: boolean }>()
defineEmits<{ destination: [process: Process, state: string, destination: string]; 'update:confirmed': [confirmed: boolean] }>()
const itemLabel = (count: number) => count + (count === 1 ? ' item' : ' items')
</script>
<template>
  <section class="work-settings-card work-stack" aria-label="Existing items">
    <h3 class="work-row-title">Items in changed states</h3>
    <label v-for="{ process, state, count } in removed" :key="process.id + '/' + state.id" class="work-stack work-tight">
      Move {{ itemLabel(count) }} from {{ stateTitle(state) }} to
      <Select
        :disabled="disabled" :model-value="process.map?.[state.id]"
        :aria-label="'Move items from ' + stateTitle(state) + ' to'"
        placeholder="Choose a state" appendTo="self" optionLabel="label" optionValue="value"
        :options="process.states.map(s => ({ label: stateTitle(s), value: s.id }))"
        @update:model-value="$emit('destination', process, state.id, $event)"
      />
    </label>
    <div v-if="renamed.length" class="work-stack work-tight">
      <p v-for="{ process, state, count, name } in renamed" :key="process.id + '/' + state.id">
        {{ stateTitle(state) }} becomes <strong>{{ name }}</strong> for {{ itemLabel(count) }}.
      </p>
      <label class="work-row">
        <Checkbox binary :model-value="confirmed" :disabled="disabled" @update:model-value="$emit('update:confirmed', $event)" />
        Keep these items in their renamed states
      </label>
    </div>
  </section>
</template>
