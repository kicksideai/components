<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {computed} from 'vue'
const props=defineProps<{fields:number;parallel:number;queries:number;perQuery:number;cap:number}>()
const read=computed(()=>Math.min(props.queries*props.perQuery,props.cap))
</script>
<template>
 <figure class="diagram flow-diagram" aria-hidden="true">
  <div class="fd-grid">
   <span class="fd-node solid"><b>{{fields}}</b> field{{fields===1?'':'s'}}<small>{{parallel}} at a time</small></span>
   <span class="fd-node"><b>{{queries}}</b> queries<small>per field</small></span>
   <span class="fd-node"><b>{{perQuery}}</b> chunks<small>per query</small></span>
   <span class="fd-node goal"><b>{{read}}</b> chunks<small>{{queries*perQuery>cap?`capped at ${cap}`:'read per field'}}</small></span>
  </div>
  <figcaption>Each deep field gets its own queries; up to {{read}} chunks are read for it before analysis.</figcaption>
 </figure>
</template>
