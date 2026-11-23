<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { computed, ref, shallowRef, watch, type Component } from 'vue'
import type { WorkClient } from '../work/client'
import { workFailure } from '../work/errors'
import type { FieldDescriptor } from '../presentation/context'
import { readItemDetail, type ItemDetail, type ItemSummary, type Json, type WorkOperation } from '../presentation/query'
import { fieldChanges } from './edit'

const props = defineProps<{
  board: string
  work: WorkClient
  item: ItemSummary
  fields: FieldDescriptor[]
  fieldControl: Component
  pending: boolean
  locked: boolean
  mutationError?: unknown
}>()
const emit = defineEmits<{ close: [], apply: [operations: WorkOperation[]], retry: [] }>()
const detail = shallowRef<ItemDetail>()
const draft = ref<Record<string, Json>>({})
const error = shallowRef<unknown>()
const loading = ref(false)
const attempt = ref(0)
const fields = computed(() => props.fields.filter(field => ['story_points', 'assignee'].includes(field.code)
  && detail.value?.access.write && detail.value.field_edit?.[field.code] === 'editable'))

watch(attempt, async (_, _previous, onCleanup) => {
  let current = true
  onCleanup(() => { current = false })
  error.value = undefined
  loading.value = true
  try {
    const response = await readItemDetail(props.work, props.board, props.item.id)
    if (current) detail.value = response
  } catch (failure) {
    if (current) error.value = failure
  } finally {
    if (current) loading.value = false
  }
}, { immediate: true })

function save() {
  if (!detail.value || props.locked) return
  const edit = fieldChanges(detail.value, draft.value, fields.value.map(field => field.code))
  if (edit) emit('apply', [edit])
  else emit('close')
}
</script>

<template>
  <Dialog :visible="true" modal :closable="!pending" :close-on-escape="!pending" class="kanban-row-dialog"
    :header="'Edit ' + item.key" @update:visible="value => { if (!value) emit('close') }">
    <p v-if="loading" class="kx-loading" role="status">Checking editable fields…</p>
    <div v-if="error" class="kx-notice error" role="alert">
      {{ workFailure(error).message }} <Button label="Retry" text size="small" @click="attempt++" />
    </div>
    <template v-else-if="!loading && detail">
      <div v-if="mutationError" class="kx-notice error kanban-view-notice" role="alert">
        <span>{{ workFailure(mutationError).message }}</span>
        <small v-if="workFailure(mutationError).code">{{ workFailure(mutationError).code }}</small>
        <Button v-if="locked" label="Retry write" text size="small" :disabled="pending" @click="emit('retry')" />
      </div>
      <form v-if="fields.length" class="kanban-row-form" @submit.prevent="save">
        <component v-for="field in fields" :is="fieldControl" :key="field.code" :field="field" :board="board" :work="work"
          :model-value="Object.hasOwn(draft, field.code) ? draft[field.code] : detail.item.values[field.code]"
          :disabled="pending || locked" @update:model-value="(value?: Json) => { draft[field.code] = value ?? null }" />
        <Button type="submit" label="Save" size="small" :loading="pending" :disabled="locked" />
      </form>
      <p v-else>Points and assignee are read-only.</p>
    </template>
  </Dialog>
</template>
