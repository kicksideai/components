<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import Message from 'primevue/message'
import LayoutEditor from '../LayoutEditor.vue'
import HistoryPanel from '../HistoryPanel.vue'
import SettingsActions from './SettingsActions.vue'
import PageHead from '../../shared/PageHead.vue'
import { clone } from '../../state'
// Schema edits are reviewed and applied together; vocabulary terms save immediately.
import { computed, onUnmounted, ref, watch } from 'vue'
import { on } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { pim } from '../../api'
import type { Declaration, PluginConfigs, RemoveDecl, SchemaOptions, SchemaPlan, SchemaView } from '../../types'
import BuilderFields from './BuilderFields.vue'
import BuilderDimensions from './BuilderDimensions.vue'
import BuilderVocabularies from './BuilderVocabularies.vue'
import BuilderFamilies from './BuilderFamilies.vue'
import BuilderChannels from './BuilderChannels.vue'
import BuilderPlugins from './BuilderPlugins.vue'
import BuilderPolicy from './BuilderPolicy.vue'
import BuilderDeclaration from './BuilderDeclaration.vue'
import { requestGeneration } from '../../shared/requests'
import { reconcileRemovals, reviewedRequest } from '../../state'

const props = defineProps<{ catalogId: string; embedded?: boolean; title?: string; backLabel?: string }>()
const emit = defineEmits<{ applied: [generation: number]; back: []; 'dirty-changed': [dirty: boolean] }>()

type Section = 'layout' | 'history' | 'fields' | 'dimensions' | 'vocabularies' | 'families' | 'channels' | 'plugins' | 'policy' | 'declaration'
const SECTIONS: { id: Section; title: string }[] = [
  { id: 'fields', title: 'Fields' },
  { id: 'layout', title: 'Form layout' },
  { id: 'dimensions', title: 'Dimensions' },
  { id: 'vocabularies', title: 'Vocabularies' },
  { id: 'families', title: 'Families' },
  { id: 'channels', title: 'Channels & sources' },
  { id: 'plugins', title: 'Plugins & scopes' },
  { id: 'policy', title: 'Policy' },
  { id: 'declaration', title: 'Declaration' },
  { id: 'history', title: 'History' },
]
const section = ref<Section>('fields')

const schema = ref<SchemaView | null>(null)
const options = ref<SchemaOptions | null>(null)
const draft = ref<Declaration>({})
const removed = ref<RemoveDecl>({})
const pluginConfigs = ref<PluginConfigs>({})
const initialConfigs = computed(() => Object.fromEntries(Object.entries(pluginConfigs.value).filter(([id]) => draft.value.plugins?.some(p => p.use === id) && !schema.value?.plugins.some(p => p.plugin === id && p.active))))
const error = ref('')
const busy = ref(false)
const saved = ref('')
const plan = ref<SchemaPlan | null>(null)
const reviewed = ref<ReturnType<typeof reviewedRequest> | null>(null)
const valid = ref(true)
const reviews = requestGeneration()
const canApply = computed(() => valid.value && !!plan.value && plan.value.class !== 'refused' && !!reviewed.value?.matches(request.value, schema.value?.schema_generation ?? -1, initialConfigs.value))


const loads = requestGeneration()
const loading = ref(false)
let editRevision = 0
watch([draft, removed, pluginConfigs], () => { editRevision++; plan.value = null }, { deep: true, flush: 'sync' })
async function load(replaceDraft = false, preserveActiveConfigs = false) {
  if (dirty.value && !replaceDraft) return
  const generation = loads.begin(), revision = editRevision, id = props.catalogId
  const retainedConfigs = preserveActiveConfigs ? Object.entries(pluginConfigs.value).filter(([plugin]) => schema.value?.plugins.some(p => p.plugin === plugin && p.active)) : []
  loading.value = true
  error.value = ''
  try {
    const [view, opts] = await Promise.all([pim.schema(id), pim.schemaOptions(id)])
    if (!loads.current(generation) || revision !== editRevision || id !== props.catalogId) return
    schema.value = view
    options.value = opts
    draft.value = clone(view.declaration)
    removed.value = {}
    pluginConfigs.value = Object.fromEntries(retainedConfigs.filter(([plugin]) => view.plugins.some(p => p.plugin === plugin && p.active)))
    plan.value = null
    valid.value = true
  } catch (e) {
    if (loads.current(generation)) error.value = e instanceof Error ? e.message : 'Could not load the schema.'
  } finally {
    if (loads.current(generation)) loading.value = false
  }
}
let unsubscribe = () => {}
watch(() => props.catalogId, id => {
  unsubscribe()
  unsubscribe = on(`component.${id}`, () => { if (!dirty.value) void load() })
}, { immediate: true })
useHostVisibilityRefresh(async () => { if (!dirty.value) await load() })
onUnmounted(() => { unsubscribe(); reviews.begin(); loads.begin() })
watch(() => props.catalogId, () => { reviews.begin(); busy.value = false; schema.value = null; options.value = null; discard(); void load() })

const removals = computed(() => Object.values(reconcileRemovals(draft.value, removed.value)).reduce((n, list) => n + (list?.length ?? 0), 0))
const dirty = computed(() => !!schema.value && (JSON.stringify(draft.value) !== JSON.stringify(schema.value.declaration) || removals.value > 0 || Object.keys(pluginConfigs.value).length > 0))
watch(dirty, value => emit('dirty-changed', value), { immediate: true })
const empty = computed(() => ![draft.value.aspects, draft.value.dimensions, draft.value.vocabularies, draft.value.families, draft.value.channels, draft.value.sources, draft.value.plugins, draft.value.scopes].some(entries => entries?.length))

// request is what Apply sends: the draft plus the removals the sections recorded.
const request = computed<Declaration>(() => {
  const out = clone(draft.value)
  const reconciled = reconcileRemovals(out, removed.value)
  if (Object.keys(reconciled).length) out.remove = reconciled
  return out
})

watch(dirty, (d) => { if (!d) plan.value = null })
watch([request, initialConfigs], () => { plan.value = null }, { deep: true })

async function review() {
  if (!schema.value || !valid.value) return
  const generation = reviews.begin()
  const snapshot = reviewedRequest(request.value, schema.value.schema_generation, initialConfigs.value)
  busy.value = true
  error.value = ''
  try {
    const response = await pim.planSchema(props.catalogId, snapshot.declaration, snapshot.generation, snapshot.pluginConfigs)
    if (!reviews.current(generation) || !snapshot.matches(request.value, schema.value.schema_generation, initialConfigs.value) || !valid.value) return
    reviewed.value = snapshot
    plan.value = response
  } catch (e) {
    if (!reviews.current(generation)) return
    error.value = e instanceof Error ? e.message : 'Could not review the change.'
    plan.value = null
    reviewed.value = null
  } finally {
    if (reviews.current(generation)) busy.value = false
  }
}

async function apply() {
  if (!schema.value || !dirty.value || !canApply.value || !reviewed.value) return
  const id = props.catalogId, generation = reviews.begin()
  busy.value = true
  error.value = ''
  saved.value = ''
  try {
    const out = await pim.applySchema(id, reviewed.value.declaration, reviewed.value.generation, reviewed.value.pluginConfigs)
    if (id !== props.catalogId || !reviews.current(generation)) return
    await load(true, true)
    if (id !== props.catalogId || !reviews.current(generation)) return
    saved.value = `Applied as generation ${out.generation} (${out.class})`
    emit('applied', out.generation)
  } catch (e) {
    if (id !== props.catalogId || !reviews.current(generation)) return
    error.value = e instanceof Error ? e.message : 'Could not apply the change.'
  } finally {
    if (reviews.current(generation)) busy.value = false
  }
}

async function configure(plugin: string, config: Record<string, unknown>) {
  const id = props.catalogId, generation = loads.begin(), action = reviews.begin()
  busy.value = true
  error.value = ''
  try {
    const snapshot = JSON.stringify(config)
    await pim.configurePlugin(id, plugin, clone(config))
    if (id !== props.catalogId || !loads.current(generation)) return
    const updated = await pim.schema(id)
    if (id !== props.catalogId || !loads.current(generation)) return
    if (schema.value) schema.value.plugins = updated.plugins
    if (JSON.stringify(pluginConfigs.value[plugin]) === snapshot) delete pluginConfigs.value[plugin]
    saved.value = 'Configuration saved'
  } catch (e) { if (id === props.catalogId && reviews.current(action)) error.value = e instanceof Error ? e.message : 'Could not save configuration.' }
  finally { if (reviews.current(action)) busy.value = false }
}

function discard() {
  pluginConfigs.value = {}
  valid.value = true
  if (schema.value) draft.value = clone(schema.value.declaration)
  removed.value = {}
  plan.value = null
  saved.value = ''
}

// Records a pending removal; the section removes the entry from its draft.
function remove(kind: keyof RemoveDecl, id: string) {
  const list = removed.value[kind] ?? []
  if (!list.includes(id)) removed.value = { ...removed.value, [kind]: [...list, id] }
}

</script>
<template>
  <div class="pim-builder" :class="{ embedded }">
    <div v-if="embedded" class="pim-detail-head">
      <h2>{{ title || 'Catalog' }}</h2><Tag severity="secondary" :value="'Generation ' + (schema?.schema_generation ?? '…')" />
      <div class="pim-detail-actions"><slot name="actions" :access="schema?.access" />
      <SettingsActions :access="schema?.access"
        :apply-label="section === 'layout' ? 'Apply layout' : 'Apply'" :dirty="dirty" :busy="busy" :valid="valid" :reviewed="!!plan" :can-apply="canApply"
        @discard="discard" @review="review" @apply="apply" /></div>
    </div>
    <PageHead v-else :title="title || 'Catalog'" :subtitle="'Settings · generation ' + (schema?.schema_generation ?? '…')" icon="tabler:settings" :back-label="backLabel" @back="emit('back')"><slot name="actions" :access="schema?.access" />
      <SettingsActions :access="schema?.access"
        :apply-label="section === 'layout' ? 'Apply layout' : 'Apply'" :dirty="dirty" :busy="busy" :valid="valid" :reviewed="!!plan" :can-apply="canApply"
        @discard="discard" @review="review" @apply="apply" /></PageHead>
    <Tabs v-model:value="section" class="pim-section-tabs">
      <TabList aria-label="Schema sections"><Tab v-for="s in SECTIONS" :key="s.id" :value="s.id">{{ s.title }}</Tab></TabList>
    </Tabs>
    <div class="pim-settings-pane"><div class="pim-builder-main pim-readable">
      <Message v-if="error" severity="error" role="alert">{{ error }}</Message>
      <Message v-if="saved" severity="success">{{ saved }}</Message>
      <div v-if="loading && (!schema || !options)" class="kx-loading" role="status">Loading…</div>
      <Button v-else-if="(!schema || !options) && error" @click="load()" severity="secondary" outlined>Retry</Button>
      <HistoryPanel v-else-if="schema && options && section === 'history'" :catalog-id="catalogId" />
      <fieldset v-else-if="schema && options" class="pim-editor-surface" :disabled="busy || !schema.access.admin" :inert="busy || !schema.access.admin">
        <Message v-if="empty && section === 'fields'" severity="info">Define its schema. Add a field group to start defining fields.</Message>
        <BuilderFields v-if="section === 'fields'" :draft="draft" :schema="schema" :options="options" @remove="remove" />
        <LayoutEditor v-else-if="section === 'layout'" :draft="draft" :schema="schema" :types="options.types" />
        <BuilderDimensions v-else-if="section === 'dimensions'" :draft="draft" :schema="schema" @remove="remove" />
        <BuilderVocabularies v-else-if="section === 'vocabularies'" :catalog-id="catalogId" :draft="draft" :schema="schema" @remove="remove" />
        <BuilderFamilies v-else-if="section === 'families'" :draft="draft" :schema="schema" @remove="remove" />
        <BuilderChannels :catalog-id="catalogId" v-else-if="section === 'channels'" :draft="draft" :schema="schema" @remove="remove" />
        <BuilderPlugins v-else-if="section === 'plugins'" :draft="draft" :schema="schema" :options="options" :plugin-configs="pluginConfigs" @configure="configure" @remove="remove" />
        <BuilderPolicy :catalog-id="catalogId" v-else-if="section === 'policy'" :draft="draft" />
        <BuilderDeclaration v-else-if="section === 'declaration'" :draft="draft" @replace="draft = $event" @validity="valid = $event; plan = null" />
      </fieldset>
      <div v-if="plan" class="pim-table pim-plan">
        <div class="pim-group-head"><Icon icon="tabler:checklist" /><h3>Review</h3><Tag class="kx-tag-sm" :severity="plan.class === 'refused' ? 'danger' : plan.class === 'semantic' ? 'warn' : 'info'">{{ plan.class }}</Tag></div>
        <div class="pim-card-body pad">
          <p v-if="plan.class === 'unchanged'" class="muted">Nothing would change.</p>
          <p v-else-if="plan.class === 'cosmetic'" class="muted small">Labels, order, widths or choices only; no product is touched.</p>
          <p v-else-if="plan.class === 'additive'" class="muted small">New fields or options; existing values stay as they are.</p>
          <p v-else-if="plan.class === 'semantic'" class="muted small">Resolved values or readiness change; the catalog rebuilds its rows after apply.</p>
          <Message v-else severity="error">Refused: the draft cannot be compiled as it stands.<span v-if="plan.migration"> {{ plan.migration }}</span></Message>
          <ul v-if="plan.changes.length || plan.refused.length" class="pim-plan-list">
            <li v-for="(c, i) in [...plan.refused, ...plan.changes]" :key="i"><Tag class="kx-tag-sm small" :severity="c.class === 'refused' ? 'danger' : c.class === 'semantic' ? 'warn' : 'info'">{{ c.class }}</Tag><span class="mono">{{ c.code }}</span><span class="muted">{{ c.what }}</span></li>
          </ul>
        </div>
      </div>
    </div></div>
  </div>
</template>
