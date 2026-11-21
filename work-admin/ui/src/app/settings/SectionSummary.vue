<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
defineProps<{ facts: string[] }>()
</script>

<template>
  <p v-if="facts.length" class="work-muted">{{ facts.join(' · ') }}</p>
</template>
