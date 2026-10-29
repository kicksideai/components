<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,ref,useId,watch} from 'vue'
import {Icon} from '@iconify/vue'
import {MAX_SHAPE_DEPTH,type Shape,type Property,type Field} from '../config'
import {shapeKey,typeIcon,type Trail} from '../shape-builder'
const props=defineProps<{shape:Shape;field:number;trail:Trail;path:string;selected:string;readonly?:boolean;first?:boolean;last?:boolean;error?:string}>()
const emit=defineEmits<{select:[field:number,trail:Trail];add:[field:number,trail:Trail];reorder:[field:number,trail:Trail,delta:number]}>()
const descriptionId=useId()
const open=ref(true)
watch(()=>props.selected,selected=>{
 const key=shapeKey(props.field,props.trail)
 if(selected!==key&&selected.startsWith(key+(props.trail.length?'/':'')))open.value=true
})
const named=computed(()=>props.trail.at(-1)!=='item')
const name=computed(()=>named.value?(props.shape as Property).name||'New field':'Each item')
const rootField=computed(()=>!props.trail.length?props.shape as Field:undefined)
const expandable=computed(()=>props.shape.type==='object'||props.shape.type==='list')
function keys(event:KeyboardEvent){
 if(event.key==='ArrowRight'&&expandable.value){open.value=true;event.preventDefault();event.stopPropagation()}
 if(event.key==='ArrowLeft'&&expandable.value){open.value=false;event.preventDefault();event.stopPropagation()}
}
</script>
<template>
 <div class="shape-tree-node" @keydown="keys">
  <div class="row-item" :class="{active:selected===shapeKey(field,trail)}">
   <button v-if="expandable" class="tree-toggle kx-iconbtn kx-focus-outline" type="button" :aria-label="`${open?'Collapse':'Expand'} ${path}`" :aria-expanded="open" @click="open=!open"><Icon :icon="open?'tabler:chevron-down':'tabler:chevron-right'"/></button>
   <span v-else class="tree-indent"/>
   <button type="button" class="row-main kx-focus-halo" :aria-label="`Edit ${path}`" :aria-describedby="descriptionId" :aria-current="selected===shapeKey(field,trail)?'true':undefined" @click="emit('select',field,trail)">
    <span class="row-copy">
     <span class="row-name"><Icon :icon="typeIcon(shape.type)" aria-hidden="true"/><span class="row-label" :title="name">{{name}}</span><Icon v-if="error" icon="tabler:alert-circle" class="row-warn" :aria-label="error" :title="error"/></span>
     <span :id="descriptionId" class="row-desc" :class="{missing:!shape.description}" :title="shape.description||undefined">{{shape.description||'No description'}}</span>
    </span>
    <span class="field-badges">
     <span class="chip field-type">{{shape.type}}</span>
     <span class="field-flags">
      <span v-if="named&&(shape as Property).required" class="chip field-flag" role="img" aria-label="Required" title="Required"><Icon icon="tabler:asterisk" aria-hidden="true"/></span>
      <span v-if="rootField?.strategy==='deep'" class="chip field-flag primary" role="img" aria-label="Deep analysis" title="Deep analysis"><Icon icon="tabler:microscope" aria-hidden="true"/></span>
      <span v-if="rootField?.search_within==='sections'" class="chip field-flag" role="img" aria-label="Reads sections" title="Reads sections"><Icon icon="tabler:layout-list" aria-hidden="true"/></span>
      <span v-if="rootField?.evidence_required" class="chip field-flag" role="img" aria-label="Evidence required" title="Evidence required"><Icon icon="tabler:file-search" aria-hidden="true"/></span>
     </span>
    </span>
   </button>
   <span v-if="!readonly&&named" class="row-actions">
    <button type="button" class="kx-iconbtn kx-focus-outline" :aria-label="`Move ${path} up`" :disabled="first" @click="emit('reorder',field,trail,-1)"><Icon icon="tabler:chevron-up"/></button>
    <button type="button" class="kx-iconbtn kx-focus-outline" :aria-label="`Move ${path} down`" :disabled="last" @click="emit('reorder',field,trail,1)"><Icon icon="tabler:chevron-down"/></button>
   </span>
  </div>
  <ul v-if="expandable&&open" class="tree-children">
   <li v-for="(p,i) in shape.properties" :key="i"><ShapeTree :shape="p" :field="field" :trail="[...trail,i]" :path="`${path}.${p.name||'New property'}`" :selected="selected" :readonly="readonly" :first="i===0" :last="i===shape.properties!.length-1" @select="(f,t)=>emit('select',f,t)" @add="(f,t)=>emit('add',f,t)" @reorder="(f,t,d)=>emit('reorder',f,t,d)"/></li>
   <li v-if="shape.item"><ShapeTree :shape="shape.item" :field="field" :trail="[...trail,'item']" :path="`${path}[]`" :selected="selected" :readonly="readonly" @select="(f,t)=>emit('select',f,t)" @add="(f,t)=>emit('add',f,t)" @reorder="(f,t,d)=>emit('reorder',f,t,d)"/></li>
   <li v-if="!readonly&&shape.type==='object'&&trail.length+1<MAX_SHAPE_DEPTH"><button type="button" class="kx-btn kx-btn-ghost kx-focus-halo sm" :aria-label="`Add property to ${path}`" :disabled="(shape.properties?.length??0)>=100" @click="emit('add',field,trail)"><Icon icon="tabler:plus"/>Add property</button></li>
  </ul>
 </div>
</template>
