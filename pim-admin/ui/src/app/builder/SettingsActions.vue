<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import type { CatalogAccess } from '../../types'

defineProps<{
  access?: CatalogAccess; dirty: boolean
  busy: boolean; valid: boolean; reviewed: boolean
}>()
const emit = defineEmits<{ discard: []; review: [] }>()
</script>

<template>
  <template v-if="access?.admin">
    <Tag v-if="dirty" severity="warn" value="Unsaved changes" />
    <Button severity="secondary" outlined :disabled="!dirty || busy" @click="emit('discard')"><Icon icon="tabler:restore" aria-hidden="true" /> Discard</Button>
    <Button v-if="!reviewed" :disabled="!dirty || busy || !valid" :loading="busy" @click="emit('review')">Review changes</Button>
  </template>
</template>
