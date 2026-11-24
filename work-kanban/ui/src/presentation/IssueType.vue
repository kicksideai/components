<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Glyph, typeIcon } from './glyphs'

defineProps<{ type: string; label?: string }>()
</script>

<template>
  <span class="kanban-card-type" role="img" :data-type="type" :aria-label="label ?? type" :title="label ?? type">
    <Glyph :name="typeIcon(type)" />
  </span>
</template>
