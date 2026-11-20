<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { formatApiError } from '../../transport'
import { Icon } from '@iconify/vue'
import DefinitionRow from './DefinitionRow.vue'
import DefinitionList from './DefinitionList.vue'
import ToggleSwitch from 'primevue/toggleswitch'
import { ref } from 'vue'
import Button from 'primevue/button'
import type { Declaration, PluginOption, Schema } from '../../types'
import type { PluginConfigs } from './model'
import { clone } from './model'
import { projectionHealth } from './plugin-state'
import { settings } from './api'
import ConfigForm from './ConfigForm.vue'
const props = defineProps<{ boardId: string; draft: Declaration; schema: Schema; options: PluginOption[]; configs: PluginConfigs; disabled?: boolean; activationLocked?: boolean }>()
const emit = defineEmits<{ configured: []; refresh: []; validity: [key: string, valid: boolean] }>()
const edit = ref<PluginConfigs>({}), busy = ref(''), error = ref(''), saved = ref('')
const invalid = ref(new Set<string>())
const emptyConfig: Record<string, unknown> = {}
function state(id: string) { return props.schema.plugins?.find(p => p.plugin === id) }
function active(id: string) { return state(id)?.active === true }
function configured(id: string) { return state(id)?.lifecycle.state === 'ready' }
function selected(id: string) { return props.draft.plugins?.some(p => p.use === id) === true }
function toggle(id: string, enabled: boolean) {
  const plugins = props.draft.plugins ?? []
  if (enabled && !selected(id)) props.draft.plugins = [...plugins, { use: id }]
  if (!enabled) { props.draft.plugins = plugins.filter(p => p.use !== id); delete props.configs[id]; invalid.value.delete(id); emit('validity', id, true) }
}
function config(id: string): Record<string, unknown> {
  if (active(id)) return edit.value[id] ?? state(id)?.config ?? emptyConfig
  return props.configs[id] ?? emptyConfig
}
function update(id: string, value: Record<string, unknown>) { if (active(id)) edit.value[id] = value; else props.configs[id] = value }
function validity(id: string, valid: boolean) { if (valid) invalid.value.delete(id); else invalid.value.add(id); if (!active(id)) emit('validity', id, valid) }
async function save(id: string) {
  if (busy.value || invalid.value.has(id)) return
  busy.value = id; error.value = ''; saved.value = ''
  try { await settings.configure(props.boardId, id, config(id)); delete edit.value[id]; saved.value = 'Plugin configuration saved.'; emit('configured') }
  catch (e) { error.value = formatApiError(e, 'Could not configure plugin.') }
  finally { busy.value = '' }
}
</script>
<template>
  <section class="work-stack" aria-label="Plugins editor">
    <header class="work-section-heading"><div><h2>Plugins</h2><p class="work-muted work-small">Add capabilities from installed modules.</p></div><Button label="Refresh status" severity="secondary" outlined :disabled="!!busy || disabled" @click="emit('refresh')"><template #icon><Icon icon="tabler:refresh" aria-hidden="true" /></template></Button></header>
    <p class="work-muted work-small">Activation joins the schema draft and requires review. Active plugin configuration saves separately. Status reflects the last read; refresh to check progress.</p>
    <p v-if="!options.length" class="kx-loading">No installed plugins are visible to you.</p>
    <div v-if="error" class="kx-err" role="alert">{{ error }}</div><p v-if="saved" class="work-notice" role="status">{{ saved }}</p>
    <DefinitionList columns="plugins" :count="options.length">
      <DefinitionRow v-for="plugin in options" :key="plugin.plugin" :title="plugin.title || 'Unavailable capability'" :description="plugin.description" :kind="active(plugin.plugin) ? 'Active' : selected(plugin.plugin) ? 'Pending review' : 'Inactive'" class="work-stack">
        <template #actions><span class="work-spacer"></span><label class="work-row"><ToggleSwitch :model-value="selected(plugin.plugin)" :disabled="!!busy || disabled || activationLocked || !!plugin.problem" @update:model-value="toggle(plugin.plugin, $event)" />Activate on this board</label></template>
        <p v-if="plugin.requires.length" class="work-muted work-small">Requires {{ plugin.requires.map(id => options.find(p => p.plugin === id)?.title || 'Another capability').join(', ') }}</p>
        <p v-if="plugin.problem" class="kx-err">{{ plugin.problem.message }}</p>
        <p v-if="state(plugin.plugin)?.outdated" class="work-notice">The stored declaration differs from the installed plugin. Review activation to update it.</p>
        <div v-if="active(plugin.plugin)" class="work-stack work-tight work-plugin-status" role="status">
          <p>{{ configured(plugin.plugin) ? 'Attachment configured' : state(plugin.plugin)?.lifecycle.state === 'failed' ? 'Configuration failed' : 'Configuring attachment' }}</p>
          <p v-if="state(plugin.plugin)?.lifecycle.error" class="kx-err">{{ state(plugin.plugin)?.lifecycle.error?.message }}</p>
          <div v-for="(projection, kind) in state(plugin.plugin)?.projections" :key="kind"><p>{{ projectionHealth(projection, schema.as_of) }}</p><p class="work-muted work-small">Position {{ projection.last_seq }} · Board head {{ schema.as_of }}</p></div>
        </div>
        <template v-if="!plugin.problem && (selected(plugin.plugin) || active(plugin.plugin))">
          <ConfigForm :disabled="!!busy || disabled" :schema="plugin.config_schema" :model-value="config(plugin.plugin)" @update:model-value="update(plugin.plugin, $event)" @validity="validity(plugin.plugin, $event)" />
          <div class="work-form-actions"><Button label="Reset" severity="secondary" outlined :disabled="!!busy || disabled" @click="update(plugin.plugin, active(plugin.plugin) ? clone(state(plugin.plugin)?.config ?? {}) : {})"><template #icon><Icon icon="tabler:restore" /></template></Button><Button v-if="active(plugin.plugin)" label="Save configuration" :disabled="!!busy || disabled || invalid.has(plugin.plugin)" :loading="busy === plugin.plugin" @click="save(plugin.plugin)"><template #icon><Icon icon="tabler:device-floppy" aria-hidden="true" /></template></Button></div>
          <p v-if="!active(plugin.plugin)" class="work-muted work-small">Initial configuration is included in Review and Apply.</p>
        </template>
      </DefinitionRow>
    </DefinitionList>
    <article v-for="plugin in draft.plugins?.filter(p => !options.some(o => o.plugin === p.use)) ?? []" :key="plugin.use" class="work-settings-card"><p>Unavailable plugin</p><Button label="Deactivate plugin" severity="secondary" @click="toggle(plugin.use, false)" outlined><template #icon><Icon icon="tabler:trash" aria-hidden="true" /></template></Button></article>
  </section>
</template>
