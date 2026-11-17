<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { ensureTag } from './mount'
const props = defineProps<{ catalogId: string; title: string }>()
const open = ref(false), loading = ref(false), error = ref('')
async function share() {
  loading.value = true
  error.value = ''
  if (await ensureTag('kickside-share')) open.value = true
  else error.value = 'Could not open sharing. Try Share again.'
  loading.value = false
}
</script>
<template>
  <Button type="button" severity="secondary" outlined size="small" :disabled="loading" @click="share">Share</Button>
  <kickside-share v-if="open" :config="JSON.stringify({ resource_id: props.catalogId, title: props.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(props.catalogId)}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(props.catalogId)}` })" @close="open = false" />
  <Message v-if="error" severity="error" role="alert">{{ error }}</Message>
</template>
