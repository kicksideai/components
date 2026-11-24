<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { host } from '@wippy-fe/proxy'
import { computed, ref, shallowRef, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import Tag from 'primevue/tag'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import { errorCode, isMissing, library as libraryApi } from '../api'
import { assetReference } from '../content'
import { useMail } from '../context'
import { actionLabels, bytes, describe, fullDate, kindIcons, personLabel, plural } from '../copy'
import { emailDocument } from '../editor/render'
import { problemOf } from '../editor/problems'
import { useLibraryChanges } from '../realtime'
import type { DraftRender, Resource, Revision } from '../types'
import RefusalDialog, { type Refusal } from './RefusalDialog.vue'
import AssetTile from './AssetTile.vue'
import ResourceSource from './ResourceSource.vue'
import UploadAsset from './UploadAsset.vue'

const props = defineProps<{ name?: string }>()
const emit = defineEmits<{ close: [] }>()
const { library, go } = useMail()

const asset = shallowRef<Resource>()
const revisions = shallowRef<Revision[]>([])
const shown = shallowRef<DraftRender>()
const shownIn = ref('')
const loading = ref(false), missing = ref(false)
const error = ref(''), actionError = ref(''), notice = ref('')
const busy = ref<string | number>()
const copied = ref(false)
const replacing = ref(false)
const refusal = ref<Refusal>()
const begin = latestRequest()

async function load() {
  const name = props.name
  const current = begin()
  if (!name) { asset.value = undefined; return }
  loading.value = true
  try {
    const [item, history] = await Promise.all([libraryApi.get({ kind: 'asset', name }), libraryApi.history({ kind: 'asset', name })])
    if (!current()) return
    asset.value = item
    revisions.value = history
    missing.value = false
    error.value = ''
    const first = item.used_by?.messages?.[0]
    shownIn.value = first ?? ''
    shown.value = first ? await libraryApi.preview(first, []) : undefined
  } catch (failure) {
    if (!current()) return
    missing.value = isMissing(failure)
    error.value = missing.value ? '' : describe(failure, 'This image could not be loaded.')
  } finally {
    if (current()) loading.value = false
  }
}
watch(() => props.name, () => { copied.value = false; notice.value = actionError.value = ''; void load() }, { immediate: true })
useLibraryChanges(change => { if (change.kind === 'asset' && change.name === props.name) void load() })

const messages = computed(() => (asset.value?.used_by?.messages ?? []).map(name => ({ name, title: library.find('message', name)?.title ?? name })))
const reference = computed(() => asset.value ? assetReference(asset.value.name) : '')
async function copy() {
  try { await navigator.clipboard.writeText(reference.value); copied.value = true } catch { copied.value = false }
}

async function act(kind: 'reset' | 'delete' | 'restore', revision?: Revision) {
  const item = asset.value
  if (!item || busy.value !== undefined) return
  if (kind === 'delete' && messages.value.length) {
    refusal.value = {
      header: `${item.title} is in use`,
      message: `${plural(messages.value.length, 'message')} ${messages.value.length === 1 ? 'shows' : 'show'} it: ${messages.value.map(m => m.title).join(', ')}. Remove it from ${messages.value.length === 1 ? 'that message' : 'them'} first.`,
      links: messages.value.map(m => ({ label: m.title, open: () => go({ name: 'resource', kind: 'message', resource: m.name, section: 'content' }) })),
    }
    return
  }
  const copyText = {
    reset: { header: `Reset ${item.title} to the original?`, message: `The image included with ${item.origin_label} is shown again everywhere. Your image stays in History.`, accept: 'Reset to original' },
    delete: { header: `Delete ${item.title}?`, message: 'No message shows it. You can\'t undo this.', accept: 'Delete image' },
    restore: { header: `Restore version ${revision?.version} of ${item.title}?`, message: 'Every template that shows it changes at once. The current image stays in History.', accept: 'Restore this version' },
  }[kind]
  if (!await host.confirm({ header: copyText.header, message: copyText.message, acceptLabel: copyText.accept, rejectLabel: 'Cancel', ...(kind === 'delete' ? { acceptClass: 'p-button-danger' } : {}) })) return
  busy.value = revision ? revision.revision : kind
  actionError.value = notice.value = ''
  try {
    if (kind === 'delete') {
      await libraryApi.remove({ kind: 'asset', name: item.name }, item.revision)
      emit('close')
      return
    }
    asset.value = kind === 'reset' ? await libraryApi.reset({ kind: 'asset', name: item.name }, item.revision)
      : await libraryApi.restore({ kind: 'asset', name: item.name }, revision!.revision, item.revision)
    notice.value = kind === 'reset' ? `${item.title} is back to the original.` : `Version ${revision!.version} is shown again everywhere.`
    await load()
  } catch (failure) {
    const found = problemOf(failure)
    if (found?.dependents?.length) {
      refusal.value = { header: `${item.title} is in use`, message: found.message, links: found.dependents.map(name => ({ label: library.find('message', name)?.title ?? name, open: () => go({ name: 'resource', kind: 'message', resource: name, section: 'content' }) })) }
    } else {
      actionError.value = errorCode(failure) === 'mail_revision_conflict'
        ? 'Someone changed this image while you were looking at it. The latest version is shown now; try again.' : describe(failure, 'The image could not be changed.')
      if (errorCode(failure) === 'mail_revision_conflict') void load()
    }
  } finally {
    busy.value = undefined
  }
}
const preview = computed(() => shown.value?.html ? emailDocument(shown.value.html, shown.value.inline_assets) : '')
</script>

<template>
  <Drawer :visible="!!name" position="right" :modal="true" :dismissable="busy === undefined" :show-close-icon="false" class="mail-drawer"
    :pt="{ root: { style: 'width: min(560px, 92vw)' } }" aria-label="Image details" @update:visible="value => { if (!value) emit('close') }">
    <div class="mail-drawer-body">
      <header class="mail-drawer-head">
        <div class="mail-drawer-title">
          <Tag v-if="asset?.state === 'customized'" severity="info" value="Replaced" class="kx-tag-sm" />
          <h2>{{ asset?.title ?? 'Image' }}</h2>
        </div>
        <Button text severity="secondary" aria-label="Close" title="Close" :disabled="busy !== undefined" @click="emit('close')">
          <template #icon><Icon icon="tabler:x" aria-hidden="true" /></template>
        </Button>
      </header>
      <p v-if="loading && !asset" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading image…</p>
      <p v-else-if="missing" class="kx-notice mail-block" role="status"><Icon icon="tabler:photo-off" aria-hidden="true" />This image no longer exists. It was deleted while you were away.</p>
      <div v-else-if="error" class="kx-err mail-error" role="alert"><span>{{ error }}</span><Button label="Retry" severity="secondary" outlined size="small" @click="load()" /></div>

      <template v-if="asset">
        <p v-if="actionError" class="kx-notice warn mail-block" role="alert"><Icon icon="tabler:alert-triangle" aria-hidden="true" />{{ actionError }}</p>
        <p v-if="notice" class="kx-notice info mail-block" role="status"><Icon icon="tabler:circle-check" aria-hidden="true" />{{ notice }}</p>
        <div class="mail-asset-actions">
          <Button label="Replace" :disabled="busy !== undefined" @click="replacing = true"><template #icon><Icon icon="tabler:replace" aria-hidden="true" /></template></Button>
          <Button v-if="asset.state === 'customized'" label="Reset to original" severity="secondary" outlined :loading="busy === 'reset'" :disabled="busy !== undefined" @click="act('reset')">
            <template #icon><Icon icon="tabler:arrow-back-up" aria-hidden="true" /></template>
          </Button>
          <Button v-if="asset.state === 'created'" label="Delete" severity="danger" outlined :loading="busy === 'delete'" :disabled="busy !== undefined" @click="act('delete')">
            <template #icon><Icon icon="tabler:trash" aria-hidden="true" /></template>
          </Button>
        </div>
        <div class="mail-asset-hero"><AssetTile :name="asset.name" :revision="asset.revision" :asset="asset.asset" large :alt="asset.title" /></div>
        <dl class="mail-facts mail-card">
          <dt>Reference</dt>
          <dd class="mail-reference"><span class="mail-mono-block">{{ reference }}</span>
            <Button text severity="secondary" size="small" :aria-label="copied ? 'Reference copied' : 'Copy reference'" :title="copied ? 'Reference copied' : 'Copy reference'" @click="copy">
              <template #icon><Icon :icon="copied ? 'tabler:check' : 'tabler:copy'" aria-hidden="true" /></template>
            </Button>
          </dd>
          <dt>File</dt><dd>{{ asset.asset?.filename }} · {{ bytes(asset.asset?.size) }}</dd>
          <template v-if="asset.asset?.width"><dt>Size</dt><dd>{{ asset.asset.width }} × {{ asset.asset.height }}</dd></template>
          <dt>Source</dt><dd><ResourceSource :resource="asset" /></dd>
        </dl>

        <section class="mail-group" aria-labelledby="asset-shown">
          <h3 id="asset-shown" class="mail-label">Shown in</h3>
          <p v-if="!messages.length" class="mail-muted">No message shows {{ asset.title }} with its sample values.</p>
          <template v-else>
            <ul class="mail-list">
              <li v-for="message in messages" :key="message.name">
                <button type="button" class="mail-row-link" @click="go({ name: 'resource', kind: 'message', resource: message.name, section: 'content' })">
                  <Icon :icon="kindIcons.message" aria-hidden="true" /><span>{{ message.title }}</span>
                </button>
              </li>
            </ul>
            <div v-if="preview" class="mail-asset-context">
              <iframe sandbox="" :srcdoc="preview" :title="'How ' + asset.title + ' looks in ' + (library.find('message', shownIn)?.title ?? shownIn)" />
            </div>
          </template>
        </section>

        <section class="mail-group" aria-labelledby="asset-history">
          <h3 id="asset-history" class="mail-label">History</h3>
          <p v-if="!revisions.length" class="mail-muted">{{ asset.title }} has not been replaced.</p>
          <ol v-else class="mail-history">
            <li v-for="revision in revisions" :key="revision.revision" class="mail-history-row">
              <div class="mail-history-head">
                <div class="mail-history-main">
                  <span class="mail-history-title">Version {{ revision.version }} · {{ actionLabels[revision.action] }}
                    <Tag v-if="revision.revision === asset.revision" severity="success" value="Current" class="kx-tag-sm" /></span>
                  <span class="mail-sub">{{ personLabel(revision.author_label, revision.author) }} · {{ fullDate(revision.created_at) }}
                    <template v-if="revision.content.asset?.filename"> · {{ revision.content.asset.filename }}</template></span>
                </div>
                <Button v-if="revision.revision !== asset.revision" label="Restore" severity="secondary" outlined size="small"
                  :loading="busy === revision.revision" :disabled="busy !== undefined" @click="act('restore', revision)">
                  <template #icon><Icon icon="tabler:restore" aria-hidden="true" /></template>
                </Button>
              </div>
            </li>
          </ol>
        </section>
      </template>
    </div>
  </Drawer>
  <UploadAsset v-if="asset" :visible="replacing" :replace="asset" @close="replacing = false" @done="load()" />
  <RefusalDialog :refusal="refusal" @close="refusal = undefined" />
</template>
