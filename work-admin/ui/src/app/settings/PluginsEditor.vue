<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { formatApiError } from '../../transport'
import { Icon } from '@iconify/vue'
import { host } from '@wippy-fe/proxy'
import DefinitionRow from './DefinitionRow.vue'
import DefinitionList from './DefinitionList.vue'
import ToggleSwitch from 'primevue/toggleswitch'
import { computed, ref } from 'vue'
import ChipPicker from './ChipPicker.vue'
import { humanize } from '../../forms'
import { configFields } from './config'
import Button from 'primevue/button'
import type { Declaration, InstalledRule, PluginOption, Schema } from '../../types'
import type { PluginConfigs } from './model'
import { pluginIssue, projectionHealth } from './plugin-state'
import { settings } from './api'
import ConfigForm from './ConfigForm.vue'
const props = defineProps<{ boardId: string; draft: Declaration; schema: Schema; options: PluginOption[]; configs: PluginConfigs; disabled?: boolean; activationLocked?: boolean; filters?: InstalledRule[] }>()
const emit = defineEmits<{ configured: []; refresh: []; review: [opener?: HTMLElement]; validity: [key: string, valid: boolean] }>()
const edit = defineModel<PluginConfigs>('activeConfigs', { default: () => ({}) })
const busy = ref(''), error = ref(''), saved = ref('')
const invalid = ref(new Set<string>())
const validationMessages = ref<Record<string, string>>({})
const repairing = ref(new Set<string>())
const rows = computed(() => props.options.map(plugin => {
  const current = state(plugin.plugin)
  return { plugin, current, issue: pluginIssue(plugin, current) }
}))
const readOnly = computed(() => !!busy.value || props.disabled)
const activationDisabled = computed(() => readOnly.value || props.activationLocked)
const emptyConfig: Record<string, unknown> = {}
const planningPlugin = 'kickside.work.planning:plugin'
const planningTypes = computed(() => (props.draft.item_types ?? []).filter(type => !['issue', 'sprint', 'milestone'].includes(type.id))
  .map(type => ({ value: type.id, label: type.title || humanize(type.id) })))
const hasPlanningFields = computed(() => ['current_sprint', 'milestone'].every(code =>
  props.schema.compiled?.fields?.some(field => field.code === code)))
const orphanedFilters = computed(() => {
  const filters = props.filters
  if (!filters) return []
  return (props.draft.scopes ?? []).filter(id =>
    !filters.some(filter => filter.id === id && props.options.some(plugin => plugin.plugin === filter.plugin)))
})
function pluginFilters(id: string) { return (props.filters ?? []).filter(filter => filter.plugin === id) }
function setFilters(id: string, selected: string[]) {
  const owned = new Set(pluginFilters(id).map(filter => filter.id))
  const current = props.draft.scopes ?? []
  const next = [...current.filter(filter => !owned.has(filter)), ...selected]
  if (next.length !== current.length || next.some(filter => !current.includes(filter))) props.draft.scopes = next
}
function toggleConfig(id: string, value: string[]) {
  update(id, { ...config(id), issue_types: value })
}
function hasConfig(plugin: PluginOption): plugin is PluginOption & { config_schema: Record<string, unknown> } {
  return !!plugin.config_schema && configFields(plugin.config_schema).length > 0
}
function state(id: string) { return props.schema.plugins?.find(p => p.plugin === id) }
function active(id: string) { return state(id)?.active === true }
function selected(id: string) { return props.draft.plugins?.some(p => p.use === id) === true }
function toggle(id: string, enabled: boolean) {
  const plugins = props.draft.plugins ?? []
  if (enabled && !selected(id)) props.draft.plugins = [...plugins, { use: id }]
  if (!enabled) { props.draft.plugins = plugins.filter(p => p.use !== id); delete props.configs[id]; invalid.value.delete(id); emit('validity', id, true); setFilters(id, []) }
}
function reviewRemoval(id: string, event: MouseEvent) {
  toggle(id, false)
  emit('review', event.currentTarget as HTMLElement)
}
function config(id: string): Record<string, unknown> {
  if (active(id)) return edit.value[id] ?? state(id)?.config ?? emptyConfig
  return props.configs[id] ?? emptyConfig
}
function update(id: string, value: Record<string, unknown>) {
  if (active(id)) edit.value = { ...edit.value, [id]: value }
  else props.configs[id] = value
}
function resetConfig(id: string) {
  if (active(id)) {
    const next = { ...edit.value }
    delete next[id]
    edit.value = next
  } else delete props.configs[id]
}
function validity(id: string, valid: boolean) { if (valid) invalid.value.delete(id); else invalid.value.add(id); if (!active(id)) emit('validity', id, valid) }
async function resetProjection(id: string) {
  const confirmed = await host.confirm({
    header: 'Reset projection?',
    message: 'Resetting can rebuild from current items or replay retained events, depending on the projection.',
    acceptLabel: 'Reset projection',
    rejectLabel: 'Cancel',
  })
  if (confirmed) await submit(id, true)
}
async function submit(id: string, retry = false) {
  if (readOnly.value || (!retry && invalid.value.has(id))) return
  busy.value = id
  error.value = ''
  saved.value = ''
  try {
    if (retry) await settings.configure(props.boardId, id)
    else {
      await settings.configure(props.boardId, id, config(id))
      resetConfig(id)
      repairing.value.delete(id)
    }
    saved.value = retry ? 'Plugin recovery started.' : 'Plugin configuration saved.'
    emit('configured')
  } catch (e) {
    error.value = formatApiError(e, retry ? 'Could not recover the plugin.' : 'Could not configure plugin.')
  } finally {
    busy.value = ''
  }
}
</script>
<template>
  <section class="work-stack" aria-label="Plugins editor">
    <p v-if="!options.length" class="kx-loading">No installed plugins are visible to you.</p>
    <div v-if="error" class="kx-err" role="alert">{{ error }}</div><p v-if="saved" class="work-notice" role="status">{{ saved }}</p>
    <DefinitionList columns="plugins" :count="options.length">
      <DefinitionRow v-for="{ plugin, current, issue } in rows" :key="plugin.plugin"
        :title="plugin.installed === false ? plugin.plugin : plugin.title || plugin.plugin"
        :description="plugin.description"
        :kind="selected(plugin.plugin) && invalid.has(plugin.plugin) ? 'Configuration needed' : selected(plugin.plugin) !== active(plugin.plugin) ? 'Pending review' : issue?.status"
        class="work-stack">
        <template v-if="selected(plugin.plugin) && validationMessages[plugin.plugin]" #status>
          <span class="work-block work-small work-error">{{ validationMessages[plugin.plugin] }}</span>
        </template>
        <template #actions>
          <ToggleSwitch v-if="issue?.kind !== 'missing'" :model-value="selected(plugin.plugin)"
            :aria-label="'Enable ' + (plugin.title || plugin.plugin)"
            :disabled="activationDisabled || (!!plugin.problem && !selected(plugin.plugin))"
            @update:model-value="toggle(plugin.plugin, $event)" />
        </template>
        <p v-if="plugin.requires.length" class="work-muted work-small">Requires {{ plugin.requires.map(id => options.find(p => p.plugin === id)?.title || 'Another capability').join(', ') }}</p>
        <p v-if="current?.outdated" class="work-notice">The stored declaration differs from the installed plugin. Review activation to update it.</p>
        <div v-if="issue || current?.active" class="work-stack work-tight work-plugin-status">
          <p v-if="issue && 'cause' in issue" class="work-muted">{{ issue.cause }}</p>
          <p v-else-if="!issue">{{ current?.lifecycle.state === 'ready' ? 'Ready to use' : 'Getting ready' }}</p>
          <div v-for="(projection, kind) in current?.projections" :key="kind" class="work-stack work-tight">
            <p>{{ projectionHealth(projection, schema.as_of) }} · Indexed through {{ projection.last_seq }} of {{ schema.as_of }} events.</p>
          </div>
          <div v-if="issue?.kind === 'setup' && current?.active" class="work-row">
            <Button label="Retry setup" severity="secondary" outlined :disabled="readOnly" @click="submit(plugin.plugin, true)" />
          </div>
          <div v-else-if="issue?.kind === 'provider'" class="work-row">
            <Button label="Retry schema check" severity="secondary" outlined :disabled="readOnly" @click="emit('refresh')" />
          </div>
          <Disclosure v-else-if="issue?.kind === 'degraded'" class="work-small" label="Inspect worker">
            <p>Check the failing worker before resetting a projection.</p>
            <p v-for="(projection, kind) in current?.projections" :key="kind">
              {{ kind }} · {{ projectionHealth(projection, schema.as_of) }}
            </p>
          </Disclosure>
          <template v-else-if="issue?.kind === 'history'">
            <p v-if="issue.floor !== undefined" class="work-small">Earliest retained event sequence is {{ issue.floor }}.</p>
            <Disclosure class="work-small" label="Review retained history">
              <p>Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.</p>
            </Disclosure>
          </template>
          <div v-else-if="issue?.kind === 'reset'" class="work-row">
            <Button label="Reset projection" severity="secondary" outlined :disabled="readOnly" @click="resetProjection(plugin.plugin)" />
            <span class="work-muted work-small">Resolve the worker error before resetting.</span>
          </div>
          <div v-else-if="issue?.kind === 'configuration' && selected(plugin.plugin) && hasConfig(plugin) && !repairing.has(plugin.plugin)" class="work-row">
            <Button label="Edit configuration" severity="secondary" outlined :disabled="readOnly" @click="repairing.add(plugin.plugin)" />
          </div>
          <div v-else-if="issue?.kind === 'missing' && selected(plugin.plugin)" class="work-row">
            <Button label="Review references" severity="secondary" outlined :disabled="activationDisabled" @click="reviewRemoval(plugin.plugin, $event)" />
          </div>
        </div>
        <section v-if="pluginFilters(plugin.plugin).length && (selected(plugin.plugin) || active(plugin.plugin))" class="work-stack work-tight">
          <h4>Query filters</h4>
          <p class="work-muted">Choose which filters people can use to narrow down work on this board.</p>
          <ChipPicker label="Available filters" :disabled="!!busy || disabled || !selected(plugin.plugin)" :options="pluginFilters(plugin.plugin).map(filter => ({ value: filter.id, label: filter.title }))"
            :model-value="draft.scopes?.filter(id => pluginFilters(plugin.plugin).some(filter => filter.id === id))"
            @update:model-value="setFilters(plugin.plugin, $event)" />
        </section>
        <component v-if="selected(plugin.plugin) && hasConfig(plugin) && issue?.kind !== 'manifest' && issue?.kind !== 'missing'
            && (issue?.kind !== 'configuration' || repairing.has(plugin.plugin))"
          :is="issue && issue.kind !== 'configuration' ? Disclosure : 'div'"
          :label="issue && issue.kind !== 'configuration' ? 'Plugin settings' : undefined"
          class="work-stack work-tight">
          <template v-if="plugin.plugin === planningPlugin">
            <p v-if="!hasPlanningFields" class="work-muted">The Planning pack supplies sprint and milestone fields for item types.</p>
            <ChipPicker v-else label="Plan these item types" :options="planningTypes" :model-value="config(plugin.plugin).issue_types as string[] | undefined"
              :disabled="!!busy || disabled" @update:model-value="toggleConfig(plugin.plugin, $event)" />
            <p class="work-muted">Selected types get Current sprint and Milestone fields.</p>
          </template>
          <ConfigForm v-else :disabled="!!busy || disabled" :schema="plugin.config_schema" :model-value="config(plugin.plugin)" suggest-defaults
            @update:model-value="update(plugin.plugin, $event)" @validity="validity(plugin.plugin, $event)"
            @validation-message="validationMessages[plugin.plugin] = $event" />
          <div class="work-form-actions">
            <Button :label="issue ? 'Reset form values' : 'Reset'" severity="secondary" outlined :disabled="!!busy || disabled" @click="resetConfig(plugin.plugin)" />
            <Button v-if="active(plugin.plugin)" label="Save plugin settings" :disabled="!!busy || disabled || invalid.has(plugin.plugin) || !edit[plugin.plugin]" :loading="busy === plugin.plugin" @click="submit(plugin.plugin)" />
          </div>
        </component>
      </DefinitionRow>
    </DefinitionList>
    <Disclosure v-if="orphanedFilters.length" class="work-settings-card work-disclosure" label="Unavailable query filters">
      <p class="work-muted">These filters came from a plugin that is unavailable. Remove one to stop using it on this board.</p>
      <Button v-for="(id, index) in orphanedFilters" :key="id" :label="'Remove unavailable filter ' + (index + 1)" severity="secondary" text
        @click="draft.scopes = draft.scopes?.filter(filter => filter !== id)" />
    </Disclosure>
    <article v-for="plugin in draft.plugins?.filter(p => !options.some(o => o.plugin === p.use)) ?? []" :key="plugin.use" class="work-settings-card work-stack">
      <p><strong>{{ plugin.use }}</strong> · Not installed</p>
      <p class="work-muted">This board still references a plugin that is no longer installed.</p>
      <Button label="Review references" severity="secondary" outlined :disabled="activationDisabled" @click="reviewRemoval(plugin.use, $event)" />
    </article>
  </section>
</template>
