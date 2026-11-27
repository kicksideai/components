<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import Textarea from 'primevue/textarea'
import { errorCode, library as libraryApi } from '../api'
import { blank } from '../content'
import { useMail, type CreateIntent } from '../context'
import { useReturnFocus } from '../focus'
import { describe, kindIcons, kindLabels, nameRule, slug } from '../copy'
import type { TemplateKind } from '../types'
import ResourcePicker from './ResourcePicker.vue'
import { rowOf } from './useLibrary'

const props = defineProps<{ visible: boolean; intent: CreateIntent }>()
const emit = defineEmits<{ close: [] }>()
const { library, go } = useMail()

const kind = ref<TemplateKind>('message')
const BLANK = '\u0000blank'
const source = ref('')
const title = ref(''), reference = ref(''), description = ref('')
const referenceEdited = ref(false)
const busy = ref(false)
const error = ref(''), referenceError = ref('')
const ids = { title: useId(), reference: useId(), description: useId(), source: useId(), hint: useId() }
const kinds = (['message', 'base', 'part'] as const).map(value => ({ value, label: kindLabels[value] }))
const fixedKind = computed(() => !!props.intent.from)

const blankChoice = [{ value: BLANK, label: 'Blank' }]
const chosen = computed(() => !!source.value)

function startFrom(name: string | null | undefined) {
  source.value = name ?? ''
  if (!name || name === BLANK) return
  const item = library.find(kind.value, name)
  if (!item) return
  description.value = item.description
  if (props.intent.from) {
    title.value = `${item.title} copy`
    referenceEdited.value = false
  }
}

// The resources to start from are read when the dialog opens, for the chosen kind only.
watch(() => props.visible, async open => {
  if (!open) return
  kind.value = (props.intent.from?.kind as TemplateKind | undefined) ?? props.intent.kind ?? 'message'
  title.value = reference.value = description.value = source.value = ''
  error.value = referenceError.value = ''
  referenceEdited.value = false
  if (props.intent.from) {
    const from = props.intent.from
    source.value = from.name
    try {
      await library.search(from.kind, undefined, [from.name])
    } catch (failure) {
      error.value = describe(failure, 'The resource to copy could not be read.')
    }
    if (props.visible) startFrom(from.name)
  } else {
    source.value = BLANK
  }
}, { immediate: true })
watch(kind, () => {
  if (props.intent.from) return
  source.value = BLANK
  description.value = ''
})
useReturnFocus(() => props.visible)
watch(title, value => { if (!referenceEdited.value) reference.value = slug(value) })

const referenceHint = computed(() => kind.value === 'message'
  ? 'Workflows, automations and agents use this to send the message. It cannot change later.'
  : 'Templates use this to include it. It cannot change later.')

function validate(): boolean {
  referenceError.value = ''
  if (!reference.value) referenceError.value = 'Enter a reference.'
  return !referenceError.value
}

async function submit() {
  if (busy.value || !title.value.trim() || !chosen.value || !validate()) return
  busy.value = true
  error.value = ''
  try {
    const created = source.value === BLANK
      ? await libraryApi.create(blank(kind.value, reference.value, title.value.trim(), description.value.trim()))
      : await libraryApi.copy({
        kind: kind.value, name: reference.value, title: title.value.trim(), description: description.value.trim(),
        from: { kind: kind.value, name: source.value },
      })
    library.patch(created.kind, created.name, rowOf(created))
    emit('close')
    go({ name: 'resource', kind: created.kind as TemplateKind, resource: created.name, section: 'content' })
  } catch (failure) {
    if (errorCode(failure) === 'mail_revision_conflict') referenceError.value = `A ${kindLabels[kind.value].toLowerCase()} with this reference already exists. Choose another.`
    else if (errorCode(failure) === 'invalid_mail_resource') referenceError.value = nameRule
    else error.value = describe(failure, 'The resource could not be created.')
  } finally {
    busy.value = false
  }
}

const dialogPt = { header: { class: 'mail-dialog-header' }, content: { class: 'mail-dialog-content' }, footer: { class: 'mail-dialog-footer' } }
const heading = computed(() => props.intent.from ? `Duplicate ${library.title(props.intent.from.kind, props.intent.from.name) ?? ''}`.trim() : `New ${kindLabels[kind.value].toLowerCase()}`)
</script>

<template>
  <Dialog :visible="visible" modal :draggable="false" :closable="!busy" :close-on-escape="!busy" class="mail-dialog" :pt="dialogPt"
    :aria-label="heading" @update:visible="value => { if (!value) emit('close') }">
    <template #header>
      <span class="kx-modal-head-icon"><Icon :icon="kindIcons[kind]" aria-hidden="true" /></span>
      <span class="kx-modal-head-text">
        <span class="kx-modal-head-title">{{ heading }}</span>
        <span class="kx-modal-head-sub">{{ source === BLANK ? 'It starts empty and opens in the editor.' : 'It starts as a copy and is yours to change.' }}</span>
      </span>
    </template>
    <form :id="ids.hint" class="mail-form" @submit.prevent="submit">
      <fieldset class="mail-fieldset" :disabled="busy" :inert="busy || undefined">
        <div v-if="!fixedKind" class="mail-field">
          <span class="mail-field-label">Kind</span>
          <SelectButton v-model="kind" :options="kinds" option-label="label" option-value="value" :allow-empty="false" aria-label="Kind" />
        </div>
        <div v-if="!fixedKind" class="mail-field">
          <label class="mail-field-label" :for="ids.source">Start from</label>
          <ResourcePicker :model-value="source" :kind="kind" label="Start from" :input-id="ids.source" :extra="blankChoice"
            placeholder="Choose a resource…" @update:model-value="startFrom" />
        </div>
        <div class="mail-field">
          <label class="mail-field-label" :for="ids.title">Name</label>
          <InputText :id="ids.title" v-model="title" autofocus required />
        </div>
        <div class="mail-field" :class="{ 'mail-field-invalid': referenceError }">
          <label class="mail-field-label" :for="ids.reference">Reference</label>
          <InputText :id="ids.reference" v-model="reference" class="mail-mono-input" :invalid="!!referenceError"
            :aria-describedby="ids.reference + '-hint'" @input="referenceEdited = true" />
          <small :id="ids.reference + '-hint'" :class="referenceError ? 'mail-field-error' : 'mail-field-hint'">{{ referenceError || referenceHint }}</small>
        </div>
        <div class="mail-field">
          <label class="mail-field-label" :for="ids.description">Description</label>
          <Textarea :id="ids.description" v-model="description" rows="2" auto-resize />
        </div>
      </fieldset>
      <p v-if="error" class="kx-err inline" role="alert">{{ error }}</p>
    </form>
    <template #footer>
      <Button label="Cancel" severity="secondary" outlined :disabled="busy" @click="emit('close')" />
      <Button :label="'Create ' + kindLabels[kind].toLowerCase()" type="submit" :form="ids.hint" :loading="busy" :disabled="!title.trim() || !chosen" />
    </template>
  </Dialog>
</template>
