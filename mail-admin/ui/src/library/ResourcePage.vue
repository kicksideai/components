<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { host } from '@wippy-fe/proxy'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import SettingsDraftActions from '@kickside/ui-kit/SettingsDraftActions.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { errorCode, isDenied, isMissing, library as libraryApi } from '../api'
import { draftOf, sameDraft } from '../content'
import { useMail } from '../context'
import { describe, fullDate, kindLabels, kindPlurals, onDate, originText, personLabel, plural } from '../copy'
import PreviewPane from '../editor/PreviewPane.vue'
import ReviewDialog from '../editor/ReviewDialog.vue'
import SourceEditor from '../editor/SourceEditor.vue'
import VariablesEditor from '../editor/VariablesEditor.vue'
import VersionDialog from '../editor/VersionDialog.vue'
import { problemOf, type Problem } from '../editor/problems'
import { useLibraryChanges } from '../realtime'
import { sectionOf, type ResourceSection } from '../route'
import type { Resource, ResourceContent, Revision, TemplateKind } from '../types'
import HistoryList from './HistoryList.vue'
import RefusalDialog, { type Refusal } from './RefusalDialog.vue'
import UsedBy from './UsedBy.vue'

const props = defineProps<{ kind: TemplateKind; name: string; section: ResourceSection }>()
const { library, capabilities, delivery, go, create, setDirty } = useMail()
const key = computed(() => ({ kind: props.kind, name: props.name }))

const resource = shallowRef<Resource>()
const draft = ref<ResourceContent>()
const loading = ref(true), gone = ref(false), denied = ref(false)
const error = ref('')
// A newer revision saved by someone else while this draft has changes.
const stale = ref<{ revision: number; by: string }>()
const beginRead = latestRequest()

const dirty = computed(() => !!draft.value && !!resource.value && !sameDraft(draft.value, resource.value))
watch(dirty, value => setDirty(value), { immediate: true })
onBeforeUnmount(() => setDirty(false))

async function load(options: { keepDraft?: boolean } = {}) {
  const current = beginRead()
  try {
    const item = await libraryApi.get(key.value)
    if (!current()) return
    if (options.keepDraft && dirty.value && resource.value && item.revision !== resource.value.revision) {
      stale.value = { revision: item.revision, by: personLabel(item.author_label, item.author) || 'Someone' }
      return
    }
    resource.value = item
    draft.value = draftOf(item)
    stale.value = undefined
    gone.value = denied.value = false
    error.value = ''
  } catch (failure) {
    if (!current()) return
    gone.value = isMissing(failure)
    denied.value = isDenied(failure)
    error.value = gone.value || denied.value ? '' : describe(failure, 'This resource could not be loaded.')
    if (gone.value) { resource.value = undefined; draft.value = undefined }
  } finally {
    if (current()) loading.value = false
  }
}

const revisions = shallowRef<Revision[]>([])
const historyLoading = ref(false), historyError = ref('')
const beginHistory = latestRequest()
async function loadHistory() {
  const current = beginHistory()
  historyLoading.value = true
  try {
    const items = await libraryApi.history(key.value)
    if (!current()) return
    revisions.value = items
    historyError.value = ''
  } catch (failure) {
    if (!current()) return
    historyError.value = isMissing(failure) ? '' : describe(failure, 'History could not be loaded.')
  } finally {
    if (current()) historyLoading.value = false
  }
}

async function refresh() {
  await Promise.all([load({ keepDraft: true }), loadHistory()])
}
useHostVisibilityRefresh(refresh)
useLibraryChanges(change => {
  if (change.kind === props.kind && change.name === props.name) void refresh()
  else if (props.kind === 'base' && change.kind === 'message') void load({ keepDraft: true })
})

const busy = ref<'reset' | 'delete' | 'save' | 'test' | number>()
const actionError = ref('')
const conflict = ref(false)
const notice = ref('')
const refusal = ref<Refusal>()

const title = computed(() => resource.value?.title ?? props.name)
const headings = computed(() => {
  const item = resource.value
  const name = title.value
  const users = item?.used_by?.messages?.length ?? 0
  const sender = item?.used_by?.recent_senders?.find(entry => entry.origin)
  const content: Record<TemplateKind, { title: string; description: string }> = {
    message: { title: 'Message', description: 'What recipients read.' + (sender?.origin ? ` Sent recently by “${originText(sender.origin)}”.` : '') },
    base: { title: 'Layout', description: users ? `The frame around the ${plural(users, 'message')} that ${users === 1 ? 'uses' : 'use'} ${name}.` : `The frame around messages that use ${name}.` },
    part: { title: 'Content', description: `Shown wherever ${name} is included.` },
  }
  const sections: Record<ResourceSection, { title: string; description: string }> = {
    content: content[props.kind],
    variables: props.kind === 'message'
      ? { title: 'Variables', description: 'The values a sender provides, with the samples used for previews and tests.' }
      : { title: 'Inputs', description: `The values passed to ${name} where it is included, with their defaults.` },
    'used-by': {
      title: 'Used by',
      description: props.kind === 'message' ? `Who sends ${name}.` : props.kind === 'base' ? `Messages that use ${name}.` : `Templates that include ${name}.`,
    },
    history: { title: 'History', description: `Every saved version of ${name}, newest first.` },
  }
  return sections[props.section]
})

const customizedNotice = computed(() => {
  const item = resource.value
  if (item?.state !== 'customized') return ''
  return `Customized by ${personLabel(item.author_label, item.author)} ${onDate(item.updated_at)} from the version included with ${item.origin_label}.`
})
// The included version is in History once the resource has been reset at least once.
const originalVersion = computed(() => revisions.value.find(revision => revision.state === 'original'))
watch(() => resource.value?.state, state => { if (state === 'customized' && !revisions.value.length) void loadHistory() }, { immediate: true })

// Problems: the live preview's, then the last refused save's. Save is blocked while one stands.
const previewProblem = ref<Problem>()
const saveProblem = ref<Problem>()
const variablesInvalid = ref(false)
const problem = computed(() => saveProblem.value ?? previewProblem.value)
watch(() => JSON.stringify(draft.value), () => { saveProblem.value = undefined })
const blocked = computed(() => !!problem.value || variablesInvalid.value || !!stale.value)
const blockedReason = computed(() => stale.value ? 'Discard your changes to load the newer version first.'
  : variablesInvalid.value ? 'Fix the variables first.' : problem.value ? 'Fix the error first.' : '')

function fail(failure: unknown, fallback: string) {
  conflict.value = errorCode(failure) === 'mail_revision_conflict'
  if (conflict.value) void refresh()
  actionError.value = describe(failure, fallback)
}

function discard() {
  if (!resource.value) return
  const newer = !!stale.value
  draft.value = draftOf(resource.value)
  stale.value = undefined
  saveProblem.value = undefined
  if (newer) void load()
}

const reviewing = ref(false)
const reviewError = ref('')
const dependents = ref<{ names: string[]; reason: string }>()
function review() {
  reviewError.value = ''
  dependents.value = undefined
  reviewing.value = true
}
async function save(note: string) {
  const item = resource.value, edited = draft.value
  if (!item || !edited || busy.value !== undefined) return
  busy.value = 'save'
  reviewError.value = actionError.value = notice.value = ''
  dependents.value = undefined
  try {
    const saved = await libraryApi.update(edited, item.revision, note || undefined)
    resource.value = { ...item, ...saved }
    draft.value = draftOf(resource.value)
    reviewing.value = false
    notice.value = `Saved ${saved.title}.${props.kind === 'message' ? '' : ' Every message that uses it has the change.'}`
    await refresh()
  } catch (failure) {
    const found = problemOf(failure)
    const ownFailure = found?.resource?.kind === edited.kind && found.resource.name === edited.name
    if (found?.dependents?.length && !ownFailure) {
      dependents.value = { names: found.dependents, reason: found.reasons?.[0]?.message ?? found.message }
    } else if (found) {
      saveProblem.value = found
      reviewing.value = false
    } else if (errorCode(failure) === 'mail_revision_conflict') {
      reviewing.value = false
      await load({ keepDraft: true })
    } else {
      reviewError.value = describe(failure, `${edited.title} could not be saved.`)
    }
  } finally {
    busy.value = undefined
  }
}

async function sendTest() {
  const item = resource.value
  if (!item || busy.value !== undefined) return
  busy.value = 'test'
  actionError.value = notice.value = ''
  try {
    await libraryApi.sendTest(item.name)
    notice.value = 'Test sent to you with the sample values. It appears in Activity.'
  } catch (failure) {
    fail(failure, 'The test could not be sent.')
  } finally {
    busy.value = undefined
  }
}
const testDisabled = computed(() => {
  if (dirty.value) return 'Save your changes to send a test.'
  if (!capabilities.value?.send) return 'Ask an administrator for permission to send mail.'
  if (delivery.value && !delivery.value.configured) return 'Mail delivery is not set up. Open Delivery settings.'
  return ''
})

async function reset() {
  const item = resource.value
  if (!item || busy.value !== undefined) return
  const confirmed = await host.confirm({
    header: `Reset ${item.title} to the original?`,
    message: `Your changes are replaced by the version included with ${item.origin_label}. They stay in History, so you can restore them.`,
    acceptLabel: 'Reset to original', rejectLabel: 'Cancel',
  })
  if (!confirmed) return
  busy.value = 'reset'
  actionError.value = notice.value = ''
  conflict.value = false
  try {
    resource.value = await libraryApi.reset(key.value, item.revision)
    draft.value = draftOf(resource.value)
    notice.value = `${item.title} is back to the original. Your changes are in History.`
    await refresh()
  } catch (failure) {
    fail(failure, `${item.title} could not be reset.`)
  } finally {
    busy.value = undefined
  }
}

const shown = ref<Revision>()
const showCompare = ref(false)
function showVersion(revision: Revision, compare = false) {
  showCompare.value = compare
  shown.value = revision
}
async function restore(revision: Revision) {
  const item = resource.value
  if (!item || busy.value !== undefined) return
  const confirmed = await host.confirm({
    header: `Restore version ${revision.version} of ${item.title}?`,
    message: 'It becomes the current version. The current version stays in History.',
    acceptLabel: 'Restore this version', rejectLabel: 'Cancel',
  })
  if (!confirmed) return
  busy.value = revision.revision
  actionError.value = notice.value = ''
  try {
    resource.value = await libraryApi.restore(key.value, revision.revision, item.revision)
    draft.value = draftOf(resource.value)
    shown.value = undefined
    notice.value = `Version ${revision.version} from ${fullDate(revision.created_at)} is now in effect.`
    await refresh()
  } catch (failure) {
    const found = problemOf(failure)
    if (found?.dependents?.length) inUse(item, found.dependents, `Restoring version ${revision.version} would break them: ${found.message}`)
    else fail(failure, 'That version could not be restored.')
  } finally {
    busy.value = undefined
  }
}

function inUse(item: Resource, names: readonly string[], reason?: string) {
  const titles = names.map(name => library.find('message', name)?.title ?? name)
  const verb = item.kind === 'base' ? 'use' : 'include'
  refusal.value = {
    header: reason ? `${item.title} cannot change this way` : `${item.title} is in use`,
    message: reason ?? `${plural(names.length, 'message')} ${names.length === 1 ? verb + 's' : verb} it: ${titles.join(', ')}. Remove it from ${names.length === 1 ? 'that message' : 'them'} first.`,
    links: names.map((name, index) => ({ label: titles[index], open: () => go({ name: 'resource', kind: 'message', resource: name, section: 'content' }) })),
  }
}

async function remove() {
  const item = resource.value
  if (!item || item.state !== 'created' || busy.value !== undefined) return
  const users = item.used_by?.messages ?? []
  if (item.kind === 'base' && users.length) { inUse(item, users); return }
  const confirmed = await host.confirm({
    header: `Delete ${item.title}?`,
    message: item.kind === 'base' ? 'It is not used anywhere. You can\'t undo this.' : 'You can\'t undo this.',
    acceptLabel: `Delete ${kindLabels[item.kind].toLowerCase()}`, rejectLabel: 'Cancel', acceptClass: 'p-button-danger',
  })
  if (!confirmed) return
  busy.value = 'delete'
  actionError.value = notice.value = ''
  try {
    await libraryApi.remove(key.value, item.revision)
    setDirty(false)
    go({ name: 'library', section: sectionOf(props.kind) })
  } catch (failure) {
    const found = problemOf(failure)
    if (found?.dependents?.length) inUse(item, found.dependents)
    else fail(failure, `${item.title} could not be deleted.`)
  } finally {
    busy.value = undefined
  }
}

function duplicate() {
  const item = resource.value
  if (item) create({ kind: props.kind, from: { kind: item.kind, name: item.name } })
}
const previewMessages = computed(() => props.kind === 'base' ? resource.value?.used_by?.messages : undefined)
const saving = computed(() => busy.value === 'save')
void load()
watch(() => props.section, section => { if (section === 'history' && !revisions.value.length) void loadHistory() }, { immediate: true })
</script>

<template>
  <EmptyState v-if="gone" icon="tabler:file-off" title="This resource no longer exists" hint="It was deleted while you were away."
    :cta="'All ' + kindPlurals[kind].toLowerCase()" cta-icon="tabler:table" @cta="go({ name: 'library', section: sectionOf(kind) })" />
  <p v-else-if="denied" class="kx-notice warn mail-block" role="alert">
    <Icon icon="tabler:lock" aria-hidden="true" />Ask an administrator to grant you access to the mail library.
  </p>
  <template v-else>
    <SettingsSectionHead :title="headings.title" :description="headings.description">
      <template v-if="resource" #actions>
        <template v-if="dirty">
          <SettingsDraftActions :busy="saving" :review-disabled="blocked" @discard="discard" @review="review" />
        </template>
        <template v-else>
          <Button v-if="kind === 'message'" label="Send test to me" severity="secondary" outlined :loading="busy === 'test'"
            :disabled="!!testDisabled || busy !== undefined" :title="testDisabled || undefined" @click="sendTest">
            <template #icon><Icon icon="tabler:send" aria-hidden="true" /></template>
          </Button>
          <Button label="Duplicate" severity="secondary" outlined :disabled="busy !== undefined" @click="duplicate">
            <template #icon><Icon icon="tabler:copy" aria-hidden="true" /></template>
          </Button>
          <Button v-if="resource.state === 'created'" label="Delete" severity="danger" outlined :loading="busy === 'delete'" :disabled="busy !== undefined" @click="remove">
            <template #icon><Icon icon="tabler:trash" aria-hidden="true" /></template>
          </Button>
        </template>
      </template>
    </SettingsSectionHead>

    <div v-if="error" class="kx-err mail-error" role="alert">
      <span>{{ error }}</span>
      <Button label="Retry" severity="secondary" outlined size="small" @click="refresh()" />
    </div>
    <p v-else-if="loading" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading {{ title }}…</p>

    <template v-if="resource && draft">
      <p v-if="stale" class="kx-notice warn mail-block" role="alert">
        <Icon icon="tabler:alert-triangle" aria-hidden="true" />
        <span>{{ stale.by }} saved {{ resource.title }} while you were editing. Discard your changes to load theirs, or compare first.
          <button type="button" class="mail-text-link" @click="discard">Discard and load</button></span>
      </p>
      <p v-if="dirty && blockedReason && !stale" class="mail-muted mail-blocked" role="status">{{ blockedReason }}</p>
      <p v-if="actionError && conflict" class="kx-notice warn mail-block" role="alert"><Icon icon="tabler:alert-triangle" aria-hidden="true" />{{ actionError }}</p>
      <p v-else-if="actionError" class="kx-err mail-error" role="alert"><span>{{ actionError }}</span></p>
      <p v-if="notice" class="kx-notice info mail-block" role="status"><Icon icon="tabler:circle-check" aria-hidden="true" />{{ notice }}</p>
      <div v-if="customizedNotice && section === 'content'" class="kx-notice mail-customized">
        <Icon icon="tabler:pencil" aria-hidden="true" />
        <span class="mail-customized-text">{{ customizedNotice }}</span>
        <Button v-if="originalVersion" label="Compare with original" severity="secondary" outlined size="small" @click="showVersion(originalVersion, true)">
          <template #icon><Icon icon="tabler:arrows-diff" aria-hidden="true" /></template>
        </Button>
        <Button label="Reset to original" severity="secondary" outlined size="small" :loading="busy === 'reset'" :disabled="busy !== undefined || dirty" @click="reset">
          <template #icon><Icon icon="tabler:arrow-back-up" aria-hidden="true" /></template>
        </Button>
      </div>

      <div v-show="section === 'content'" class="mail-editor-layout">
        <SourceEditor :draft="draft" :problem="problem" :disabled="saving" />
        <PreviewPane :draft="draft" :messages="previewMessages" @problem="value => previewProblem = value" />
      </div>
      <VariablesEditor v-if="section === 'variables'" :draft="draft" :label="headings.title" :problem="problem" :disabled="saving"
        @invalid="value => variablesInvalid = value" />
      <UsedBy v-else-if="section === 'used-by'" :resource="resource" />
      <HistoryList v-else-if="section === 'history'" :resource="resource" :revisions="revisions" :loading="historyLoading" :error="historyError"
        :busy="typeof busy === 'number' ? busy : (busy ? -1 : undefined)" @show="showVersion" @restore="restore" @retry="loadHistory" />
    </template>
  </template>
  <ReviewDialog v-if="resource && draft" :visible="reviewing" :saved="draftOf(resource)" :draft="draft" :busy="saving" :error="reviewError"
    :dependents="dependents" @close="reviewing = false" @save="save" />
  <VersionDialog v-if="resource" :revision="shown" :current="resource" :compare="showCompare" :busy="typeof busy === 'number'"
    @close="shown = undefined" @restore="restore" />
  <RefusalDialog :refusal="refusal" @close="refusal = undefined" />
</template>
