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
const chosenUnit = ref<DurationUnit>(), error = ref('')
const parts = computed(() => props.modelValue ? durationParts(props.modelValue) : undefined)
const unit = computed(() => chosenUnit.value ?? parts.value?.unit ?? 'days')
watch(() => props.modelValue, value => {
  error.value = ''
  emit('validity', !value || !!parts.value, validityKey)
}, { immediate: true })
const amount = computed(() => props.modelValue ? durationParts(props.modelValue, unit.value)?.amount ?? null : null)
function update(value: number | null) { try { const duration = durationValue(value, unit.value); error.value = ''; emit('update:modelValue', duration); emit('validity', true, validityKey) } catch (e) { error.value = (e as Error).message; emit('validity', false, validityKey) } }
let nativeText: string | undefined
function nativeInput(event: Event) {
  if (event.target instanceof HTMLInputElement) nativeText = event.target.value
}
function commitNativeInput(value: number | null) {
  if (nativeText === undefined) return
  const text = nativeText
  nativeText = undefined
  edit(value, text)
}
function input(event: InputNumberInputEvent) {
  nativeText = undefined
  const text = event.originalEvent?.target instanceof HTMLInputElement ? event.originalEvent.target.value : event.formattedValue
  edit(event.value, text)
}
function edit(value: number | string | null | undefined, text: string) {
  if (text.trim() && (typeof value !== 'number' || !Number.isFinite(value))) {
    error.value = 'Enter a positive duration.'
    emit('validity', false, validityKey)
    return
  }
  chosenUnit.value = unit.value
  update(typeof value === 'number' ? value : null)
}
function changeUnit(next: DurationUnit) {
  const value = amount.value
  chosenUnit.value = next
  if (props.modelValue && !parts.value) return
  update(value)
}
onBeforeUnmount(() => emit('validity', true, validityKey))
</script>
<template>
  <label class="work-stack work-tight">{{ label }}<span class="work-duration-control" style="max-width: 360px" @input.capture="nativeInput"><InputNumber :model-value="amount" :aria-label="label" :min="0" :aria-invalid="!!error || !!modelValue && !durationParts(modelValue)" :disabled="disabled" :useGrouping="false" :max-fraction-digits="unit === 'seconds' ? 20 : 3" @input="input" @update:model-value="commitNativeInput" /><Select :model-value="unit" :aria-label="label + ' unit'" :disabled="disabled" :options="[{ label: 'Seconds', value: 'seconds' }, { label: 'Minutes', value: 'minutes' }, { label: 'Hours', value: 'hours' }, { label: 'Days', value: 'days' }]" optionLabel="label" optionValue="value" appendTo="self" @update:model-value="changeUnit($event)" /></span><span v-if="error || modelValue && !durationParts(modelValue)" class="work-error" role="alert">{{ error || `Unsupported duration: ${modelValue}` }}</span></label>
</template>
