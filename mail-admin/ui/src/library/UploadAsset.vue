<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import InputText from 'primevue/inputtext'
import { errorCode, library as libraryApi, uploads } from '../api'
import { useMail } from '../context'
import { rowOf } from './useLibrary'
import { useReturnFocus } from '../focus'
import { UploadFailed, whenCompleted } from './uploadState'
import { bytes, describe, namePattern, slug } from '../copy'
import type { Resource } from '../types'

// Upload a new image, or replace an existing one under the same name.
const props = defineProps<{ visible: boolean; replace?: Resource }>()
const emit = defineEmits<{ close: []; done: [asset: Resource] }>()
const { library, go } = useMail()
const ids = { file: useId(), title: useId(), name: useId() }
useReturnFocus(() => props.visible)

const accepted = ['image/png', 'image/jpeg', 'image/gif']
const limit = 1024 * 1024
const file = ref<File>()
const dimensions = ref<{ width: number; height: number }>()
const title = ref(''), name = ref(''), nameEdited = ref(false)
const busy = ref(false)
const phase = ref<'upload' | 'process' | 'save'>()
let signal = { cancelled: false }
const error = ref(''), fileError = ref(''), nameError = ref('')

watch(() => props.visible, open => {
  if (!open) { signal.cancelled = true; return }
  signal = { cancelled: false }
  if (!props.replace) library.ensure('asset')
  file.value = dimensions.value = undefined
  title.value = props.replace?.title ?? ''
  name.value = props.replace?.name ?? ''
  nameEdited.value = false
  error.value = fileError.value = nameError.value = ''
})
watch(title, value => { if (!props.replace && !nameEdited.value) name.value = slug(value) })

function measure(chosen: File): Promise<{ width: number; height: number } | undefined> {
  return new Promise(resolve => {
    const url = URL.createObjectURL(chosen)
    const image = new Image()
    image.onload = () => { resolve({ width: image.naturalWidth, height: image.naturalHeight }); URL.revokeObjectURL(url) }
    image.onerror = () => { resolve(undefined); URL.revokeObjectURL(url) }
    image.src = url
  })
}
async function choose(event: FileUploadSelectEvent) {
  const chosen = (Array.isArray(event.files) ? event.files[0] : event.files) as File | undefined
  fileError.value = ''
  file.value = undefined
  if (!chosen) return
  if (!accepted.includes(chosen.type)) { fileError.value = 'Use a PNG, JPEG or GIF image.'; return }
  if (chosen.size > limit) { fileError.value = 'Images must be 1 MB or smaller.'; return }
  file.value = chosen
  dimensions.value = await measure(chosen)
  if (!props.replace && !title.value) title.value = chosen.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
}

function validate(): boolean {
  nameError.value = ''
  if (props.replace) return true
  if (!namePattern.test(name.value)) nameError.value = 'Use lower-case letters, digits, hyphens and underscores, starting with a letter or digit.'
  else if (library.find('asset', name.value)) nameError.value = `An image named ${name.value} already exists. Choose another name or replace ${name.value}.`
  return !nameError.value
}

async function submit() {
  if (busy.value || !file.value || !title.value.trim() || !validate()) return
  busy.value = true
  error.value = ''
  const run = signal
  try {
    phase.value = 'upload'
    const upload = await uploads.add(file.value)
    phase.value = 'process'
    await whenCompleted(upload, run)
    phase.value = 'save'
    const body = { name: name.value, upload_id: upload, title: title.value.trim(), ...dimensions.value }
    const saved = props.replace
      ? await libraryApi.replaceAsset(body, props.replace.revision)
      : await libraryApi.addAsset(body)
    library.patch('asset', saved.name, rowOf(saved))
    emit('done', saved)
    emit('close')
    if (!props.replace) go({ name: 'library', section: 'assets', asset: saved.name })
  } catch (failure) {
    if (run.cancelled) return
    if (failure instanceof UploadFailed) error.value = 'The image could not be processed. Try another file, or upload it again.'
    else if (errorCode(failure) === 'mail_revision_conflict' && !props.replace) nameError.value = `An image named ${name.value} already exists. Choose another name or replace ${name.value}.`
    else error.value = describe(failure, 'The image could not be uploaded.')
  } finally {
    busy.value = false
    phase.value = undefined
  }
}
const progress = computed(() => phase.value === 'upload' ? 'Uploading the image…' : phase.value === 'process' ? 'Processing the image…' : phase.value === 'save' ? 'Adding it to the library…' : '')
const heading = computed(() => props.replace ? `Replace ${props.replace.title}` : 'Upload image')
const dialogPt = { header: { class: 'mail-dialog-header' }, content: { class: 'mail-dialog-content' }, footer: { class: 'mail-dialog-footer' } }
</script>

<template>
  <Dialog :visible="visible" modal :draggable="false" :closable="!busy || phase === 'process'" :close-on-escape="!busy || phase === 'process'" class="mail-dialog" :pt="dialogPt"
    :aria-label="heading" @update:visible="value => { if (!value) emit('close') }">
    <template #header>
      <span class="kx-modal-head-icon"><Icon icon="tabler:photo-up" aria-hidden="true" /></span>
      <span class="kx-modal-head-text">
        <span class="kx-modal-head-title">{{ heading }}</span>
        <span class="kx-modal-head-sub">{{ replace ? 'Every template that shows it changes at once.' : 'PNG, JPEG or GIF, up to 1 MB.' }}</span>
      </span>
    </template>
    <form id="mail-upload" class="mail-form" @submit.prevent="submit">
      <fieldset class="mail-fieldset" :disabled="busy" :inert="busy || undefined">
        <div class="mail-field" :class="{ 'mail-field-invalid': fileError }">
          <label class="mail-field-label" :for="ids.file">Image</label>
          <FileUpload mode="basic" :auto="false" custom-upload accept="image/png,image/jpeg,image/gif" :choose-label="file ? 'Choose another file' : 'Choose file'"
            class="mail-file-row" :pt="{ input: { id: ids.file, 'aria-label': 'Image file' } }" @select="choose">
            <template #chooseicon><Icon icon="tabler:file-upload" aria-hidden="true" /></template>
            <template #filelabel>
              <span class="mail-muted">{{ file ? `${file.name} · ${bytes(file.size)}${dimensions ? ` · ${dimensions.width} × ${dimensions.height}` : ''}` : 'No file chosen' }}</span>
            </template>
          </FileUpload>
          <small v-if="fileError" class="mail-field-error" role="alert">{{ fileError }}</small>
        </div>
        <div v-if="!replace" class="mail-field">
          <label class="mail-field-label" :for="ids.title">Name</label>
          <InputText :id="ids.title" v-model="title" />
        </div>
        <div v-if="!replace" class="mail-field" :class="{ 'mail-field-invalid': nameError }">
          <label class="mail-field-label" :for="ids.name">Reference</label>
          <InputText :id="ids.name" v-model="name" class="mail-mono-input" :invalid="!!nameError" :aria-describedby="ids.name + '-hint'" @input="nameEdited = true" />
          <small :id="ids.name + '-hint'" :class="nameError ? 'mail-field-error' : 'mail-field-hint'">{{ nameError || 'Templates show it with this name. It cannot change later.' }}</small>
        </div>
      </fieldset>
      <p v-if="progress" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />{{ progress }}</p>
      <p v-if="error" class="kx-err inline" role="alert">{{ error }}</p>
    </form>
    <template #footer>
      <Button label="Cancel" severity="secondary" outlined :disabled="busy && phase !== 'process'" @click="emit('close')" />
      <Button :label="replace ? 'Replace image' : 'Upload image'" type="submit" form="mail-upload" :loading="busy" :disabled="!file || (!replace && !title.trim())" />
    </template>
  </Dialog>
</template>
