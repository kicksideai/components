<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import Message from 'primevue/message'
import type { AdminError } from './transport'

defineProps<{ error: AdminError }>()
</script>

<template>
  <Message severity="error" role="alert">
    <div class="row wrap pim-error-content">
      <div>
        <div>{{ error.message }}</div>
        <Disclosure v-if="error.code" class="small pim-error-code pim-ia-disclosure" label="Technical details"> Error code <code>{{ error.code }}</code></Disclosure>
      </div>
      <slot />
    </div>
  </Message>
</template>
