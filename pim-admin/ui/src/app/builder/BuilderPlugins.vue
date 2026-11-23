<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Message from 'primevue/message'
import ToggleSwitch from 'primevue/toggleswitch'
import { computed, nextTick, ref, watch } from 'vue'
import DefinitionList from '../../shared/DefinitionList.vue'
import DefinitionRow from '../../shared/DefinitionRow.vue'
import NativeDialog from '../../shared/NativeDialog.vue'
import { humanLabel } from '../../shared/labels'
import type { PluginConfigRefusal } from '../../shared/transport'
import { humanize } from '../../forms'
import type { Declaration, PluginView, RemoveDecl, SchemaOptions, SchemaView, ScopeOption } from '../../types'
import { installedInterfaceProblem, pluginStatus } from './plugin-state'
import ConfigForm from './ConfigForm.vue'

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
const inventoryHelp = {
  hold_seconds: 'Default and maximum time stock stays set aside after a reservation starts. Leave empty to use the deployment default.',
}
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
const installedCount = computed(() => props.options.plugins.filter(plugin => plugin.installed).length)
const enabledCount = computed(() => props.schema.plugins.filter(plugin => plugin.active).length)
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
    label: refusal || invalidDrafts.value.has(plugin.plugin) ? 'Configuration needed' : !plugin.active && status?.kind === 'failed' ? 'Unavailable' : status?.label ?? (chosen
      ? plugin.active ? 'Enabled' : 'Will enable on apply'
      : plugin.active ? 'Will disable on apply' : 'Disabled'),
    severity: refusal || invalidDrafts.value.has(plugin.plugin) ? 'warn' as const : status?.severity ?? (chosen ? 'success' : 'secondary'),
  }
}))

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
  <div class="pim-stack">
    <DefinitionList :count="rows.length" :columns="['details']">
      <template #head><header class="pim-bsection-head"><h3>{{ installedCount }} installed · {{ enabledCount }} enabled here</h3></header></template>
      <div v-if="rows.length === 0" class="pim-aspect muted">No plugin is installed.</div>
      <DefinitionRow route-section="plugins" :route-id="plugin.plugin" v-for="{ option, plugin, status, chosen, title, label, severity, refusal } in rows" :key="plugin.plugin"
        :title="title" :keep-mounted="invalidDrafts.has(plugin.plugin)" :open="expanded[plugin.plugin] ?? (chosen && (!plugin.active || !!pluginConfigs[plugin.plugin]) || !!(plugin.active && status && status.kind !== 'pending'))"
        @update:open="expanded[plugin.plugin] = $event">
        <template #details>
          <Tag :severity="severity" :value="label" />
          <span v-if="!status && option.description" class="muted small">{{ humanLabel(option.description, 'Adds capabilities to this catalog.') }}</span>
        </template>
        <template v-if="canEdit && plugin.installed && (!status || status.kind === 'pending')" #actions>
          <ToggleSwitch :aria-label="'Enable ' + title" :model-value="chosen" @update:model-value="choose(plugin.plugin, $event)" />
        </template>

        <div class="pim-stack pim-plugin-recovery">
          <p v-if="contributedFields.get(plugin.plugin)?.length" class="muted small">
            Adds fields for {{ contributedFields.get(plugin.plugin)?.join(', ') }}.
          </p>
          <p v-if="plugin.active && status?.kind === 'failed' && status.projection?.[1].parked" class="muted small">
            Background update: Paused
          </p>
          <template v-if="status?.kind === 'failed'">
            <Message severity="warn" role="alert">
              <template v-if="installedInterfaceProblem(plugin)">This package uses a plugin interface this deployment cannot run. Restore a compatible package to use this plugin.</template>
              <template v-else>The catalog could not set up this plugin. Check the status after resolving the setup problem.</template>
            </Message>
            <Disclosure class="small pim-error-code pim-ia-disclosure" label="Technical details">
              <p>Plugin <code>{{ plugin.plugin }}</code></p>
              <p v-if="status.error?.message">{{ status.error.message }}</p>
              <p v-if="status.error?.code"><code>{{ status.error.code }}</code></p>
            </Disclosure>
            <Button v-if="canEdit && plugin.references" label="Review references" severity="secondary" outlined size="small" @click="referenceId = plugin.plugin" />
            <Button v-else label="Check status" severity="secondary" outlined size="small" @click="emit('refresh')" />
          </template>

          <template v-else-if="status?.kind === 'reset'">
            <Message severity="warn">
              The event history this background update needs was removed.
              <p v-if="status.error?.max_pruned_seq !== undefined">Earliest retained position {{ status.error.max_pruned_seq + 1 }}.</p>
            </Message>
            <Disclosure class="small pim-error-code pim-ia-disclosure" label="Technical details">
              <p>Plugin <code>{{ plugin.plugin }}</code></p>
              <p v-if="status.error?.projection">Background update <code>{{ status.error.projection }}</code></p>
            </Disclosure>
            <Button v-if="canEdit" label="Reset background updates" severity="secondary" outlined size="small" :disabled="stale" @click="emit('reset', plugin.plugin)" />
          </template>

          <template v-else-if="status?.projection && (status.kind === 'paused' || status.kind === 'degraded' || status.kind === 'catchingUp')">
            <Message :severity="status.kind === 'catchingUp' ? 'info' : 'warn'">
              <p v-if="status.projection[1].status === 'paused'">This update was paused.</p>
              <p v-else-if="status.kind === 'paused'">The background worker stopped.</p>
              <p v-else-if="status.kind === 'degraded'">The background worker reported an error.</p>
              <p v-else>This update is processing catalog changes.</p>
              <p>Last applied position {{ status.projection[1].last_seq }}.</p>
            </Message>
            <Disclosure class="small pim-error-code pim-ia-disclosure" label="Technical details">
              <p>Background update <code>{{ status.projection[0] }}</code></p>
              <p v-if="status.projection[1].error">{{ status.projection[1].error }}</p>
            </Disclosure>
            <Button v-if="canEdit && status.projection[1].status === 'paused' && status.projection[1].cursor_id"
              label="Resume background update" severity="secondary" outlined size="small" :disabled="stale" @click="emit('resume', status.projection[1].cursor_id)" />
            <Button v-else-if="status.kind === 'paused' && canEdit" label="Reset background updates" severity="secondary" outlined size="small" :disabled="stale" @click="emit('reset', plugin.plugin)" />
            <Button v-else label="Check status" severity="secondary" outlined size="small" @click="emit('refresh')" />
          </template>

          <template v-else-if="status?.kind === 'uninstalled'">
            <Message severity="warn">The package was removed while it was still enabled for this catalog.</Message>
            <Button label="Review references" severity="secondary" outlined size="small" @click="referenceId = plugin.plugin" />
          </template>

          <Disclosure v-if="plugin.installed && (!status || status.kind === 'pending')" class="small pim-ia-disclosure" label="Technical details">
            <dl class="pim-stack">
              <div><dt>Plugin ID</dt><dd><code>{{ plugin.plugin }}</code></dd></div>
              <div v-if="(plugin.interface_version ?? option.interface_version) != null">
                <dt>Interface version</dt><dd>{{ plugin.interface_version ?? option.interface_version }}</dd>
              </div>
              <div><dt>Configuration tool</dt><dd><code>PIMConfigurePlugin</code></dd></div>
              <div v-if="plugin.tools.length"><dt>Plugin tools</dt><dd><ul><li v-for="tool in plugin.tools" :key="tool"><code>{{ tool }}</code></li></ul></dd></div>
            </dl>
          </Disclosure>
          <template v-if="chosen && plugin.installed && status?.kind !== 'failed' && status?.kind !== 'uninstalled'">
            <template v-if="canEdit && option.config_schema.properties && Object.keys(option.config_schema.properties).length">
              <p class="muted small">Choose Review changes, then Apply changes to save this configuration.</p>
            </template>
            <ConfigForm :ref="form => { if (form) forms.set(plugin.plugin, form as InstanceType<typeof ConfigForm>); else forms.delete(plugin.plugin) }"
              :disabled="!canEdit" :schema="option.config_schema" :model-value="pluginConfigs[plugin.plugin] ?? plugin.config ?? {}"
              :problem="status?.kind === 'config' && !Object.hasOwn(pluginConfigs, plugin.plugin) ? status.error : undefined"
              :plugin-id="status?.kind === 'config' ? plugin.plugin : undefined"
              :refusal="refusal" :field-help="plugin.plugin === 'kickside.pim.inventory:plugin' ? inventoryHelp : undefined"
              @validity="(valid, local) => validity(plugin.plugin, valid, local)" @update:model-value="setConfig(plugin.plugin, $event)" />
          </template>
        </div>
      </DefinitionRow>
    </DefinitionList>

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

    <DefinitionList :count="options.scopes.length" :columns="['details']">
      <template #head>
        <header class="pim-bsection-head"><h3>Product filter sets</h3><span class="muted small">Choose additional ways to filter products.</span></header>
        <Disclosure class="small pim-ia-disclosure" label="Filter set technical details">
          <p>Product filter sets are <code>scopes</code> in <code>PIMQuery</code>. Use the filter set ID in <code>scopes[].id</code>.</p>
        </Disclosure>
      </template>
      <div v-if="options.scopes.length === 0" class="pim-aspect muted">No product filter sets are available.</div>
      <DefinitionRow route-section="plugins" :route-id="'scope:' + s.id" v-for="s in options.scopes" :key="s.id" :title="humanLabel(s.title, 'Filter set')">
        <template #details><Tag :severity="adopted(s) ? 'success' : 'secondary'" :value="adopted(s) ? 'Selected' : 'Available'" /></template>
        <template v-if="canEdit" #actions>
          <ToggleSwitch :aria-label="'Use ' + humanLabel(s.title, 'Filter set')" :model-value="adopted(s)" @update:model-value="adopt(s, $event)" />
        </template>
        <div class="row wrap muted small">
          <span>Filters</span>
          <Tag v-for="(f, name) in s.filters" :key="name" class="kx-tag-sm small" severity="secondary" :value="filterLabel(name, f.ops)" />
          <span>{{ humanize(s.access) }} access required</span>
        </div>
        <Disclosure class="small pim-ia-disclosure" label="Technical details">
          <p>Filter set ID <code>{{ s.id }}</code></p>
        </Disclosure>
      </DefinitionRow>
    </DefinitionList>
  </div>
</template>
