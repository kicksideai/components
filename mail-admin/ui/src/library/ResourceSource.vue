<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Tag from 'primevue/tag'
import { principalLabel } from '../principals'
import type { Resource } from '../types'

defineProps<{ resource: Resource }>()
</script>

<template>
  <span class="mail-source">
    <span>{{ resource.state === 'created' ? 'Created by ' + principalLabel(resource.author) : 'Included' }}</span>
    <Tag v-if="resource.state === 'customized'" severity="info" value="Customized" class="kx-tag-sm" />
  </span>
</template>
