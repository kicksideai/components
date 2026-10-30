<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
import ModelPicker from './ModelPicker.vue'
import Toggle from './Toggle.vue'
import Segmented from './Segmented.vue'
import Slider from './Slider.vue'
import ChunkDiagram from './ChunkDiagram.vue'
import {retrievalBounds,type Config} from '../config'
const props=defineProps<{config:Config;retention:string;readonly?:boolean}>()
const r=computed(()=>props.config.retrieval)
const modes=[{value:'keyword',label:'Keyword',note:'Exact words and numbers'},{value:'semantic',label:'Semantic',note:'Meaning, even with other wording'},{value:'hybrid',label:'Hybrid',note:'Both, merged by rank'}] as const
const contexts=[{value:'none',label:'None',note:'Chunks are embedded as they are.'},{value:'headings',label:'Headings',note:'Each chunk is embedded with its heading path, for example "Article 2 › Purchase price". No model call.'},{value:'generated',label:'Generated',note:'A model writes one or two sentences placing each chunk in the document before it is embedded. One call per eight chunks, kept with the processed document.'}] as const
const size=retrievalBounds('chunk_size'),overlap=retrievalBounds('overlap'),budget=retrievalBounds('section_budget')
const overlapMax=computed(()=>Math.min(overlap.max,r.value.chunk_size-50))
</script>
<template>
 <fieldset class="inspector-form" :disabled="readonly">
  <p class="muted">The upload's text is split into chunks and indexed once per document and settings; processed copies expire after {{retention}}.</p>
  <h4>Chunks</h4>
  <ChunkDiagram :size="r.chunk_size" :overlap="r.overlap"/>
  <Slider v-model="r.chunk_size" label="Chunk size" :min="size.min" :max="size.max" :step="50" log unit="tokens" :hints="['Precise','More context']" :disabled="readonly"/>
  <Slider v-model="r.overlap" label="Overlap" :min="overlap.min" :max="overlapMax" :step="10" unit="tokens" :disabled="readonly"/>
  <div class="toggle-row"><span>Split by headings<small>A chunk never crosses a heading.</small></span><Toggle v-model="r.split_headings" label="Split by headings" :disabled="readonly"/></div>
  <div class="toggle-row"><span>Keep tables whole<small>Table rows stay together in one chunk up to the chunk size.</small></span><Toggle v-model="r.keep_tables" label="Keep tables whole" :disabled="readonly"/></div>
  <Slider v-model="r.section_budget" label="Section budget" :min="budget.min" :max="budget.max" :step="100" log unit="tokens" note="Sections longer than this are read as chunks instead." :disabled="readonly"/>
  <h4>Context</h4>
  <div class="label-block"><span id="context-label">Chunk context</span><Segmented v-model="r.context" labelled-by="context-label" :options="contexts"/><small>{{contexts.find(c=>c.value===r.context)?.note}}</small></div>
  <div v-if="r.context==='generated'" id="context-model" class="model-role"><span>Context writer</span><ModelPicker :value="r.context_model" capability="generate" labelled-by="context-model" @select="r.context_model=$event"/></div>
  <h4>Search</h4>
  <div class="label-block"><span id="mode-label">Search mode</span><Segmented v-model="r.search_mode" labelled-by="mode-label" :options="modes"/><small>{{modes.find(m=>m.value===r.search_mode)?.note}}</small></div>
  <h4>Models</h4>
  <div id="embedding-model" class="model-role"><span>Embedding</span><ModelPicker :value="r.embedding_model" capability="embed" labelled-by="embedding-model" @select="r.embedding_model=$event"/></div>
  <div class="toggle-row"><span>Highlighter<small>A small model marks what each field needs before extraction.</small></span><Toggle v-model="r.highlighter" label="Highlighter" :disabled="readonly"/></div>
  <div v-if="r.highlighter" id="highlighter-model" class="model-role"><span>Highlighter</span><ModelPicker :value="r.highlighter_model" capability="generate" labelled-by="highlighter-model" @select="r.highlighter_model=$event"/></div>
 </fieldset>
</template>
