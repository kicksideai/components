<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
defineProps<{ count: number; columns: 'fields' | 'types' | 'relations' | 'plugins' }>()
</script>
<template>
  <div class="work-definition-scroll">
    <div class="work-field-builder" :class="'work-definitions-' + columns">
      <div v-if="count > 3" class="work-definition-columns" aria-hidden="true">
        <span></span><span>Name</span><span v-if="columns !== 'plugins'">Code</span><span>{{ columns === 'plugins' ? 'State' : columns === 'types' ? 'Process' : 'Kind' }}</span><span v-if="columns === 'fields' || columns === 'plugins'">Details</span><span v-if="columns !== 'plugins'" class="work-definition-usage">{{ columns === 'fields' ? 'Used by' : 'Details' }}</span><span></span>
      </div>
      <slot />
    </div>
  </div>
</template>
