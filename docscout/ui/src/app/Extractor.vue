<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {ref,watch,onBeforeUnmount} from 'vue'
import {useHostVisibilityRefresh} from '@wippy-fe/webcomponent-vue'
import {on} from '@wippy-fe/proxy'
import {client,type Snapshot,type Extraction,type Evaluation} from '../client'
import DocscoutPage from './DocscoutPage.vue'
const props=defineProps<{id:string;back?:boolean}>()
const emit=defineEmits<{back:[]}>()
const snapshot=ref<Snapshot>(),error=ref(''),saving=ref(false),running=ref(false),starting=ref(false)
const addedCaseId=ref<string>()
const result=ref<Extraction|null>(null),evaluations=ref<Evaluation[]>([]),evaluation=ref<Evaluation>()
let subscriptions:(()=>void)[]=[]
// Generations identify the mounted extractor; read counters order overlapping requests.
let generation=0,snapshotRead=0,evaluationRead=0,selected:string|undefined
const message=(e:unknown)=>e instanceof Error?e.message:String(e)
const live=(g:number)=>g===generation

async function refreshEvaluations(g:number,open?:string){
 const request=++evaluationRead
 if(open)selected=open
 const current=()=>live(g)&&request===evaluationRead
 try{
  const id=props.id
  const items=await client.evaluations(id)
  if(!current())return
  evaluations.value=items
  const target=selected??items[0]?.id
  if(target){const value=await client.evaluation(id,target);if(!current()||value.id!==(selected??target))return;evaluation.value=value}
 }catch(e){if(current())error.value=message(e)}
}
async function load(g:number){
 const request=++snapshotRead
 const current=()=>live(g)&&request===snapshotRead
 if(!props.id){error.value='No extractor selected.';return}
 try{
  const value=await client.get(props.id)
  if(!current())return
  snapshot.value=value;error.value=''
  if(value.can_edit)await refreshEvaluations(g)
 }catch(e){if(current())error.value=message(e)}
}
watch(()=>props.id,(_id,previous)=>{
 generation++;selected=undefined;subscriptions.forEach(dispose=>dispose());subscriptions=[]
 addedCaseId.value=undefined;snapshot.value=undefined;result.value=null;evaluations.value=[];evaluation.value=undefined;error.value=''
 const g=generation
 if(props.id)subscriptions=[on(`component.${props.id}`,()=>load(g)),on(`docscout.runs.${props.id}`,()=>load(g))]
 if(previous!==undefined)void load(g)
},{immediate:true})
useHostVisibilityRefresh(()=>load(generation))
onBeforeUnmount(()=>{generation++;subscriptions.forEach(dispose=>dispose())})

async function act<T>(action:()=>Promise<T>){
 const g=generation
 saving.value=true;error.value=''
 try{const value=await action();if(live(g)){await load(g);return value}}
 catch(e){if(live(g))error.value=message(e)}
 finally{saving.value=false}
}
const save=(input:Parameters<typeof client.update>[1])=>act(()=>client.update(props.id,input))
async function addCase(input:Parameters<typeof client.addCase>[1]){
 const g=generation
 const value=await act(()=>client.addCase(props.id,input))
 if(value&&live(g))addedCaseId.value=value.id
}
const deleteCase=(caseId:string)=>act(()=>client.deleteCase(props.id,caseId))
async function extract(uploadId:string){
 const g=generation
 running.value=true;error.value=''
 try{const value=await client.run(props.id,uploadId);if(live(g)){result.value=value;await load(g)}}
 catch(e){if(live(g))error.value=message(e)}
 finally{running.value=false}
}
async function evaluate(){
 const g=generation
 starting.value=true;error.value=''
 try{const {eval_id}=await client.evaluate(props.id);if(live(g))await refreshEvaluations(g,eval_id)}
 catch(e){if(live(g))error.value=message(e)}
 finally{starting.value=false}
}
function open(evalId:string){refreshEvaluations(generation,evalId)}
</script>
<template><DocscoutPage v-if="snapshot" :snapshot="snapshot" :added-case-id="addedCaseId" :saving="saving" :running="running" :starting="starting" :result="result" :evaluations="evaluations" :evaluation="evaluation" :error="error" :back="back" @back="emit('back')" @run="extract" @save="save" @add-case="addCase" @delete-case="deleteCase" @evaluate="evaluate" @open-evaluation="open"/><p v-else-if="error" class="error pad-page" role="alert">{{error}}</p><p v-else class="empty pad-page" role="status">Loading Docscout…</p></template>
