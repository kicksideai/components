<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { formatApiError } from '../transport'
import { Icon } from '@iconify/vue'
import SelectButton from 'primevue/selectbutton'
import ToggleSwitch from 'primevue/toggleswitch'
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { configFields, eventDetail, type FormValidity } from './settings/config'
import { useTag } from './mount'
import type { PluginConfigs } from './settings/model'
import NativeDialog from '../NativeDialog.vue'
import { work } from '../api'
import { availablePack, packChoice } from '../packs'
import { usePackDiscovery } from './usePackDiscovery'
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: []; created: [boardId: string] }>()
const title = ref(''), description = ref(''), prefix = ref('WORK'), selected = ref(''), starter = ref(false)
const step = ref(1), busy = ref(false), error = ref('')
const { packs, loading, error: discoveryError, load: loadPacks, reset: resetPacks } = usePackDiscovery()
const created = ref(''), configs = ref<PluginConfigs>({}), invalid = ref(new Set<string>())
const emptyConfig: Record<string, unknown> = {}
const requiredConfigs = computed(() => {
  const pack = packs.value.find(p => p.id === selected.value)
  if (!pack || !availablePack(pack)) return []
  return pack.plugins.flatMap(plugin => plugin.config_schema && configFields(plugin.config_schema).length
    ? [{ id: plugin.plugin, title: plugin.title || 'Required plugin', schema: plugin.config_schema }]
    : [])
})
const schemaForm = useTag('wc-schema-form')
const pendingConfigs = ref(new Set<string>())
watch(requiredConfigs, plugins => {
  pendingConfigs.value = new Set(plugins.map(plugin => plugin.id))
  if (plugins.length) void schemaForm.load()
}, { immediate: true })
watch(selected, () => { configs.value = {}; invalid.value.clear() })
function validity(id: string, detail: FormValidity) {
  pendingConfigs.value.delete(id)
  if (detail.valid) invalid.value.delete(id); else invalid.value.add(id)
}
let key = crypto.randomUUID(), attempted = ''
const choices = computed(() => [{ id: '', title: 'Empty board', description: 'Set up the fields and process in Board settings.', icon: 'tabler:square', version: '', disabled: false }, ...packs.value.map(packChoice)])
const chosen = computed(() => choices.value.find(pack => pack.id === selected.value))
const valid = computed(() => !!title.value.trim() && /^[A-Z][A-Z0-9]{1,9}$/.test(prefix.value) && !!chosen.value && !chosen.value.disabled && !invalid.value.size && (step.value === 1 || !pendingConfigs.value.size))
watch(() => props.visible, visible => {
  resetPacks()
  if (!visible) return
  created.value = ''; configs.value = {}; invalid.value.clear(); step.value = 1; error.value = ''; title.value = ''; description.value = ''; prefix.value = 'WORK'; selected.value = ''; starter.value = false; key = crypto.randomUUID(); attempted = ''
  void loadPacks()
}, { immediate: true })
async function create() {
  if (!valid.value || busy.value) return
  if (step.value === 1) { step.value = 2; return }
  busy.value = true; error.value = ''
  const selection = selected.value ? { pack: selected.value, version: chosen.value?.version, starter: starter.value, ...(Object.keys(configs.value).length ? { plugin_configs: configs.value } : {}) } : {}
  const declaration = { key_prefix: prefix.value }
  const request = JSON.stringify([title.value.trim(), description.value, declaration, selection])
  if (attempted && attempted !== request) key = crypto.randomUUID()
  attempted = request
  try {
    if (!created.value) { const result = await work.createBoard(title.value.trim(), declaration, key, selection); created.value = result.board_id }
    if (description.value) await work.updateBoard(created.value, { description: description.value })
    emit('created', created.value); emit('close')
  }
  catch (e) { error.value = (created.value ? 'Board created. Description was not saved. ' : '') + formatApiError(e, 'Could not save the board.') }
  finally { busy.value = false }
}
</script>
<template>
  <NativeDialog :visible="visible" label="New board" :busy="busy" @close="emit('close')"
    ><form class="work-dialog-box" @submit.prevent="create">
      <header class="work-stack work-tight">
        <span class="work-muted work-small">Step {{ step }} of 2</span>
        <h2>{{ step === 1 ? 'Name your board' : 'Choose a pack' }}</h2>
        <p class="work-muted work-small">
          {{
            step === 1
              ? 'Give this work a home and a recognizable item key.'
              : 'Packs give your board a starting process and settings you can edit later.'
          }}
        </p>
      </header>
      <template v-if="step === 1"
        ><label class="work-stack work-tight"
          >Title<InputText
            id="board-title"
            v-model="title"
            autofocus
            required
            :disabled="busy || !!created"
            placeholder="Team delivery" /></label
        ><label class="work-stack work-tight"
          >Description<Textarea
            id="board-description"
            v-model="description"
            rows="3"
            :disabled="busy || !!created"
            placeholder="What does this board help the team deliver?" /></label
        ><label class="work-stack work-tight"
          >Item key prefix<InputText
            id="board-prefix"
            v-model="prefix"
            required
            pattern="[A-Z][A-Z0-9]{1,9}"
            maxlength="10"
            :disabled="busy || !!created"
        /></label>
        <p class="work-muted work-small">
          Keys look like {{ prefix || 'WORK' }}-1. The prefix must be unique in this installation.
        </p></template
      >
      <template v-else
        ><p v-if="loading" class="work-muted" role="status">Loading packs…</p>
        <div v-if="discoveryError" class="kx-err work-alert-actions">
          <p role="alert">{{ discoveryError }}</p>
          <Button label="Reload packs" severity="secondary" outlined @click="loadPacks()" />
        </div>
        <SelectButton
          v-model="selected"
          class="work-pack-choices"
          :options="choices"
          optionLabel="title"
          optionValue="id"
          optionDisabled="disabled"
          :allowEmpty="false"
          :disabled="busy || !!created"
          aria-label="Board pack"
          ><template #option="{ option }"
            ><span class="work-pack-choice"
              ><span class="work-row"
                ><Icon :icon="option.icon" aria-hidden="true" /><strong>{{ option.title }}</strong
                ><span v-if="option.version" class="work-muted work-small">{{ option.version }}</span></span
              ><span class="work-muted work-small">{{ option.description }}</span
              ><span v-if="option.disabled" class="work-pack-unavailable"
                >{{ option.unavailable }}</span
              ></span
            ></template
          ></SelectButton
        ><label v-if="selected" class="work-row work-small"
          ><ToggleSwitch v-model="starter" :disabled="busy || !!created" aria-label="Include starter items" />Include
          starter items</label
        >
        <fieldset v-if="requiredConfigs.length" :disabled="busy || !!created" class="work-settings-fieldset work-stack">
          <section v-for="plugin in requiredConfigs" :key="selected + ':' + plugin.id" class="work-settings-card work-stack work-tight">
            <h3>{{ plugin.title }}</h3>
            <wc-schema-form v-if="schemaForm.state.value === 'ready'" class="work-config-widget" :disabled="busy || !!created || undefined" :schema="JSON.stringify(plugin.schema)"
              :config="JSON.stringify(configs[plugin.id] ?? emptyConfig)" :choices="JSON.stringify({ board_item_types: [] })"
              @config-changed="configs[plugin.id] = eventDetail($event)" @validity-changed="validity(plugin.id, eventDetail($event))" />
            <p v-else-if="schemaForm.state.value === 'failed'" role="alert" class="kx-err">The configuration form is unavailable.
              <Button label="Reload configuration form" severity="secondary" outlined size="small" @click="schemaForm.load()" /></p>
            <p v-else role="status" class="work-muted work-small">The configuration form is loading.</p>
          </section>
        </fieldset>
        <div class="work-settings-card work-stack work-tight">
          <strong>{{ title }}</strong>
          <p v-if="description" class="work-muted work-small">{{ description }}</p>
          <span class="work-mono work-muted">{{ prefix }}-1</span>
          <p class="work-muted work-small">{{ chosen?.title }}</p>
        </div></template
      >
      <p v-if="error" class="kx-err" role="alert">{{ error }}</p>
      <footer class="work-dialog-actions">
        <Button
          :label="step === 1 ? 'Cancel' : 'Back'"
          severity="secondary"
          :disabled="busy || !!created"
          @click="step === 1 ? emit('close') : (step = 1)"
          outlined
        /><Button
          type="submit"
          :label="step === 1 ? 'Continue' : created ? 'Save description' : 'Create board'"
          :loading="busy"
          :disabled="!valid || busy"
        />
      </footer></form
  ></NativeDialog>
</template>
