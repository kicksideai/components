<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import type { Holder } from '../../types'
import PrincipalsPicker from './PrincipalsPicker.vue'
import type { Principal } from '../../principals'
import JsonInput from './JsonInput.vue'
const props = defineProps<{ modelValue?: Holder[]; label: string; boardId?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: Holder[] | undefined]; validity: [valid: boolean] }>()
const principals = computed<Principal[]>(() => (props.modelValue ?? []).flatMap(h => 'user' in h ? [{ kind: 'user', id: h.user }] : 'group' in h ? [{ kind: 'group', id: h.group }] : []))
function update(values: Principal[]) { const holders: Holder[] = [...(props.modelValue ?? []).filter(h => 'field' in h || 'service' in h), ...values.map(p => p.kind === 'group' ? { group: p.id } : { user: p.id })]; emit('update:modelValue', holders.length ? holders : undefined) }
</script>
<template><div class="work-stack work-tight"><PrincipalsPicker :board-id="boardId" :label="label" :model-value="principals" @update:model-value="update" /><JsonInput :label="label + ' rules'" :model-value="modelValue" shape="array" :example="[{ group: 'selected-group' }]" @update:model-value="emit('update:modelValue', $event as Holder[] | undefined)" @validity="emit('validity', $event)" /></div></template>
