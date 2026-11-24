<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import SystemTabs from '@kickside/ui-kit/SystemTabs.vue'
import Button from 'primevue/button'
import { computed, ref, shallowRef, useId, watch } from 'vue'
import IssueAssignee from '../presentation/IssueAssignee.vue'
import { currentUser } from '../work/me'
import { issuePath, kanbanRoot } from '../route'
import FieldDisplay from './FieldDisplay.vue'
import MarkdownEditor from './MarkdownEditor.vue'
import MarkdownView from './MarkdownView.vue'
import { exactTime, relativeTime } from './markdown'
import { useCursorPage } from './cursor'
import { issuePageLimit, issueProblem, stateLabel, title } from './model'
import { usePrincipalNames } from './principals'
import type { Comment, History, Issue, Link, Operation, Principal, QueryCursor, Schema } from './types'
import { queryIssues, type IssueWork } from './work'

const props = defineProps<{
  work: IssueWork; board: string; item: Issue; schema: Schema; writable: boolean; locked: boolean; sequence?: number;
  submit: (ops: Operation[], onSuccess?: () => void) => Promise<boolean>;
}>()
const emit = defineEmits<{ open: [id: string, board?: string]; denied: [problem: unknown] }>()
const id = useId()
const tabs = [{ value: 'activity', label: 'Activity' }, { value: 'relationships', label: 'Relationships' }]
const selection = ref('activity')
const body = ref('')
const bodyMentions = shallowRef<Principal[]>([])
const filter = ref<'all' | 'comments' | 'history'>('all')
const me = ref<string>()
const editing = ref<string>()
const draft = ref('')
const draftMentions = shallowRef<Principal[]>([])
const now = ref(Date.now())
currentUser().then(id => { me.value = id }, () => {})
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
  if (section === 'activity') {
    start(activity)
    start(history)
  }
  if (section === 'relationships') {
    start(children)
    start(links)
  }
}

watch(() => props.item.id, () => {
  for (const page of [activity, history, children, links]) page.reset()
  body.value = ''
  bodyMentions.value = []
  editing.value = undefined
  show('activity')
}, { immediate: true })
watch(() => props.sequence, () => {
  now.value = Date.now()
  show(selection.value, true)
})

async function post() {
  const draft = body.value.trim()
  if (props.locked || !props.writable || !draft) return
  const mentions = draft.includes('@') ? bodyMentions.value : []
  await props.submit([{ op: 'comment', item: props.item.id, body: draft, ...(mentions.length ? { mentions } : {}) }], () => {
    body.value = ''
    bodyMentions.value = []
    void activity.load()
  })
}

type Entry = { kind: 'comment', at: string, key: string, comment: Comment } | { kind: 'history', at: string, key: string, entry: History }
const timeline = computed<Entry[]>(() => {
  const rows: Entry[] = []
  if (filter.value !== 'history') {
    for (const comment of activity.rows.value) rows.push({ kind: 'comment', at: comment.created_at, key: 'c' + comment.id, comment })
  }
  if (filter.value !== 'comments') {
    for (const entry of history.rows.value) {
      if (!entry.kind.startsWith('comment')) rows.push({ kind: 'history', at: entry.at, key: 'h' + entry.seq + ':' + entry.n, entry })
    }
  }
  return rows.sort((a, b) => a.at.localeCompare(b.at))
})
function startEdit(comment: Comment) {
  editing.value = comment.id
  draft.value = comment.body
  draftMentions.value = comment.mentions ?? []
}
async function saveEdit(comment: Comment) {
  const text = draft.value.trim()
  if (props.locked || !text) return
  await props.submit([{ op: 'comment', item: props.item.id, comment: comment.id, body: text, mentions: draftMentions.value }], () => {
    editing.value = undefined
    void activity.load()
  })
}
const confirming = ref<string>()
async function remove(comment: Comment) {
  if (props.locked) return
  await props.submit([{ op: 'comment', item: props.item.id, comment: comment.id, delete: true }], () => {
    confirming.value = undefined
    void activity.load()
  })
}

function follow(event: MouseEvent, item: string, board = props.board) {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  if (!props.locked) emit('open', item, board)
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
    <div v-if="selection === 'activity'" :id="id + '-activity'" role="tabpanel" aria-label="Activity" class="issue-activity">
      <div class="issue-activity-filter" role="group" aria-label="Show activity">
        <Button v-for="option in (['all', 'comments', 'history'] as const)" :key="option" type="button" text size="small"
          severity="secondary" :label="option === 'all' ? 'All' : option === 'comments' ? 'Comments' : 'History'"
          :aria-pressed="filter === option" @click="filter = option" />
      </div>
      <Button v-if="filter !== 'comments' && history.after.value" text size="small" label="Show earlier activity"
        :loading="history.pending.value" @click="history.load(true)" />
      <p v-if="(activity.pending.value && !activity.loaded.value) || (history.pending.value && !history.loaded.value)" role="status"
        class="kanban-issue-pending">Loading activity…</p>
      <div v-if="activity.error.value" role="alert">{{ issueProblem(activity.error.value).message }}
        <Button text size="small" label="Retry comments" @click="activity.retry()" />
      </div>
      <div v-if="history.error.value" role="alert">{{ issueProblem(history.error.value).message }}
        <Button text size="small" label="Retry history" @click="history.retry()" />
      </div>
      <p v-else-if="activity.loaded.value && history.loaded.value && !timeline.length" class="kanban-rich-empty">
        {{ filter === 'history' ? 'No history yet.' : 'No comments yet.' }}
      </p>
      <ol v-if="timeline.length" class="issue-timeline">
        <li v-for="row in timeline" :key="row.key" :class="row.kind === 'comment' ? 'issue-comment-entry' : 'issue-event-entry'">
          <template v-if="row.kind === 'comment'">
            <IssueAssignee :id="row.comment.author" :name="name(row.comment.author)" />
            <div class="issue-comment-card">
              <div class="issue-comment-head">
                <strong>{{ name(row.comment.author) ?? 'Person unavailable' }}</strong>
                <time :datetime="row.comment.created_at" :title="exactTime(row.comment.created_at)">{{ relativeTime(row.comment.created_at, now) }}</time>
                <span v-if="row.comment.edited_at" class="issue-comment-edited" :title="'Edited ' + exactTime(row.comment.edited_at)">edited</span>
                <span v-if="writable && me === row.comment.author && editing !== row.comment.id" class="issue-comment-actions">
                  <Button type="button" text size="small" severity="secondary" label="Edit" :aria-label="'Edit comment from ' + relativeTime(row.comment.created_at, now)"
                    :disabled="locked" @click="startEdit(row.comment)" />
                  <Button type="button" text size="small" severity="secondary" label="Delete" :aria-label="'Delete comment from ' + relativeTime(row.comment.created_at, now)"
                    :disabled="locked" @click="confirming = row.comment.id" />
                </span>
              </div>
              <div v-if="confirming === row.comment.id" class="kx-notice issue-comment-confirm" role="alert">
                <span>Delete this comment?</span>
                <Button type="button" size="small" severity="danger" label="Delete comment" :disabled="locked" @click="remove(row.comment)" />
                <Button type="button" size="small" text severity="secondary" label="Keep" @click="confirming = undefined" />
              </div>
              <MarkdownEditor v-if="editing === row.comment.id" v-model="draft" v-model:mentions="draftMentions" label="Edit comment"
                submit-label="Save" autofocus :disabled="locked" @submit="saveEdit(row.comment)" @cancel="editing = undefined">
                <template #actions>
                  <Button type="button" text size="small" severity="secondary" label="Cancel" @click="editing = undefined" />
                  <Button type="button" size="small" label="Save" :disabled="locked || !draft.trim()" @click="saveEdit(row.comment)" />
                </template>
              </MarkdownEditor>
              <MarkdownView v-else :source="row.comment.body" />
            </div>
          </template>
          <template v-else>
            <span class="issue-event-dot" aria-hidden="true" />
            <span class="issue-event-text">
              <strong>{{ name(row.entry.actor) ?? 'Person unavailable' }}</strong>
              {{ historyLabel(row.entry).charAt(0).toLowerCase() + historyLabel(row.entry).slice(1) }}
              <template v-if="row.entry.kind !== 'created' && (row.entry.before != null || row.entry.after != null)">
                <FieldDisplay :value="row.entry.before" :name="name" />
                <span aria-label="changed to">→</span>
                <FieldDisplay :value="row.entry.after" :name="name" />
              </template>
              <time :datetime="row.entry.at" :title="exactTime(row.entry.at)">{{ relativeTime(row.entry.at, now) }}</time>
            </span>
          </template>
        </li>
      </ol>
      <Button v-if="filter !== 'history' && activity.after.value" text label="Load more comments" size="small"
        :loading="activity.pending.value" @click="activity.load(true)" />
      <form v-if="writable && filter !== 'history'" class="issue-comment" @submit.prevent="post">
        <MarkdownEditor v-model="body" v-model:mentions="bodyMentions" label="Add a comment" placeholder="Add a comment…"
          submit-label="Comment" compact :disabled="locked" @submit="post" @cancel="body = ''">
          <template #actions>
            <Button type="submit" label="Comment" aria-label="Post comment" size="small" :disabled="locked || !body.trim()" />
          </template>
        </MarkdownEditor>
      </form>
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
  </section>
</template>
