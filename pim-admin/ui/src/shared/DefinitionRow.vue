<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, inject } from 'vue'
import InteractiveSurface from './InteractiveSurface.vue'
import Tag from 'primevue/tag'
import { Icon } from '@iconify/vue'
import { definitionColumns } from './definitions'

const props = defineProps<{ title: string; code?: string; kind?: string; usage?: string; headClass?: string; toggleClass?: string }>()
const columns = inject(definitionColumns, computed(() => [
  ...(props.code ? ['code' as const] : []), ...(props.kind ? ['kind' as const] : []),
]))
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ 'head-keydown': [event: KeyboardEvent]; 'head-drop': [event: DragEvent]; 'head-dragover': [event: DragEvent] }>()
</script>
<template>
  <section class="pim-definition">
    <header class="pim-definition-head" :class="headClass" @keydown="emit('head-keydown', $event)" @drop="emit('head-drop', $event)" @dragover="emit('head-dragover', $event)">
      <InteractiveSurface class="pim-definition-toggle" :class="toggleClass" :aria-expanded="open" @click="open = !open">
        <span class="pim-definition-lead" data-column="lead"><slot name="handle" /><Icon :icon="open ? 'tabler:chevron-down' : 'tabler:chevron-right'" aria-hidden="true" /></span>
        <span class="pim-row-title" data-column="name">{{ title }}</span>
        <span v-for="column in columns" :key="column" :class="'pim-definition-' + column" :data-column="column">
          <code v-if="column === 'code' && code" class="mono">{{ code }}</code>
          <Tag v-else-if="column === 'kind' && kind" severity="secondary" :value="kind" />
          <slot v-else-if="column === 'details'" name="details" />
          <slot v-else-if="column === 'usage'" name="usage">{{ usage }}</slot>
        </span>
      </InteractiveSurface>
      <div class="pim-definition-actions" data-column="actions"><slot name="actions" /></div>
    </header>
    <div v-if="open" class="pim-definition-body"><slot /></div>
  </section>
</template>
