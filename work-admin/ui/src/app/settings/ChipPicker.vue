<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import SelectButton from 'primevue/selectbutton'
import Button from 'primevue/button'
import { computed, ref } from 'vue'
import InputText from 'primevue/inputtext'
import { humanize } from '../../forms'
const props = defineProps<{ label: string; options: (string | { value: string; label?: string })[]; modelValue?: string[]; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const search = ref('')
const normalized = computed(() => props.options.map(option => typeof option === 'string' ? { value: option } : option))
const visible = computed(() => normalized.value.filter(o => (o.label ?? humanize(o.value)).toLocaleLowerCase().includes(search.value.toLocaleLowerCase())))
function toggle(value: string) { if (props.disabled) return; const current = props.modelValue ?? []; emit('update:modelValue', current.includes(value) ? current.filter(v => v !== value) : [...current, value]) }
</script>
<template>
  <fieldset class="work-chip-picker" :disabled="disabled"><legend>{{ label }}</legend>
    <InputText v-if="options.length > 10" v-model="search" type="search" :aria-label="'Find ' + label.toLowerCase()" placeholder="Find a choice…" />
    <div class="work-chips"><SelectButton :model-value="modelValue ?? []" :options="visible.map(option => ({ value: option.value, label: option.label ?? humanize(option.value) }))" optionLabel="label" optionValue="value" multiple :disabled="disabled" :aria-label="label" @update:model-value="emit('update:modelValue', $event ?? [])" />
      <Button v-for="value in modelValue?.filter(v => !normalized.some(o => o.value === v)) ?? []" severity="secondary" text size="small" :key="value" type="button" class="work-choice work-unavailable" :aria-label="'Remove unavailable ' + value" @click="toggle(value)">{{ humanize(value) }} · unavailable ×</Button></div>
    <span v-if="!options.length" class="work-muted work-small">No choices declared.</span>
  </fieldset>
</template>
