<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import ModelPicker from './ModelPicker.vue'
import Toggle from './Toggle.vue'
import type {Config} from '../config'
defineProps<{config:Config;retention:string;readonly?:boolean}>()
const modes=[{value:'keyword',label:'Keyword'},{value:'semantic',label:'Semantic'},{value:'hybrid',label:'Hybrid'}] as const
</script>
<template>
 <fieldset class="inspector-form" :disabled="readonly">
  <p class="muted">The upload's text is split into chunks and indexed for this run. Processed copies expire after {{retention}}.</p>
  <h4>Chunks</h4>
  <div class="grid"><label>Chunk size<input v-model.number="config.retrieval.chunk_size" type="number" min="100" max="16000"/><small>Tokens</small></label><label>Overlap<input v-model.number="config.retrieval.overlap" type="number" min="0" max="4000"/><small>Tokens</small></label></div>
  <div class="toggle-row"><span>Split by headings</span><Toggle v-model="config.retrieval.split_headings" label="Split by headings" :disabled="readonly"/></div>
  <h4>Search</h4>
  <div class="label-block"><span id="mode-label">Search mode</span><div class="segmented" role="radiogroup" aria-labelledby="mode-label"><button v-for="m in modes" :key="m.value" type="button" role="radio" :aria-checked="config.retrieval.search_mode===m.value" @click="config.retrieval.search_mode=m.value">{{m.label}}</button></div></div>
  <label>Results per query<input v-model.number="config.retrieval.top_results" type="number" min="1" max="100"/></label>
  <label id="embedding-model">Embedding model<ModelPicker :value="config.retrieval.embedding_model" capability="embed" labelled-by="embedding-model" @select="config.retrieval.embedding_model=$event"/></label>
  <div class="toggle-row"><span>Contextual embeddings<small>Prepend section context to each chunk before embedding.</small></span><Toggle v-model="config.retrieval.contextual_embeddings" label="Contextual embeddings" :disabled="readonly"/></div>
  <h4>Highlighter</h4>
  <div class="toggle-row"><span>Mark relevant spans<small>A small model highlights what each field needs before extraction.</small></span><Toggle v-model="config.retrieval.highlighter" label="Highlighter" :disabled="readonly"/></div>
  <label v-if="config.retrieval.highlighter" id="highlighter-model">Highlighter model<ModelPicker :value="config.retrieval.highlighter_model" capability="generate" labelled-by="highlighter-model" @select="config.retrieval.highlighter_model=$event"/></label>
 </fieldset>
</template>
