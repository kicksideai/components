<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
const props=defineProps<{rounds:number;confidence:number;extra:number}>()
</script>
<template>
 <figure class="diagram flow-diagram" aria-hidden="true">
  <div class="fd-track">
   <span class="fd-node solid">Pass</span>
   <template v-for="r in Math.min(props.rounds,8)" :key="r"><span class="fd-link"/><span class="fd-node"><span>R{{r}}</span><span class="fd-dots"><i v-for="q in Math.min(props.extra,6)" :key="q"/></span></span></template>
   <template v-if="props.rounds>8"><span class="fd-link"/><span class="fd-more">+{{props.rounds-8}}</span></template>
   <span class="fd-link"/><span class="fd-node goal">≥ {{Math.round(props.confidence*100)}}%</span>
  </div>
  <figcaption>{{props.rounds?`One pass, then up to ${props.rounds} rounds with up to ${props.extra} new queries each, stopping as soon as confidence reaches ${Math.round(props.confidence*100)}%.`:'One pass only; no follow-up rounds.'}}</figcaption>
 </figure>
</template>
