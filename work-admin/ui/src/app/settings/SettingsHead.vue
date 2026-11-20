<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from 'primevue/button'
import { Icon } from '@iconify/vue'
import Tag from 'primevue/tag'
import type { BoardRow } from '../../types'
import { ensureTag } from '../mount'
import PageHead from '../PageHead.vue'
import BoardIdentity from '../BoardIdentity.vue'
import SettingsActions from './SettingsActions.vue'
const props = defineProps<{ pack?: { version: string }; packTitle?: string; outdated?: boolean; canUpgrade?: boolean; upgradeReason?: string; board?: BoardRow; embedded?: boolean; generation?: number; authorized: boolean; dirty: boolean; busy: boolean; checkingRemoval: boolean; reviewed: boolean; disabled: boolean }>()
defineEmits<{ back: []; discard: []; primary: []; saved: []; 'metadata-dirty-change': [dirty: boolean]; upgrade: []; install: [] }>()
const sharing = ref(false), shareReady = ref(false), shareError = ref('')
async function share() {
  if (!props.authorized || !props.board) return
  shareError.value = ''; shareReady.value = await ensureTag('kickside-share')
  if (shareReady.value) sharing.value = true
  else shareError.value = 'The sharing widget is unavailable. Try Share board again.'
}
watch(() => props.authorized, allowed => { if (!allowed) sharing.value = false })
const shareConfig = computed(() => JSON.stringify({ resource_id: props.board?.board_id, title: props.board?.title, access_url: `/api/v1/component-access/grants/${encodeURIComponent(props.board?.board_id ?? '')}`, share_url: `/api/v1/component-access/share/${encodeURIComponent(props.board?.board_id ?? '')}` }))
const packSubtitle = computed(() => props.pack ? `${props.packTitle} ${props.pack.version}${props.outdated ? ' · Outdated' : ''}` : '')
const subtitle = computed(() => 'Settings · generation ' + (props.generation ?? '…') + (packSubtitle.value ? ' · ' + packSubtitle.value : ''))
</script>
<template>
  <header v-if="embedded" class="work-detail-head">
    <BoardIdentity :key="board?.board_id" :board="board" @dirty-change="$emit('metadata-dirty-change', $event)" :subtitle="packSubtitle || undefined" detail @saved="$emit('saved')"><template #title-end><Tag severity="secondary" :value="'Generation ' + (generation ?? '…')" /></template></BoardIdentity>
    <div v-if="authorized" class="work-row work-wrap work-draft-actions"><Button v-if="authorized && outdated && pack" :disabled="!canUpgrade" :title="upgradeReason" label="Upgrade pack" severity="secondary" outlined @click="$emit('upgrade')"><template #icon><Icon icon="tabler:refresh" /></template></Button><Button v-if="authorized && board" label="Share board" severity="secondary" outlined :disabled="busy" @click="share"><template #icon><Icon icon="tabler:share" aria-hidden="true" /></template></Button><Button v-if="authorized && !pack" label="Install pack" severity="secondary" outlined :disabled="busy || dirty" @click="$emit('install')" /><SettingsActions :dirty="dirty" :busy="busy" :checking-removal="checkingRemoval" :reviewed="reviewed" :disabled="disabled" @discard="$emit('discard')" @primary="$emit('primary')" /></div>
  </header>
  <PageHead v-else :title="board?.title || 'Board'" :subtitle="subtitle" back-label="Back to board" icon="tabler:adjustments" @back="$emit('back')">
    <template #identity><BoardIdentity :key="board?.board_id" :board="board" @dirty-change="$emit('metadata-dirty-change', $event)" :subtitle="subtitle" @saved="$emit('saved')" /></template>
    <Button v-if="authorized && outdated && pack" :disabled="!canUpgrade" :title="upgradeReason" label="Upgrade pack" severity="secondary" outlined @click="$emit('upgrade')"><template #icon><Icon icon="tabler:refresh" /></template></Button><Button v-if="authorized && board" label="Share board" severity="secondary" outlined :disabled="busy" @click="share"><template #icon><Icon icon="tabler:share" aria-hidden="true" /></template></Button><Button v-if="authorized && !pack" label="Install pack" severity="secondary" outlined :disabled="busy || dirty" @click="$emit('install')" /><SettingsActions v-if="authorized" :dirty="dirty" :busy="busy" :checking-removal="checkingRemoval" :reviewed="reviewed" :disabled="disabled" @discard="$emit('discard')" @primary="$emit('primary')" />
  </PageHead>
  <p v-if="shareError" class="kx-err" role="alert">{{ shareError }}</p>
  <kickside-share v-if="sharing && shareReady && authorized" :config="shareConfig" @close="sharing = false" @changed="$emit('saved')" />
</template>
