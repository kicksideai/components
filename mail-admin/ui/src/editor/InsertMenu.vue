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
import ResourcePicker from '../library/ResourcePicker.vue'
import type { LibraryPage, ResourceContent } from '../types'
import type { Face } from './problems'

// What can go into the open face at the cursor: variables, parts, images with alternative text and, in a base
// template, the message body. A popup menu, as sibling modules show their menus; an image asks for its
// alternative text before it goes in.
const props = defineProps<{ draft: ResourceContent; face: Face }>()
const emit = defineEmits<{ insert: [text: string] }>()
const { library } = useMail()

const menu = ref<{ toggle: (event: Event) => void }>()
const error = ref('')
// The first page of parts and images when the menu opens; a search finds the others.
const choices = ref<Partial<Record<'part' | 'asset', LibraryPage>>>({})
async function loadChoices(kind: 'part' | 'asset') {
  try {
    const page = await library.search(kind)
    choices.value = { ...choices.value, [kind]: page }
  } catch (failure) {
    error.value = describe(failure, kind === 'part' ? 'The parts could not be loaded.' : 'The images could not be loaded.')
  }
}
function toggle(event: Event) {
  error.value = ''
  choices.value = {}
  void loadChoices('part')
  if (props.face === 'html') void loadChoices('asset')
  menu.value?.toggle(event)
}
const finding = ref<'part' | 'asset'>()
const found = ref<string | null>()
useReturnFocus(() => !!finding.value)
function find(kind: 'part' | 'asset') {
  found.value = undefined
  finding.value = kind
}
function insertFound() {
  const kind = finding.value, name = found.value
  finding.value = undefined
  if (!kind || !name) return
  if (kind === 'part') void insertPart(name)
  else void chooseImage(name, library.title('asset', name) ?? name)
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

const image = ref<{ name: string; title: string }>()
const alt = ref('')
const altId = useId()
useReturnFocus(() => !!image.value)
async function chooseImage(name: string, title: string) {
  error.value = ''
  try {
    await libraryApi.get({ kind: 'asset', name })
    image.value = { name, title }
    alt.value = title
  } catch (failure) {
    error.value = describe(failure, 'The image could not be read.')
  }
}
function insertImage() {
  if (!image.value) return
  emit('insert', assetSnippet(image.value.name, alt.value))
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
  const partPage = choices.value.part
  const parts = (partPage?.items ?? []).filter(part => !(props.draft.kind === 'part' && part.name === props.draft.name))
  groups.push({ label: 'Parts', items: !partPage ? [loadingItem('Loading parts…')]
    : parts.length ? [...parts.map(part => ({ label: part.title, icon: kindIcons.part, command: () => { void insertPart(part.name) } })),
      ...(partPage.next_cursor ? [{ label: 'Find another part…', icon: 'tabler:search', command: () => find('part') }] : [])]
      : [{ label: 'There are no parts to include yet.', disabled: true }] })
  if (props.face === 'html') {
    const imagePage = choices.value.asset
    const images = imagePage?.items ?? []
    groups.push({ label: 'Images', items: !imagePage ? [loadingItem('Loading images…')]
      : images.length ? [...images.map(item => ({ label: item.title, icon: kindIcons.asset, command: () => { void chooseImage(item.name, item.title) } })),
        ...(imagePage.next_cursor ? [{ label: 'Find another image…', icon: 'tabler:search', command: () => find('asset') }] : [])]
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
  <Dialog :visible="!!finding" modal :draggable="false" class="mail-dialog" :pt="dialogPt" :aria-label="finding === 'part' ? 'Find a part' : 'Find an image'"
    @update:visible="value => { if (!value) finding = undefined }">
    <template #header>
      <span class="kx-modal-head-icon"><Icon :icon="finding === 'part' ? kindIcons.part : kindIcons.asset" aria-hidden="true" /></span>
      <span class="kx-modal-head-text">
        <span class="kx-modal-head-title">{{ finding === 'part' ? 'Insert a part' : 'Insert an image' }}</span>
        <span class="kx-modal-head-sub">Search the library, then insert at the cursor.</span>
      </span>
    </template>
    <ResourcePicker v-if="finding" v-model="found" :kind="finding" :label="finding === 'part' ? 'Part' : 'Image'" fluid
      :exclude="finding === 'part' && draft.kind === 'part' ? draft.name : undefined" placeholder="Choose…" />
    <template #footer>
      <Button label="Cancel" severity="secondary" outlined @click="finding = undefined" />
      <Button label="Insert" :disabled="!found" @click="insertFound" />
    </template>
  </Dialog>
</template>
