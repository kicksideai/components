<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,ref,useId,watch} from 'vue'
import {Icon} from '@iconify/vue'
import Toggle from './Toggle.vue'
import Segmented from './Segmented.vue'
import {MAX_SHAPE_DEPTH,newItem,formatPlaceholder,takesChoices,nameError,shapeError,type Shape,type Property,type FieldType} from '../config'
import {typeOptions} from '../shape-builder'
const props=withDefaults(defineProps<{shape:Shape;depth?:number;label?:string;named?:boolean;readonly?:boolean;siblingNames?:string[];validationError?:string}>(),{depth:1,label:'field',named:false,siblingNames:()=>[]})
const emit=defineEmits<{add:[];selectItem:[]}>()
const property=computed(()=>props.shape as Property)
const typeLabel=computed(()=>props.named?(props.depth===1?'Field type':'Property type'):'Item type')
const allowed=computed(()=>typeOptions.filter(t=>props.depth<MAX_SHAPE_DEPTH||!['object','list'].includes(t.value)))
const type=computed({get:()=>props.shape.type,set:(type:FieldType)=>{
 props.shape.type=type;delete props.shape.properties;delete props.shape.item;props.shape.enum_values=[]
 if(type==='object')props.shape.properties=[]
 if(type==='list')props.shape.item=newItem()
}})
const typeId=useId(),errorId=useId(),choice=ref(''),choiceError=ref('')
watch(()=>props.shape,()=>{choice.value='';choiceError.value=''})
const error=computed(()=>props.validationError||(props.named?nameError(property.value.name,props.siblingNames):'')||shapeError(props.shape,props.depth))
function addChoice(){
 const next=choice.value.trim(),values=props.shape.enum_values??[]
 if(!next||next.length>200){choiceError.value='Enter 1 to 200 characters.';return}
 if(values.includes(next)){choiceError.value='This value already exists.';return}
 if(values.length>=100){choiceError.value='Use at most 100 allowed values.';return}
 props.shape.enum_values=[...values,next];choice.value='';choiceError.value=''
}
</script>
<template>
 <div class="shape-editor">
  <label v-if="named">Name<input v-model.trim="property.name" :aria-label="depth===1?'Field name':'Property name'" :aria-invalid="!!error" :aria-describedby="error?errorId:undefined" maxlength="80" spellcheck="false" class="mono-input"/></label>
  <div class="label-block"><span :id="typeId">{{named?'Data type':'Item type'}}</span><Segmented v-model="type" class="type-picker" :options="allowed" :labelled-by="typeId" :name="typeLabel" :disabled="readonly"/><small v-if="depth===MAX_SHAPE_DEPTH">Level four · choose a value type.</small></div>
  <p v-if="error" :id="errorId" class="field-error" role="alert">{{error}}</p>
  <div v-if="takesChoices(shape,named)" class="label-block">
   <span>{{shape.type==='enum'?'Allowed values':'Allowed items (optional)'}}</span>
   <div class="chips"><span v-for="(value,i) in shape.enum_values" :key="value" class="chip primary">{{value}}<button v-if="!readonly" type="button" class="kx-iconbtn kx-focus-outline" :aria-label="`Remove allowed value ${value}`" @click="shape.enum_values!.splice(i,1)"><Icon icon="tabler:x"/></button></span></div>
   <div v-if="!readonly" class="row"><input v-model="choice" aria-label="New allowed value" placeholder="Add a value…" maxlength="200" @keydown.enter.prevent="addChoice"/><button type="button" class="kx-btn kx-btn-ghost kx-focus-halo" @click="addChoice">Add</button></div>
   <p v-if="choiceError" class="field-error" role="alert">{{choiceError}}</p>
  </div>
  <label>Description<textarea v-model="shape.description" rows="3" maxlength="4000" placeholder="What this value means in the document"/></label>
  <label v-if="!['boolean','enum'].includes(shape.type)">Expected format<input v-model="shape.expected_format" maxlength="400" :placeholder="formatPlaceholder(shape)"/></label>
  <div v-if="named" class="toggle-row"><span>Required</span><Toggle v-model="property.required" label="Required" :disabled="readonly"/></div>
  <template v-if="shape.type==='object'">
   <p class="muted">{{shape.properties?.length??0}} properties · Select a property in the tree to edit it.</p>
   <button v-if="!readonly&&depth<MAX_SHAPE_DEPTH" type="button" class="kx-btn kx-btn-ghost kx-focus-halo" :aria-label="`Add property to ${label}`" :disabled="(shape.properties?.length??0)>=100" @click="emit('add')"><Icon icon="tabler:plus"/>Add property</button>
  </template>
  <button v-if="shape.type==='list'&&shape.item" type="button" class="kx-btn kx-btn-ghost kx-focus-halo" @click="emit('selectItem')"><Icon icon="tabler:brackets"/>Edit item shape · {{shape.item.type}}</button>
 </div>
</template>
