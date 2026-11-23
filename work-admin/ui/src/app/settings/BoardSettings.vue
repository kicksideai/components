<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import Select from 'primevue/select'
import NativeDialog from '../../NativeDialog.vue'
import { computed, provide, nextTick, onUnmounted, reactive, ref, useId, watch } from 'vue'
import Button from 'primevue/button'
import SettingsRail, { type SettingsRailGroup } from '@kickside/ui-kit/SettingsRail.vue'
import { Icon } from '@iconify/vue'
import { host, on } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { ApiError, formatApiError } from '../../transport'
import { work } from '../../api'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import type { BoardRow, Declaration, AdminOptions, ItemType, Process, Schema, State } from '../../types'
import { useNavigate } from '../route'
import { humanize } from '../../forms'
import { settings } from './api'
import { validationIssues, removalReason, clone, normalizeSchema, processMigration, requestDeclaration, reviewSnapshot, type PluginConfigs, type SchemaPlan, type RemovalKind, removeEntry } from './model'
import FieldsEditor from './FieldsEditor.vue'
import TypesEditor from './TypesEditor.vue'
import ProcessEditor from './ProcessEditor.vue'
import ProcessMigration from './ProcessMigration.vue'
import RelationsEditor from './RelationsEditor.vue'
import PluginsEditor from './PluginsEditor.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import SettingsDraftActions from '@kickside/ui-kit/SettingsDraftActions.vue'
import BoardAccessSettings from './BoardAccessSettings.vue'
import { sectionRow } from './sectionRow'
import GeneralSettings from './GeneralSettings.vue'
import { stateTitle } from './process'
import SchemaReview from './SchemaReview.vue'
import PackReview from './PackReview.vue'
import { usePackReview } from './packReview'
const props = defineProps<{ boardId: string; embedded?: boolean; focusBack?: boolean; route?: string }>()
const emit = defineEmits<{ 'dirty-change': [dirty: boolean]; navigate: [route: string] }>()
const go = useNavigate()
const draftForm = useId()
const pane = ref<HTMLElement>()
let resetGeneration: number | undefined, resetDraft = ''
const draftSnapshot = (): string => JSON.stringify([request.value, configs.value, pack.request, [...invalid.value]])
type Section = 'General' | 'Item types' | 'Fields' | 'Links' | 'Workflow' | 'Access' | 'Plugins'
const allBoards = computed(() => ({
  value: 'all-boards',
  label: props.embedded ? 'All boards' : 'Back to board',
  icon: props.embedded ? 'tabler:table' : 'tabler:layout-kanban',
}))
const rail = ref<InstanceType<typeof SettingsRail>>()
watch(rail, value => {
  if (props.focusBack) value?.$el.querySelector('.kx-settings-rail-item')?.focus()
}, { flush: 'post', once: true })
const sectionGroups: SettingsRailGroup[] = [
  { heading: 'Board setup', items: [
    { value: 'Item types', label: 'Item types', icon: 'tabler:list-details' },
    { value: 'Fields', label: 'Fields', icon: 'tabler:forms' },
    { value: 'Links', label: 'Links', icon: 'tabler:link' },
    { value: 'Workflow', label: 'Workflow', icon: 'tabler:route' },
  ] },
  { heading: 'Management', items: [
    { value: 'Access', label: 'Access', icon: 'tabler:users' },
    { value: 'Plugins', label: 'Plugins', icon: 'tabler:puzzle' },
  ] },
]
const tab = ref<Section>('General')
const sectionKeys: Record<Section, string> = {
  General: 'general', 'Item types': 'items', Fields: 'fields', Links: 'links',
  Workflow: 'workflow', Access: 'access', Plugins: 'plugins',
}
const selectedRow = ref('')
function openRoute(section: Section, row = '') {
  tab.value = section
  selectedRow.value = row ? sectionKeys[section] + '/' + row : ''
}
function setLocation(section: Section, row = '') {
  openRoute(section, row)
  if (props.route !== undefined) emit('navigate', [sectionKeys[section], ...(row ? [encodeURIComponent(row)] : [])].join('/'))
}
function chooseRow(section: string, id: string, open: boolean) {
  if (props.route === undefined || sectionKeys[tab.value] !== section || (!open && selectedRow.value !== section + '/' + id)) return
  const existing = schema.value?.declaration
  const persisted =
    section === 'items' ? existing?.item_types?.some(type => type.id === id) :
    section === 'fields' ? existing?.fields?.some(field => field.code === id) :
    section === 'links' ? existing?.relation_types?.some(link => link.id === id) :
    section === 'plugins' ? options.value?.schema_options.plugins.some(plugin => plugin.plugin === id) :
    section === 'workflow' && existing?.processes?.some(process =>
      process.states.some(state => process.id + '.state.' + state.id === id) ||
      process.transitions?.some(transition => process.id + '.transition.' + transition.id === id))
  if (persisted) setLocation(tab.value, open ? id : '')
}
provide(sectionRow, { selected: selectedRow, choose: chooseRow })
function selectSection(section: string) {
  if (section === allBoards.value.value) { void back(); return }
  if (section === 'General' || sectionGroups.some(group => group.items.some(item => item.value === section))) {
    setLocation(section as Section)
  }
}
async function openAccess() {
  setLocation('Access')
  await nextTick()
  pane.value?.focus()
}
const sectionDescriptions: Record<Section, string> = {
  General: 'Manage the board name, item key prefix and app.',
  'Item types': 'Choose the fields, parent relationships and workflow for each kind of work.',
  Fields: 'Choose what information people can capture on items.',
  Links: 'Configure link types and how they appear on related items.',
  Workflow: 'Select a state or transition to edit how work moves.',
  Access: 'Who can use this board?',
  Plugins: 'Choose which plugins this board uses.',
}
const fieldType = ref('')
const creation = ref<{ section: 'Fields' | 'Workflow'; type: ItemType; opener: HTMLElement }>()
function startCreation(section: 'Fields' | 'Workflow', type: ItemType, event: MouseEvent) {
  if (!(event.currentTarget instanceof HTMLElement)) return
  creation.value = { section, type, opener: event.currentTarget }
  if (section === 'Fields') fieldType.value = type.id
  setLocation(section)
}
function finishCreation(processId?: string) {
  const active = creation.value
  if (!active) return
  if (processId !== undefined) active.type.process = processId
  const id = active.type.id
  const savedType = schema.value?.declaration.item_types?.some(type => type.id === id)
  setLocation('Item types', savedType ? id : '')
  creation.value = undefined
  if (active.section === 'Fields') void nextTick(() => active.opener.focus())
}
const reviewOpen = ref(false), schemaReviewError = ref(''), reviewOpener = ref<HTMLElement>()
watch(tab, section => {
  pane.value?.scrollTo({ top: 0 })
  if (creation.value && section !== creation.value.section) creation.value = undefined
})
function closeReview() {
  reviewOpen.value = false
  schemaReviewError.value = ''
  pack.clearReviewError()
  confirmedRenames.value = false
}
async function openReview(opener?: HTMLElement) {
  if (!showDraftActions.value) return
  if (widgetInvalid.value.size) {
    if (tab.value !== 'Plugins') {
      setLocation('Plugins')
      await nextTick()
    }
    if (pluginEditor.value && !await pluginEditor.value.reportValidity()) return
  }
  if (!validForm() || invalid.value.size) return
  reviewOpener.value = opener
  reviewOpen.value = true
  void review()
}
const visited = ref(new Set<Section>(['General']))
watch(tab, value => visited.value.add(value))
const schema = ref<Schema>(), latest = ref<Schema>(), board = ref<BoardRow>(), draft = ref<Declaration>({}), configs = ref<PluginConfigs>({})
const options = ref<AdminOptions>(), authorized = ref(false), loading = ref(true), busy = ref(false), error = ref(''), saved = ref('')
const processes = computed(() => draft.value.processes ?? [])
const settingsGroups = computed(() => authorized.value && schema.value ? [
  { heading: board.value?.title || 'Board settings', items: [{ value: 'General', label: 'General', icon: 'tabler:settings' }] },
  ...sectionGroups,
] : [])
const stateCounts = ref<Awaited<ReturnType<typeof work.stateCounts>>>()
const countsError = ref(false)
const beginCounts = latestRequest()
async function loadCounts(id: string) {
  const current = beginCounts()
  countsError.value = false
  try { const counts = await work.stateCounts(id); if (current()) stateCounts.value = counts }
  catch { if (current()) { countsError.value = true; stateCounts.value = undefined } }
}
watch(tab, section => {
  if (authorized.value && section === 'Workflow') void loadCounts(props.boardId)
})
const schemaPlan = ref<SchemaPlan>(), reviewed = ref<ReturnType<typeof reviewSnapshot>>(), applyKey = ref('')
const serverIssues = ref<import('./model').SchemaChange[]>([])
const checkingRemoval = ref(false), editorVersion = ref(0)
const invalid = ref(new Set<string>()), editor = ref<HTMLFormElement>()
const pluginEditor = ref<InstanceType<typeof PluginsEditor>>()
const widgetInvalid = ref(new Set<string>())
const blockingErrors = computed(() => [...invalid.value].some(key => !widgetInvalid.value.has(key)))
function widgetValidity(key: string, valid: boolean) {
  const id = 'plugin:' + key
  if (valid) widgetInvalid.value.delete(id)
  else widgetInvalid.value.add(id)
}
const beginRead = latestRequest(), beginReview = latestRequest()
const request = computed(() => requestDeclaration(draft.value, schema.value?.declaration ?? {}))
const schemaDirty = computed(() => invalid.value.size > 0 || widgetInvalid.value.size > 0 || !!schema.value && (JSON.stringify(request.value) !== JSON.stringify(requestDeclaration(schema.value.declaration, schema.value.declaration)) || Object.keys(configs.value).length > 0))
const migrationPending = computed(() => !!latest.value?.migration_error || board.value?.status === 'migrating')
const stale = computed(() => !!schema.value && !!latest.value && schema.value.generation !== latest.value.generation)
const canReview = () => authorized.value && !stale.value && !invalid.value.size && !widgetInvalid.value.size
const pack = reactive(usePackReview({
  boardId: () => props.boardId, schema, configs, busy,
  schemaDirty: () => schemaDirty.value, migrationPending: () => migrationPending.value, canReview,
  authorized: () => authorized.value, draftSnapshot,
  openReview: () => { reviewOpener.value = undefined; reviewOpen.value = true },
  clearSaved: () => { saved.value = '' },
  applied: reloadApplied,
}))
const plan = computed(() => pack.request ? pack.plan : schemaPlan.value)
const reviewError = computed(() => pack.request ? pack.reviewError : schemaReviewError.value)
const issues = computed(() => [...serverIssues.value, ...(plan.value?.refused ?? [])])
const dirty = computed(() => !!pack.request || schemaDirty.value)
const showDraftActions = computed(() => dirty.value && !(pack.inProgress && pack.request))
const metadataDirty = ref(false)
const unsaved = computed(() => dirty.value || metadataDirty.value)
watch(unsaved, value => emit('dirty-change', value), { immediate: true, flush: 'sync' })
const canSchemaApply = computed(() => (!occupiedChanges.value.renamed.length || confirmedRenames.value) && canReview() && !busy.value && !checkingRemoval.value && !migrationPending.value && schemaPlan.value && (schemaPlan.value.changes.length > 0 || Object.keys(configs.value).length > 0) && schemaPlan.value.class !== 'refused' && !schemaPlan.value.refused.length && reviewed.value?.matches(request.value, schema.value?.generation ?? -1, configs.value))
const canApply = computed(() => pack.request ? pack.canApply : canSchemaApply.value)
const isReviewed = computed(() => pack.request ? pack.isReviewed : !!schemaPlan.value)
const confirmedRenames = ref(false)
const occupiedChanges = computed(() => {
  const saved = schema.value?.declaration
  const removed: { process: Process; state: State; count: number }[] = []
  const renamed: { process: Process; state: State; name: string; count: number }[] = []
  for (const process of processes.value) {
    const types = saved?.item_types?.filter(type => type.process === process.id) ?? []
    const before = saved?.processes?.find(workflow => workflow.id === process.id)
    for (const state of before?.states ?? []) {
      const next = process.states.find(candidate => candidate.id === state.id)
      if (next && next.name === state.name) continue
      const change = [...(plan.value?.refused ?? []), ...(plan.value?.changes ?? [])]
        .find(row => row.code === 'process ' + process.id && row.detail === state.id && ['state.remove', 'state.map'].includes(row.what))
      const count = change?.count ?? types.reduce((total, type) => total + (stateCounts.value?.[type.id]?.[state.id] ?? 0), 0)
      if (!count) continue
      if (next) renamed.push({ process, state, name: stateTitle(next), count })
      else removed.push({ process, state, count })
    }
  }
  return { removed, renamed }
})
function setDestination(process: Process, state: string, destination: string) {
  process.map = { ...process.map, [state]: destination }
  void review()
}
const reviewedDeclaration = computed(() => pack.preview?.declaration ?? reviewed.value?.declaration)
const follows = computed(() => {
  const declaration = reviewedDeclaration.value
  if (!plan.value || !declaration) return []
  return processMigration(plan.value, declaration).map(id => declaration.processes?.find(process => process.id === id)?.name || 'Untitled process')
})
function invalidate() {
  serverIssues.value = []
  beginReview()
  schemaPlan.value = undefined
  reviewed.value = undefined
  applyKey.value = ''
  pack.invalidate()
}
watch([request, configs], invalidate, { deep: true, flush: 'sync' })
watch(dirty, value => { if (value) saved.value = '' })
function validity(key: string, valid: boolean) { if (valid) invalid.value.delete(key); else invalid.value.add(key); invalidate() }
function reset(view: Schema) { pack.clear(); creation.value = undefined; editorVersion.value++; schema.value = view; draft.value = clone(view.declaration); configs.value = {}; invalid.value.clear(); widgetInvalid.value.clear(); invalidate() }
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
    else if (force || !schema.value || !dirty.value && normalized.generation !== schema.value.generation) reset(normalized)
    if (stale.value) invalidate()
    await pack.load(current)
    if (current() && tab.value === 'Workflow') void loadCounts(props.boardId)
  } catch (e) {
    if (!current()) return
    if (e instanceof ApiError && (e.status === 403 || e.kind?.toLowerCase() === 'permission_denied')) authorized.value = false
    invalidate(); error.value = formatApiError(e, 'Could not load board settings.')
  } finally { if (current()) loading.value = false }
}
function validForm() {
  for (const input of Array.from(editor.value?.elements ?? [])) {
    if (!(input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement)) continue
    if (input.form !== editor.value || input.closest('[style*="display: none"]:not(.p-accordioncontent)')) continue
    if (!input.reportValidity()) {
      const collapsed = input.closest('.p-accordioncontent[style*="display: none"]')
      const toggle = collapsed?.closest('.kx-disclosure')?.querySelector<HTMLButtonElement>('.kx-disclosure-toggle[aria-expanded="false"]')
      if (toggle) {
        toggle.click()
        void nextTick(() => input.reportValidity())
      }
      return false
    }
  }
  return true
}
async function review() {
  if (pack.request) return pack.review()
  if (!schema.value || busy.value || !canReview()) return
  const current = beginReview(), snapshot = reviewSnapshot(request.value, schema.value.generation, configs.value)
  busy.value = true; schemaReviewError.value = ''; saved.value = ''
  try {
    const changedName = (snapshot.declaration.processes ?? []).some(process =>
      schema.value?.declaration.processes?.find(saved => saved.id === process.id)?.states.some(state =>
        process.states.some(next => next.id === state.id && next.name !== state.name)))
    const [response] = await Promise.all([
      settings.plan(props.boardId, snapshot),
      changedName ? loadCounts(props.boardId) : undefined,
    ])
    if (changedName && countsError.value) {
      invalidate()
      schemaReviewError.value = 'Could not check which items use the renamed states. Check the impact again.'
      return
    }
    if (!current() || invalid.value.size || !snapshot.matches(request.value, schema.value.generation, configs.value)) return
    schemaPlan.value = response; reviewed.value = snapshot; applyKey.value = crypto.randomUUID(); reviewOpen.value = true
  } catch (e) { if (current()) { invalidate(); schemaReviewError.value = formatApiError(e, 'Could not review changes.'); serverIssues.value = validationIssues(e, request.value) } }
  finally { busy.value = false }
}
async function apply() {
  if (!canApply.value) return
  if (pack.request) {
    if (await pack.apply()) closeReview()
    return
  }
  if (!reviewed.value) return
  busy.value = true; schemaReviewError.value = ''; saved.value = ''
  const appliedDraft = draftSnapshot()
  try {
    const result = await settings.apply(props.boardId, reviewed.value, applyKey.value)
    resetGeneration = result.generation; resetDraft = appliedDraft
    await load()
    saved.value = 'Board changes applied.'
    closeReview()
  } catch (e) { schemaReviewError.value = formatApiError(e, 'Could not apply the board changes.') }
  finally { busy.value = false }
}
async function reloadApplied(generation: number, appliedDraft: string) {
  if (appliedDraft === draftSnapshot()) {
    resetGeneration = generation
    resetDraft = appliedDraft
  }
  await load()
}
async function resume() {
  if (busy.value) return
  busy.value = true; error.value = ''
  try { const result = await settings.resume(props.boardId); saved.value = result.resumed ? 'Migration resumes.' : 'Migration is already running.'; await load() }
  catch (e) { error.value = formatApiError(e, 'Could not resume migration.') }
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
    if (response.class === 'refused') return 'Resolve the blocked changes in your draft before removing this definition.'
  } catch (e) { return formatApiError(e, 'Could not check this removal.') }
  finally { checkingRemoval.value = false }
}
async function back() {
  if (props.embedded) { go({ name: 'boards' }); return }
  if (unsaved.value && !await host.confirm({ header: 'Discard changes?', message: 'Your unsaved board settings will be discarded.', acceptLabel: 'Discard', rejectLabel: 'Keep editing' })) return
  go({ name: 'board', board: props.boardId })
}
function discard() { resetGeneration = undefined; if (latest.value) reset(latest.value); saved.value = ''; error.value = ''; closeReview() }

watch(() => props.boardId, () => { metadataDirty.value = false; resetGeneration = undefined; pack.reset(); schema.value = undefined; latest.value = undefined; board.value = undefined; configs.value = {}; invalid.value.clear(); widgetInvalid.value.clear(); beginCounts(); stateCounts.value = undefined; fieldType.value = ''; creation.value = undefined; visited.value = new Set(['General']); openRoute('General'); closeReview(); authorized.value = false; loading.value = true; void load(true) })
watch([() => props.route, () => props.boardId], ([route]) => {
  if (route === undefined) return
  const [key, row] = route.split('/')
  const section = (Object.keys(sectionKeys) as Section[]).find(section => sectionKeys[section] === key) ?? 'General'
  let id = ''
  try { if (row) id = decodeURIComponent(row) } catch { /* Invalid identifiers have no selected row. */ }
  if (section === 'Fields' && id && selectedRow.value !== 'fields/' + id) fieldType.value = ''
  openRoute(section, id)
  visited.value.add(section)
}, { immediate: true })
let stop = () => {}
watch(() => props.boardId, id => { stop(); stop = on(`component.${id}`, () => { void load() }) }, { immediate: true })
useHostVisibilityRefresh(load)
onUnmounted(() => { stop(); beginRead(); beginReview(); beginCounts(); pack.invalidate() })
</script>
<template>
  <section class="work-settings-shell work-ia" :class="{ 'work-embedded': embedded }">
    <div class="work-section-layout">
      <SettingsRail ref="rail" label="Board settings sections" :value="tab"
        :groups="settingsGroups" :leading-item="allBoards" @update:value="selectSection" />
      <div class="kx-main">
        <div ref="pane" class="kx-main-scroll work-settings-content" role="region" :aria-label="tab" tabindex="-1">
          <SettingsSectionHead v-if="authorized && schema" :title="tab" :description="sectionDescriptions[tab]">
            <template v-if="showDraftActions || tab === 'Plugins'" #actions>
              <Button v-if="tab === 'Plugins'" label="Refresh status" severity="secondary" outlined :disabled="busy || loading" @click="load()">
                <template #icon><Icon icon="tabler:refresh" aria-hidden="true" /></template>
              </Button>
              <SettingsDraftActions v-if="showDraftActions" :busy="busy" :discard-disabled="checkingRemoval"
                :review-disabled="checkingRemoval || migrationPending || stale || blockingErrors"
                @discard="discard" @review="openReview" />
            </template>
          </SettingsSectionHead>
          <div v-if="error" class="kx-err work-alert-actions">
            <p role="alert">{{ error }}</p>
            <Button label="Retry" severity="secondary" outlined @click="load()" />
          </div>
          <p v-if="saved" class="work-notice" role="status">{{ saved }}</p>
          <p v-if="loading" class="kx-loading" role="status">Loading board settings…</p>
          <p v-else-if="!authorized && !error" class="work-notice" role="alert">Ask a board administrator to grant you access to these settings.</p>

          <div v-if="authorized && schema" class="work-settings-body">
            <section v-if="pack.result" class="work-notice work-stack work-tight" aria-label="Pack installation">
              <p v-if="pack.inProgress" role="status">Pack installation status <strong>{{ humanize(pack.result.status) }}</strong></p>
              <p v-else role="status">Pack applied.</p>
              <p class="work-small">Operation <code>{{ pack.result.operation_id }}</code> · Job <code>{{ pack.result.job_id }}</code></p>
              <p v-if="pack.operationError" class="kx-err" role="alert">{{ pack.operationError }}</p>
              <div v-if="pack.inProgress"><Button label="Continue pack installation" severity="secondary" outlined :loading="busy" :disabled="busy" @click="pack.continueInstallation" /></div>
            </section>
            <p v-if="stale" class="work-notice" role="alert">Someone saved new settings while you were editing. Discard this draft to load their changes.</p>
            <div v-if="migrationPending" class="work-notice">
              <p>{{ latest?.migration_error ? 'Updating existing items paused.' : 'Updating existing items…' }}</p>
              <Disclosure v-if="latest?.migration_error" label="Technical details">{{ latest.migration_error }}</Disclosure>
              <Button v-if="latest?.migration_error" label="Resume updating items" severity="secondary" :disabled="busy" outlined @click="resume" />
            </div>

            <GeneralSettings v-show="tab === 'General'" :draft="draft" :schema="latest ?? schema" :board="board"
              :active="tab === 'General'" :board-apps="options?.board_apps"
              :draft-form="draftForm" :disabled="busy || checkingRemoval"
              :pack-title="schema.pack ? pack.title : undefined" :outdated="schema.outdated" :upgrade-reason="pack.upgradeReason"
              :can-upgrade="pack.upgradeAvailable && pack.canManage" :can-install="pack.canManage"
              :pack-error="pack.error" @upgrade="pack.upgrade" @install="pack.installing = true" @retry="pack.load()"
              @dirty-change="metadataDirty = $event" @saved="load()" @share="openAccess" />

            <form :id="draftForm" ref="editor" @submit.prevent="openReview()">
              <fieldset :key="editorVersion" class="work-settings-fieldset" :disabled="busy || checkingRemoval" :inert="busy || checkingRemoval || undefined">
                <TypesEditor v-if="visited.has('Item types')" v-show="tab === 'Item types'" class="work-ia-section"
                  :draft="draft" :guard-removal="guardRemoval" :issues="issues"
                  @create-field="(type, event) => startCreation('Fields', type, event)"
                  @create-workflow="(type, event) => startCreation('Workflow', type, event)" />

                <FieldsEditor v-if="visited.has('Fields')" v-show="tab === 'Fields'" class="work-ia-section"
                  :board-id="boardId" :installed-types="options?.installed_types" :draft="draft" :guard-removal="guardRemoval"
                  :issues="issues" v-model:item-type="fieldType" :create-for-item-type="creation?.section === 'Fields'"
                  @created="finishCreation()" @cancel-creation="finishCreation()" @validity="(key, valid) => validity('fields:' + key, valid)" />

                <RelationsEditor v-if="visited.has('Links')" v-show="tab === 'Links'" class="work-ia-section"
                  :draft="draft" :guard-removal="guardRemoval" />

                <section v-if="visited.has('Workflow')" v-show="tab === 'Workflow'" class="work-ia-section">
                  <p v-if="countsError" class="work-muted">Item counts are unavailable. <Button label="Reload counts" text @click="loadCounts(boardId)" /></p>
                  <ProcessEditor :board-id="boardId" :draft="draft" :guard-removal="guardRemoval" :issues="issues" :counts="stateCounts" :count-types="schema.declaration.item_types" :guards="options?.guards"
                    :create-for-item-type="creation?.section === 'Workflow'" :creation-opener="creation?.opener"
                    @created="finishCreation" @cancel-creation="finishCreation()" @validity="(key, valid) => validity('process:' + key, valid)" />
                </section>

                <BoardAccessSettings v-if="visited.has('Access')" v-show="tab === 'Access'" :active="tab === 'Access'" :board-id="boardId"
                  :draft="draft" :board="board" :busy="busy" @validity="validity('visibility', $event)" />

                <section v-if="visited.has('Plugins')" v-show="tab === 'Plugins'" class="work-ia-section">
                  <PluginsEditor ref="pluginEditor" :board-id="boardId" :draft="draft" :schema="latest ?? schema" :options="options?.schema_options.plugins ?? []"
                    :filters="options?.filters" :configs="configs" :disabled="busy" @configured="invalidate(); load()" @refresh="load()" @review="openReview"
                    @validity="(key, valid) => validity('plugin:' + key, valid)" @widget-validity="widgetValidity" />
                </section>
              </fieldset>
            </form>

            <NativeDialog :visible="reviewOpen" label="Review changes" :busy="busy" :return-focus="reviewOpener" class="work-review-sheet" @close="closeReview">
              <div class="work-review-layout">
                <header><h2>Review changes</h2><p class="work-muted">{{ board?.title }}</p></header>
                <div class="work-review-content work-stack" :aria-busy="busy">
                  <p v-if="busy" role="status">{{ plan ? 'Applying or checking changes…' : 'Checking the impact on your board…' }}</p>
                  <p v-if="reviewError" role="alert" class="kx-err">{{ reviewError }}</p>
                  <p v-if="stale" role="alert">The board changed while you were editing. Close this review and discard the draft to load the latest settings.</p>
                  <ProcessMigration v-if="reviewOpen && !pack.request && (occupiedChanges.removed.length || occupiedChanges.renamed.length)"
                    :removed="occupiedChanges.removed" :renamed="occupiedChanges.renamed" :disabled="busy || checkingRemoval"
                    v-model:confirmed="confirmedRenames" @destination="setDestination" />
                  <PluginsEditor v-if="reviewOpen && pack.request && pack.plugins.length" :board-id="boardId" :draft="{ plugins: pack.plugins }" :schema="latest ?? schema"
                    :options="options?.schema_options.plugins.filter(plugin => pack.plugins.some(selected => selected.use === plugin.plugin)) ?? []"
                    :configs="configs" :disabled="busy" activation-locked @validity="(key, valid) => validity('pack-plugin:' + key, valid)" />
                  <SchemaReview v-if="reviewOpen" :board-id="boardId" :original="schema.declaration" :declaration="reviewedDeclaration" :plan="plan"
                    :follows="follows" :config-count="Object.keys(configs).length" :plugin-configs="reviewed?.plugin_configs"
                    :pack-review="!!pack.preview" :plugins="options?.schema_options.plugins">
                    <PackReview v-if="pack.preview && pack.request" :plan="pack.preview" :request="pack.request" :original="schema.declaration"
                      :plugins="options?.schema_options.plugins" :disabled="busy" @change="pack.changed" />
                  </SchemaReview>
                  <p v-if="!busy && !isReviewed && !stale && !reviewError">Check the impact again before applying.</p>
                </div>
                <footer class="work-dialog-actions">
                  <Button label="Keep editing" severity="secondary" outlined :disabled="busy" @click="closeReview" />
                  <Button v-if="!isReviewed" label="Check impact" :disabled="busy || stale || !!invalid.size" @click="review" />
                  <Button v-else label="Apply changes" :disabled="!canApply" :loading="busy" @click="apply" />
                </footer>
              </div>
            </NativeDialog>
            <p v-if="checkingRemoval" class="work-muted" role="status">Checking what uses this setting…</p>
          </div>
        </div>
      </div>
    </div>

    <NativeDialog v-if="authorized" :visible="pack.installing" label="Install pack" :busy="busy" @close="pack.installing = false">
      <form v-if="pack.installing" class="work-dialog-box work-stack" @submit.prevent="pack.install">
        <h2>Install a pack</h2>
        <p class="work-muted work-small">Packs give an empty board a starting setup. Review checks whether this board is eligible.</p>
        <p v-if="pack.loading" class="work-muted" role="status">Loading packs…</p>
        <div v-else-if="pack.error" class="kx-err work-alert-actions">
          <p role="alert">{{ pack.error }}</p>
          <Button label="Reload packs" severity="secondary" outlined @click="pack.load()" />
        </div>
        <label v-else-if="pack.choices.length" class="work-stack work-tight">Pack
          <Select v-model="pack.installPack" aria-label="Pack to install" appendTo="self" optionLabel="title" optionValue="id" optionDisabled="disabled" :options="pack.choices"
            :pt="{ option: ({ context }) => ({ 'aria-label': [context.option.title, context.option.unavailable].filter(Boolean).join('. ') }) }">
            <template #option="{ option }">
              <span>{{ option.title }}<small v-if="option.unavailable" class="work-pack-unavailable work-block">{{ option.unavailable }}</small></span>
            </template>
          </Select>
        </label>
        <p v-else class="work-muted">No available packs were found.</p>
        <footer class="work-dialog-actions"><Button label="Cancel" severity="secondary" outlined @click="pack.installing = false" /><Button type="submit" label="Review pack" :disabled="!pack.installChoice || !pack.canManage || pack.loading || !!pack.error" /></footer>
      </form>
    </NativeDialog>
  </section>
</template>
