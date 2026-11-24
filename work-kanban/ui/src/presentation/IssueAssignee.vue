<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import { avatarTone, Glyph, initials } from './glyphs'

const props = defineProps<{ id: string; name?: string; text?: boolean }>()
const label = computed(() => props.name || 'Assigned')
const letters = computed(() => initials(props.name))
</script>

<template>
  <span v-if="text" class="kanban-person">
    <span class="kanban-assignee" :class="'kanban-tone-' + avatarTone(id)" aria-hidden="true">
      <template v-if="letters">{{ letters }}</template><Glyph v-else name="tabler:user" />
    </span>
    <span>{{ label }}</span>
  </span>
  <span v-else class="kanban-assignee" :class="'kanban-tone-' + avatarTone(id)" :title="label" role="img" :aria-label="label">
    <template v-if="letters">{{ letters }}</template><Glyph v-else name="tabler:user" />
  </span>
</template>
