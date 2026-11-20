<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import ConfigForm from './ConfigForm.vue'
import type { AttributeDecl, TypeOption } from '../../types'
import { decimalText, display as displayValue, type Dec } from '../../forms'
const props = defineProps<{ attribute: AttributeDecl; type?: TypeOption; disabled?: boolean }>()
const emit = defineEmits<{ change: [value: unknown] }>()
const schema = computed(() => {
  const form = props.type?.form
  let value: Record<string, unknown> = { type: 'string' }
  if (form === 'bool') value = { type: 'boolean' }
  else if (form === 'int') value = { type: 'integer' }
  else if (form === 'dec') value = { type: 'string', pattern: '^-?\\d+(\\.\\d+)?$', description: 'Exact number, for example 12.50.' }
  else if (form === 'quantity') value = { type: 'object', required: ['value', 'unit'], properties: { value: { type: 'string', title: 'Amount' }, unit: { type: 'string', title: 'Unit', enum: Object.keys(props.attribute.config?.units ?? {}) } }, additionalProperties: false }
  else if (form === 'record') value = { type: 'object', additionalProperties: true }
  else if (form === 'ref') value = { type: 'object', required: ['ref'], properties: { ref: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 2, description: `Reference kind (${props.type?.target ?? 'link kind'}) and identity.` } }, additionalProperties: false }
  if ((props.attribute.cardinality ?? 'one') !== 'one') value = { type: 'array', items: value, uniqueItems: props.attribute.cardinality === 'set' }
  return { type: 'object', properties: { value: { ...value, title: 'Default value' } } }
})
function decimal(value: unknown): unknown {
  return value && typeof value === 'object' && 'm' in value && 'e' in value ? decimalText(value as Dec) : value
}
function display(value: unknown): unknown {
  if (props.type?.form === 'dec') return decimal(value)
  if (props.type?.form === 'quantity' && value && typeof value === 'object' && 'v' in value && 'u' in value) return { value: decimal(value.v), unit: value.u }
  return value
}
const config = computed(() => props.attribute.default === undefined ? {} : { value: Array.isArray(props.attribute.default) ? props.attribute.default.map(display) : display(props.attribute.default) })
</script>
<template>
  <span v-if="disabled">{{ attribute.default == null ? 'No default' : displayValue(attribute.default) }}</span>
  <ConfigForm v-else :schema="schema" :model-value="config" @update:model-value="emit('change', $event.value)" />
</template>
