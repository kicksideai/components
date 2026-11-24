<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { Asset } from '../types'
import { imageUrl } from './images'

// The image itself; while it loads, or when it cannot be read, the tile shows the image's format.
const props = defineProps<{ name: string; revision: number; asset?: Asset; large?: boolean; alt?: string }>()
const url = ref<string>()
watch(() => [props.name, props.revision] as const, async ([name, revision]) => {
  url.value = undefined
  url.value = await imageUrl(name, revision)
}, { immediate: true })
const format = computed(() => props.asset?.content_type?.replace(/^image\//, '').replace('jpeg', 'jpg').toUpperCase() ?? '')
</script>

<template>
  <span class="mail-asset-tile" :class="{ 'mail-asset-tile-large': large }">
    <img v-if="url" :src="url" :alt="alt ?? ''">
    <template v-else><Icon icon="tabler:photo" aria-hidden="true" /><span v-if="format" aria-hidden="true">{{ format }}</span></template>
  </span>
</template>
