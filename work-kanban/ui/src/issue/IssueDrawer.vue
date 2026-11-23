<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import Tag from 'primevue/tag'
import { computed, nextTick, onMounted, onScopeDispose, ref, shallowRef, useId, watch } from 'vue'
import type { MovePlan } from '../board/move'
import { isAccessLoss } from '../work/client'
import type { BoardOption, BoardSchema } from '../work/types'
import FieldControl from './FieldControl.vue'
import FieldDisplay from './FieldDisplay.vue'
import IssueStreams from './IssueStreams.vue'
import { workRows } from './cursor'
import { compiledSchema, fieldChanges, isCommon, issueProblem, KeyedWrite, provided, stateLabel, title, transitionInputs, visibleFields } from './model'
import { usePrincipalNames } from './principals'
import type { Detail, Issue, Operation, Transition, Values } from './types'
import { applyIssue, readIssue, type IssueWork } from './work'

const props = defineProps<{
  board: BoardOption; schema: BoardSchema; work: IssueWork; issue?: string; sequence?: number;
  plannedMove?: MovePlan;
  restoreFocus?: () => void;
}>()
const emit = defineEmits<{
  close: []; open: [id: string]; copy: []; changed: [sequence?: number]; denied: [problem: unknown]; moveFinished: [];
}>()
const selected = shallowRef<Detail>()
const parent = shallowRef<Issue>()
const loading = ref(false)
const parentError = shallowRef<unknown>()
const readError = shallowRef<unknown>()
const writeError = shallowRef<unknown>()
const saving = ref(false)
const uncertain = ref(false)
const visible = ref(false)
const focusAnchor = ref<HTMLElement>()
const header = ref<HTMLElement>()
const id = useId()
const begin = latestRequest()
const beginParent = latestRequest()
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
const edges = computed(() => workRows(selected.value?.transitions))
const mainEdges = computed(() => edges.value.slice(0, 3))
const extraEdges = computed(() => edges.value.slice(3))
const writable = computed(() => props.board.access.write && selected.value?.access.write === true)
const drawerParts = {
  root: { class: 'kanban-issue-drawer', style: { width: 'min(100%, 36rem)' }, 'aria-labelledby': id + '-identity' },
  header: { class: 'kanban-issue-header' },
  content: { class: 'kanban-issue-body' },
  footer: { class: 'kanban-issue-footer-surface' },
  transition: { enterActiveClass: 'kanban-issue-transition', leaveActiveClass: 'kanban-issue-transition' },
}
const person = usePrincipalNames(() => [
  ...fields.value.filter(row => row.type === 'principal' || row.form === 'principal').map(row => item.value?.values[row.code]),
  ...(item.value?.gate?.approvals.map(row => row.principal) ?? []),
])

interface Draft {
  mode: 'edit' | 'move'
  item: Issue
  fields: string[]
  values: Values
  operations?: Operation[]
}
const form = ref<Draft>()
const formFields = computed(() => schema.value.fields.filter(field => form.value?.fields.includes(field.code)))
const resolvedMove = computed(() => props.plannedMove?.operations.find(op => op.op === 'transition'))
const command = new KeyedWrite<{ ops: Operation[] }, Awaited<ReturnType<typeof applyIssue>>>((body) => applyIssue(props.work, props.board.board_id, body))
let action: { item: string; success?: () => void } | undefined
let opener: HTMLElement | undefined

function focusOrigin() {
  if (props.issue) return
  if (opener?.isConnected) opener.focus({ preventScroll: true })
  else props.restoreFocus?.()
  opener = undefined
}

function clear() {
  selected.value = undefined
  parent.value = undefined
  form.value = undefined
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
    if (!detail.access.write && !uncertain.value) form.value = undefined
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
  refresh: (minSeq?: number) => {
    if (props.issue && !isAccessLoss(readError.value)) return load(minSeq)
  },
})

function trackIssue(issue?: string, previous?: string) {
  begin()
  beginParent()
  clear()
  loading.value = false
  parentError.value = undefined
  readError.value = undefined
  if (!uncertain.value) writeError.value = undefined
  if (issue) {
    if (!previous) {
      const root = focusAnchor.value?.getRootNode()
      const active = root instanceof Document || root instanceof ShadowRoot ? root.activeElement : undefined
      opener = active instanceof HTMLElement && active !== document.body ? active : undefined
    }
    visible.value = true
    void load()
    if (previous) void nextTick(() => header.value?.focus({ preventScroll: true }))
  } else visible.value = false
}

onMounted(() => trackIssue(props.issue))
watch(() => props.issue, trackIssue)
watch(() => props.sequence, sequence => { if (props.issue) void load(sequence) })
watch(() => props.board.access.write, () => { if (props.issue) void load() })
watch(() => props.plannedMove, move => { if (move && props.issue === resolvedMove.value?.item) void load() })
onScopeDispose(() => { begin(); beginParent() })

function openRelated(id: string) {
  if (!busy.value) emit('open', id)
}

function dismiss(value: boolean) {
  if (!value && !busy.value) emit('close')
}
function edit() {
  if (!item.value || !writable.value) return
  form.value = { mode: 'edit', item: item.value, fields: editable.value.map(field => field.code), values: { ...item.value.values } }
}
function cancel() {
  form.value = undefined
  writeError.value = undefined
  if (props.plannedMove) emit('moveFinished')
}

async function submit(ops: Operation[], onSuccess?: () => void, retry = false): Promise<boolean> {
  if (!writable.value || saving.value || !item.value || (uncertain.value && !retry)) return false
  const target = item.value.id
  action ??= { item: target, success: onSuccess }
  saving.value = true
  writeError.value = undefined
  try {
    const result = await command.submit({ ops })
    const seq = result.seq ?? result.as_of
    if (props.issue === target) {
      action.success?.()
      await load(seq)
    }
    emit('changed', seq)
    return true
  } catch (error) {
    writeError.value = error
    if (isAccessLoss(error)) {
      // A failed write can also mean that only WRITE was revoked.
      if (selected.value) selected.value = { ...selected.value, access: { ...selected.value.access, write: false }, field_edit: undefined }
      await load()
      emit('denied', error)
    }
    return false
  } finally {
    saving.value = false
    uncertain.value = command.uncertain
    if (!uncertain.value) action = undefined
  }
}
async function retryWrite() {
  if (action?.item === item.value?.id) await submit([], undefined, true)
}
function openTransition(edge: Transition, operations?: Operation[]) {
  if (!selected.value || !writable.value || busy.value) return
  const required = transitionInputs(schema.value, selected.value, edge.id, edge.region)
  if (!required) return
  const snapshot = selected.value.item
  const [transition, ...position] = operations ?? [{ op: 'transition', item: snapshot.id, transition: edge.id, region: edge.region }]
  const ops = [{ ...transition, expect_version: snapshot.version }, ...position]
  if (!required.length && !operations) void submit(ops)
  else form.value = { mode: 'move', item: snapshot, fields: required.map(field => field.code), values: {}, operations: ops }
}
function save() {
  const draft = form.value
  if (!draft || !writable.value || busy.value) return
  if (draft.mode === 'move' && draft.operations) {
    if (draft.fields.some(code => !provided(draft.values[code]))) return
    const [transition, ...position] = draft.operations
    void submit([{ ...transition, values: draft.values } as Operation, ...position], cancel)
  } else {
    const allowed = editable.value.filter(field => draft.fields.includes(field.code)).map(field => field.code)
    const changes = fieldChanges(draft.item.values, draft.values, allowed)
    if (!changes.values && !changes.clear) cancel()
    else void submit([{ op: 'set', item: draft.item.id, expect_version: draft.item.version, ...changes }], cancel)
  }
}
</script>

<template>
  <span ref="focusAnchor" hidden />
  <Drawer :visible="visible" position="right" modal :dismissable="!busy" :close-on-escape="!busy"
    :show-close-icon="true"
    :close-button-props="{ 'aria-label': 'Close issue details', disabled: busy, severity: 'secondary', variant: 'text', rounded: true }"
    :pt="drawerParts"
    @update:visible="dismiss" @after-hide="focusOrigin">
    <template #header>
      <div :id="id + '-identity'" ref="header" class="kanban-issue-identity" tabindex="-1">
        <Icon icon="tabler:bookmark" aria-hidden="true" />
        <span>{{ item?.key ?? 'Issue details' }}</span>
        <small v-if="kind">{{ kind.title }}</small>
      </div>
      <Button v-if="item" type="button" severity="secondary" text rounded aria-label="Copy issue link" @click="emit('copy')">
        <template #icon><Icon icon="tabler:link" aria-hidden="true" /></template>
      </Button>
    </template>
    <div v-if="readError" class="kx-notice error kanban-issue-problem" role="alert">
      {{ issueProblem(readError, schema).message }}
      <Button type="button" text size="small" label="Retry issue" @click="load()" />
    </div>
    <p v-if="loading && !item" role="status">Loading issue…</p>
    <template v-if="item">
      <nav v-if="parent" aria-label="Parent issue">
        <Button type="button" text size="small" :label="parent.key + ' · ' + title(parent)" :disabled="busy" @click="emit('open', parent.id)" />
      </nav>
      <div v-else-if="parentError" role="status">
        Parent issue could not be loaded.
        <Button type="button" text size="small" label="Retry parent" @click="loadParent(item.parent)" />
      </div>
      <h2 class="kanban-issue-title" dir="auto">{{ title(item) }}</h2>
      <Tag severity="secondary" class="kx-tag-sm" :value="stateLabel(schema, item)" />
      <div v-if="writeError" class="kx-notice error kanban-issue-problem" role="alert">
        {{ issueProblem(writeError, schema).message }}
        <small v-if="issueProblem(writeError, schema).code">{{ issueProblem(writeError, schema).code }}</small>
        <Button v-if="uncertain" type="button" text size="small" label="Retry change" :loading="saving" @click="retryWrite" />
      </div>
      <section v-if="item.gate || writable && edges.length" class="kanban-issue-section" aria-label="Workflow">
        <h3>Workflow</h3>
        <p v-if="item.gate">
          {{ item.gate.approvals.filter(row => row.decision === 'approve').length }} approvals<span v-if="state?.release_when?.approvals"> of {{ state.release_when.approvals.min }} required</span>
        </p>
        <div v-if="writable" class="kanban-issue-actions">
          <Button v-if="item.gate?.can_approve" type="button" label="Approve" size="small" outlined :disabled="busy || !!form"
            @click="submit([{ op: 'approve', item: item.id, visit: item.visit, decision: 'approve' }])" />
          <Button v-for="edge in mainEdges" :key="edge.id + ':' + (edge.region ?? '')" type="button" size="small" outlined
            :label="edge.name" :disabled="busy || !!form" @click="openTransition(edge)" />
        </div>
        <Disclosure v-if="writable && extraEdges.length" label="More workflow actions">
          <div class="kanban-issue-actions">
            <Button v-for="edge in extraEdges" :key="edge.id + ':' + (edge.region ?? '')" type="button" size="small" outlined
              :label="edge.name" :disabled="busy || !!form" @click="openTransition(edge)" />
          </div>
        </Disclosure>
      </section>
      <section class="kanban-issue-section" aria-label="Issue fields">
        <div class="kanban-issue-section-head">
          <h3>{{ form?.mode === 'move' ? 'Confirm status change' : 'Issue fields' }}</h3>
          <Button v-if="writable && editable.length && !form" type="button" outlined size="small" label="Edit fields" :disabled="busy" @click="edit" />
        </div>
        <form v-if="form" :id="id + '-form'" class="kanban-issue-edit" @submit.prevent="save">
          <FieldControl v-for="field in formFields" :key="field.code" v-model="form.values[field.code]"
            :field="field" :work="work" :board="board.board_id" :required="form.mode === 'move'" :disabled="busy || !writable" />
        </form>
        <template v-else>
          <dl class="kanban-issue-fields">
            <div v-for="field in frequent.filter(field => !['title', 'name'].includes(field.code))" :key="field.code" :class="{ 'kanban-issue-long': field.code === 'description' }">
              <dt>{{ field.title }}</dt>
              <dd><FieldDisplay :field="field" :value="item.values[field.code]" :name="person" /></dd>
            </div>
          </dl>
          <Disclosure v-if="optional.length" label="More fields">
            <dl class="kanban-issue-fields">
              <div v-for="field in optional" :key="field.code">
                <dt>{{ field.title }}</dt>
                <dd><FieldDisplay :field="field" :value="item.values[field.code]" :name="person" /></dd>
              </div>
            </dl>
          </Disclosure>
        </template>
      </section>
      <IssueStreams :item="item" :schema="schema" :board="board.board_id" :work="work" :writable="writable"
        :locked="busy || !!form" :sequence="sequence" :submit="submit" @open="openRelated" @denied="deny" />
      <slot name="extensions" :issue="item" />
    </template>
    <template #footer v-if="form">
      <div class="kanban-issue-actions kanban-issue-footer">
        <Button type="button" label="Cancel" severity="secondary" outlined :disabled="busy" @click="cancel" />
        <Button type="submit" :form="id + '-form'" :label="form.mode === 'move' ? 'Confirm move' : 'Save'"
          :loading="saving" :disabled="!writable || uncertain" />
      </div>
    </template>
  </Drawer>
</template>
