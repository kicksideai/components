<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import ModelPicker from './ModelPicker.vue'
import type {Config} from '../config'
defineProps<{config:Config}>()
const tools={keyword_search:'Keyword search',semantic_search:'Semantic search',read_section:'Read section',read_outline:'Read outline'} as const
</script>
<template>
 <section><h2>Chunks</h2><div class="grid"><label>Chunk size<input v-model.number="config.retrieval.chunk_size" type="number" min="100" max="16000"/><small>Tokens per chunk</small></label><label>Overlap<input v-model.number="config.retrieval.overlap" type="number" min="0" max="4000"/><small>Tokens shared with the next chunk</small></label></div><label class="check"><input v-model="config.retrieval.split_headings" type="checkbox"/>Split by headings</label></section>
 <section><h2>Search</h2><div class="grid"><label>Search mode<select v-model="config.retrieval.search_mode"><option value="keyword">Keyword</option><option value="semantic">Semantic</option><option value="hybrid">Hybrid</option></select></label><label>Results per query<input v-model.number="config.retrieval.top_results" type="number" min="1" max="100"/></label></div><label class="check"><input v-model="config.retrieval.contextual_embeddings" type="checkbox"/>Prepend section context before embedding</label><label id="embedding-model">Embedding model<ModelPicker :value="config.retrieval.embedding_model" capability="embed" labelled-by="embedding-model" @select="config.retrieval.embedding_model=$event"/></label></section>
 <section><h2>Highlighter</h2><label class="check"><input v-model="config.retrieval.highlighter" type="checkbox"/>Mark relevant spans before extraction</label><label v-if="config.retrieval.highlighter" id="highlighter-model">Model<ModelPicker :value="config.retrieval.highlighter_model" capability="generate" labelled-by="highlighter-model" @select="config.retrieval.highlighter_model=$event"/></label></section>
 <section><h2>Internal agent tools</h2><div class="grid"><label v-for="(label,key) in tools" :key="key" class="check"><input v-model="config.tools[key]" type="checkbox"/>{{label}}</label></div></section>
</template>
