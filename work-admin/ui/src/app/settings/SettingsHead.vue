<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import { Icon } from '@iconify/vue'
import Tag from 'primevue/tag'
import type { BoardRow } from '../../types'
import PageHead from '../PageHead.vue'
import BoardIdentity from '../BoardIdentity.vue'
import SettingsActions from './SettingsActions.vue'
const props = defineProps<{ pack?: { version: string }; packTitle?: string; outdated?: boolean; canUpgrade?: boolean; upgradeReason?: string; board?: BoardRow; embedded?: boolean; generation?: number; authorized: boolean; dirty: boolean; busy: boolean; checkingRemoval: boolean; reviewed: boolean; disabled: boolean }>()
defineEmits<{ back: []; discard: []; primary: []; saved: []; upgrade: [] }>()
const packSubtitle = computed(() => props.pack ? `${props.packTitle} ${props.pack.version}${props.outdated ? ' · Outdated' : ''}` : '')
const subtitle = computed(() => 'Settings · generation ' + (props.generation ?? '…') + (packSubtitle.value ? ' · ' + packSubtitle.value : ''))
</script>
<template>
  <header v-if="embedded" class="work-detail-head">
    <BoardIdentity :board="board" :subtitle="packSubtitle || undefined" detail @saved="$emit('saved')"><template #title-end><Tag severity="secondary" :value="'Generation ' + (generation ?? '…')" /></template></BoardIdentity>
    <div v-if="authorized" class="work-row work-wrap work-draft-actions"><Button v-if="authorized && outdated && pack" :disabled="!canUpgrade" :title="upgradeReason" label="Upgrade pack" severity="secondary" outlined @click="$emit('upgrade')"><template #icon><Icon icon="tabler:refresh" /></template></Button><SettingsActions :dirty="dirty" :busy="busy" :checking-removal="checkingRemoval" :reviewed="reviewed" :disabled="disabled" @discard="$emit('discard')" @primary="$emit('primary')" /></div>
  </header>
  <PageHead v-else :title="board?.title || 'Board'" :subtitle="subtitle" back-label="Back to board" icon="tabler:adjustments" @back="$emit('back')">
    <template #identity><BoardIdentity :board="board" :subtitle="subtitle" @saved="$emit('saved')" /></template>
    <Button v-if="authorized && outdated && pack" :disabled="!canUpgrade" :title="upgradeReason" label="Upgrade pack" severity="secondary" outlined @click="$emit('upgrade')"><template #icon><Icon icon="tabler:refresh" /></template></Button><SettingsActions v-if="authorized" :dirty="dirty" :busy="busy" :checking-removal="checkingRemoval" :reviewed="reviewed" :disabled="disabled" @discard="$emit('discard')" @primary="$emit('primary')" />
  </PageHead>
</template>
