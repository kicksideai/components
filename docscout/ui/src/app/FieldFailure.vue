<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
import type {CaseError} from '../models'
const props=defineProps<{error?:CaseError|null}>()
const code=computed(()=>{
 const details=props.error?.details
 return details&&typeof details==='object'&&'code' in details&&typeof details.code==='string'?details.code:undefined
})
const budget= computed(()=>code.value==='context_budget_exceeded')
</script>
<template>
 <div class="field-failure" :data-error-kind="error?.kind" :data-error-code="code" role="note" aria-label="Field failure">
  <p><strong>{{budget?'Context budget exceeded':error?.kind}}</strong> · {{error?.message}}</p>
  <small>{{error?.retryable?'Retryable':'Not retryable'}}</small>
  <details v-if="error?.details"><summary class="kx-focus-outline">Error details</summary><pre>{{JSON.stringify(error.details,null,2)}}</pre></details>
 </div>
</template>
