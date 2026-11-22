<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { computed, ref, useId, watch } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { work } from '../../api'
import { fieldTitle } from '../../forms'
import type { BoardApp, BoardRow, Declaration, Schema } from '../../types'
import BoardIdentity from '../BoardIdentity.vue'

const props = defineProps<{
  draft: Declaration; schema: Schema; board?: BoardRow; boardApps?: BoardApp[]; active: boolean
  draftForm: string; disabled: boolean
  packTitle?: string; outdated?: boolean; upgradeReason?: string; canUpgrade: boolean; canInstall: boolean; packError?: string
}>()
const prefixId = useId()
defineEmits<{ upgrade: []; install: []; retry: []; saved: []; 'dirty-change': [dirty: boolean] }>()
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
    <section class="work-settings-list work-board-details" aria-label="Board details">
      <BoardIdentity :key="board?.board_id" :board="board" :board-apps="boardApps" detail
        @dirty-change="$emit('dirty-change', $event)" @saved="$emit('saved')">
        <div class="work-settings-row">
          <div class="work-row-main">
            <label class="work-row-title" :for="prefixId">Item key prefix</label>
            <p class="work-muted work-small">Shown on items, for example {{ draft.key_prefix || 'WORK' }}-1.</p>
          </div>
          <InputText :id="prefixId" v-model="draft.key_prefix" :form="draftForm" :disabled="disabled" aria-label="Item key prefix"
            required pattern="[A-Z][A-Z0-9]{1,9}" maxlength="10" />
        </div>
      </BoardIdentity>
    </section>

    <section class="work-board-summary work-row work-wrap work-small" aria-label="Board summary">
      <p class="work-muted">
        <span v-if="board?.open_count !== undefined && board.item_count !== undefined">{{ board.open_count }} open · {{ board.item_count }} total · </span>
        {{ packTitle || 'No pack installed' }}<span v-if="outdated"> · Update available</span>
      </p>
      <p v-if="packError" class="kx-err" role="alert">{{ packError }}</p>
      <Button v-if="packError" label="Reload packs" severity="secondary" outlined size="small" @click="$emit('retry')" />
      <Button v-if="!packTitle" label="Install pack" severity="secondary" outlined size="small" :disabled="!canInstall" @click="$emit('install')" />
      <Button v-else-if="outdated" label="Update pack" severity="secondary" outlined size="small" :disabled="!canUpgrade" :title="upgradeReason" @click="$emit('upgrade')" />
    </section>

    <Disclosure class="work-disclosure" label="Recent setup changes">
      <ul v-if="history.length" class="work-stack work-tight">
        <li v-for="(change, index) in history" :key="index">{{ change.join(' · ') }}</li>
      </ul>
      <p v-else class="work-muted">
        {{ historyError ? 'Recent changes are unavailable.' : previous ? 'No setup changes yet.' : 'Loading recent changes…' }}
      </p>
    </Disclosure>
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
