<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import ToggleSwitch from 'primevue/toggleswitch'
import { computed, onUnmounted, ref, watch } from 'vue'
import Button from 'primevue/button'
import { host, on } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { ApiError } from '../../transport'
import { work } from '../../api'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import type { BoardRow, Declaration, AdminOptions, Schema } from '../../types'
import { useNavigate } from '../route'
import { settings } from './api'
import { validationIssues, removalReason, clone, normalizeSchema, processMigration, requestDeclaration, reviewSnapshot, type PluginConfigs, type SchemaPlan, type RemovalKind, removeEntry } from './model'
import FieldsEditor from './FieldsEditor.vue'
import TypesEditor from './TypesEditor.vue'
import ProcessEditor from './ProcessEditor.vue'
import ProcessMigration from './ProcessMigration.vue'
import PolicyEditor from './PolicyEditor.vue'
import RelationsEditor from './RelationsEditor.vue'
import PluginsEditor from './PluginsEditor.vue'
import VisibilityEditor from './VisibilityEditor.vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import SettingsHead from './SettingsHead.vue'
import SchemaReview from './SchemaReview.vue'
import PackReview from './PackReview.vue'
import { availablePack, planUpgrade, upgradeRequest, type AvailablePack, type PackPlan, type PackRequest } from '../../packs'
const props = defineProps<{ boardId: string; embedded?: boolean }>()
const emit = defineEmits<{ 'dirty-change': [dirty: boolean] }>()
const go = useNavigate()
let resetGeneration: number | undefined, resetDraft = ''
const draftSnapshot = () => JSON.stringify([request.value, configs.value, packRequest.value, [...invalid.value]])
const tabs = ['Fields', 'Item types', 'Process', 'Policy', 'Relation types', 'Plugins', 'Review'] as const
const tab = ref<typeof tabs[number]>('Fields'), advanced = ref(false)
const visited = ref(new Set<typeof tabs[number]>(['Fields']))
watch(tab, value => visited.value.add(value))
const schema = ref<Schema>(), latest = ref<Schema>(), board = ref<BoardRow>(), draft = ref<Declaration>({}), configs = ref<PluginConfigs>({})
const options = ref<AdminOptions>(), authorized = ref(false), loading = ref(true), busy = ref(false), error = ref(''), saved = ref('')
const packError = ref('')
const packs = ref<AvailablePack[]>([]), packRequest = ref<PackRequest>(), packPlan = ref<PackPlan>(), packReviewed = ref<PackRequest>()
const plan = ref<SchemaPlan>(), reviewed = ref<ReturnType<typeof reviewSnapshot>>(), applyKey = ref('')
const serverIssues = ref<import('./model').SchemaChange[]>([])
const issues = computed(() => [...serverIssues.value, ...(plan.value?.refused ?? [])])
const checkingRemoval = ref(false), editorVersion = ref(0)
const invalid = ref(new Set<string>()), editor = ref<HTMLFormElement>()
const beginRead = latestRequest(), beginReview = latestRequest()
const request = computed(() => requestDeclaration(draft.value, schema.value?.declaration ?? {}))
const dirty = computed(() => invalid.value.size > 0 || !!packRequest.value || !!schema.value && (JSON.stringify(request.value) !== JSON.stringify(schema.value.declaration) || Object.keys(configs.value).length > 0))
watch(dirty, value => emit('dirty-change', value), { immediate: true, flush: 'sync' })
const stale = computed(() => !!schema.value && !!latest.value && schema.value.generation !== latest.value.generation)
const canSchemaApply = computed(() => authorized.value && !busy.value && !checkingRemoval.value && !migrationPending.value && !stale.value && !invalid.value.size && plan.value && (plan.value.changes.length > 0 || Object.keys(configs.value).length > 0) && plan.value.class !== 'refused' && !plan.value.refused.length && reviewed.value?.matches(request.value, schema.value?.generation ?? -1, configs.value))
const packPlugins = computed(() => packs.value.find(pack => pack.id === packRequest.value?.pack)?.plugins.filter(plugin => !schema.value?.plugins?.some(state => state.plugin === plugin.id && state.active)).map(plugin => ({ use: plugin.id })) ?? [])
const packMatches = computed(() => !!packReviewed.value && JSON.stringify(packReviewed.value) === JSON.stringify(packRequest.value))
const canApply = computed(() => packRequest.value ? authorized.value && !busy.value && !stale.value && !migrationPending.value && packMatches.value && plan.value?.class !== 'refused' && !plan.value?.refused.length && packPlan.value?.conflicts.every(c => !!packRequest.value?.resolutions?.[c.path]) : canSchemaApply.value)
const isReviewed = computed(() => !!plan.value && (!packRequest.value || packMatches.value))
const packTitle = computed(() => packs.value.find(p => p.id === schema.value?.pack?.id)?.title || 'Installed pack')
const upgradeAvailable = computed(() => !packError.value && !!schema.value?.outdated && !!packs.value.find(p => p.id === schema.value?.pack?.id))
const upgradeReason = computed(() => packError.value ? 'Reload packs to check available upgrades.' : !upgradeAvailable.value ? 'Install an available version of this pack to upgrade.' : dirty.value ? 'Discard the current draft before upgrading.' : migrationPending.value ? 'Finish the current migration before upgrading.' : busy.value ? 'Wait for the current request to finish.' : undefined)
function clearPack() { packRequest.value = undefined; packPlan.value = undefined; packReviewed.value = undefined }
async function upgrade() {
  if (!schema.value?.pack || busy.value || dirty.value) return
  const installed = packs.value.find(p => p.id === schema.value!.pack!.id)
  if (!installed) return
  packRequest.value = upgradeRequest(installed, schema.value.generation); tab.value = 'Review'
  await reviewPack()
}
async function reviewPack() {
  if (!packRequest.value || busy.value || !authorized.value || stale.value) return
  const current = beginReview(), request = clone(packRequest.value), before = JSON.stringify(packRequest.value)
  busy.value = true; error.value = ''; saved.value = ''
  try {
    const reviewed = await planUpgrade(request, request => settings.packPlan(props.boardId, request))
    if (!current() || before !== JSON.stringify(packRequest.value)) return
    packPlan.value = reviewed.plan; plan.value = reviewed.plan; packRequest.value = reviewed.request
    packReviewed.value = clone(packRequest.value); applyKey.value = crypto.randomUUID(); tab.value = 'Review'
  } catch (e) { if (current()) { packReviewed.value = undefined; error.value = e instanceof Error ? e.message : 'Could not plan the pack upgrade.' } }
  finally { busy.value = false }
}
const follows = computed(() => plan.value ? processMigration(plan.value, request.value) : [])
const migrationPending = computed(() => !!latest.value?.migration_error || board.value?.status === 'migrating')
function invalidate() { serverIssues.value = []; beginReview(); plan.value = undefined; reviewed.value = undefined; packReviewed.value = undefined; applyKey.value = '' }
watch([request, configs], invalidate, { deep: true, flush: 'sync' })
watch(configs, value => { if (packRequest.value) { if (Object.keys(value).length) packRequest.value.plugin_configs = clone(value); else delete packRequest.value.plugin_configs } }, { deep: true, flush: 'sync' })
function validity(key: string, valid: boolean) { if (valid) invalid.value.delete(key); else invalid.value.add(key); invalidate() }
function reset(view: Schema) { clearPack(); editorVersion.value++; schema.value = view; draft.value = clone(view.declaration); configs.value = {}; invalid.value.clear(); invalidate() }
async function load(force = false) {
  const current = beginRead()
  try {
    const [view, ext, boards] = await Promise.all([work.schema(props.boardId, undefined, true).catch(e => {
      if (e instanceof ApiError && e.details?.code === 'board_schema_missing') return { generation: 0, declaration: {}, compiled: {}, key_prefix: '', as_of: 0 } as Schema
      throw e
    }), work.options(props.boardId), work.boards()])
    if (!current()) return
    authorized.value = ext.access.admin; options.value = ext; board.value = boards.find(b => b.board_id === props.boardId)
    if (!authorized.value) { schema.value = undefined; draft.value = {}; invalidate(); return }
    error.value = ''
    const normalized = normalizeSchema(view)
    latest.value = normalized
    if (resetGeneration !== undefined && normalized.generation >= resetGeneration) {
      resetGeneration = undefined
      if (resetDraft === draftSnapshot()) reset(normalized)
      resetDraft = ''
    }
    else if (force || !schema.value || !dirty.value) reset(normalized)
    if (stale.value) invalidate()
    if (view.pack) await loadPacks(current)
  } catch (e) {
    if (!current()) return
    if (e instanceof ApiError && (e.status === 403 || e.kind?.toLowerCase() === 'permission_denied')) authorized.value = false
    invalidate(); error.value = e instanceof Error ? e.message : 'Could not load board settings.'
  } finally { if (current()) loading.value = false }
}
async function loadPacks(current: () => boolean = () => true) {
  packError.value = ''
  try { const rows = await work.packs(); if (current()) packs.value = rows.filter(availablePack) }
  catch (e) { if (current()) packError.value = e instanceof Error ? e.message : 'Could not load packs.' }
}
function validForm() {
  for (const input of editor.value?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea') ?? []) {
    if (input.form !== editor.value || input.closest('[style*="display: none"]')) continue
    if (!input.reportValidity()) return false
  }
  return true
}
function selectTab(name: typeof tabs[number]) { tab.value = name; if (name === 'Review' && !plan.value) void review() }
async function review() {
  if (packRequest.value) return reviewPack()
  if (!schema.value || busy.value || !authorized.value || stale.value || invalid.value.size || !validForm()) return
  const current = beginReview(), snapshot = reviewSnapshot(request.value, schema.value.generation, configs.value)
  busy.value = true; error.value = ''; saved.value = ''
  try {
    const response = await settings.plan(props.boardId, snapshot)
    if (!current() || invalid.value.size || !snapshot.matches(request.value, schema.value.generation, configs.value)) return
    plan.value = response; reviewed.value = snapshot; applyKey.value = crypto.randomUUID(); tab.value = 'Review'
  } catch (e) { if (current()) { invalidate(); error.value = e instanceof Error ? e.message : 'Could not review changes.'; serverIssues.value = validationIssues(e, request.value) } }
  finally { busy.value = false }
}
async function apply() {
  if (!canApply.value) return
  if (packRequest.value && packReviewed.value) {
    busy.value = true; error.value = ''
    const appliedDraft = draftSnapshot()
    try { const result = await settings.packApply(props.boardId, clone(packReviewed.value), applyKey.value); resetGeneration = result.generation; resetDraft = appliedDraft; await load(); saved.value = result.status === 'done' ? `Pack upgraded at generation ${result.generation}.` : 'Pack installation continues in the background.' }
    catch (e) { error.value = e instanceof Error ? e.message : 'Could not apply the pack upgrade.' }
    finally { busy.value = false }
    return
  }
  if (!reviewed.value) return
  busy.value = true; error.value = ''; saved.value = ''
  const appliedDraft = draftSnapshot()
  try {
    const result = await settings.apply(props.boardId, reviewed.value, applyKey.value)
    resetGeneration = result.generation; resetDraft = appliedDraft
    await load()
    saved.value = `Applied generation ${result.generation} (${result.class}).`
  } catch (e) { error.value = e instanceof Error ? e.message : 'Could not apply schema.' }
  finally { busy.value = false }
}
async function resume() {
  if (busy.value) return
  busy.value = true; error.value = ''
  try { const result = await settings.resume(props.boardId); saved.value = result.resumed ? 'Migration resumes.' : 'Migration is already running.'; await load() }
  catch (e) { error.value = e instanceof Error ? e.message : 'Could not resume migration.' }
  finally { busy.value = false }
}
async function guardRemoval(kind: RemovalKind, id: string): Promise<string | undefined> {
  if (!schema.value || !authorized.value || busy.value || checkingRemoval.value) return 'Wait for the current change to finish.'
  if (stale.value) return 'Discard the stale draft before removing a definition.'
  const generation = schema.value.generation, before = JSON.stringify(request.value)
  const candidate = clone(draft.value)
  removeEntry(candidate, kind, id)
  checkingRemoval.value = true
  try {
    const response = await settings.plan(props.boardId, reviewSnapshot(requestDeclaration(candidate, schema.value.declaration), generation, configs.value))
    if (!authorized.value || stale.value || schema.value.generation !== generation || JSON.stringify(request.value) !== before) return 'The draft changes during the check. Try the removal again.'
    const refusal = removalReason(response, kind, id)
    if (refusal) return refusal
    if (response.class === 'refused') return 'Resolve the refused draft changes in Review before removing this definition.'
  } catch (e) { return e instanceof Error ? e.message : 'Could not check this removal.' }
  finally { checkingRemoval.value = false }
}
async function back() {
  if (dirty.value && !await host.confirm({ header: 'Discard changes?', message: 'Your unsaved board settings will be discarded.', acceptLabel: 'Discard', rejectLabel: 'Keep editing' })) return
  go({ name: 'board', board: props.boardId })
}
function discard() { resetGeneration = undefined; if (latest.value) reset(latest.value); saved.value = ''; error.value = '' }

watch(() => props.boardId, () => { resetGeneration = undefined; clearPack(); packs.value = []; schema.value = undefined; latest.value = undefined; board.value = undefined; configs.value = {}; invalid.value.clear(); visited.value = new Set(['Fields']); tab.value = 'Fields'; authorized.value = false; loading.value = true; void load(true) })
let stop = () => {}
watch(() => props.boardId, id => { stop(); stop = on(`component.${id}`, () => { void load() }) }, { immediate: true })
useHostVisibilityRefresh(load)
onUnmounted(() => { stop(); beginRead(); beginReview() })
</script>
<template>
  <section class="work-settings-shell" :class="{ 'work-embedded': embedded }">
    <SettingsHead :board="board" :embedded="embedded" :generation="schema?.generation" :authorized="authorized" :dirty="dirty" :busy="busy" :checking-removal="checkingRemoval" :reviewed="isReviewed" :pack="schema?.pack" :pack-title="packTitle" :outdated="schema?.outdated" :upgrade-reason="upgradeReason" :can-upgrade="upgradeAvailable && !dirty && !busy && !migrationPending && authorized" @upgrade="upgrade" :disabled="!dirty || busy || checkingRemoval || migrationPending || stale || !!invalid.size || (isReviewed && !canApply)" @back="back" @discard="discard" @primary="isReviewed ? apply() : review()" @saved="load()" />
    <div v-if="authorized && schema" class="work-settings-tabs">
      <div class="work-section-navigation"><Tabs :value="tab" @update:value="selectTab($event as typeof tab)">
        <TabList aria-label="Settings sections"><Tab v-for="name in tabs" :key="name" :value="name">{{ name }}</Tab></TabList>
      </Tabs></div>
      <label class="work-row work-small work-advanced"><ToggleSwitch v-model="advanced" aria-label="Advanced settings" />Advanced</label>
    </div>
    <div
      v-if="error"
      class="kx-err"
      role="alert"
    >{{ error }}
      <Button
        label="Retry"
        severity="secondary"
        @click="load()" outlined><template #icon><Icon icon="tabler:refresh" aria-hidden="true" /></template></Button>
    </div>
    <p v-if="packError" class="kx-err" role="alert">{{ packError }}<Button label="Reload packs" severity="secondary" outlined @click="loadPacks()"><template #icon><Icon icon="tabler:refresh" /></template></Button></p>
    <p
      v-if="saved"
      class="work-notice"
      role="status"
    >{{ saved }}</p>
    <p
      v-if="loading"
      class="kx-loading"
      role="status"
    >Loading settings…</p>
    <p
      v-else-if="!authorized && !error"
      class="work-notice"
      role="alert"
    >Board administrator access is required.</p>
    <div
      v-if="authorized && schema"
      class="work-settings-content work-pane"
    >
      <div
        v-if="stale"
        class="work-notice"
        role="alert"
      >The board advances to generation {{ latest?.generation }} while you edit. Your draft keeps generation
        {{ schema.generation }}. Discard to load the latest schema before reviewing again.</div>
      <div
        v-if="migrationPending"
        class="work-notice"
      >
        <p>Migration pending<span v-if="latest?.migration_error">: {{ latest.migration_error }}</span>
        </p>
        <Button
          label="Resume migration"
          severity="secondary"
          :disabled="busy"
          @click="resume" outlined><template #icon><Icon icon="tabler:refresh" aria-hidden="true" /></template></Button>
      </div>
      <form
        ref="editor"
        @submit.prevent="review"
      >
        <fieldset
          :key="editorVersion"
          class="work-settings-fieldset"
          :disabled="busy || checkingRemoval"
          :inert="busy || checkingRemoval || undefined"
        >
          <FieldsEditor :board-id="boardId" :installed-types="options?.installed_types"
            v-if="visited.has('Fields')"
            v-show="tab === 'Fields'"
            :draft="draft"
            :guard-removal="guardRemoval"
            :advanced="advanced"
            :issues="issues"
            @validity="(key, valid) => validity('fields:' + key, valid)"
          />
          <TypesEditor
            v-if="visited.has('Item types')"
            v-show="tab === 'Item types'"
            :draft="draft"
            :guard-removal="guardRemoval"
            :issues="issues"
          />
          <ProcessEditor :board-id="boardId"
            v-if="visited.has('Process')"
            v-show="tab === 'Process'"
            :draft="draft"
            :guard-removal="guardRemoval"
            :advanced="advanced"
            :issues="issues"
            @validity="(key, valid) => validity('process:' + key, valid)"
          />
          <PolicyEditor
            v-if="visited.has('Policy')"
            v-show="tab === 'Policy'"
            :draft="draft"
            @validity="(key, valid) => validity('policy:' + key, valid)"
          />
          <RelationsEditor
            v-if="visited.has('Relation types')"
            v-show="tab === 'Relation types'"
            :draft="draft"
            :guard-removal="guardRemoval"
          />
          <PluginsEditor
            v-if="visited.has('Plugins')"
            v-show="tab === 'Plugins'"
            :board-id="boardId"
            :draft="draft"
            :schema="latest ?? schema"
            :options="options?.schema_options.plugins ?? []"
            :configs="configs"
            :disabled="busy"
            @configured="invalidate(); load()"
            @validity="(key, valid) => validity('plugin:' + key, valid)"
          />
          <section
            v-if="advanced && tab === 'Policy'"
            class="work-settings-card work-stack work-advanced-settings"
          >

            <VisibilityEditor :board-id="boardId" :draft="draft" @validity="validity('visibility', $event)" />
          </section>
        </fieldset>
      </form>
      <ProcessMigration v-if="tab === 'Review' && !packRequest" :draft="draft" :original="schema.declaration" :disabled="busy || checkingRemoval" />
      <PluginsEditor v-if="tab === 'Review' && packRequest && packPlugins.length" :board-id="boardId" :draft="{ plugins: packPlugins }" :schema="latest ?? schema" :options="options?.schema_options.plugins.filter(plugin => packPlugins.some(selected => selected.use === plugin.plugin)) ?? []" :configs="configs" :disabled="busy" activation-locked @validity="(key, valid) => validity('pack-plugin:' + key, valid)" />
      <SchemaReview v-if="tab === 'Review'" :plan="plan" :generation="schema.generation" :follows="follows" :config-count="Object.keys(configs).length" :pack-review="!!packPlan">
        <PackReview v-if="packPlan && packRequest" :plan="packPlan" :request="packRequest" :original="schema.declaration" :disabled="busy" @change="packReviewed = undefined; applyKey = ''" />
      </SchemaReview>
      <p
        v-if="tab === 'Review' && !plan"
        class="kx-empty"
      >Review your draft to see the changes, their impact and any migration required.</p>
      <p
        v-if="checkingRemoval"
        class="work-muted work-small"
        role="status"
      >Checking existing values and dependencies…</p>

    </div>
  </section>
</template>
