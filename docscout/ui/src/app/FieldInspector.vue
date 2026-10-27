<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Toggle from './Toggle.vue'
import type {Field} from '../config'
defineProps<{field:Field;readonly?:boolean}>()
const emit=defineEmits<{remove:[]}>()
const types=['text','number','boolean','date','enum','list','object']
const lines=(event:Event)=>(event.target as HTMLTextAreaElement).value.split('\n').map(v=>v.trim()).filter(Boolean)
</script>
<template>
 <fieldset class="inspector-form" :disabled="readonly">
  <div class="grid"><label>Name<input v-model="field.name" placeholder="invoice_total" aria-label="Field name"/></label><label>Type<select v-model="field.type" aria-label="Field type"><option v-for="t in types" :key="t" :value="t">{{t[0].toUpperCase()+t.slice(1)}}</option></select></label></div>
  <label>Description<textarea v-model="field.description" rows="2" placeholder="What this value means"/></label>
  <label v-if="field.type==='enum'">Allowed values<textarea :value="field.enum_values.join('\n')" rows="3" placeholder="One value per line" @input="field.enum_values=lines($event)"/></label>
  <label v-if="field.type==='list'">Item type<select v-model="field.item_type"><option v-for="t in types.filter(t=>t!=='list')" :key="t" :value="t">{{t}}</option></select></label>
  <h4>Finding it</h4>
  <label>Search hints<textarea v-model="field.search_hints" rows="2" placeholder="Terms and phrases to look for"/><small>Added to Prefetch and Scout as this field's queries.</small></label>
  <div class="grid"><label>Strategy<select v-model="field.strategy"><option value="standard">Standard</option><option value="deep">Deep analysis</option></select></label><label>Chunks to read<input v-model.number="field.chunks" type="number" min="1" max="1000"/></label></div>
  <h4>Checking it</h4>
  <label>Validation hints<textarea v-model="field.validation_hints" rows="2" placeholder="Rules the value should satisfy"/></label>
  <label>Expected format<input v-model="field.expected_format" placeholder="For example, YYYY-MM-DD"/></label>
  <div class="toggle-row"><span>Required</span><Toggle v-model="field.required" label="Required" :disabled="readonly"/></div>
  <div class="toggle-row"><span>Evidence required</span><Toggle v-model="field.evidence_required" label="Evidence required" :disabled="readonly"/></div>
  <button v-if="!readonly" type="button" class="btn danger-text" @click="emit('remove')">Remove field</button>
 </fieldset>
</template>
