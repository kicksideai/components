<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Declaration, Holder } from '../../types'
import { fieldTitle } from '../../forms'
import { usePrincipalNames } from '../../principals'
import { opaque } from '../../values'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import { classDescription, changeReason, type SchemaPlan, type SchemaChange } from './model'
import { flows } from './flows'
import { stateTitle } from './process'
import { reviewCopy } from './reviewCopy'

const props = defineProps<{ boardId?: string; original?: Declaration; declaration?: Declaration; plan?: SchemaPlan; generation: number; follows: string[]; configCount: number; packReview?: boolean }>()
const empty: Declaration = {}
const original = computed(() => props.original ?? empty)
const draft = computed(() => props.declaration ?? empty)
const bindings = computed(() => (draft.value.processes ?? []).flatMap(process => process.states.flatMap(state => {
  const reference = state.run?.flow_ref
  return reference ? [{ key: process.id + ':' + state.id, process: process.name || 'Untitled process', state: stateTitle(state), reference }] : []
})))
const flowTitles = ref(new Map<string, string>())
watch(bindings, async (rows, _, onCleanup) => {
  const titles = new Map<string, string>()
  flowTitles.value = titles
  let current = true
  onCleanup(() => current = false)
  await Promise.all([...new Set(rows.map(row => row.reference.id))].map(async id => {
    try {
      const title = (await flows.title(id))?.trim()
      if (current && title && !opaque(title)) flowTitles.value.set(id, title)
    } catch {
      if (current) flowTitles.value.set(id, 'Flow title unavailable')
    }
  }))
}, { immediate: true })
const principals = computed(() => [original.value, draft.value].flatMap(schema => (schema.visibility?.levels ?? []).flatMap(level => level.holders.flatMap(holder =>
  'group' in holder ? [{ kind: 'group', id: holder.group }] : 'user' in holder ? [{ kind: 'user', id: holder.user }] : []))))
const names = usePrincipalNames(() => props.boardId ?? '', principals)
function holderName(holder: Holder) {
  if ('user' in holder) return names.label({ kind: 'user', id: holder.user })
  if ('group' in holder) return names.label({ kind: 'group', id: holder.group })
  if ('field' in holder) {
    const field = draft.value.fields?.find(field => field.code === holder.field) ?? original.value.fields?.find(field => field.code === holder.field)
    return field ? fieldTitle(field) : 'People from a field'
  }
  return 'Service'
}
const rows = (changes: SchemaChange[]) => changes.map(change => ({ change, ...reviewCopy(change, original.value, draft.value, holderName) }))
const changes = computed(() => rows(props.plan?.changes.filter(change => change.class !== 'refused') ?? []))
const refusals = computed(() => rows(props.plan?.refused ?? []))
const migrationAdvice = computed(() => {
  const message = props.plan?.migration
  if (!message || !refusals.value.length) return message
  if (refusals.value.every(row => row.change.what === 'options.remove')) return 'Add a new field with the choices you want to keep. Copy existing values into it before removing the old field.'
  if (refusals.value.every(row => row.change.what === 'state.remove')) return 'Choose where existing items should move before removing their state.'
  return message
})
const impact: Record<string, [string, 'secondary' | 'warn' | 'success' | 'danger']> = {
  unchanged: ['No changes', 'secondary'], cosmetic: ['Labels or settings', 'secondary'],
  additive: ['New definitions', 'success'], semantic: ['Affects existing items', 'warn'],
  refused: ['Blocked', 'danger'], initial: ['First setup', 'secondary'],
}
const label = (kind: string) => impact[kind]?.[0] ?? 'Review needed'
const severity = (kind: string) => impact[kind]?.[1] ?? 'secondary'
function refusalReason(change: SchemaChange) {
  const { detail, ...item } = change
  return changeReason(change.what === 'invalid' || change.what.startsWith('views.') || change.what.startsWith('automation') ? change : item)
}
</script>
<template>
  <section v-if="plan" class="work-settings-card work-schema-plan work-stack" aria-label="Schema review">
    <p v-if="!plan.changes.length && !plan.refused.length && !configCount && !packReview">No changes to apply.</p>
    <template v-else>
      <header class="work-row work-wrap">
        <h2>Review</h2>
        <Tag class="kx-tag-sm" :severity="severity(plan.class)">{{ label(plan.class) }}</Tag>
        <span class="work-muted work-small">Generation {{ generation }} → {{ plan.generation }}</span>
      </header>
      <p class="work-muted">{{ classDescription[plan.class] || 'Review the changes below.' }}</p>
      <p v-if="migrationAdvice" class="work-notice">{{ migrationAdvice }}</p>
      <p v-else-if="follows.length" class="work-notice">Existing items in {{ follows.join(', ') }} will move to the updated process using the state choices above.</p>
      <section v-if="bindings.length" class="work-stack work-tight" aria-label="Reviewed Flow bindings">
        <h3>Flow bindings</h3>
        <p v-for="binding in bindings" :key="binding.key">{{ binding.process }} / {{ binding.state }} · <strong>{{ flowTitles.get(binding.reference.id) ?? 'Published Flow' }} · v{{ binding.reference.version }}</strong></p>
        <p class="work-muted work-small">New entries use these exact published versions. Before replacing a binding, stop new entries, let existing runs and deliveries finish, pause the old launcher, save, then resume entries.</p>
      </section>
      <slot />
      <h3 v-if="refusals.length">Blocked changes</h3>
      <Message v-for="(row, index) in refusals" :key="index" severity="error" role="alert">
        <strong>{{ row.title }}</strong>
        <p v-for="(detail, detailIndex) in row.details" :key="detailIndex">{{ detail }}</p>
        <p>{{ refusalReason(row.change) }}</p>
        <p class="work-small">Reason code <code>{{ row.change.what }}</code></p>
      </Message>
      <table v-if="changes.length" class="work-settings-table">
        <thead><tr><th scope="col">Change</th><th scope="col">Impact</th></tr></thead>
        <tbody>
          <tr v-for="(row, index) in changes" :key="index">
            <td>
              <strong>{{ row.title }}</strong>
              <p v-for="(detail, detailIndex) in row.details" :key="detailIndex">{{ detail }}</p>
              <p v-if="row.change.count">{{ row.change.count }} {{ row.change.count === 1 ? 'item' : 'items' }}</p>
            </td>
            <td><Tag class="kx-tag-sm" :severity="severity(row.change.class)">{{ label(row.change.class) }}</Tag></td>
          </tr>
        </tbody>
      </table>
    </template>
  </section>
</template>
