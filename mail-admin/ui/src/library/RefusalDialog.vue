<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

export interface Refusal { header: string; message: string; links: { label: string; open: () => void }[] }

defineProps<{ refusal?: Refusal }>()
const emit = defineEmits<{ close: [] }>()
const dialogPt = { header: { class: 'mail-dialog-header' }, content: { class: 'mail-dialog-content' }, footer: { class: 'mail-dialog-footer' } }
function follow(open: () => void) {
  emit('close')
  open()
}
</script>

<template>
  <Dialog :visible="!!refusal" modal :draggable="false" :closable="false" close-on-escape class="mail-dialog" :pt="dialogPt" role="alertdialog"
    :aria-label="refusal?.header" @update:visible="value => { if (!value) emit('close') }">
    <template #header>
      <span class="kx-modal-head-icon mail-head-warn"><Icon icon="tabler:alert-triangle" aria-hidden="true" /></span>
      <span class="kx-modal-head-text"><span class="kx-modal-head-title">{{ refusal?.header }}</span></span>
    </template>
    <p class="mail-dialog-text">{{ refusal?.message }}</p>
    <ul v-if="refusal?.links.length" class="mail-list">
      <li v-for="link in refusal.links" :key="link.label">
        <button type="button" class="mail-row-link" @click="follow(link.open)"><Icon icon="tabler:mail" aria-hidden="true" /><span>{{ link.label }}</span></button>
      </li>
    </ul>
    <template #footer>
      <Button label="Close" autofocus @click="emit('close')" />
    </template>
  </Dialog>
</template>
