<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Button from 'primevue/button'
import { Icon } from '@iconify/vue'

defineProps<{ title: string; subtitle: string; icon: string; backLabel?: string; pane?: boolean }>()
const emit = defineEmits<{ back: [] }>()
</script>

<template>
  <header class="kx-head" :class="{ 'pim-panel-head': pane }">
    <Button v-if="backLabel" type="button" :aria-label="backLabel" @click="emit('back')" text severity="secondary" size="small"><Icon icon="tabler:arrow-left" aria-hidden="true" /></Button>
    <div class="kx-head-icon"><Icon :icon="icon" aria-hidden="true" /></div>
    <div class="kx-head-text">
      <div class="pim-title-line"><component :is="pane ? 'h2' : 'h1'" class="kx-title">{{ title }}</component><slot name="meta" /></div>
      <p class="kx-head-sub" :title="subtitle">{{ subtitle }}</p>
    </div>
    <div class="kx-head-actions"><slot /></div>
  </header>
</template>
