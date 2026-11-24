<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import Button from 'primevue/button'
import Popover from 'primevue/popover'
import Tag from 'primevue/tag'
import { computed, nextTick, onMounted, onScopeDispose, ref, shallowReactive, shallowRef, useId, watch } from 'vue'
import type { MovePlan } from '../board/move'
import { issuePath, kanbanRoot } from '../route'
import { isAccessLoss } from '../work/client'
import type { BoardOption, BoardSchema } from '../work/types'
import FieldControl from './FieldControl.vue'
import IssueField from './IssueField.vue'
import IssueStreams from './IssueStreams.vue'
import { workRows } from './cursor'
import { compiledSchema, fieldChanges, isCommon, issueProblem, KeyedWrite, provided, stateLabel, statusChoices, title, transitionInputs, visibleFields } from './model'
import { usePrincipalNames } from './principals'
import type { Detail, Field, FieldValue, Issue, Operation, Transition, Values } from './types'
import { applyIssue, readIssue, type IssueWork } from './work'
import { usePanelSize } from './usePanelSize'

const props = defineProps<{
  board: BoardOption; schema: BoardSchema; work: IssueWork; issue?: string; sequence?: number;
  plannedMove?: MovePlan; fullPage?: boolean; copyStatus?: string;
}>()
const emit = defineEmits<{
  close: []; open: [id: string, board?: string]; copy: []; changed: [sequence?: number]; denied: [problem: unknown]; moveFinished: [];
  fullPage: [value: boolean];
}>()
const selected = shallowRef<Detail>()
const parent = shallowRef<Issue>()
const loading = ref(false)
const parentError = shallowRef<unknown>()
const readError = shallowRef<unknown>()
const writeError = shallowRef<unknown>()
const panel = ref<HTMLElement>()
const pane = usePanelSize(panel)
const statusPopover = ref<InstanceType<typeof Popover>>()
const statusOpen = ref(false)
const header = ref<HTMLElement>()
const id = useId()
const begin = latestRequest()
const beginParent = latestRequest()
const pendingWrites = shallowReactive(new Map<string, IssueWrite>())
const currentWrite = computed(() => props.issue ? pendingWrites.get(props.issue) : undefined)
const saving = computed(() => currentWrite.value?.saving ?? false)
const uncertain = computed(() => currentWrite.value?.command.uncertain ?? false)
const busy = computed(() => saving.value || uncertain.value)
const schema = computed(() => compiledSchema(props.schema))
const item = computed(() => selected.value?.item)
const kind = computed(() => schema.value.item_types.find(row => row.id === item.value?.type))
const process = computed(() => schema.value.processes.find(row => row.id === kind.value?.process))
const state = computed(() => process.value?.states.find(row => row.id === item.value?.state))
const fields = computed(() => item.value ? visibleFields(schema.value, item.value) : [])
const editable = computed(() => fields.value.filter(field => selected.value?.field_edit?.[field.code] === 'editable'))
const frequent = computed(() => fields.value.filter(field => isCommon(field) || state.value?.require?.includes(field.code)))
const optional = computed(() => fields.value.filter(field => !frequent.value.includes(field)))
const choices = computed(() => selected.value ? statusChoices(schema.value, selected.value) : [])
const summary = computed(() => fields.value.find(field => field.code === 'title') ?? fields.value.find(field => field.code === 'name'))
const description = computed(() => fields.value.find(field => field.code === 'description'))
const properties = computed(() => frequent.value.filter(field => !['title', 'name', 'description'].includes(field.code)))
const inline = shallowRef<{ field: string; item: Issue; value: FieldValue }>()
const writable = computed(() => props.board.access.write && selected.value?.access.write === true)
const person = usePrincipalNames(() => [
  ...fields.value.filter(row => row.type === 'principal' || row.form === 'principal').map(row => item.value?.values[row.code]),
  ...(item.value?.gate?.approvals.map(row => row.principal) ?? []),
])

interface Draft {
  fields: string[]
  values: Values
  operations: Operation[]
}
const form = ref<Draft>()
const formFields = computed(() => schema.value.fields.filter(field => form.value?.fields.includes(field.code)))
const resolvedMove = computed(() => props.plannedMove?.operations.find(op => op.op === 'transition'))
interface IssueWrite {
  command: KeyedWrite<{ ops: Operation[] }, Awaited<ReturnType<typeof applyIssue>>>
  saving: boolean
  success?: () => void
  problem?: unknown
}

function clear() {
  selected.value = undefined
  parent.value = undefined
  form.value = undefined
  inline.value = undefined
}

function deny(error: unknown) {
  if (!isAccessLoss(error)) return
  begin()
  beginParent()
  clear()
  loading.value = false
  readError.value = error
  emit('denied', error)
}

async function loadParent(parentId?: string) {
  const request = beginParent()
  parentError.value = undefined
  parent.value = undefined
  if (!parentId) return
  try {
    const result = await readIssue(props.work, props.board.board_id, parentId)
    if (request()) parent.value = result.item
  } catch (error) {
    if (request() && !isAccessLoss(error)) parentError.value = error
  }
}

async function load(minSeq?: number) {
  const issue = props.issue
  if (!issue) return
  const current = begin()
  loading.value = true
  readError.value = undefined
  try {
    const detail = await readIssue(props.work, props.board.board_id, issue, props.board.access.write, minSeq)
    if (!current()) return
    selected.value = detail
    if (!detail.access.write && !uncertain.value) {
      form.value = undefined
      inline.value = undefined
    }
    if (minSeq === undefined || parent.value?.id !== detail.item.parent) void loadParent(detail.item.parent)
    const planned = resolvedMove.value
    if (planned && planned.item === issue && !form.value) {
      const edge = workRows(detail.transitions).find(row => row.id === planned.transition && row.region === planned.region)
      if (edge) openTransition(edge, props.plannedMove?.operations.map(op => ({ ...op })))
      else writeError.value = new Error('This issue cannot move to that status. Review its workflow and try again.')
    }
  } catch (error) {
    if (current()) {
      readError.value = error
      deny(error)
    }
  } finally {
    if (current()) loading.value = false
  }
}

defineExpose({
  openedItem: item,
  refresh: (minSeq?: number) => {
    if (props.issue && !isAccessLoss(readError.value)) return load(minSeq)
  },
})

function trackIssue(issue?: string) {
  begin()
  beginParent()
  statusPopover.value?.hide()
  clear()
  loading.value = false
  parentError.value = undefined
  readError.value = undefined
  writeError.value = currentWrite.value?.problem
  if (issue) {
    void load()
    void nextTick(() => {
      header.value?.focus({ preventScroll: true })
      const scroll = header.value?.parentElement
      if (scroll) scroll.scrollTop = 0
    })
  }
}

onMounted(() => trackIssue(props.issue))
watch(() => props.issue, trackIssue)
watch(() => props.sequence, sequence => { if (props.issue) void load(sequence) })
watch(() => props.board.access.write, () => { if (props.issue) void load() })
watch(() => props.plannedMove, move => { if (move && props.issue === resolvedMove.value?.item) void load() })
onScopeDispose(() => { begin(); beginParent() })

function openRelated(id: string, board?: string) {
  if (!busy.value) emit('open', id, board)
}

function openParent(event: MouseEvent) {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  if (parent.value) openRelated(parent.value.id)
}

function close() {
  if (!busy.value) emit('close')
}

function retryIssue() {
  header.value?.focus({ preventScroll: true })
  void load()
}

function escape(event: KeyboardEvent) {
  if (event.defaultPrevented || busy.value) return
  if (statusOpen.value) statusPopover.value?.hide()
  else if (form.value) cancelMove()
  else close()
}

function edit(field: Field) {
  if (!item.value || !canEdit(field) || busy.value || form.value || inline.value) return
  inline.value = { field: field.code, item: item.value, value: item.value.values[field.code] }
  writeError.value = undefined
}

function canEdit(field: Field) {
  return writable.value && editable.value.includes(field)
}

function fieldBindings(field: Field) {
  const draft = inline.value
  const editing = draft?.field === field.code
  return {
    field,
    value: editing ? draft.value : item.value?.values[field.code],
    editable: canEdit(field),
    editing,
    saving: busy.value || !!form.value,
    board: props.board.board_id,
    work: props.work,
    name: person,
    onEdit: () => edit(field),
    onInput: updateInline,
    onCommit: commitInline,
    onCancel: cancelInline,
  }
}

function updateInline(value: FieldValue) {
  if (inline.value) inline.value = { ...inline.value, value }
}

function cancelInline() {
  inline.value = undefined
  writeError.value = undefined
}

async function commitInline() {
  const draft = inline.value
  if (!draft || busy.value) return
  if (!editable.value.some(field => field.code === draft.field)) return cancelInline()
  const changes = fieldChanges(draft.item.values, { [draft.field]: draft.value }, [draft.field])
  if (!changes.values && !changes.clear) return cancelInline()
  await submit([{ op: 'set', item: draft.item.id, expect_version: draft.item.version, ...changes }], cancelInline)
}

function cancelMove() {
  form.value = undefined
  writeError.value = undefined
  if (props.plannedMove) emit('moveFinished')
}

function statusReasonId(edge: Transition) {
  return [id, 'transition', edge.id, edge.region].filter(Boolean).join('-')
}

function pickTransition(edge: Transition) {
  statusPopover.value?.hide()
  openTransition(edge)
}

function approve() {
  statusPopover.value?.hide()
  if (item.value) void submit([{ op: 'approve', item: item.value.id, visit: item.value.visit, decision: 'approve' }])
}

async function submit(ops: Operation[], onSuccess?: () => void, retry = false): Promise<boolean> {
  if (!writable.value || saving.value || !item.value || (uncertain.value && !retry)) return false
  const target = item.value.id
  const board = props.board.board_id
  const action = currentWrite.value ?? {
    command: new KeyedWrite<{ ops: Operation[] }, Awaited<ReturnType<typeof applyIssue>>>(body => applyIssue(props.work, board, body)),
    saving: false,
    success: onSuccess,
  }
  pendingWrites.set(target, { ...action, saving: true })
  writeError.value = undefined
  let problem: unknown
  try {
    const result = await action.command.submit({ ops })
    const seq = result.seq ?? result.as_of
    if (props.issue === target) {
      action.success?.()
      await load(seq)
    }
    emit('changed', seq)
    return true
  } catch (error) {
    problem = error
    if (props.issue === target) {
      writeError.value = error
      if (isAccessLoss(error)) {
        // A failed write can also mean that only WRITE was revoked.
        if (selected.value) selected.value = { ...selected.value, access: { ...selected.value.access, write: false }, field_edit: undefined }
        await load()
      }
    }
    if (isAccessLoss(error)) emit('denied', error)
    return false
  } finally {
    if (action.command.uncertain) pendingWrites.set(target, { ...action, saving: false, problem })
    else pendingWrites.delete(target)
  }
}
async function retryWrite() {
  if (uncertain.value) await submit([], undefined, true)
}
function openTransition(edge: Transition, operations?: Operation[]) {
  if (!selected.value || !writable.value || busy.value) return
  const required = transitionInputs(schema.value, selected.value, edge.id, edge.region)
  if (!required) return
  const snapshot = selected.value.item
  const [transition, ...position] = operations ?? [{ op: 'transition', item: snapshot.id, transition: edge.id, region: edge.region }]
  const ops = [{ ...transition, expect_version: snapshot.version }, ...position]
  if (!required.length && !operations) void submit(ops)
  else form.value = { fields: required.map(field => field.code), values: {}, operations: ops }
}
function saveMove() {
  const draft = form.value
  if (!draft || !writable.value || busy.value || draft.fields.some(code => !provided(draft.values[code]))) return
  const [transition, ...position] = draft.operations
  void submit([{ ...transition, values: draft.values } as Operation, ...position], cancelMove)
}
</script>

<template>
  <aside v-if="issue" ref="panel" class="kanban-issue-drawer" :data-full-page="fullPage || undefined"
    :style="{ '--kanban-issue-width': pane.width.value + 'px' }" :role="fullPage ? 'region' : 'dialog'"
    :aria-labelledby="id + '-identity'" @keydown.esc="escape">
    <div v-if="!fullPage" class="kanban-issue-resizer" role="separator" tabindex="0"
      aria-label="Issue panel width" aria-orientation="vertical" :aria-controls="id + '-panel'"
      :aria-valuemin="pane.minimum" :aria-valuemax="pane.available.value" :aria-valuenow="pane.width.value"
      @pointerdown="pane.start" @pointermove="pane.move" @pointerup="pane.stop"
      @pointercancel="pane.stop" @lostpointercapture="pane.stop" @keydown="pane.key" />
    <div :id="id + '-panel'" class="kanban-issue-scroll">
      <header class="kanban-issue-header">
        <div :id="id + '-identity'" ref="header" class="kanban-issue-identity" tabindex="-1">
          <span>{{ item?.key ?? 'Issue details' }}</span>
        </div>
        <span v-if="kind" class="kanban-issue-kind">{{ kind.title }}</span>
        <div class="kanban-issue-header-actions">
          <Button v-if="item" type="button" severity="secondary" text rounded class="kanban-icon-action"
            :aria-label="fullPage ? 'Open side panel' : 'Open full page'"
            :title="fullPage ? 'Open side panel' : 'Open full page'" :disabled="busy"
            @click="emit('fullPage', !fullPage)">
            <template #icon><Icon :icon="fullPage ? 'tabler:layout-sidebar-right' : 'tabler:maximize'" aria-hidden="true" /></template>
          </Button>
          <Button v-if="item" type="button" severity="secondary" text rounded class="kanban-icon-action"
            aria-label="Copy link" :title="copyStatus || 'Copy link'" @click="emit('copy')">
            <template #icon><Icon :icon="copyStatus === 'Issue link copied.' ? 'tabler:check' : 'tabler:link'" aria-hidden="true" /></template>
          </Button>
          <Button type="button" severity="secondary" text rounded class="kanban-icon-action"
            aria-label="Close issue details" title="Close issue details" :disabled="busy" @click="close">
            <template #icon><Icon icon="tabler:x" aria-hidden="true" /></template>
          </Button>
        </div>
      </header>
      <div class="kanban-issue-body">
        <div v-if="readError" class="kx-notice error kanban-issue-problem" role="alert">
          {{ issueProblem(readError, schema).message }}
          <Button type="button" text size="small" label="Retry issue" @click="retryIssue" />
        </div>
        <p v-if="loading && !item" role="status">Loading issue…</p>
        <template v-if="item">
          <nav v-if="parent" class="kanban-issue-breadcrumb" aria-label="Parent issue">
            <Icon icon="tabler:hierarchy-2" aria-hidden="true" />
            <a class="kanban-issue-link" :href="kanbanRoot + '/' + issuePath(board.board_id, parent.id)"
              :aria-disabled="busy || undefined" @click="openParent">{{ parent.key }} · {{ title(parent) }}</a>
          </nav>
          <div v-else-if="parentError" role="status">
            Parent issue could not be loaded.
            <Button type="button" text size="small" label="Retry parent" @click="loadParent(item.parent)" />
          </div>
          <IssueField v-if="summary" v-bind="fieldBindings(summary)" :heading="title(item)" />
          <h2 v-else class="kanban-issue-title" dir="auto">{{ title(item) }}</h2>
          <div v-if="writeError" class="kx-notice error kanban-issue-problem" role="alert">
            {{ issueProblem(writeError, schema).message }}
            <small v-if="issueProblem(writeError, schema).code">{{ issueProblem(writeError, schema).code }}</small>
            <Button v-if="uncertain" type="button" text size="small" label="Retry change" :loading="saving" @click="retryWrite" />
          </div>
          <dl class="kanban-issue-fields">
            <div>
              <dt>Status</dt>
              <dd>
                <div v-if="writable && (choices.length || item.gate?.can_approve)" class="kanban-status-anchor">
                  <Button type="button" size="small" severity="secondary" class="kanban-status-trigger"
                    :label="stateLabel(schema, item)" :aria-label="'Status: ' + stateLabel(schema, item)"
                    aria-haspopup="dialog" :aria-expanded="statusOpen" :disabled="busy || !!form"
                    @click.stop="statusPopover?.toggle($event)">
                    <template #icon><Icon icon="tabler:chevron-down" aria-hidden="true" /></template>
                  </Button>
                  <Popover ref="statusPopover" append-to="self" aria-label="Change status"
                    :pt="{ root: { class: 'kanban-status-popover' } }" @show="statusOpen = true" @hide="statusOpen = false">
                    <ul class="kanban-status-options">
                      <li v-for="({ edge, reason }, index) in choices" :key="edge.id + ':' + (edge.region ?? '')">
                        <Button type="button" text severity="secondary" size="small" :label="edge.name" :autofocus="index === 0"
                          :aria-disabled="reason ? true : undefined" :aria-describedby="reason ? statusReasonId(edge) : undefined"
                          @click="!reason && pickTransition(edge)" />
                        <small v-if="reason" :id="statusReasonId(edge)">{{ reason }}</small>
                      </li>
                    </ul>
                    <Button v-if="item.gate?.can_approve" type="button" text severity="secondary" size="small"
                      label="Approve" @click="approve" />
                  </Popover>
                </div>
                <Tag v-else severity="secondary" class="kx-tag-sm" :value="stateLabel(schema, item)" />
                <small v-if="item.gate" class="kanban-issue-approval">
                  {{ item.gate.approvals.filter(row => row.decision === 'approve').length }} approvals<span
                    v-if="state?.release_when?.approvals"> of {{ state.release_when.approvals.min }} required</span>
                </small>
              </dd>
            </div>
            <div v-for="field in properties" :key="field.code">
              <dt>{{ field.title }}</dt>
              <dd><IssueField v-bind="fieldBindings(field)" /></dd>
            </div>
          </dl>
          <form v-if="form" class="kanban-issue-edit" @submit.prevent="saveMove">
            <h3>Confirm status change</h3>
            <FieldControl v-for="field in formFields" :key="field.code" v-model="form.values[field.code]"
              :field="field" :work="work" :board="board.board_id" required :disabled="busy || !writable" />
            <div class="kanban-issue-form-actions">
              <Button type="button" label="Cancel" severity="secondary" text size="small" :disabled="busy" @click="cancelMove" />
              <Button type="submit" label="Confirm move" size="small" :loading="saving" :disabled="!writable || uncertain" />
            </div>
          </form>
          <Disclosure v-if="optional.length" label="More fields">
            <dl class="kanban-issue-fields">
              <div v-for="field in optional" :key="field.code">
                <dt>{{ field.title }}</dt>
                <dd><IssueField v-bind="fieldBindings(field)" /></dd>
              </div>
            </dl>
          </Disclosure>
          <section v-if="description" class="kanban-issue-description" aria-label="Description">
            <h3>{{ description.title }}</h3>
            <IssueField v-bind="fieldBindings(description)" />
          </section>
          <IssueStreams :item="item" :schema="schema" :board="board.board_id" :work="work" :writable="writable"
            :locked="busy || !!form" :sequence="sequence" :submit="submit" @open="openRelated" @denied="deny" />
          <slot name="extensions" :issue="item" />
        </template>
      </div>
    </div>
  </aside>
</template>
