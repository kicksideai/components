<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { record } from '../../values'
import { computed, onBeforeUnmount } from 'vue'
import ToggleSwitch from 'primevue/toggleswitch'
import JsonInput from './JsonInput.vue'
import FilterNode from '../query/FilterNode.vue'
import type { Declaration, Schema } from '../../types'
const props = defineProps<{ modelValue?: unknown; draft: Declaration; boardId?: string; label: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: unknown]; validity: [valid: boolean] }>()
const schema = computed<Schema>(() => ({ declaration: props.draft, compiled: props.draft, generation: 0, as_of: 0, key_prefix: '' }))
const invalid = new Set<string>()
function validity(key: string, valid: boolean) { if (valid) invalid.delete(key); else invalid.add(key); emit('validity', !invalid.size) }
function toggle(enabled: boolean) { emit('update:modelValue', enabled ? { field: props.draft.fields?.[0]?.code ?? 'state', op: 'eq' } : undefined); if (!enabled) { invalid.clear(); emit('validity', true) } }
onBeforeUnmount(() => emit('validity', true))
</script>
<template><section class="work-stack work-tight"><label class="work-row work-small"><ToggleSwitch :model-value="modelValue != null" :aria-label="label" @update:model-value="toggle" />{{ label }}</label><FilterNode v-if="modelValue != null" :schema="schema" :board-id="boardId ?? ''" :model-value="record(modelValue)" :path="label" @update:model-value="emit('update:modelValue', $event)" @validity="validity('structured', $event)" /><JsonInput v-if="modelValue != null" :label="label + ' predicate'" :model-value="modelValue" hint="Use any predicate accepted by Work, including installed or deeply nested forms." @update:model-value="emit('update:modelValue', $event)" @validity="validity('raw', $event)" /></section></template>
