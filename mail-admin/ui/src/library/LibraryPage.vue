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
import SelectButton from 'primevue/selectbutton'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { isDenied, library as libraryApi } from '../api'
import { useMail } from '../context'
import { describe, kindIcons, kindLabels, kindPlurals, plural, shortDate } from '../copy'
import { useLibraryChanges } from '../realtime'
import { kindOf, type LibrarySection } from '../route'
import type { LibraryRow, ResourceKind } from '../types'
import PreviewGallery from './PreviewGallery.vue'
import ResourceSource from './ResourceSource.vue'
import type { StateFilter } from './useLibrary'

const props = defineProps<{ section: Exclude<LibrarySection, 'assets'> }>()
const { library, go, create } = useMail()

const kind = computed(() => kindOf(props.section))
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
const error = ref('')
const begin = latestRequest()
const filter = () => ({ kind: kind.value, state: state.value === 'all' ? undefined : state.value, q: search.value || undefined })

async function load() {
  const current = begin()
  loading.value = true
  try {
    const page = await libraryApi.page(filter())
    if (!current()) return
    rows.value = page.items
    cursor.value = page.next_cursor
    error.value = ''
    denied.value = false
    loaded.value = true
  } catch (failure) {
    if (!current()) return
    denied.value = isDenied(failure)
    error.value = denied.value ? '' : describe(failure, 'The mail library could not be loaded.')
  } finally {
    if (current()) loading.value = false
  }
}
async function loadMore() {
  if (!cursor.value || more.value) return
  const current = begin()
  more.value = true
  try {
    const page = await libraryApi.page({ ...filter(), cursor: cursor.value })
    if (!current()) return
    rows.value = [...rows.value, ...page.items]
    cursor.value = page.next_cursor
  } catch (failure) {
    if (current()) error.value = describe(failure, 'More resources could not be loaded.')
  } finally {
    more.value = false
  }
}
watch([kind, state, search], () => { void load() })
useHostVisibilityRefresh(load)
useLibraryChanges(() => { void load() })

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
const order: Record<ResourceKind, number> = { base: 0, part: 1, message: 2, asset: 3 }
const sorted = computed(() => [...rows.value].sort((a, b) => order[a.kind] - order[b.kind] || a.title.localeCompare(b.title)))
const countLabel = computed(() => {
  const noun = kind.value ? kindLabels[kind.value].toLowerCase() : 'resource'
  return plural(rows.value.length, noun) + (cursor.value ? ' so far' : '')
})

function usedBy(item: LibraryRow): string {
  const usage = item.used_by
  if (item.kind === 'base' || item.kind === 'asset') return usage?.messages ? plural(usage.messages, 'message') : '—'
  if (item.kind === 'message') return usage?.recent_sources ? plural(usage.recent_sources, 'recent sender') : '—'
  return ''
}
function baseTitle(item: LibraryRow): string {
  return item.base ? library.find('base', item.base)?.title ?? item.base : ''
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
    <DataTable v-else :value="sorted" :data-key="(row: LibraryRow) => row.kind + '/' + row.name" class="mail-table" row-hover
      :pt="{ table: { 'aria-label': head.title } }" @row-click="event => open(event.data)">
      <Column header="Name" header-class="mail-col-name" body-class="mail-col-name">
        <template #body="{ data }">
          <button type="button" class="mail-name" @click.stop="open(data)">{{ data.title }}</button>
          <span v-if="data.description" class="mail-sub">{{ data.description }}</span>
        </template>
      </Column>
      <Column v-if="!kind" header="Kind" header-class="mail-col-kind" body-class="mail-col-kind">
        <template #body="{ data }">
          <span class="mail-kind"><Icon :icon="kindIcons[data.kind as ResourceKind]" aria-hidden="true" />{{ kindLabels[data.kind as ResourceKind] }}</span>
        </template>
      </Column>
      <Column v-if="kind === 'message'" header="Base template">
        <template #body="{ data }">{{ baseTitle(data) }}</template>
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
      <Button label="Show more" severity="secondary" outlined :loading="more" @click="loadMore" />
    </div>
  </template>
  <PreviewGallery :visible="gallery" @close="gallery = false" />
</template>
