<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,ref,watch} from 'vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import UploadPicker from './UploadPicker.vue'
import type {Field} from '../config'
import Button from 'primevue/button'
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
const left=ref<number>(),right=ref<number>()
const selected=computed(()=>[props.results.find(r=>r.revision===(left.value??props.results[0]?.revision)),props.results.find(r=>r.revision===(right.value??props.results[1]?.revision))])
</script>
<template>
 <section><div class="section-head"><h2>Cases</h2><div class="row wrap"><Button label="Add case" severity="secondary" :disabled="!fields.length" @click="adding=!adding"/><Button label="Run all cases" disabled/></div></div><form v-if="adding" class="field-card" @submit.prevent="addCase"><label>Upload<UploadPicker :value="upload" @select="(id,name)=>{upload=id;uploadName=name}"/></label><div class="grid"><label v-for="field in fields" :key="field.name">{{field.name}}<select v-if="field.type==='boolean'" v-model="expected[field.name]"><option value="">No value</option><option value="true">True</option><option value="false">False</option></select><select v-else-if="field.type==='enum'" v-model="expected[field.name]"><option v-for="value in field.enum_values" :key="value">{{value}}</option></select><Textarea v-else-if="['object','list'].includes(field.type)" v-model="expected[field.name]" rows="2" placeholder="JSON value"/><InputText v-else v-model="expected[field.name]" :type="field.type==='number'?'number':field.type==='date'?'date':'text'" placeholder="Expected value"/></label></div><p v-if="error" class="error" role="alert">{{error}}</p><div class="row"><Button label="Save case" type="submit" :disabled="!upload" :loading="saving"/><Button label="Cancel" severity="secondary" text @click="adding=false"/></div></form><p v-if="!cases.length" class="empty">No evaluation cases yet.</p><div v-for="item in cases" :key="item.id" class="field-card"><header class="row"><h3>{{item.upload_name}}</h3><Button label="Remove case" severity="secondary" text size="small" class="push" :disabled="saving" @click="emit('delete-case',item.id)"/></header><dl class="values"><template v-for="(value,field) in item.expected" :key="field"><dt>{{field}}</dt><dd>{{value}}</dd></template></dl></div><p class="muted">Evaluation execution is not available yet.</p></section>
 <section><h2>Revision comparison</h2><p v-if="!results.length" class="empty">No evaluation results yet.</p><div v-else class="grid comparison"><article v-for="(result,i) in selected" :key="i" class="field-card"><label>Configuration revision<select :value="result?.revision" @change="i===0?left=Number(($event.target as HTMLSelectElement).value):right=Number(($event.target as HTMLSelectElement).value)"><option v-for="revision in results" :key="revision.revision" :value="revision.revision">Revision {{revision.revision}}</option></select></label><template v-if="result"><p class="muted">{{result.cases}} cases · ${{result.cost.toFixed(3)}} · {{(result.duration_ms/1000).toFixed(1)}}s</p><dl class="values"><template v-for="metric in result.metrics" :key="metric.field"><dt>{{metric.field}}</dt><dd>{{Math.round(metric.accuracy*100)}}%<small>${{metric.cost.toFixed(3)}} · {{(metric.duration_ms/1000).toFixed(1)}}s</small></dd></template></dl></template></article></div></section>
 <section><div class="section-head"><h2>Proposals</h2><Button label="Tune configuration" severity="secondary" disabled/></div><p v-if="!proposals.length" class="empty">No tuning proposals yet.</p><article v-for="proposal in proposals" :key="proposal.id" class="field-card"><h3>{{proposal.title}}</h3><p class="delta">{{proposal.accuracy_delta>=0?'+':''}}{{Math.round(proposal.accuracy_delta*100)}}% accuracy · {{proposal.cost_delta>=0?'+':''}}${{proposal.cost_delta.toFixed(3)}} · {{(proposal.duration_delta_ms/1000).toFixed(1)}}s</p><ul><li v-for="change in proposal.changes" :key="change">{{change}}</li></ul><div class="row"><Button label="Apply proposal" disabled/><Button label="Discard" severity="secondary" disabled/></div></article><p class="muted">Configuration tuning is not available yet.</p></section>
</template>
