<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import type {Run} from '../models'
defineProps<{runs:Run[];retention:string}>()
const expiry=(s:string)=>new Date(s).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'})
</script>
<template><div class="section-head"><h2>Recent runs</h2><span class="muted">Retention {{retention}}</span></div><p v-if="!runs.length" class="empty">No runs yet.</p><div v-else class="run-list"><article v-for="run in runs" :key="run.id" class="run-card"><div class="row"><strong class="capitalize">{{run.caller}}</strong><span class="badge push" :data-status="run.status">{{run.status}}</span></div><dl><dt>Duration</dt><dd>{{(run.duration_ms/1000).toFixed(1)}}s</dd><dt>Expires</dt><dd>{{expiry(run.expires_at)}}</dd></dl></article></div></template>
