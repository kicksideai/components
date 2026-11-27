<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { loadByTagName } from '@wippy-fe/proxy'

// The platform's generic settings card for one namespace. It reads, validates and saves that namespace's declared
// settings through the Settings API with its own Save.
export interface ProviderConfig { namespace: string; title: string; icon?: string; help?: string }
defineProps<{ config: ProviderConfig }>()

const TAG = 'kickside-settings-provider'
const ready = ref(!!customElements.get(TAG))
const error = ref('')
onMounted(async () => {
  if (ready.value) return
  try {
    await loadByTagName(TAG, { timeoutMs: 8000 })
    ready.value = true
  } catch (failure) {
    error.value = failure instanceof Error ? failure.message : String(failure)
  }
})
</script>

<template>
  <div v-if="ready" class="mail-provider-frame">
    <kickside-settings-provider class="mail-provider" :config.attr="JSON.stringify(config)" />
  </div>
  <p v-else-if="error" class="kx-err inline" role="alert">The {{ config.title }} settings could not be loaded. {{ error }}</p>
  <p v-else class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading {{ config.title }} settings…</p>
</template>
