<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import SelectButton from 'primevue/selectbutton'
import { actionLabels, fullDate, personLabel } from '../copy'
import type { Resource, Revision } from '../types'
import { useReturnFocus } from '../focus'

const CodeEditor = defineAsyncComponent(() => import('./CodeEditor.vue'))
const DiffView = defineAsyncComponent(() => import('./DiffView.vue'))

// One saved version, read-only, with a comparison against the current version and Restore.
// With `included`, the version is the one the module ships, and its action is Reset to original.
const props = defineProps<{ revision?: Revision; current: Resource; compare?: boolean; busy?: boolean; included?: boolean }>()
const emit = defineEmits<{ close: []; restore: [revision: Revision]; reset: [] }>()

useReturnFocus(() => !!props.revision)
const view = ref<'version' | 'compare'>('version')
const face = ref<'html' | 'text'>('html')
watch(() => props.revision, value => { if (value) { view.value = props.compare ? 'compare' : 'version'; face.value = 'html' } })
const views = [{ label: 'This version', value: 'version' }, { label: 'Compare with current', value: 'compare' }]
const faces = [{ label: 'HTML', value: 'html' }, { label: 'Plain text', value: 'text' }]
const isCurrent = computed(() => !props.included && props.revision?.version === props.current.revision)
const heading = computed(() => {
  const revision = props.revision
  if (!revision) return ''
  return props.included || (revision.state === 'original' && revision.action === 'reset') ? `${props.current.title}: the version included with ${props.current.origin_label}` : `${props.current.title}, version ${revision.version}`
})
const before = computed(() => props.revision ? (face.value === 'html' ? props.revision.content.html : props.revision.content.text) : '')
const after = computed(() => face.value === 'html' ? props.current.html : props.current.text)
const dialogPt = { header: { class: 'mail-dialog-header' }, content: { class: 'mail-dialog-content' }, footer: { class: 'mail-dialog-footer' } }
</script>

<template>
  <Dialog :visible="!!revision" modal :draggable="false" class="mail-dialog mail-dialog-wide" :pt="dialogPt" :aria-label="heading"
    :closable="false" :close-on-escape="!busy" @update:visible="value => { if (!value) emit('close') }">
    <template #header>
      <span class="kx-modal-head-icon"><Icon icon="tabler:history" aria-hidden="true" /></span>
      <span v-if="revision" class="kx-modal-head-text">
        <span class="kx-modal-head-title">{{ heading }}</span>
        <span v-if="included" class="kx-modal-head-sub">Compare it with your customized version, or reset to it.</span>
        <span v-else class="kx-modal-head-sub">{{ actionLabels[revision.action] }} by {{ personLabel(revision.author_label, revision.author) }} · {{ fullDate(revision.created_at) }}</span>
      </span>
    </template>
    <div v-if="revision" class="mail-form">
      <div class="mail-face-bar">
        <SelectButton v-if="!isCurrent" v-model="view" :options="views" option-label="label" option-value="value" :allow-empty="false" aria-label="Show" />
        <SelectButton v-model="face" :options="faces" option-label="label" option-value="value" :allow-empty="false" aria-label="Format" />
      </div>
      <p v-if="revision.content.subject !== undefined && view === 'version'" class="mail-version-subject"><span class="mail-muted">Subject</span> <span class="mail-mono-block">{{ revision.content.subject }}</span></p>
      <div v-if="view === 'version'" class="mail-code-frame mail-code-version">
        <CodeEditor :key="face" :model-value="before" :label="heading + (face === 'html' ? ', HTML' : ', plain text')" read-only />
      </div>
      <DiffView v-else :key="'diff-' + face" :before="before" :after="after" :before-label="included || (revision.state === 'original' && revision.action === 'reset') ? 'Included version' : 'Version ' + revision.version" after-label="Current version" />
    </div>
    <template #footer>
      <Button label="Close" severity="secondary" outlined :disabled="busy" @click="emit('close')" />
      <Button v-if="revision && included" label="Reset to original" :loading="busy" @click="emit('reset')">
        <template #icon><Icon icon="tabler:arrow-back-up" aria-hidden="true" /></template>
      </Button>
      <Button v-else-if="revision && !isCurrent" label="Restore this version" :loading="busy" @click="emit('restore', revision)">
        <template #icon><Icon icon="tabler:restore" aria-hidden="true" /></template>
      </Button>
    </template>
  </Dialog>
</template>
