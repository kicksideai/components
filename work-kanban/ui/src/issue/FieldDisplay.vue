<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Tag from 'primevue/tag'
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import { principal } from './principals'
import type { Field, FieldValue, Scalar } from './types'

const props = defineProps<{
  field?: Field
  value?: FieldValue
  name?: (value: FieldValue) => string | undefined
}>()
const expanded = ref(false)
const shown = computed(() => Array.isArray(props.value) ? props.value.slice(0, expanded.value ? undefined : 4) : [])
const extra = computed(() => Array.isArray(props.value) ? props.value.length - 4 : 0)

function display(value: Scalar | null | undefined): string {
  if (value == null || value === '') return '—'
  const person = principal(value)
  if (person) return props.name?.(person) ?? (person.kind === 'group' ? 'Group unavailable' : 'Person unavailable')
  if (typeof value === 'object') return 'Referenced item'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  const option = props.field?.options?.find(option => option.id === value)
  if (option) return option.label ?? option.id
  if (props.field?.form === 'time' && typeof value === 'string') {
    const timestamp = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? value + 'T00:00:00' : value)
    if (!Number.isNaN(timestamp.valueOf())) return timestamp.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  }
  return String(value)
}
</script>

<template>
  <span v-if="Array.isArray(value) && value.length" class="issue-field-values">
    <Tag v-for="(entry, index) in shown" :key="index" class="kx-tag-sm" severity="secondary">
      <span dir="auto">{{ display(entry) }}</span>
    </Tag>
    <Button v-if="extra > 0" type="button" text size="small"
      :label="expanded ? 'Show fewer' : 'Show ' + extra + ' more'"
      :aria-label="(expanded ? 'Show fewer ' : 'Show ' + extra + ' more ') + (field?.title ?? 'values')"
      :aria-expanded="expanded" @click="expanded = !expanded" />
  </span>
  <span v-else class="issue-field-value" dir="auto">{{ display(Array.isArray(value) ? undefined : value) }}</span>
</template>
