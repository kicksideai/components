<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
import ModelPicker from './ModelPicker.vue'
import Toggle from './Toggle.vue'
import Slider from './Slider.vue'
import ScoutDiagram from './ScoutDiagram.vue'
import DeepDiagram from './DeepDiagram.vue'
import {documentTools,extractCalls,fieldGroups,newQuery,stageBounds,stagePurpose,toolLabel,type Config,type StageKey} from '../config'
const props=defineProps<{stage:StageKey;config:Config;readonly?:boolean}>()
const s=computed(()=>props.config.stages)
const b=(key:string)=>stageBounds(props.stage,key)
const tools=documentTools()
const deepCount=computed(()=>props.config.fields.filter(f=>f.strategy==='deep').length)
const sectionFields=computed(()=>props.config.fields.filter(f=>f.search_within==='sections').map(f=>f.name||'New field'))
const groups=computed(()=>fieldGroups(props.config))
function setTool(id:string,on:boolean){
 const list=s.value.scout.tools.filter(t=>t!==id)
 s.value.scout.tools=on?[...list,id]:list
}
</script>
<template>
 <fieldset class="inspector-form" :disabled="readonly">
  <p class="muted">{{stagePurpose[stage]}}</p>

  <template v-if="stage==='map'">
   <div class="toggle-row"><span>Stage enabled</span><Toggle v-model="s.map.enabled" label="Enable step" :disabled="readonly"/></div>
   <div class="label-block"><span id="outline-label">Outline</span><div class="segmented" role="radiogroup" aria-labelledby="outline-label"><button type="button" role="radio" :aria-checked="s.map.outline==='find_or_build'" @click="s.map.outline='find_or_build'">Use contents first</button><button type="button" role="radio" :aria-checked="s.map.outline==='build'" @click="s.map.outline='build'">Always build</button></div><small>The document's own headings are used when it has them; otherwise the model builds an outline.</small></div>
   <div class="toggle-row"><span>Section summaries<small>A short summary per section helps pick the right sections in long documents.</small></span><Toggle v-model="s.map.section_summaries" label="Section summaries" :disabled="readonly"/></div>
   <h4>Models</h4>
   <div id="model-map" class="model-role"><span>Outliner</span><ModelPicker :value="s.map.model" capability="generate" labelled-by="model-map" @select="s.map.model=$event"/></div>
   <h4>Fields that read sections</h4>
   <p v-if="sectionFields.length" class="chips"><span v-for="n in sectionFields" :key="n" class="chip primary">{{n}}</span></p>
   <p v-else class="muted">None. Set "Search within" on a field to read only the sections Map picks for it.</p>
  </template>

  <template v-if="stage==='prefetch'">
   <div class="toggle-row"><span>Stage enabled</span><Toggle v-model="s.prefetch.enabled" label="Enable step" :disabled="readonly"/></div>
   <h4>Queries</h4>
   <div v-for="(q,i) in s.prefetch.queries" :key="i" class="query-row">
    <div class="grid"><label>Name<input v-model="q.name" placeholder="Parties"/></label><label>Chunks<input v-model.number="q.chunks" type="number" min="1" max="1000"/></label></div>
    <label>Query<textarea v-model="q.query" rows="2" placeholder="Who signed the agreement and on whose behalf"/></label>
    <button v-if="!readonly" type="button" class="btn subtle" @click="s.prefetch.queries.splice(i,1)">Remove query</button>
   </div>
   <p v-if="!s.prefetch.queries.length" class="muted">No fixed queries. Field search hints still run.</p>
   <button v-if="!readonly" type="button" class="btn" @click="s.prefetch.queries.push(newQuery())">Add query</button>
  </template>

  <template v-if="stage==='scout'">
   <div class="toggle-row"><span>Stage enabled</span><Toggle v-model="s.scout.enabled" label="Enable step" :disabled="readonly"/></div>
   <div class="label-block"><span id="mode-label">Mode</span><div class="segmented" role="radiogroup" aria-labelledby="mode-label"><button type="button" role="radio" :aria-checked="s.scout.mode==='loop'" @click="s.scout.mode='loop'">Structured loop</button><button type="button" role="radio" :aria-checked="s.scout.mode==='agent'" @click="s.scout.mode='agent'">Agent</button></div><small>{{s.scout.mode==='loop'?'Each round the model rates the evidence, drops noise and proposes queries; the engine runs them.':'The model reads the document itself with the tools below, following references until confident.'}}</small></div>
   <ScoutDiagram :rounds="s.scout.max_rounds" :confidence="s.scout.target_confidence" :extra="s.scout.max_extra_queries"/>
   <h4>Models</h4>
   <div id="model-scout" class="model-role"><span>Scout</span><ModelPicker :value="s.scout.model" capability="generate" labelled-by="model-scout" @select="s.scout.model=$event"/></div>
   <h4>Loop</h4>
   <Slider v-model="s.scout.max_rounds" label="Follow-up rounds" :min="b('max_rounds').min" :max="b('max_rounds').max" :hints="['Single pass','Thorough']" :disabled="readonly"/>
   <Slider v-model="s.scout.target_confidence" label="Stop at confidence" :min="b('target_confidence').min" :max="b('target_confidence').max" :step="0.05" percent :hints="['Stop early','Keep looking']" :disabled="readonly"/>
   <Slider v-model="s.scout.max_extra_queries" :label="s.scout.mode==='agent'?'Tool calls per round':'New queries per round'" :min="b('max_extra_queries').min" :max="b('max_extra_queries').max" :disabled="readonly"/>
   <Slider v-model="s.scout.max_tokens" label="Scout output limit" :min="b('max_tokens').min" :max="b('max_tokens').max" log :step="64" unit="tokens" :disabled="readonly"/>
   <div class="toggle-row"><span>Drop noisy chunks<small>Chunks the scout judges irrelevant leave the evidence pool.</small></span><Toggle v-model="s.scout.drop_noise" label="Drop noisy chunks" :disabled="readonly"/></div>
   <div class="toggle-row"><span>Share scout notes with extraction<small>Extraction sees what the scout learned.</small></span><Toggle v-model="s.scout.share_notes" label="Share scout notes with extraction" :disabled="readonly"/></div>
   <template v-if="s.scout.mode==='agent'">
    <h4>Agent tools</h4>
    <div v-for="id in tools" :key="id" class="toggle-row"><span>{{toolLabel(id)}}<small class="mono">{{id}}</small></span><Toggle :model-value="s.scout.tools.includes(id)" :label="toolLabel(id)" :disabled="readonly" @update:model-value="setTool(id,$event)"/></div>
   </template>
  </template>

  <template v-if="stage==='deep'">
   <div class="toggle-row"><span>Stage enabled</span><Toggle v-model="s.deep.enabled" label="Enable step" :disabled="readonly"/></div>
   <DeepDiagram :fields="deepCount" :parallel="s.deep.parallel_fields" :queries="s.deep.max_queries" :per-query="s.deep.chunks_per_query" :cap="s.deep.chunk_cap"/>
   <div class="label-block"><span id="read-label">Reads</span><div class="segmented" role="radiogroup" aria-labelledby="read-label"><button type="button" role="radio" :aria-checked="s.deep.read==='chunks'" @click="s.deep.read='chunks'">Retrieved chunks</button><button type="button" role="radio" :aria-checked="s.deep.read==='sections'" @click="s.deep.read='sections'">Whole sections</button></div><small>Whole sections suit clauses that span many passages; long sections fall back to chunks.</small></div>
   <h4>Models</h4>
   <div id="model-deep" class="model-role"><span>Analysis</span><ModelPicker :value="s.deep.model" capability="generate" labelled-by="model-deep" @select="s.deep.model=$event"/></div>
   <div id="model-deep-query" class="model-role"><span>Query writer</span><ModelPicker :value="s.deep.query_model" capability="generate" labelled-by="model-deep-query" @select="s.deep.query_model=$event"/></div>
   <h4>Reach</h4>
   <Slider v-model="s.deep.parallel_fields" label="Fields at a time" :min="b('parallel_fields').min" :max="b('parallel_fields').max" :disabled="readonly"/>
   <Slider v-model="s.deep.max_queries" label="Queries per field" :min="b('max_queries').min" :max="b('max_queries').max" log :disabled="readonly"/>
   <Slider v-model="s.deep.chunks_per_query" label="Chunks per query" :min="b('chunks_per_query').min" :max="b('chunks_per_query').max" log :disabled="readonly"/>
   <Slider v-model="s.deep.chunk_cap" label="Chunk cap per field" :min="b('chunk_cap').min" :max="b('chunk_cap').max" log :disabled="readonly"/>
   <Slider v-model="s.deep.min_similarity" label="Minimum similarity" :min="b('min_similarity').min" :max="b('min_similarity').max" :step="0.05" percent :hints="['Loose','Strict']" note="Chunks less similar than this are skipped." :disabled="readonly"/>
   <h4>Temperature</h4>
   <Slider v-model="s.deep.query_temperature" label="Query writing" :min="b('query_temperature').min" :max="b('query_temperature').max" :step="0.1" :hints="['Precise','Varied']" :disabled="readonly"/>
   <Slider v-model="s.deep.analysis_temperature" label="Analysis" :min="b('analysis_temperature').min" :max="b('analysis_temperature').max" :step="0.1" :hints="['Precise','Varied']" :disabled="readonly"/>
  </template>

  <template v-if="stage==='extract'">
   <h4>Models</h4>
   <div id="model-extract" class="model-role"><span>Extraction</span><ModelPicker :value="s.extract.model" capability="generate" labelled-by="model-extract" @select="s.extract.model=$event"/></div>
   <h4>Field groups</h4>
   <ul class="output-list"><li v-for="g in groups" :key="g.name"><span>{{g.name}}</span><span class="chip">{{g.fields.length}} field{{g.fields.length===1?'':'s'}}</span></li></ul>
   <p v-if="!groups.length" class="muted">No fields yet.</p>
   <Slider v-model="s.extract.max_fields_per_call" label="Fields per call" :min="b('max_fields_per_call').min" :max="b('max_fields_per_call').max" :disabled="readonly" :note="`${extractCalls(config)} extraction call${extractCalls(config)===1?'':'s'} per document. Groups larger than this are split.`"/>
   <Slider v-model="s.extract.max_output_tokens" label="Output limit" :min="b('max_output_tokens').min" :max="b('max_output_tokens').max" log :step="64" unit="tokens" :disabled="readonly"/>
   <div class="toggle-row"><span>Structured output<small>The model returns JSON matching the field schema.</small></span><Toggle v-model="s.extract.structured_output" label="Structured output" :disabled="readonly"/></div>
  </template>

  <template v-if="stage==='verify'">
   <div class="toggle-row"><span>Stage enabled</span><Toggle v-model="s.verify.enabled" label="Enable step" :disabled="readonly"/></div>
   <div class="toggle-row"><span>Quotes exist<small>Each quote is matched against the document text. No model call.</small></span><Toggle v-model="s.verify.check_quotes" label="Quotes exist" :disabled="readonly"/></div>
   <div class="toggle-row"><span>Quotes support values<small>A model confirms each quote supports its value.</small></span><Toggle v-model="s.verify.check_support" label="Quotes support values" :disabled="readonly"/></div>
   <template v-if="s.verify.check_support">
    <h4>Models</h4>
    <div id="model-verify" class="model-role"><span>Checker</span><ModelPicker :value="s.verify.model" capability="generate" labelled-by="model-verify" @select="s.verify.model=$event"/></div>
   </template>
  </template>
 </fieldset>
</template>
