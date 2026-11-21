<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Button from 'primevue/button'
import { Icon } from '@iconify/vue'

const props = defineProps<{ title: string; subtitle: string; icon: string; backLabel?: string; focusBack?: boolean; pane?: boolean }>()
const emit = defineEmits<{ back: [] }>()
const header = ref<HTMLElement>()
onMounted(() => { if (props.focusBack) header.value?.querySelector<HTMLButtonElement>('[data-back-button]')?.focus() })
</script>

<template>
  <header ref="header" class="kx-head" :class="{ 'pim-panel-head': pane }">
    <Button v-if="backLabel" data-back-button type="button" :aria-label="backLabel" @click="emit('back')" text severity="secondary" size="small"><Icon icon="tabler:arrow-left" aria-hidden="true" /></Button>
    <div class="kx-head-icon"><Icon :icon="icon" aria-hidden="true" /></div>
    <div class="kx-head-text">
      <div class="pim-title-line"><component :is="pane ? 'h2' : 'h1'" class="kx-title">{{ title }}</component><slot name="meta" /></div>
      <p v-if="subtitle" class="kx-head-sub" :title="subtitle">{{ subtitle }}</p>
    </div>
    <div class="kx-head-actions"><slot /></div>
  </header>
</template>
