<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import InteractiveSurface from '../shared/InteractiveSurface.vue'
import { computed, onUnmounted, ref } from 'vue'
import { host, on } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { requestGeneration } from '../shared/requests'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import AdminError from '../shared/AdminError.vue'
import { presentError } from '../shared/transport'
import { Icon } from '@iconify/vue'
import { pim } from '../api'
import type { CatalogRow } from '../types'
import { ensureTag } from './mount'
import CreateCatalog from './CreateCatalog.vue'

const ready = ref(false), creating = ref(false)
void ensureTag('kickside-pim-catalog-settings').then(value => { ready.value = value })
async function created(id: string) { await load(); await selectCatalog(id) }
const catalogs = ref<CatalogRow[]>()
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
const loading = ref(true)
const failed = ref<{ error: ReturnType<typeof presentError>; after?: number }>()
const next = ref<number>()
const reads = requestGeneration()
const visible = computed(() => (catalogs.value ?? []).filter(c => c.title.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())))
async function load(after?: number) {
  const generation = reads.begin()
  loading.value = true
  failed.value = undefined
  try {
    const page = await pim.listCatalogs(after)
    if (!reads.current(generation)) return
    const admins = page.catalogs.filter(c => c.access.admin)
    catalogs.value = after == null ? admins : [...(catalogs.value ?? []), ...admins]
    next.value = page.after
    if (next.value == null && selected.value && !catalogs.value.some(c => c.catalog_id === selected.value)) selected.value = ''
  } catch (e) { if (reads.current(generation)) failed.value = { error: presentError(e, 'Could not load catalogs.'), after } }
  finally { if (reads.current(generation)) loading.value = false }
}
const unsubscribe = on('component.meta.changed', () => { void load() })
useHostVisibilityRefresh(load)
onUnmounted(() => { unsubscribe(); reads.begin() })
</script>
<template>
  <div class="pim-system">
    <aside class="pim-rail" aria-label="Catalogs">
      <div class="pim-railhead"><h2>Catalogs <Tag v-if="catalogs" severity="secondary" :value="String(catalogs.length)" /></h2>
        <Button text size="small" aria-label="Create catalog" @click="creating = true"><Icon icon="tabler:plus" /></Button>
      </div>
      <InputText v-model="search" class="pim-rail-search" type="search" aria-label="Find a catalog" placeholder="Find a catalog…" />
      <div class="pim-rail-list">
        <InteractiveSurface v-for="c in visible" :key="c.catalog_id" class="pim-rail-row" :class="{ active: selected === c.catalog_id }" :aria-pressed="selected === c.catalog_id" @click="selectCatalog(c.catalog_id)">
          <span>{{ c.title || 'Untitled catalog' }}</span>
        </InteractiveSurface>
      </div>
      <Button v-if="next != null" type="button" :disabled="loading || !!failed" @click="load(next)" severity="secondary" outlined size="small"><Icon icon="tabler:chevron-right" aria-hidden="true" /> Load more catalogs</Button>
    </aside>
    <main class="pim-system-main">
      <AdminError v-if="failed" :error="failed.error" class="pim-list-error">
        <Button type="button" severity="secondary" outlined size="small" @click="load(failed.after)">Retry</Button>
      </AdminError>
      <kickside-pim-catalog-settings v-if="selected && ready" :key="selected" :catalog-id="selected" embedded="true" @dirty-changed="dirtyChanged" />
      <div v-else-if="loading" class="kx-loading" role="status">Loading catalogs…</div>
      <div v-else-if="!failed && catalogs" class="kx-empty"><Icon icon="tabler:settings" class="kx-empty-ico" /><h3 class="kx-empty-title">Catalog settings</h3><p class="kx-empty-sub">Select a catalog to edit its schema, plugins and policy.</p></div>
    </main>
    <CreateCatalog :visible="creating" @close="creating = false" @created="created" />
  </div>
</template>
