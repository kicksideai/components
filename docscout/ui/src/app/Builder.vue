<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,nextTick,ref,watch} from 'vue'
import {Icon} from '@iconify/vue'
import Toggle from './Toggle.vue'
import FieldInspector from './FieldInspector.vue'
import StepInspector from './StepInspector.vue'
import DocumentInspector from './DocumentInspector.vue'
import {canMove,documentSummary,modelLabel,moveStep,newField,stepIcons,stepLabels,stepSummary,type Config,type Step} from '../config'
import type {Extraction,TraceStep} from '../models'
const props=defineProps<{config:Config;retention:string;result:Extraction|null;readonly?:boolean}>()
const title=defineModel<string>('title',{required:true})
const description=defineModel<string>('description',{required:true})
type Selection={kind:'details'}|{kind:'document'}|{kind:'output'}|{kind:'step';step:Step}|{kind:'field';index:number}
const selected=ref<Selection>({kind:'document'})
const inspector=ref<HTMLElement>()
watch(selected,async()=>{await nextTick();if(inspector.value&&matchMedia('(max-width: 860px)').matches)inspector.value.scrollIntoView({block:'start',behavior:'smooth'})})
const is=(s:Selection)=>JSON.stringify(s)===JSON.stringify(selected.value)||(s.kind==='step'&&selected.value.kind==='step'&&s.step===selected.value.step)
const selectedField=computed(()=>selected.value.kind==='field'?props.config.fields[selected.value.index]:undefined)
const inspectorTitle=computed(()=>{const s=selected.value;return s.kind==='step'?stepLabels[s.step.kind]:s.kind==='field'?(selectedField.value?.name||'New field'):s.kind==='document'?'Read document':s.kind==='output'?'Output':'Details'})
const deepFields=computed(()=>props.config.fields.filter(f=>f.strategy==='deep'))
const hintFields=computed(()=>props.config.fields.filter(f=>f.search_hints.trim()))
const trace=(kind:string):TraceStep|undefined=>props.result?.trace.find(t=>t.kind===kind)
const traceLine=(t:TraceStep)=>[`${(t.duration_ms/1000).toFixed(1)}s`,`${(t.input_tokens+t.output_tokens).toLocaleString()} tokens`,t.queries?.length?`${t.queries.length} queries`:'',t.message??''].filter(Boolean).join(' · ')
function addField(){props.config.fields.push(newField());selected.value={kind:'field',index:props.config.fields.length-1}}
function removeField(index:number){props.config.fields.splice(index,1);selected.value={kind:'document'}}
function moveField(index:number,delta:number){const f=props.config.fields;const next=index+delta;if(next<0||next>=f.length)return;const [x]=f.splice(index,1);f.splice(next,0,x);selected.value={kind:'field',index:next}}
const tags=computed({get:()=>props.config.tags.join(', '),set:(v:string)=>{props.config.tags=[...new Set(v.split(',').map(t=>t.trim()).filter(Boolean))]}})
</script>
<template>
 <div class="builder">
  <aside class="pane fields-pane" aria-label="Fields">
   <div class="pane-head"><h2>Fields</h2><span class="count">{{config.fields.length}}</span><button v-if="!readonly" type="button" class="icon-btn push" aria-label="Add field" title="Add field" @click="addField"><Icon icon="tabler:plus"/></button></div>
   <p v-if="!config.fields.length" class="muted pad">Add the values to pull from each document.</p>
   <ul class="field-list">
    <li v-for="(f,i) in config.fields" :key="i"><button type="button" class="field-item" :class="{active:is({kind:'field',index:i})}" @click="selected={kind:'field',index:i}">
     <span class="field-name">{{f.name||'New field'}}<span v-if="f.required" class="req" title="Required">*</span></span>
     <span class="chips"><span class="chip">{{f.type}}</span><span v-if="f.strategy==='deep'" class="chip primary">deep</span></span>
    </button>
    <span v-if="!readonly&&is({kind:'field',index:i})" class="reorder"><button type="button" class="icon-btn" aria-label="Move field up" :disabled="i===0" @click="moveField(i,-1)"><Icon icon="tabler:chevron-up"/></button><button type="button" class="icon-btn" aria-label="Move field down" :disabled="i===config.fields.length-1" @click="moveField(i,1)"><Icon icon="tabler:chevron-down"/></button></span></li>
   </ul>
   <button v-if="!readonly" type="button" class="btn add-field" @click="addField"><Icon icon="tabler:plus"/>Add field</button>
  </aside>

  <section class="flow" aria-label="Extraction flow">
   <button type="button" class="node fixed" :class="{active:is({kind:'document'})}" @click="selected={kind:'document'}">
    <span class="node-icon"><Icon icon="tabler:file-text"/></span>
    <span class="node-main"><span class="node-title">Read document</span><span class="node-summary">{{documentSummary(config.retrieval)}}</span><span v-if="config.retrieval.highlighter" class="chips"><span class="chip">Highlighter · {{modelLabel(config.retrieval.highlighter_model)}}</span></span></span>
    <span class="chip model">{{modelLabel(config.retrieval.embedding_model)}}</span>
   </button>
   <template v-for="(step,i) in config.workflow" :key="step.kind">
    <div class="connector" :class="{off:!step.enabled}"/>
    <div class="node" :class="{active:is({kind:'step',step}),off:!step.enabled}" role="button" tabindex="0" @click="selected={kind:'step',step}" @keydown.enter="selected={kind:'step',step}">
     <span class="node-icon"><Icon :icon="stepIcons[step.kind]"/></span>
     <span class="node-main">
      <span class="node-title">{{stepLabels[step.kind]}}<span class="scope">{{step.scope}}</span></span>
      <span class="node-summary">{{step.enabled?stepSummary(step,config):'Off'}}</span>
      <span v-if="step.enabled&&step.kind==='deep'&&deepFields.length" class="chips"><span v-for="f in deepFields" :key="f.name" class="chip primary">{{f.name||'New field'}}</span></span>
      <span v-if="step.enabled&&step.kind==='prefetch'&&(step.options.queries.length||hintFields.length)" class="chips"><span v-for="q in step.options.queries" :key="'q'+q.name" class="chip">{{q.name||'Untitled query'}}</span><span v-for="f in hintFields" :key="'f'+f.name" class="chip muted-chip">{{f.name}}</span></span>
      <span v-if="step.enabled&&step.kind==='scout'" class="chips"><span v-for="id in config.tools" :key="id" class="chip">{{id.split(':').pop()?.replace(/_/g,' ')}}</span></span>
      <span v-if="trace(step.kind)" class="trace-line"><Icon :icon="trace(step.kind)!.status==='failed'?'tabler:alert-circle':'tabler:circle-check'"/>{{traceLine(trace(step.kind)!)}}</span>
     </span>
     <span class="node-side">
      <span v-if="step.enabled&&step.model" class="chip model">{{modelLabel(step.model)}}</span>
      <span v-if="!readonly" class="node-actions">
       <button v-if="canMove(config,i,-1)" type="button" class="icon-btn" :aria-label="`Move ${stepLabels[step.kind]} up`" @click.stop="moveStep(config,i,-1)"><Icon icon="tabler:arrow-up"/></button>
       <button v-if="canMove(config,i,1)" type="button" class="icon-btn" :aria-label="`Move ${stepLabels[step.kind]} down`" @click.stop="moveStep(config,i,1)"><Icon icon="tabler:arrow-down"/></button>
       <Toggle v-if="step.kind!=='extract'" v-model="step.enabled" :label="`Enable ${stepLabels[step.kind]}`"/>
      </span>
     </span>
    </div>
   </template>
   <div class="connector"/>
   <button type="button" class="node fixed" :class="{active:is({kind:'output'})}" @click="selected={kind:'output'}">
    <span class="node-icon"><Icon icon="tabler:braces"/></span>
    <span class="node-main"><span class="node-title">Output</span><span class="node-summary">{{config.fields.length?`${config.fields.length} values with evidence`:'No fields yet'}}</span></span>
   </button>
  </section>

  <aside ref="inspector" class="pane inspector" aria-label="Inspector">
   <div class="pane-head"><h2>{{inspectorTitle}}</h2><button v-if="selected.kind!=='details'" type="button" class="btn subtle push" @click="selected={kind:'details'}">Details</button></div>
   <div class="inspector-body">
    <DocumentInspector v-if="selected.kind==='document'" :config="config" :retention="retention" :readonly="readonly"/>
    <StepInspector v-else-if="selected.kind==='step'" :step="selected.step" :config="config" :readonly="readonly"/>
    <FieldInspector v-else-if="selected.kind==='field'&&selectedField" :field="selectedField" :readonly="readonly" @remove="removeField((selected as {index:number}).index)"/>
    <fieldset v-else-if="selected.kind==='details'" class="inspector-form" :disabled="readonly">
     <label>Name<input v-model="title" aria-label="Extractor name"/></label>
     <label>Description<textarea v-model="description" rows="3" placeholder="What this extractor reads"/></label>
     <label>Tags<input v-model.lazy="tags" placeholder="invoices, finance"/><small>Comma separated</small></label>
    </fieldset>
    <div v-else-if="selected.kind==='output'" class="inspector-form">
     <p class="muted">Every caller gets the same result: one value per field with confidence, evidence quotes and their section, plus the run trace.</p>
     <ul class="output-list"><li v-for="f in config.fields" :key="f.name"><span class="mono">{{f.name||'New field'}}</span><span class="chip">{{f.type==='list'?`list of ${f.item_type}`:f.type}}</span></li></ul>
     <p class="muted">Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.</p>
    </div>
   </div>
  </aside>
 </div>
</template>
