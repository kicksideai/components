<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Message from 'primevue/message'
import Textarea from 'primevue/textarea'
// The draft as JSON, for the whole picture and for changes the forms do not
// offer. A valid edit replaces the draft; an invalid one shows the error.
import { onUnmounted, ref, watch } from 'vue'
import type { Declaration } from '../../types'
import { parseDeclaration } from '../../state'

const props = defineProps<{ draft: Declaration; readonly?: boolean }>()
const emit = defineEmits<{ replace: [declaration: Declaration]; validity: [valid: boolean] }>()
const text = ref(JSON.stringify(props.draft, null, 2))
const error = ref('')
onUnmounted(() => emit('validity', true))
watch(() => props.draft, (d) => { text.value = JSON.stringify(d, null, 2); error.value = '' }, { deep: true })
function commit() {
  if (props.readonly) return
  try {
    const parsed = parseDeclaration(text.value)
    error.value = ''
    emit('validity', true)
    emit('replace', parsed)
  } catch (e) {
    emit('validity', false)
    error.value = 'Invalid declaration: ' + (e instanceof Error ? e.message : String(e))
  }
}
</script>

<template>
  <section class="form"><div class="pim-aspect">
    <header class="pim-aspect-head"><h3>Declaration</h3><span v-if="!readonly" class="muted small">edits apply to the draft when the JSON parses</span></header>
    <Message v-if="error" severity="error" role="alert">{{ error }}</Message>
    <Textarea v-model="text" :readonly="readonly" aria-label="Catalog declaration" rows="28" spellcheck="false" @input="commit" @blur="commit" class="mono pim-json-edit" />
  </div></section>
</template>
