<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { glyphId, spriteGlyphs } from './glyphs'
</script>

<template>
  <svg class="kanban-glyph-sprite" aria-hidden="true" focusable="false">
    <symbol v-for="name in spriteGlyphs" :id="glyphId(name)" :key="name" viewBox="0 0 24 24">
      <Icon :icon="name" width="24" height="24" />
    </symbol>
  </svg>
</template>
