<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionContent from 'primevue/accordioncontent'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { computed, ref, shallowRef, watch } from 'vue'
import KanbanSkeleton from '../app/KanbanSkeleton.vue'
import IssueResults from '../issue/IssueResults.vue'
import { useCursorPage } from '../issue/cursor'
import { compiledSchema, issuePageLimit, issueProblem, title } from '../issue/model'
import type { Issue, QueryCursor } from '../issue/types'
import { queryIssues, type IssueWork } from '../issue/work'
import type { BoardOption, BoardSchema } from '../work/types'
import SprintClose from './SprintClose.vue'
import { sprintMemberQuery } from './model'

const props = defineProps<{ work: IssueWork; board: BoardOption; schema: BoardSchema; sequence?: number }>()
const emit = defineEmits<{ open: [id: string]; changed: [sequence?: number]; denied: [problem: unknown] }>()
const schema = computed(() => compiledSchema(props.schema))
const selected = ref<string>()
const closing = shallowRef<Issue>()
const denied = (problem: unknown) => emit('denied', problem)
const periodFilter = { field: 'type', op: 'eq', value: 'sprint' }
const states = ['active', 'planned', 'closed'] as const
type PeriodState = typeof states[number]
const stateLabel = { active: 'Active', planned: 'Upcoming', closed: 'Closed' }
const severity = { active: 'success', planned: 'info', closed: 'secondary' } as const
function periodPage(state: PeriodState) {
  return useCursorPage((after?: QueryCursor) => queryIssues(props.work, props.board.board_id, {
    where: { and: [periodFilter, { field: 'state', op: 'eq', value: state }] },
    order: [{ field: 'planning_start', dir: state === 'closed' ? 'desc' : 'asc' }],
    limit: issuePageLimit, after, min_seq: props.sequence,
  }), row => row.id, denied)
}
const active = periodPage('active')
const upcoming = periodPage('planned')
const closed = periodPage('closed')
const periods = { active, planned: upcoming, closed }

const destinations = computed(() => [...upcoming.rows.value, ...active.rows.value])

const members = useCursorPage((after?: QueryCursor) => queryIssues(props.work, props.board.board_id, {
  ...sprintMemberQuery(props.board.board_id, selected.value === 'backlog' ? undefined : selected.value, after),
  min_seq: props.sequence,
}), row => row.id, denied)
const { rows, after, error: memberError, pending: memberPending, loaded: memberLoaded } = members

interface SprintTotal { value?: { item: string }; count: number; measures?: { points?: number | string } }
const totals = useCursorPage(async (groupAfter?: string) => {
  const body = {
    where: { field: 'type', op: 'nin', value: ['sprint', 'milestone'] },
    group_by: 'current_sprint', group_limit: 50, group_after: groupAfter, limit: 1, min_seq: props.sequence,
    measures: schema.value.fields.some(field => field.code === 'story_points' && ['int', 'dec'].includes(field.form ?? ''))
      ? [{ id: 'points', op: 'sum', field: 'story_points' }] : undefined,
  }
  const data = await props.work.boardRead<{ groups?: SprintTotal[]; group_after?: string; group_limited?: boolean }>(
    props.board.board_id, 'query', body,
  )
  return { rows: data.groups ?? [], after: data.group_after }
}, row => row.value?.item ?? 'backlog', denied)
const loadingPeriods = computed(() => [active, upcoming, closed, totals].some(page => page.pending.value && !page.loaded.value))
const counts = computed(() => new Map(totals.rows.value.map(row => [row.value?.item ?? 'backlog', row])))

interface Panel { id: string; sprint?: Issue; state?: PeriodState; label: string; dates?: string }
const panels = computed<Panel[]>(() => [
  ...active.rows.value.map(row => panel(row, 'active')),
  ...upcoming.rows.value.map(row => panel(row, 'planned')),
  { id: 'backlog', label: 'Backlog' },
  ...closed.rows.value.map(row => panel(row, 'closed')),
])

function panel(sprint: Issue, state: PeriodState): Panel {
  const { planning_start: start, planning_end: end } = sprint.values
  return { id: sprint.id, sprint, state, label: title(sprint), dates: typeof start === 'string' && typeof end === 'string' ? date(start) + ' – ' + date(end) : undefined }
}
function date(value: string) {
  const when = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? value + 'T00:00:00' : value)
  return Number.isNaN(when.valueOf()) ? value : when.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
function select(value: string | string[] | null | undefined) {
  selected.value = typeof value === 'string' ? value : undefined
}
function total(id: string) {
  const row = counts.value.get(id)
  if (!row && (!totals.loaded.value || totals.after.value || totals.error.value)) return
  const count = row?.count ?? 0
  return count + (count === 1 ? ' issue' : ' issues') + (row?.measures?.points == null ? '' : ' · ' + row.measures.points + ' pts')
}

// Sprint totals size the placeholder like the rows Work returns.
function expectedRows(id: string) {
  const count = counts.value.get(id)?.count
  return count === undefined ? 5 : Math.max(1, Math.min(count, issuePageLimit) + Number(count > issuePageLimit))
}

async function load() {
  const board = props.board.board_id
  const remaining = Promise.all([upcoming.load(), closed.load(), totals.load()])
  await active.load()
  if (props.board.board_id !== board) return
  if (!selected.value) selected.value = active.rows.value[0]?.id ?? 'backlog'
  await remaining
}
function refresh() {
  return Promise.all([load(), selected.value ? members.load() : undefined])
}
defineExpose({ refresh })
function closedSprint(sequence?: number) {
  closing.value = undefined
  emit('changed', sequence)
  if (sequence === undefined) void refresh()
}

watch(() => props.board.board_id, () => {
  selected.value = undefined
  closing.value = undefined
  for (const page of [active, upcoming, closed, members, totals]) page.reset()
  void load()
}, { immediate: true })
watch(selected, value => {
  members.reset()
  if (value) void members.load()
})
watch(() => props.sequence, () => {
  void load()
  if (selected.value) void members.load()
})
</script>

<template>
  <section class="kanban-sprints" aria-label="Sprint planning">
    <KanbanSkeleton v-if="loadingPeriods" variant="rows" label="Loading sprints…" />
    <Accordion v-else :value="selected" @update:value="select">
      <AccordionPanel v-for="row in panels" :key="row.id" :value="row.id" :data-sprint="row.id">
        <AccordionHeader>
          <span class="kanban-sprint-summary">
            <span class="kanban-sprint-name"><strong dir="auto">{{ row.label }}</strong><small v-if="row.dates">{{ row.dates }}</small></span>
            <Tag v-if="row.state" :value="stateLabel[row.state]" :severity="severity[row.state]" class="kx-tag-sm" />
            <small v-if="total(row.id)" class="kanban-sprint-total">{{ total(row.id) }}</small>
          </span>
        </AccordionHeader>
        <AccordionContent>
          <div v-if="selected === row.id" class="kanban-sprint-issues">
            <Button v-if="row.state === 'active' && row.sprint && board.access.write" class="kanban-sprint-close" label="Close sprint"
              severity="secondary" outlined size="small" @click="closing = row.sprint" />
            <div v-if="memberError" class="kx-notice error" role="alert">
              {{ issueProblem(memberError).message }}
              <Button text type="button" size="small" label="Retry issues" @click="members.retry()" />
            </div>
            <KanbanSkeleton v-else-if="memberPending && !memberLoaded" variant="rows" label="Loading sprint issues…"
              :rows="expectedRows(row.id)" />
            <p v-else-if="memberLoaded && !rows.length" class="kx-empty-sub">No issues in this {{ row.sprint ? 'sprint' : 'backlog' }}.</p>
            <IssueResults v-if="rows.length" :rows="rows" :schema="schema" details="planning" label="Sprint issues" @open="emit('open', $event)" />
            <Button v-if="after" type="button" severity="secondary" outlined size="small" label="Load more issues"
              :loading="memberPending" @click="members.load(true)" />
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
    <div v-for="state in states" :key="state">
      <div v-if="periods[state].error.value" class="kx-notice error" role="alert">
        {{ issueProblem(periods[state].error.value).message }}
        <Button type="button" label="Retry sprints" size="small" text @click="periods[state].retry()" />
      </div>
      <Button v-if="periods[state].after.value" :label="'Load more ' + stateLabel[state].toLowerCase() + ' sprints'"
        type="button" text size="small" @click="periods[state].load(true)" />
    </div>
    <div v-if="totals.error.value" class="kx-notice error" role="alert">
      Could not load sprint totals.
      <Button type="button" label="Retry totals" size="small" text @click="totals.retry()" />
    </div>
    <Button v-if="totals.after.value" type="button" label="Load more totals" text size="small" @click="totals.load(true)" />
    <SprintClose v-if="closing" :board="board.board_id" :sprint="closing" :destinations="destinations"
      :default-destination="upcoming.rows.value[0]?.id" :can-write="board.access.write"
      @close="closing = undefined" @changed="closedSprint" @denied="denied" />
  </section>
</template>
