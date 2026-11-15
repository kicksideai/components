<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Select from 'primevue/select'
import ConfigForm from './ConfigForm.vue'
import CapacityControl from './CapacityControl.vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { computed } from 'vue'
import Button from 'primevue/button'
import { humanize } from '../../forms'
import type { Declaration } from '../../types'
import DurationControl from './DurationControl.vue'
const props = defineProps<{ draft: Declaration }>()
const policy = computed(() => props.draft.policy ?? {})
const states = computed(() => [...new Set(props.draft.processes?.flatMap(p => p.states.map(s => s.id)) ?? [])])
const days = ['audit_days', 'trash_days', 'tombstone_days', 'interval_days'] as const
type Policy = NonNullable<Declaration['policy']>
function update<K extends keyof Policy>(key: K, value: Policy[K] | undefined) { if (value === undefined) { if (props.draft.policy) delete props.draft.policy[key] } else (props.draft.policy ??= {})[key] = value }
function retention(key: typeof days[number], value: number | null) { update(key, value ?? undefined) }
</script>
<template>
  <section class="work-stack" aria-label="Policy editor">
    <header class="work-section-heading"><div><h2>Policy</h2><p class="work-muted work-small">Set capacity and how long the board keeps its history.</p></div></header>
    <h3 class="work-group-title">Item keys</h3>
    <div class="work-settings-list"><div class="work-settings-row"><div class="work-row-main"><strong class="work-row-title">Item key prefix</strong><p class="work-muted work-small">Work reviews and claims prefix changes when you apply the schema.</p></div><div class="work-row-control"><InputText v-model="draft.key_prefix" aria-label="Item key prefix" required pattern="[A-Z][A-Z0-9]{1,9}" maxlength="10" /></div></div></div>
    <h3 class="work-group-title">Work in progress</h3>
    <p class="work-muted work-small">A blank limit sets no restriction. A hard limit rejects transitions over capacity.</p>
    <div class="work-settings-list work-wip-container"><table class="work-wip-table"><thead><tr><th>State</th><th>Limit</th><th>Hard limit</th></tr></thead><tbody><tr v-for="state in states" :key="state"><td><strong>{{ draft.processes?.flatMap(p => p.states).find(s => s.id === state)?.name || humanize(state) }}</strong><code class="work-mono">{{ state }}</code></td><td><CapacityControl :draft="draft" :state="state" :label="state + ' WIP limit'" /></td><td><CapacityControl :draft="draft" :state="state" :label="state + ' hard WIP limit'" hard /></td></tr></tbody></table><div v-for="state in Object.keys(policy.wip ?? {}).filter(s => !states.includes(s))" :key="state" class="work-settings-row"><div class="work-row-main">{{ humanize(state) }} <span class="work-muted">Removed state</span></div><Button label="Remove stale limit" severity="secondary" outlined @click="delete policy.wip![state]"><template #icon><Icon icon="tabler:trash" /></template></Button></div></div>
    <h3 class="work-group-title">Automated stages</h3>
    <DurationControl :model-value="policy.stage_timeout" @update:model-value="update('stage_timeout', $event)" label="Default attempt timeout" />
    <p class="work-muted work-small">Blank uses one hour. Each retry gets a new deadline.</p>
    <label class="work-row"><span class="work-spacer">Default maximum visits</span><InputNumber
      :model-value="policy.stage_max_visits ?? null" aria-label="Default maximum visits" :min="1" :useGrouping="false"
      placeholder="5" @update:model-value="update('stage_max_visits', $event ?? undefined)" /></label>
    <h3 class="work-group-title">Query scopes</h3>
    <p class="work-muted work-small">Declare the installed scope identifiers available to board queries.</p>
    <ConfigForm :schema="{ type: 'object', properties: { scopes: { type: 'array', title: 'Scope identifiers', items: { type: 'string' } } } }" :model-value="{ scopes: draft.scopes }" @update:model-value="draft.scopes = $event.scopes as string[] | undefined" />
    <h3 class="work-group-title">Audit and retention</h3>
    <div class="work-settings-list">
      <div class="work-settings-row"><div class="work-row-main"><strong class="work-row-title">Audit trail</strong><p class="work-muted work-small">Choose which item changes appear in history.</p></div><div class="work-row-control"><Select :model-value="policy.audit ?? ''" aria-label="Audit trail" placeholder="Installation default" appendTo="self" optionLabel="label" optionValue="value" :options="[{ label: 'Installation default', value: '' }, { label: 'Off', value: 'off' }, { label: 'Fields', value: 'fields' }]" @update:model-value="update('audit', $event || undefined)" /></div></div>
      <div v-for="key in days" :key="key" class="work-settings-row"><div class="work-row-main"><strong class="work-row-title">{{ humanize(key) }}</strong><p class="work-muted work-small">Blank follows the installation default. Zero keeps records indefinitely.</p></div><label class="work-row-control"><InputNumber :min="0" :aria-label="humanize(key)" :model-value="policy[key] ?? null" placeholder="Installation default" :useGrouping="false" @update:model-value="retention(key, $event)" /></label></div>
    </div>
  </section>
</template>
