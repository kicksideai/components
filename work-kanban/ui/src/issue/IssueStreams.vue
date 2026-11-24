<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import SystemTabs from '@kickside/ui-kit/SystemTabs.vue'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import { computed, ref, useId, watch } from 'vue'
import { issuePath, kanbanRoot } from '../route'
import FieldDisplay from './FieldDisplay.vue'
import { useCursorPage } from './cursor'
import { issuePageLimit, issueProblem, stateLabel, title } from './model'
import { usePrincipalNames } from './principals'
import type { Comment, History, Issue, Link, Operation, QueryCursor, Schema } from './types'
import { queryIssues, type IssueWork } from './work'

const props = defineProps<{
  work: IssueWork; board: string; item: Issue; schema: Schema; writable: boolean; locked: boolean; sequence?: number;
  submit: (ops: Operation[], onSuccess?: () => void) => Promise<boolean>;
}>()
const emit = defineEmits<{ open: [id: string, board?: string]; denied: [problem: unknown] }>()
const id = useId()
const tabs = [{ value: 'activity', label: 'Activity' }, { value: 'relationships', label: 'Relationships' }, { value: 'history', label: 'History' }]
const selection = ref('activity')
const body = ref('')
const itemRef = () => ({ item: { id: props.item.id }, limit: issuePageLimit })
const deny = (error: unknown) => emit('denied', error)
const activity = useCursorPage(async (after?: string) => {
  const page = await props.work.boardRead<{ comments: Comment[]; after?: string }>(props.board, 'list_comments', { ...itemRef(), after })
  return { rows: page.comments, after: page.after }
}, row => row.id, deny)
const history = useCursorPage(async (before?: string) => {
  const page = await props.work.boardRead<{ entries: History[]; next?: string }>(props.board, 'list_history', { ...itemRef(), before })
  return { rows: page.entries, after: page.next }
}, row => row.seq + ':' + row.n, deny)
const children = useCursorPage((after?: QueryCursor) => queryIssues(props.work, props.board, {
  where: { field: 'parent', op: 'eq', value: props.item.id },
  order: [{ field: 'rank', dir: 'asc' }], limit: issuePageLimit, after,
}), row => row.id, deny)
const links = useCursorPage(async (after?: string) => {
  const page = await props.work.boardRead<{ links: Link[]; after?: string }>(props.board, 'list_links', { ...itemRef(), after })
  return { rows: page.links, after: page.after }
}, row => JSON.stringify([row.type, row.source, row.target]), deny)
const name = usePrincipalNames(() => [
  ...activity.rows.value.map(row => row.author),
  ...history.rows.value.map(row => row.actor),
])

const rels = computed(() => links.rows.value.map(link => {
  const outward = 'item' in link.source && link.source.board === props.board && link.source.item === props.item.id
  const type = props.schema.relation_types.find(row => row.id === link.type)
  return { label: (outward ? type?.outward : type?.inward) ?? link.type, peer: outward ? link.target : link.source }
}))

function show(section: string, reload = false) {
  selection.value = section
  const start = (page: { loaded: { value: boolean }; pending: { value: boolean }; load: () => Promise<void> }) => {
    if (reload || !page.loaded.value && !page.pending.value) void page.load()
  }
  if (section === 'activity') start(activity)
  if (section === 'history') start(history)
  if (section === 'relationships') {
    start(children)
    start(links)
  }
}

watch(() => props.item.id, () => {
  for (const page of [activity, history, children, links]) page.reset()
  body.value = ''
  show('activity')
}, { immediate: true })
watch(() => props.sequence, () => show(selection.value, true))

async function post() {
  const draft = body.value.trim()
  if (props.locked || !props.writable || !draft) return
  await props.submit([{ op: 'comment', item: props.item.id, body: draft }], () => {
    body.value = ''
    void activity.load()
  })
}

function follow(event: MouseEvent, item: string, board = props.board) {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  if (!props.locked) emit('open', item, board)
}

function date(at: string) {
  return new Date(at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
function historyLabel(entry: History) {
  if (entry.kind === 'state') return 'Changed status'
  if (entry.field) return 'Changed ' + (props.schema.fields.find(field => field.code === entry.field)?.title ?? entry.field)
  if (entry.kind === 'approval.recorded') return 'Recorded an approval'
  if (entry.kind === 'created') return 'Created the issue'
  return entry.kind.replace(/[._]/g, ' ')
}
</script>

<template>
  <section class="issue-streams" aria-label="Issue activity">
    <SystemTabs :value="selection" label="Issue sections" :items="tabs.map(tab => ({ ...tab, controls: id + '-' + tab.value }))"
      @update:value="show" />
    <div v-if="selection === 'activity'" :id="id + '-activity'" role="tabpanel" aria-label="Activity">
      <form v-if="writable" class="issue-comment" @submit.prevent="post">
        <Textarea v-model="body" aria-label="Add a comment" placeholder="Add a comment…" :disabled="locked" rows="1" fluid />
        <Button v-if="body.trim()" type="submit" label="Post" aria-label="Post comment" size="small" :disabled="locked" />
      </form>
      <p v-if="activity.pending.value && !activity.loaded.value" role="status">Loading comments…</p>
      <div v-if="activity.error.value" role="alert">{{ issueProblem(activity.error.value).message }}
        <Button text size="small" label="Retry comments" @click="activity.retry()" />
      </div>
      <p v-else-if="activity.loaded.value && !activity.rows.value.length">No comments yet.</p>
      <ul v-if="activity.rows.value.length" class="issue-stream-list">
        <li v-for="comment in activity.rows.value" :key="comment.id">
          <strong>{{ name(comment.author) ?? 'Person unavailable' }}</strong>
          <small> · <time :datetime="comment.created_at">{{ date(comment.created_at) }}</time></small>
          <p class="issue-comment-body" dir="auto">{{ comment.body }}</p>
        </li>
      </ul>
      <Button v-if="activity.after.value" text label="Load more comments" size="small" :loading="activity.pending.value" @click="activity.load(true)" />
    </div>
    <div v-else-if="selection === 'relationships'" :id="id + '-relationships'" role="tabpanel" aria-label="Relationships">
      <h3>Child issues</h3>
      <p v-if="children.pending.value && !children.loaded.value" role="status">Loading child issues…</p>
      <div v-if="children.error.value" role="alert">{{ issueProblem(children.error.value).message }}
        <Button text size="small" label="Retry child issues" @click="children.retry()" />
      </div>
      <p v-else-if="children.loaded.value && !children.rows.value.length">No child issues.</p>
      <ul v-if="children.rows.value.length" class="issue-stream-list">
        <li v-for="child in children.rows.value" :key="child.id">
          <a class="kanban-issue-link" :href="kanbanRoot + '/' + issuePath(board, child.id)"
            @click="follow($event, child.id)">{{ child.key }} · {{ title(child) }}</a>
          <small>{{ stateLabel(schema, child) }}</small>
        </li>
      </ul>
      <Button v-if="children.after.value" text label="Load more children" size="small" :loading="children.pending.value" @click="children.load(true)" />
      <h3>Linked issues</h3>
      <p v-if="links.pending.value && !links.loaded.value" role="status">Loading links…</p>
      <div v-if="links.error.value" role="alert">{{ issueProblem(links.error.value).message }}
        <Button text size="small" label="Retry links" @click="links.retry()" />
      </div>
      <p v-else-if="links.loaded.value && !rels.length">No linked issues.</p>
      <ul v-if="rels.length" class="issue-stream-list">
        <li v-for="(link, index) in rels" :key="index">
          {{ link.label }}
          <a v-if="'item' in link.peer" class="kanban-issue-link"
            :href="kanbanRoot + '/' + issuePath(link.peer.board, link.peer.item)"
            :aria-label="link.label + ', open linked issue ' + (index + 1)"
            @click="follow($event, link.peer.item, link.peer.board)">Open issue</a>
          <span v-else>Unavailable issue</span>
        </li>
      </ul>
      <Button v-if="links.after.value" text label="Load more links" size="small" :loading="links.pending.value" @click="links.load(true)" />
    </div>
    <div v-else :id="id + '-history'" role="tabpanel" aria-label="History">
      <p v-if="history.pending.value && !history.loaded.value" role="status">Loading history…</p>
      <div v-if="history.error.value" role="alert">{{ issueProblem(history.error.value).message }}
        <Button text size="small" label="Retry history" @click="history.retry()" />
      </div>
      <p v-else-if="history.loaded.value && !history.rows.value.length">No history yet.</p>
      <ul v-if="history.rows.value.length" class="issue-stream-list">
        <li v-for="entry in history.rows.value" :key="entry.seq + ':' + entry.n">
          <strong>{{ historyLabel(entry) }}</strong>
          <small> · {{ name(entry.actor) ?? 'Person unavailable' }} · <time :datetime="entry.at">{{ date(entry.at) }}</time></small>
          <div v-if="entry.before != null || entry.after != null" class="issue-history-change">
            <FieldDisplay :value="entry.before" :name="name" />
            <span aria-label="changed to">→</span>
            <FieldDisplay :value="entry.after" :name="name" />
          </div>
        </li>
      </ul>
      <Button v-if="history.after.value" text label="Load more history" size="small" :loading="history.pending.value" @click="history.load(true)" />
    </div>
  </section>
</template>
