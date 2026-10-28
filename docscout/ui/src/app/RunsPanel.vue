<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import {Icon} from '@iconify/vue'
import type {Run} from '../models'
import {when} from '../format'
defineProps<{runs:Run[];retention:string}>()
const callers:Record<Run['caller'],{label:string;icon:string}>={ui:{label:'Test tab',icon:'tabler:player-play'},agent:{label:'Agent',icon:'tabler:robot'},eval:{label:'Evaluation',icon:'tabler:chart-bar'},workflow:{label:'Workflow',icon:'tabler:route'}}
</script>
<template>
 <div class="section-head"><h2>Recent runs</h2><span class="muted">Runs expire after {{retention}}</span></div>
 <p v-if="!runs.length" class="empty">No runs yet. Runs from the Test tab, agents, evaluations and Workflows appear here.</p>
 <div v-else class="table-scroll">
  <table class="metric-table runs-table">
   <thead><tr><th>Started</th><th>From</th><th>Status</th><th class="num">Time</th><th class="num">Tokens</th><th>Expires</th></tr></thead>
   <tbody><tr v-for="run in runs" :key="run.id">
    <td>{{when(run.created_at)}}</td>
    <td><span class="caller"><Icon :icon="callers[run.caller].icon"/>{{callers[run.caller].label}}</span></td>
    <td><span class="badge" :data-status="run.status">{{run.status==='completed'?'Completed':'Failed'}}</span></td>
    <td class="num" data-label="Time">{{(run.duration_ms/1000).toFixed(1)}}s</td>
    <td class="num" data-label="Tokens">{{Number(run.tokens).toLocaleString()}}</td>
    <td class="muted" data-label="Expires">{{when(run.expires_at)}}</td>
   </tr></tbody>
  </table>
 </div>
</template>
