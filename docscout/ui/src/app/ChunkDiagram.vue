<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
const props=defineProps<{size:number;overlap:number}>()
const ratio=computed(()=>Math.min(.9,Math.max(0,props.overlap/props.size)))
const chunks=computed(()=>{const w=100/(3-2*ratio.value);return [0,1,2].map(i=>({x:i*w*(1-ratio.value),w}))})
</script>
<template>
 <figure class="diagram chunk-diagram" aria-hidden="true">
  <svg viewBox="0 0 100 34" preserveAspectRatio="none">
   <rect v-for="(c,i) in chunks" :key="i" :x="c.x" :y="i%2?14:4" :width="c.w" height="14" rx="2" class="chunk"/>
   <rect v-for="i in [1,2]" :key="'o'+i" :x="chunks[i].x" :y="4" :width="chunks[i-1].x+chunks[i-1].w-chunks[i].x" height="24" class="shared"/>
  </svg>
  <figcaption>{{size.toLocaleString()}} tokens per chunk · {{overlap.toLocaleString()}} shared with the next ({{Math.round(ratio*100)}}%)</figcaption>
 </figure>
</template>
