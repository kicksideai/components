<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {ref,watch,onBeforeUnmount} from 'vue'
import {on} from '@wippy-fe/proxy'
import {client,type Snapshot,type Extraction,type Evaluation} from '../client'
import {finished} from '../models'
import DocscoutPage from './DocscoutPage.vue'
const props=defineProps<{id:string;back?:boolean}>()
const emit=defineEmits<{back:[]}>()
const POLL_MS=2000
const snapshot=ref<Snapshot>(),error=ref(''),saving=ref(false),running=ref(false),starting=ref(false)
const result=ref<Extraction|null>(null),evaluations=ref<Evaluation[]>([]),evaluation=ref<Evaluation>()
let dispose:(()=>void)|undefined,timer:ReturnType<typeof setTimeout>|undefined
const message=(e:unknown)=>e instanceof Error?e.message:String(e)
// Every load is tied to the extractor it started for, so a slow answer never lands on another one.
const current=(id:string)=>id===props.id

async function loadEvaluation(id:string,eval_id:string){
 const value=await client.evaluation(id,eval_id)
 if(!current(id))return
 evaluation.value=value
 clearTimeout(timer)
 if(!finished(value))timer=setTimeout(()=>refreshEvaluations(id,eval_id),POLL_MS)
}
async function refreshEvaluations(id:string,open?:string){
 try{
  const items=await client.evaluations(id)
  if(!current(id))return
  evaluations.value=items
  const target=open??evaluation.value?.id??items[0]?.id
  if(target)await loadEvaluation(id,target)
 }catch(e){if(current(id))error.value=message(e)}
}
async function load(){
 const id=props.id
 if(!id){error.value='No extractor selected.';return}
 try{
  const value=await client.get(id)
  if(!current(id))return
  snapshot.value=value;error.value=''
  if(value.can_edit)await refreshEvaluations(id)
 }catch(e){if(current(id))error.value=message(e)}
}
watch(()=>props.id,()=>{
 clearTimeout(timer);dispose?.()
 snapshot.value=undefined;result.value=null;evaluations.value=[];evaluation.value=undefined;error.value=''
 load()
 if(props.id)dispose=on(`component.${props.id}`,()=>load())
},{immediate:true})
onBeforeUnmount(()=>{dispose?.();clearTimeout(timer)})

async function act(action:()=>Promise<unknown>){
 const id=props.id
 saving.value=true;error.value=''
 try{await action();if(current(id))await load()}
 catch(e){if(current(id))error.value=message(e)}
 finally{saving.value=false}
}
const save=(input:Parameters<typeof client.update>[1])=>act(()=>client.update(props.id,input))
const addCase=(input:Parameters<typeof client.addCase>[1])=>act(()=>client.addCase(props.id,input))
const deleteCase=(caseId:string)=>act(()=>client.deleteCase(props.id,caseId))
async function extract(uploadId:string){
 const id=props.id
 running.value=true;error.value=''
 try{const value=await client.run(id,uploadId);if(current(id)){result.value=value;await load()}}
 catch(e){if(current(id))error.value=message(e)}
 finally{running.value=false}
}
async function evaluate(){
 const id=props.id
 starting.value=true;error.value=''
 try{const {eval_id}=await client.evaluate(id);if(current(id))await refreshEvaluations(id,eval_id)}
 catch(e){if(current(id))error.value=message(e)}
 finally{starting.value=false}
}
function open(evalId:string){refreshEvaluations(props.id,evalId)}
</script>
<template><DocscoutPage v-if="snapshot" :snapshot="snapshot" :saving="saving" :running="running" :starting="starting" :result="result" :evaluations="evaluations" :evaluation="evaluation" :error="error" :back="back" @back="emit('back')" @run="extract" @save="save" @add-case="addCase" @delete-case="deleteCase" @evaluate="evaluate" @open-evaluation="open"/><p v-else-if="error" class="error pad-page" role="alert">{{error}}</p><p v-else class="empty pad-page" role="status">Loading Docscout…</p></template>
