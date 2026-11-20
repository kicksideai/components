<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Message from 'primevue/message'
import type { AdminError } from './transport'

defineProps<{ error: AdminError }>()
</script>

<template>
  <Message severity="error" role="alert">
    <div class="row wrap pim-error-content">
      <div>
        <div>{{ error.message }}</div>
        <div v-if="error.code" class="small pim-error-code">Error code <code>{{ error.code }}</code></div>
      </div>
      <slot />
    </div>
  </Message>
</template>
