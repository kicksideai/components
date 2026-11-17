<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { host } from '@wippy-fe/proxy'
import Button from 'primevue/button'
import { ensureTag } from '../mount'
const ready = ref(false), loading = ref(true)
const config = JSON.stringify({ namespace: 'kickside.work', title: 'Work application defaults', icon: 'tabler:settings', help: 'Defaults apply to boards without a policy override. Board fields, processes, plugins and overrides are configured in Board settings.' })
async function load() { loading.value = true; ready.value = await ensureTag('kickside-settings-provider'); loading.value = false }
onMounted(load)
</script>
<template>
  <section class="work-stack work-pane" aria-label="Work application defaults">
    <div class="work-row"><p class="work-muted work-small work-spacer">For individual board settings and policy overrides, open board administration.</p><Button label="Board settings" severity="secondary" outlined @click="host.navigate('/system/work')" /></div>
    <kickside-settings-provider v-if="ready" :config="config" />
    <p v-else-if="loading" class="kx-loading" role="status">Loading application settings…</p>
    <p v-else class="kx-err" role="alert">Application settings are unavailable.<Button label="Retry" severity="secondary" outlined @click="load" /></p>
  </section>
</template>
