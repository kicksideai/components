<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import type { InputNumberInputEvent } from 'primevue/inputnumber'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { durationParts, durationValue, type DurationUnit } from './duration'
const props = defineProps<{ modelValue?: string; label: string; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string | undefined]; validity: [valid: boolean, key: string] }>()
const validityKey = 'duration:' + useId()
const unit = ref<DurationUnit>('days'), error = ref('')
watch(() => props.modelValue, value => { error.value = ''; const parts = value ? durationParts(value) : undefined; if (parts) unit.value = parts.unit; emit('validity', !value || !!parts, validityKey) }, { immediate: true })
const amount = computed(() => props.modelValue ? durationParts(props.modelValue, unit.value)?.amount ?? null : null)
function update(value: number | null) { try { const duration = durationValue(value, unit.value); error.value = ''; emit('update:modelValue', duration); emit('validity', true, validityKey) } catch (e) { error.value = (e as Error).message; emit('validity', false, validityKey) } }
function commit(value: number | null) { if (value == null && error.value) return; update(value) }
function input(event: InputNumberInputEvent) {
  if (event.formattedValue.trim() && (typeof event.value !== 'number' || !Number.isFinite(event.value))) { error.value = 'Enter a positive duration.'; emit('validity', false, validityKey) }
  else update(typeof event.value === 'number' ? event.value : null)
}
function changeUnit(next: DurationUnit) { const value = amount.value; unit.value = next; if (props.modelValue && !durationParts(props.modelValue)) return; update(value) }
onBeforeUnmount(() => emit('validity', true, validityKey))
</script>
<template>
  <label class="work-stack work-tight">{{ label }}<span class="work-duration-control" style="max-width: 360px"><InputNumber :model-value="amount" :aria-label="label" :min="0" :aria-invalid="!!error || !!modelValue && !durationParts(modelValue)" :disabled="disabled" :useGrouping="false" @input="input" @update:model-value="commit($event)" /><Select :model-value="unit" :aria-label="label + ' unit'" :disabled="disabled" :options="[{ label: 'Minutes', value: 'minutes' }, { label: 'Hours', value: 'hours' }, { label: 'Days', value: 'days' }]" optionLabel="label" optionValue="value" appendTo="self" @update:model-value="changeUnit($event)" /></span><span v-if="error || modelValue && !durationParts(modelValue)" class="work-error" role="alert">{{ error || `Unsupported duration: ${modelValue}` }}</span></label>
</template>
