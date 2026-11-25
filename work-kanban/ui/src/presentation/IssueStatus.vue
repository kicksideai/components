<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
defineProps<{ label: string; tone: string }>()
</script>

<template>
  <span class="kanban-status-value">
    <span class="kanban-column-signal" :data-status-tone="tone" aria-hidden="true" />
    <span>{{ label }}</span>
  </span>
</template>
