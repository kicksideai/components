<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,ref,watch} from 'vue'
import {Icon} from '@iconify/vue'
import Button from 'primevue/button'
import UploadPicker from './UploadPicker.vue'
import type {Field} from '../config'
import type {EvalCase,EvalResult,Proposal} from '../models'
const props=defineProps<{cases:EvalCase[];results:EvalResult[];proposals:Proposal[];fields:Field[];saving?:boolean}>()
const emit=defineEmits<{'add-case':[input:{upload_id:string;upload_name:string;expected:Record<string,unknown>}];'delete-case':[id:string]}>()
const adding=ref(false),upload=ref(''),uploadName=ref(''),expected=ref<Record<string,string>>({}),error=ref('')
watch(()=>props.cases,()=>{adding.value=false;upload.value='';expected.value={}})
function addCase(){
 error.value=''
 const values:Record<string,unknown>={}
 try{
  for(const field of props.fields){
   const raw=expected.value[field.name]??''
   values[field.name]=['number','boolean','list','object'].includes(field.type)?(raw.trim()?JSON.parse(raw):null):raw
  }
  emit('add-case',{upload_id:upload.value,upload_name:uploadName.value,expected:values})
 }catch{error.value='Use valid JSON for numbers, lists, and objects.'}
}
const ordered=computed(()=>[...props.results].sort((a,b)=>a.revision-b.revision))
const leftRev=ref<number>(),rightRev=ref<number>()
const right=computed(()=>ordered.value.find(r=>r.revision===rightRev.value)??ordered.value.at(-1))
const left=computed(()=>ordered.value.find(r=>r.revision===leftRev.value)??ordered.value.at(-2)??ordered.value.at(-1))
const mean=(r?:EvalResult)=>r&&r.metrics.length?r.metrics.reduce((s,m)=>s+m.accuracy,0)/r.metrics.length:0
const rows=computed(()=>{const names=[...new Set([...(left.value?.metrics??[]),...(right.value?.metrics??[])].map(m=>m.field))];return names.map(name=>({name,a:left.value?.metrics.find(m=>m.field===name),b:right.value?.metrics.find(m=>m.field===name)}))})
const pct=(n:number)=>`${Math.round(n*100)}%`
const delta=(n:number)=>`${n>0?'+':n<0?'−':''}${Math.abs(Math.round(n*100))} pts`
const trend=(n:number)=>Math.round(n*100)>0?'up':Math.round(n*100)<0?'down':'flat'
const money=(n:number)=>`$${n.toFixed(3)}`
const secs=(ms:number)=>`${(ms/1000).toFixed(1)}s`
const shown=(v:unknown)=>v===null||v===undefined||v===''?'—':typeof v==='string'?v:JSON.stringify(v)
</script>
<template>
 <div class="evals">
  <div v-if="right" class="stat-row">
   <div class="stat"><span class="stat-label">Accuracy · revision {{right.revision}}</span><span class="stat-value">{{pct(mean(right))}}</span><span v-if="left&&left!==right" class="stat-delta" :class="trend(mean(right)-mean(left))">{{delta(mean(right)-mean(left))}} vs revision {{left.revision}}</span></div>
   <div class="stat"><span class="stat-label">Cases</span><span class="stat-value">{{right.cases}}</span></div>
   <div class="stat"><span class="stat-label">Cost per eval</span><span class="stat-value">{{money(right.cost)}}</span><span v-if="left&&left!==right" class="stat-delta flat">{{money(left.cost)}} before</span></div>
   <div class="stat"><span class="stat-label">Time per eval</span><span class="stat-value">{{secs(right.duration_ms)}}</span><span v-if="left&&left!==right" class="stat-delta" :class="right.duration_ms<left.duration_ms?'up':'flat'">{{secs(left.duration_ms)}} before</span></div>
  </div>

  <section class="block">
   <header class="block-head"><h2 class="block-title">Field accuracy</h2>
    <div v-if="ordered.length" class="rev-pick push"><select :value="left?.revision" aria-label="Baseline revision" @change="leftRev=Number(($event.target as HTMLSelectElement).value)"><option v-for="r in ordered" :key="r.revision" :value="r.revision">Revision {{r.revision}}</option></select><Icon icon="tabler:arrow-right"/><select :value="right?.revision" aria-label="Compared revision" @change="rightRev=Number(($event.target as HTMLSelectElement).value)"><option v-for="r in ordered" :key="r.revision" :value="r.revision">Revision {{r.revision}}</option></select></div>
   </header>
   <p v-if="!ordered.length" class="block-empty">No evaluation results yet.</p>
   <table v-else class="metric-table">
    <thead><tr><th>Field</th><th>Revision {{left?.revision}}</th><th>Revision {{right?.revision}}</th><th>Change</th><th class="num">Cost</th><th class="num">Time</th></tr></thead>
    <tbody>
     <tr v-for="row in rows" :key="row.name">
      <td class="mono">{{row.name}}</td>
      <td><span class="acc"><span class="bar"><span :style="{width:pct(row.a?.accuracy??0)}"/></span>{{row.a?pct(row.a.accuracy):'—'}}</span></td>
      <td><span class="acc strong"><span class="bar"><span :style="{width:pct(row.b?.accuracy??0)}"/></span>{{row.b?pct(row.b.accuracy):'—'}}</span></td>
      <td><span v-if="row.a&&row.b" class="trend" :class="trend(row.b.accuracy-row.a.accuracy)"><Icon :icon="trend(row.b.accuracy-row.a.accuracy)==='up'?'tabler:trending-up':trend(row.b.accuracy-row.a.accuracy)==='down'?'tabler:trending-down':'tabler:minus'"/>{{delta(row.b.accuracy-row.a.accuracy)}}</span></td>
      <td class="num muted">{{row.b?money(row.b.cost):'—'}}</td>
      <td class="num muted">{{row.b?secs(row.b.duration_ms):'—'}}</td>
     </tr>
    </tbody>
   </table>
  </section>

  <section class="block">
   <header class="block-head"><h2 class="block-title">Cases</h2><span class="count">{{cases.length}}</span><div class="row push"><Button label="Add case" size="small" severity="secondary" :disabled="!fields.length" @click="adding=!adding"/><Button label="Run all cases" size="small" disabled/></div></header>
   <form v-if="adding" class="case-form" @submit.prevent="addCase">
    <label>Upload<UploadPicker :value="upload" @select="(id,name)=>{upload=id;uploadName=name}"/></label>
    <div class="grid"><label v-for="field in fields" :key="field.name"><span class="mono">{{field.name}}</span><select v-if="field.type==='boolean'" v-model="expected[field.name]"><option value="">No value</option><option value="true">Yes</option><option value="false">No</option></select><select v-else-if="field.type==='enum'" v-model="expected[field.name]"><option value="">No value</option><option v-for="v in field.enum_values" :key="v">{{v}}</option></select><textarea v-else-if="['object','list'].includes(field.type)" v-model="expected[field.name]" rows="2" placeholder="JSON value"/><input v-else v-model="expected[field.name]" :type="field.type==='number'?'number':field.type==='date'?'date':'text'" placeholder="Expected value"/></label></div>
    <p v-if="error" class="error" role="alert">{{error}}</p>
    <div class="row"><Button label="Save case" size="small" type="submit" :disabled="!upload" :loading="saving"/><Button label="Cancel" size="small" severity="secondary" text @click="adding=false"/></div>
   </form>
   <p v-if="!cases.length&&!adding" class="block-empty">No evaluation cases yet. Add a document with the values you expect.</p>
   <div v-else-if="cases.length" class="table-scroll">
    <table class="metric-table">
     <thead><tr><th>Document</th><th v-for="f in fields" :key="f.name" class="mono">{{f.name}}</th><th/></tr></thead>
     <tbody><tr v-for="item in cases" :key="item.id"><td><Icon icon="tabler:file-text" class="muted"/> {{item.upload_name}}</td><td v-for="f in fields" :key="f.name">{{shown(item.expected[f.name])}}</td><td class="num"><button type="button" class="icon-btn" :aria-label="`Remove case ${item.upload_name}`" :disabled="saving" @click="emit('delete-case',item.id)"><Icon icon="tabler:trash"/></button></td></tr></tbody>
    </table>
   </div>
   <p class="block-foot muted">Evaluation execution is not available yet.</p>
  </section>

  <section class="block">
   <header class="block-head"><h2 class="block-title">Tuning proposals</h2><Button label="Tune configuration" size="small" severity="secondary" class="push" disabled/></header>
   <p v-if="!proposals.length" class="block-empty">No tuning proposals yet.</p>
   <article v-for="proposal in proposals" :key="proposal.id" class="proposal">
    <div class="proposal-head"><h3>{{proposal.title}}</h3><span class="muted">from revision {{proposal.base_revision}}</span></div>
    <div class="chips"><span class="chip" :class="proposal.accuracy_delta>0?'primary':''">{{delta(proposal.accuracy_delta)}} accuracy</span><span class="chip">{{proposal.cost_delta>=0?'+':'−'}}{{money(Math.abs(proposal.cost_delta))}} cost</span><span class="chip">{{proposal.duration_delta_ms>=0?'+':'−'}}{{secs(Math.abs(proposal.duration_delta_ms))}} time</span></div>
    <ul class="changes"><li v-for="change in proposal.changes" :key="change">{{change}}</li></ul>
    <div class="row"><Button label="Apply" size="small" disabled/><Button label="Discard" size="small" severity="secondary" text disabled/></div>
   </article>
   <p class="block-foot muted">Configuration tuning is not available yet.</p>
  </section>
 </div>
</template>
