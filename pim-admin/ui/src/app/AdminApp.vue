<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import InteractiveSurface from '../shared/InteractiveSurface.vue'
import { computed, onUnmounted, ref, watch } from 'vue'
import { host, on } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { componentMetaEvent } from '@kickside/ui-kit/componentRealtime'
import { requestGeneration } from '../shared/requests'
import { ApiError } from '../shared/transport'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import { Icon } from '@iconify/vue'
import { pim } from '../api'
import type { CatalogRow } from '../types'
import { ensureTag } from './mount'
import CreateCatalog from './CreateCatalog.vue'

const ready = ref(false), creating = ref(false)
void ensureTag('kickside-pim-catalog-settings').then(value => { ready.value = value })
async function created(id: string) { await load(); await selectCatalog(id) }
const catalogs = ref<CatalogRow[]>([])
const selected = ref('')
const dirty = ref(false)
async function selectCatalog(id: string) {
  if (id === selected.value) return
  if (dirty.value && !await host.confirm({ header: 'Discard unsaved changes?', message: 'Switching catalogs will discard unsaved schema and plugin changes.', acceptLabel: 'Discard and switch', rejectLabel: 'Cancel' })) return
  dirty.value = false
  selected.value = id
}
function dirtyChanged(event: Event) { dirty.value = (event as CustomEvent<{ dirty: boolean }>).detail.dirty }

const search = ref('')
const query = computed(() => search.value.trim())
const loading = ref(true)
const error = ref<{ message: string; code?: string }>()
const next = ref<number>()
const reads = requestGeneration()
let searchTimer: ReturnType<typeof setTimeout> | undefined
async function load(after?: number) {
  if (after != null && loading.value) return
  clearTimeout(searchTimer)
  const generation = reads.begin()
  const text = query.value || undefined
  loading.value = true
  error.value = undefined
  try {
    const page = await pim.listCatalogs(after, text)
    if (!reads.current(generation)) return
    const admins = page.catalogs.filter(c => c.access.admin)
    catalogs.value = after == null ? admins : [...catalogs.value, ...admins]
    next.value = page.after
    if (!text && next.value == null && selected.value && !catalogs.value.some(c => c.catalog_id === selected.value)) selected.value = ''
  } catch (e) {
    if (!reads.current(generation)) return
    const code = e instanceof ApiError ? e.details?.code : undefined
    error.value = { message: e instanceof Error ? e.message : 'Could not load catalogs.', code: typeof code === 'string' ? code : undefined }
  }
  finally { if (reads.current(generation)) loading.value = false }
}
watch(query, () => {
  reads.begin()
  clearTimeout(searchTimer)
  catalogs.value = []
  next.value = undefined
  loading.value = true
  error.value = undefined
  searchTimer = setTimeout(() => { void load() }, 250)
})
const unsubscribe = on('component.meta.changed', (message: unknown) => {
  const event = componentMetaEvent(message)
  if (!event) return
  const catalog = catalogs.value.find(row => row.catalog_id === event.component_id)
  if (!catalog) return
  if (typeof event.meta.title === 'string') catalog.title = event.meta.title.trim() || 'Catalog'
  if (event.deleted.includes('title')) catalog.title = 'Catalog'
})
useHostVisibilityRefresh(load)
onUnmounted(() => { unsubscribe(); clearTimeout(searchTimer); reads.begin() })
</script>
<template>
  <div class="pim-system">
    <aside class="pim-rail" aria-label="Catalogs">
      <div class="pim-railhead"><h2>Catalogs <Tag severity="secondary" :value="String(catalogs.length)" /></h2>
        <Button text size="small" aria-label="Create catalog" @click="creating = true"><Icon icon="tabler:plus" /></Button>
      </div>
      <InputText v-model="search" class="pim-rail-search" type="search" aria-label="Find a catalog" placeholder="Find a catalog…" />
      <div class="pim-rail-list">
        <InteractiveSurface v-for="c in catalogs" :key="c.catalog_id" class="pim-rail-row" :class="{ active: selected === c.catalog_id }" :aria-pressed="selected === c.catalog_id" @click="selectCatalog(c.catalog_id)">
          <span>{{ c.title || 'Untitled catalog' }}</span>
        </InteractiveSurface>
      </div>
      <Message v-if="query && error" class="pim-rail-error" severity="error" role="alert">
        {{ error.message }} <code v-if="error.code">{{ error.code }}</code>
      </Message>
      <div v-else-if="query && loading" class="small muted" role="status">Searching catalogs…</div>
      <div v-else-if="query && catalogs.length === 0 && next == null" class="small muted" role="status">No matching catalogs.</div>
      <Button v-if="next != null" type="button" :disabled="loading" @click="load(next)" severity="secondary" outlined size="small"><Icon icon="tabler:chevron-right" aria-hidden="true" /> Load more catalogs</Button>
    </aside>
    <main class="pim-system-main">
      <Message v-if="error && !query" severity="error" role="alert">
        {{ error.message }} <code v-if="error.code">{{ error.code }}</code>
      </Message>
      <kickside-pim-catalog-settings v-if="selected && ready" :key="selected" :catalog-id="selected" embedded="true" @dirty-changed="dirtyChanged" />
      <div v-else-if="loading" class="kx-loading" role="status">Loading catalogs…</div>
      <div v-else class="kx-empty"><Icon icon="tabler:settings" class="kx-empty-ico" /><h3 class="kx-empty-title">Catalog settings</h3><p class="kx-empty-sub">Select a catalog to edit its schema, plugins and policy.</p></div>
    </main>
    <CreateCatalog :visible="creating" @close="creating = false" @created="created" />
  </div>
</template>
