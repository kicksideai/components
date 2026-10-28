<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,ref,watch} from 'vue'
import {Icon} from '@iconify/vue'
import Button from 'primevue/button'
import UploadPicker from './UploadPicker.vue'
import type {Field} from '../config'
import {finished,meanAccuracy,type EvalCase,type Evaluation,type CaseResult,type FieldScore} from '../models'
import {when} from '../format'
const props=defineProps<{cases:EvalCase[];fields:Field[];evaluations:Evaluation[];evaluation?:Evaluation;revision:number;changed?:boolean;saving?:boolean;starting?:boolean}>()
const emit=defineEmits<{'add-case':[input:{upload_id:string;expected:Record<string,unknown>}];'delete-case':[id:string];evaluate:[];open:[eval_id:string]}>()

// Case editor. A blank input means the document does not state the field, so it is left out.
const adding=ref(false),upload=ref(''),expected=ref<Record<string,string|number>>({}),error=ref('')
watch(()=>props.cases,()=>{adding.value=false;upload.value='';expected.value={}})
function parse(field:Field,raw:string):unknown{
 if(field.type==='number')return Number(raw)
 if(field.type==='boolean')return raw==='true'
 if(field.type==='list'||field.type==='object')return JSON.parse(raw)
 return raw
}
function addCase(){
 error.value=''
 const values:Record<string,unknown>={}
 try{for(const field of props.fields){const raw=String(expected.value[field.name]??'').trim();if(raw)values[field.name]=parse(field,raw)}}
 catch{error.value='Lists and objects need valid JSON, for example ["a","b"] or {"city":"Hamburg"}.';return}
 emit('add-case',{upload_id:upload.value,expected:values})
}

const running=computed(()=>props.evaluations.find(e=>!finished(e)))
const done=computed(()=>props.evaluations.filter(finished))
const shown=computed(()=>props.evaluation)
const progress=computed(()=>{const r=shown.value?.results??[];return {done:r.filter(c=>c.status!=='queued').length,total:shown.value?.case_count??0}})

// Comparison: the open evaluation against an earlier finished one, by default the one before it.
const baselineId=ref<string>()
watch(()=>shown.value?.id,()=>{baselineId.value=undefined})
const baseline=computed(()=>{
 if(!shown.value)return undefined
 if(baselineId.value)return done.value.find(e=>e.id===baselineId.value)
 const i=done.value.findIndex(e=>e.id===shown.value!.id)
 return i>=0?done.value[i+1]:done.value[0]
})
const rows=computed(()=>(shown.value?.metrics??[]).map(m=>({...m,before:baseline.value?.metrics.find(b=>b.field===m.field)})))

const columns=computed(()=>(shown.value?.fields??[]).map(f=>f.name))
const score=(r:CaseResult,field:string)=>r.scores.find(s=>s.field===field)
const open=ref<string>()
const pct=(n:number)=>`${Math.round(n*100)}%`
const delta=(n:number)=>{const p=Math.round(n*100);return `${p>0?'+':p<0?'−':'±'}${Math.abs(p)} pts`}
const trend=(n:number)=>Math.round(n*100)>0?'up':Math.round(n*100)<0?'down':'flat'
const secs=(ms:number)=>ms>=60000?`${Math.floor(ms/60000)}m ${Math.round(ms%60000/1000)}s`:`${(ms/1000).toFixed(1)}s`
const value=(v:unknown)=>v===null||v===undefined||v===''?'—':typeof v==='string'?v:Array.isArray(v)&&v.every(x=>typeof x!=='object')?v.join(', '):JSON.stringify(v)
const grade=(s?:FieldScore)=>!s?'none':s.score>=.999?'pass':s.score>0?'partial':'fail'
const completed=(e:Evaluation)=>(e.results??[]).filter(r=>r.status==='completed').length
const statusLabel:Record<string,string>={queued:'Queued',running:'Running',completed:'Completed',failed:'Failed'}
</script>
<template>
 <div class="evals">
  <section class="block eval-run">
   <div class="eval-run-main">
    <div>
     <h2 class="block-title">Evaluate revision {{revision}}</h2>
     <p class="muted">Runs every case below with the saved configuration and scores each field against the expected value.</p>
     <p v-if="changed" class="eval-note"><Icon icon="tabler:info-circle"/>Unsaved changes are not evaluated. Save first to measure them.</p>
    </div>
    <Button :label="running?'Evaluating…':'Run all cases'" :loading="starting||!!running" :disabled="!cases.length||!fields.length||!!running||starting" @click="emit('evaluate')"/>
   </div>
   <div v-if="shown&&!finished(shown)" class="eval-progress" role="status">
    <span class="bar"><span :style="{width:pct(progress.total?progress.done/progress.total:0)}"/></span>
    <span class="muted">{{statusLabel[shown.status]}} · {{progress.done}} of {{progress.total}} cases</span>
   </div>
  </section>

  <template v-if="shown&&finished(shown)">
   <p v-if="shown.error" :class="shown.status==='failed'?'run-failed':'eval-warning'" role="alert"><Icon icon="tabler:alert-triangle"/>{{shown.error}}</p>
   <div class="stat-row">
    <div class="stat"><span class="stat-label">Accuracy · revision {{shown.config_revision}}</span><span class="stat-value">{{pct(meanAccuracy(shown))}}</span><span v-if="baseline" class="stat-delta" :class="trend(meanAccuracy(shown)-meanAccuracy(baseline))">{{delta(meanAccuracy(shown)-meanAccuracy(baseline))}} vs revision {{baseline.config_revision}}</span></div>
    <div class="stat"><span class="stat-label">Cases</span><span class="stat-value">{{completed(shown)}}<small> / {{shown.case_count}}</small></span><span class="stat-delta flat">{{shown.case_count-completed(shown)}} failed</span></div>
    <div class="stat"><span class="stat-label">Tokens</span><span class="stat-value">{{shown.tokens.toLocaleString()}}</span><span v-if="baseline" class="stat-delta flat">{{baseline.tokens.toLocaleString()}} before</span></div>
    <div class="stat"><span class="stat-label">Model time</span><span class="stat-value">{{secs(shown.duration_ms)}}</span><span v-if="baseline" class="stat-delta flat">{{secs(baseline.duration_ms)}} before</span></div>
   </div>

   <section class="block">
    <header class="block-head"><h2 class="block-title">Field accuracy</h2>
     <label v-if="done.length>1" class="compare-pick push"><span class="muted">Compare with</span>
      <select :value="baseline?.id" aria-label="Baseline evaluation" @change="baselineId=($event.target as HTMLSelectElement).value"><option v-for="e in done.filter(x=>x.id!==shown!.id)" :key="e.id" :value="e.id">Revision {{e.config_revision}} · {{when(e.created_at)}}</option></select>
     </label>
    </header>
    <p v-if="!rows.length" class="block-empty">No case completed, so there is no accuracy to show.</p>
    <div v-else class="table-scroll"><table class="metric-table accuracy-table" :class="{comparing:!!baseline}">
     <thead><tr><th>Field</th><th>Accuracy</th><th>Verified</th><th v-if="baseline">Revision {{baseline.config_revision}}</th><th v-if="baseline">Change</th></tr></thead>
     <tbody>
      <tr v-for="row in rows" :key="row.field">
       <td class="mono">{{row.field}}</td>
       <td><span class="acc strong"><span class="bar"><span :style="{width:pct(row.accuracy)}"/></span>{{pct(row.accuracy)}}</span></td>
       <td class="muted">{{pct(row.verified)}}</td>
       <td v-if="baseline" class="muted">{{row.before?pct(row.before.accuracy):'—'}}</td>
       <td v-if="baseline"><span v-if="row.before" class="trend" :class="trend(row.accuracy-row.before.accuracy)"><Icon :icon="trend(row.accuracy-row.before.accuracy)==='up'?'tabler:trending-up':trend(row.accuracy-row.before.accuracy)==='down'?'tabler:trending-down':'tabler:minus'"/>{{delta(row.accuracy-row.before.accuracy)}}</span><span v-else class="muted">New field</span></td>
      </tr>
     </tbody>
    </table></div>
   </section>
  </template>

  <section v-if="shown?.results?.length" class="block">
   <header class="block-head"><h2 class="block-title">Results by case</h2><span class="muted push matrix-hint">Select a case to compare values</span></header>
   <div class="table-scroll">
    <table class="metric-table result-matrix">
     <thead><tr><th>Document</th><th v-for="name in columns" :key="name" class="mono">{{name}}</th></tr></thead>
     <tbody>
      <template v-for="r in shown.results" :key="r.case_id">
       <tr class="result-row" :class="{active:open===r.case_id}">
        <td><button type="button" class="case-toggle" :aria-expanded="open===r.case_id" @click="open=open===r.case_id?undefined:r.case_id"><Icon :icon="open===r.case_id?'tabler:chevron-down':'tabler:chevron-right'"/>{{r.upload_name}}</button></td>
        <td v-if="r.status!=='completed'" :colspan="columns.length" class="muted"><span v-if="r.status==='queued'" class="cell-state"><Icon icon="tabler:loader-2" class="spin"/>Waiting</span><span v-else class="cell-state fail"><Icon icon="tabler:alert-triangle"/>{{r.error}}</span></td>
        <template v-else><td v-for="name in columns" :key="name" :data-label="name"><span class="cell" :class="grade(score(r,name))" :title="value(score(r,name)?.value)">{{score(r,name)?pct(score(r,name)!.score):'—'}}</span></td></template>
       </tr>
       <tr v-if="open===r.case_id" class="result-detail"><td :colspan="columns.length+1">
        <p v-if="r.error" class="muted">{{r.error}}</p>
        <dl v-else class="compare">
         <template v-for="s in r.scores" :key="s.field">
          <dt class="mono">{{s.field}}</dt>
          <dd><span class="cell" :class="grade(s)">{{pct(s.score)}}</span><span class="cmp"><span class="cmp-label">Expected</span>{{value(s.expected)}}</span><span class="cmp"><span class="cmp-label">Extracted</span>{{value(s.value)}}</span><span><span class="chip" :class="s.verified?'primary':'warn'"><Icon :icon="s.verified?'tabler:shield-check':'tabler:shield-question'"/>{{s.verified?'Verified':'Unverified'}}</span></span></dd>
         </template>
        </dl>
        <p class="muted case-meta">{{r.tokens.toLocaleString()}} tokens · {{secs(r.duration_ms)}}</p>
       </td></tr>
      </template>
     </tbody>
    </table>
   </div>
  </section>

  <section class="block">
   <header class="block-head"><h2 class="block-title">Cases</h2><span class="count">{{cases.length}}</span><Button label="Add case" size="small" severity="secondary" class="push" :disabled="!fields.length" @click="adding=!adding"/></header>
   <form v-if="adding" class="case-form" @submit.prevent="addCase">
    <label>Document<UploadPicker :value="upload" @select="id=>{upload=id}"/></label>
    <p class="muted">Enter what the document states. Leave a field blank when the document does not state it; the case then expects Docscout to report it missing.</p>
    <div class="grid"><label v-for="field in fields" :key="field.name"><span class="mono">{{field.name}}</span>
     <select v-if="field.type==='boolean'" v-model="expected[field.name]"><option value="">Not stated</option><option value="true">Yes</option><option value="false">No</option></select>
     <select v-else-if="field.type==='enum'" v-model="expected[field.name]"><option value="">Not stated</option><option v-for="v in field.enum_values" :key="v">{{v}}</option></select>
     <textarea v-else-if="field.type==='object'||field.type==='list'" v-model="expected[field.name]" rows="2" :placeholder="field.type==='list'?'[&quot;first&quot;, &quot;second&quot;]':'{&quot;key&quot;: &quot;value&quot;}'"/>
     <input v-else v-model="expected[field.name]" :type="field.type==='number'?'number':field.type==='date'?'date':'text'" placeholder="Not stated"/>
    </label></div>
    <p v-if="error" class="error" role="alert">{{error}}</p>
    <div class="row"><Button label="Save case" size="small" type="submit" :disabled="!upload" :loading="saving"/><Button label="Cancel" size="small" severity="secondary" text @click="adding=false"/></div>
   </form>
   <p v-if="!fields.length" class="block-empty">Add a field in the Builder, then add documents with the values you expect.</p>
   <p v-else-if="!cases.length&&!adding" class="block-empty">No cases yet. Add a document with the values you expect, then run all cases to measure this configuration.</p>
   <div v-else-if="cases.length" class="table-scroll">
    <table class="metric-table case-table">
     <thead><tr><th>Document</th><th v-for="f in fields" :key="f.name" class="mono">{{f.name}}</th><th/></tr></thead>
     <tbody><tr v-for="item in cases" :key="item.id"><td><Icon icon="tabler:file-text" class="muted"/> {{item.upload_name}}</td><td v-for="f in fields" :key="f.name" :data-label="f.name" :class="{muted:!(f.name in item.expected)}">{{f.name in item.expected?value(item.expected[f.name]):'Not stated'}}</td><td class="num"><button type="button" class="icon-btn" :aria-label="`Remove case ${item.upload_name}`" :disabled="saving" @click="emit('delete-case',item.id)"><Icon icon="tabler:trash"/></button></td></tr></tbody>
    </table>
   </div>
  </section>

  <section v-if="evaluations.length" class="block">
   <header class="block-head"><h2 class="block-title">History</h2><span class="count">{{evaluations.length}}</span></header>
   <ul class="eval-history">
    <li v-for="e in evaluations" :key="e.id"><button type="button" :class="{active:shown?.id===e.id}" :aria-current="shown?.id===e.id" @click="emit('open',e.id)">
     <span class="badge" :data-status="e.status">{{statusLabel[e.status]}}</span>
     <span>Revision {{e.config_revision}}</span>
     <span class="muted">{{when(e.created_at)}}</span>
     <strong class="push">{{e.status==='completed'?pct(meanAccuracy(e)):'—'}}</strong>
    </button></li>
   </ul>
  </section>
 </div>
</template>
