<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Message from 'primevue/message'
import ToggleSwitch from 'primevue/toggleswitch'
import { computed, inject, nextTick, ref, watch } from 'vue'
import SettingsGroup from '@kickside/ui-kit/SettingsGroup.vue'
import SettingsItem from '@kickside/ui-kit/SettingsItem.vue'
import { groupByCategory, listNames } from '@kickside/ui-kit/settingsGroups'
import NativeDialog from '../../shared/NativeDialog.vue'
import { humanLabel } from '../../shared/labels'
import type { PluginConfigRefusal } from '../../shared/transport'
import { humanize } from '../../forms'
import type { Declaration, PluginView, RemoveDecl, SchemaOptions, SchemaView, ScopeOption } from '../../types'
import { installedInterfaceProblem, pluginStatus } from './plugin-state'
import ConfigForm from './ConfigForm.vue'
import { sectionRow } from '../../shared/sectionRow'

const props = withDefaults(defineProps<{ draft: Declaration; schema: SchemaView; options: SchemaOptions; pluginConfigs?: Record<string, Record<string, unknown>>; refusal?: PluginConfigRefusal; stale?: boolean }>(), { pluginConfigs: () => ({}) })
const emit = defineEmits<{
  remove: [kind: keyof RemoveDecl, id: string]
  reset: [plugin: string]
  resume: [cursorId: string]
  refresh: []
  review: []
  clearShellBinding: [binding: string]
  clearRefusal: []
  'invalid-draft': [invalid: boolean]
}>()
const filterOperators = new Map([
  ['eq', 'Equals'],
  ['in', 'Is one of'],
  ['gt', 'Greater than'],
  ['gte', 'At least'],
  ['lt', 'Less than'],
  ['lte', 'At most'],
])
const expanded = ref<Record<string, boolean>>({})
const forms = new Map<string, InstanceType<typeof ConfigForm>>()
const invalidFields = ref(new Set<string>())
const invalidDrafts = ref(new Set<string>())
watch(() => invalidDrafts.value.size > 0, invalid => emit('invalid-draft', invalid))

function validity(id: string, valid: boolean, localErrors: boolean) {
  if (valid) invalidFields.value.delete(id)
  else invalidFields.value.add(id)
  if (localErrors) invalidDrafts.value.add(id)
  else invalidDrafts.value.delete(id)
}

function reportValidity() {
  const first = rows.value.find(({ plugin, chosen }) => chosen && invalidFields.value.has(plugin.plugin) &&
    (invalidDrafts.value.has(plugin.plugin) || Object.hasOwn(props.pluginConfigs, plugin.plugin) ||
     !plugin.active || props.refusal?.plugin === plugin.plugin))
  if (!first) return true
  expanded.value[first.plugin.plugin] = true
  void nextTick(() => forms.get(first.plugin.plugin)?.reportValidity())
  return false
}

defineExpose({ reportValidity })
watch(() => props.refusal, refusal => {
  if (refusal) expanded.value[refusal.plugin] = true
}, { immediate: true })
const referenceId = ref<string>()
const referenceRow = computed(() => rows.value.find(row => row.plugin.plugin === referenceId.value))
const referencePlugin = computed(() => referenceRow.value?.plugin)
const canEdit = computed(() => props.schema.access.admin)
const chosenPlugins = computed(() => props.draft.plugins ?? [])
const current = computed(() => new Map(props.schema.plugins.map(plugin => [plugin.plugin, plugin])))
const contributedFields = computed(() => {
  const fields = new Map<string, string[]>()
  for (const [code, field] of Object.entries(props.schema.attributes)) {
    if (!field.plugin) continue
    const labels = fields.get(field.plugin) ?? []
    labels.push(humanize(code))
    fields.set(field.plugin, labels)
  }
  return fields
})
const rows = computed(() => props.options.plugins.map(option => {
  const plugin = current.value.get(option.plugin) ?? option
  const status = pluginStatus(plugin, props.schema.as_of)
  const chosen = chosenPlugins.value.some(entry => entry.use === plugin.plugin)
  const refusal = props.refusal?.plugin === plugin.plugin ? props.refusal : undefined
  return {
    option, plugin, status, chosen, refusal,
    title: humanLabel(plugin.title ?? option.title, plugin.installed ? 'Plugin' : 'Unavailable plugin'),
    label: refusal || invalidDrafts.value.has(plugin.plugin) ? 'Needs configuration' : !plugin.active && status?.kind === 'failed' ? 'Unavailable' : status?.label ?? (chosen
      ? plugin.active ? 'Enabled' : 'Turns on when applied'
      : plugin.active ? 'Turns off when applied' : 'Available'),
    severity: refusal || invalidDrafts.value.has(plugin.plugin) ? 'warn' as const : status?.severity ?? (chosen === plugin.active ? chosen ? 'success' : 'secondary' : 'info'),
    configurable: chosen && plugin.installed && status?.kind !== 'failed' && status?.kind !== 'uninstalled' && (Object.keys(option.config_schema.properties ?? {}).length > 0 || status?.kind === 'config'),
    needs: option.requires.map(titleOf),
    usedBy: props.options.plugins.filter(other => other.requires.includes(plugin.plugin) && chosenPlugins.value.some(entry => entry.use === other.plugin)).map(other => titleOf(other.plugin)),
    open: expanded.value[plugin.plugin] ?? (chosen && (!plugin.active || !!props.pluginConfigs[plugin.plugin]) || !!(plugin.active && status && status.kind !== 'pending')),
  }
}))
const groups = computed(() => groupByCategory(rows.value, row => row.option.category, row => row.plugin.active))
const location = inject(sectionRow, undefined)
watch(() => location?.selected.value, (current, previous) => {
  for (const [value, open] of [[previous, false], [current, true]] as const) {
    if (value?.startsWith('plugins/')) expanded.value[value.slice('plugins/'.length)] = open
  }
}, { immediate: true })
function titleOf(id: string) {
  return humanLabel(props.options.plugins.find(plugin => plugin.plugin === id)?.title, 'Another plugin')
}
function setOpen(id: string, open: boolean) {
  expanded.value[id] = open
  location?.choose('plugins', id, open)
}

function filterLabel(name: string, operators: string[]): string {
  const labels = operators.map(operator => filterOperators.get(operator)).filter(Boolean)
  return [humanize(name), labels.join(', ')].filter(Boolean).join(' · ')
}

function choose(id: string, on: boolean) {
  if (on && !chosenPlugins.value.some(entry => entry.use === id)) {
    (props.draft.plugins ??= []).push({ use: id })
    expanded.value[id] = true
  }
  if (!on) {
    expanded.value[id] = false
    props.draft.plugins = chosenPlugins.value.filter(entry => entry.use !== id)
    delete props.pluginConfigs[id]
    if (props.refusal?.plugin === id) emit('clearRefusal')
    if (current.value.get(id)?.active) emit('remove', 'plugins', id)
  }
}

function setConfig(id: string, value: Record<string, unknown>) {
  expanded.value[id] = true
  const previous = props.pluginConfigs[id] ?? current.value.get(id)?.config ?? {}
  props.pluginConfigs[id] = value
  if (props.refusal?.plugin === id && JSON.stringify(previous[props.refusal.field]) !== JSON.stringify(value[props.refusal.field])) {
    emit('clearRefusal')
  }
}

const scopes = computed(() => props.draft.scopes ?? [])
function adopted(scope: ScopeOption): boolean {
  return scopes.value.includes(scope.id)
}
function adopt(scope: ScopeOption, on: boolean) {
  if (on && !adopted(scope)) (props.draft.scopes ??= []).push(scope.id)
  if (!on && adopted(scope)) {
    scopes.value.splice(scopes.value.indexOf(scope.id), 1)
    if (props.schema.declaration.scopes?.includes(scope.id)) emit('remove', 'scopes', scope.id)
  }
}

const references = computed(() => {
  const plugin = referencePlugin.value
  if (!plugin) return []
  const existing = plugin.references
  const fields = existing?.fields ?? Object.entries(props.schema.attributes)
    .filter(([, field]) => field.plugin === plugin.plugin).map(([code]) => code)
  return [
    { label: 'Fields', items: fields.map(id => ({ id, title: humanLabel(humanize(id), 'Field') })) },
    { label: 'Product filter sets', items: (existing?.scopes ?? []).map(id => ({
      id, title: humanLabel(props.options.scopes.find(scope => scope.id === id)?.title, 'Unavailable filter set'),
    })) },
    { label: 'Catalog app binding', items: (existing?.shell_bindings ?? []).map(id => ({ id, title: 'Catalog app' })) },
    { label: 'Readiness checks', items: (existing?.checks ?? []).map(id => ({ id, title: 'Readiness check' })) },
    { label: 'Dependent plugins', items: (existing?.plugins ?? []).map(id => ({
      id, title: humanLabel(current.value.get(id)?.title, 'Dependent plugin'),
    })) },
  ].filter(entry => entry.items.length)
})

function reviewRemoval(plugin: PluginView) {
  for (const id of plugin.references?.scopes ?? []) {
    if (!scopes.value.includes(id)) continue
    props.draft.scopes = scopes.value.filter(scope => scope !== id)
    emit('remove', 'scopes', id)
  }
  referenceId.value = undefined
  choose(plugin.plugin, false)
  emit('review')
}
</script>

<template>
  <div class="pim-stack pim-plugins">
    <p v-if="canEdit && rows.some(row => row.chosen !== row.plugin.active || Object.hasOwn(pluginConfigs, row.plugin.plugin))" class="muted small" role="status">Plugin changes take effect after you review and apply them.</p>
    <p v-if="rows.length === 0" class="muted">No plugin is installed.</p>
    <SettingsGroup v-for="group in groups" :key="group.title" :title="group.title || undefined" :count="group.title ? group.rows.length : undefined">
      <SettingsItem v-for="{ option, plugin, status, chosen, title, label, severity, refusal, configurable, needs, usedBy, open } in group.rows" :key="plugin.plugin"
        :data-plugin="plugin.plugin" :title="title" :description="option.description ? humanLabel(option.description, '') || undefined : undefined"
        :expand-label="configurable ? 'Configure' : 'Details'"
        :keep-mounted="invalidDrafts.has(plugin.plugin)" :open="open" @update:open="setOpen(plugin.plugin, $event)">
        <template #status><Tag class="kx-tag-sm pim-plugin-state" :severity="severity" :value="label" /></template>
        <template v-if="needs.length || usedBy.length" #meta>
          <span v-if="needs.length">Needs {{ listNames(needs) }}</span><span v-if="needs.length && usedBy.length"> · </span><span v-if="usedBy.length">Used by {{ listNames(usedBy) }}</span>
        </template>
        <template v-if="canEdit && plugin.installed && (!status || status.kind === 'pending')" #actions>
          <ToggleSwitch :aria-label="'Enable ' + title" :model-value="chosen" @update:model-value="choose(plugin.plugin, $event)" />
        </template>

        <div class="pim-stack pim-plugin-recovery">
          <template v-if="status?.kind === 'failed'">
            <Message severity="warn" role="alert">
              <p v-if="installedInterfaceProblem(plugin)">This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.</p>
              <p v-else>The catalog could not set up this plugin. Check the status after resolving the setup problem.</p>
              <p v-if="plugin.active && status.projection?.[1].parked" class="small">Background update: Paused</p>
              <div class="row pim-plugin-action">
                <Button v-if="canEdit && plugin.references" label="Review references" severity="secondary" outlined size="small" @click="referenceId = plugin.plugin" />
                <Button v-else label="Check status" severity="secondary" outlined size="small" @click="emit('refresh')" />
              </div>
            </Message>
          </template>

          <Message v-else-if="status?.kind === 'reset'" severity="warn">
            <p>The event history this background update needs was removed.</p>
            <p v-if="status.error?.max_pruned_seq !== undefined" class="small">Earliest retained position {{ status.error.max_pruned_seq + 1 }}.</p>
            <div v-if="canEdit" class="row pim-plugin-action">
              <Button label="Reset background updates" severity="secondary" outlined size="small" :disabled="stale" @click="emit('reset', plugin.plugin)" />
            </div>
          </Message>

          <Message v-else-if="status?.projection && (status.kind === 'paused' || status.kind === 'degraded' || status.kind === 'catchingUp')" :severity="status.kind === 'catchingUp' ? 'info' : 'warn'">
            <p v-if="status.projection[1].status === 'paused'">This update was paused.</p>
            <p v-else-if="status.kind === 'paused'">The background worker stopped.</p>
            <p v-else-if="status.kind === 'degraded'">The background worker reported an error.</p>
            <p v-else>This update is processing catalog changes.</p>
            <p class="small">Last applied position {{ status.projection[1].last_seq }}.</p>
            <div class="row pim-plugin-action">
              <Button v-if="canEdit && status.projection[1].status === 'paused' && status.projection[1].cursor_id"
                label="Resume background update" severity="secondary" outlined size="small" :disabled="stale" @click="emit('resume', status.projection[1].cursor_id)" />
              <Button v-else-if="status.kind === 'paused' && canEdit" label="Reset background updates" severity="secondary" outlined size="small" :disabled="stale" @click="emit('reset', plugin.plugin)" />
              <Button v-else label="Check status" severity="secondary" outlined size="small" @click="emit('refresh')" />
            </div>
          </Message>

          <Message v-else-if="status?.kind === 'uninstalled'" severity="warn">
            <p>The package was removed while it was still enabled for this catalog.</p>
            <div class="row pim-plugin-action">
              <Button label="Review references" severity="secondary" outlined size="small" @click="referenceId = plugin.plugin" />
            </div>
          </Message>

          <p v-if="contributedFields.get(plugin.plugin)?.length" class="muted small">
            Adds fields for {{ contributedFields.get(plugin.plugin)?.join(', ') }}.
          </p>
          <ConfigForm v-if="configurable" :ref="form => { if (form) forms.set(plugin.plugin, form as InstanceType<typeof ConfigForm>); else forms.delete(plugin.plugin) }"
            :disabled="!canEdit" :schema="option.config_schema" :model-value="pluginConfigs[plugin.plugin] ?? plugin.config ?? {}"
            :problem="status?.kind === 'config' && !Object.hasOwn(pluginConfigs, plugin.plugin) ? status.error : undefined"
            :plugin-id="status?.kind === 'config' ? plugin.plugin : undefined"
            :refusal="refusal"
            @validity="(valid, local) => validity(plugin.plugin, valid, local)" @update:model-value="setConfig(plugin.plugin, $event)" />
          <p v-else-if="!status || status.kind === 'pending'" class="muted small">
            {{ chosen ? 'This plugin has no settings for this catalog.' : 'Turn the plugin on to use it in this catalog.' }}
          </p>

          <Disclosure class="small pim-ia-disclosure pim-error-code" label="Technical details">
            <dl class="pim-stack">
              <div><dt>Plugin ID</dt><dd><code>{{ plugin.plugin }}</code></dd></div>
              <div v-if="(plugin.interface_version ?? option.interface_version) != null">
                <dt>Interface version</dt><dd>{{ plugin.interface_version ?? option.interface_version }}</dd>
              </div>
              <div v-if="status?.error?.message"><dt>Error</dt><dd>{{ status.error.message }}</dd></div>
              <div v-if="status?.error?.code"><dt>Error code</dt><dd><code>{{ status.error.code }}</code></dd></div>
              <div v-if="status?.error?.projection"><dt>Background update</dt><dd><code>{{ status.error.projection }}</code></dd></div>
              <div v-if="status?.projection && (status.kind === 'paused' || status.kind === 'degraded' || status.kind === 'catchingUp')"><dt>Background update</dt><dd><code>{{ status.projection[0] }}</code><span v-if="status.projection[1].error"> · {{ status.projection[1].error }}</span></dd></div>
              <div v-if="plugin.installed"><dt>Configuration tool</dt><dd><code>PIMConfigurePlugin</code></dd></div>
              <div v-if="plugin.tools.length"><dt>Plugin tools</dt><dd><ul><li v-for="tool in plugin.tools" :key="tool"><code>{{ tool }}</code></li></ul></dd></div>
            </dl>
          </Disclosure>
        </div>
      </SettingsItem>
    </SettingsGroup>

    <NativeDialog :visible="!!referencePlugin" label="Plugin references" @close="referenceId = undefined">
      <section v-if="referenceRow && referencePlugin" class="pim-ia-dialog">
        <header class="pim-ia-dialog-head"><div><h2>Plugin references</h2><p>{{ referenceRow.title }}</p></div></header>
        <template v-if="references.length">
          <p>Replace or remove these references before deactivating the plugin. You can also restore the package to keep using them.</p>
          <div v-for="section in references" :key="section.label">
            <h3>{{ section.label }}</h3>
            <ul><li v-for="item in section.items" :key="item.id">{{ item.title }}</li></ul>
          </div>
        </template>
        <p v-else>Use the catalog review to see what deactivating this plugin would change.</p>
        <p v-if="referencePlugin.references?.scopes.length && !referencePlugin.references?.shell_bindings.length">Reviewing removal also includes these product filter sets.</p>
        <Disclosure class="small pim-error-code pim-ia-disclosure" label="Technical details">
          <p>Plugin <code>{{ referencePlugin.plugin }}</code></p>
          <div v-for="section in references" :key="section.label">
            <p>{{ section.label }}</p>
            <ul><li v-for="item in section.items" :key="item.id"><code>{{ item.id }}</code></li></ul>
          </div>
        </Disclosure>
        <div class="row pim-ia-dialog-actions">
          <Button v-if="canEdit && referencePlugin.references?.shell_bindings.length" label="Clear catalog app binding"
            severity="secondary" outlined :disabled="stale" @click="emit('clearShellBinding', referencePlugin.references.shell_bindings[0])" />
          <Button v-else-if="canEdit" label="Review removal" :disabled="stale" @click="reviewRemoval(referencePlugin)" />
          <Button label="Close" severity="secondary" outlined @click="referenceId = undefined" />
        </div>
      </section>
    </NativeDialog>

    <SettingsGroup v-if="options.scopes.length" title="Product filters" :count="options.scopes.length">
      <SettingsItem v-for="s in options.scopes" :key="s.id" :title="humanLabel(s.title, 'Filter set')" description="Adds ways to filter products in this catalog."
        expand-label="Details" :open="!!expanded['scope:' + s.id]" @update:open="setOpen('scope:' + s.id, $event)">
        <template #status><Tag class="kx-tag-sm pim-plugin-state" :severity="adopted(s) ? 'success' : 'secondary'" :value="adopted(s) ? 'In use' : 'Available'" /></template>
        <template v-if="canEdit" #actions>
          <ToggleSwitch :aria-label="'Use ' + humanLabel(s.title, 'Filter set')" :model-value="adopted(s)" @update:model-value="adopt(s, $event)" />
        </template>
        <div class="row wrap muted small">
          <span>Filters</span>
          <Tag v-for="(f, name) in s.filters" :key="name" class="kx-tag-sm small" severity="secondary" :value="filterLabel(name, f.ops)" />
          <span>{{ humanize(s.access) }} access required</span>
        </div>
        <Disclosure class="small pim-ia-disclosure" label="Technical details">
          <p>Filter set ID <code>{{ s.id }}</code>. Product filter sets are <code>scopes</code> in <code>PIMQuery</code>; use the ID in <code>scopes[].id</code>.</p>
        </Disclosure>
      </SettingsItem>
    </SettingsGroup>
  </div>
</template>
