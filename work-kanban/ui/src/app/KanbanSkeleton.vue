<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Skeleton from 'primevue/skeleton'

withDefaults(defineProps<{ variant: 'board' | 'rows' | 'issue'; label: string; compact?: boolean; rows?: number }>(), { rows: 5 })
</script>

<template>
  <div class="kanban-skeleton" :data-variant="variant" role="status">
    <span class="kanban-visually-hidden">{{ label }}</span>
    <div v-if="variant === 'board'" class="kanban-skeleton-board" aria-hidden="true">
      <div v-for="column in 5" :key="column" class="kanban-skeleton-lane">
        <div class="kanban-column-head"><Skeleton animation="none" width="34%" height="12px" /></div>
        <div class="kanban-skeleton-cards">
          <Skeleton v-for="card in 4" :key="card" class="kanban-skeleton-card" animation="none"
            :height="compact ? '60px' : '80px'" />
        </div>
      </div>
    </div>
    <div v-else-if="variant === 'issue'" class="kanban-skeleton-issue" aria-hidden="true">
      <Skeleton animation="none" width="88%" height="48px" />
      <Skeleton v-for="field in 6" :key="field" animation="none" width="65%" height="28px" />
      <Skeleton animation="none" width="100%" height="58px" />
    </div>
    <div v-else class="kanban-skeleton-rows" aria-hidden="true">
      <Skeleton v-for="row in rows" :key="row" animation="none" height="28px" />
    </div>
  </div>
</template>
