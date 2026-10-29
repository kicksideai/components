<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
import Toggle from './Toggle.vue'
import {MAX_SHAPE_DEPTH,newItem,newProperty,formatPlaceholder,takesChoices,type Shape,type Property,type FieldType} from '../config'
const props=withDefaults(defineProps<{shape:Shape;depth?:number;label?:string;named?:boolean;readonly?:boolean}>(),{depth:1,label:'field',named:false})
const property=computed(()=>props.shape as Property)
const types:{value:FieldType;label:string}[]=[{value:'text',label:'Text'},{value:'number',label:'Number'},{value:'boolean',label:'Yes / no'},{value:'date',label:'Date'},{value:'enum',label:'One of a set'},{value:'list',label:'List'},{value:'object',label:'Object'}]
const allowed=computed(()=>types.filter(t=>props.depth<MAX_SHAPE_DEPTH||!['object','list'].includes(t.value)))
function changeType(event:Event){
 const type=(event.target as HTMLSelectElement).value as FieldType
 props.shape.type=type
 delete props.shape.properties;delete props.shape.item;props.shape.enum_values=[]
 if(type==='object')props.shape.properties=[]
 if(type==='list')props.shape.item=newItem()
}
function choices(event:Event){props.shape.enum_values=[...new Set((event.target as HTMLTextAreaElement).value.split('\n').map(v=>v.trim()).filter(Boolean))]}
</script>
<template>
 <div class="shape-editor">
  <div class="grid">
   <label v-if="named">Name<input v-model.trim="property.name" :aria-label="depth===1?'Field name':'Property name'" spellcheck="false" class="mono-input"/></label>
   <label>Type<select :value="shape.type" @change="changeType" :aria-label="named?(depth===1?'Field type':'Property type'):'Item type'" :disabled="readonly"><option v-for="t in allowed" :key="t.value" :value="t.value">{{t.label}}</option></select></label>
  </div>
  <label v-if="takesChoices(shape,named)">{{shape.type==='enum'?'Allowed values':'Allowed items (optional)'}}<textarea :value="shape.enum_values?.join('\n')??''" rows="3" placeholder="One per line" @change="choices"/></label>
  <label>Description<textarea v-model="shape.description" rows="2" placeholder="What this value means in the document"/></label>
  <label v-if="!['boolean','enum'].includes(shape.type)">Expected format<input v-model="shape.expected_format" :placeholder="formatPlaceholder(shape)"/></label>
  <div v-if="named" class="toggle-row"><span>Required</span><Toggle v-model="property.required" label="Required" :disabled="readonly"/></div>
  <template v-if="shape.type==='object'">
   <h4>Properties</h4>
   <fieldset v-for="(p,i) in shape.properties" :key="i" class="property-editor" data-property-editor :disabled="readonly">
    <legend>{{p.name||'New property'}}</legend>
    <ShapeEditor :shape="p" :depth="depth+1" :label="p.name||'property'" named :readonly="readonly"/>
    <button v-if="!readonly" type="button" class="kx-btn kx-btn-ghost kx-focus-halo sm" :aria-label="`Remove property ${p.name||i+1}`" @click="shape.properties!.splice(i,1)">Remove property</button>
   </fieldset>
   <button v-if="!readonly&&depth<MAX_SHAPE_DEPTH" type="button" class="kx-btn kx-btn-ghost kx-focus-halo sm" :aria-label="`Add property to ${label}`" @click="shape.properties!.push(newProperty())">Add property</button>
  </template>
  <fieldset v-if="shape.type==='list'&&shape.item" class="property-editor" :disabled="readonly"><legend>Each item is</legend><ShapeEditor :shape="shape.item" :depth="depth+1" :label="`${label} item`" :readonly="readonly"/></fieldset>
 </div>
</template>
