<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { loadByTagName } from '@wippy-fe/proxy'
import { computed, ref, watch } from 'vue'
import SearchPanel from '../search/SearchPanel.vue'
import { planningPlugin, searchPlugin, type WorkClient } from '../work/client'
import type { BoardOption, BoardSchema, WorkExtension } from '../work/types'
import SprintsPanel from './SprintsPanel.vue'

const props = defineProps<{
  role: 'sprints' | 'search'
  board: BoardOption
  schema: BoardSchema
  work: WorkClient
  placement?: WorkExtension
  sequence?: number
}>()
const emit = defineEmits<{ open: [id: string]; changed: [sequence?: number]; denied: [problem: unknown] }>()
const registered = ref<string>()
const loading = ref(false)
const failed = ref(false)
const title = computed(() => props.role === 'sprints' ? 'Sprints' : 'Search')
const builtin = computed(() => props.schema.plugins?.some(row => row.active &&
  row.plugin === (props.role === 'sprints' ? planningPlugin : searchPlugin)))
const tag = computed(() => {
  const entry = props.placement
  if (entry?.slot === 'board_panel' && entry.target === 'board:' + props.role
    && props.board.access[entry.access] && props.schema.plugins?.some(row => row.active && row.plugin === entry.plugin)) return entry.tag
})

watch(tag, async (value, _, cleanup) => {
  let current = true
  cleanup(() => { current = false })
  registered.value = undefined
  failed.value = false
  loading.value = !!value
  if (!value) return
  try {
    await loadByTagName(value)
    if (current) registered.value = value
  } catch {
    if (current) failed.value = true
  } finally {
    if (current) loading.value = false
  }
}, { immediate: true })

function open(event: CustomEvent<{ itemId?: unknown }>) {
  if (typeof event.detail?.itemId === 'string' && event.detail.itemId) emit('open', event.detail.itemId)
}
function changed(event: CustomEvent<{ seq?: unknown }>) {
  const seq = event.detail?.seq
  emit('changed', typeof seq === 'number' && Number.isSafeInteger(seq) && seq >= 0 ? seq : undefined)
}
</script>

<template>
  <component v-if="registered && !failed" :is="registered" :board-id.attr="board.board_id"
    :can-write.attr="String(board.access.write)" @issue-open="open" @board-changed="changed" @error="failed = true" />
  <p v-else-if="loading" class="kanban-plugin-state" role="status">Loading {{ title }}…</p>
  <SprintsPanel v-else-if="builtin && role === 'sprints'" :board="board" :schema="schema" :work="work" :sequence="sequence"
    @open="emit('open', $event)" @changed="emit('changed', $event)" @denied="emit('denied', $event)" />
  <SearchPanel v-else-if="builtin" :board="board" :schema="schema" :work="work" :sequence="sequence"
    @open="emit('open', $event)" @denied="emit('denied', $event)" />
  <p v-else class="kanban-plugin-state" role="status">
    {{ title }} {{ failed ? 'is temporarily unavailable.' : 'is not enabled for this board.' }}
  </p>
</template>
