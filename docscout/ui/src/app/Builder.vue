<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,nextTick,onBeforeUnmount,onMounted,ref,watch} from 'vue'
import {Icon} from '@iconify/vue'
import StageNode from './StageNode.vue'
import FieldInspector from './FieldInspector.vue'
import StepInspector from './StepInspector.vue'
import DocumentInspector from './DocumentInspector.vue'
import {documentSummary,fieldError,isOn,modelLabel,newField,stageIcons,stageLabels,type Config,type StageKey} from '../config'
import type {Extraction,TraceStep} from '../models'
const props=defineProps<{config:Config;retention:string;result:Extraction|null;readonly?:boolean}>()
const title=defineModel<string>('title',{required:true})
const description=defineModel<string>('description',{required:true})

type Selection={kind:'details'}|{kind:'document'}|{kind:'output'}|{kind:'stage';stage:StageKey}|{kind:'field';index:number}
const selected=ref<Selection>({kind:'document'})

function stored(key:string,fallback:boolean):boolean{try{const v=localStorage.getItem(`docscout.${key}`);return v===null?fallback:v==='1'}catch{return fallback}}
function store(key:string,value:boolean){try{localStorage.setItem(`docscout.${key}`,value?'1':'0')}catch{/* storage unavailable: preference stays per session */}}
const panelOpen=ref(stored('panel',true))
const fieldsOpen=ref(stored('fields',true))
const flowOpen=ref(stored('flow',true))
const PANEL_DEFAULT=400,PANEL_MIN=320
function storedWidth():number{try{const v=Number(localStorage.getItem('docscout.panelWidth'));return v>=PANEL_MIN?v:PANEL_DEFAULT}catch{return PANEL_DEFAULT}}
const panelWidth=ref(storedWidth())
const maxWidth=()=>{const width=root.value?.clientWidth;return width?Math.max(PANEL_MIN,width-420):Number.POSITIVE_INFINITY}
function setWidth(w:number,persist=true){panelWidth.value=Math.round(Math.min(maxWidth(),Math.max(PANEL_MIN,w)));if(persist){try{localStorage.setItem('docscout.panelWidth',String(panelWidth.value))}catch{/* storage unavailable: width stays per session */}}}
const resizing=ref(false)
function startResize(e:PointerEvent){
 const handle=e.currentTarget as HTMLElement,startX=e.clientX,startW=panelWidth.value
 handle.setPointerCapture(e.pointerId);resizing.value=true
 const move=(ev:PointerEvent)=>setWidth(startW+(startX-ev.clientX),false)
 const up=()=>{resizing.value=false;setWidth(panelWidth.value);handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',up)}
 handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',up)
}
function resizeKey(e:KeyboardEvent){if(e.key==='ArrowLeft'){setWidth(panelWidth.value+24);e.preventDefault()}else if(e.key==='ArrowRight'){setWidth(panelWidth.value-24);e.preventDefault()}}
function setPanel(open:boolean){panelOpen.value=open;if(!narrow.value)store('panel',open)}
function toggleSection(which:'fields'|'flow'){const r=which==='fields'?fieldsOpen:flowOpen;r.value=!r.value;store(which,r.value)}

const root=ref<HTMLElement>(),narrow=ref(false)
let observer:ResizeObserver|undefined
onMounted(()=>{observer=new ResizeObserver(([e])=>{const was=narrow.value;narrow.value=e.contentRect.width<1000;if(narrow.value&&!was)panelOpen.value=false;if(!narrow.value&&was)panelOpen.value=stored('panel',true)});if(root.value)observer.observe(root.value)})
onBeforeUnmount(()=>observer?.disconnect())

const panelBody=ref<HTMLElement>()
watch(selected,async()=>{await nextTick();if(panelBody.value)panelBody.value.scrollTop=0})
function select(s:Selection){selected.value=s;panelOpen.value=true}
const is=(s:Selection)=>JSON.stringify(s)===JSON.stringify(selected.value)
const selectedField=computed(()=>selected.value.kind==='field'?props.config.fields[selected.value.index]:undefined)
const panelTitle=computed(()=>{const s=selected.value;return s.kind==='stage'?stageLabels[s.stage]:s.kind==='field'?(selectedField.value?.name||'New field'):s.kind==='document'?'Read document':s.kind==='output'?'Output':'Details'})
const panelIcon=computed(()=>{const s=selected.value;return s.kind==='stage'?stageIcons[s.stage]:s.kind==='field'?'tabler:forms':s.kind==='document'?'tabler:file-text':s.kind==='output'?'tabler:braces':'tabler:info-circle'})
const otherNames=computed(()=>props.config.fields.filter((_,i)=>!(selected.value.kind==='field'&&selected.value.index===i)).map(f=>f.name))
const deepEnabled=computed(()=>props.config.stages.deep.enabled)
const mapEnabled=computed(()=>props.config.stages.map.enabled)
const groupNames=computed(()=>[...new Set(props.config.fields.map(f=>f.group.trim()).filter(Boolean))])
const rowError=(i:number)=>fieldError(props.config.fields[i],props.config.fields.filter((_,j)=>j!==i).map(f=>f.name))
const order:StageKey[]=['map','prefetch','scout','deep','extract','verify']
const flowPeek=computed(()=>order.filter(k=>isOn(props.config,k)).map(k=>stageLabels[k]).join(' · '))
const fieldsPeek=computed(()=>props.config.fields.map(f=>f.name||'New field').join(', '))
const enabledSteps=computed(()=>order.filter(k=>isOn(props.config,k)).length)
const trace=(kind:string):TraceStep|undefined=>props.result?.trace.find(t=>t.kind===kind)
function addField(){props.config.fields.push(newField());fieldsOpen.value=true;select({kind:'field',index:props.config.fields.length-1})}
function removeField(index:number){props.config.fields.splice(index,1);selected.value={kind:'document'}}
function moveField(index:number,delta:number){const f=props.config.fields;const next=index+delta;if(next<0||next>=f.length)return;const [x]=f.splice(index,1);f.splice(next,0,x);selected.value={kind:'field',index:next}}
const typeLabel=(f:Config['fields'][number])=>f.type==='list'?`list of ${f.item_type}`:f.type
const tags=computed({get:()=>props.config.tags.join(', '),set:(v:string)=>{props.config.tags=[...new Set(v.split(',').map(t=>t.trim()).filter(Boolean))]}})
</script>
<template>
 <div ref="root" class="builder" :class="{narrow,'panel-open':panelOpen,resizing}">
  <div class="canvas">
   <div class="canvas-inner">
    <section class="block" aria-labelledby="fields-head">
     <header class="block-head">
      <button type="button" class="collapse" :aria-expanded="fieldsOpen" aria-controls="fields-body" @click="toggleSection('fields')"><Icon :icon="fieldsOpen?'tabler:chevron-down':'tabler:chevron-right'"/><h2 id="fields-head">Fields</h2><span class="count">{{config.fields.length}}</span></button>
      <span v-if="!fieldsOpen&&config.fields.length" class="block-peek">{{fieldsPeek}}</span>
      <button v-if="!readonly" type="button" class="btn small push" @click="addField"><Icon icon="tabler:plus"/>Add field</button>
     </header>
     <div v-show="fieldsOpen" id="fields-body" class="block-body">
      <p v-if="!config.fields.length" class="block-empty">Add the values to pull from each document.</p>
      <ul v-else class="rows">
       <li v-for="(f,i) in config.fields" :key="i" class="row-item" :class="{active:is({kind:'field',index:i})}">
        <button type="button" class="row-main" @click="select({kind:'field',index:i})">
         <span class="row-name">{{f.name||'New field'}}<span v-if="f.required" class="req" title="Required">*</span><Icon v-if="rowError(i)" icon="tabler:alert-circle" class="row-warn" :title="rowError(i)"/></span>
         <span class="row-desc" :class="{missing:!f.description}">{{f.description||'No description'}}</span>
         <span class="chips"><span v-if="f.search_within==='sections'" class="chip" :class="mapEnabled?'':'muted-chip'" title="Reads the sections Map picks">sections</span><span v-if="f.group.trim()" class="chip">{{f.group}}</span><span v-if="f.strategy==='deep'" class="chip" :class="deepEnabled?'primary':'muted-chip'" :title="deepEnabled?'Deep analysis':'Deep analysis is off in the flow'">deep</span><span class="chip">{{typeLabel(f)}}</span><span v-if="f.evidence_required" class="chip" title="Evidence required"><Icon icon="tabler:quote"/></span></span>
        </button>
        <span v-if="!readonly" class="row-actions"><button type="button" class="icon-btn" aria-label="Move field up" :disabled="i===0" @click="moveField(i,-1)"><Icon icon="tabler:chevron-up"/></button><button type="button" class="icon-btn" aria-label="Move field down" :disabled="i===config.fields.length-1" @click="moveField(i,1)"><Icon icon="tabler:chevron-down"/></button></span>
       </li>
      </ul>
     </div>
    </section>

    <section class="block" aria-labelledby="flow-head">
     <header class="block-head">
      <button type="button" class="collapse" :aria-expanded="flowOpen" aria-controls="flow-body" @click="toggleSection('flow')"><Icon :icon="flowOpen?'tabler:chevron-down':'tabler:chevron-right'"/><h2 id="flow-head">Flow</h2><span class="count">{{enabledSteps}} of 6</span></button>
      <span v-if="!flowOpen" class="block-peek">{{flowPeek}}</span>
      <button type="button" class="btn small subtle push" :class="{on:is({kind:'details'})}" @click="select({kind:'details'})"><Icon icon="tabler:info-circle"/>Details</button>
     </header>
     <div v-show="flowOpen" id="flow-body" class="flow" aria-label="Extraction flow">
      <button type="button" class="node fixed" :class="{active:is({kind:'document'})}" @click="select({kind:'document'})">
       <span class="node-icon"><Icon icon="tabler:file-text"/></span>
       <span class="node-main"><span class="node-title">Read document</span><span class="node-summary">{{documentSummary(config.retrieval)}}</span></span>
       <span class="node-side"><span class="chip model">{{modelLabel(config.retrieval.embedding_model)}}</span></span>
      </button>
      <div class="connector"/>
      <StageNode stage="map" :config="config" :active="is({kind:'stage',stage:'map'})" :trace="trace('map')" :readonly="readonly" @select="select({kind:'stage',stage:'map'})"/>
      <div class="fork" aria-hidden="true"><span/></div>
      <div class="branches">
       <div class="branch">
        <span class="branch-label">Evidence</span>
        <StageNode stage="prefetch" :config="config" :active="is({kind:'stage',stage:'prefetch'})" :trace="trace('prefetch')" :readonly="readonly" @select="select({kind:'stage',stage:'prefetch'})"/>
        <div class="connector"/>
        <StageNode stage="scout" :config="config" :active="is({kind:'stage',stage:'scout'})" :trace="trace('scout')" :readonly="readonly" @select="select({kind:'stage',stage:'scout'})"/>
       </div>
       <div class="branch">
        <span class="branch-label">Deep fields</span>
        <StageNode stage="deep" :config="config" :active="is({kind:'stage',stage:'deep'})" :trace="trace('deep')" :readonly="readonly" @select="select({kind:'stage',stage:'deep'})"/>
       </div>
      </div>
      <div class="join" aria-hidden="true"><span/></div>
      <StageNode stage="extract" :config="config" :active="is({kind:'stage',stage:'extract'})" :trace="trace('extract')" :readonly="readonly" @select="select({kind:'stage',stage:'extract'})"/>
      <div class="connector"/>
      <StageNode stage="verify" :config="config" :active="is({kind:'stage',stage:'verify'})" :trace="trace('verify')" :readonly="readonly" @select="select({kind:'stage',stage:'verify'})"/>
      <div class="connector"/>
      <button type="button" class="node fixed" :class="{active:is({kind:'output'})}" @click="select({kind:'output'})">
       <span class="node-icon"><Icon icon="tabler:braces"/></span>
       <span class="node-main"><span class="node-title">Output</span><span class="node-summary">{{config.fields.length?`${config.fields.length} values with evidence`:'No fields yet'}}</span></span>
      </button>
     </div>
    </section>
   </div>
  </div>

  <div v-if="narrow&&panelOpen" class="scrim" @click="setPanel(false)"/>
  <aside v-if="panelOpen" class="side-panel" aria-label="Settings panel" :style="narrow?undefined:{width:`${panelWidth}px`}">
   <div v-if="!narrow" class="resizer" :class="{active:resizing}" role="separator" aria-orientation="vertical" aria-label="Resize panel" tabindex="0" :aria-valuenow="panelWidth" :aria-valuemin="PANEL_MIN" @pointerdown.prevent="startResize" @keydown="resizeKey" @dblclick="setWidth(PANEL_DEFAULT)"/>
   <header class="side-panel-head">
    <span class="side-panel-icon"><Icon :icon="panelIcon"/></span>
    <h2>{{panelTitle}}</h2>
    <button type="button" class="icon-btn push" aria-label="Collapse panel" title="Collapse panel" @click="setPanel(false)"><Icon :icon="narrow?'tabler:x':'tabler:layout-sidebar-right-collapse'"/></button>
   </header>
   <div ref="panelBody" class="side-panel-body">
    <DocumentInspector v-if="selected.kind==='document'" :config="config" :retention="retention" :readonly="readonly"/>
    <StepInspector v-else-if="selected.kind==='stage'" :stage="selected.stage" :config="config" :readonly="readonly"/>
    <FieldInspector v-else-if="selected.kind==='field'&&selectedField" :field="selectedField" :other-names="otherNames" :groups="groupNames" :deep-enabled="deepEnabled" :map-enabled="mapEnabled" :readonly="readonly" @remove="removeField((selected as {index:number}).index)"/>
    <fieldset v-else-if="selected.kind==='details'" class="inspector-form" :disabled="readonly">
     <label>Name<input v-model="title" aria-label="Extractor name"/></label>
     <label>Description<textarea v-model="description" rows="3" placeholder="What this extractor reads"/></label>
     <label>Tags<input v-model.lazy="tags" placeholder="invoices, finance"/><small>Comma separated</small></label>
    </fieldset>
    <div v-else-if="selected.kind==='output'" class="inspector-form">
     <p class="muted">The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.</p>
     <ul class="output-list"><li v-for="f in config.fields" :key="f.name"><span class="mono">{{f.name||'New field'}}</span><span class="chip">{{typeLabel(f)}}</span></li></ul>
     <p class="muted">Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.</p>
    </div>
   </div>
  </aside>
  <button v-else-if="!narrow" type="button" class="rail" aria-label="Open panel" title="Open panel" @click="setPanel(true)">
   <Icon icon="tabler:layout-sidebar-right-expand"/><span class="rail-label">{{panelTitle}}</span>
  </button>
 </div>
</template>
