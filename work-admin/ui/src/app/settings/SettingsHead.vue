<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import { Icon } from '@iconify/vue'
import type { BoardRow } from '../../types'
import { ensureTag } from '../mount'

const props = defineProps<{ title: string; description: string; board?: BoardRow; authorized: boolean; busy: boolean }>()
defineEmits<{ shared: [] }>()
const sharing = ref(false), opening = ref(false), shareError = ref('')
async function share() {
  const board = props.board
  if (!props.authorized || !board || props.busy || opening.value) return
  opening.value = true
  shareError.value = ''
  try {
    const ready = await ensureTag('kickside-share')
    if (props.board?.board_id !== board.board_id || !props.authorized) return
    if (ready) sharing.value = true
    else shareError.value = 'Sharing is unavailable. Try opening it again.'
  } finally { opening.value = false }
}
watch([() => props.authorized, () => props.board?.board_id], () => { sharing.value = false; shareError.value = '' })
const shareConfig = computed(() => {
  const id = encodeURIComponent(props.board?.board_id ?? '')
  return JSON.stringify({ resource_id: props.board?.board_id, title: props.board?.title,
    access_url: '/api/v1/component-access/grants/' + id, share_url: '/api/v1/component-access/share/' + id })
})
defineExpose({ share })
</script>

<template>
  <header class="system-section-head work-ia-head">
    <div class="system-section-head-text">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
    <div v-if="authorized && board" class="kx-head-actions">
      <Button label="Share board" severity="secondary" outlined :loading="opening" :disabled="busy" @click="share">
        <template #icon><Icon icon="tabler:share" aria-hidden="true" /></template>
      </Button>
      <slot />
    </div>
  </header>
  <p v-if="shareError" class="kx-err work-ia-share-error" role="alert">{{ shareError }}</p>
  <kickside-share v-if="sharing && authorized" :config="shareConfig" @close="sharing = false" @changed="$emit('shared')" />
</template>
