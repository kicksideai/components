<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { record } from '../../values'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { computed, ref, watch } from 'vue'
import FieldControl from '../FieldControl.vue'
import type { Field } from '../../types'
const props = defineProps<{ boardId: string; field: Field; modelValue: unknown; multiple?: boolean; label: string; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: unknown]; validity: [valid: boolean] }>()
const mode = computed(() => '$actor' in record(props.modelValue) ? 'actor' : '$now' in record(props.modelValue) ? 'now' : 'literal')
const text = ref(''), error = ref('')
watch(() => props.modelValue, value => { text.value = JSON.stringify(value ?? []); error.value = '' }, { immediate: true })
function choose(next: string) { emit('update:modelValue', next === 'actor' ? { $actor: 'id' } : next === 'now' ? { $now: 'P0D' } : undefined); emit('validity', true) }
function json(value: string) {
  text.value = value
  try { const parsed: unknown = JSON.parse(value); if (!Array.isArray(parsed)) throw new Error('Enter a JSON list.'); error.value = ''; emit('validity', true); emit('update:modelValue', parsed) }
  catch (e) { error.value = e instanceof Error ? e.message : 'Invalid values.'; emit('validity', false) }
}
</script>
<template>
  <div class="work-stack work-tight work-operand-control"><label class="work-row work-small">{{ label }}<Select :aria-label="label + ' operand'" :model-value="mode" :disabled="disabled" @update:model-value="choose($event)" appendTo="self" optionLabel="label" optionValue="value" optionDisabled="disabled" :options="[{ label: 'Value', value: 'literal', disabled: false }, { label: 'Current actor ($actor)', value: 'actor', disabled: false }, { label: 'Current time ($now)', value: 'now', disabled: false }]" /></label>
    <InputText v-if="mode === 'now'" :aria-label="label + ' time offset'" :value="record(modelValue).$now" :disabled="disabled" placeholder="-P7D" @input="emit('update:modelValue', { $now: ($event.target as HTMLInputElement).value })" />
    <span v-else-if="mode === 'actor'" class="work-muted work-small">The signed-in actor’s id</span>
    <div v-else-if="multiple" class="work-stack work-tight"><label class="work-small">Values as JSON (operands may appear in the list)<Textarea class="work-mono" :aria-label="label + ' values'" :value="text" :disabled="disabled" rows="2" @input="json(($event.target as HTMLTextAreaElement).value)" /></label><p v-if="error" class="work-error work-small" role="alert">{{ error }}</p></div>
    <FieldControl v-else :board-id="boardId" :field="{ ...field, cardinality: 'one' }" :model-value="modelValue" :disabled="disabled" :input-id="label.replace(/[^a-z0-9]/gi, '-')" @update:model-value="emit('update:modelValue', $event)" @validity="emit('validity', $event)" />
  </div>
</template>
