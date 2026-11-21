<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import Select from 'primevue/select'
import NativeDialog from '../../NativeDialog.vue'
import { computed, nextTick, onUnmounted, ref, useId, watch } from 'vue'
import Button from 'primevue/button'
import SettingsRail, { type SettingsRailGroup } from '@kickside/ui-kit/SettingsRail.vue'
import { Icon } from '@iconify/vue'
import { host, on } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { ApiError, formatApiError } from '../../transport'
import { work } from '../../api'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import type { BoardRow, Declaration, AdminOptions, Process, Schema, State } from '../../types'
import { useNavigate } from '../route'
import { settings } from './api'
import { validationIssues, removalReason, clone, normalizeSchema, processMigration, requestDeclaration, reviewSnapshot, type PluginConfigs, type SchemaPlan, type RemovalKind, removeEntry } from './model'
import FieldsEditor from './FieldsEditor.vue'
import TypesEditor from './TypesEditor.vue'
import ProcessEditor from './ProcessEditor.vue'
import ProcessMigration from './ProcessMigration.vue'
import RelationsEditor from './RelationsEditor.vue'
import PluginsEditor from './PluginsEditor.vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import SettingsActions from './SettingsActions.vue'
import SettingsHead from './SettingsHead.vue'
import SectionSummary from './SectionSummary.vue'
import BoardAccessSettings from './BoardAccessSettings.vue'
import GeneralSettings from './GeneralSettings.vue'
import { stateTitle } from './process'
import SchemaReview from './SchemaReview.vue'
import PackReview from './PackReview.vue'
import { availablePack, planUpgrade, upgradeRequest, type AvailablePack, type PackPlan, type PackRequest } from '../../packs'
const props = defineProps<{ boardId: string; embedded?: boolean; focusBack?: boolean }>()
const emit = defineEmits<{ 'dirty-change': [dirty: boolean] }>()
const go = useNavigate()
const draftForm = useId()
const pane = ref<HTMLElement>()
const panelId = (section: string) => draftForm + '-' + section.toLowerCase().replaceAll(' ', '-')
const tabId = (section: string) => panelId(section) + '-tab'
const head = ref<InstanceType<typeof SettingsHead>>()
const grantsVersion = ref(0)
function shared() { grantsVersion.value++; void load() }
let resetGeneration: number | undefined, resetDraft = ''
const draftSnapshot = () => JSON.stringify([request.value, configs.value, packRequest.value, [...invalid.value]])
type Section = 'General' | 'Items' | 'Workflow' | 'Access' | 'Plugins'
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
    { value: 'Items', label: 'Items', icon: 'tabler:list-details' },
    { value: 'Workflow', label: 'Workflow', icon: 'tabler:route' },
  ] },
  { heading: 'Management', items: [
    { value: 'Access', label: 'Access', icon: 'tabler:users' },
    { value: 'Plugins', label: 'Plugins', icon: 'tabler:puzzle' },
  ] },
]
const tab = ref<Section>('General')
function selectSection(section: string) {
  if (section === allBoards.value.value) { void back(); return }
  if (section === 'General' || sectionGroups.some(group => group.items.some(item => item.value === section))) {
    tab.value = section as Section
  }
}
const itemViews = ['Item types', 'Fields', 'Links'] as const
const itemView = ref<typeof itemViews[number]>('Item types')
const itemDescriptions = {
  'Item types': 'What kinds of work can this board track?',
  Fields: 'What information can items capture?',
  Links: 'How can items relate to each other?',
}
const sectionDescriptions = computed(() => ({
  General: 'What is this board for?',
  Items: itemDescriptions[itemView.value],
  Workflow: 'How does work move?',
  Access: 'Who can use this board?',
  Plugins: 'What can this board do?',
}))
const fieldType = ref('')
const reviewOpen = ref(false), reviewError = ref(''), reviewOpener = ref<HTMLElement>()
const openedItems = ref(new Set<typeof itemViews[number]>(['Item types']))
watch(itemView, value => openedItems.value.add(value))
watch([tab, itemView], () => pane.value?.scrollTo({ top: 0 }))
function showFields(type: string) { fieldType.value = type; itemView.value = 'Fields' }
function closeReview() { reviewOpen.value = false; reviewError.value = ''; confirmedRenames.value = false }
function openReview(opener?: HTMLElement) {
  if (!dirty.value || !validForm() || invalid.value.size) return
  reviewOpener.value = opener
  reviewOpen.value = true
  void review()
}
const installing = ref(false), installPack = ref('')
const visited = ref(new Set<Section>(['General']))
watch(tab, value => visited.value.add(value))
const schema = ref<Schema>(), latest = ref<Schema>(), board = ref<BoardRow>(), draft = ref<Declaration>({}), configs = ref<PluginConfigs>({})
const options = ref<AdminOptions>(), authorized = ref(false), loading = ref(true), busy = ref(false), error = ref(''), saved = ref('')
const itemTypes = computed(() => draft.value.item_types ?? [])
const fields = computed(() => draft.value.fields ?? [])
const links = computed(() => draft.value.relation_types ?? [])
const processes = computed(() => draft.value.processes ?? [])
const enabledPlugins = computed(() => draft.value.plugins?.length ?? 0)
const installedPlugins = computed(() => options.value?.schema_options.plugins.filter(plugin => plugin.installed).length ?? 0)
const unusedFields = computed(() => fields.value.filter(field => !itemTypes.value.some(type => type.fields.includes(field.code))).length)
const settingsGroups = computed(() => authorized.value && schema.value ? [
  { heading: board.value?.title || 'Board settings', items: [{ value: 'General', label: 'General', icon: 'tabler:settings' }] },
  ...sectionGroups,
] : [])
const itemFacts = computed(() => {
  switch (itemView.value) {
    case 'Item types': return [itemTypes.value.length + (itemTypes.value.length === 1 ? ' item type' : ' item types')]
    case 'Fields': return [
      fields.value.length + (fields.value.length === 1 ? ' field' : ' fields'),
      ...(unusedFields.value ? [unusedFields.value + (unusedFields.value === 1 ? ' unused field' : ' unused fields')] : []),
    ]
    case 'Links': return [links.value.length + (links.value.length === 1 ? ' link type' : ' link types')]
  }
})
const guardedTransitions = computed(() => processes.value.flatMap(p => p.transitions ?? []).filter(t => t.when || t.guards?.length || t.require?.length).length)
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
  if (authorized.value && (section === 'General' || section === 'Workflow')) void loadCounts(props.boardId)
})
const packError = ref('')
const packs = ref<AvailablePack[]>([]), packRequest = ref<PackRequest>(), packPlan = ref<PackPlan>(), packReviewed = ref<PackRequest>()
const plan = ref<SchemaPlan>(), reviewed = ref<ReturnType<typeof reviewSnapshot>>(), applyKey = ref('')
const serverIssues = ref<import('./model').SchemaChange[]>([])
const issues = computed(() => [...serverIssues.value, ...(plan.value?.refused ?? [])])
const checkingRemoval = ref(false), editorVersion = ref(0)
const invalid = ref(new Set<string>()), editor = ref<HTMLFormElement>()
const beginRead = latestRequest(), beginReview = latestRequest()
const request = computed(() => requestDeclaration(draft.value, schema.value?.declaration ?? {}))
const dirty = computed(() => invalid.value.size > 0 || !!packRequest.value || !!schema.value && (JSON.stringify(request.value) !== JSON.stringify(requestDeclaration(schema.value.declaration, schema.value.declaration)) || Object.keys(configs.value).length > 0))
const metadataDirty = ref(false)
const unsaved = computed(() => dirty.value || metadataDirty.value)
watch(unsaved, value => emit('dirty-change', value), { immediate: true, flush: 'sync' })
const stale = computed(() => !!schema.value && !!latest.value && schema.value.generation !== latest.value.generation)
const canSchemaApply = computed(() => (!occupiedChanges.value.renamed.length || confirmedRenames.value) && authorized.value && !busy.value && !checkingRemoval.value && !migrationPending.value && !stale.value && !invalid.value.size && plan.value && (plan.value.changes.length > 0 || Object.keys(configs.value).length > 0) && plan.value.class !== 'refused' && !plan.value.refused.length && reviewed.value?.matches(request.value, schema.value?.generation ?? -1, configs.value))
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
const packPlugins = computed(() => packs.value.find(pack => pack.id === packRequest.value?.pack)?.plugins.filter(plugin => !schema.value?.plugins?.some(state => state.plugin === plugin.plugin && state.active)).map(plugin => ({ use: plugin.plugin })) ?? [])
const packMatches = computed(() => !!packReviewed.value && JSON.stringify(packReviewed.value) === JSON.stringify(packRequest.value))
const canApply = computed(() => packRequest.value ? authorized.value && !busy.value && !invalid.value.size && !stale.value && !migrationPending.value && packMatches.value && plan.value?.class !== 'refused' && !plan.value?.refused.length && packPlan.value?.conflicts.every(c => !!packRequest.value?.resolutions?.[c.path]) : canSchemaApply.value)
const isReviewed = computed(() => !!plan.value && (!packRequest.value || packMatches.value))
const packTitle = computed(() => packs.value.find(p => p.id === schema.value?.pack?.id)?.title || 'Installed pack')
const upgradeAvailable = computed(() => !packError.value && !!schema.value?.outdated && !!packs.value.find(p => p.id === schema.value?.pack?.id))
const upgradeReason = computed(() => packError.value ? 'Reload packs to check available upgrades.' : !upgradeAvailable.value ? 'Install an available version of this pack to upgrade.' : dirty.value ? 'Discard the current draft before upgrading.' : migrationPending.value ? 'Finish the current migration before upgrading.' : busy.value ? 'Wait for the current request to finish.' : undefined)
function clearPack() { packRequest.value = undefined; packPlan.value = undefined; packReviewed.value = undefined }
async function upgrade() {
  if (!schema.value?.pack || busy.value || dirty.value) return
  const installed = packs.value.find(p => p.id === schema.value!.pack!.id)
  if (!installed) return
  reviewOpener.value = undefined
  packRequest.value = upgradeRequest(installed, schema.value.generation); reviewOpen.value = true
  await reviewPack()
}
async function install() {
  const pack = packs.value.find(p => p.id === installPack.value)
  if (!schema.value || !pack || pack.plugins.some(p => !p.installed) || busy.value || dirty.value) return
  reviewOpener.value = undefined
  packRequest.value = upgradeRequest(pack, schema.value.generation); installing.value = false; reviewOpen.value = true
  await reviewPack()
}
async function reviewPack() {
  if (!packRequest.value || busy.value || !authorized.value || stale.value || invalid.value.size) return
  const current = beginReview(), request = clone(packRequest.value), before = JSON.stringify(packRequest.value)
  busy.value = true; reviewError.value = ''; saved.value = ''
  try {
    const reviewed = await planUpgrade(request, request => settings.packPlan(props.boardId, request))
    if (!current() || before !== JSON.stringify(packRequest.value)) return
    packPlan.value = reviewed.plan; plan.value = reviewed.plan; packRequest.value = reviewed.request
    packReviewed.value = clone(packRequest.value); applyKey.value = crypto.randomUUID(); reviewOpen.value = true
  } catch (e) { if (current()) { packReviewed.value = undefined; reviewError.value = formatApiError(e, 'Could not review the pack.') } }
  finally { busy.value = false }
}
const reviewedDeclaration = computed(() => packPlan.value?.declaration ?? reviewed.value?.declaration)
const follows = computed(() => {
  const declaration = reviewedDeclaration.value
  if (!plan.value || !declaration) return []
  return processMigration(plan.value, declaration).map(id => declaration.processes?.find(process => process.id === id)?.name || 'Untitled process')
})
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
    else if (force || !schema.value || !dirty.value && normalized.generation !== schema.value.generation) reset(normalized)
    if (stale.value) invalidate()
    await loadPacks(current)
    if (current() && (tab.value === 'General' || tab.value === 'Workflow')) void loadCounts(props.boardId)
  } catch (e) {
    if (!current()) return
    if (e instanceof ApiError && (e.status === 403 || e.kind?.toLowerCase() === 'permission_denied')) authorized.value = false
    invalidate(); error.value = formatApiError(e, 'Could not load board settings.')
  } finally { if (current()) loading.value = false }
}
async function loadPacks(current: () => boolean = () => true) {
  packError.value = ''
  try { const rows = await work.packs(); if (current()) packs.value = rows.filter(availablePack) }
  catch (e) { if (current()) packError.value = formatApiError(e, 'Could not load packs.') }
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
  if (packRequest.value) return reviewPack()
  if (!schema.value || busy.value || !authorized.value || stale.value || invalid.value.size) return
  const current = beginReview(), snapshot = reviewSnapshot(request.value, schema.value.generation, configs.value)
  busy.value = true; reviewError.value = ''; saved.value = ''
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
      reviewError.value = 'Could not check which items use the renamed states. Check the impact again.'
      return
    }
    if (!current() || invalid.value.size || !snapshot.matches(request.value, schema.value.generation, configs.value)) return
    plan.value = response; reviewed.value = snapshot; applyKey.value = crypto.randomUUID(); reviewOpen.value = true
  } catch (e) { if (current()) { invalidate(); reviewError.value = formatApiError(e, 'Could not review changes.'); serverIssues.value = validationIssues(e, request.value) } }
  finally { busy.value = false }
}
async function apply() {
  if (!canApply.value) return
  if (packRequest.value && packReviewed.value) {
    busy.value = true; reviewError.value = ''
    const appliedDraft = draftSnapshot()
    try { const result = await settings.packApply(props.boardId, clone(packReviewed.value), applyKey.value); resetGeneration = result.generation; resetDraft = appliedDraft; await load(); saved.value = result.status === 'done' ? 'Pack applied.' : 'Pack installation continues in the background.'; closeReview() }
    catch (e) { reviewError.value = formatApiError(e, 'Could not apply the pack upgrade.') }
    finally { busy.value = false }
    return
  }
  if (!reviewed.value) return
  busy.value = true; reviewError.value = ''; saved.value = ''
  const appliedDraft = draftSnapshot()
  try {
    const result = await settings.apply(props.boardId, reviewed.value, applyKey.value)
    resetGeneration = result.generation; resetDraft = appliedDraft
    await load()
    saved.value = 'Board changes applied.'
    closeReview()
  } catch (e) { reviewError.value = formatApiError(e, 'Could not apply the board changes.') }
  finally { busy.value = false }
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

watch(() => props.boardId, () => { metadataDirty.value = false; resetGeneration = undefined; clearPack(); packs.value = []; schema.value = undefined; latest.value = undefined; board.value = undefined; configs.value = {}; invalid.value.clear(); beginCounts(); stateCounts.value = undefined; openedItems.value = new Set(['Item types']); itemView.value = 'Item types'; fieldType.value = ''; visited.value = new Set(['General']); selectSection('General'); closeReview(); authorized.value = false; loading.value = true; void load(true) })
let stop = () => {}
watch(() => props.boardId, id => { stop(); stop = on(`component.${id}`, () => { void load() }) }, { immediate: true })
useHostVisibilityRefresh(load)
onUnmounted(() => { stop(); beginRead(); beginReview(); beginCounts() })
// Chromium preserves focus-visible when a pointer clicks the already focused button.
function focusRailWithPointer(event: PointerEvent) {
  if (event.button === 0 && event.target instanceof Element) {
    event.target.closest<HTMLButtonElement>('.kx-settings-rail-item:focus-visible')?.blur()
  }
}
</script>
<template>
  <section class="work-settings-shell work-ia" :class="{ 'work-embedded': embedded }">
    <div class="work-section-layout">
      <SettingsRail ref="rail" label="Board settings sections" :value="tab"
        :groups="settingsGroups" :leading-item="allBoards" @update:value="selectSection" @pointerdown="focusRailWithPointer" />
      <div class="kx-main">
        <div ref="pane" class="kx-main-scroll work-settings-content" role="region" :aria-label="tab">
          <SettingsHead v-if="authorized && schema" ref="head" :title="tab" :description="sectionDescriptions[tab]"
            :board="board" :authorized="authorized" :busy="busy" @shared="shared">
            <SettingsActions :dirty="dirty" :busy="busy" :checking-removal="checkingRemoval"
              :disabled="!dirty || busy || checkingRemoval || migrationPending || stale || !!invalid.size"
              @discard="discard" @primary="openReview" />
          </SettingsHead>
          <div v-if="error" class="kx-err work-alert-actions">
            <p role="alert">{{ error }}</p>
            <Button label="Retry" severity="secondary" outlined @click="load()" />
          </div>
          <p v-if="saved" class="work-notice" role="status">{{ saved }}</p>
          <p v-if="loading" class="kx-loading" role="status">Loading board settings…</p>
          <p v-else-if="!authorized && !error" class="work-notice" role="alert">Ask a board administrator to grant you access to these settings.</p>

          <div v-if="authorized && schema" class="work-settings-body">
            <p v-if="stale" class="work-notice" role="alert">Someone saved new settings while you were editing. Discard this draft to load their changes.</p>
            <div v-if="migrationPending" class="work-notice">
              <p>{{ latest?.migration_error ? 'Updating existing items paused.' : 'Updating existing items…' }}</p>
              <Disclosure v-if="latest?.migration_error" label="Technical details">{{ latest.migration_error }}</Disclosure>
              <Button v-if="latest?.migration_error" label="Resume updating items" severity="secondary" :disabled="busy" outlined @click="resume" />
            </div>

            <GeneralSettings v-show="tab === 'General'" :draft="draft" :schema="latest ?? schema" :board="board"
              :active="tab === 'General'" :board-apps="options?.board_apps" :counts="stateCounts" :counts-error="countsError"
              :draft-form="draftForm" :disabled="busy || checkingRemoval"
              :pack-title="schema.pack ? packTitle : undefined" :outdated="schema.outdated" :upgrade-reason="upgradeReason"
              :can-upgrade="upgradeAvailable && !dirty && !busy && !migrationPending" :can-install="!dirty && !busy && !migrationPending"
              :pack-error="packError" @upgrade="upgrade" @install="installing = true" @retry="loadPacks()"
              @reload-counts="loadCounts(boardId)" @dirty-change="metadataDirty = $event" @saved="load()" />

            <form :id="draftForm" ref="editor" @submit.prevent="openReview()">
              <fieldset :key="editorVersion" class="work-settings-fieldset" :disabled="busy || checkingRemoval" :inert="busy || checkingRemoval || undefined">
                <section v-if="visited.has('Items')" v-show="tab === 'Items'" class="work-ia-section">
                  <SectionSummary :facts="itemFacts" />
                  <Tabs :value="itemView" @update:value="itemView = $event as typeof itemView" class="work-ia-subnav">
                    <TabList aria-label="Item settings"><Tab v-for="name in itemViews" :key="name" :value="name" :pt="{ root: { id: tabId(name), 'aria-controls': panelId(name) } }">{{ name }}</Tab></TabList>
                  </Tabs>
                  <div v-if="openedItems.has('Item types')" v-show="itemView === 'Item types'"
                    role="tabpanel" :id="panelId('Item types')" :aria-labelledby="tabId('Item types')">
                    <TypesEditor :draft="draft" :guard-removal="guardRemoval" :issues="issues" @fields="showFields" />
                  </div>
                  <div v-if="openedItems.has('Fields')" v-show="itemView === 'Fields'"
                    role="tabpanel" :id="panelId('Fields')" :aria-labelledby="tabId('Fields')">
                    <FieldsEditor :board-id="boardId" :installed-types="options?.installed_types" :draft="draft"
                      :guard-removal="guardRemoval" :issues="issues" v-model:item-type="fieldType"
                      @validity="(key, valid) => validity('fields:' + key, valid)" />
                  </div>
                  <div v-if="openedItems.has('Links')" v-show="itemView === 'Links'"
                    role="tabpanel" :id="panelId('Links')" :aria-labelledby="tabId('Links')">
                    <RelationsEditor :draft="draft" :guard-removal="guardRemoval" />
                  </div>
                </section>

                <section v-if="visited.has('Workflow')" v-show="tab === 'Workflow'" class="work-ia-section">
                  <SectionSummary :facts="[
                    processes.length + (processes.length === 1 ? ' workflow' : ' workflows'),
                    processes.reduce((count, process) => count + process.states.length, 0) + ' states',
                    guardedTransitions + (guardedTransitions === 1 ? ' move has requirements' : ' moves have requirements'),
                    ...(typeof board?.open_count === 'number' ? [board.open_count + ' open items'] : []),
                  ]" />
                  <p v-if="countsError" class="work-muted">Item counts are unavailable. <Button label="Reload counts" text @click="loadCounts(boardId)" /></p>
                  <ProcessEditor :board-id="boardId" :draft="draft" :guard-removal="guardRemoval" :issues="issues" :counts="stateCounts" :count-types="schema.declaration.item_types" :guards="options?.guards"
                    @validity="(key, valid) => validity('process:' + key, valid)" />
                </section>

                <BoardAccessSettings v-if="visited.has('Access')" v-show="tab === 'Access'" :active="tab === 'Access'" :board-id="boardId"
                  :draft="draft" :grants-version="grantsVersion" @share="head?.share()" @validity="validity('visibility', $event)" />

                <section v-if="visited.has('Plugins')" v-show="tab === 'Plugins'" class="work-ia-section">
                  <SectionSummary :facts="[
                    enabledPlugins + (enabledPlugins === 1 ? ' plugin enabled in this setup' : ' plugins enabled in this setup'),
                    installedPlugins + ' installed',
                    ...((latest ?? schema).plugins?.some(plugin => plugin.lifecycle.state === 'failed' || Object.values(plugin.projections).some(p => p.parked || p.error)) ? ['Some plugins need attention'] : []),
                  ]" />
                  <PluginsEditor :board-id="boardId" :draft="draft" :schema="latest ?? schema" :options="options?.schema_options.plugins ?? []"
                    :filters="options?.filters" :configs="configs" :disabled="busy" @configured="invalidate(); load()" @refresh="load()" @review="openReview"
                    @validity="(key, valid) => validity('plugin:' + key, valid)" />
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
                  <ProcessMigration v-if="reviewOpen && !packRequest && (occupiedChanges.removed.length || occupiedChanges.renamed.length)"
                    :removed="occupiedChanges.removed" :renamed="occupiedChanges.renamed" :disabled="busy || checkingRemoval"
                    v-model:confirmed="confirmedRenames" @destination="setDestination" />
                  <PluginsEditor v-if="reviewOpen && packRequest && packPlugins.length" :board-id="boardId" :draft="{ plugins: packPlugins }" :schema="latest ?? schema"
                    :options="options?.schema_options.plugins.filter(plugin => packPlugins.some(selected => selected.use === plugin.plugin)) ?? []"
                    :configs="configs" :disabled="busy" activation-locked @validity="(key, valid) => validity('pack-plugin:' + key, valid)" />
                  <SchemaReview v-if="reviewOpen" :board-id="boardId" :original="schema.declaration" :declaration="reviewedDeclaration" :plan="plan"
                    :follows="follows" :config-count="Object.keys(configs).length" :pack-review="!!packPlan" :plugins="options?.schema_options.plugins">
                    <PackReview v-if="packPlan && packRequest" :plan="packPlan" :request="packRequest" :original="schema.declaration" :disabled="busy" @change="packReviewed = undefined; applyKey = ''" />
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

    <NativeDialog v-if="authorized" :visible="installing" label="Install pack" :busy="busy" @close="installing = false">
      <form class="work-dialog-box work-stack" @submit.prevent="install">
        <h2>Install a pack</h2>
        <p class="work-muted work-small">Packs give an empty board a starting setup. Review checks whether this board is eligible.</p>
        <label class="work-stack work-tight">Pack<Select v-model="installPack" aria-label="Pack to install" appendTo="self" optionLabel="title" optionValue="id" optionDisabled="disabled" :options="packs.map(p => ({ ...p, disabled: p.plugins.some(plugin => !plugin.installed) }))" /></label>
        <p v-if="!packs.length" class="work-muted">No available packs were found.</p>
        <footer class="work-dialog-actions"><Button label="Cancel" severity="secondary" outlined @click="installing = false" /><Button type="submit" label="Review pack" :disabled="!installPack || busy || dirty" /></footer>
      </form>
    </NativeDialog>
  </section>
</template>
