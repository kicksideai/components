<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
import {Icon} from '@iconify/vue'
import Toggle from './Toggle.vue'
import {fieldGroups,isOn,modelLabel,stageIcons,stageLabels,stageSummary,toolLabel,type Config,type StageKey} from '../config'
import type {TraceStep} from '../models'
const props=defineProps<{stage:StageKey;config:Config;active:boolean;trace?:TraceStep;readonly?:boolean}>()
const emit=defineEmits<{select:[]}>()
const on=computed(()=>isOn(props.config,props.stage))
const model=computed(()=>(props.config.stages[props.stage] as {model?:string}).model)
const enabled=computed({get:()=>on.value,set:(v:boolean)=>{(props.config.stages[props.stage] as {enabled:boolean}).enabled=v}})
const chips=computed(()=>{
 const c=props.config,s=c.stages
 switch(props.stage){
  case 'map':return c.fields.filter(f=>f.search_within==='sections').map(f=>({text:f.name||'New field',tone:'primary'}))
  case 'prefetch':return [...s.prefetch.queries.map(q=>({text:q.name||'Untitled query',tone:''})),...c.fields.filter(f=>f.search_hints.trim()).map(f=>({text:f.name,tone:'hint'}))]
  case 'scout':return s.scout.mode==='agent'?s.scout.tools.map(t=>({text:toolLabel(t).toLowerCase(),tone:''})):[]
  case 'deep':return c.fields.filter(f=>f.strategy==='deep').map(f=>({text:f.name||'New field',tone:'primary'}))
  case 'extract':return fieldGroups(c).map(g=>({text:`${g.name} · ${g.fields.length}`,tone:''}))
  default:return []
 }
})
const traceLine=(t:TraceStep)=>[`${(t.duration_ms/1000).toFixed(1)}s`,`${(t.input_tokens+t.output_tokens).toLocaleString()} tokens`,t.queries?.length?`${t.queries.length} queries`:'',t.message??''].filter(Boolean).join(' · ')
</script>
<template>
 <div class="node" :class="{active,off:!on,fixed:stage==='extract'}" role="button" tabindex="0" :aria-label="stageLabels[stage]" @click="emit('select')" @keydown.enter="emit('select')">
  <span class="node-icon"><Icon :icon="stageIcons[stage]"/></span>
  <span class="node-main">
   <span class="node-title">{{stageLabels[stage]}}</span>
   <span class="node-summary">{{on?stageSummary(stage,config):'Off'}}</span>
   <span v-if="on&&chips.length" class="chips"><span v-for="c in chips" :key="c.text" class="chip" :class="{primary:c.tone==='primary','muted-chip':c.tone==='hint'}">{{c.text}}</span></span>
   <span v-if="trace" class="trace-line"><Icon :icon="trace.status==='failed'?'tabler:alert-circle':'tabler:circle-check'"/>{{traceLine(trace)}}</span>
  </span>
  <span class="node-side">
   <span v-if="on&&model" class="chip model">{{modelLabel(model)}}</span>
   <Toggle v-if="stage!=='extract'&&!readonly" v-model="enabled" :label="`Enable ${stageLabels[stage]}`"/>
  </span>
 </div>
</template>
