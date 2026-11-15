<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
defineProps<{ label?: string }>()
</script>
<template>
  <button type="button" class="pim-interactive" :aria-label="label"><slot /></button>
</template>
