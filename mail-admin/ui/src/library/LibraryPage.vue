<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import { useMail } from '../context'
import { kindIcons, kindLabels, kindPlurals, plural, shortDate } from '../copy'
import { kindOf, type LibrarySection } from '../route'
import type { Resource, ResourceKind } from '../types'
import ResourceSource from './ResourceSource.vue'
import { matches, type StateFilter } from './useLibrary'

const props = defineProps<{ section: Exclude<LibrarySection, 'assets'> }>()
const { library, go, create } = useMail()
const { resources, loading, loaded, denied, error, load, find, usage } = library

const kind = computed(() => kindOf(props.section))
const state = ref<StateFilter>('all')
const query = ref('')
watch(() => props.section, () => { query.value = ''; state.value = 'all' })

const head = computed(() => {
  switch (kind.value) {
    case 'message': return { title: 'Messages', description: 'What recipients read. Each message follows its base template.' }
    case 'base': return { title: 'Base templates', description: 'The frame around messages. New messages start with the default.' }
    case 'part': return { title: 'Parts', description: 'Reusable pieces that templates include, such as the header, footer and buttons.' }
    default: return { title: 'All resources', description: 'Everything your email is made of. Messages follow the base templates and parts they use.' }
  }
})
const states: { label: string; value: StateFilter }[] = [
  { label: 'All', value: 'all' }, { label: 'Customized', value: 'customized' },
  { label: 'Created here', value: 'created' }, { label: 'Original', value: 'original' },
]
const order: Record<ResourceKind, number> = { base: 0, part: 1, message: 2 }
const inKind = computed(() => resources.value.filter(item => !kind.value || item.kind === kind.value))
const rows = computed(() => inKind.value
  .filter(item => state.value === 'all' || item.state === state.value)
  .filter(item => matches(item, query.value))
  .sort((a, b) => order[a.kind] - order[b.kind] || a.title.localeCompare(b.title)))
const countLabel = computed(() => {
  const noun = kind.value ? kindLabels[kind.value].toLowerCase() : 'resource'
  return plural(rows.value.length, noun)
})

function usedBy(item: Resource): string {
  if (item.kind !== 'base') return ''
  const users = usage.value.get(item.name)?.length ?? 0
  return users ? plural(users, 'message') : '—'
}
function baseTitle(item: Resource): string {
  return item.base ? find('base', item.base)?.title ?? item.base : ''
}
function inputs(item: Resource): string {
  const names = Object.keys(item.schema.properties)
  return names.length ? names.join(', ') : '—'
}
function open(item: Resource) {
  go({ name: 'resource', kind: item.kind, resource: item.name, section: 'content' })
}
const emptyKind = computed(() => loaded.value && !error.value && kind.value && !inKind.value.length)
</script>

<template>
  <SettingsSectionHead :title="head.title" :description="head.description">
    <template #actions>
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
    :hint="'Create a ' + kindLabels[kind].toLowerCase() + ' from an existing one, then change it to suit.'"
    :cta="'New ' + kindLabels[kind].toLowerCase()" cta-icon="tabler:plus" @cta="create({ kind })" />

  <template v-else-if="loaded">
    <div class="mail-toolbar">
      <SelectButton v-model="state" :options="states" option-label="label" option-value="value" :allow-empty="false" aria-label="Show resources" />
      <IconField class="mail-search">
        <InputIcon><Icon icon="tabler:search" aria-hidden="true" /></InputIcon>
        <InputText v-model="query" type="search" :aria-label="'Search ' + head.title.toLowerCase()" placeholder="Search names and content…" />
      </IconField>
      <span class="mail-count" role="status">{{ countLabel }}</span>
    </div>

    <p v-if="!rows.length" class="mail-muted mail-nomatch" role="status">Nothing matches. Try another name or a word from the template.</p>
    <DataTable v-else :value="rows" :data-key="(row: Resource) => row.kind + '/' + row.name" class="mail-table" row-hover
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
      <Column v-if="kind === 'part'" header="Inputs">
        <template #body="{ data }"><span class="mail-sub mail-inline">{{ inputs(data) }}</span></template>
      </Column>
      <Column header="Source" header-class="mail-col-source" body-class="mail-col-source">
        <template #body="{ data }"><ResourceSource :resource="data" /></template>
      </Column>
      <Column v-if="!kind || kind === 'base'" header="Used by" header-class="mail-col-used" body-class="mail-col-used">
        <template #body="{ data }">{{ usedBy(data) }}</template>
      </Column>
      <Column header="Updated" header-class="mail-col-updated" body-class="mail-col-updated">
        <template #body="{ data }"><span class="mail-muted">{{ data.state === 'original' ? '—' : shortDate(data.updated_at) }}</span></template>
      </Column>
    </DataTable>
  </template>
</template>
