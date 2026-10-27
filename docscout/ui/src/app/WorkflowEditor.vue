<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import ModelPicker from './ModelPicker.vue'
import {moveStep,stepLabels,type Config} from '../config'
defineProps<{config:Config}>()
const scopes=['outline','section','chunk']
function queries(event:Event){return (event.target as HTMLTextAreaElement).value.split('\n').map(s=>s.trim()).filter(Boolean)}
</script>
<template>
 <div class="section-head"><div><h2>Reading workflow</h2><p class="muted">Steps run in this order. Map the document stays first.</p></div></div>
 <article v-for="(step,i) in config.workflow" :key="step.kind" class="step-card" :class="{inactive:!step.enabled}">
  <header class="row"><span class="ordinal">{{i+1}}</span><h3>{{stepLabels[step.kind]}}</h3><label class="check push"><input v-model="step.enabled" type="checkbox" :aria-label="`Enable ${stepLabels[step.kind]}`"/>Enabled</label></header>
  <div class="step-body" v-if="step.enabled">
   <div class="grid"><label>Scope<select v-model="step.scope"><option v-for="scope in scopes" :key="scope">{{scope}}</option></select></label><label v-if="step.model!==undefined" :id="`model-${step.kind}`">Model<ModelPicker :value="step.model" capability="generate" :labelled-by="`model-${step.kind}`" @select="step.model=$event"/></label></div>
   <label v-if="step.kind==='map'">Outline<select v-model="step.options.outline_mode"><option value="find_or_build">Use a table of contents or build an outline</option><option value="build">Build an outline</option></select></label>
   <label v-if="step.kind==='prefetch'">Queries<Textarea :value="(step.options.queries as string[]).join('\n')" rows="3" placeholder="One query per line" @input="step.options.queries=queries($event)"/></label>
   <div v-if="step.kind==='scout'" class="grid three"><label>Maximum iterations<input v-model.number="step.options.max_iterations" type="number" min="1" max="30"/></label><label>Target confidence<input v-model.number="step.options.target_confidence" type="number" min="0" max="1" step="0.05"/></label><label>Extra queries per iteration<input v-model.number="step.options.max_extra_queries" type="number" min="0" max="20"/></label><label class="check"><input v-model="step.options.drop_noise" type="checkbox"/>Drop noise</label></div>
   <label v-if="step.kind==='deep'">Parallel fields<input v-model.number="step.options.parallel_fields" type="number" min="1" max="20"/></label>
   <label v-if="step.kind==='extract'">Maximum output tokens<input v-model.number="step.options.max_output_tokens" type="number" min="256" max="64000"/></label>
   <label v-if="step.kind==='verify'" class="check"><input v-model="step.options.require_all_values" type="checkbox"/>Check every value against its evidence</label>
  </div>
  <footer v-if="i>0" class="row"><Button label="Move up" size="small" severity="secondary" text :disabled="i===1" @click="moveStep(config,i,-1)"/><Button label="Move down" size="small" severity="secondary" text :disabled="i===config.workflow.length-1" @click="moveStep(config,i,1)"/></footer>
 </article>
</template>
