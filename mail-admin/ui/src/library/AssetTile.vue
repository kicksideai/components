<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { Asset } from '../types'

// Mail has no route that returns an image's bytes outside a rendered preview, so the list shows the image's kind.
const props = defineProps<{ asset?: Asset; large?: boolean }>()
const format = computed(() => props.asset?.content_type?.replace(/^image\//, '').replace('jpeg', 'jpg').toUpperCase() ?? '')
</script>

<template>
  <span class="mail-asset-tile" :class="{ 'mail-asset-tile-large': large }" aria-hidden="true">
    <Icon icon="tabler:photo" />
    <span v-if="format">{{ format }}</span>
  </span>
</template>
