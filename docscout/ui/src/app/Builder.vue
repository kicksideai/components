<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,nextTick,onBeforeUnmount,onMounted,ref,useId,watch} from 'vue'
import {Icon} from '@iconify/vue'
import vFocusTrap from 'primevue/focustrap'
import StageNode from './StageNode.vue'
import FieldInspector from './FieldInspector.vue'
import FieldGroups from './FieldGroups.vue'
import GroupHeader from './GroupHeader.vue'
import ShapeTree from './ShapeTree.vue'
import {shapeNodes,shapeKey,moveTargets,moveShape,outputPreview,type Trail} from '../shape-builder'
import StepInspector from './StepInspector.vue'
import DocumentInspector from './DocumentInspector.vue'
import {documentSummary,fieldError,fieldPath,pathCollision,groupTree,groupPattern,isOn,modelLabel,newField,newProperty,stageIcons,stageLabels,type Config,type StageKey} from '../config'
import type {Extraction,TraceStep} from '../models'
const props=defineProps<{config:Config;retention:string;result:Extraction|null;readonly?:boolean}>()
const title=defineModel<string>('title',{required:true})
const description=defineModel<string>('description',{required:true})

type Selection={kind:'details'}|{kind:'document'}|{kind:'output'}|{kind:'stage';stage:StageKey}|{kind:'field';index:number;trail?:Trail}
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
// At narrow widths the panel is a modal drawer: it takes focus and gives it back to its opener on close.
let opener:HTMLElement|null=null
const closeButton=ref<HTMLButtonElement>()
const panelLabel=useId()
async function setPanel(open:boolean){
 panelOpen.value=open
 if(!narrow.value){store('panel',open);return}
 if(!open&&opener){const target=opener;opener=null;await nextTick();target.focus()}
}
function toggleSection(which:'fields'|'flow'){const r=which==='fields'?fieldsOpen:flowOpen;r.value=!r.value;store(which,r.value)}

const root=ref<HTMLElement>(),narrow=ref(false)
let observer:ResizeObserver|undefined
onMounted(()=>{observer=new ResizeObserver(([e])=>{const was=narrow.value;narrow.value=e.contentRect.width<1000;if(narrow.value&&!was)panelOpen.value=false;if(!narrow.value&&was)panelOpen.value=stored('panel',true)});if(root.value)observer.observe(root.value)})
onBeforeUnmount(()=>observer?.disconnect())

const panelBody=ref<HTMLElement>()
watch(selected,async()=>{await nextTick();if(panelBody.value)panelBody.value.scrollTop=0})
async function select(s:Selection){
 if(narrow.value&&!panelOpen.value)opener=(root.value?.getRootNode() as Document|ShadowRoot|undefined)?.activeElement as HTMLElement|null
 selected.value=s;panelOpen.value=true
 if(narrow.value){await nextTick();closeButton.value?.focus()}
}
const is=(s:Selection)=>JSON.stringify(s)===JSON.stringify(selected.value)
const selectedField=computed(()=>selected.value.kind==='field'?props.config.fields[selected.value.index]:undefined)
const nodes=computed(()=>shapeNodes(props.config.fields))
const selectedNode=computed(()=>selected.value.kind==='field'?nodes.value.find(n=>n.key===shapeKey((selected.value as {index:number}).index,(selected.value as {trail?:Trail}).trail??[])):undefined)
const selectedKey=computed(()=>selectedNode.value?.key??'')
const siblingNames=computed(()=>{const n=selectedNode.value;if(!n||n.trail.at(-1)==='item')return undefined;if(!n.trail.length)return undefined;const parent=nodes.value.find(p=>p.key===shapeKey(n.field,n.trail.slice(0,-1)))!;return parent.shape.properties!.filter(p=>p!==n.shape).map(p=>p.name)})
const destination=ref('')
watch(selectedKey,()=>{destination.value=''})
const targets=computed(()=>selectedNode.value?moveTargets(props.config.fields,selectedNode.value):[])
const previewError=computed(()=>{const path=pathCollision(props.config.fields.map(fieldPath));return path?`Group path collides with field ${path}.`:''})
const preview=computed(()=>previewError.value?null:outputPreview(props.config.fields))
const example=computed(()=>previewError.value?null:outputPreview(props.config.fields,true))
const panelTitle=computed(()=>{const s=selected.value;return s.kind==='stage'?stageLabels[s.stage]:s.kind==='field'?(selectedNode.value?.trail.length?selectedNode.value.path:(selectedField.value?.name||'New field')):s.kind==='document'?'Read document':s.kind==='output'?'Output':'Details'})
const panelIcon=computed(()=>{const s=selected.value;return s.kind==='stage'?stageIcons[s.stage]:s.kind==='field'?'tabler:forms':s.kind==='document'?'tabler:file-text':s.kind==='output'?'tabler:braces':'tabler:info-circle'})
const otherNames=computed(()=>props.config.fields.filter((_,i)=>!(selected.value.kind==='field'&&selected.value.index===i)).map(fieldPath))
const deepEnabled=computed(()=>props.config.stages.deep.enabled)
const mapEnabled=computed(()=>props.config.stages.map.enabled)
const groups=computed(()=>groupTree(props.config.fields.map(fieldPath)))
const groupDraft=ref(''),groupError=ref('')
function renameGroup(path:string,next:string){

 for(const f of props.config.fields)if(f.group===path||f.group.startsWith(path+'.'))f.group=next+f.group.slice(path.length)
 groupError.value=''
}
const groupNameLimit=(path:string)=>320-Math.max(0,...props.config.fields.filter(f=>f.group===path||f.group.startsWith(path+'.')).map(f=>f.group.length-path.length))
function addGroup(){if(!groupDraft.value||!groupPattern.test(groupDraft.value)){groupError.value='Use a dotted path of snake_case group names.';return}addField(groupDraft.value);groupDraft.value='';groupError.value=''}
const groupNames=computed(()=>[...new Set(props.config.fields.map(f=>f.group.trim()).filter(Boolean))])
const rowError=(i:number)=>fieldError(props.config.fields[i],props.config.fields.filter((_,j)=>j!==i).map(fieldPath))
const order:StageKey[]=['map','prefetch','scout','deep','extract','verify']
const flowPeek=computed(()=>order.filter(k=>isOn(props.config,k)).map(k=>stageLabels[k]).join(' · '))
const fieldsPeek=computed(()=>props.config.fields.map(f=>f.name||'New field').join(', '))
const enabledSteps=computed(()=>order.filter(k=>isOn(props.config,k)).length)
const trace=(kind:string):TraceStep|undefined=>props.result?.trace.find(t=>t.kind===kind)
function addField(group=''){props.config.fields.push({...newField(),group});fieldsOpen.value=true;select({kind:'field',index:props.config.fields.length-1})}
function removeField(index:number){props.config.fields.splice(index,1);selected.value={kind:'document'}}
function selectShape(field:number,trail:Trail=[]){select({kind:'field',index:field,...(trail.length?{trail}:{})})}
function addProperty(field:number,trail:Trail){
 const node=nodes.value.find(n=>n.key===shapeKey(field,trail))!
 node.shape.properties!.push(newProperty());selectShape(field,[...trail,node.shape.properties!.length-1])
}
function removeNode(){
 const node=selectedNode.value!
 if(!node.trail.length){removeField(node.field);return}
 const parent=nodes.value.find(n=>n.key===shapeKey(node.field,node.trail.slice(0,-1)))!
 parent.shape.properties!.splice(node.trail.at(-1) as number,1);selectShape(parent.field,parent.trail)
}
function reorder(field:number,trail:Trail,delta:number){
 if(!trail.length){
  const indices=props.config.fields.map((f,i)=>f.group===props.config.fields[field].group?i:-1).filter(i=>i>=0)
  const next=indices[indices.indexOf(field)+delta];if(next===undefined)return
  const fields=props.config.fields;[fields[field],fields[next]]=[fields[next],fields[field]];selectShape(next)
 }else{
  const parent=nodes.value.find(n=>n.key===shapeKey(field,trail.slice(0,-1)))!
  const siblings=parent.shape.properties!,index=trail.at(-1) as number,next=index+delta
  if(next<0||next>=siblings.length)return
  ;[siblings[index],siblings[next]]=[siblings[next],siblings[index]];selectShape(field,[...trail.slice(0,-1),next])
 }
}
function moveSelected(){
 const source=selectedNode.value!,target=targets.value.find(n=>n.key===destination.value)
 const moved=moveShape(props.config.fields,source,target);selectShape(moved.field,moved.trail)
}
function deleteGroup(path:string){
 const keep=selectedNode.value?.shape
 props.config.fields.splice(0,props.config.fields.length,...props.config.fields.filter(f=>f.group!==path&&!f.group.startsWith(path+'.')))
 const node=nodes.value.find(n=>n.shape===keep);if(node)selectShape(node.field,node.trail);else selected.value={kind:'document'}
}
function reorderGroup(path:string,delta:number){
 const parent=path.split('.').slice(0,-1).join('.')
 const siblings=groupTree(props.config.fields.map(fieldPath))
 let node=siblings
 for(const segment of parent.split('.').filter(Boolean))node=node.children.find(n=>n.name===segment)!
 const index=node.children.findIndex(n=>n.path===path),other=node.children[index+delta]?.path
 if(!other)return
 const a=props.config.fields.filter(f=>f.group===path||f.group.startsWith(path+'.')),b=props.config.fields.filter(f=>f.group===other||f.group.startsWith(other+'.'))
 const fields=props.config.fields,first=Math.min(fields.indexOf(a[0]),fields.indexOf(b[0])),remaining=fields.filter(f=>!a.includes(f)&&!b.includes(f))
 remaining.splice(first,0,...(delta>0?[...b,...a]:[...a,...b]))
 const keep=selectedNode.value?.shape;fields.splice(0,fields.length,...remaining)
 const next=nodes.value.find(n=>n.shape===keep);if(next)selectShape(next.field,next.trail)
}
const typeLabel=(f:Config['fields'][number])=>f.type==='list'?`list of ${f.item?.type}`:f.type
const tags=computed({get:()=>props.config.tags.join(', '),set:(v:string)=>{props.config.tags=[...new Set(v.split(',').map(t=>t.trim()).filter(Boolean))]}})
</script>
<template>
 <div ref="root" class="builder" :class="{narrow,'panel-open':panelOpen,resizing}">
  <div class="canvas" :inert="narrow&&panelOpen">
   <div class="canvas-inner">
    <section class="block fields-block" aria-labelledby="fields-head">
     <header class="block-head">
      <button type="button" class="collapse" :aria-expanded="fieldsOpen" aria-controls="fields-body" @click="toggleSection('fields')"><Icon :icon="fieldsOpen?'tabler:chevron-down':'tabler:chevron-right'"/><h2 id="fields-head">Fields</h2><span class="count">{{config.fields.length}}</span></button>
      <span v-if="!fieldsOpen&&config.fields.length" class="block-peek">{{fieldsPeek}}</span>
      <button v-if="!readonly" type="button" class="kx-btn kx-btn-ghost kx-focus-halo sm push" :disabled="config.fields.length>=100" @click="addField()"><Icon icon="tabler:plus"/>Add field</button>
     </header>
     <div v-show="fieldsOpen" id="fields-body" class="block-body">
      <p v-if="!config.fields.length" class="block-empty">Add the values to pull from each document.</p>
      <form v-if="!readonly" class="group-add row" @submit.prevent="addGroup"><label>New group<input v-model.trim="groupDraft" placeholder="parties.borrower" aria-label="New group path" maxlength="320"/></label><button type="submit" class="kx-btn kx-btn-ghost kx-focus-halo sm" :disabled="config.fields.length>=100">Add group</button></form>
      <p v-if="groupError" class="field-error" role="alert">{{groupError}}</p>
      <div class="field-tree"><FieldGroups :node="groups">
       <template #header="{path,label,count,first,last}">
        <GroupHeader :path="path" :name="label" :count="count" :first="first" :last="last" :max-length="groupNameLimit(path)" :can-add="config.fields.length<100" :readonly="readonly" @rename="renameGroup(path,$event)" @add="addField(path)" @reorder="reorderGroup(path,$event)" @remove="deleteGroup(path)"/>
       </template>
       <template #default="{index:i}">
        <ShapeTree :shape="config.fields[i]" :field="i" :trail="[]" :path="fieldPath(config.fields[i])||'New field'" :selected="selectedKey" :readonly="readonly" :error="rowError(i)" :first="!config.fields.slice(0,i).some(f=>f.group===config.fields[i].group)" :last="!config.fields.slice(i+1).some(f=>f.group===config.fields[i].group)" @select="selectShape" @add="addProperty" @reorder="reorder"/>
       </template>
      </FieldGroups></div>
      <details class="shape-preview" open><summary class="kx-focus-outline"><Icon icon="tabler:braces"/>Output preview</summary>
       <p v-if="previewError" class="field-error" role="alert">{{previewError}}</p>
       <div v-else class="preview-grid"><div><h3>Output shape</h3><pre aria-label="Output shape">{{JSON.stringify(preview,null,2)}}</pre></div><div><h3>Example value</h3><pre aria-label="Example output">{{JSON.stringify(example,null,2)}}</pre></div></div>
       <small>Example values illustrate the shape; extracted values come from your document.</small>
      </details>
     </div>
    </section>

    <section class="block" aria-labelledby="flow-head">
     <header class="block-head">
      <button type="button" class="collapse" :aria-expanded="flowOpen" aria-controls="flow-body" @click="toggleSection('flow')"><Icon :icon="flowOpen?'tabler:chevron-down':'tabler:chevron-right'"/><h2 id="flow-head">Flow</h2><span class="count">{{enabledSteps}} of 6</span></button>
      <span v-if="!flowOpen" class="block-peek">{{flowPeek}}</span>
      <button type="button" class="kx-btn kx-btn-ghost kx-focus-halo sm push" :class="{on:is({kind:'details'})}" @click="select({kind:'details'})"><Icon icon="tabler:info-circle"/>Details</button>
     </header>
     <div v-show="flowOpen" id="flow-body" class="flow" aria-label="Extraction flow">
      <button type="button" class="node kx-focus-halo fixed" :class="{active:is({kind:'document'})}" @click="select({kind:'document'})">
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
      <button type="button" class="node kx-focus-halo fixed" :class="{active:is({kind:'output'})}" @click="select({kind:'output'})">
       <span class="node-icon"><Icon icon="tabler:braces"/></span>
       <span class="node-main"><span class="node-title">Output</span><span class="node-summary">{{config.fields.length?`${config.fields.length} values with evidence`:'No fields yet'}}</span></span>
      </button>
     </div>
    </section>
   </div>
  </div>

  <div v-if="narrow&&panelOpen" class="scrim" @click="setPanel(false)"/>
  <aside v-if="panelOpen" :key="String(narrow)" v-focus-trap="{disabled:!narrow}" class="side-panel" :aria-labelledby="panelLabel" :role="narrow?'dialog':undefined" :aria-modal="narrow?'true':undefined" :style="narrow?undefined:{width:`${panelWidth}px`}" @keydown.esc="narrow&&setPanel(false)">
   <div v-if="!narrow" class="resizer kx-focus-outline" :class="{active:resizing}" role="separator" aria-orientation="vertical" aria-label="Resize panel" tabindex="0" :aria-valuenow="panelWidth" :aria-valuemin="PANEL_MIN" @pointerdown.prevent="startResize" @keydown="resizeKey" @dblclick="setWidth(PANEL_DEFAULT)"/>
   <header class="side-panel-head">
    <span class="side-panel-icon"><Icon :icon="panelIcon"/></span>
    <h2 :id="panelLabel">{{panelTitle}}</h2>
    <button ref="closeButton" type="button" class="kx-iconbtn kx-focus-outline push" :aria-label="narrow?'Close panel':'Collapse panel'" :title="narrow?'Close panel':'Collapse panel'" @click="setPanel(false)"><Icon :icon="narrow?'tabler:x':'tabler:layout-sidebar-right-collapse'"/></button>
   </header>
   <div ref="panelBody" class="side-panel-body">
    <DocumentInspector v-if="selected.kind==='document'" :config="config" :retention="retention" :readonly="readonly"/>
    <StepInspector v-else-if="selected.kind==='stage'" :stage="selected.stage" :config="config" :readonly="readonly"/>
    <template v-else-if="selected.kind==='field'&&selectedField&&selectedNode">
     <p class="node-breadcrumb mono">{{selectedNode.path}}</p>
     <FieldInspector :field="selectedField" :shape="selectedNode.shape" :depth="selectedNode.depth" :sibling-names="siblingNames" :other-names="otherNames" :groups="groupNames" :deep-enabled="deepEnabled" :map-enabled="mapEnabled" :readonly="readonly" @remove="removeNode" @add="addProperty(selectedNode.field,selectedNode.trail)" @select-item="selectShape(selectedNode.field,[...selectedNode.trail,'item'])"/>
     <fieldset v-if="!readonly&&selectedNode.trail.at(-1)!=='item'" class="move-node" aria-label="Move node">
      <label>Move to parent<select v-model="destination" aria-label="Move to parent"><option v-if="selectedNode.trail.length" value="">Top-level field</option><option v-else value="" disabled>Choose an object…</option><option v-for="target in targets" :key="target.key" :value="target.key">{{target.path}}</option></select></label>
      <button type="button" class="kx-btn kx-btn-ghost kx-focus-halo" aria-label="Move selected node" :disabled="(!destination&&!selectedNode.trail.length)||(!destination&&config.fields.length>=100)" @click="moveSelected">Move</button>
     </fieldset>
    </template>
    <fieldset v-else-if="selected.kind==='details'" class="inspector-form" :disabled="readonly">
     <label>Name<input v-model="title" aria-label="Extractor name"/></label>
     <label>Description<textarea v-model="description" rows="3" placeholder="What this extractor reads"/></label>
     <label>Tags<input v-model.lazy="tags" placeholder="invoices, finance"/><small>Comma separated</small></label>
    </fieldset>
    <div v-else-if="selected.kind==='output'" class="inspector-form">
     <p class="muted">The Test tab, agents, evaluations and Workflows all run this configuration. Each value comes with its confidence, verification and quotes with section and page; every run is recorded with its step trace.</p>
     <ul class="output-list"><li v-for="f in config.fields" :key="fieldPath(f)"><span class="mono">{{fieldPath(f)||'New field'}}</span><span class="chip">{{typeLabel(f)}}</span></li></ul>
     <p class="muted">Used by people in Test, by agents through the Docscout tools, by evals, and in Workflows as the Extract document fields block.</p>
    </div>
   </div>
  </aside>
  <button v-else-if="!narrow" type="button" class="rail" aria-label="Open panel" title="Open panel" @click="setPanel(true)">
   <Icon icon="tabler:layout-sidebar-right-expand"/><span class="rail-label">{{panelTitle}}</span>
  </button>
 </div>
</template>
