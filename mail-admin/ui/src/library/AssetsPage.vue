<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { isDenied, library as libraryApi } from '../api'
import { useMail } from '../context'
import { bytes, describe, plural, shortDate } from '../copy'
import { useMailInvalidation } from '../realtime'
import type { LibraryRow } from '../types'
import AssetDrawer from './AssetDrawer.vue'
import { SEARCH_LIMIT } from './useLibrary'
import AssetTile from './AssetTile.vue'
import ResourceSource from './ResourceSource.vue'

const props = defineProps<{ asset?: string }>()
const { go, upload } = useMail()

const query = ref(''), search = ref('')
let timer: ReturnType<typeof setTimeout> | undefined
watch(query, value => { clearTimeout(timer); timer = setTimeout(() => { search.value = value.trim() }, 250) })

const rows = shallowRef<LibraryRow[]>([])
const cursor = ref<string>()
const total = ref<number>()
const loading = ref(true), loaded = ref(false), denied = ref(false), more = ref(false)
const error = ref(''), refreshError = ref(''), moreError = ref('')
const begin = latestRequest()
// The first page of images; later pages follow on request.
async function load(refresh = false) {
  const current = begin()
  loading.value = true
  try {
    const page = await libraryApi.page({ kind: 'asset', q: search.value || undefined, limit: SEARCH_LIMIT })
    if (!current()) return
    rows.value = page.items
    cursor.value = page.next_cursor
    total.value = page.total
    error.value = refreshError.value = moreError.value = ''
    denied.value = false
    loaded.value = true
  } catch (failure) {
    if (!current()) return
    denied.value = isDenied(failure)
    const message = denied.value ? '' : describe(failure, 'Images could not be loaded.')
    if (refresh && loaded.value && !denied.value) refreshError.value = message
    else error.value = message
  } finally {
    if (current()) loading.value = false
  }
}
async function loadMore() {
  if (loading.value || !cursor.value || more.value) return
  const current = begin()
  more.value = true
  try {
    const page = await libraryApi.page({ kind: 'asset', q: search.value || undefined, limit: SEARCH_LIMIT, cursor: cursor.value })
    if (!current()) return
    const known = new Set(rows.value.map(row => row.name))
    rows.value = [...rows.value, ...page.items.filter(row => !known.has(row.name))]
    cursor.value = page.next_cursor
    moreError.value = ''
  } catch (failure) {
    if (current()) moreError.value = describe(failure, 'More images could not be loaded.')
  } finally {
    more.value = false
  }
}
watch(search, () => { void load() })
useHostVisibilityRefresh(() => load(loaded.value))
useMailInvalidation('mail.library', () => { void load(loaded.value) })

function usedBy(row: LibraryRow): string {
  const count = row.used_by?.messages
  return count ? plural(count, 'message') : '—'
}

const countLabel = computed(() => {
  const count = total.value ?? rows.value.length
  return rows.value.length < count ? `${rows.value.length} of ${plural(count, 'image')}` : plural(count, 'image')
})
function size(row: LibraryRow): string {
  const asset = row.asset
  if (!asset) return ''
  return bytes(asset.size)
}
function open(row: LibraryRow) { go({ name: 'library', section: 'assets', asset: row.name }) }
</script>

<template>
  <SettingsSectionHead title="Images" description="Images that templates show inline. Replace one and every template that uses it changes.">
    <template #actions>
      <Button label="Upload image" @click="upload()">
        <template #icon><Icon icon="tabler:upload" aria-hidden="true" /></template>
      </Button>
    </template>
  </SettingsSectionHead>

  <p v-if="denied" class="kx-notice warn mail-block" role="alert">
    <Icon icon="tabler:lock" aria-hidden="true" />Ask an administrator to grant you access to the mail library.
  </p>
  <div v-else-if="error" class="kx-err mail-error" role="alert">
    <span>{{ error }}</span>
    <Button label="Retry" severity="secondary" outlined size="small" @click="load()" />
  </div>
  <div v-if="refreshError" class="kx-err mail-error" role="alert">
    <span>{{ refreshError }} The list shows what was loaded before.</span>
    <Button label="Retry" severity="secondary" outlined size="small" @click="load(true)" />
  </div>
  <p v-else-if="loading && !loaded" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading images…</p>
  <EmptyState v-else-if="loaded && !rows.length && !search" icon="tabler:photo" title="No images yet"
    hint="Upload a logo or picture to show it in email. Replace it later and every template changes." cta="Upload image" cta-icon="tabler:upload" @cta="upload()" />
  <template v-else-if="loaded">
    <div class="mail-toolbar">
      <IconField class="mail-search">
        <InputIcon><Icon icon="tabler:search" aria-hidden="true" /></InputIcon>
        <InputText v-model="query" type="search" aria-label="Search images" placeholder="Search images…" />
      </IconField>
      <span class="mail-count" role="status">{{ countLabel }}</span>
    </div>
    <p v-if="!rows.length" class="mail-muted mail-nomatch" role="status">Nothing matches. Try another name.</p>
    <DataTable v-else :value="rows" data-key="name" class="mail-table" row-hover :pt="{ table: { 'aria-label': 'Images' } }" @row-click="event => open(event.data)">
      <Column header="Image" header-class="mail-col-thumb" body-class="mail-col-thumb">
        <template #body="{ data }"><AssetTile :name="data.name" :revision="data.revision" :asset="data.asset" /></template>
      </Column>
      <Column header="Name" header-class="mail-col-name" body-class="mail-col-name">
        <template #body="{ data }">
          <Button link class="mail-name" :label="data.title" @click.stop="open(data)" />
          <span class="mail-sub"><span class="mail-mono-block">{{ data.name }}</span><template v-if="data.asset?.filename"> · {{ data.asset.filename }}</template></span>
        </template>
      </Column>
      <Column header="Size" header-class="mail-col-updated" body-class="mail-col-updated">
        <template #body="{ data }"><span class="mail-muted">{{ size(data) }}</span></template>
      </Column>
      <Column header="Used by" header-class="mail-col-used" body-class="mail-col-used">
        <template #body="{ data }">
          <span>{{ usedBy(data) }}</span>
        </template>
      </Column>
      <Column header="Source" header-class="mail-col-source" body-class="mail-col-source">
        <template #body="{ data }"><ResourceSource :resource="data" /></template>
      </Column>
      <Column header="Updated" header-class="mail-col-updated" body-class="mail-col-updated">
        <template #body="{ data }"><span class="mail-muted">{{ data.state === 'original' ? '—' : shortDate(data.updated_at) }}</span></template>
      </Column>
    </DataTable>
    <div v-if="cursor" class="mail-more">
      <span v-if="moreError" class="kx-err inline" role="alert">{{ moreError }}</span>
      <Button :label="moreError ? 'Retry' : 'Show more'" severity="secondary" outlined :loading="more" :disabled="loading" @click="loadMore" />
    </div>
  </template>
  <AssetDrawer :name="props.asset" @close="go({ name: 'library', section: 'assets' })" />
</template>
