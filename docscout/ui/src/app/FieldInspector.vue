<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
import {Icon} from '@iconify/vue'
import Toggle from './Toggle.vue'
import Segmented from './Segmented.vue'
import {fieldError,type Field} from '../config'
import ShapeEditor from './ShapeEditor.vue'
const props=defineProps<{field:Field;otherNames:string[];groups:string[];deepEnabled:boolean;mapEnabled:boolean;readonly?:boolean}>()
const emit=defineEmits<{remove:[]}>()
const error=computed(()=>fieldError(props.field,props.otherNames))
</script>
<template>
 <fieldset class="inspector-form" :disabled="readonly">
  <ShapeEditor :shape="field" :label="field.name||'field'" named :readonly="readonly"/>
  <p v-if="error" class="field-error" role="alert"><Icon icon="tabler:alert-circle"/>{{error}}</p>
  <h4>Finding it</h4>
  <label>Search hints<textarea v-model="field.search_hints" rows="2" placeholder="One query per line"/><small>Each line is an extra search for this field in Prefetch and Deep analysis.</small></label>
  <div class="grid">
   <label>Strategy<select v-model="field.strategy"><option value="standard">Standard</option><option value="deep">Deep analysis</option></select></label>
   <label>Chunks to read<input v-model.number="field.chunks" type="number" min="1" max="1000"/><small>Per search hint</small></label>
  </div>
  <p v-if="field.strategy==='deep'&&!deepEnabled" class="field-note"><Icon icon="tabler:info-circle"/>Deep analysis is off in the flow, so this field runs as standard.</p>
  <div class="label-block"><span id="within-label">Search within</span><Segmented v-model="field.search_within" labelled-by="within-label" :options="[{value:'document',label:'Whole document'},{value:'sections',label:'Map\'s sections'}]"/><small>{{field.search_within==='sections'?'Map picks the sections that should hold this value; search and reading stay inside them.':'Search covers the whole document.'}}</small></div>
  <p v-if="field.search_within==='sections'&&!mapEnabled" class="field-error"><Icon icon="tabler:alert-circle"/>Turn on Map the document to read sections.</p>
  <label>Group<input v-model.trim="field.group" list="docscout-groups" placeholder="parties.borrower" aria-label="Field group"/><datalist id="docscout-groups"><option v-for="g in groups" :key="g" :value="g"/></datalist><small>Use dotted snake_case names. Values nest under this path.</small></label>
  <h4>Checking it</h4>
  <label>Validation hints<textarea v-model="field.validation_hints" rows="2" placeholder="Rules the value must satisfy"/></label>
  <div class="toggle-row"><span>Evidence required<small>The value must cite a quote from the document.</small></span><Toggle v-model="field.evidence_required" label="Evidence required" :disabled="readonly"/></div>
  <button v-if="!readonly" type="button" class="kx-btn kx-btn-danger kx-focus-halo" @click="emit('remove')">Remove field</button>
 </fieldset>
</template>
