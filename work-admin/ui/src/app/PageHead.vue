<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Button from 'primevue/button'
import { Icon } from '@iconify/vue'
const props = withDefaults(defineProps<{ title: string; subtitle?: string; icon?: string; backLabel?: string; focusBack?: boolean }>(), { icon: 'tabler:layout-kanban' })
defineEmits<{ back: [] }>()
const header = ref<HTMLElement>()
onMounted(() => { if (props.focusBack) header.value?.querySelector<HTMLButtonElement>('[data-back-button]')?.focus() })
</script>
<template>
  <header ref="header" class="kx-head">
    <Button v-if="backLabel" data-back-button :aria-label="backLabel" severity="secondary" text @click="$emit('back')"><Icon icon="tabler:arrow-left" aria-hidden="true" /></Button>
    <div class="kx-head-icon"><Icon :icon="icon" aria-hidden="true" /></div>
    <div class="kx-head-text"><slot name="identity"><h1 class="kx-title">{{ title }}</h1><p v-if="subtitle" class="kx-head-sub" :title="subtitle">{{ subtitle }}</p></slot></div>
    <div class="kx-head-actions"><slot /></div>
  </header>
</template>
