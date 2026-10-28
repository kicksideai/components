<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed,watch} from 'vue'
import {Icon} from '@iconify/vue'
import Toggle from './Toggle.vue'
import {fieldError,formatPlaceholder,takesChoices,type Field} from '../config'
const props=defineProps<{field:Field;otherNames:string[];groups:string[];deepEnabled:boolean;mapEnabled:boolean;readonly?:boolean}>()
const emit=defineEmits<{remove:[]}>()
const types=[{value:'text',label:'Text'},{value:'number',label:'Number'},{value:'boolean',label:'Yes / no'},{value:'date',label:'Date'},{value:'enum',label:'One of a set'},{value:'list',label:'List'},{value:'object',label:'Object'}]
const itemTypes=types.filter(t=>['text','number','boolean','date','object'].includes(t.value))
const error=computed(()=>fieldError(props.field,props.otherNames))
const showsFormat=computed(()=>props.field.type!=='boolean'&&props.field.type!=='enum'&&!(props.field.type==='list'&&props.field.item_type==='boolean'))
watch(()=>props.field.type,()=>{if(!takesChoices(props.field)&&props.field.enum_values.length)props.field.enum_values=[]})
function choices(event:Event){props.field.enum_values=[...new Set((event.target as HTMLTextAreaElement).value.split('\n').map(v=>v.trim()).filter(Boolean))]}
</script>
<template>
 <fieldset class="inspector-form" :disabled="readonly">
  <div class="grid">
   <label>Name<input v-model.trim="field.name" placeholder="invoice_total" aria-label="Field name" :aria-invalid="!!error" spellcheck="false" class="mono-input"/></label>
   <label>Type<select v-model="field.type" aria-label="Field type"><option v-for="t in types" :key="t.value" :value="t.value">{{t.label}}</option></select></label>
  </div>
  <p v-if="error" class="field-error" role="alert"><Icon icon="tabler:alert-circle"/>{{error}}</p>
  <label v-if="field.type==='list'">Each item is<select v-model="field.item_type"><option v-for="t in itemTypes" :key="t.value" :value="t.value">{{t.label}}</option></select></label>
  <label v-if="takesChoices(field)">{{field.type==='enum'?'Allowed values':'Allowed items (optional)'}}<textarea :value="field.enum_values.join('\n')" rows="3" placeholder="One per line" @change="choices"/><small>{{field.type==='enum'?'The value must be exactly one of these.':'When set, every item must be one of these.'}}</small></label>
  <label>Description<textarea v-model="field.description" rows="2" placeholder="What this value means in the document"/><small>The model reads this to know what to look for.</small></label>
  <h4>Finding it</h4>
  <label>Search hints<textarea v-model="field.search_hints" rows="2" placeholder="One query per line"/><small>Each line becomes a query in Prefetch and Scout.</small></label>
  <div class="grid">
   <label>Strategy<select v-model="field.strategy"><option value="standard">Standard</option><option value="deep">Deep analysis</option></select></label>
   <label>Chunks to read<input v-model.number="field.chunks" type="number" min="1" max="1000"/><small>Per search hint</small></label>
  </div>
  <p v-if="field.strategy==='deep'&&!deepEnabled" class="field-note"><Icon icon="tabler:info-circle"/>Deep analysis is off in the flow, so this field runs as standard.</p>
  <div class="label-block"><span id="within-label">Search within</span><div class="segmented" role="radiogroup" aria-labelledby="within-label"><button type="button" role="radio" :aria-checked="field.search_within==='document'" @click="field.search_within='document'">Whole document</button><button type="button" role="radio" :aria-checked="field.search_within==='sections'" @click="field.search_within='sections'">Map's sections</button></div><small>{{field.search_within==='sections'?'Map picks the sections that should hold this value; search and reading stay inside them.':'Search covers the whole document.'}}</small></div>
  <p v-if="field.search_within==='sections'&&!mapEnabled" class="field-error"><Icon icon="tabler:alert-circle"/>Turn on Map the document to read sections.</p>
  <label>Group<input v-model.trim="field.group" list="docscout-groups" placeholder="Default"/><datalist id="docscout-groups"><option v-for="g in groups" :key="g" :value="g"/></datalist><small>Fields in a group are extracted together in one call.</small></label>
  <h4>Checking it</h4>
  <label>Validation hints<textarea v-model="field.validation_hints" rows="2" placeholder="Rules the value must satisfy"/></label>
  <label v-if="showsFormat">Expected format<input v-model="field.expected_format" :placeholder="formatPlaceholder(field)"/></label>
  <div class="toggle-row"><span>Required<small>A run reports this field as missing when no value is found.</small></span><Toggle v-model="field.required" label="Required" :disabled="readonly"/></div>
  <div class="toggle-row"><span>Evidence required<small>The value must cite a quote from the document.</small></span><Toggle v-model="field.evidence_required" label="Evidence required" :disabled="readonly"/></div>
  <button v-if="!readonly" type="button" class="btn danger-text" @click="emit('remove')">Remove field</button>
 </fieldset>
</template>
