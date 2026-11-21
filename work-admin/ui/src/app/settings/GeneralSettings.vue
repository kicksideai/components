<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import { work } from '../../api'
import { fieldTitle } from '../../forms'
import type { BoardApp, BoardRow, Declaration, Schema, StateCounts } from '../../types'
import BoardIdentity from '../BoardIdentity.vue'
import SectionSummary from './SectionSummary.vue'
import { stateTitle } from './process'
import { pluginIssue } from './plugin-state'

const props = defineProps<{
  draft: Declaration; schema: Schema; board?: BoardRow; boardApps?: BoardApp[]; active: boolean
  counts?: StateCounts; countsError: boolean; draftForm: string; disabled: boolean
  packTitle?: string; outdated?: boolean; upgradeReason?: string; canUpgrade: boolean; canInstall: boolean; packError?: string
}>()
defineEmits<{ upgrade: []; install: []; retry: []; reloadCounts: []; saved: []; 'dirty-change': [dirty: boolean] }>()
const overrides = {
  comments_per_item: 'Comments per item', audit: 'Change history', audit_days: 'Change history retention',
  interval_days: 'Time-in-state history retention', trash_days: 'Trash retention', tombstone_days: 'Deletion record retention',
} as const
const currentOverrides = computed(() => (Object.keys(overrides) as (keyof typeof overrides)[])
  .filter(key => props.draft.policy?.[key] !== undefined))
function overrideValue(key: keyof typeof overrides) {
  const value = props.draft.policy?.[key]
  if (key === 'audit') return value === 'off' ? 'Off' : 'Track field changes'
  if (key === 'comments_per_item') return value
  if (value === 0) return key === 'audit_days' || key === 'interval_days' ? '365 days' : 'Clean up immediately'
  return value === 1 ? '1 day' : value + ' days'
}

const pluginRows = computed(() => (props.schema.plugins ?? []).filter(plugin => plugin.active)
  .map(plugin => ({ plugin, issue: pluginIssue(plugin, plugin) })))
const installedOnBoard = computed(() => pluginRows.value.filter(({ plugin }) => plugin.installed).length)
const itemTypes = computed(() => props.schema.declaration.item_types ?? [])
const typeRows = computed(() => itemTypes.value.map(type => ({
  id: type.id, title: type.title || 'Untitled item type',
  count: Object.values(props.counts?.[type.id] ?? {}).reduce((total, count) => total + count, 0),
})))
const stateRows = computed(() => (props.schema.declaration.processes ?? []).flatMap(process => {
  const types = itemTypes.value.filter(type => type.process === process.id)
  return process.states.map(state => ({
    id: process.id + '/' + state.id, title: stateTitle(state), process: process.name || 'Untitled workflow',
    count: types.reduce((total, type) => total + (props.counts?.[type.id]?.[state.id] ?? 0), 0),
  }))
}))
const facts = computed(() => [
  ...(typeof props.board?.item_count === 'number' ? [props.board.item_count + ' items'] : []),
  itemTypes.value.length + (itemTypes.value.length === 1 ? ' item type' : ' item types'),
  stateRows.value.length + (stateRows.value.length === 1 ? ' state' : ' states'),
  installedOnBoard.value + (installedOnBoard.value === 1 ? ' plugin on' : ' plugins on'),
])

// The schema reader exposes saved declarations in order. Compare those directly
// so the overview also includes changes saved from outside this screen.
const previous = ref<Schema[]>()
const historyError = ref(false)
let readFor = ''
watch([() => props.active, () => props.board?.board_id, () => props.schema.generation], async ([active, id, generation], _, onCleanup) => {
  if (!active || !id || readFor === id + '/' + generation) return
  previous.value = undefined
  historyError.value = false
  let current = true
  onCleanup(() => current = false)
  try {
    const older = await Promise.all(Array.from({ length: Math.min(3, Math.max(0, generation - 1)) },
      (_, index) => work.schema(id, generation - index - 1)))
    if (current) {
      previous.value = older
      readFor = id + '/' + generation
    }
  } catch { if (current) historyError.value = true }
}, { immediate: true })
function stable(value: unknown) {
  return JSON.stringify(value, (_, entry: unknown) => entry && typeof entry === 'object' && !Array.isArray(entry)
    ? Object.fromEntries(Object.entries(entry).sort(([left], [right]) => left.localeCompare(right))) : entry)
}
function changes(after: Schema, before?: Schema) {
  if (!before) return ['Initial board setup']
  const a = after.declaration, b = before.declaration
  const result: string[] = []
  const groups = [
    ['Fields', a.fields, b.fields], ['Item types', a.item_types, b.item_types],
    ['Workflow', a.processes, b.processes], ['Links', a.relation_types, b.relation_types],
    ['Plugins and filters', [a.plugins, a.scopes], [b.plugins, b.scopes]],
    ['Item visibility', a.visibility, b.visibility], ['Board rules', a.policy, b.policy],
    ['Starting pack', after.pack, before.pack], ['Item key prefix', after.key_prefix, before.key_prefix],
  ] as const
  if (stable(a.fields) !== stable(b.fields)) {
    const newFields = a.fields?.filter(field => !b.fields?.some(old => old.code === field.code)) ?? []
    if (newFields.length === 1) result.push('Added ' + fieldTitle(newFields[0]))
  }
  const labels = groups.filter(([, after, before]) => stable(after) !== stable(before))
    .map(([label]) => label).filter(label => label !== 'Fields' || !result.length)
  if (labels.length) result.push(labels.join(', ') + ' updated')
  return result.length ? result : ['Board setup updated']
}
const history = computed(() => {
  if (!previous.value || props.schema.generation < 1) return []
  const saved = [props.schema, ...previous.value]
  return saved.slice(0, 3).map((snapshot, index) => changes(snapshot, saved[index + 1]))
})
</script>

<template>
  <section class="work-ia-section work-ia-general">
    <SectionSummary :facts="facts" />
    <div class="work-overview">
      <div class="work-overview-main work-stack">
        <section class="work-settings-list" aria-label="Board at a glance">
          <header class="work-settings-row">
            <div class="work-row-main"><h3 class="work-row-title">Board at a glance</h3>
              <p v-if="board?.open_count !== undefined" class="work-small work-muted">{{ board.open_count }} open · {{ board.item_count }} total</p>
            </div>
          </header>
          <div v-if="counts" class="work-overview-breakdown">
            <section><h4 class="work-group-title">Items by type</h4>
              <dl class="work-overview-counts"><div v-for="row in typeRows" :key="row.id"><dt>{{ row.title }}</dt><dd>{{ row.count }}</dd></div></dl>
              <p v-if="!typeRows.length" class="work-muted work-small">No item types yet.</p>
            </section>
            <section><h4 class="work-group-title">Items by state</h4>
              <dl class="work-overview-counts"><div v-for="row in stateRows" :key="row.id">
                <dt>{{ row.title }} <small v-if="(schema.declaration.processes?.length ?? 0) > 1" class="work-muted">{{ row.process }}</small></dt><dd>{{ row.count }}</dd>
              </div></dl>
              <p v-if="!stateRows.length" class="work-muted work-small">No workflow states yet.</p>
            </section>
          </div>
          <div v-else class="work-settings-row">
            <p class="work-muted">{{ countsError ? 'Item breakdown is unavailable.' : 'Loading item breakdown…' }}</p>
            <Button v-if="countsError" label="Reload counts" severity="secondary" text @click="$emit('reloadCounts')" />
          </div>
        </section>
        <section class="work-settings-list" aria-label="Recent setup changes">
          <header class="work-settings-row"><h3 class="work-row-title">Recent setup changes</h3></header>
          <div v-for="(change, index) in history" :key="index" class="work-settings-row work-overview-change">
            <Icon icon="tabler:history" aria-hidden="true" /><span>{{ change.join(' · ') }}</span>
            <Tag v-if="index === 0 && history.length > 1" severity="secondary" value="Latest" />
          </div>
          <p v-if="!history.length" class="work-settings-row work-muted">
            {{ historyError ? 'Recent changes are unavailable.' : previous ? 'No setup changes yet.' : 'Loading recent changes…' }}
          </p>
        </section>
      </div>
      <div class="work-overview-details work-stack">
        <section class="work-settings-list" aria-label="Board details">
          <div class="work-settings-row work-overview-identity">
            <div class="work-stack work-tight">
              <h3 class="work-row-title">{{ board?.title || 'Board details' }}</h3>
              <p v-if="board?.description" class="work-muted">{{ board.description }}</p>
            </div>
            <BoardIdentity :key="board?.board_id" :board="board" :board-apps="boardApps" detail
              @dirty-change="$emit('dirty-change', $event)" @saved="$emit('saved')" />
          </div>
          <div class="work-settings-row">
            <div class="work-row-main">
              <h3 class="work-row-title">Item key prefix</h3>
              <p class="work-muted work-small">Shown on items, for example {{ draft.key_prefix || 'WORK' }}-1.</p>
            </div>
            <InputText v-model="draft.key_prefix" :form="draftForm" :disabled="disabled" aria-label="Item key prefix" required pattern="[A-Z][A-Z0-9]{1,9}" maxlength="10" />
          </div>
          <div class="work-settings-row">
            <div class="work-row-main">
              <h3 class="work-row-title">Starting setup</h3>
              <p class="work-muted work-small">{{ packTitle || 'Custom setup' }}<span v-if="outdated"> · Update available</span></p>
            </div>
            <p v-if="packError" class="kx-err" role="alert">{{ packError }}</p>
            <Button v-if="packError" label="Reload packs" severity="secondary" outlined @click="$emit('retry')" />
            <Button v-else-if="!packTitle" label="Install pack" severity="secondary" outlined :disabled="!canInstall" @click="$emit('install')" />
            <Button v-else-if="outdated" label="Update pack" severity="secondary" outlined :disabled="!canUpgrade" :title="upgradeReason" @click="$emit('upgrade')" />
          </div>
        </section>
        <section class="work-settings-list" aria-label="Board plugins">
          <header class="work-settings-row"><h3 class="work-row-title">Board plugins</h3></header>
          <div v-for="{ plugin, issue } in pluginRows" :key="plugin.plugin" class="work-settings-row work-overview-plugin">
            <Icon :icon="plugin.icon || 'tabler:puzzle'" aria-hidden="true" />
            <span class="work-spacer">{{ plugin.installed === false ? plugin.plugin : plugin.title || plugin.plugin }}</span>
            <Tag :severity="issue ? 'warn' : 'secondary'" :value="issue?.status ?? 'On'" />
          </div>
          <p v-if="!pluginRows.length" class="work-settings-row work-muted">No plugins enabled.</p>
        </section>
      </div>
    </div>
    <Disclosure v-if="currentOverrides.length" class="work-settings-card work-disclosure" label="Advanced · Existing board overrides">
      <p class="work-muted">Clear an override to use the Work application default.</p>
      <ul class="work-stack work-tight">
        <li v-for="key in currentOverrides" :key="key" class="work-row work-wrap">
          <span class="work-spacer">{{ overrides[key] }} · {{ overrideValue(key) }}</span>
          <Button :label="'Use default for ' + overrides[key].toLowerCase()" :disabled="disabled" size="small" text @click="delete draft.policy![key]" />
        </li>
      </ul>
    </Disclosure>
  </section>
</template>
