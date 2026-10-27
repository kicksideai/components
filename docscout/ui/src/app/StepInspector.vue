<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import ModelPicker from './ModelPicker.vue'
import Toggle from './Toggle.vue'
import {newQuery,stepPurpose,documentTools,toolLabel,type Config,type Step} from '../config'
const props=defineProps<{step:Step;config:Config;readonly?:boolean}>()
const scopes=[{value:'outline',label:'Outline'},{value:'section',label:'Section'},{value:'chunk',label:'Chunk'}]
const tools=documentTools()
function setTool(id:string,on:boolean){
 const list=props.config.tools.filter(t=>t!==id)
 props.config.tools=on?[...list,id]:list
}
</script>
<template>
 <fieldset class="inspector-form" :disabled="readonly">
  <p class="muted">{{stepPurpose[step.kind]}}</p>
  <div class="toggle-row" v-if="step.kind!=='extract'"><span>Step enabled</span><Toggle v-model="step.enabled" :label="`Enable step`" :disabled="readonly"/></div>
  <div class="label-block"><span id="scope-label">Reads at</span><div class="segmented" role="radiogroup" aria-labelledby="scope-label"><button v-for="s in scopes" :key="s.value" type="button" role="radio" :aria-checked="step.scope===s.value" @click="step.scope=s.value as Step['scope']">{{s.label}}</button></div><small>Layer of the document this step works on: outline, then section, then chunk.</small></div>
  <label v-if="step.model!==undefined" :id="`model-${step.kind}`">{{step.kind==='deep'?'Analysis model':'Model'}}<ModelPicker :value="step.model" capability="generate" :labelled-by="`model-${step.kind}`" @select="step.model=$event"/></label>

  <template v-if="step.kind==='map'">
   <label>Outline<select v-model="step.options.outline_mode"><option value="find_or_build">Use the table of contents, or build an outline</option><option value="build">Always build an outline</option></select></label>
  </template>

  <template v-if="step.kind==='prefetch'">
   <h4>Queries</h4>
   <div v-for="(q,i) in step.options.queries" :key="i" class="query-row">
    <div class="grid"><label>Name<input v-model="q.name" placeholder="Parties"/></label><label>Chunks<input v-model.number="q.chunks" type="number" min="1" max="1000"/></label></div>
    <label>Query<textarea v-model="q.query" rows="2" placeholder="Who signed the agreement and on whose behalf"/></label>
    <button v-if="!readonly" type="button" class="btn subtle" @click="step.options.queries.splice(i,1)">Remove query</button>
   </div>
   <p v-if="!step.options.queries.length" class="muted">No queries. Field search hints still run.</p>
   <button v-if="!readonly" type="button" class="btn" @click="step.options.queries.push(newQuery())">Add query</button>
  </template>

  <template v-if="step.kind==='scout'">
   <div class="grid"><label>Rounds<input v-model.number="step.options.max_iterations" type="number" min="0" max="30"/><small>0 runs a single pass.</small></label><label>Stop at confidence<input :value="Math.round(step.options.target_confidence*100)" type="number" min="0" max="100" @input="step.options.target_confidence=Number(($event.target as HTMLInputElement).value)/100"/><small>Percent</small></label></div>
   <div class="grid"><label>Extra queries per round<input v-model.number="step.options.max_extra_queries" type="number" min="0" max="20"/></label><label>Max tokens<input v-model.number="step.options.max_tokens" type="number" min="256" max="64000"/></label></div>
   <div class="toggle-row"><span>Drop noisy chunks</span><Toggle v-model="step.options.drop_noise" label="Drop noisy chunks" :disabled="readonly"/></div>
   <div class="toggle-row"><span>Share scout notes with extraction</span><Toggle v-model="config.shared_context" label="Share scout notes with extraction" :disabled="readonly"/></div>
   <h4>Agent tools</h4>
   <div v-for="id in tools" :key="id" class="toggle-row"><span>{{toolLabel(id)}}<small class="mono">{{id}}</small></span><Toggle :model-value="config.tools.includes(id)" :label="toolLabel(id)" :disabled="readonly" @update:model-value="setTool(id,$event)"/></div>
  </template>

  <template v-if="step.kind==='deep'">
   <label id="model-deep-query">Query model<ModelPicker :value="step.options.query_model" capability="generate" labelled-by="model-deep-query" @select="step.options.query_model=$event"/></label>
   <div class="grid"><label>Fields at a time<input v-model.number="step.options.parallel_fields" type="number" min="1" max="20"/></label><label>Queries per field<input v-model.number="step.options.max_queries" type="number" min="1" max="20"/></label></div>
   <div class="grid"><label>Chunks per query<input v-model.number="step.options.chunks_per_query" type="number" min="1" max="500"/></label><label>Chunk cap<input v-model.number="step.options.chunk_cap" type="number" min="1" max="1000"/></label></div>
   <div class="grid"><label>Minimum similarity<input v-model.number="step.options.min_similarity" type="number" min="0" max="1" step="0.05"/></label><label>Query temperature<input v-model.number="step.options.query_temperature" type="number" min="0" max="2" step="0.1"/></label></div>
   <label>Analysis temperature<input v-model.number="step.options.analysis_temperature" type="number" min="0" max="2" step="0.1"/></label>
  </template>

  <template v-if="step.kind==='extract'">
   <label>Max output tokens<input v-model.number="step.options.max_output_tokens" type="number" min="256" max="64000"/></label>
   <div class="toggle-row"><span>Structured output</span><Toggle v-model="step.options.structured_output" label="Structured output" :disabled="readonly"/></div>
  </template>

  <template v-if="step.kind==='verify'">
   <div class="toggle-row"><span>Check every value</span><Toggle v-model="step.options.require_all_values" label="Check every value" :disabled="readonly"/></div>
  </template>
 </fieldset>
</template>
