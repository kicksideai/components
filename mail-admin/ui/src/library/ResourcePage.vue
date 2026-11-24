<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { host } from '@wippy-fe/proxy'
import { computed, ref, shallowRef, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import EmptyState from '@kickside/ui-kit/EmptyState.vue'
import SettingsSectionHead from '@kickside/ui-kit/SettingsSectionHead.vue'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { errorCode, isDenied, isMissing, library as libraryApi } from '../api'
import { useMail } from '../context'
import { describe, fullDate, kindLabels, kindPlurals, onDate, originText, plural } from '../copy'
import { principalLabel, resolvePrincipals } from '../principals'
import { useLibraryChanges } from '../realtime'
import { sectionOf, type ResourceSection } from '../route'
import type { Resource, ResourceKind, Revision } from '../types'
import HistoryList from './HistoryList.vue'
import RefusalDialog, { type Refusal } from './RefusalDialog.vue'
import SourceFaces from './SourceFaces.vue'
import UsedBy from './UsedBy.vue'
import VariablesTable from './VariablesTable.vue'

const props = defineProps<{ kind: ResourceKind; name: string; section: ResourceSection }>()
const { library, go, create } = useMail()
const key = computed(() => ({ kind: props.kind, name: props.name }))

const resource = shallowRef<Resource>()
const loading = ref(true), gone = ref(false), denied = ref(false)
const error = ref('')
const beginRead = latestRequest()
async function load() {
  const current = beginRead()
  try {
    const item = await libraryApi.get(key.value)
    if (!current()) return
    resource.value = item
    gone.value = denied.value = false
    error.value = ''
    void resolvePrincipals([item.author])
  } catch (failure) {
    if (!current()) return
    gone.value = isMissing(failure)
    denied.value = isDenied(failure)
    error.value = gone.value || denied.value ? '' : describe(failure, 'This resource could not be loaded.')
    if (gone.value) resource.value = undefined
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
    void resolvePrincipals(items.map(item => item.author))
  } catch (failure) {
    if (!current()) return
    historyError.value = isMissing(failure) ? '' : describe(failure, 'History could not be loaded.')
  } finally {
    if (current()) historyLoading.value = false
  }
}

let historyWanted = false
watch(() => props.section, section => {
  if (section === 'history' && !historyWanted) { historyWanted = true; void loadHistory() }
}, { immediate: true })

async function refresh() {
  await load()
  if (historyWanted && !gone.value) await loadHistory()
}
useHostVisibilityRefresh(refresh)
useLibraryChanges(change => {
  if (change.kind === props.kind && change.name === props.name) void refresh()
  else if (props.kind === 'base' && change.kind === 'message') void load()
})

const busy = ref<'reset' | 'delete' | number>()
const actionError = ref('')
const notice = ref('')
const refusal = ref<Refusal>()

const title = computed(() => resource.value?.title ?? props.name)
const headings = computed(() => {
  const item = resource.value
  const name = title.value
  const users = item?.used_by?.messages?.length ?? 0
  const sender = item?.used_by?.recent_senders?.find(entry => entry.origin)
  const content: Record<ResourceKind, { title: string; description: string }> = {
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
  return `Customized by ${principalLabel(item.author)} ${onDate(item.updated_at)} from the included version.`
})
const baseTitle = computed(() => {
  const base = resource.value?.base
  return base ? library.find('base', base)?.title ?? base : ''
})

const conflict = ref(false)
function fail(failure: unknown, fallback: string) {
  conflict.value = errorCode(failure) === 'mail_revision_conflict'
  if (conflict.value) void refresh()
  actionError.value = describe(failure, fallback)
}

async function reset() {
  const item = resource.value
  if (!item || busy.value !== undefined) return
  const confirmed = await host.confirm({
    header: `Reset ${item.title} to the original?`,
    message: 'Your changes are replaced by the included version. They stay in History, so you can restore them.',
    acceptLabel: 'Reset to original', rejectLabel: 'Cancel',
  })
  if (!confirmed) return
  busy.value = 'reset'
  actionError.value = notice.value = ''
  conflict.value = false
  try {
    resource.value = await libraryApi.reset(key.value, item.revision)
    notice.value = `${item.title} is back to the original. Your changes are in History.`
    await refresh()
  } catch (failure) {
    fail(failure, `${item.title} could not be reset.`)
  } finally {
    busy.value = undefined
  }
}

async function restore(revision: Revision) {
  const item = resource.value
  if (!item || busy.value !== undefined) return
  const confirmed = await host.confirm({
    header: `Restore the version of ${item.title} from ${fullDate(revision.created_at)}?`,
    message: 'It becomes the current version. The current version stays in History.',
    acceptLabel: 'Restore this version', rejectLabel: 'Cancel',
  })
  if (!confirmed) return
  busy.value = revision.revision
  actionError.value = notice.value = ''
  try {
    resource.value = await libraryApi.restore(key.value, revision.revision, item.revision)
    notice.value = `The version from ${fullDate(revision.created_at)} is now in effect.`
    await refresh()
  } catch (failure) {
    fail(failure, 'That version could not be restored.')
  } finally {
    busy.value = undefined
  }
}

function inUse(item: Resource, names: readonly string[]) {
  const titles = names.map(name => library.find('message', name)?.title ?? name)
  const verb = item.kind === 'base' ? 'use' : 'include'
  refusal.value = {
    header: `${item.title} is in use`,
    message: `${plural(names.length, 'message')} ${names.length === 1 ? verb + 's' : verb} it: ${titles.join(', ')}. Remove it from ${names.length === 1 ? 'that message' : 'them'} first.`,
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
    go({ name: 'library', section: sectionOf(item.kind) })
  } catch (failure) {
    const messages = errorCode(failure) === 'mail_resource_in_use' ? (failure as { details?: { messages?: unknown } }).details?.messages : undefined
    if (Array.isArray(messages) && messages.every(name => typeof name === 'string')) inUse(item, messages as string[])
    else fail(failure, `${item.title} could not be deleted.`)
  } finally {
    busy.value = undefined
  }
}

function duplicate() {
  const item = resource.value
  if (item) create({ kind: item.kind, from: { kind: item.kind, name: item.name } })
}
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
        <Button label="Duplicate" severity="secondary" outlined :disabled="busy !== undefined" @click="duplicate">
          <template #icon><Icon icon="tabler:copy" aria-hidden="true" /></template>
        </Button>
        <Button v-if="resource.state === 'created'" label="Delete" severity="danger" outlined :loading="busy === 'delete'" :disabled="busy !== undefined" @click="remove">
          <template #icon><Icon icon="tabler:trash" aria-hidden="true" /></template>
        </Button>
      </template>
    </SettingsSectionHead>

    <div v-if="error" class="kx-err mail-error" role="alert">
      <span>{{ error }}</span>
      <Button label="Retry" severity="secondary" outlined size="small" @click="refresh()" />
    </div>
    <p v-else-if="loading" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading {{ title }}…</p>

    <template v-if="resource">
      <p v-if="actionError && conflict" class="kx-notice warn mail-block" role="alert"><Icon icon="tabler:alert-triangle" aria-hidden="true" />{{ actionError }}</p>
      <p v-else-if="actionError" class="kx-err mail-error" role="alert"><span>{{ actionError }}</span></p>
      <p v-if="notice" class="kx-notice info mail-block" role="status"><Icon icon="tabler:circle-check" aria-hidden="true" />{{ notice }}</p>
      <div v-if="customizedNotice && section === 'content'" class="kx-notice mail-customized">
        <Icon icon="tabler:pencil" aria-hidden="true" />
        <span class="mail-customized-text">{{ customizedNotice }}</span>
        <Button label="Reset to original" severity="secondary" outlined size="small" :loading="busy === 'reset'" :disabled="busy !== undefined" @click="reset">
          <template #icon><Icon icon="tabler:arrow-back-up" aria-hidden="true" /></template>
        </Button>
      </div>

      <template v-if="section === 'content'">
        <dl class="mail-facts mail-card">
          <dt>Name</dt><dd>{{ resource.title }}</dd>
          <dt>Description</dt><dd>{{ resource.description || '—' }}</dd>
          <dt>Reference</dt><dd><span class="mail-mono">{{ resource.name }}</span></dd>
          <template v-if="resource.kind === 'message'">
            <dt>Base template</dt>
            <dd>
              <button v-if="resource.base" type="button" class="mail-text-link" @click="go({ name: 'resource', kind: 'base', resource: resource.base, section: 'content' })">{{ baseTitle }}</button>
            </dd>
            <dt>Subject</dt><dd><span class="mail-mono-block">{{ resource.subject }}</span></dd>
          </template>
        </dl>
        <SourceFaces :html="resource.html" :text="resource.text" :label="kind === 'message' ? 'Body' : 'Source'" />
      </template>
      <VariablesTable v-else-if="section === 'variables'" :resource="resource" :label="headings.title" />
      <UsedBy v-else-if="section === 'used-by'" :resource="resource" />
      <HistoryList v-else :resource="resource" :revisions="revisions" :loading="historyLoading" :error="historyError"
        :busy="typeof busy === 'number' ? busy : (busy ? -1 : undefined)" @restore="restore" @retry="loadHistory" />
    </template>
  </template>
  <RefusalDialog :refusal="refusal" @close="refusal = undefined" />
</template>
