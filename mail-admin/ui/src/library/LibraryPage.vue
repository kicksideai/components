<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import Skeleton from 'primevue/skeleton'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { isDenied, library as libraryApi } from '../api'
import { useMail } from '../context'
import { describe, kindIcons, kindLabels, kindPlurals, plural, shortDate } from '../copy'
import { kindOf, type LibrarySection } from '../route'
import type { LibraryRow, ResourceKind } from '../types'
import PreviewGallery from './PreviewGallery.vue'
import ResourceSource from './ResourceSource.vue'
type StateFilter = 'all' | 'original' | 'customized' | 'created'

const props = defineProps<{ section: Exclude<LibrarySection, 'assets'> }>()
const { library, go, create } = useMail()

const kind = computed(() => kindOf(props.section))
// Messages show their base template's title.
watch(kind, value => { if (value === 'message') library.ensure('base') }, { immediate: true })
const state = ref<StateFilter>('all')
const query = ref(''), search = ref('')
let searchTimer: ReturnType<typeof setTimeout> | undefined
watch(query, value => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { search.value = value.trim() }, 250)
})
watch(() => props.section, () => { query.value = search.value = ''; state.value = 'all' })

const rows = shallowRef<LibraryRow[]>([])
const cursor = ref<string>()
const loading = ref(true), loaded = ref(false), more = ref(false), denied = ref(false)
const error = ref(''), moreError = ref(''), refreshError = ref('')
const begin = latestRequest()
const filter = () => ({ kind: kind.value, state: state.value === 'all' ? undefined : state.value, q: search.value || undefined })

// A new filter starts over; a refresh of the same filter keeps the rows shown until the new page arrives.
async function load(refresh = false) {
  const current = begin()
  loading.value = true
  try {
    const page = await libraryApi.page(filter())
    if (!current()) return
    rows.value = page.items
    cursor.value = page.next_cursor
    error.value = moreError.value = refreshError.value = ''
    denied.value = false
    loaded.value = true
  } catch (failure) {
    if (!current()) return
    denied.value = isDenied(failure)
    const message = denied.value ? '' : describe(failure, 'The mail library could not be loaded.')
    if (refresh && loaded.value && !denied.value) refreshError.value = message
    else error.value = message
  } finally {
    if (current()) loading.value = false
  }
}
async function loadMore() {
  if (!cursor.value || more.value) return
  const current = begin()
  more.value = true
  moreError.value = ''
  try {
    const page = await libraryApi.page({ ...filter(), cursor: cursor.value })
    if (!current()) return
    rows.value = [...rows.value, ...page.items]
    cursor.value = page.next_cursor
  } catch (failure) {
    if (current()) moreError.value = describe(failure, 'More resources could not be loaded.')
  } finally {
    more.value = false
  }
}
watch([kind, state, search], () => { void load() })
// Reads on mount, and again when the page is shown after being hidden.
useHostVisibilityRefresh(() => load(loaded.value))

// Rows come in the server's order, by reference. A change updates its row in place, or adds a new resource where
// that order puts it among the rows already shown; the search and state filters are the server's, so a row the
// filters may no longer match is kept until the next read.
const keyOf = (row: { kind: string; name: string }) => row.kind + '/' + row.name
library.onRow((change, row) => {
  const key = keyOf(change)
  const index = rows.value.findIndex(item => keyOf(item) === key)
  if (index >= 0) {
    const next = [...rows.value]
    if (row) next[index] = row
    else next.splice(index, 1)
    rows.value = next
    return
  }
  if (!row || (kind.value && row.kind !== kind.value) || state.value !== 'all' || search.value) return
  const last = rows.value[rows.value.length - 1]
  if (cursor.value && last && key > keyOf(last)) return
  const at = rows.value.findIndex(item => keyOf(item) > key)
  const next = [...rows.value]
  next.splice(at < 0 ? next.length : at, 0, row)
  rows.value = next
})

const head = computed(() => {
  switch (kind.value) {
    case 'message': return { title: 'Messages', description: 'What recipients read. Each message follows its base template.' }
    case 'base': return { title: 'Base templates', description: 'The frame around messages: the page, the header and the footer.' }
    case 'part': return { title: 'Parts', description: 'Reusable pieces that templates include, such as the header, footer and buttons.' }
    default: return { title: 'All resources', description: 'Everything your email is made of. Messages follow the base templates and parts they use.' }
  }
})
const states: { label: string; value: StateFilter }[] = [
  { label: 'All', value: 'all' }, { label: 'Customized', value: 'customized' },
  { label: 'Created here', value: 'created' }, { label: 'Original', value: 'original' },
]
const countLabel = computed(() => {
  const noun = kind.value ? kindLabels[kind.value].toLowerCase() : 'resource'
  return cursor.value ? `First ${plural(rows.value.length, noun)}` : plural(rows.value.length, noun)
})

function usedBy(item: LibraryRow): string {
  const usage = item.used_by
  if (item.kind === 'base' || item.kind === 'asset') return usage?.messages ? plural(usage.messages, 'message') : '—'
  if (item.kind === 'message') return usage?.recent_sources ? plural(usage.recent_sources, 'recent sender') : '—'
  return ''
}
function baseTitle(item: LibraryRow): string | undefined {
  return item.base ? library.title('base', item.base) : ''
}
function open(item: LibraryRow) {
  if (item.kind === 'asset') go({ name: 'library', section: 'assets', asset: item.name })
  else go({ name: 'resource', kind: item.kind, resource: item.name, section: 'content' })
}
const emptyKind = computed(() => loaded.value && !error.value && kind.value && !rows.value.length && state.value === 'all' && !search.value)
const gallery = ref(false)
</script>

<template>
  <SettingsSectionHead :title="head.title" :description="head.description">
    <template #actions>
      <Button v-if="!kind || kind === 'message'" label="Preview all messages" severity="secondary" outlined @click="gallery = true">
        <template #icon><Icon icon="tabler:eye" aria-hidden="true" /></template>
      </Button>
      <Button :label="kind ? 'New ' + kindLabels[kind].toLowerCase() : 'New'" @click="create({ kind })">
        <template #icon><Icon icon="tabler:plus" aria-hidden="true" /></template>
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
  <p v-else-if="loading && !loaded" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading mail library…</p>

  <EmptyState v-else-if="emptyKind && kind" :icon="kindIcons[kind]" :title="'No ' + kindPlurals[kind].toLowerCase() + ' yet'"
    :hint="'Create a ' + kindLabels[kind].toLowerCase() + ' from blank or from an existing one.'"
    :cta="'New ' + kindLabels[kind].toLowerCase()" cta-icon="tabler:plus" @cta="create({ kind })" />

  <template v-else-if="loaded">
    <div class="mail-toolbar">
      <SelectButton v-model="state" :options="states" option-label="label" option-value="value" :allow-empty="false" aria-label="Show resources" />
      <IconField class="mail-search">
        <InputIcon><Icon :icon="loading ? 'tabler:loader-2' : 'tabler:search'" :class="{ spin: loading }" aria-hidden="true" /></InputIcon>
        <InputText v-model="query" type="search" :aria-label="'Search ' + head.title.toLowerCase()" placeholder="Search names and content…" />
      </IconField>
      <span class="mail-count" role="status">{{ countLabel }}</span>
    </div>

    <p v-if="!rows.length" class="mail-muted mail-nomatch" role="status">Nothing matches. Try another name or a word from the template.</p>
    <DataTable v-else :value="rows" :data-key="(row: LibraryRow) => row.kind + '/' + row.name" class="mail-table" row-hover
      :pt="{ table: { 'aria-label': head.title } }" @row-click="event => open(event.data)">
      <Column header="Name" header-class="mail-col-name" body-class="mail-col-name">
        <template #body="{ data }">
          <Button link class="mail-name" :label="data.title" @click.stop="open(data)" />
          <span v-if="data.description" class="mail-sub">{{ data.description }}</span>
        </template>
      </Column>
      <Column v-if="!kind" header="Kind" header-class="mail-col-kind" body-class="mail-col-kind">
        <template #body="{ data }">
          <span class="mail-kind"><Icon :icon="kindIcons[data.kind as ResourceKind]" aria-hidden="true" />{{ kindLabels[data.kind as ResourceKind] }}</span>
        </template>
      </Column>
      <Column v-if="kind === 'message'" header="Base template">
        <template #body="{ data }">
          <Skeleton v-if="baseTitle(data) === undefined" width="8rem" height="1rem" />
          <template v-else>{{ baseTitle(data) }}</template>
        </template>
      </Column>
      <Column header="Source" header-class="mail-col-source" body-class="mail-col-source">
        <template #body="{ data }"><ResourceSource :resource="data" /></template>
      </Column>
      <Column v-if="kind !== 'part'" header="Used by" header-class="mail-col-used" body-class="mail-col-used">
        <template #body="{ data }">{{ usedBy(data) }}</template>
      </Column>
      <Column header="Updated" header-class="mail-col-updated" body-class="mail-col-updated">
        <template #body="{ data }"><span class="mail-muted">{{ data.state === 'original' ? '—' : shortDate(data.updated_at) }}</span></template>
      </Column>
    </DataTable>
    <div v-if="cursor" class="mail-more">
      <span v-if="moreError" class="kx-err inline" role="alert">{{ moreError }}</span>
      <Button :label="moreError ? 'Retry' : 'Show more'" severity="secondary" outlined :loading="more" @click="loadMore" />
    </div>
  </template>
  <PreviewGallery :visible="gallery" @close="gallery = false" />
</template>
