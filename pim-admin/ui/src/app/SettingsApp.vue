<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useProps, useEvents, useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import SchemaBuilder from './builder/SchemaBuilder.vue'
import { requestGeneration } from '../shared/requests'
import { pim } from '../api'
const props = useProps<{ catalogId?: string; embedded?: boolean }>()
const emit = useEvents<{ navigate: { route: string } }>()
const title = ref('')
const catalogId = computed(() => props.value.catalogId ?? '')
const reads = requestGeneration()
async function loadTitle() {
  const current = reads.begin(), id = catalogId.value
  try {
    const catalog = await pim.catalogSummary(id)
    if (reads.current(current)) title.value = catalog?.title || 'Untitled catalog'
  } catch { if (reads.current(current)) title.value = 'Untitled catalog' }
}
watch(catalogId, () => { title.value = ''; void loadTitle() })
useHostVisibilityRefresh(loadTitle)
onUnmounted(() => { reads.begin() })
</script>
<template>
  <SchemaBuilder v-if="catalogId" :key="catalogId" :catalog-id="catalogId" :title="title || 'Catalog'" :embedded="props.embedded" :back-label="props.embedded ? undefined : 'Back to catalog settings'" @back="emit('navigate', { route: '' })" />
</template>
