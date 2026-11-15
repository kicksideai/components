<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { ref, useSlots } from 'vue'
import ContentAction from '../ContentAction.vue'
import Tag from 'primevue/tag'
import { Icon } from '@iconify/vue'
defineProps<{ title: string; code?: string; kind?: string; description?: string }>()
const open = ref(false)
const slots = useSlots()
</script>
<template>
  <article class="work-definition">
    <header class="work-definition-head">
      <ContentAction as="article" class="work-definition-toggle" :class="{ 'work-definition-has-handle': slots.handle }" :aria-expanded="open" @activate="open = !open"><span class="work-definition-affordances"><slot name="handle" /><Icon :icon="open ? 'tabler:chevron-down' : 'tabler:chevron-right'" /></span><span class="work-row-title" :title="title">{{ title }}</span></ContentAction>
      <span class="work-definition-code"><code v-if="code" class="work-mono" :title="code">{{ code }}</code></span>
      <span class="work-definition-kind"><Tag v-if="kind" severity="secondary" :value="kind" /></span>
      <span class="work-definition-flags"><slot name="flags" /></span><div class="work-definition-usage"><slot name="usage" /></div><div class="work-definition-actions"><slot name="actions" /></div><p v-if="description" class="work-definition-description">{{ description }}</p>
    </header>
    <div v-show="open" class="work-definition-body work-stack"><slot /></div>
  </article>
</template>
