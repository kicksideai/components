<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
defineProps<{ count: number; columns: 'fields' | 'types' | 'relations' | 'plugins' }>()
</script>
<template>
  <div class="work-definition-scroll">
    <div class="work-field-builder" :class="'work-definitions-' + columns">
      <div v-if="count > 3 && columns !== 'plugins'" class="work-definition-columns" aria-hidden="true">
        <span></span>
        <span>Name</span>
        <span class="work-definition-code">Identifier</span>
        <span>{{ columns === 'types' ? 'Workflow' : 'Kind' }}</span>
        <span v-if="columns === 'fields'">Details</span>
        <span class="work-definition-usage">{{ columns === 'fields' ? 'Used by' : 'Details' }}</span>
        <span></span>
      </div>
      <slot />
    </div>
  </div>
</template>
