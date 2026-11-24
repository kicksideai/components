<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import { library as libraryApi } from '../api'
import { assetSnippet, bodySlot, includeSnippet, variableSnippet } from '../content'
import { useMail } from '../context'
import { describe, kindIcons } from '../copy'
import type { ResourceContent } from '../types'
import type { Face } from './problems'
import AssetTile from '../library/AssetTile.vue'

// Insert is a dialog, like New: popup menus lose real pointer clicks inside the shadow root.
const props = defineProps<{ visible: boolean; draft: ResourceContent; face: Face }>()
const emit = defineEmits<{ close: []; insert: [text: string] }>()
const { library } = useMail()

type Tab = 'variable' | 'part' | 'image' | 'block'
const tab = ref<Tab>('variable')
const tabs = computed(() => [
  { label: 'Variable', value: 'variable' },
  { label: 'Part', value: 'part' },
  ...(props.face === 'html' ? [{ label: 'Image', value: 'image' }] : []),
  ...(props.draft.kind === 'base' ? [{ label: 'Message body', value: 'block' }] : []),
] as { label: string; value: Tab }[])
watch(() => props.visible, open => { if (open) { tab.value = 'variable'; image.value = undefined; error.value = '' } })

const globalValues = [
  { name: 'site.title', hint: 'Your workspace name' }, { name: 'site.url', hint: 'Your workspace address' },
  { name: 'sender.name', hint: 'The person sending the message' }, { name: 'message.subject', hint: 'This message’s subject' },
]
const variables = computed(() => {
  const own = Object.entries(props.draft.schema.properties).map(([name, schema]) => ({
    text: props.draft.kind === 'part' ? `{{ .${name} }}` : variableSnippet(name),
    name, hint: typeof schema.description === 'string' ? schema.description : '',
  }))
  return [...own, ...globalValues.map(value => ({ text: `{{ ${value.name} }}`, name: value.name, hint: value.hint }))]
})
const parts = computed(() => library.ofKind('part').filter(part => !(props.draft.kind === 'part' && part.name === props.draft.name)))
const images = computed(() => library.ofKind('asset'))

const busy = ref(''), error = ref('')
async function insertPart(name: string) {
  busy.value = name
  error.value = ''
  try {
    emit('insert', includeSnippet(await libraryApi.get({ kind: 'part', name })))
  } catch (failure) {
    error.value = describe(failure, 'The part could not be read.')
  } finally {
    busy.value = ''
  }
}

const image = ref<{ name: string; title: string; width?: number }>()
const alt = ref('')
const altId = useId()
async function chooseImage(name: string, title: string) {
  busy.value = name
  error.value = ''
  try {
    const asset = await libraryApi.get({ kind: 'asset', name })
    image.value = { name, title, width: asset.asset?.width }
    alt.value = title
  } catch (failure) {
    error.value = describe(failure, 'The image could not be read.')
  } finally {
    busy.value = ''
  }
}
const dialogPt = { header: { class: 'mail-dialog-header' }, content: { class: 'mail-dialog-content' }, footer: { class: 'mail-dialog-footer' } }
</script>

<template>
  <Dialog :visible="visible" modal :draggable="false" class="mail-dialog" :pt="dialogPt" aria-label="Insert"
    @update:visible="value => { if (!value) emit('close') }">
    <template #header>
      <span class="kx-modal-head-icon"><Icon icon="tabler:code-plus" aria-hidden="true" /></span>
      <span class="kx-modal-head-text">
        <span class="kx-modal-head-title">Insert</span>
        <span class="kx-modal-head-sub">Added at the cursor in {{ face === 'html' ? 'HTML' : 'plain text' }}.</span>
      </span>
    </template>
    <div class="mail-form">
      <SelectButton v-model="tab" :options="tabs" option-label="label" option-value="value" :allow-empty="false" aria-label="What to insert" />
      <p v-if="error" class="kx-err inline" role="alert">{{ error }}</p>

      <ul v-if="tab === 'variable'" class="mail-list mail-insert-list">
        <li v-for="item in variables" :key="item.name">
          <button type="button" class="mail-row-link" @click="emit('insert', item.text)">
            <Icon icon="tabler:variable" aria-hidden="true" />
            <span class="mail-list-main"><span class="mail-mono">{{ item.name }}</span><span v-if="item.hint" class="mail-sub">{{ item.hint }}</span></span>
          </button>
        </li>
      </ul>

      <template v-else-if="tab === 'part'">
        <p v-if="!parts.length" class="mail-muted">There are no parts to include yet.</p>
        <ul v-else class="mail-list mail-insert-list">
          <li v-for="part in parts" :key="part.name">
            <button type="button" class="mail-row-link" :disabled="!!busy" @click="insertPart(part.name)">
              <Icon :icon="busy === part.name ? 'tabler:loader-2' : kindIcons.part" :class="{ spin: busy === part.name }" aria-hidden="true" />
              <span class="mail-list-main"><span>{{ part.title }}</span><span class="mail-sub">{{ part.description }}</span></span>
            </button>
          </li>
        </ul>
      </template>

      <template v-else-if="tab === 'image'">
        <form v-if="image" class="mail-form" @submit.prevent="emit('insert', assetSnippet(image.name, alt, image.width))">
          <div class="mail-field">
            <label class="mail-field-label" :for="altId">Alternative text for {{ image.title }}</label>
            <InputText :id="altId" v-model="alt" autofocus />
            <small class="mail-field-hint">Shown when the image does not load, and read aloud by screen readers.</small>
          </div>
          <div class="mail-dialog-actions">
            <Button label="Back" severity="secondary" outlined @click="image = undefined" />
            <Button label="Insert image" type="submit" />
          </div>
        </form>
        <p v-else-if="!images.length" class="mail-muted">There are no images yet. Upload one in Assets.</p>
        <ul v-else class="mail-list mail-insert-list">
          <li v-for="item in images" :key="item.name">
            <button type="button" class="mail-row-link" :disabled="!!busy" @click="chooseImage(item.name, item.title)">
              <AssetTile :name="item.name" :revision="item.revision" />
              <span class="mail-list-main"><span>{{ item.title }}</span><span class="mail-sub mail-mono-block">{{ item.name }}</span></span>
              <Icon v-if="busy === item.name" icon="tabler:loader-2" class="spin" aria-hidden="true" />
            </button>
          </li>
        </ul>
      </template>

      <ul v-else class="mail-list mail-insert-list">
        <li>
          <button type="button" class="mail-row-link" @click="emit('insert', bodySlot)">
            <Icon icon="tabler:layout-rows" aria-hidden="true" />
            <span class="mail-list-main"><span>Message body</span><span class="mail-sub">Where each message that uses this base template appears.</span></span>
          </button>
        </li>
      </ul>
    </div>
  </Dialog>
</template>
