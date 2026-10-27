<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import {newField,type Config} from '../config'
defineProps<{config:Config}>()
const types=['text','number','boolean','date','enum','list','object']
function enumValues(event:Event){return (event.target as HTMLTextAreaElement).value.split('\n').map(v=>v.trim()).filter(Boolean)}
</script>
<template>
 <div class="section-head"><div><h2>Fields</h2><p class="muted">Values to find in each document.</p></div><Button label="Add field" size="small" @click="config.fields.push(newField())"/></div>
 <p v-if="!config.fields.length" class="empty">No fields yet.</p>
 <article v-for="(field,i) in config.fields" :key="i" class="field-card">
  <header class="row"><span class="ordinal">{{i+1}}</span><h3>{{field.name||'New field'}}</h3><Button label="Remove" severity="secondary" text size="small" class="push" @click="config.fields.splice(i,1)"/></header>
  <div class="grid"><label>Name<InputText v-model="field.name" placeholder="invoice_total" :aria-label="`Field ${i+1} name`"/></label><label>Type<select v-model="field.type" :aria-label="`Field ${i+1} type`"><option v-for="t in types" :key="t" :value="t">{{t[0].toUpperCase()+t.slice(1)}}</option></select></label></div>
  <label>Description<Textarea v-model="field.description" rows="2" placeholder="What this value means"/></label>
  <label v-if="field.type==='enum'">Enum values<Textarea :value="field.enum_values.join('\n')" rows="3" placeholder="One value per line" @input="field.enum_values=enumValues($event)"/></label>
  <label v-if="field.type==='list'">List item type<select v-model="field.item_type"><option v-for="t in types.filter(t=>!['enum','list'].includes(t))" :key="t" :value="t">{{t}}</option></select></label>
  <div class="grid"><label>Search hints<Textarea v-model="field.search_hints" rows="2" placeholder="Terms and phrases to look for"/></label><label>Validation hints<Textarea v-model="field.validation_hints" rows="2" placeholder="Rules the value should satisfy"/></label></div>
  <div class="grid"><label>Expected format<InputText v-model="field.expected_format" placeholder="For example, YYYY-MM-DD"/></label><label>Strategy<select v-model="field.strategy"><option value="standard">Standard</option><option value="deep">Deep analysis</option></select></label></div>
  <div class="row wrap"><label class="check"><input v-model="field.required" type="checkbox"/>Required</label><label class="check"><input v-model="field.evidence_required" type="checkbox"/>Evidence required</label></div>
 </article>
</template>
