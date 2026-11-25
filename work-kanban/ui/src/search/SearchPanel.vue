<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { computed, ref, useId, watch } from 'vue'
import KanbanSkeleton from '../app/KanbanSkeleton.vue'
import IssueResults from '../issue/IssueResults.vue'
import { useCursorPage, workRows } from '../issue/cursor'
import { compiledSchema } from '../issue/model'
import type { ItemPage, QueryCursor } from '../issue/types'
import { completeItemPage, queryIssues } from '../issue/work'
import { type WorkClient } from '../work/client'
import type { BoardOption, BoardSchema } from '../work/types'
import { searchProblem, searchRequest, type SavedSearch } from './model'

const props = defineProps<{ work: Pick<WorkClient, 'boardRead' | 'runView'>; board: BoardOption; schema: BoardSchema; sequence?: number }>()
const emit = defineEmits<{ open: [id: string]; denied: [problem: unknown] }>()
const id = useId()
const text = ref('')
const selection = ref<string>()
const criteria = computed(() => searchRequest(text.value, selection.value))
const schema = computed(() => compiledSchema(props.schema))
const denied = (problem: unknown) => emit('denied', problem)
const views = useCursorPage(async (after?: string) => {
  const page = await props.work.boardRead<{ views: SavedSearch[]; after?: string }>(props.board.board_id, 'list_views', { limit: 20, after })
  return { rows: workRows(page.views).filter(row => row.view && ['kanban_list', 'kanban_table'].includes(row.view.type)), after: page.after }
}, row => row.view_id, denied)
const { rows: savedViews, error: viewsError, after: moreViews, pending: loadingViews } = views
const results = useCursorPage(async (after?: QueryCursor) => {
  const request = searchRequest(text.value, selection.value, after)
  if (!request) return { rows: [] }
  const body = { ...request.body, min_seq: props.sequence }
  return request.view
    ? completeItemPage(await props.work.runView<ItemPage>(request.view, body))
    : queryIssues(props.work, props.board.board_id, body)
}, row => row.id, denied)
const { rows, after, error, loaded, pending } = results

function setText(value?: string) {
  text.value = value ?? ''
  selection.value = undefined
}
function setView(value?: string) {
  selection.value = value
  if (value) text.value = ''
}
function refresh() {
  return Promise.all([views.load(), criteria.value ? results.load() : undefined])
}
defineExpose({ refresh })

watch(() => props.board.board_id, () => {
  text.value = ''
  selection.value = undefined
  views.reset()
  void views.load()
}, { immediate: true })
watch([() => text.value.trim(), selection, () => props.board.board_id], (_, __, onCleanup) => {
  results.reset()
  if (!criteria.value) return
  const timer = setTimeout(results.load, selection.value ? 0 : 220)
  onCleanup(() => clearTimeout(timer))
})
watch(() => props.sequence, () => { if (criteria.value && loaded.value) void results.load() })
</script>

<template>
  <section class="kanban-search" aria-label="Work issue search">
    <div class="kanban-search-controls">
      <div>
        <label :for="id + '-query'">Search issues</label>
        <InputText :id="id + '-query'" type="search" :model-value="text" placeholder="Key, title, or description" fluid @update:model-value="setText" />
      </div>
      <div>
        <label :for="id + '-views'">Saved search</label>
        <Select :input-id="id + '-views'" aria-label="Saved search" :model-value="selection" :options="savedViews" option-label="title" option-value="view_id"
          :aria-busy="loadingViews" placeholder="Choose a saved search" show-clear fluid @update:model-value="setView">
          <template #footer>
            <span v-if="viewsError" role="alert">Could not load saved searches.</span>
            <Button v-if="moreViews || viewsError" type="button" text size="small"
              :label="viewsError ? 'Retry' : 'Load more saved searches'" @click.stop="viewsError ? views.retry() : views.load(true)" />
          </template>
        </Select>
      </div>
    </div>
    <div v-if="criteria" class="kanban-search-results" :aria-busy="pending">
      <div v-if="error" class="kx-notice error" role="alert">
        {{ searchProblem(error).message }}
        <small v-if="searchProblem(error).code">{{ searchProblem(error).code }}</small>
        <Button type="button" label="Retry search" text size="small" @click="results.retry()" />
      </div>
      <KanbanSkeleton v-else-if="!loaded" variant="rows" label="Searching issues…" />
      <EmptyState v-else-if="!rows.length" icon="tabler:search" title="No matching issues." role="status" />
      <IssueResults v-if="rows.length" :rows="rows" :schema="schema" details="search" label="Search results" @open="emit('open', $event)" />
      <Button v-if="after" type="button" severity="secondary" outlined size="small" label="Load more"
        :loading="pending" @click="results.load(true)" />
    </div>
  </section>
</template>
