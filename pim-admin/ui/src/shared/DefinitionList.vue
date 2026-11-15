<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, provide } from 'vue'
import { columnLabels, columnWidths, definitionColumns, type DefinitionColumn } from './definitions'

const props = withDefaults(defineProps<{ count: number; columns?: DefinitionColumn[] }>(), { columns: () => ['code'] })
provide(definitionColumns, computed(() => props.columns))
const template = computed(() => ['48px', 'minmax(160px, 1.4fr)', ...props.columns.map(column => columnWidths[column]), '80px'].join(' '))
</script>
<template>
  <section class="form pim-definition-list" :style="{ '--pim-definition-columns': template }">
    <slot name="head" />
    <div class="pim-definition-scroll" tabindex="0" aria-label="Definitions">
      <div class="pim-definition-grid">
        <div v-if="count > 3" class="pim-definition-columns" aria-hidden="true">
          <span></span><span>Name</span><span v-for="column in columns" :key="column" :class="'pim-definition-' + column">{{ columnLabels[column] }}</span><span></span>
        </div>
        <slot />
      </div>
    </div>
    <slot name="add" />
  </section>
</template>
