<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { properties, samples } from '../content'
import { useMail } from '../context'
import { kindLabels } from '../copy'
import type { ResourceContent } from '../types'

// The draft bar's review step: what changed, an optional note for History, then Save.
const props = defineProps<{ visible: boolean; saved: ResourceContent; draft: ResourceContent; busy?: boolean; error?: string; dependents?: { names: string[]; reason: string } }>()
const emit = defineEmits<{ close: []; save: [note: string] }>()
const { library, go } = useMail()
const note = ref('')
const noteId = useId()
watch(() => props.visible, open => { if (open) note.value = '' })

const changes = computed(() => {
  const a = props.saved, b = props.draft
  const list: string[] = []
  if (a.title !== b.title || a.description !== b.description) list.push('Name and description')
  if (a.base !== b.base) list.push(`Base template: ${library.find('base', b.base ?? '')?.title ?? b.base}`)
  if (a.subject !== b.subject) list.push('Subject')
  if (a.html !== b.html) list.push('HTML')
  if (a.text !== b.text) list.push('Plain text')
  if (JSON.stringify(properties(a.schema)) !== JSON.stringify(properties(b.schema)) || JSON.stringify(a.schema.required ?? []) !== JSON.stringify(b.schema.required ?? []))
    list.push(b.kind === 'message' ? 'Variables' : 'Inputs')
  if (JSON.stringify(samples(a)) !== JSON.stringify(samples(b))) list.push('Sample values')
  return list
})
const consequence = computed(() => props.draft.kind === 'message'
  ? 'Email sent after you save uses this version.'
  : `Every message that uses this ${kindLabels[props.draft.kind].toLowerCase()} changes when you save.`)
const dialogPt = { header: { class: 'mail-dialog-header' }, content: { class: 'mail-dialog-content' }, footer: { class: 'mail-dialog-footer' } }
</script>

<template>
  <Dialog :visible="visible" modal :draggable="false" :closable="!busy" :close-on-escape="!busy" class="mail-dialog" :pt="dialogPt"
    aria-label="Review changes" @update:visible="value => { if (!value) emit('close') }">
    <template #header>
      <span class="kx-modal-head-icon"><Icon icon="tabler:checklist" aria-hidden="true" /></span>
      <span class="kx-modal-head-text">
        <span class="kx-modal-head-title">Review changes</span>
        <span class="kx-modal-head-sub">{{ draft.title }}</span>
      </span>
    </template>
    <form id="mail-review" class="mail-form" @submit.prevent="emit('save', note.trim())">
      <div>
        <p class="mail-field-label">Changed</p>
        <ul class="mail-change-list"><li v-for="change in changes" :key="change">{{ change }}</li></ul>
      </div>
      <p class="mail-muted">{{ consequence }} The previous version stays in History.</p>
      <div class="mail-field">
        <label class="mail-field-label" :for="noteId">Note for History</label>
        <InputText :id="noteId" v-model="note" placeholder="What changed and why…" :disabled="busy" />
      </div>
      <div v-if="dependents" class="kx-notice error mail-block" role="alert">
        <Icon icon="tabler:alert-triangle" aria-hidden="true" />
        <div class="mail-failure-body">
          <strong>{{ dependents.names.length === 1 ? '1 message would break' : dependents.names.length + ' messages would break' }}.</strong>
          <span>{{ dependents.reason }}</span>
          <span class="mail-dependents">
            <button v-for="name in dependents.names" :key="name" type="button" class="mail-text-link"
              @click="emit('close'); go({ name: 'resource', kind: 'message', resource: name, section: 'content' })">{{ library.find('message', name)?.title ?? name }}</button>
          </span>
        </div>
      </div>
      <p v-else-if="error" class="kx-err inline" role="alert">{{ error }}</p>
    </form>
    <template #footer>
      <Button label="Keep editing" severity="secondary" outlined :disabled="busy" @click="emit('close')" />
      <Button label="Save" type="submit" form="mail-review" :loading="busy" :disabled="!!dependents" />
    </template>
  </Dialog>
</template>
