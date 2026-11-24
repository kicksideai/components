<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Tag from 'primevue/tag'
import { personLabel } from '../copy'
import type { LibraryRow } from '../types'

defineProps<{ resource: Pick<LibraryRow, 'kind' | 'state' | 'origin_label' | 'author' | 'author_label'> }>()
</script>

<template>
  <span class="mail-source">
    <span v-if="resource.state === 'created'">{{ (resource.kind === 'asset' ? 'Uploaded by ' : 'Created by ') + personLabel(resource.author_label, resource.author) }}</span>
    <span v-else>Included with {{ resource.origin_label }}</span>
    <Tag v-if="resource.state === 'customized'" severity="info" :value="resource.kind === 'asset' ? 'Replaced' : 'Customized'" class="kx-tag-sm" />
  </span>
</template>
