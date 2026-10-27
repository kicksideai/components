<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
import ModelPicker from './ModelPicker.vue'
import Toggle from './Toggle.vue'
import Slider from './Slider.vue'
import ScoutDiagram from './ScoutDiagram.vue'
import DeepDiagram from './DeepDiagram.vue'
import {newQuery,optionBounds,stepPurpose,documentTools,toolLabel,type Config,type Step} from '../config'
const props=defineProps<{step:Step;config:Config;readonly?:boolean}>()
const scopes=[{value:'outline',label:'Outline'},{value:'section',label:'Section'},{value:'chunk',label:'Chunk'}]
const tools=documentTools()
const b=(key:string)=>optionBounds(props.step.kind,key)
const deepCount=computed(()=>props.config.fields.filter(f=>f.strategy==='deep').length)
function setTool(id:string,on:boolean){
 const list=props.config.tools.filter(t=>t!==id)
 props.config.tools=on?[...list,id]:list
}
</script>
<template>
 <fieldset class="inspector-form" :disabled="readonly">
  <p class="muted">{{stepPurpose[step.kind]}}</p>
  <div v-if="step.kind!=='extract'" class="toggle-row"><span>Step enabled</span><Toggle v-model="step.enabled" label="Enable step" :disabled="readonly"/></div>

  <ScoutDiagram v-if="step.kind==='scout'" :rounds="step.options.max_iterations" :confidence="step.options.target_confidence" :extra="step.options.max_extra_queries"/>
  <DeepDiagram v-if="step.kind==='deep'" :fields="deepCount" :parallel="step.options.parallel_fields" :queries="step.options.max_queries" :per-query="step.options.chunks_per_query" :cap="step.options.chunk_cap"/>

  <div class="label-block"><span id="scope-label">Reads at</span><div class="segmented" role="radiogroup" aria-labelledby="scope-label"><button v-for="s in scopes" :key="s.value" type="button" role="radio" :aria-checked="step.scope===s.value" @click="step.scope=s.value as Step['scope']">{{s.label}}</button></div><small>Outline sees headings only, section reads whole sections, chunk reads retrieved passages.</small></div>

  <template v-if="step.model!==undefined">
   <h4>Models</h4>
   <div class="model-role" :id="`model-${step.kind}`"><span>{{step.kind==='deep'?'Analysis':step.kind==='scout'?'Scout':step.kind==='verify'?'Checker':step.kind==='map'?'Outliner':'Extraction'}}</span><ModelPicker :value="step.model" capability="generate" :labelled-by="`model-${step.kind}`" @select="step.model=$event"/></div>
   <div v-if="step.kind==='deep'" class="model-role" id="model-deep-query"><span>Query writer</span><ModelPicker :value="step.options.query_model" capability="generate" labelled-by="model-deep-query" @select="step.options.query_model=$event"/></div>
  </template>

  <template v-if="step.kind==='map'">
   <div class="label-block"><span id="outline-label">Outline</span><div class="segmented" role="radiogroup" aria-labelledby="outline-label"><button type="button" role="radio" :aria-checked="step.options.outline_mode==='find_or_build'" @click="step.options.outline_mode='find_or_build'">Use contents first</button><button type="button" role="radio" :aria-checked="step.options.outline_mode==='build'" @click="step.options.outline_mode='build'">Always build</button></div><small>Using the document's own table of contents is faster when it has one.</small></div>
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
   <h4>Loop</h4>
   <Slider v-model="step.options.max_iterations" label="Follow-up rounds" :min="b('max_iterations').min" :max="b('max_iterations').max" :hints="['Single pass','Thorough']" :disabled="readonly"/>
   <Slider v-model="step.options.target_confidence" label="Stop at confidence" :min="b('target_confidence').min" :max="b('target_confidence').max" :step="0.05" percent :hints="['Stop early','Keep looking']" :disabled="readonly"/>
   <Slider v-model="step.options.max_extra_queries" label="New queries per round" :min="b('max_extra_queries').min" :max="b('max_extra_queries').max" :disabled="readonly"/>
   <Slider v-model="step.options.max_tokens" label="Scout output limit" :min="b('max_tokens').min" :max="b('max_tokens').max" log :step="64" unit="tokens" :disabled="readonly"/>
   <div class="toggle-row"><span>Drop noisy chunks<small>Chunks the scout judges irrelevant leave the evidence set.</small></span><Toggle v-model="step.options.drop_noise" label="Drop noisy chunks" :disabled="readonly"/></div>
   <div class="toggle-row"><span>Share scout notes with extraction<small>Extraction sees what the scout learned.</small></span><Toggle v-model="config.shared_context" label="Share scout notes with extraction" :disabled="readonly"/></div>
   <h4>Agent tools</h4>
   <div v-for="id in tools" :key="id" class="toggle-row"><span>{{toolLabel(id)}}<small class="mono">{{id}}</small></span><Toggle :model-value="config.tools.includes(id)" :label="toolLabel(id)" :disabled="readonly" @update:model-value="setTool(id,$event)"/></div>
  </template>

  <template v-if="step.kind==='deep'">
   <h4>Reach</h4>
   <Slider v-model="step.options.parallel_fields" label="Fields at a time" :min="b('parallel_fields').min" :max="b('parallel_fields').max" :disabled="readonly"/>
   <Slider v-model="step.options.max_queries" label="Queries per field" :min="b('max_queries').min" :max="b('max_queries').max" log :disabled="readonly"/>
   <Slider v-model="step.options.chunks_per_query" label="Chunks per query" :min="b('chunks_per_query').min" :max="b('chunks_per_query').max" log :disabled="readonly"/>
   <Slider v-model="step.options.chunk_cap" label="Chunk cap per field" :min="b('chunk_cap').min" :max="b('chunk_cap').max" log :disabled="readonly"/>
   <Slider v-model="step.options.min_similarity" label="Minimum similarity" :min="b('min_similarity').min" :max="b('min_similarity').max" :step="0.05" percent :hints="['Loose','Strict']" note="Chunks less similar than this are skipped." :disabled="readonly"/>
   <h4>Temperature</h4>
   <Slider v-model="step.options.query_temperature" label="Query writing" :min="b('query_temperature').min" :max="b('query_temperature').max" :step="0.1" :hints="['Precise','Varied']" :disabled="readonly"/>
   <Slider v-model="step.options.analysis_temperature" label="Analysis" :min="b('analysis_temperature').min" :max="b('analysis_temperature').max" :step="0.1" :hints="['Precise','Varied']" :disabled="readonly"/>
  </template>

  <template v-if="step.kind==='extract'">
   <Slider v-model="step.options.max_output_tokens" label="Output limit" :min="b('max_output_tokens').min" :max="b('max_output_tokens').max" log :step="64" unit="tokens" :disabled="readonly"/>
   <div class="toggle-row"><span>Structured output<small>The model returns JSON matching the field schema.</small></span><Toggle v-model="step.options.structured_output" label="Structured output" :disabled="readonly"/></div>
  </template>

  <template v-if="step.kind==='verify'">
   <div class="toggle-row"><span>Check every value<small>Off checks only values that carry evidence.</small></span><Toggle v-model="step.options.require_all_values" label="Check every value" :disabled="readonly"/></div>
  </template>
 </fieldset>
</template>
