<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,ref,watch,toRaw} from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import FieldsEditor from './FieldsEditor.vue'
import WorkflowEditor from './WorkflowEditor.vue'
import RetrievalEditor from './RetrievalEditor.vue'
import TestPanel from './TestPanel.vue'
import EvalsPanel from './EvalsPanel.vue'
import RunsPanel from './RunsPanel.vue'
import {configError,newConfig,sameConfig} from '../config'
import {emptyEngine,type Snapshot,type EngineState} from '../models'
const props=defineProps<{snapshot:Snapshot;engine?:EngineState;saving?:boolean;error?:string}>()
const emit=defineEmits<{save:[input:{title:string;description:string;config:ReturnType<typeof newConfig>;expected_revision:number}];'add-case':[input:{upload_id:string;upload_name:string;expected:Record<string,unknown>}];'delete-case':[id:string]}>()
const root=ref<HTMLElement>(),body=ref<HTMLElement>()
function workspace(){root.value?.dispatchEvent(new CustomEvent('navigate',{detail:{path:'/workspace'},bubbles:true,composed:true}))}
const tab=ref('Fields'),draft=ref(newConfig()),title=ref(''),description=ref('')
const tabs=computed(()=>props.snapshot.can_edit?['Fields','Workflow','Retrieval','Test','Evals','Runs']:['Test','Runs'])
watch(tab,()=>{if(body.value)body.value.scrollTop=0},{flush:'post'})
const state=computed(()=>props.engine??emptyEngine())
const draftRevision=ref<number>()
function matchesDraft(snapshot:Snapshot){return title.value===snapshot.title&&description.value===(snapshot.description??'')&&sameConfig(draft.value,snapshot.config)}
watch(()=>props.snapshot,(snapshot,previous)=>{
 if(!tabs.value.includes(tab.value))tab.value=tabs.value[0]
 if(previous&&snapshot.id===previous.id&&snapshot.can_edit&&previous.can_edit&&!matchesDraft(previous)&&!matchesDraft(snapshot))return
 draft.value=structuredClone(toRaw(snapshot.config??newConfig()));title.value=snapshot.title;description.value=snapshot.description??'';draftRevision.value=snapshot.expected_revision
},{immediate:true})
const changed=computed(()=>!matchesDraft(props.snapshot))
const validation=computed(()=>configError(draft.value))
function save(){emit('save',{title:title.value,description:description.value,config:structuredClone(toRaw(draft.value)),expected_revision:draftRevision.value!})}
</script>
<template>
 <main ref="root" class="docscout"><header class="page-header"><div class="heading"><Button label="Workspace" text severity="secondary" size="small" class="back-link" @click="workspace"/><div class="eyebrow">Docscout</div><h1>{{snapshot.title}}</h1><p v-if="snapshot.description" class="description">{{snapshot.description}}</p><div class="row meta-line"><span>{{snapshot.field_count}} {{snapshot.field_count===1?'field':'fields'}}</span><span class="badge">{{snapshot.status}}</span><span v-if="!snapshot.can_edit">Read access</span></div></div><Button v-if="snapshot.can_edit" label="Save changes" :loading="saving" :disabled="!changed||!!validation||!title.trim()" @click="save"/></header>
 <nav class="tabs" role="tablist" aria-label="Docscout"><button v-for="name in tabs" :id="`tab-${name}`" :key="name" role="tab" :aria-selected="tab===name" :aria-controls="`panel-${name}`" @click="tab=name">{{name}}</button></nav>
 <div ref="body" class="page-body"><p v-if="error" role="alert" class="error">{{error}}</p><p v-if="validation&&snapshot.can_edit" role="alert" class="error">{{validation}}</p><div :id="`panel-${tab}`" role="tabpanel" :aria-labelledby="`tab-${tab}`" class="panel">
 <template v-if="tab==='Fields'&&snapshot.can_edit"><section class="identity"><div class="grid"><label>Name<InputText v-model="title"/></label><label>Description<Textarea v-model="description" rows="1"/></label></div></section><FieldsEditor :config="draft"/></template>
 <WorkflowEditor v-if="tab==='Workflow'&&snapshot.can_edit" :config="draft"/>
 <RetrievalEditor v-if="tab==='Retrieval'&&snapshot.can_edit" :config="draft"/>
 <TestPanel v-if="tab==='Test'" :result="state.result" :retention="snapshot.retention"/>
 <EvalsPanel v-if="tab==='Evals'&&snapshot.can_edit" :cases="snapshot.cases" :results="state.evals" :proposals="state.proposals" :fields="snapshot.config?.fields??[]" :saving="saving" @add-case="emit('add-case',$event)" @delete-case="emit('delete-case',$event)"/>
 <RunsPanel v-if="tab==='Runs'" :runs="snapshot.runs" :retention="snapshot.retention"/>
 </div></div></main>
</template>
