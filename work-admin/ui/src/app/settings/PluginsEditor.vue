<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import SettingsGroup from '@kickside/ui-kit/SettingsGroup.vue'
import SettingsItem from '@kickside/ui-kit/SettingsItem.vue'
import { formatApiError } from '../../transport'
import { host } from '@wippy-fe/proxy'
import ToggleSwitch from 'primevue/toggleswitch'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import { computed, inject, nextTick, ref, useId, watch } from 'vue'
import ChipPicker from './ChipPicker.vue'
import { humanize } from '../../forms'
import { configFields } from './config'
import Button from 'primevue/button'
import type { Declaration, InstalledRule, PluginOption, PluginState, Schema } from '../../types'
import type { PluginConfigs } from './model'
import { pluginIssue, projectionError, projectionHealth } from './plugin-state'
import { groupByCategory, listNames } from '@kickside/ui-kit/settingsGroups'
import type { InstalledPack } from '../../packs'
import { settings } from './api'
import ConfigForm from './ConfigForm.vue'
import { sectionRow } from './sectionRow'
const props = defineProps<{ boardId: string; draft: Declaration; schema: Schema; options: PluginOption[]; configs: PluginConfigs; disabled?: boolean; activationLocked?: boolean; filters?: InstalledRule[]; pack?: InstalledPack }>()
const emit = defineEmits<{ configured: []; refresh: []; review: [opener?: HTMLElement]; upgrade: []; validity: [key: string, valid: boolean]; 'widget-validity': [key: string, valid: boolean] }>()
const busy = ref(''), error = ref(''), saved = ref('')
const expanded = ref<Record<string, boolean>>({})
const location = inject(sectionRow, undefined)
const invalid = ref(new Set<string>())
const widgetInvalid = ref(new Set<string>())
const configVersions = ref<Record<string, number>>({})
const forms = new Map<string, InstanceType<typeof ConfigForm>>()
const validationMessages = ref<Record<string, string>>({})
const severities = { Enabled: 'success', Available: 'secondary', 'Setting up': 'info', 'Catching up': 'info', 'Turns on when applied': 'info', 'Turns off when applied': 'info' } as const
const rows = computed(() => props.options.map(plugin => {
  const current = state(plugin.plugin)
  const issue = pluginIssue(plugin, current)
  const chosen = selected(plugin.plugin)
  const enabled = current?.active === true
  const status = chosen && invalid.value.has(plugin.plugin) ? 'Needs configuration'
    : chosen !== enabled ? chosen ? 'Turns on when applied' : 'Turns off when applied'
    : issue?.status ?? (enabled ? current.lifecycle.state !== 'ready' ? 'Setting up' : catchingUp(current) ? 'Catching up' : 'Enabled' : 'Available')
  const severity: string = severities[status as keyof typeof severities] ?? (issue?.kind === 'missing' || issue?.kind === 'manifest' ? 'danger' : 'warn')
  const title = plugin.installed === false ? 'Unavailable plugin' : plugin.title || 'Unnamed plugin'
  const configurable = chosen && hasConfig(plugin) && issue?.kind !== 'manifest' && issue?.kind !== 'missing'
  const filtered = pluginFilters(plugin.plugin).length > 0 && (chosen || enabled)
  return { plugin, current, issue, chosen, enabled, status, severity, title, configurable, filtered, needs: needs(plugin), usedBy: usedBy(plugin.plugin) }
}))
const groups = computed(() => groupByCategory(rows.value, row => row.plugin.category, row => row.enabled))
const readOnly = computed(() => !!busy.value || props.disabled)
const activationDisabled = computed(() => readOnly.value || props.activationLocked)
const emptyConfig: Record<string, unknown> = {}
const planningHelpId = useId()
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
const unavailable = computed(() => props.draft.plugins?.filter(p => !props.options.some(o => o.plugin === p.use)) ?? [])
const pendingNote = computed(() => !props.activationLocked && rows.value.some(row => row.chosen !== row.enabled))
function titleOf(id: string) { return props.options.find(p => p.plugin === id)?.title || 'Another plugin' }
function needs(plugin: PluginOption) { return plugin.requires.map(titleOf) }
function usedBy(id: string) {
  return [
    ...(props.pack?.requires.includes(id) ? [props.pack.title] : []),
    ...props.options.filter(other => other.requires.includes(id) && selected(other.plugin)).map(other => other.title || 'Another plugin'),
  ]
}
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
function fieldTitle(plugin: PluginOption, key: string) {
  return configFields(plugin.config_schema ?? {}).find(field => field.key === key)?.title ?? humanize(key)
}
function catchingUp(current: PluginState) {
  return Object.values(current.projections).some(projection => !projection.parked && (projection.bootstrapping || projection.last_seq < props.schema.as_of))
}
function state(id: string) { return props.schema.plugins?.find(p => p.plugin === id) }
function active(id: string) { return state(id)?.active === true }
function selected(id: string) { return props.draft.plugins?.some(p => p.use === id) === true }
function isOpen(id: string, issue: unknown) { return expanded.value[id] ?? !!issue }
function setOpen(id: string, open: boolean) {
  expanded.value[id] = open
  location?.choose('plugins', id, open)
}
watch(() => location?.selected.value, (current, previous) => {
  for (const [value, open] of [[previous, false], [current, true]] as const) {
    if (value?.startsWith('plugins/')) expanded.value[value.slice('plugins/'.length)] = open
  }
}, { immediate: true })
function toggle(id: string, enabled: boolean) {
  const plugins = props.draft.plugins ?? []
  if (enabled && !selected(id)) {
    props.draft.plugins = [...plugins, { use: id }]
    if (props.options.some(plugin => plugin.plugin === id && hasConfig(plugin))) setOpen(id, true)
  }
  if (!enabled) { props.draft.plugins = plugins.filter(p => p.use !== id); delete props.configs[id]; invalid.value.delete(id); emit('validity', id, true); widgetValidity(id, true); setFilters(id, []) }
}
function reviewRemoval(id: string, event: MouseEvent) {
  toggle(id, false)
  emit('review', event.currentTarget as HTMLElement)
}
function config(id: string): Record<string, unknown> {
  return props.configs[id] ?? state(id)?.config ?? emptyConfig
}
function update(id: string, value: Record<string, unknown>) {
  saved.value = ''
  props.configs[id] = value
}
function resetConfig(id: string) {
  delete props.configs[id]
  configVersions.value[id] = (configVersions.value[id] ?? 0) + 1
}
function widgetValidity(id: string, valid: boolean) {
  if (valid || !selected(id)) widgetInvalid.value.delete(id)
  else widgetInvalid.value.add(id)
  emit('widget-validity', id, !widgetInvalid.value.has(id))
}
async function reportValidity() {
  const first = rows.value.find(({ plugin, chosen }) => chosen && widgetInvalid.value.has(plugin.plugin))
  if (!first) return true
  expanded.value[first.plugin.plugin] = true
  await nextTick()
  forms.get(first.plugin.plugin)?.reportValidity()
  return false
}
defineExpose({ reportValidity })

function validity(id: string, valid: boolean) {
  if (valid) invalid.value.delete(id)
  else invalid.value.add(id)
  emit('validity', id, valid || !selected(id) || (active(id) && !props.configs[id]))
}
function firstWorkerError(id: string) {
  for (const projection of Object.values(state(id)?.projections ?? {})) {
    const cause = projectionError(projection)
    if (cause) return cause
  }
}
async function resetProjection(id: string) {
  const confirmed = await host.confirm({
    header: 'Reset background updates?',
    message: 'The plugin rebuilds its data from current items or replays retained events.',
    acceptLabel: 'Reset background updates',
    rejectLabel: 'Cancel',
  })
  if (confirmed) await recover(id)
}
async function recover(id: string) {
  if (readOnly.value) return
  busy.value = id
  error.value = ''
  saved.value = ''
  try {
    await settings.configure(props.boardId, id)
    saved.value = 'Plugin recovery started.'
    emit('configured')
  } catch (e) {
    error.value = formatApiError(e, 'Could not recover the plugin.')
  } finally {
    busy.value = ''
  }
}
</script>
<template>
  <section class="work-stack work-plugins" aria-label="Plugins editor">
    <div v-if="error" class="kx-err" role="alert">{{ error }}</div><p v-if="saved" class="work-notice" role="status">{{ saved }}</p>
    <p v-if="pendingNote" class="work-muted work-small" role="status">Plugin changes take effect after you review and apply them.</p>
    <p v-if="!options.length && !pack" class="kx-loading">No installed plugins are visible to you.</p>

    <SettingsGroup v-if="pack" title="Pack" :count="1">
      <SettingsItem :title="pack.title" :description="pack.description" expand-label="Details"
        :open="isOpen('pack', false)" @update:open="expanded.pack = $event">
        <template #status><Tag class="kx-tag-sm work-plugin-state" :severity="pack.outdated ? 'info' : 'success'" :value="pack.outdated ? 'Update available' : 'Installed'" /></template>
        <template v-if="pack.requires.length" #meta>Needs {{ listNames(pack.requires.map(titleOf)) }}</template>
        <template v-if="pack.outdated" #actions>
          <Button label="Review update" severity="secondary" outlined size="small" :disabled="!pack.canUpgrade" :title="pack.upgradeReason" @click="emit('upgrade')" />
        </template>
        <p class="work-muted work-small">The pack set up this board’s item types, workflow and views. Turning off a plugin it needs can remove parts of that setup.</p>
        <Disclosure class="work-disclosure work-small" label="Technical details">
          <dl class="work-stack work-tight">
            <div><dt>Pack ID</dt><dd><code>{{ pack.id }}</code></dd></div>
            <div v-if="pack.version"><dt>Installed version</dt><dd>{{ pack.version }}</dd></div>
            <div><dt>Pack tools</dt><dd><code>WorkPackPlan</code>, <code>WorkPackApply</code></dd></div>
          </dl>
        </Disclosure>
      </SettingsItem>
    </SettingsGroup>

    <SettingsGroup v-for="group in groups" :key="group.title" :title="group.title || undefined" :count="group.title ? group.rows.length : undefined">
      <SettingsItem v-for="{ plugin, current, issue, chosen, status, severity, title, configurable, filtered, needs, usedBy } in group.rows" :key="plugin.plugin"
        :data-plugin="plugin.plugin" :title="title" :description="plugin.description" :expand-label="configurable || filtered ? 'Configure' : 'Details'"
        :keep-mounted="chosen" :open="isOpen(plugin.plugin, issue)" @update:open="setOpen(plugin.plugin, $event)">
        <template #status><Tag class="kx-tag-sm work-plugin-state" :severity="severity" :value="status" /></template>
        <template v-if="needs.length || usedBy.length || chosen && validationMessages[plugin.plugin]" #meta>
          <span v-if="needs.length">Needs {{ listNames(needs) }}</span><span v-if="needs.length && usedBy.length"> · </span><span v-if="usedBy.length">Used by {{ listNames(usedBy) }}</span>
          <span v-if="chosen && validationMessages[plugin.plugin]" class="work-block work-error">{{ validationMessages[plugin.plugin] }}</span>
        </template>
        <template v-if="issue?.kind !== 'missing'" #actions>
          <ToggleSwitch :model-value="chosen" :aria-label="'Enable ' + title"
            :disabled="activationDisabled || (!!plugin.problem && !chosen)"
            @update:model-value="toggle(plugin.plugin, $event)" />
        </template>

        <Message v-if="issue" class="work-plugin-issue" severity="warn" :closable="false">
          <div class="work-stack work-tight">
            <p v-if="issue.kind === 'degraded'">{{ firstWorkerError(plugin.plugin) ?? 'A background update reported an error.' }}</p>
            <p v-else-if="issue.kind === 'reset'">Background updates stopped{{ firstWorkerError(plugin.plugin) ? ': ' + firstWorkerError(plugin.plugin) : '.' }}</p>
            <p v-else-if="'cause' in issue && issue.cause">{{ issue.cause }}</p>
            <p v-if="issue.kind === 'configuration'" class="work-small">Update the settings below, then review and apply your changes.</p>
            <p v-if="issue.kind === 'history' && issue.floor !== undefined" class="work-small">Earliest retained event sequence is {{ issue.floor }}.</p>
            <p v-if="issue.kind === 'history'" class="work-small">Ask the plugin maintainer to review the event projection’s start sequence. The plugin needs a declaration that can run with the retained history.</p>
            <div class="work-row">
              <Button v-if="issue.kind === 'setup' && current?.active" label="Retry setup" severity="secondary" outlined size="small" :disabled="readOnly" @click="recover(plugin.plugin)" />
              <Button v-else-if="issue.kind === 'provider' || issue.kind === 'degraded'" label="Check again" severity="secondary" outlined size="small" @click="emit('refresh')" />
              <Button v-else-if="issue.kind === 'reset'" label="Reset background updates" severity="secondary" outlined size="small" :disabled="readOnly" @click="resetProjection(plugin.plugin)" />
              <Button v-else-if="issue.kind === 'missing' && chosen" label="Review references" severity="secondary" outlined size="small" :disabled="activationDisabled" @click="reviewRemoval(plugin.plugin, $event)" />
            </div>
          </div>
        </Message>

        <section v-if="configurable" class="work-stack work-plugin-config" :aria-label="title + ' settings'">
          <template v-if="plugin.plugin === planningPlugin">
            <p v-if="!hasPlanningFields" class="work-muted">The Planning pack supplies sprint and milestone fields for item types.</p>
            <ChipPicker v-else :label="fieldTitle(plugin, 'issue_types')"
              :aria-describedby="planningHelpId" :options="planningTypes" :model-value="config(plugin.plugin).issue_types as string[] | undefined"
              :disabled="!!busy || disabled" @update:model-value="toggleConfig(plugin.plugin, $event)" />
            <p :id="planningHelpId" class="work-muted work-small">Selected types get Current sprint and Milestone fields.</p>
          </template>
          <ConfigForm v-else :key="configVersions[plugin.plugin]" :ref="form => { if (form) forms.set(plugin.plugin, form as InstanceType<typeof ConfigForm>); else forms.delete(plugin.plugin) }" :disabled="!!busy || disabled" :schema="plugin.config_schema ?? {}" :model-value="config(plugin.plugin)" suggest-defaults
            @update:model-value="update(plugin.plugin, $event)" @validity="validity(plugin.plugin, $event)"
            @widget-validity="widgetValidity(plugin.plugin, $event)" @validation-message="validationMessages[plugin.plugin] = $event" />
          <div class="work-row">
            <Button label="Restore saved settings" severity="secondary" outlined size="small" :disabled="!!busy || disabled" @click="resetConfig(plugin.plugin)" />
          </div>
        </section>

        <section v-if="filtered" class="work-stack work-tight">
          <h4>Filters</h4>
          <p class="work-muted work-small">Choose which filters people can use to narrow down work on this board.</p>
          <ChipPicker label="Available filters" :disabled="!!busy || disabled || !chosen" :options="pluginFilters(plugin.plugin).map(filter => ({ value: filter.id, label: filter.title }))"
            :model-value="draft.scopes?.filter(id => pluginFilters(plugin.plugin).some(filter => filter.id === id))"
            @update:model-value="setFilters(plugin.plugin, $event)" />
        </section>

        <p v-if="!configurable && !filtered && !issue" class="work-muted work-small">
          {{ chosen ? 'This plugin has no settings for this board.' : 'Turn the plugin on to use it on this board.' }}
        </p>

        <Disclosure class="work-disclosure work-small" label="Technical details">
          <dl class="work-stack work-tight">
            <div><dt>Plugin ID</dt><dd><code>{{ plugin.plugin }}</code></dd></div>
            <div v-if="(current?.interface_version ?? plugin.interface_version) != null">
              <dt>Interface version</dt><dd>{{ current?.interface_version ?? plugin.interface_version }}</dd>
            </div>
            <div v-if="current?.version"><dt>Active schema version</dt><dd>{{ current.version }}</dd></div>
            <div v-if="plugin.installed"><dt>Configuration tool</dt><dd><code>WorkConfigurePlugin</code></dd></div>
            <div v-if="plugin.tools.length"><dt>Plugin tools</dt><dd><code v-for="tool in plugin.tools" :key="tool" class="work-block">{{ tool }}</code></dd></div>
            <div v-for="(projection, kind) in current?.projections" :key="kind">
              <dt>{{ humanize(kind) }}</dt>
              <dd>{{ projectionHealth(projection, schema.as_of) }} · Indexed through {{ projection.last_seq }} of {{ schema.as_of }} events.</dd>
            </div>
          </dl>
        </Disclosure>
      </SettingsItem>
    </SettingsGroup>

    <SettingsGroup v-if="unavailable.length" title="Unavailable" :count="unavailable.length">
      <SettingsItem v-for="plugin in unavailable" :key="plugin.use" title="Unavailable plugin" description="This board still references a plugin that is no longer installed.">
        <template #status><Tag class="kx-tag-sm work-plugin-state" severity="danger" value="Not installed" /></template>
        <template #actions><Button label="Review references" severity="secondary" outlined size="small" :disabled="activationDisabled" @click="reviewRemoval(plugin.use, $event)" /></template>
      </SettingsItem>
    </SettingsGroup>

    <Disclosure v-if="orphanedFilters.length" class="work-settings-card work-disclosure" label="Unavailable query filters">
      <p class="work-muted">These filters came from a plugin that is unavailable. Remove one to stop using it on this board.</p>
      <Button v-for="(id, index) in orphanedFilters" :key="id" :label="'Remove unavailable filter ' + (index + 1)" severity="secondary" text
        @click="draft.scopes = draft.scopes?.filter(filter => filter !== id)" />
    </Disclosure>
  </section>
</template>
