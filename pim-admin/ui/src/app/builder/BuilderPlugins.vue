<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import DefinitionList from '../../shared/DefinitionList.vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Message from 'primevue/message'
import DefinitionRow from '../../shared/DefinitionRow.vue'
import ToggleSwitch from 'primevue/toggleswitch'
// Plugins the catalog chooses and configures, and the scopes it adopts for
// grid filters. Both come from the registry; the choice is catalog data.
import { computed } from 'vue'
import { humanLabel } from '../../shared/labels'
import { humanize } from '../../forms'
import type { Declaration, PluginOption, RemoveDecl, SchemaOptions, SchemaView, ScopeOption } from '../../types'
import ConfigForm from './ConfigForm.vue'

const props = withDefaults(defineProps<{ draft: Declaration; schema: SchemaView; options: SchemaOptions; pluginConfigs?: Record<string, Record<string, unknown>>; stale?: boolean }>(), { pluginConfigs: () => ({}) })
const emit = defineEmits<{ remove: [kind: keyof RemoveDecl, id: string]; configure: [plugin: string, config: Record<string, unknown>] }>()
const filterOperators = new Map([
  ['eq', 'Equals'],
  ['in', 'Is one of'],
  ['gt', 'Greater than'],
  ['gte', 'At least'],
  ['lt', 'Less than'],
  ['lte', 'At most'],
])
const lifecycleLabels = {
  pending: 'Setting up',
  ready: 'Ready',
  failed: 'Setup failed',
}

function filterLabel(name: string, operators: string[]): string {
  const labels = operators.map(operator => filterOperators.get(operator)).filter(Boolean)
  return [humanize(name), labels.join(', ')].filter(Boolean).join(' · ')
}

const canEdit = computed(() => props.schema.access.admin)
const plugins = computed(() => props.draft.plugins ?? [])
function chosen(p: PluginOption): boolean { return plugins.value.some(entry => entry.use === p.plugin) }
function current(p: PluginOption) { return props.schema.plugins.find(entry => entry.plugin === p.plugin) }
function choose(p: PluginOption, on: boolean) {
  if (on && !chosen(p)) (props.draft.plugins ??= []).push({ use: p.plugin })
  if (!on) {
    props.draft.plugins = plugins.value.filter(entry => entry.use !== p.plugin)
    delete props.pluginConfigs[p.plugin]
    if (current(p)?.active) emit('remove', 'plugins', p.plugin)
  }
}
function setConfig(p: PluginOption, value: Record<string, unknown>) { props.pluginConfigs[p.plugin] = value }
function contributed(p: PluginOption): string[] {
  return Object.entries(props.schema.attributes).filter(([, a]) => a.plugin === p.plugin).map(([code]) => humanize(code))
}
const scopes = computed(() => props.draft.scopes ?? [])
function adopted(s: ScopeOption): boolean {
  return scopes.value.includes(s.id)
}
function adopt(s: ScopeOption, on: boolean) {
  if (on && !adopted(s)) (props.draft.scopes ??= []).push(s.id)
  if (!on && adopted(s)) {
    scopes.value.splice(scopes.value.indexOf(s.id), 1)
    if (props.schema.declaration.scopes?.includes(s.id)) emit('remove', 'scopes', s.id)
  }
}
</script>

<template>
  <div class="pim-stack">
    <DefinitionList :count="options.plugins.length" :columns="['details']">
      <template #head><header class="pim-bsection-head"><h3>Plugins</h3><span class="muted small">{{ options.plugins.length }} installed</span></header></template>
      <div v-if="options.plugins.length === 0" class="pim-aspect muted">No plugin is installed.</div>
      <DefinitionRow v-for="p in options.plugins" :key="p.plugin" :title="humanLabel(p.title, 'Plugin')">
        <template #details><Tag :severity="chosen(p) ? 'success' : 'secondary'" :value="chosen(p) ? 'Active' : 'Inactive'" /></template>
        <template v-if="canEdit" #actions>
          <ToggleSwitch :aria-label="'Enable ' + humanLabel(p.title, 'Plugin')" :model-value="chosen(p)" @update:model-value="choose(p, $event)" />
        </template>
        <Message v-if="current(p)?.problem" severity="warn">
          {{ current(p)?.problem?.message }} <code>{{ current(p)?.problem?.code }}</code>
        </Message>
        <p v-if="contributed(p).length" class="muted small">Fields: {{ contributed(p).join(', ') }}.</p>
        <ConfigForm v-if="chosen(p)" :disabled="!canEdit" :schema="p.config_schema" :model-value="pluginConfigs[p.plugin] ?? current(p)?.config ?? {}" @update:model-value="setConfig(p, $event)" />
        <p v-if="current(p)?.active" class="muted small">
          {{ lifecycleLabels[current(p)!.lifecycle.state] }}
          <span v-for="(projection, kind) in current(p)?.projections" :key="kind">
            · {{ humanize(humanLabel(kind, 'Background update')) }}: {{ projection.parked ? 'Paused' : projection.bootstrapping ? 'Starting' : 'Ready' }}
          </span>
        </p>
        <Button v-if="canEdit && current(p)?.active && pluginConfigs[p.plugin]" :disabled="stale" label="Save configuration" @click="emit('configure', p.plugin, pluginConfigs[p.plugin])" />
      </DefinitionRow>
    </DefinitionList>
    <DefinitionList :count="options.scopes.length" :columns="['details']">
      <template #head><header class="pim-bsection-head"><h3>Scopes</h3><span class="muted small">Filters added by plugins</span></header></template>
      <div v-if="options.scopes.length === 0" class="pim-aspect muted">No scope is declared.</div>
      <DefinitionRow v-for="s in options.scopes" :key="s.id" :title="humanLabel(s.title, 'Scope')">
        <template #details><Tag :severity="adopted(s) ? 'success' : 'secondary'" :value="adopted(s) ? 'Adopted' : 'Not adopted'" /></template>
        <template v-if="canEdit" #actions>
          <ToggleSwitch :aria-label="'Adopt ' + humanLabel(s.title, 'Scope')" :model-value="adopted(s)" @update:model-value="adopt(s, $event)" />
        </template>
        <div class="row wrap muted small">
          <span>Filters</span>
          <Tag v-for="(f, name) in s.filters" :key="name" class="kx-tag-sm small" severity="secondary" :value="filterLabel(name, f.ops)" />
          <span>{{ humanize(s.access) }} access required</span>
        </div>
      </DefinitionRow>
    </DefinitionList>
  </div>
</template>
