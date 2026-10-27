<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
import ModelPicker from './ModelPicker.vue'
import Toggle from './Toggle.vue'
import Slider from './Slider.vue'
import ChunkDiagram from './ChunkDiagram.vue'
import {retrievalBounds,type Config} from '../config'
const props=defineProps<{config:Config;retention:string;readonly?:boolean}>()
const modes=[{value:'keyword',label:'Keyword',note:'Exact words and numbers'},{value:'semantic',label:'Semantic',note:'Meaning, even with other wording'},{value:'hybrid',label:'Hybrid',note:'Both, merged by rank'}] as const
const size=retrievalBounds('chunk_size'),overlap=retrievalBounds('overlap'),top=retrievalBounds('top_results')
const overlapMax=computed(()=>Math.min(overlap.max,props.config.retrieval.chunk_size-50))
const modeNote=computed(()=>modes.find(m=>m.value===props.config.retrieval.search_mode)?.note)
</script>
<template>
 <fieldset class="inspector-form" :disabled="readonly">
  <p class="muted">The upload's text is split into chunks and indexed for this run. Processed copies expire after {{retention}}.</p>
  <h4>Chunks</h4>
  <ChunkDiagram :size="config.retrieval.chunk_size" :overlap="config.retrieval.overlap"/>
  <Slider v-model="config.retrieval.chunk_size" label="Chunk size" :min="size.min" :max="size.max" :step="50" log unit="tokens" :hints="['Precise','More context']" :disabled="readonly"/>
  <Slider v-model="config.retrieval.overlap" label="Overlap" :min="overlap.min" :max="overlapMax" :step="10" unit="tokens" :disabled="readonly"/>
  <div class="toggle-row"><span>Split by headings<small>A chunk never crosses a heading.</small></span><Toggle v-model="config.retrieval.split_headings" label="Split by headings" :disabled="readonly"/></div>
  <h4>Search</h4>
  <div class="label-block"><span id="mode-label">Search mode</span><div class="segmented" role="radiogroup" aria-labelledby="mode-label"><button v-for="m in modes" :key="m.value" type="button" role="radio" :aria-checked="config.retrieval.search_mode===m.value" @click="config.retrieval.search_mode=m.value">{{m.label}}</button></div><small>{{modeNote}}</small></div>
  <Slider v-model="config.retrieval.top_results" label="Results per query" :min="top.min" :max="top.max" :disabled="readonly"/>
  <div class="toggle-row"><span>Contextual embeddings<small>Prepend section context to each chunk before embedding.</small></span><Toggle v-model="config.retrieval.contextual_embeddings" label="Contextual embeddings" :disabled="readonly"/></div>
  <h4>Models</h4>
  <div class="model-role" id="embedding-model"><span>Embedding</span><ModelPicker :value="config.retrieval.embedding_model" capability="embed" labelled-by="embedding-model" @select="config.retrieval.embedding_model=$event"/></div>
  <div class="toggle-row"><span>Highlighter<small>A small model marks what each field needs before extraction.</small></span><Toggle v-model="config.retrieval.highlighter" label="Highlighter" :disabled="readonly"/></div>
  <div v-if="config.retrieval.highlighter" class="model-role" id="highlighter-model"><span>Highlighter</span><ModelPicker :value="config.retrieval.highlighter_model" capability="generate" labelled-by="highlighter-model" @select="config.retrieval.highlighter_model=$event"/></div>
 </fieldset>
</template>
