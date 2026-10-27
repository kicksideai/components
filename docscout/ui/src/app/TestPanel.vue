<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,ref} from 'vue'
import {Icon} from '@iconify/vue'
import Button from 'primevue/button'
import UploadPicker from './UploadPicker.vue'
import {stepIcons,stepLabels,type StepKind} from '../config'
import type {Extraction} from '../models'
const props=defineProps<{result:Extraction|null;retention:string}>()
const upload=ref('')
const open=ref<string>()
const percent=(n:number)=>`${Math.round(n*100)}%`
const value=(v:unknown)=>v===null||v===undefined?'—':typeof v==='string'?v:JSON.stringify(v)
const seconds=(ms:number)=>`${(ms/1000).toFixed(1)}s`
const longest=computed(()=>Math.max(1,...(props.result?.trace.map(t=>t.duration_ms)??[1])))
const label=(kind:string)=>stepLabels[kind as StepKind]??kind
const icon=(kind:string)=>stepIcons[kind as StepKind]??'tabler:point'
const tone=(c:number)=>c>=.9?'high':c>=.7?'mid':'low'
</script>
<template>
 <div class="test">
  <section class="run-bar">
   <div class="run-input"><UploadPicker :value="upload" @select="upload=$event"/></div>
   <Button label="Run extraction" disabled/>
   <p class="muted run-note">Extraction is not available yet. Processed documents and runs expire after {{retention}}.</p>
  </section>
  <p v-if="!result" class="empty">No extraction results yet.</p>
  <div v-else class="test-grid">
   <section class="block">
    <header class="block-head"><h2 class="block-title">Values</h2><span class="muted push">{{result.tokens.toLocaleString()}} tokens · {{seconds(result.duration_ms)}}<template v-if="result.cost!==undefined"> · ${{result.cost.toFixed(3)}}</template></span></header>
    <ul class="value-list">
     <li v-for="field in result.fields" :key="field.name" class="value-row">
      <button type="button" class="value-main" :aria-expanded="open===field.name" @click="open=open===field.name?undefined:field.name">
       <span class="value-name">{{field.name}}</span>
       <span class="value-text">{{value(field.value)}}</span>
       <span class="confidence" :class="tone(field.confidence)"><span class="bar"><span :style="{width:percent(field.confidence)}"/></span>{{percent(field.confidence)}} confidence</span>
       <span class="chip" :class="field.verified?'primary':'muted-chip'"><Icon :icon="field.verified?'tabler:shield-check':'tabler:shield-question'"/>{{field.verified?'Verified':'Unverified'}}</span>
       <Icon :icon="open===field.name?'tabler:chevron-up':'tabler:chevron-down'" class="value-caret"/>
      </button>
      <div v-show="open===field.name||field.evidence.length===1" class="evidence">
       <blockquote v-for="(e,i) in field.evidence" :key="i"><p>“{{e.quote}}”</p><cite>{{e.section}}<template v-if="e.page!==undefined"> · Page {{e.page}}</template></cite></blockquote>
       <p v-if="!field.evidence.length" class="muted">No evidence.</p>
      </div>
     </li>
    </ul>
   </section>
   <section class="block">
    <header class="block-head"><h2 class="block-title">Steps</h2></header>
    <ol class="timeline">
     <li v-for="(step,i) in result.trace" :key="i" :class="step.status">
      <span class="tl-icon"><Icon :icon="icon(step.kind)"/></span>
      <div class="tl-main">
       <div class="tl-head"><strong>{{label(step.kind)}}</strong><span class="muted push">{{seconds(step.duration_ms)}}</span></div>
       <span class="tl-bar"><span :style="{width:`${Math.max(4,step.duration_ms/longest*100)}%`}"/></span>
       <p class="muted">{{step.scope}}<template v-if="step.model"> · {{step.model}}</template> · {{(step.input_tokens+step.output_tokens).toLocaleString()}} tokens<template v-if="step.cost!==undefined"> · ${{step.cost.toFixed(4)}}</template></p>
       <p v-if="step.message" class="tl-msg">{{step.message}}</p>
       <div v-if="step.queries?.length" class="chips"><span v-for="q in step.queries" :key="q" class="chip">{{q}}</span></div>
      </div>
     </li>
    </ol>
   </section>
  </div>
 </div>
</template>
