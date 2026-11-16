<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ensureTag } from '../mount'
defineProps<{ boardId: string }>()
const ready = ref(false)
onMounted(async () => { ready.value = await ensureTag('kickside-work-board-settings') })
</script>
<template>
  <kickside-work-board-settings v-if="ready" :board-id="boardId" />
  <p v-else class="kx-loading" role="status">Loading board settings…</p>
</template>
