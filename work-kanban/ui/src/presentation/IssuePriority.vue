<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Glyph, priorityIcons } from './glyphs'

defineProps<{ priority: string; label?: string; text?: boolean }>()
</script>

<template>
  <span v-if="text" class="kanban-priority-label">
    <span class="kanban-card-priority" :data-priority="priority" aria-hidden="true">
      <Glyph :name="priorityIcons[priority] ?? 'tabler:flag'" />
    </span>
    {{ label ?? priority }}
  </span>
  <span v-else class="kanban-card-priority" role="img" :data-priority="priority"
    :aria-label="'Priority: ' + (label ?? priority)" :title="'Priority: ' + (label ?? priority)">
    <Glyph :name="priorityIcons[priority] ?? 'tabler:flag'" />
  </span>
</template>
