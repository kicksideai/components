<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { actionLabels, fullDate, hasHistorySnapshot, personLabel } from '../copy'
import type { HistoryItem, Resource } from '../types'

defineProps<{ resource: Resource; revisions: HistoryItem[]; loading: boolean; error: string; busy: number | undefined; more?: boolean; moreError?: string }>()
defineEmits<{ show: [revision: HistoryItem]; restore: [revision: HistoryItem]; retry: []; more: [] }>()
</script>

<template>
  <div v-if="error" class="kx-err mail-error" role="alert">
    <span>{{ error }}</span>
    <Button label="Retry" severity="secondary" outlined size="small" @click="$emit('retry')" />
  </div>
  <p v-else-if="loading && !revisions.length" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading history…</p>
  <p v-else-if="!revisions.length" class="mail-muted" role="status">
    {{ resource.title }} has not been changed yet. Each saved change is kept here, newest first.
  </p>
  <ol v-else class="mail-history">
    <li v-for="revision in revisions" :key="revision.seq" class="mail-history-row">
      <div class="mail-history-head">
        <div class="mail-history-main">
          <span class="mail-history-title">
            Version {{ revision.version }} · {{ actionLabels[revision.action] }}{{ revision.restored_from ? ' from version ' + revision.restored_from : '' }}
            <Tag v-if="revision.version === resource.revision" severity="success" value="Current" class="kx-tag-sm" />
          </span>
          <span class="mail-sub">{{ personLabel(revision.author_label, revision.author) }} · {{ fullDate(revision.created_at) }}</span>
          <span v-if="revision.note" class="mail-history-note">{{ revision.note }}</span>
        </div>
        <div v-if="hasHistorySnapshot(revision)" class="mail-history-actions">
          <Button label="Show this version" :disabled="busy !== undefined" severity="secondary" text size="small" @click="$emit('show', revision)">
            <template #icon><Icon icon="tabler:eye" aria-hidden="true" /></template>
          </Button>
          <Button v-if="revision.version !== resource.revision" label="Restore" severity="secondary" outlined size="small"
            :loading="busy === revision.seq" :disabled="busy !== undefined" @click="$emit('restore', revision)">
            <template #icon><Icon icon="tabler:restore" aria-hidden="true" /></template>
          </Button>
        </div>
      </div>
    </li>
  </ol>
  <div v-if="more && revisions.length" class="mail-more">
    <span v-if="moreError" class="kx-err inline" role="alert">{{ moreError }}</span>
    <Button :label="moreError ? 'Retry' : 'Show older versions'" severity="secondary" outlined :loading="loading" @click="$emit('more')" />
  </div>
</template>
