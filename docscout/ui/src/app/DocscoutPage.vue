<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,ref,watch,toRaw} from 'vue'
import Button from 'primevue/button'
import Builder from './Builder.vue'
import TestPanel from './TestPanel.vue'
import EvalsPanel from './EvalsPanel.vue'
import RunsPanel from './RunsPanel.vue'
import {configError,newConfig,sameConfig} from '../config'
import {emptyEngine,type Snapshot,type EngineState} from '../models'
const props=defineProps<{snapshot:Snapshot;engine?:EngineState;saving?:boolean;error?:string}>()
const emit=defineEmits<{save:[input:{title:string;description:string;config:ReturnType<typeof newConfig>;expected_revision:number}];'add-case':[input:{upload_id:string;upload_name:string;expected:Record<string,unknown>}];'delete-case':[id:string]}>()
const body=ref<HTMLElement>()
const tab=ref('Builder'),draft=ref(newConfig()),title=ref(''),description=ref('')
const tabs=computed(()=>props.snapshot.can_edit?['Builder','Test','Evals','Runs']:['Test','Runs'])
watch(tab,()=>{if(body.value)body.value.scrollTop=0},{flush:'post'})
const state=computed(()=>props.engine??emptyEngine())
const draftRevision=ref<number>()
function matchesDraft(snapshot:Snapshot){return title.value===snapshot.title&&description.value===(snapshot.description??'')&&sameConfig(draft.value,snapshot.config)}
watch(()=>props.snapshot,(snapshot,previous)=>{
 if(!tabs.value.includes(tab.value))tab.value=tabs.value[0]
 if(previous&&snapshot.id===previous.id&&snapshot.can_edit&&previous.can_edit&&!matchesDraft(previous)&&!matchesDraft(snapshot))return
 draft.value=structuredClone(toRaw(snapshot.config??newConfig()));title.value=snapshot.title;description.value=snapshot.description??'';draftRevision.value=snapshot.expected_revision
},{immediate:true})
const changed=computed(()=>props.snapshot.can_edit&&!matchesDraft(props.snapshot))
const validation=computed(()=>configError(draft.value))
const enabledSteps=computed(()=>draft.value.workflow.filter(s=>s.enabled).length)
function save(){emit('save',{title:title.value,description:description.value,config:structuredClone(toRaw(draft.value)),expected_revision:draftRevision.value!})}
</script>
<template>
 <main class="docscout">
  <header class="page-header">
   <div class="heading">
    <div class="title-row"><h1>{{snapshot.title}}</h1><span class="badge">Docscout</span></div>
    <p v-if="snapshot.description" class="description">{{snapshot.description}}</p>
    <div class="stats"><span>{{snapshot.field_count}} {{snapshot.field_count===1?'field':'fields'}}</span><template v-if="snapshot.can_edit"><span class="sep">·</span><span>{{enabledSteps}} steps</span><span class="sep">·</span><span>revision {{snapshot.expected_revision}}</span></template><template v-else><span class="sep">·</span><span>Read access</span></template></div>
   </div>
   <div v-if="snapshot.can_edit" class="save-area"><span v-if="changed" class="unsaved">Unsaved changes</span><Button label="Save" :loading="saving" :disabled="!changed||!!validation||!title.trim()" @click="save"/></div>
  </header>
  <nav class="tabs" role="tablist" aria-label="Docscout"><button v-for="name in tabs" :id="`tab-${name}`" :key="name" role="tab" :aria-selected="tab===name" :aria-controls="`panel-${name}`" @click="tab=name">{{name}}</button></nav>
  <p v-if="error" role="alert" class="error banner">{{error}}</p><p v-if="validation&&snapshot.can_edit" role="alert" class="error banner">{{validation}}</p>
  <div v-if="tab==='Builder'&&snapshot.can_edit" id="panel-Builder" role="tabpanel" aria-labelledby="tab-Builder" class="builder-body">
   <Builder v-model:title="title" v-model:description="description" :config="draft" :retention="snapshot.retention" :result="state.result"/>
  </div>
  <div v-else ref="body" class="page-body"><div :id="`panel-${tab}`" role="tabpanel" :aria-labelledby="`tab-${tab}`" class="panel">
   <TestPanel v-if="tab==='Test'" :result="state.result" :retention="snapshot.retention"/>
   <EvalsPanel v-if="tab==='Evals'&&snapshot.can_edit" :cases="snapshot.cases" :results="state.evals" :proposals="state.proposals" :fields="snapshot.config?.fields??[]" :saving="saving" @add-case="emit('add-case',$event)" @delete-case="emit('delete-case',$event)"/>
   <RunsPanel v-if="tab==='Runs'" :runs="snapshot.runs" :retention="snapshot.retention"/>
  </div></div>
 </main>
</template>
