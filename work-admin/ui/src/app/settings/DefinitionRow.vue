<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { ref, useSlots } from 'vue'
import ContentAction from '../ContentAction.vue'
import Tag from 'primevue/tag'
import { Icon } from '@iconify/vue'
const props = defineProps<{ title: string; code?: string; kind?: string; description?: string; initialOpen?: boolean }>()
const open = ref(!!props.initialOpen)
const slots = useSlots()
</script>
<template>
  <article class="work-definition">
    <header class="work-definition-head" :class="{ 'work-definition-has-handle': slots.handle }">
      <div v-if="slots.handle" class="work-definition-handle"><slot name="handle" /></div>
      <div class="work-definition-lead">
        <ContentAction class="work-definition-toggle" :aria-expanded="open" @activate="open = !open">
          <Icon icon="tabler:chevron-right" aria-hidden="true" />
          <span class="work-row-title" :title="title">{{ title }}</span>
        </ContentAction>
        <p v-if="description" class="work-definition-description">{{ description }}</p>
      </div>
      <div class="work-definition-details">
        <span class="work-definition-code"><code v-if="code" class="work-mono" :title="code">{{ code }}</code></span>
        <span class="work-definition-kind"><Tag v-if="kind" severity="secondary" :value="kind" /></span>
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
