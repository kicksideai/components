<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { api } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { ensureTag } from './mount'
import { requestGeneration } from '../shared/requests'
import type { CatalogAccess } from '../types'

const props = defineProps<{ catalogId: string; title: string; access: CatalogAccess }>()
const open = ref(false), loading = ref(false), error = ref('')
const counts = ref<{ people: number; groups: number }>()
const countsFailed = ref(false)
const reads = requestGeneration()
const grantsUrl = computed(() => '/api/v1/component-access/grants/' + encodeURIComponent(props.catalogId))
const shareConfig = computed(() => JSON.stringify({
  resource_id: props.catalogId, title: props.title,
  access_url: grantsUrl.value,
  share_url: '/api/v1/component-access/share/' + encodeURIComponent(props.catalogId),
}))
const summary = computed(() => {
  if (!props.access.admin) return 'Only catalog administrators can manage sharing.'
  if (!counts.value) return countsFailed.value ? 'Member counts are unavailable.' : 'Loading members…'
  const { people, groups } = counts.value
  return people + (people === 1 ? ' person' : ' people') + ' and ' + groups + (groups === 1 ? ' group' : ' groups') + ' with direct access'
})
async function loadGrants() {
  if (!props.access.admin) return
  const read = reads.begin()
  countsFailed.value = false
  try {
    const { data } = await api.get(grantsUrl.value)
    if (!reads.current(read)) return
    if (!data?.success || !Array.isArray(data.access)) throw new Error('Grants unavailable')
    const groups = data.access.filter((row: { subject_type?: string }) => row.subject_type === 'group').length
    counts.value = { people: data.access.length - groups, groups }
  } catch {
    if (reads.current(read)) { counts.value = undefined; countsFailed.value = true }
  }
}
useHostVisibilityRefresh(loadGrants)
onUnmounted(() => { reads.begin() })

async function share() {
  loading.value = true
  error.value = ''
  if (await ensureTag('kickside-share')) open.value = true
  else error.value = 'Could not open sharing. Try again.'
  loading.value = false
}
</script>
<template>
  <div class="pim-stack">
    <section class="form pim-access-card pim-ia-action">
      <div>
        <h3>Members and sharing</h3>
        <p class="pim-access-summary">{{ summary }}</p>
      </div>
      <Button v-if="access.admin" type="button" label="Share catalog" :loading="loading" @click="share">
        <template #icon><Icon icon="tabler:share" aria-hidden="true" /></template>
      </Button>
      <Button v-if="countsFailed" type="button" label="Reload member counts" severity="secondary" text @click="loadGrants" />
    </section>
    <section class="form pim-access-card pim-stack" aria-labelledby="pim-access-roles-heading">
      <h3 id="pim-access-roles-heading">What members can do</h3>
      <dl class="pim-access-roles">
        <div><dt>Read</dt><dd>View products and their details.</dd></div>
        <div><dt>Write</dt><dd>Create products and update their values.</dd></div>
        <div><dt>Delete</dt><dd>Move products to trash.</dd></div>
        <div><dt>Admin</dt><dd>Manage catalog settings and who has access.</dd></div>
      </dl>
    </section>
    <kickside-share v-if="open" :config="shareConfig" @close="open = false" @changed="loadGrants" />
    <Message v-if="error" severity="error" role="alert">{{ error }}</Message>
  </div>
</template>
