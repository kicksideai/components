<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import { computed, ref, shallowRef, useId, watch } from 'vue'
import FieldControl from '../issue/FieldControl.vue'
import { useCursorPage } from '../issue/cursor'
import { compiledSchema, issueProblem, KeyedWrite, provided, title } from '../issue/model'
import type { Operation, QueryCursor, Values } from '../issue/types'
import { applyIssue, queryIssues, type IssueWork } from '../issue/work'
import type { BoardOption, BoardSchema } from '../work/types'
import { createFields, initialIssueType, issueTypes, needsParent, parentQuery } from './model'

const props = defineProps<{ board: BoardOption; schema: BoardSchema; work: IssueWork }>()
const emit = defineEmits<{ created: [id: string, sequence?: number]; denied: [problem: unknown] }>()
const id = useId()
const open = defineModel<boolean>('visible', { required: true })
const busy = ref(false)
const uncertain = ref(false)
const typeId = ref<string>()
const parent = ref<string>()
const draft = ref<Values>({})
const error = shallowRef<unknown>()
const schema = computed(() => compiledSchema(props.schema))
const types = computed(() => issueTypes(schema.value))
const kind = computed(() => types.value.find(row => row.id === typeId.value))
const parentTypes = computed(() => kind.value?.parent_types.filter(row => typeof row === 'string') ?? [])
const fields = computed(() => createFields(schema.value, kind.value))
const primary = ['description', 'priority', 'assignee']
const common = computed(() => primary.flatMap(code => fields.value.optional.filter(field => field.code === code)))
const additional = computed(() => fields.value.optional.filter(field => !primary.includes(field.code)))
const parents = useCursorPage((after?: QueryCursor) =>
  kind.value ? queryIssues(props.work, props.board.board_id, parentQuery(kind.value, after)) : Promise.resolve({ rows: [] }),
item => item.id)
const { rows: parentRows, after: moreParents, pending: loadingParents, error: parentError } = parents
const parentOptions = computed(() => parentRows.value.map(row => ({ id: row.id, label: row.key + ' · ' + title(row) })))
const invalid = computed(() => !kind.value || needsParent(kind.value) && !parent.value
  || fields.value.required.some(field => !provided(draft.value[field.code])
    || typeof draft.value[field.code] === 'string' && !String(draft.value[field.code]).trim()))

const commands = new Map<string, KeyedWrite<{ ops: Operation[] }, Awaited<ReturnType<typeof applyIssue>>>>()
function command(board: string) {
  let write = commands.get(board)
  if (!write) {
    write = new KeyedWrite(body => applyIssue(props.work, board, body))
    commands.set(board, write)
  }
  return write
}

function chooseType(value?: string) {
  typeId.value = value
  const allowed = new Set([...fields.value.required, ...fields.value.optional].map(field => field.code))
  draft.value = Object.fromEntries(Object.entries(draft.value).filter(([code]) => allowed.has(code)))
  parent.value = undefined
  error.value = undefined
  parents.reset()
}
watch(() => props.board.board_id, () => {
  open.value = false
  typeId.value = undefined
  parent.value = undefined
  draft.value = {}
  error.value = undefined
  busy.value = false
  uncertain.value = command(props.board.board_id).uncertain
  parents.reset()
})
watch(() => props.board.access.write, writable => { if (!writable) open.value = false })

watch(open, visible => {
  if (visible && !kind.value) chooseType(initialIssueType(schema.value)?.id)
}, { immediate: true })

function dismiss(visible: boolean) {
  if (visible || (!busy.value && !uncertain.value)) open.value = visible
}

async function create() {
  if (busy.value || !props.board.access.write || !uncertain.value && invalid.value) return
  const board = props.board.board_id
  const values = Object.fromEntries(Object.entries(draft.value).filter(([, value]) => provided(value)))
  if (typeof values.title === 'string') values.title = values.title.trim()
  const write = command(board)
  busy.value = true
  error.value = undefined
  try {
    const result = await write.submit({
      ops: [{ op: 'create', type: typeId.value, values, ...(parent.value ? { parent: parent.value } : {}) }],
    })
    if (board !== props.board.board_id) return
    const item = result.outcomes[0]?.item
    open.value = false
    draft.value = {}
    chooseType(initialIssueType(schema.value)?.id)
    if (item) emit('created', item, result.seq ?? result.as_of)
  } catch (problem) {
    if (board !== props.board.board_id) return
    error.value = problem
    emit('denied', problem)
  } finally {
    if (board === props.board.board_id) {
      busy.value = false
      uncertain.value = write.uncertain
    }
  }
}
</script>

<template>
  <Dialog :visible="open" modal :draggable="false" :closable="!busy && !uncertain"
    :close-on-escape="!busy && !uncertain" :aria-labelledby="id + '-heading'" :style="{ width: 'min(35rem, calc(100% - 1.5rem))' }"
    @update:visible="dismiss">
    <template #header>
      <div class="kanban-modal-heading">
        <span class="kx-modal-head-icon"><Icon icon="tabler:plus" aria-hidden="true" /></span>
        <span class="kx-modal-head-text"><span class="kx-modal-head-title" :id="id + '-heading'">Create issue</span></span>
      </div>
    </template>
    <form :id="id + '-form'" class="issue-create-form" @submit.prevent="create">
      <div v-if="error" class="kx-notice error" role="alert">
        {{ issueProblem(error, schema).message }}
        <small v-if="issueProblem(error, schema).code">{{ issueProblem(error, schema).code }}</small>
      </div>
      <div class="issue-create-context">
        <div class="issue-create-field">
          <label :for="id + '-type'">Issue type</label>
          <Select class="issue-field-select" :input-id="id + '-type'" aria-label="Issue type" :model-value="typeId" :options="types"
            option-label="title" option-value="id" fluid :disabled="busy || uncertain" @update:model-value="chooseType" />
        </div>
        <div v-if="parentTypes.length" class="issue-create-field">
          <label :for="id + '-parent'">Parent <span v-if="needsParent(kind)" aria-hidden="true">*</span></label>
          <Select v-model="parent" class="issue-field-select" :input-id="id + '-parent'" aria-label="Parent" :aria-required="needsParent(kind)"
            :options="parentOptions" option-label="label" option-value="id" filter fluid placeholder="Select a parent"
            :show-clear="!needsParent(kind)" :disabled="busy || uncertain" :loading="loadingParents"
            empty-message="No eligible parents" @show="!parents.loaded.value && parents.load()">
            <template #footer>
              <span v-if="parentError" role="alert">Could not load eligible parents.</span>
              <Button v-if="moreParents || parentError" type="button" size="small" text
                :label="parentError ? 'Retry' : 'Load more parents'" @click.stop="parentError ? parents.retry() : parents.load(true)" />
            </template>
          </Select>
        </div>
      </div>
      <FieldControl v-for="field in fields.required" :key="field.code" v-model="draft[field.code]"
        :field="field" :board="board.board_id" :work="work" required :disabled="busy || uncertain" :autofocus="field.code === 'title'" />
      <div v-if="common.length" class="issue-create-support">
        <FieldControl v-for="field in common" :key="field.code" v-model="draft[field.code]"
          :class="{ 'issue-create-wide': field.code === 'description' }"
          :field="field" :board="board.board_id" :work="work" :disabled="busy || uncertain" />
      </div>
      <Disclosure v-if="additional.length" label="More fields">
        <div class="issue-create-form">
          <FieldControl v-for="field in additional" :key="field.code" v-model="draft[field.code]"
            :field="field" :board="board.board_id" :work="work" :disabled="busy || uncertain" />
        </div>
      </Disclosure>
    </form>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" outlined :disabled="busy || uncertain" @click="dismiss(false)" />
      <Button type="submit" :form="id + '-form'" :label="uncertain ? 'Retry creation' : 'Create issue'"
        :loading="busy" :disabled="!uncertain && invalid" />
    </template>
  </Dialog>
</template>
