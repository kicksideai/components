<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { EditorView } from '@codemirror/view'
import { createEditor, insertAtCursor, replaceDoc } from './codemirror'

const props = defineProps<{ modelValue: string; label: string; readOnly?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const host = ref<HTMLElement>()
let view: EditorView | undefined

onMounted(() => {
  const parent = host.value
  if (!parent) return
  view = createEditor({
    doc: props.modelValue, label: props.label, readOnly: !!props.readOnly,
    root: parent.getRootNode() as Document | ShadowRoot, parent,
    onChange: value => emit('update:modelValue', value),
  })
})
onBeforeUnmount(() => view?.destroy())
watch(() => props.modelValue, value => { if (view) replaceDoc(view, value) })

defineExpose({
  insert(text: string) { if (view) insertAtCursor(view, text) },
  focus() { view?.focus() },
})
</script>

<template>
  <div ref="host" class="mail-editor" :class="{ 'mail-editor-readonly': readOnly }" />
</template>
