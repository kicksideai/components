<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Button from 'primevue/button'
// A set of values shown as chips: options toggle on click; with free entry,
// typing a value and pressing Enter adds it.
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'

type Option = { value: string; label?: string; detail?: string }
const props = defineProps<{ modelValue: string[]; options?: Option[]; free?: boolean; placeholder?: string; disabled?: boolean; dropdown?: boolean; labelledby?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const entry = ref('')

function has(v: string): boolean {
  return props.modelValue.includes(v)
}
function toggle(v: string) {
  if (props.disabled || !v) return
  emit('update:modelValue', has(v) ? props.modelValue.filter((x) => x !== v) : [...props.modelValue, v])
}
function add() {
  const v = entry.value.trim()
  if (!v || has(v)) { entry.value = ''; return }
  emit('update:modelValue', [...props.modelValue, v])
  entry.value = ''
}
function remove(v: string) {
  emit('update:modelValue', props.modelValue.filter((x) => x !== v))
}
const selected = computed<Option[]>(() => props.modelValue.map(value => props.options?.find(option => option.value === value) ?? { value }))
function optionLabel(option: Option): string {
  const label = option.label ?? option.value
  return option.detail ? label + ' ' + option.detail : label
}
</script>

<template>
  <div class="pim-chips pim-picker-chips">
    <template v-if="disabled">
      <span v-for="option in selected" :key="option.value">
        {{ option.label ?? option.value }} <small v-if="option.detail" class="muted">{{ option.detail }}</small>
      </span>
      <span v-if="!modelValue.length" class="muted small">None</span>
    </template>
    <template v-else-if="options && (dropdown || options.length > 10)">
      <span v-for="option in selected" :key="option.value" class="row">
        <span>{{ option.label ?? option.value }} <small v-if="option.detail" class="muted">{{ option.detail }}</small></span>
        <Button type="button" :aria-label="'Remove ' + optionLabel(option)" @click="remove(option.value)" size="small" text severity="secondary"><Icon icon="tabler:x" aria-hidden="true" /></Button>
      </span>
      <Select v-if="!disabled" :model-value="null" :placeholder="placeholder ?? 'Add…'" :aria-labelledby="labelledby" :aria-label="placeholder ?? 'Add'"
        @update:model-value="toggle($event)" class="pim-chip-entry"
        :options="options.filter(option => !has(option.value))"
        :option-label="optionLabel" option-value="value" appendTo="self">
        <template #option="{ option }">
          <span>{{ option.label ?? option.value }} <small v-if="option.detail" class="muted">{{ option.detail }}</small></span>
        </template>
      </Select>
    </template>
    <template v-else-if="options">
      <SelectButton :model-value="modelValue.filter(v => options!.some(o => o.value === v))" :options="options.map(o => ({ value: o.value, label: o.label ?? o.value }))" option-label="label" option-value="value" multiple :disabled="disabled" :aria-labelledby="labelledby" :aria-label="placeholder ?? 'Selected values'" @update:model-value="emit('update:modelValue', [...$event, ...modelValue.filter(v => !options!.some(o => o.value === v))])" />
      <template v-for="v in modelValue.filter((x) => !options!.some((o) => o.value === x))" :key="v">
        <span class="row">{{ v }}<Button type="button" :aria-label="'Remove ' + v" @click="remove(v)" size="small" text severity="secondary"><Icon icon="tabler:x" /></Button></span>
      </template>
    </template>
    <template v-else>
      <span v-for="v in modelValue" :key="v" class="row">{{ v }}<Button type="button" :aria-label="'Remove ' + v" @click="remove(v)" size="small" text severity="secondary"><Icon icon="tabler:x" /></Button></span>
    </template>
    <InputText v-if="free && !disabled" v-model="entry" type="text" :aria-labelledby="labelledby" :placeholder="placeholder ?? 'Add…'" @keydown.enter.prevent="add" @blur="add" class="pim-chip-entry" />
  </div>
</template>
