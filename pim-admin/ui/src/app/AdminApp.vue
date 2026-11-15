<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import InteractiveSurface from '../shared/InteractiveSurface.vue'
import { computed, onUnmounted, ref } from 'vue'
import { on } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { requestGeneration } from '../shared/requests'
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
async function created(id: string) { await load(); selected.value = id }
const catalogs = ref<CatalogRow[]>([])
const selected = ref('')
const search = ref('')
const loading = ref(true)
const error = ref('')
const next = ref<number>()
const reads = requestGeneration()
const visible = computed(() => catalogs.value.filter(c => c.title.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())))
async function load(after?: number) {
  const generation = reads.begin()
  loading.value = true
  error.value = ''
  try {
    const page = await pim.listCatalogs(after)
    if (!reads.current(generation)) return
    const admins = page.catalogs.filter(c => c.access.admin)
    catalogs.value = after == null ? admins : [...catalogs.value, ...admins]
    next.value = page.after
    if (next.value == null && selected.value && !catalogs.value.some(c => c.catalog_id === selected.value)) selected.value = ''
  } catch (e) { if (reads.current(generation)) error.value = e instanceof Error ? e.message : 'Could not load catalogs.' }
  finally { if (reads.current(generation)) loading.value = false }
}
const unsubscribe = on('component.meta.changed', () => { void load() })
useHostVisibilityRefresh(load)
onUnmounted(() => { unsubscribe(); reads.begin() })
</script>
<template>
  <div class="pim-system">
    <aside class="pim-rail" aria-label="Catalogs">
      <div class="pim-railhead"><h2>Catalogs <Tag severity="secondary" :value="String(catalogs.length)" /></h2>
        <Button text size="small" aria-label="Create catalog" @click="creating = true"><Icon icon="tabler:plus" /></Button>
      </div>
      <InputText v-model="search" class="pim-rail-search" type="search" aria-label="Find a catalog" placeholder="Find a catalog…" />
      <div class="pim-rail-list">
        <InteractiveSurface v-for="c in visible" :key="c.catalog_id" class="pim-rail-row" :class="{ active: selected === c.catalog_id }" :aria-pressed="selected === c.catalog_id" @click="selected = c.catalog_id">
          <span>{{ c.title || 'Untitled catalog' }}</span>
        </InteractiveSurface>
      </div>
      <Button v-if="next != null" type="button" :disabled="loading" @click="load(next)" severity="secondary" outlined size="small"><Icon icon="tabler:chevron-right" aria-hidden="true" /> Load more catalogs</Button>
    </aside>
    <main class="pim-system-main">
      <Message v-if="error" severity="error">{{ error }}</Message>
      <kickside-pim-catalog-settings v-if="selected && ready" :key="selected" :catalog-id="selected" embedded="true" />
      <div v-else-if="loading" class="kx-loading" role="status">Loading catalogs…</div>
      <div v-else class="kx-empty"><Icon icon="tabler:settings" class="kx-empty-ico" /><h3 class="kx-empty-title">Catalog settings</h3><p class="kx-empty-sub">Select a catalog to edit its schema, plugins and policy.</p></div>
    </main>
    <CreateCatalog :visible="creating" @close="creating = false" @created="created" />
  </div>
</template>
