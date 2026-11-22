<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { inject, ref, useSlots, watch } from 'vue'
import ContentAction from '../ContentAction.vue'
import Tag from 'primevue/tag'
import { Icon } from '@iconify/vue'
import { sectionRow } from './sectionRow'
const props = defineProps<{ title: string; code?: string; kind?: string; kindLabel?: string; description?: string; initialOpen?: boolean; routeSection?: string; routeId?: string }>()
const open = ref(!!props.initialOpen)
const slots = useSlots()
const location = inject(sectionRow, undefined)
function matches(row: string | undefined) {
  return !!props.routeSection && !!props.routeId && row === props.routeSection + '/' + props.routeId
}
watch(() => location?.selected.value, (selected, previous) => {
  if (matches(selected)) open.value = true
  else if (matches(previous)) open.value = false
}, { immediate: true })
function toggle() {
  open.value = !open.value
  if (props.routeSection && props.routeId) location?.choose(props.routeSection, props.routeId, open.value)
}
</script>
<template>
  <article class="work-definition">
    <header class="work-definition-head" :class="{ 'work-definition-has-handle': slots.handle }">
      <div v-if="slots.handle" class="work-definition-handle"><slot name="handle" /></div>
      <div class="work-definition-lead">
        <ContentAction class="work-definition-toggle" :aria-expanded="open" @activate="toggle">
          <Icon icon="tabler:chevron-right" aria-hidden="true" />
          <span class="work-row-title" :title="title">{{ title }}</span>
        </ContentAction>
        <p v-if="description" class="work-definition-description">{{ description }}</p>
      </div>
      <div class="work-definition-details">
        <span class="work-definition-code"><code v-if="code" class="work-mono" :title="code">{{ code }}</code></span>
        <span class="work-definition-kind">
          <Tag v-if="kind" severity="secondary">
            <span v-if="kindLabel" class="work-definition-kind-label">{{ kindLabel }}:</span>
            <span class="work-definition-kind-value">{{ kind }}</span>
          </Tag>
          <slot name="status" />
        </span>
        <span class="work-definition-flags"><slot name="flags" /></span>
        <div class="work-definition-usage"><slot name="usage" /></div>
      </div>
      <div class="work-definition-actions"><slot name="actions" /></div>
    </header>
    <Transition name="work-panel">
      <div v-show="open" :inert="!open" class="work-definition-body work-stack"><slot /></div>
    </Transition>
  </article>
</template>
