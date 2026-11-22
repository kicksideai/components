<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, useId, watch } from 'vue'
import { host, on } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { componentMetaEvent } from '@kickside/ui-kit/componentRealtime'
import { requestGeneration } from '../shared/requests'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import ListRail from '@kickside/ui-kit/ListRail.vue'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import SettingsDirectoryActions from '@kickside/ui-kit/SettingsDirectoryActions.vue'
import AdminError from '../shared/AdminError.vue'
import { presentError } from '../shared/transport'
import { Icon } from '@iconify/vue'
import { pim } from '../api'
import type { CatalogRow } from '../types'
import { ensureTag } from './mount'
import CreateCatalog from './CreateCatalog.vue'

const props = defineProps<{ route?: string }>()
const emit = defineEmits<{ navigate: [route: string]; 'dirty-changed': [dirty: boolean] }>()
const ready = ref(false), loadingSettings = ref(false), creating = ref(false)
const confirming = ref(false), dirty = ref(false)
const focusBack = ref(false)
const selected = ref(''), currentCatalog = ref('')
const detail = ref<HTMLElement>(), list = ref<HTMLUListElement>(), searchField = ref<HTMLElement>()
let offerDirectOpen = true

async function loadSettings() {
  loadingSettings.value = true
  try { ready.value = await ensureTag('kickside-pim-catalog-settings') }
  finally { loadingSettings.value = false }
}
void loadSettings()
async function created(id: string) {
  creating.value = false
  selectCatalog(id)
  if (query.value) {
    search.value = ''
    await nextTick()
  }
  await load()
}
const detailRoute = ref('')
watch(dirty, value => emit('dirty-changed', value), { flush: 'sync' })

function navigate(route: string) {
  if (props.route !== undefined && route !== props.route) emit('navigate', route)
}
function navigateDetail(path: string) {
  const id = selected.value
  if (!id || props.route === undefined) return
  detailRoute.value = path
  navigate(path ? encodeURIComponent(id) + '/' + path : encodeURIComponent(id))
}
function selectCatalog(id: string, focus = true) {
  offerDirectOpen = false
  focusBack.value = focus
  if (focus) detail.value?.focus({ preventScroll: true })
  currentCatalog.value = selected.value = id
  navigateDetail('overview')
}
watch(() => props.route, route => {
  if (route === undefined) return
  const [segment, ...path] = route.split('/')
  let id: string
  try { id = decodeURIComponent(segment ?? '') } catch { return }
  if (id) offerDirectOpen = false
  if (id !== selected.value) {
    selected.value = id
    if (id) currentCatalog.value = id
    focusBack.value = false
    dirty.value = false
  }
  detailRoute.value = path.join('/')
}, { immediate: true })
async function mayLeave() {
  if (confirming.value) return false
  if (!dirty.value) return true
  confirming.value = true
  try {
    return await host.confirm({ header: 'Discard unsaved changes?', message: 'Leaving these settings will discard unsaved catalog and plugin changes.', acceptLabel: 'Discard changes', rejectLabel: 'Keep editing' })
  } finally { confirming.value = false }
}
async function backToCatalogs() {
  if (!await mayLeave()) return false
  dirty.value = false
  selected.value = ''
  detailRoute.value = ''
  navigate('')
  await nextTick()
  const target = list.value?.querySelector<HTMLButtonElement>('[aria-current="true"]') ?? searchField.value?.querySelector('input')
  target?.focus()
  return true
}
function createCatalog() {
  offerDirectOpen = false
  creating.value = true
}
const catalogMetaId = useId()
const catalogs = ref<CatalogRow[]>()
const directoryCount = ref<number>()
function dirtyChanged(event: Event) { dirty.value = (event as CustomEvent<{ dirty: boolean }>).detail.dirty }

const search = ref('')
const query = computed(() => search.value.trim())
const loading = ref(true)
const failed = ref<{ error: ReturnType<typeof presentError>; after?: number; text?: string }>()
const next = ref<number>()
const reads = requestGeneration()
let searchTimer: ReturnType<typeof setTimeout> | undefined
async function load(after?: number, text = query.value || undefined) {
  if (after != null && loading.value) return
  clearTimeout(searchTimer)
  const generation = reads.begin()
  loading.value = true
  failed.value = undefined
  try {
    const page = await pim.listCatalogs(after, text)
    if (!reads.current(generation)) return
    const admins = page.catalogs.filter(c => c.access.admin)
    catalogs.value = after == null ? admins : [...(catalogs.value ?? []), ...admins]
    next.value = page.after
    if (!text && next.value == null) {
      directoryCount.value = catalogs.value.length
      if (currentCatalog.value && !catalogs.value.some(c => c.catalog_id === currentCatalog.value)) {
        currentCatalog.value = selected.value = ''
        dirty.value = false
      }
      if (offerDirectOpen) {
        offerDirectOpen = false
        const only = catalogs.value[0]
        if (catalogs.value.length === 1 && only) selectCatalog(only.catalog_id, false)
      }
    }
  } catch (e) {
    if (reads.current(generation)) failed.value = { error: presentError(e, 'Could not load catalogs.'), after, text }
  }
  finally { if (reads.current(generation)) loading.value = false }
}
function retry() {
  const request = failed.value
  if (request) void load(request.after, request.text)
}
watch(query, () => {
  offerDirectOpen = false
  reads.begin()
  clearTimeout(searchTimer)
  catalogs.value = undefined
  next.value = undefined
  loading.value = true
  failed.value = undefined
  searchTimer = setTimeout(() => { void load() }, 250)
})
const unsubscribe = on('component.meta.changed', (message: unknown) => {
  const event = componentMetaEvent(message)
  if (!event) return
  const catalog = catalogs.value?.find(row => row.catalog_id === event.component_id)
  if (!catalog) return
  if (typeof event.meta.title === 'string') catalog.title = event.meta.title.trim() || 'Catalog'
  if (event.deleted.includes('title')) catalog.title = 'Catalog'
})
useHostVisibilityRefresh(load)
onUnmounted(() => { unsubscribe(); clearTimeout(searchTimer); reads.begin() })
</script>
<template>
  <main class="kx-shell kx-settings-shell pim-system" :class="{ 'pim-catalog-selected': selected && ready }">
    <ListRail v-if="!selected || !ready" settings class="pim-catalog-picker" title="Catalogs" :count="directoryCount ?? catalogs?.length">
      <template #actions>
        <SettingsDirectoryActions create-label="Create catalog" @create="createCatalog" @defaults="host.navigate('/system/settings')" />
      </template>
      <template #toolbar>
        <div ref="searchField" class="picker-search">
          <IconField>
            <InputIcon><Icon icon="tabler:search" aria-hidden="true" /></InputIcon>
            <InputText type="search" v-model="search" class="picker-search-input" aria-label="Search catalogs" placeholder="Search catalogs…" />
            <Button v-if="search" type="button" text severity="secondary" class="picker-search-clear" aria-label="Clear search" @click="search = ''; searchField?.querySelector('input')?.focus()">
              <template #icon><Icon icon="tabler:x" aria-hidden="true" /></template>
            </Button>
          </IconField>
        </div>
      </template>
      <AdminError v-if="failed" :error="failed.error">
        <Button label="Retry" type="button" severity="secondary" outlined size="small" @click="retry" />
      </AdminError>
      <p v-else-if="loading" class="kx-loading" role="status">{{ query ? 'Searching catalogs…' : 'Loading catalogs…' }}</p>
      <ul v-if="catalogs?.length" ref="list" class="picker-list">
        <li v-for="catalog in catalogs" :key="catalog.catalog_id">
          <button type="button" class="picker-row pim-catalog-row"
            :aria-describedby="catalogMetaId + '-' + catalog.catalog_id"
            :aria-current="currentCatalog === catalog.catalog_id ? 'true' : undefined" @click="selectCatalog(catalog.catalog_id)">
            <span class="picker-name">{{ catalog.title || 'Untitled catalog' }}</span>
            <span :id="catalogMetaId + '-' + catalog.catalog_id" class="picker-row-description">{{ typeof catalog.product_count === 'number' ? catalog.product_count + (catalog.product_count === 1 ? ' product' : ' products') : 'Product count unavailable' }}</span>
          </button>
        </li>
      </ul>
      <p v-if="!failed && !loading && query && !catalogs?.length && next == null" class="picker-message" role="status">No catalogs match. Try another name.</p>
      <Button v-if="next != null" label="Load more catalogs" type="button" :disabled="loading || !!failed" @click="load(next)" severity="secondary" outlined size="small" />
    </ListRail>
    <section ref="detail" class="pim-system-main" aria-label="Catalog settings detail" tabindex="-1">
      <kickside-pim-catalog-settings :route="props.route === undefined ? undefined : detailRoute"
        @navigate.stop="navigateDetail($event.detail.route)" v-if="selected && ready" :key="selected" :catalog-id="selected" embedded="true" :focus-back="String(focusBack)"
        @open-catalog-picker="backToCatalogs" @dirty-changed="dirtyChanged" />
      <p v-else-if="selected && loadingSettings" class="kx-loading" role="status">Loading catalog settings…</p>
      <p v-else-if="selected" class="kx-err" role="alert">Catalog settings are unavailable.<Button label="Back to catalogs" severity="secondary" text @click="backToCatalogs" /><Button label="Retry" severity="secondary" outlined @click="loadSettings" /></p>
      <EmptyState v-else-if="catalogs && !failed" icon="tabler:adjustments"
        :title="directoryCount === 0 ? 'No catalogs yet' : 'Choose a catalog'"
        :hint="directoryCount === 0 ? 'Create a catalog to set up families, fields, channels and access.' : 'Select a catalog to manage its families, fields, channels and access.'" />
    </section>
    <CreateCatalog :visible="creating" @close="creating = false" @created="created" />
  </main>
</template>
