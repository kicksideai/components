<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { loadByTagName } from '@wippy-fe/proxy'
import Button from 'primevue/button'
import Popover from 'primevue/popover'
import Textarea from 'primevue/textarea'
import { computed, nextTick, ref, shallowRef, useId, watch } from 'vue'
import MarkdownView from './MarkdownView.vue'
import { applyFormat, continueList, type Edit, type Format } from './markdown'
import { usePrincipalNames } from './principals'
import type { Principal } from './types'

const props = defineProps<{
  label: string
  placeholder?: string
  disabled?: boolean
  compact?: boolean
  submitLabel?: string
  autofocus?: boolean
}>()
const model = defineModel<string>({ default: '' })
const mentions = defineModel<Principal[]>('mentions', { default: () => [] })
const emit = defineEmits<{ submit: []; cancel: [] }>()
const id = useId()
const root = ref<HTMLElement>()
const mentionPopover = ref<InstanceType<typeof Popover>>()
const mode = ref<'write' | 'preview'>('write')
const focused = ref(false)
const picker = ref(false)
const picked = shallowRef<Principal>()
const open = computed(() => !props.compact || focused.value || !!model.value || mode.value === 'preview')
const names = usePrincipalNames(() => picked.value ? [picked.value] : [])
const tools: { format: Format, icon: string, label: string, keys?: string }[] = [
  { format: 'bold', icon: 'tabler:bold', label: 'Bold', keys: 'B' },
  { format: 'italic', icon: 'tabler:italic', label: 'Italic', keys: 'I' },
  { format: 'code', icon: 'tabler:code', label: 'Code', keys: 'E' },
  { format: 'link', icon: 'tabler:link', label: 'Link', keys: 'K' },
  { format: 'bullet', icon: 'tabler:list', label: 'Bulleted list' },
  { format: 'number', icon: 'tabler:list-numbers', label: 'Numbered list' },
  { format: 'check', icon: 'tabler:list-check', label: 'Checklist' },
  { format: 'quote', icon: 'tabler:quote', label: 'Quote' },
]
const shortcut = /mac/i.test(navigator.platform) ? '⌘' : 'Ctrl+'

function area() {
  return root.value?.querySelector<HTMLTextAreaElement>('textarea') ?? undefined
}
function blur(event: FocusEvent) {
  focused.value = event.relatedTarget instanceof Node && !!root.value?.contains(event.relatedTarget)
}
async function apply(edit: Edit) {
  model.value = edit.text
  await nextTick()
  const element = area()
  element?.focus()
  element?.setSelectionRange(edit.start, edit.end)
}
function format(kind: Format) {
  const element = area()
  if (!element || props.disabled) return
  void apply(applyFormat(model.value, element.selectionStart, element.selectionEnd, kind))
}
function key(event: KeyboardEvent) {
  const element = area()
  if (!element || event.isComposing) return
  const command = event.metaKey || event.ctrlKey
  if (command && event.key === 'Enter') {
    event.preventDefault()
    if (model.value.trim()) emit('submit')
    return
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    emit('cancel')
    return
  }
  if (command && !event.altKey) {
    const tool = tools.find(row => row.keys === event.key.toUpperCase())
    if (tool) {
      event.preventDefault()
      format(tool.format)
      return
    }
  }
  if (event.key === 'Enter' && !event.shiftKey && element.selectionStart === element.selectionEnd) {
    const edit = continueList(model.value, element.selectionStart)
    if (edit) {
      event.preventDefault()
      void apply(edit)
    }
  }
}
function input$(event: Event) {
  const element = event.target as HTMLTextAreaElement
  const at = element.selectionStart
  if ((event as InputEvent).data === '@' && (at === 1 || /\s/.test(model.value[at - 2] ?? ''))) void mention(element)
}
async function mention(anchor?: HTMLElement) {
  try {
    await loadByTagName('wc-principal-picker')
    picker.value = true
  } catch {
    picker.value = false
  }
  mentionPopover.value?.show(new Event('click'), anchor ?? area())
}
function picked$(event: Event) {
  const detail = (event as CustomEvent<{ type?: string; id?: string; principal_id?: string }>).detail
  const kind = detail?.type
  const principalId = detail?.id ?? detail?.principal_id
  if ((kind !== 'user' && kind !== 'group') || !principalId) return
  picked.value = { kind, id: principalId }
}
watch(() => picked.value && names(picked.value), async name => {
  const person = picked.value
  if (!person || !name) return
  picked.value = undefined
  mentionPopover.value?.hide()
  if (!mentions.value.some(row => row.id === person.id && row.kind === person.kind)) mentions.value = [...mentions.value, person]
  const element = area()
  const at = element?.selectionStart ?? model.value.length
  const typed = model.value[at - 1] === '@'
  const text = '@' + name.replace(/\s+/g, ' ') + ' '
  const start = typed ? at - 1 : at
  await apply({ text: model.value.slice(0, start) + text + model.value.slice(at), start: start + text.length, end: start + text.length })
})
defineExpose({ focus: () => area()?.focus() })
</script>

<template>
  <div ref="root" class="kanban-editor" :data-open="open || undefined" :data-disabled="disabled || undefined"
    @focusin="focused = true" @focusout="blur">
    <div v-if="open" class="kanban-editor-bar" role="toolbar" :aria-label="label + ' formatting'">
      <div class="kanban-editor-modes" role="group" aria-label="Editor mode">
        <Button type="button" text size="small" label="Write" :aria-pressed="mode === 'write'" @click="mode = 'write'" />
        <Button type="button" text size="small" label="Preview" :aria-pressed="mode === 'preview'" :disabled="!model.trim()"
          @click="mode = 'preview'" />
      </div>
      <div v-show="mode === 'write'" class="kanban-editor-tools">
        <Button v-for="tool in tools" :key="tool.format" type="button" text size="small" severity="secondary"
          class="kanban-editor-tool" :aria-label="tool.label" :title="tool.label + (tool.keys ? ' (' + shortcut + tool.keys + ')' : '')"
          :disabled="disabled" @mousedown.prevent @click="format(tool.format)">
          <template #icon><Icon :icon="tool.icon" aria-hidden="true" /></template>
        </Button>
        <Button type="button" text size="small" severity="secondary" class="kanban-editor-tool" aria-label="Mention someone"
          title="Mention someone (@)" :disabled="disabled" @mousedown.prevent @click="mention($event.currentTarget as HTMLElement)">
          <template #icon><Icon icon="tabler:at" aria-hidden="true" /></template>
        </Button>
      </div>
    </div>
    <Textarea v-show="mode === 'write'" :id="id" v-model="model" class="kanban-editor-input" :aria-label="label"
      :placeholder="placeholder" :disabled="disabled" :rows="open ? 4 : 1" auto-resize fluid dir="auto" :autofocus="autofocus"
      @keydown="key" @input="input$" />
    <div v-if="mode === 'preview'" class="kanban-editor-preview" tabindex="0" :aria-label="label + ' preview'">
      <MarkdownView :source="model" />
    </div>
    <div v-if="open" class="kanban-editor-foot">
      <small class="kanban-editor-hint">Markdown supported · {{ shortcut }}Enter to {{ (submitLabel ?? 'save').toLowerCase() }}</small>
      <slot name="actions" />
    </div>
    <Popover ref="mentionPopover" append-to="self" :pt="{ root: { class: 'kanban-mention-popover' } }" aria-label="Mention someone">
      <wc-principal-picker v-if="picker" aria-label="Mention someone" value="{}" kinds="user,group" placeholder="Search people…"
        @config-changed="picked$" />
      <span v-else role="status">The people picker is unavailable.</span>
    </Popover>
  </div>
</template>
