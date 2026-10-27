<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { api } from '@wippy-fe/proxy'
import { failedStorageRequest, failedStorageResponse } from './response.js'

interface Policy { mode: 'local' | 's3'; resource_id: string; prefix: string }
interface Destination { id: string; title: string }
interface Response { success: boolean; error?: string; saved?: boolean }
interface DestinationsResponse extends Response { resources?: Destination[] }
interface SettingsResponse extends Response { settings?: { key: string; value: Policy }[] }
const policy = ref<Policy>({ mode: 'local', resource_id: '', prefix: 'uploads' })
const destinations = ref<Destination[]>([])
const loading = ref(true)
const loaded = ref(false)
const busy = ref(false)
const error = ref('')
const notice = ref('')
let baseline = ''
const modes = [{ label: 'Keep processed files locally', value: 'local' }, { label: 'Move processed files to S3', value: 's3' }]
const dirty = computed(() => JSON.stringify(policy.value) !== baseline)
const valid = computed(() => policy.value.mode === 'local' || (
  destinations.value.some(item => item.id === policy.value.resource_id) &&
  policy.value.prefix.length > 0 && policy.value.prefix.length <= 256 &&
  policy.value.prefix.split('/').every(segment => segment !== '' && segment !== '.' && segment !== '..') &&
  /^[a-zA-Z0-9_/.\-]+$/.test(policy.value.prefix)))
watch(policy, () => { notice.value = '' }, { deep: true })

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [settings, resources] = await Promise.all([
      api.get<SettingsResponse>('/api/v1/settings?namespace=kickside.storage_s3'),
      api.get<DestinationsResponse>('/api/v1/storage-s3'),
    ])
    if (!settings.data?.success) throw new Error(settings.data?.error || 'Could not load the storage policy')
    if (!resources.data?.success) throw new Error(resources.data?.error || 'Could not load destinations')
    const stored = (settings.data as SettingsResponse).settings?.find(row => row.key === 'policy')?.value
    policy.value = stored ? { ...stored } : { mode: 'local', resource_id: '', prefix: 'uploads' }
    destinations.value = resources.data.resources || []
    baseline = JSON.stringify(policy.value)
    loaded.value = true
    return true
  } catch (cause) {
    error.value = failedStorageRequest(cause).error
    return false
  }
  finally { loading.value = false }
}

async function perform(operation: 'test' | 'save' | 'reset') {
  busy.value = true
  error.value = ''
  notice.value = ''
  try {
    const response = operation === 'reset'
      ? await api.delete<Response>('/api/v1/storage-s3')
      : await api.post<Response>(operation === 'test' ? '/api/v1/storage-s3/test' : '/api/v1/storage-s3', { ...policy.value })
    if (!response.data?.success) {
      const failed = failedStorageResponse(response.data)
      if (failed.savedNotice) {
        await load()
        notice.value = failed.savedNotice
      }
      error.value = failed.error
      return
    }
    if (operation !== 'test' && !(await load())) return
    notice.value = operation === 'test' ? 'Upload, size verification, and deletion succeeded.'
      : operation === 'reset' ? 'Future file placement is disabled. Existing S3 files remain readable.'
      : 'Storage policy saved.'
  } catch (cause) {
    const failed = failedStorageRequest(cause)
    if (failed.savedNotice) {
      await load()
      notice.value = failed.savedNotice
    }
    error.value = failed.error
  }
  finally { busy.value = false }
}
onMounted(load)
</script>

<template>
  <main class="storage-s3" aria-labelledby="storage-s3-title">
    <header>
      <h2 id="storage-s3-title">S3 storage</h2>
      <p>Move original files and their derived content to private S3 storage after processing. Attachments and Knowledge references keep their existing addresses.</p>
    </header>
    <Message v-if="error" severity="error" :closable="false" role="alert">{{ error }}</Message>
    <Message v-if="notice" severity="success" :closable="false" role="status">{{ notice }}</Message>
    <p v-if="loading" role="status">Loading storage settings…</p>
    <form v-else-if="loaded" @submit.prevent="perform('save')">
      <label id="storage-s3-mode-label">Processed file storage</label>
      <Select v-model="policy.mode" :options="modes" option-label="label" option-value="value"
        aria-labelledby="storage-s3-mode-label" :disabled="busy" />
      <template v-if="policy.mode === 's3'">
        <label id="storage-s3-destination-label">Destination</label>
        <Select v-model="policy.resource_id" :options="destinations" option-label="title" option-value="id"
          placeholder="Select a configured destination" aria-labelledby="storage-s3-destination-label" :disabled="busy" />
        <p v-if="!destinations.length">No S3 destination is declared by this host.</p>
        <label for="storage-s3-prefix">Folder prefix</label>
        <InputText id="storage-s3-prefix" v-model="policy.prefix" :disabled="busy" maxlength="256" aria-describedby="storage-s3-prefix-help" />
        <small id="storage-s3-prefix-help">Use a relative folder path, such as uploads or processed/files.</small>
      </template>
      <p>Changes apply to future processing. Disabling placement keeps existing files at their saved destinations.</p>
      <div class="storage-s3-actions">
        <Button v-if="policy.mode === 's3'" type="button" label="Test storage" severity="secondary"
          :disabled="busy || !valid" @click="perform('test')" />
        <Button type="submit" label="Save" :loading="busy" :disabled="busy || !dirty || !valid" />
        <Button type="button" label="Reset to local storage" severity="secondary" :disabled="busy" @click="perform('reset')" />
        <Button v-if="error" type="button" label="Reload" severity="secondary" :disabled="busy" @click="load" />
      </div>
    </form>
    <Button v-if="error && !loaded" label="Reload" severity="secondary" :disabled="busy || loading" @click="load" />
  </main>
</template>
