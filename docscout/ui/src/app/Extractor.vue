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
// Each extractor view gets a generation; answers from an older one, or after unmount, are dropped.
let generation=0,selected:string|undefined
const message=(e:unknown)=>e instanceof Error?e.message:String(e)
const live=(g:number)=>g===generation

async function refreshEvaluations(g:number,open?:string){
 try{
  const id=props.id
  const items=await client.evaluations(id)
  if(!live(g))return
  evaluations.value=items
  if(open)selected=open
  const target=selected??items[0]?.id
  if(target){const value=await client.evaluation(id,target);if(!live(g)||value.id!==(selected??target))return;evaluation.value=value}
  clearTimeout(timer)
  // Keep refreshing while any evaluation is active, whichever one is open.
  if(items.some(e=>!finished(e)))timer=setTimeout(()=>refreshEvaluations(g),POLL_MS)
 }catch(e){if(live(g))error.value=message(e)}
}
async function load(g:number){
 if(!props.id){error.value='No extractor selected.';return}
 try{
  const value=await client.get(props.id)
  if(!live(g))return
  snapshot.value=value;error.value=''
  if(value.can_edit)await refreshEvaluations(g)
 }catch(e){if(live(g))error.value=message(e)}
}
watch(()=>props.id,()=>{
 generation++;selected=undefined;clearTimeout(timer);dispose?.()
 snapshot.value=undefined;result.value=null;evaluations.value=[];evaluation.value=undefined;error.value=''
 const g=generation
 load(g)
 if(props.id)dispose=on(`component.${props.id}`,()=>load(g))
},{immediate:true})
onBeforeUnmount(()=>{generation++;dispose?.();clearTimeout(timer)})

async function act(action:()=>Promise<unknown>){
 const g=generation
 saving.value=true;error.value=''
 try{await action();if(live(g))await load(g)}
 catch(e){if(live(g))error.value=message(e)}
 finally{saving.value=false}
}
const save=(input:Parameters<typeof client.update>[1])=>act(()=>client.update(props.id,input))
const addCase=(input:Parameters<typeof client.addCase>[1])=>act(()=>client.addCase(props.id,input))
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
<template><DocscoutPage v-if="snapshot" :snapshot="snapshot" :saving="saving" :running="running" :starting="starting" :result="result" :evaluations="evaluations" :evaluation="evaluation" :error="error" :back="back" @back="emit('back')" @run="extract" @save="save" @add-case="addCase" @delete-case="deleteCase" @evaluate="evaluate" @open-evaluation="open"/><p v-else-if="error" class="error pad-page" role="alert">{{error}}</p><p v-else class="empty pad-page" role="status">Loading Docscout…</p></template>
