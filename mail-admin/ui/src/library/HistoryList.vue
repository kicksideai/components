<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Disclosure from '@kickside/ui-kit/Disclosure.vue'
import { fullDate } from '../copy'
import { principalLabel } from '../principals'
import type { Resource, Revision } from '../types'
import SourceFaces from './SourceFaces.vue'

defineProps<{ resource: Resource; revisions: Revision[]; loading: boolean; error: string; busy: number | undefined }>()
defineEmits<{ restore: [revision: Revision]; retry: [] }>()
</script>

<template>
  <div v-if="error" class="kx-err mail-error" role="alert">
    <span>{{ error }}</span>
    <Button label="Retry" severity="secondary" outlined size="small" @click="$emit('retry')" />
  </div>
  <p v-else-if="loading && !revisions.length" class="kx-loading" role="status"><Icon icon="tabler:loader-2" class="spin" aria-hidden="true" />Loading history…</p>
  <p v-else-if="!revisions.length" class="mail-muted" role="status">
    {{ resource.title }} has no saved versions. Each change is kept here, newest first.
  </p>
  <ol v-else class="mail-history">
    <li v-for="revision in revisions" :key="revision.revision" class="mail-history-row">
      <div class="mail-history-head">
        <div class="mail-history-main">
          <span class="mail-history-title">
            {{ revision.note || 'Saved without a note' }}
            <Tag v-if="revision.revision === resource.revision" severity="success" value="Current" class="kx-tag-sm" />
          </span>
          <span class="mail-sub">{{ principalLabel(revision.author) }} · {{ fullDate(revision.created_at) }}</span>
        </div>
        <Button v-if="revision.revision !== resource.revision" label="Restore this version" severity="secondary" outlined size="small"
          :loading="busy === revision.revision" :disabled="busy !== undefined" @click="$emit('restore', revision)">
          <template #icon><Icon icon="tabler:restore" aria-hidden="true" /></template>
        </Button>
      </div>
      <Disclosure label="Show this version">
        <dl class="mail-facts">
          <template v-if="revision.content.subject !== undefined"><dt>Subject</dt><dd class="mail-mono-block">{{ revision.content.subject }}</dd></template>
          <dt>Title</dt><dd>{{ revision.content.title }}</dd>
        </dl>
        <SourceFaces :html="revision.content.html" :text="revision.content.text" label="Source" />
      </Disclosure>
    </li>
  </ol>
</template>
