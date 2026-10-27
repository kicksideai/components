<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {ref} from 'vue'
import Button from 'primevue/button'
import UploadPicker from './UploadPicker.vue'
import type {Extraction} from '../models'
defineProps<{result:Extraction|null;retention:string}>()
const upload=ref('')
const percent=(n:number)=>`${Math.round(n*100)}%`
const value=(v:unknown)=>typeof v==='string'?v:JSON.stringify(v)
</script>
<template>
 <section class="test-input"><h2>Document</h2><div class="row wrap"><div class="grow"><UploadPicker :value="upload" @select="upload=$event"/></div><Button label="Run extraction" disabled/></div><p class="muted">Extraction is not available yet.</p><p class="retention">Processed documents and runs expire after {{retention}}.</p></section>
 <template v-if="result">
  <div class="section-head"><h2>Values</h2><span class="muted">{{result.tokens.toLocaleString()}} tokens · {{(result.duration_ms/1000).toFixed(1)}}s</span></div>
  <article v-for="field in result.fields" :key="field.name" class="field-card value-card"><header class="row"><h3>{{field.name}}</h3><span class="confidence push">{{percent(field.confidence)}} confidence</span></header><p class="value">{{value(field.value)}}</p><p class="muted">{{field.verified?'Verified':'Unverified'}}</p><blockquote v-for="(e,i) in field.evidence" :key="i"><p>“{{e.quote}}”</p><cite>{{e.section}}<template v-if="e.page!==undefined"> · Page {{e.page}}</template></cite></blockquote><p v-if="!field.evidence.length" class="muted">No evidence.</p></article>
  <h2>Trace</h2><ol class="trace"><li v-for="(step,i) in result.trace" :key="i"><div class="row wrap"><strong>{{step.kind}}</strong><span class="muted">{{step.status}}</span><span class="push">{{(step.duration_ms/1000).toFixed(1)}}s</span></div><p class="muted">{{step.scope}}<template v-if="step.model"> · {{step.model}}</template> · {{step.input_tokens+step.output_tokens}} tokens<template v-if="step.cost!==undefined"> · ${{step.cost.toFixed(4)}}</template></p><p v-if="step.message">{{step.message}}</p><ul v-if="step.queries?.length"><li v-for="query in step.queries" :key="query">{{query}}</li></ul></li></ol>
 </template>
 <p v-else class="empty">No extraction results yet.</p>
</template>
