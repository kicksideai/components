<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, onBeforeUnmount, watchEffect } from 'vue'
import Select from 'primevue/select'
import type { Declaration, PrincipalSource } from '../../types'
import type { Principal } from '../../principals'
import PrincipalsPicker from './PrincipalsPicker.vue'
const props = defineProps<{ modelValue: PrincipalSource; draft: Declaration; boardId?: string; label: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: PrincipalSource]; validity: [valid: boolean] }>()
const mode = computed(() => Array.isArray(props.modelValue) ? 'principals' : 'field' in props.modelValue ? 'field' : 'group')
const values = computed<Principal[]>(() => Array.isArray(props.modelValue) ? props.modelValue : 'group' in props.modelValue && props.modelValue.group ? [{ kind: 'group', id: props.modelValue.group }] : [])
function choose(value: string) { emit('update:modelValue', value === 'field' ? { field: '' } : value === 'group' ? { group: '' } : []) }
function pick(principals: Principal[]) { emit('update:modelValue', mode.value === 'group' ? { group: principals.at(-1)?.id ?? '' } : principals) }
watchEffect(() => emit('validity', Array.isArray(props.modelValue) ? props.modelValue.length > 0 : 'field' in props.modelValue ? !!props.modelValue.field : !!props.modelValue.group))
onBeforeUnmount(() => emit('validity', true))
</script>
<template>
  <section class="work-stack work-tight" :aria-label="label">
    <label class="work-stack work-tight">{{ label }} source<Select :model-value="mode" :aria-label="label + ' source'" :options="[{ label: 'Group', value: 'group' }, { label: 'People and groups', value: 'principals' }, { label: 'Principal field', value: 'field' }]" optionLabel="label" optionValue="value" appendTo="self" @update:model-value="choose" /></label>
    <label v-if="'field' in modelValue" class="work-stack work-tight">Principal field<Select :model-value="modelValue.field" :aria-label="label + ' field'" :options="draft.fields?.filter(f => f.type === 'principal').map(f => ({ label: f.title || f.code, value: f.code })) ?? []" optionLabel="label" optionValue="value" appendTo="self" @update:model-value="emit('update:modelValue', { field: $event })" /></label>
    <PrincipalsPicker v-else :board-id="boardId" :label="label" :kinds="mode === 'group' ? 'group' : 'user,group,service'" :model-value="values" @update:model-value="pick" />
  </section>
</template>
