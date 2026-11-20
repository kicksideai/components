<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { humanLabel, principalLabels } from '../shared/labels'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import AdminError from '../shared/AdminError.vue'
import { computed, onUnmounted, ref, useId, watch } from 'vue'
import { on } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { requestGeneration } from '../shared/requests'
import { pim } from '../api'
import type { HistoryEntry } from '../types'
import { attributeChange, humanize, when } from '../forms'
import { presentError } from '../shared/transport'

// The catalog's audit trail: every recorded change, newest first, paged.
const props = defineProps<{ catalogId: string; canResolveActors: boolean }>()

const entries = ref<HistoryEntry[]>([])
const people = ref<Record<string, string>>({})
const next = ref<string | undefined>()
const loading = ref(false)
const error = ref<ReturnType<typeof presentError>>()
const reads = requestGeneration()
const captionId = useId()
const rows = computed(() => entries.value.map(e => ({
  key: `${e.seq}:${e.n}`,
  at: e.at,
  date: when(e.at),
  actor: people.value[e.actor] ?? humanLabel(e.actor, 'Person'),
  source: e.source,
  product: subject(e),
  context: e.ctx,
  change: change(e),
})))

async function load(more = false) {
  const current = reads.begin()
  loading.value = true
  error.value = undefined
  try {
    const page = await pim.history(props.catalogId, { limit: 50, before: more ? next.value : undefined })
    if (!reads.current(current)) return
    entries.value = more ? [...entries.value, ...page.entries] : page.entries
    next.value = page.next
    if (props.canResolveActors) {
      try {
        const labels = await principalLabels(props.catalogId, page.entries.map(entry => entry.actor))
        if (reads.current(current)) people.value = { ...people.value, ...labels }
      } catch { /* The audit trail stays readable when a person no longer resolves. */ }
    }
  } catch (e) {
    if (!reads.current(current)) return
    error.value = presentError(e, 'Could not load the history.')
  } finally {
    if (reads.current(current)) loading.value = false
  }
}

function subject(e: HistoryEntry): string {
  if (e.sku) return e.sku
  if (e.subject.startsWith('p:')) return 'purged product'
  if (e.subject.startsWith('t:')) return e.subject.slice(2)
  if (e.subject.startsWith('r:')) return 'Release'
  return humanLabel(e.subject, 'Catalog')
}

type Term = { labels?: Record<string, string>; parent?: string; retired?: boolean }
type Created = { family?: string; level?: number }
type Released = { version?: number; channels?: string[] }
type Withdrawn = { channels?: string[] }

function change(e: HistoryEntry): string {
  if (e.attribute) {
    return attributeChange(humanize(e.attribute), e.before, e.after)
  }
  switch (e.kind) {
    case 'schema': return 'Schema generation ' + String((e.after as { generation?: number } | undefined)?.generation ?? '')
    case 'term': {
      const t = (e.after ?? {}) as Term
      const label = t.labels?.en ?? Object.values(t.labels ?? {})[0]
      if (t.retired) return 'Term retired'
      return label ? `Term labelled "${label}"` + (t.parent ? ` under ${t.parent}` : '') : 'Term changed'
    }
    case 'created': { const c = (e.after ?? {}) as Created; return `Created as ${humanize(c.family ?? 'product')}` + (c.level ? ` at level ${c.level}` : '') }
    case 'released': { const r = (e.after ?? {}) as Released; return `Released v${r.version ?? ''} to ${(r.channels ?? []).join(', ')}` }
    case 'withdrawn': { const w = (e.after ?? {}) as Withdrawn; return `Withdrawn from ${(w.channels ?? []).join(', ')}` }
    case 'status': return `Status ${String(e.before ?? '')} → ${String(e.after ?? '')}`
    case 'moved': return 'Moved under another parent'
    default: return humanize(e.kind)
  }
}

let stop = () => {}
watch(() => props.catalogId, () => {
  stop()
  reads.begin()
  entries.value = []
  people.value = {}
  next.value = undefined
  error.value = undefined
  stop = on(`component.${props.catalogId}`, () => { void load() })
}, { immediate: true })
watch(() => props.catalogId, () => { void load() })
useHostVisibilityRefresh(() => load())
onUnmounted(() => { stop(); reads.begin() })
</script>

<template>
  <section class="pim-history" aria-label="Catalog history">
    <AdminError v-if="error" :error="error"><Button severity="secondary" outlined size="small" @click="load()">Retry</Button></AdminError>
    <div v-if="loading" class="kx-loading" role="status">Loading history…</div>
    <div class="pim-table pim-responsive-table">
      <p :id="captionId" class="pim-history-caption muted small">Catalog changes, newest first</p>
      <template v-if="rows.length">
        <table class="pim-grid" :aria-labelledby="captionId">
          <thead><tr><th scope="col">When</th><th v-if="canResolveActors" scope="col">Who</th><th scope="col">What</th><th scope="col">Change</th></tr></thead>
          <tbody>
            <tr v-for="row in rows" :key="row.key">
              <td class="muted small"><time :datetime="row.at">{{ row.date }}</time></td>
              <td v-if="canResolveActors" class="small">{{ row.actor }}<span v-if="row.source" class="muted"> via {{ row.source }}</span></td>
              <td class="mono small">{{ row.product }}<span v-if="row.context" class="muted"> · {{ row.context }}</span></td>
              <td>{{ row.change }}<span v-if="!canResolveActors && row.source" class="muted small"> via {{ row.source }}</span></td>
            </tr>
          </tbody>
        </table>
        <ol role="list" class="pim-stacked-list" :aria-labelledby="captionId">
          <li v-for="row in rows" :key="row.key" class="pim-stacked-row">
            <div>{{ row.change }}</div>
            <div class="pim-stacked-meta muted small">
              <span v-if="canResolveActors"><span>{{ row.actor }}</span><template v-if="row.source"> via {{ row.source }}</template></span>
              <span v-else-if="row.source">Via {{ row.source }}</span>
              <time :datetime="row.at">{{ row.date }}</time>
              <span>{{ row.product }}<template v-if="row.context"> · {{ row.context }}</template></span>
            </div>
          </li>
        </ol>
      </template>
      <div v-else-if="!loading && !error" class="kx-empty">Nothing recorded yet.</div>
      <div class="pim-table-foot"><span>{{ rows.length }} change{{ rows.length === 1 ? '' : 's' }} shown</span><Button v-if="next" type="button" :disabled="loading" @click="load(true)" severity="secondary" outlined size="small"><Icon icon="tabler:adjustments" aria-hidden="true" /> Load older</Button></div>
    </div>
  </section>
</template>
