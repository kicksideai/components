<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script lang="ts">
import { loadByTagName } from '@wippy-fe/proxy'

const registered = new Map<string, Promise<void>>()

function register(tag: string) {
  let pending = registered.get(tag)
  if (!pending) {
    pending = loadByTagName(tag).catch(error => {
      registered.delete(tag)
      throw error
    })
    registered.set(tag, pending)
  }
  return pending
}
</script>

<script setup lang="ts">
import { computed, onErrorCaptured, ref, watch } from 'vue'
import type { WorkExtension } from '../work/types'

const props = defineProps<{ placement: WorkExtension, input: Readonly<Record<string, unknown>> }>()
const emit = defineEmits<{ filter: [value: unknown] }>()
const ready = ref<string>()
const broken = ref(false)
const attributes = computed(() => Object.fromEntries(Object.entries(props.input).map(([key, value]) => [
  '^' + key, value != null && typeof value === 'object' ? JSON.stringify(value) : value,
])))

watch(() => props.placement.tag, async (tag, _, onCleanup) => {
  let current = true
  onCleanup(() => { current = false })
  ready.value = undefined
  broken.value = false
  if (!tag) return
  try {
    await register(tag)
    if (current) ready.value = tag
  } catch {
    if (current) broken.value = true
  }
}, { immediate: true })

onErrorCaptured(() => {
  broken.value = true
  return false
})
</script>

<template>
  <component v-if="ready && !broken" :is="ready" v-bind="attributes"
    @work-filter="(event: CustomEvent<unknown>) => emit('filter', event.detail)" />
</template>
