<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useProps, useEvents, useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import SchemaBuilder from './builder/SchemaBuilder.vue'
import { requestGeneration } from '../shared/requests'
import { pim } from '../api'
import type { CatalogRow, CatalogSettingsEvents } from '../types'
const props = useProps<{ catalogId?: string; embedded?: boolean; focusBack?: boolean; route?: string }>()
const emit = useEvents<CatalogSettingsEvents>()
const catalog = ref<CatalogRow>()
const catalogId = computed(() => props.value.catalogId ?? '')
const reads = requestGeneration()
async function loadCatalog() {
  const current = reads.begin(), id = catalogId.value
  try {
    const result = await pim.catalogSummary(id)
    if (reads.current(current)) catalog.value = result
  } catch { if (reads.current(current)) catalog.value = undefined }
}
watch(catalogId, () => { catalog.value = undefined; void loadCatalog() })
useHostVisibilityRefresh(loadCatalog)
onUnmounted(() => { reads.begin() })
function leaveSettings() {
  if (props.value.embedded) emit('open-catalog-picker', {})
  else emit('navigate', { route: '' })
}
</script>
<template>
  <SchemaBuilder v-if="catalogId" :key="catalogId" :catalog-id="catalogId" :title="catalog?.title || 'Catalog'" :catalog="catalog" :embedded="props.embedded" :focus-back="props.focusBack" :route="props.route" @navigate="route => emit('navigate', { route })" :back-label="props.embedded ? 'Back to catalogs' : 'Back to catalog settings'" @back="leaveSettings" @dirty-changed="emit('dirty-change', { dirty: $event })" />
</template>
