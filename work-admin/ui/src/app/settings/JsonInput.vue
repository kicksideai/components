<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import Textarea from 'primevue/textarea'
import { onBeforeUnmount, ref, watch } from 'vue'
const props = defineProps<{ label: string; modelValue?: unknown; shape?: 'object' | 'array'; hint?: string; example?: unknown; commit?: (value: unknown) => string | undefined }>()
const emit = defineEmits<{ 'update:modelValue': [value: unknown]; validity: [valid: boolean] }>()
const text = ref(''), error = ref('')
watch(() => props.modelValue, value => { text.value = value === undefined ? '' : JSON.stringify(value, null, 2); error.value = ''; emit('validity', true) }, { immediate: true })
onBeforeUnmount(() => emit('validity', true))
function update(value: string) {
  text.value = value
  try {
    const parsed: unknown = value.trim() ? JSON.parse(value) : undefined
    if (parsed !== undefined && props.shape === 'object' && (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))) throw new Error('Enter a JSON object.')
    if (parsed !== undefined && props.shape === 'array' && !Array.isArray(parsed)) throw new Error('Enter a JSON array.')
    if (props.commit) {
      const problem = props.commit(parsed)
      if (problem) throw new Error(problem)
    } else emit('update:modelValue', parsed)
    error.value = ''; emit('validity', true)
  } catch (e) { error.value = e instanceof Error ? e.message : 'Invalid JSON.'; emit('validity', false) }
}
</script>
<template>
  <Disclosure class="work-json-disclosure" :label="`Edit as JSON · ${label}`"><label class="work-stack work-tight"><span>{{ label }}</span><span v-if="hint" class="work-small work-muted">{{ hint }}</span><Textarea class="work-json-input" rows="3" :aria-label="label" :value="text" :aria-invalid="!!error" @input="update(($event.target as HTMLTextAreaElement).value)"></Textarea><span v-if="error" role="alert" class="work-error">{{ error }}</span></label><p class="work-small work-muted">Example</p><pre class="work-json-example">{{ JSON.stringify(example ?? (shape === 'array' ? [] : {}), null, 2) }}</pre></Disclosure>
</template>
