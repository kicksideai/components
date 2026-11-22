<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { computed, ref, watch } from 'vue'
import type { Declaration, Holder, PluginOption } from '../../types'
import { fieldTitle, humanize } from '../../forms'
import { usePrincipalNames } from '../../principals'
import { opaque } from '../../values'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import { classDescription, changeReason, type PluginConfigs, type SchemaPlan, type SchemaChange } from './model'
import { flows } from './flows'
import { stateTitle } from './process'
import { reviewCopy } from './reviewCopy'
import { configFields } from './config'

const props = defineProps<{ boardId?: string; original?: Declaration; declaration?: Declaration; plan?: SchemaPlan; generation?: number; follows: string[]; configCount: number; packReview?: boolean; plugins?: PluginOption[]; pluginConfigs?: PluginConfigs }>()
const empty: Declaration = {}
const original = computed(() => props.original ?? empty)
const draft = computed(() => props.declaration ?? empty)
const configSummary = computed(() => (props.plugins ?? []).flatMap(plugin => {
  if (!plugin.config_schema) return []
  const config = props.pluginConfigs?.[plugin.plugin]
  const enabling = !original.value.plugins?.some(entry => entry.use === plugin.plugin) &&
    draft.value.plugins?.some(entry => entry.use === plugin.plugin)
  if (!config && !enabling) return []
  const fields = configFields(plugin.config_schema).map(field => {
    const value = config?.[field.key]
    if (plugin.plugin === 'kickside.work.planning:plugin' && field.key === 'issue_types') {
      const labels = Array.isArray(value) ? value.map(id => draft.value.item_types?.find(type => type.id === id)?.title || humanize(id)) : []
      return { title: 'Plan these item types', value: labels.join(', ') || 'Uses default' }
    }
    if (value === undefined) return { title: field.title, value: 'Uses default' }
    if (field.schema.writeOnly || field.schema.format === 'password' || typeof value === 'object') return { title: field.title, value: 'Set' }
    return { title: field.title, value: typeof value === 'boolean' ? value ? 'On' : 'Off' : String(value) }
  })
  return fields.length ? [{ id: plugin.plugin, title: plugin.title || plugin.plugin, fields }] : []
}))
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
const rows = (changes: SchemaChange[]) => changes.map(change => {
  const copy = reviewCopy(change, original.value, draft.value, holderName)
  if (change.what === 'plugins') {
    const before = new Set(original.value.plugins?.map(plugin => plugin.use))
    const after = new Set(draft.value.plugins?.map(plugin => plugin.use))
    for (const plugin of props.plugins ?? []) {
      if (before.has(plugin.plugin) === after.has(plugin.plugin)) continue
      copy.details.push((after.has(plugin.plugin) ? 'Enable ' : 'Turn off ') + (plugin.title || 'an available plugin'))
    }
  }
  if (change.what === 'plugin.config') {
    const plugin = props.plugins?.find(option => option.plugin === change.code)
    return { change, title: (plugin?.title || 'Plugin') + ' settings changed', details: [] }
  }
  return { change, ...copy }
})
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
        <h3>Impact on this board</h3>
        <Tag class="kx-tag-sm" :severity="severity(plan.class)">{{ label(plan.class) }}</Tag>
      </header>
      <p class="work-muted">{{ classDescription[plan.class] || 'Review the changes below.' }}</p>
      <section v-if="configSummary.length" class="work-stack work-tight" aria-label="Plugin configuration">
        <h3>Plugin configuration</h3>
        <div v-for="plugin in configSummary" :key="plugin.id">
          <strong>{{ plugin.title }}</strong>
          <p v-for="field in plugin.fields" :key="field.title">{{ field.title }} · {{ field.value }}</p>
        </div>
      </section>
      <p v-if="migrationAdvice" class="work-notice">{{ migrationAdvice }}</p>
      <p v-else-if="follows.length" class="work-notice">Existing items in {{ follows.join(', ') }} will follow the updated workflow.</p>
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
        <Disclosure class="work-small" label="Technical details"><code>{{ row.change.what }}</code></Disclosure>
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
