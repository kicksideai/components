<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, useId, watch } from 'vue'
import { Icon } from '@iconify/vue'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import { useMail } from '../context'
import { describe, kindIcons } from '../copy'
import type { LibraryPage, LibraryRow, ResourceKind } from '../types'
import { LOOKUP_LIMIT } from './useLibrary'

// Chooses one library resource of a kind. Choices come from Mail one page at a time: the search runs on the server,
// and a narrower search reaches resources past the first page. `names` limits the choices to known references.
const props = defineProps<{
  kind: ResourceKind
  label: string
  placeholder?: string
  names?: string[]
  exclude?: string
  extra?: { value: string; label: string }[]
  disabled?: boolean
  showClear?: boolean
  fluid?: boolean
  inputId?: string
}>()
const model = defineModel<string | null | undefined>()
const { library } = useMail()

const query = ref('')
const results = shallowRef<LibraryRow[]>([])
const more = ref(false)
const loading = ref(false)
const error = ref('')
const searchId = useId()
const begin = latestRequest()

async function load() {
  const current = begin()
  loading.value = true
  try {
    const names = props.names?.slice(0, LOOKUP_LIMIT)
    const page: Pick<LibraryPage, 'items' | 'next_cursor'> = names && !names.length ? { items: [] } : await library.search(props.kind, query.value || undefined, names)
    if (!current()) return
    results.value = page.items
    more.value = !!page.next_cursor || (props.names?.length ?? 0) > LOOKUP_LIMIT
    error.value = ''
  } catch (failure) {
    if (current()) error.value = describe(failure, 'The choices could not be loaded.')
  } finally {
    if (current()) loading.value = false
  }
}

let timer: ReturnType<typeof setTimeout> | undefined
watch(query, () => { clearTimeout(timer); timer = setTimeout(() => { void load() }, 250) })
watch(() => [props.kind, props.names?.join(',')], () => { void load() })
onBeforeUnmount(() => clearTimeout(timer))
function opened() {
  if (!results.value.length && !loading.value) void load()
}

const options = computed(() => {
  const list = results.value
    .filter(row => row.name !== props.exclude)
    .map(row => ({ value: row.name, label: row.title }))
  const chosen = model.value
  if (chosen && !list.some(item => item.value === chosen) && !props.extra?.some(item => item.value === chosen)) {
    list.unshift({ value: chosen, label: library.title(props.kind, chosen) ?? chosen })
  }
  return [...(props.extra ?? []), ...list]
})
const chosenLabel = computed(() => {
  const chosen = model.value
  if (!chosen) return ''
  return props.extra?.find(item => item.value === chosen)?.label ?? library.title(props.kind, chosen)
})
</script>

<template>
  <Select v-model="model" :options="options" option-label="label" option-value="value" append-to="self" :input-id="inputId"
    :placeholder="placeholder" :aria-label="label" :disabled="disabled" :show-clear="showClear" :fluid="fluid" :loading="loading"
    :empty-message="error || (query ? 'Nothing matches.' : 'Nothing to choose yet.')" @show="opened">
    <template #header>
      <div class="mail-picker-search">
        <label class="mail-sr-only" :for="searchId">Search {{ label.toLowerCase() }}</label>
        <InputText :id="searchId" v-model="query" type="search" size="small" fluid :placeholder="'Search…'" @keydown.stop />
      </div>
    </template>
    <template #value="{ value, placeholder: shown }">
      <span v-if="value" class="mail-kind"><Icon :icon="kindIcons[kind]" aria-hidden="true" />{{ chosenLabel ?? '' }}</span>
      <span v-else>{{ shown }}</span>
    </template>
    <template #footer>
      <p v-if="more" class="mail-picker-more">Showing the first matches. Search to find others.</p>
    </template>
  </Select>
</template>
