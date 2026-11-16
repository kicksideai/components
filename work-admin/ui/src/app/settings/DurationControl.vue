<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { durationParts, durationValue, type DurationUnit } from './duration'
const props = defineProps<{ modelValue?: string; label: string; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string | undefined] }>()
const unit = ref<DurationUnit>('days'), error = ref('')
watch(() => props.modelValue, value => { error.value = ''; const parts = value ? durationParts(value) : undefined; if (parts) unit.value = parts.unit }, { immediate: true })
const amount = computed(() => props.modelValue ? durationParts(props.modelValue, unit.value)?.amount ?? null : null)
function update(value: number | null) { try { const duration = durationValue(value, unit.value); error.value = ''; emit('update:modelValue', duration) } catch (e) { error.value = (e as Error).message } }
function changeUnit(next: DurationUnit) { const value = amount.value; unit.value = next; if (props.modelValue && !durationParts(props.modelValue)) return; update(value) }
</script>
<template>
  <label class="work-stack work-tight">{{ label }}<span class="work-duration-control" style="max-width: 360px"><InputNumber :model-value="amount" :aria-label="label" :min="0" :disabled="disabled" :useGrouping="false" @update:model-value="update($event)" /><Select :model-value="unit" :aria-label="label + ' unit'" :disabled="disabled" :options="[{ label: 'Minutes', value: 'minutes' }, { label: 'Hours', value: 'hours' }, { label: 'Days', value: 'days' }]" optionLabel="label" optionValue="value" appendTo="self" @update:model-value="changeUnit($event)" /></span><span v-if="error || modelValue && !durationParts(modelValue)" class="work-error" role="alert">{{ error || `Unsupported duration: ${modelValue}` }}</span></label>
</template>
