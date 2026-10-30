<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import type {CaseError} from '../models'
defineProps<{error?:CaseError|null}>()
</script>
<template>
 <div class="field-failure" :data-error-kind="error?.kind" role="note" aria-label="Field failure">
  <p><strong>{{error?.kind}}</strong> · {{error?.message}}</p>
  <small>{{error?.retryable?'Retryable':'Not retryable'}}</small>
  <details v-if="error?.details"><summary class="kx-focus-outline">Error details</summary><pre>{{JSON.stringify(error.details,null,2)}}</pre></details>
 </div>
</template>
