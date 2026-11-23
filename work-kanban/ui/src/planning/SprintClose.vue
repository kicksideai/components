<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import { computed, onScopeDispose, ref, shallowRef, useId, watch } from 'vue'
import { isAccessLoss } from '../work/client'
import { issueProblem, KeyedWrite, title } from '../issue/model'
import type { Issue } from '../issue/types'
import type { SprintPreview } from './model'
import { commitClosure, previewClosure } from './work'

const props = defineProps<{
  board: string; sprint: Issue; destinations: Issue[]; defaultDestination?: string; canWrite: boolean
}>()
const emit = defineEmits<{ close: []; changed: [sequence?: number]; denied: [problem: unknown] }>()
const id = useId()
const destination = ref(props.defaultDestination)
const preview = shallowRef<SprintPreview>()
const pending = ref(false)
const saving = ref(false)
const uncertain = ref(false)
const error = shallowRef<unknown>()
const begin = latestRequest()
const command = new KeyedWrite<Pick<SprintPreview, 'snapshot' | 'token'>, Awaited<ReturnType<typeof commitClosure>>>(commitClosure)
const destinations = computed(() => [{ id: undefined, title: 'Backlog' }, ...props.destinations.filter(sprint => sprint.id !== props.sprint.id)
  .map(sprint => ({ id: sprint.id, title: title(sprint) }))])
const destinationName = computed(() => destinations.value.find(row => row.id === destination.value)?.title ?? 'Backlog')
const count = computed(() => Array.isArray(preview.value?.snapshot.members) ? preview.value.snapshot.members.length : 0)
const problems: Record<string, string> = {
  planning_snapshot_stale: 'The board changed. Review a fresh preview before closing the sprint.',
  planning_sprint_inactive: 'This sprint is no longer active.',
  planning_rollover_ineligible: 'Choose a different planned or active sprint, or move the issues to Backlog.',
  planning_write_required: 'You need permission to edit this board to close the sprint.',
  planning_close_denied: 'Work refused the sprint closure. Check sprint and membership permissions.',
  planning_rollover_limit: 'Move unfinished issues out of the sprint to reduce the total below 200, then preview again.',
  planning_visibility_limit: 'Reduce the sprint membership and try previewing again.',
}
const failure = computed(() => {
  const problem = issueProblem(error.value)
  return { ...problem, message: problem.code && Object.hasOwn(problems, problem.code) ? problems[problem.code] : problem.message }
})

async function plan() {
  if (!props.canWrite || saving.value || uncertain.value) return
  const current = begin()
  preview.value = undefined
  error.value = undefined
  pending.value = true
  try {
    const result = await previewClosure(props.board, props.sprint.id, destination.value)
    if (current()) preview.value = result
  } catch (problem) {
    if (current()) error.value = problem
  } finally {
    if (current()) pending.value = false
  }
}

async function closeSprint() {
  if (!props.canWrite || !preview.value || saving.value) return
  saving.value = true
  error.value = undefined
  const { snapshot, token } = preview.value
  try {
    const result = await command.submit({ snapshot, token })
    emit('changed', result.seq ?? result.as_of)
  } catch (problem) {
    error.value = problem
    if (issueProblem(problem).code === 'planning_snapshot_stale') preview.value = undefined
    if (isAccessLoss(problem)) emit('denied', problem)
  } finally {
    saving.value = false
    uncertain.value = command.uncertain
  }
}

watch(destination, plan, { immediate: true })
onScopeDispose(begin)
function close(visible: boolean) {
  if (!visible && !saving.value && !uncertain.value) emit('close')
}
</script>

<template>
  <Dialog visible modal :draggable="false" :closable="!saving && !uncertain" :close-on-escape="!saving && !uncertain"
    :aria-labelledby="id + '-heading'" :style="{ width: 'min(28rem, calc(100% - 1.5rem))' }" @update:visible="close">
    <template #header>
      <span :id="id + '-heading'" class="kx-modal-head-title">Close sprint</span>
    </template>
    <div class="kanban-sprint-preview">
      <p><strong dir="auto">{{ title(sprint) }}</strong> will close. Completed and canceled issues stay in this sprint.</p>
      <label :for="id + '-destination'">Move unfinished issues to</label>
      <Select v-model="destination" :input-id="id + '-destination'" aria-label="Move unfinished issues to" :options="destinations" option-label="title" option-value="id"
        :disabled="saving || uncertain || !canWrite" fluid />
      <p v-if="pending" role="status">Preparing preview…</p>
      <p v-if="preview" class="kx-notice" role="status">
        {{ count }} unfinished {{ count === 1 ? 'issue' : 'issues' }} will move to {{ destinationName }}.
      </p>
      <div v-if="error" class="kx-notice error" role="alert">
        {{ failure.message }}
        <small v-if="failure.code">{{ failure.code }}</small>
        <Button v-if="!preview && canWrite" type="button" text size="small" label="Preview again" @click="plan" />
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" severity="secondary" outlined :disabled="saving || uncertain" @click="close(false)" />
      <Button :label="uncertain ? 'Retry closure' : 'Close sprint'" :disabled="!preview || !canWrite" :loading="saving" @click="closeSprint" />
    </template>
  </Dialog>
</template>
