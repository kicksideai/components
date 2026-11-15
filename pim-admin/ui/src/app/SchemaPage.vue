<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ensureTag } from './mount'
defineProps<{ catalogId: string }>()
const ready = ref(false)
onMounted(async () => { ready.value = await ensureTag('kickside-pim-catalog-settings') })
</script>
<template>
  <kickside-pim-catalog-settings v-if="ready" :catalog-id="catalogId" />
  <div v-else class="kx-loading" role="status">Loading catalog settings…</div>
</template>
