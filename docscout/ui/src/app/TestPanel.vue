<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,ref} from 'vue'
import {Icon} from '@iconify/vue'
import Button from 'primevue/button'
import UploadPicker from './UploadPicker.vue'
import ResultFields from './ResultFields.vue'
import {stageIcons,stageLabels,type StageKey} from '../config'
import type {Extraction} from '../models'
const props=defineProps<{result:Extraction|null;retention:string;running?:boolean;canRun?:boolean}>()
const emit=defineEmits<{run:[upload_id:string]}>()
const upload=ref('')
const seconds=(ms:number)=>`${(ms/1000).toFixed(1)}s`
const longest=computed(()=>Math.max(1,...(props.result?.trace.map(t=>t.duration_ms)??[1])))
const extra:Record<string,{label:string;icon:string}>={read:{label:'Read document',icon:'tabler:file-text'},highlight:{label:'Highlighter',icon:'tabler:highlight'}}
const label=(kind:string)=>extra[kind]?.label??stageLabels[kind as StageKey]??kind
const icon=(kind:string)=>extra[kind]?.icon??stageIcons[kind as StageKey]??'tabler:point'
</script>
<template>
 <div class="test">
  <section class="run-bar">
   <div class="run-input"><UploadPicker :value="upload" @select="upload=$event"/></div>
   <Button :label="running?'Extracting…':'Run extraction'" :loading="running" :disabled="!upload||running||!canRun" @click="emit('run',upload)"/>
   <p class="muted run-note">{{canRun?'':'Add fields in the Builder first. '}}Processed documents and runs expire after {{retention}}.</p>
  </section>
  <p v-if="!result" class="empty">No extraction results yet.</p>
  <p v-if="result?.status==='failed'" class="run-failed" role="alert"><Icon icon="tabler:alert-triangle"/>The run stopped: {{result.error}}</p>
  <p v-if="result?.status==='partial'" class="eval-warning" role="status"><Icon icon="tabler:alert-triangle"/>Partial result · Some fields failed. Successful values are available below.</p>
  <div v-if="result" class="test-grid">
   <section class="block">
    <header class="block-head"><h2 class="block-title">Values</h2><span class="muted push">{{result.tokens.toLocaleString()}} tokens · {{seconds(result.duration_ms)}}<template v-if="result.pages"> · {{result.pages}} pages</template></span></header>
    <ResultFields :fields="result.fields"/>
   </section>
   <section class="block">
    <header class="block-head"><h2 class="block-title">Steps</h2></header>
    <ol class="timeline">
     <li v-for="(step,i) in result.trace" :key="i" :class="step.status">
      <span class="tl-icon"><Icon :icon="icon(step.kind)"/></span>
      <div class="tl-main">
       <div class="tl-head"><strong>{{label(step.kind)}}</strong><span class="muted push">{{seconds(step.duration_ms)}}</span></div>
       <span class="tl-bar"><span :style="{width:`${Math.max(4,step.duration_ms/longest*100)}%`}"/></span>
       <p class="muted">{{step.scope}}<template v-if="step.model"> · {{step.model}}</template> · {{(step.input_tokens+step.output_tokens).toLocaleString()}} tokens</p>
       <p v-if="step.message" class="tl-msg">{{step.message}}</p>
       <div v-if="step.queries?.length" class="chips"><span v-for="q in step.queries" :key="q" class="chip">{{q}}</span></div>
      </div>
     </li>
    </ol>
   </section>
  </div>
 </div>
</template>
