<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Menu from 'primevue/menu'
import type { MenuItem } from 'primevue/menuitem'
import { library as libraryApi } from '../api'
import { assetSnippet, bodySlot, includeSnippet, variableSnippet } from '../content'
import { useMail } from '../context'
import { describe, kindIcons } from '../copy'
import { useReturnFocus } from '../focus'
import type { ResourceContent } from '../types'
import type { Face } from './problems'

// What can go into the open face at the cursor: variables, parts, images with alternative text and, in a base
// template, the message body. A popup menu, as sibling modules show their menus; an image asks for its
// alternative text before it goes in.
const props = defineProps<{ draft: ResourceContent; face: Face }>()
const emit = defineEmits<{ insert: [text: string] }>()
const { library } = useMail()

const menu = ref<{ toggle: (event: Event) => void }>()
const error = ref('')
function toggle(event: Event) {
  error.value = ''
  library.ensure('part')
  if (props.face === 'html') library.ensure('asset')
  menu.value?.toggle(event)
}
defineExpose({ toggle })

const globalValues = [
  { name: 'site.title', label: 'Workspace name' }, { name: 'site.url', label: 'Workspace address' },
  { name: 'sender.name', label: 'Sender’s name' }, { name: 'message.subject', label: 'Subject' },
]
const loadingItem = (label: string): MenuItem => ({ label, disabled: true, icon: 'tabler:loader-2' })

async function insertPart(name: string) {
  error.value = ''
  try {
    emit('insert', includeSnippet(await libraryApi.get({ kind: 'part', name })))
  } catch (failure) {
    error.value = describe(failure, 'The part could not be read.')
  }
}

const image = ref<{ name: string; title: string; width?: number }>()
const alt = ref('')
const altId = useId()
useReturnFocus(() => !!image.value)
async function chooseImage(name: string, title: string) {
  error.value = ''
  try {
    const asset = await libraryApi.get({ kind: 'asset', name })
    image.value = { name, title, width: asset.asset?.width }
    alt.value = title
  } catch (failure) {
    error.value = describe(failure, 'The image could not be read.')
  }
}
function insertImage() {
  if (!image.value) return
  emit('insert', assetSnippet(image.value.name, alt.value, image.value.width))
  image.value = undefined
}

const items = computed<MenuItem[]>(() => {
  const own = Object.entries(props.draft.schema.properties).map(([name]) => ({
    label: name, icon: 'tabler:variable',
    command: () => emit('insert', props.draft.kind === 'part' ? `{{ .${name} }}` : variableSnippet(name)),
  }))
  const groups: MenuItem[] = [{
    label: props.draft.kind === 'part' ? 'Inputs and values' : 'Variables and values',
    items: [...own, ...globalValues.map(value => ({ label: value.label, icon: 'tabler:world',
      command: () => emit('insert', `{{ ${value.name} }}`) }))],
  }]
  const parts = library.ofKind('part').filter(part => !(props.draft.kind === 'part' && part.name === props.draft.name))
  groups.push({ label: 'Parts', items: !library.ready('part') ? [loadingItem('Loading parts…')]
    : parts.length ? parts.map(part => ({ label: part.title, icon: kindIcons.part, command: () => { void insertPart(part.name) } }))
      : [{ label: 'There are no parts to include yet.', disabled: true }] })
  if (props.face === 'html') {
    const images = library.ofKind('asset')
    groups.push({ label: 'Images', items: !library.ready('asset') ? [loadingItem('Loading images…')]
      : images.length ? images.map(item => ({ label: item.title, icon: kindIcons.asset, command: () => { void chooseImage(item.name, item.title) } }))
        : [{ label: 'There are no images yet. Upload one in Images.', disabled: true }] })
  }
  if (props.draft.kind === 'base') {
    groups.push({ label: 'Layout', items: [{ label: 'Message body', icon: 'tabler:layout-rows',
      command: () => emit('insert', bodySlot) }] })
  }
  return groups
})
const dialogPt = { header: { class: 'mail-dialog-header' }, content: { class: 'mail-dialog-content' }, footer: { class: 'mail-dialog-footer' } }
</script>

<template>
  <Menu ref="menu" :model="items" popup :aria-label="'Insert into ' + (face === 'html' ? 'HTML' : 'plain text')"
    :pt="{ root: { style: 'max-height: min(420px, 70vh); overflow-y: auto; min-width: 260px' } }">
    <template #itemicon="{ item, class: iconClass }">
      <Icon v-if="item.icon" :icon="item.icon" :class="iconClass" aria-hidden="true" />
    </template>
  </Menu>
  <p v-if="error" class="kx-err inline" role="alert">{{ error }}</p>
  <Dialog :visible="!!image" modal :draggable="false" class="mail-dialog" :pt="dialogPt" aria-label="Insert image"
    @update:visible="value => { if (!value) image = undefined }">
    <template #header>
      <span class="kx-modal-head-icon"><Icon icon="tabler:photo-plus" aria-hidden="true" /></span>
      <span class="kx-modal-head-text">
        <span class="kx-modal-head-title">Insert {{ image?.title }}</span>
        <span class="kx-modal-head-sub">Added at the cursor in HTML.</span>
      </span>
    </template>
    <form id="mail-insert-image" class="mail-form" @submit.prevent="insertImage">
      <div class="mail-field">
        <label class="mail-field-label" :for="altId">Alternative text</label>
        <InputText :id="altId" v-model="alt" autofocus />
        <small class="mail-field-hint">Shown when the image does not load, and read aloud by screen readers.</small>
      </div>
    </form>
    <template #footer>
      <Button label="Cancel" severity="secondary" outlined @click="image = undefined" />
      <Button label="Insert image" type="submit" form="mail-insert-image" />
    </template>
  </Dialog>
</template>
