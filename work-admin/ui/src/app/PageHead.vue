<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Button from 'primevue/button'
import { Icon } from '@iconify/vue'
withDefaults(defineProps<{ title: string; subtitle?: string; icon?: string; backLabel?: string }>(), { icon: 'tabler:layout-kanban' })
defineEmits<{ back: [] }>()
</script>
<template>
  <header class="kx-head">
    <Button v-if="backLabel" :aria-label="backLabel" severity="secondary" text @click="$emit('back')"><Icon icon="tabler:arrow-left" aria-hidden="true" /></Button>
    <div class="kx-head-icon"><Icon :icon="icon" aria-hidden="true" /></div>
    <div class="kx-head-text"><slot name="identity"><h1 class="kx-title">{{ title }}</h1><p v-if="subtitle" class="kx-head-sub" :title="subtitle">{{ subtitle }}</p></slot></div>
    <div class="kx-head-actions"><slot /></div>
  </header>
</template>
