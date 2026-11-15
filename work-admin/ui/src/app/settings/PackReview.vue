<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Select from 'primevue/select'
import type { PackPlan, PackRequest } from '../../packs'
import type { Declaration } from '../../types'
import { humanize } from '../../forms'
import { stateTitle } from './process'
const props = defineProps<{ plan: PackPlan; request: PackRequest; original: Declaration; disabled?: boolean }>()
const emit = defineEmits<{ change: [] }>()
function processName(id: string) { return props.original.processes?.find(p => p.id === id)?.name || humanize(id) }
function conflictTitle(path: string) {
  const [section, ...parts] = path.split('.')
  const id = parts.join('.')
  if (section === 'processes') return processName(id)
  if (section === 'fields') return props.original.fields?.find(f => f.code === id)?.title || humanize(id)
  if (section === 'item_types') return props.original.item_types?.find(t => t.id === id)?.title || humanize(id)
  return humanize(section)
}
function comparison(value: unknown) { return JSON.stringify(value ?? null, null, 2) }
function resolve(path: string, value: 'local' | 'incoming') { (props.request.resolutions ??= {})[path] = value; emit('change') }
function map(process: string, state: string, value: string) { ((props.request.maps ??= {})[process] ??= {})[state] = value; emit('change') }
</script>
<template>
  <section v-if="plan.conflicts.length" class="work-stack" aria-label="Pack conflicts"><h3>Local edits conflict</h3><p class="work-muted work-small">Choose which declaration to keep for each conflict, then review again.</p>
    <div v-for="conflict in plan.conflicts" :key="conflict.path" class="work-stack work-tight">
      <label class="work-stack work-tight work-pack-review-field">{{ conflictTitle(conflict.path) }}<Select :model-value="request.resolutions?.[conflict.path]" :aria-label="'Resolution for ' + conflictTitle(conflict.path)" :disabled="disabled" appendTo="self" placeholder="Choose a resolution" optionLabel="label" optionValue="value" :options="[{ label: 'Keep local edits', value: 'local' }, { label: 'Use pack changes', value: 'incoming' }]" @update:model-value="resolve(conflict.path, $event)" /></label>
      <details class="work-json-disclosure"><summary>Compare declarations</summary><div class="work-config-fields"><section><h4>Local edits</h4><pre class="work-json-example">{{ comparison(conflict.local_value) }}</pre></section><section><h4>Pack changes</h4><pre class="work-json-example">{{ comparison(conflict.incoming) }}</pre></section></div></details>
    </div>
  </section>
  <section v-if="Object.keys(plan.maps).length" class="work-stack" aria-label="Pack state maps"><h3>Required state maps</h3><p class="work-muted work-small">Review the proposed destinations for existing items. Each destination is editable.</p>
    <div v-for="(states, process) in plan.maps" :key="process" class="work-stack"><h4>{{ processName(process) }}</h4>
      <label v-for="(_, state) in states" :key="state" class="work-stack work-tight work-pack-review-field">Move items from {{ stateTitle(original.processes?.find(p => p.id === process)?.states.find(s => s.id === state)) }}<Select :model-value="request.maps?.[process]?.[state]" :aria-label="'Move items from ' + stateTitle(original.processes?.find(p => p.id === process)?.states.find(s => s.id === state))" :disabled="disabled" appendTo="self" optionLabel="label" optionValue="value" :options="plan.declaration.processes?.find(p => p.id === process)?.states.map(s => ({ label: stateTitle(s), value: s.id })) ?? []" @update:model-value="map(process, state, $event)" /></label>
    </div>
  </section>
</template>
