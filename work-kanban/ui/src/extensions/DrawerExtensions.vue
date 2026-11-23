<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import type { WorkExtension } from '../work/types'
import type { ItemSummary } from '../presentation/query'
import ExtensionElement from './ExtensionElement.vue'
import { badgeSummary, drawerSlots } from './placements'

const props = defineProps<{ board: string, item?: ItemSummary, placements: readonly WorkExtension[] }>()
const slots = computed(() => props.item && drawerSlots(props.placements, props.item.type))
</script>

<template>
  <template v-if="item && slots">
    <ExtensionElement v-for="entry in slots.badges" :key="entry.id" :placement="entry" :input="{ item: badgeSummary(item) }" />
    <ExtensionElement v-for="entry in slots.panels" :key="entry.id" :placement="entry" :input="{ board, item: item.id }" />
  </template>
</template>
