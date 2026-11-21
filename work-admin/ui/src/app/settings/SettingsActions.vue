<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Button from 'primevue/button'
import { Icon } from '@iconify/vue'
defineProps<{ dirty: boolean; busy: boolean; checkingRemoval: boolean; disabled: boolean }>()
defineEmits<{ discard: []; primary: [opener: HTMLElement] }>()
</script>
<template>
  <span v-if="dirty" class="work-dirty">Unsaved changes</span>
  <Button class="work-discard" label="Discard" aria-label="Discard" title="Discard" severity="secondary" outlined :disabled="!dirty || busy || checkingRemoval" @click="$emit('discard')"><template #icon><Icon icon="tabler:restore" /></template></Button>
  <Button label="Review changes" :disabled="disabled" :loading="busy" @click="$emit('primary', $event.currentTarget as HTMLElement)" />
</template>
