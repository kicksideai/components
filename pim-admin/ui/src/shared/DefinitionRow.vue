<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, inject, useId, watch } from 'vue'
import InteractiveSurface from './InteractiveSurface.vue'
import Tag from 'primevue/tag'
import { Icon } from '@iconify/vue'
import { definitionColumns } from './definitions'

import { sectionRow } from './sectionRow'
const props = defineProps<{ title: string; code?: string; kind?: string; usage?: string; headClass?: string; toggleClass?: string; keepMounted?: boolean; routeSection?: string; routeId?: string }>()
const columns = inject(definitionColumns, computed(() => [
  ...(props.code ? ['code' as const] : []), ...(props.kind ? ['kind' as const] : []),
]))
const open = defineModel<boolean>('open', { default: false })
const bodyId = useId()
const location = inject(sectionRow, undefined)
function matches(row: string | undefined) {
  return !!props.routeSection && !!props.routeId && row === props.routeSection + '/' + props.routeId
}
watch(() => location?.selected.value, (selected, previous) => {
  if (matches(selected)) open.value = true
  else if (matches(previous)) open.value = false
}, { immediate: true })
function toggle() {
  const next = !open.value
  open.value = next
  if (props.routeSection && props.routeId) location?.choose(props.routeSection, props.routeId, next)
}
</script>
<template>
  <section class="pim-definition">
    <header class="pim-definition-head" :class="headClass">
      <InteractiveSurface class="pim-definition-toggle" :class="toggleClass" :aria-expanded="open" :aria-controls="open ? bodyId : undefined" @click="toggle">
        <span class="pim-definition-lead" data-column="lead"><Icon icon="tabler:chevron-right" class="pim-definition-chevron" aria-hidden="true" /></span>
        <span class="pim-row-title" data-column="name">{{ title }}</span>
        <span class="pim-definition-meta">
          <span v-for="column in columns" :key="column" :class="'pim-definition-' + column" :data-column="column">
            <code v-if="column === 'code' && code" class="mono">{{ code }}</code>
            <Tag v-else-if="column === 'kind' && kind" severity="secondary" :value="kind" />
            <slot v-else-if="column === 'details'" name="details" />
            <slot v-else-if="column === 'usage'" name="usage">{{ usage }}</slot>
          </span>
        </span>
      </InteractiveSurface>
      <div class="pim-definition-actions" data-column="actions"><slot name="actions" /></div>
    </header>
    <Transition name="pim-expand"><div v-if="open || keepMounted" v-show="open" :id="bodyId" class="pim-definition-body"><slot /></div></Transition>
  </section>
</template>
