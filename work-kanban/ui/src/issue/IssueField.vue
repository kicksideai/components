<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, nextTick, ref, useId, watch } from 'vue'
import FieldControl from './FieldControl.vue'
import Button from 'primevue/button'
import FieldDisplay from './FieldDisplay.vue'
import MarkdownView from './MarkdownView.vue'
import { richTextFields } from './model'
import type { Field, FieldValue } from './types'
import type { IssueWork } from './work'

const props = defineProps<{
  field: Field
  value?: FieldValue
  editable: boolean
  editing: boolean
  saving: boolean
  heading?: string
  board: string
  work: IssueWork
  name: (value: FieldValue) => string | undefined
}>()
const emit = defineEmits<{ edit: []; commit: []; cancel: []; input: [value: FieldValue] }>()
const editor = ref<HTMLElement>()
const trigger = ref<HTMLButtonElement>()
const control = ref<InstanceType<typeof FieldControl>>()
const headingId = useId()
const expandable = computed(() => Array.isArray(props.value) && props.value.length > 4)
const rich = computed(() => richTextFields.includes(props.field.code))
const text = computed(() => typeof props.value === 'string' ? props.value : '')
let restoreFocus = false

watch(() => props.editing, async editing => {
  await nextTick()
  if (editing) control.value?.focus()
  else if (restoreFocus) trigger.value?.focus({ preventScroll: true })
  restoreFocus = false
})

function leave(event: FocusEvent) {
  if (event.relatedTarget instanceof Node && editor.value?.contains(event.relatedTarget)) return
  void nextTick(() => { if (props.editing) emit('commit') })
}

function key(event: KeyboardEvent) {
  if (props.saving) return
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    restoreFocus = true
    emit('cancel')
    return
  }
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing
    || !(event.target instanceof Element) || event.target.closest('button, wc-principal-picker')) return
  if (rich.value && !event.metaKey && !event.ctrlKey) return
  // PrimeVue publishes the selected option or final numeric value in its own
  // handler. Wait for it before reading the draft, and keep open selectors open.
  if (event.target instanceof HTMLTextAreaElement) event.preventDefault()
  void nextTick(() => {
    if (!props.editing || editor.value?.querySelector('[aria-expanded="true"]')) return
    restoreFocus = true
    emit('commit')
  })
}
</script>

<template>
  <div v-if="editing" ref="editor" class="kanban-inline-editor" @focusout="leave" @keydown.capture="key">
    <FieldControl ref="control" :field="field" :model-value="value" :board="board" :work="work" inline
      :disabled="saving" @update:model-value="emit('input', $event)" />
    <div v-if="rich" class="kanban-issue-form-actions">
      <Button type="button" label="Cancel" severity="secondary" text size="small" :disabled="saving" @click="restoreFocus = true; emit('cancel')" />
      <Button type="button" label="Save" size="small" :loading="saving" @click="restoreFocus = true; emit('commit')" />
    </div>
  </div>
  <div v-else-if="rich && heading === undefined" class="kanban-rich-field">
    <MarkdownView v-if="text" :source="text" :collapsible="field.code === 'description'" />
    <button v-else-if="editable" type="button" class="kanban-rich-empty kx-focus-outline" :aria-disabled="saving || undefined"
      @click="!saving && emit('edit')">Add {{ field.title.toLowerCase() }}…</button>
    <p v-else class="kanban-rich-empty">No {{ field.title.toLowerCase() }}.</p>
    <button v-if="editable && text" ref="trigger" type="button" class="kx-iconbtn kx-focus-outline kanban-rich-edit"
      :aria-label="'Edit ' + field.title" :title="'Edit ' + field.title" :aria-disabled="saving || undefined"
      @click="!saving && emit('edit')">
      <Icon icon="tabler:pencil" aria-hidden="true" />
    </button>
  </div>
  <component :is="heading !== undefined ? 'h2' : 'div'" v-else :class="{ 'kanban-issue-title kx-title': heading !== undefined }"
    :aria-labelledby="heading !== undefined ? headingId : undefined">
    <FieldDisplay v-if="editable && expandable" :field="field" :value="value" :name="name" />
    <button v-if="editable" ref="trigger" type="button" class="kanban-inline-value kx-focus-outline"
      :aria-label="'Edit ' + field.title" :aria-disabled="saving || undefined" @click="!saving && emit('edit')">
      <span v-if="heading !== undefined" :id="headingId" dir="auto">{{ heading }}</span>
      <Icon v-else-if="expandable" icon="tabler:pencil" aria-hidden="true" />
      <FieldDisplay v-else :field="field" :value="value" :name="name" />
    </button>
    <span v-else-if="heading !== undefined" :id="headingId" dir="auto">{{ heading }}</span>
    <FieldDisplay v-else :field="field" :value="value" :name="name" />
  </component>
</template>
