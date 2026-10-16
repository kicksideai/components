<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@wippy-fe/proxy'
import { useComponentProps, useComponentEvents } from '../constants.ts'

interface Provider { id: string, label: string, start: string }
interface Connection { provider: string, email?: string, last_login_at?: string | number }

const props = useComponentProps()
const emit = useComponentEvents()
const mode = computed(() => (props.value.mode === 'account' ? 'account' : 'buttons'))

const loading = ref(true)
const error = ref('')
const notice = ref('')
const busy = ref('')
const providers = ref<Provider[]>([])
const connections = ref<Connection[]>([])

async function httpGet(path: string) {
  return (await api.get(path)).data
}
async function httpPost(path: string, body?: unknown) {
  return (await api.post(path, body)).data
}
async function httpDelete(path: string) {
  return (await api.delete(path)).data
}

const currentRedirect = () => window.location.pathname + window.location.search

// Handle the fragment handoff (#sso_token / #sso_error / #sso_linked) the callback
// leaves on the post-login URL, then strip it so a refresh doesn't reprocess it.
function consumeHash() {
  const h = window.location.hash
  if (!h || h.length < 2) return
  const params = new URLSearchParams(h.slice(1))
  const token = params.get('sso_token')
  const linked = params.get('sso_linked')
  const err = params.get('sso_error')
  if (token) {
    emit('token', { token })
    document.dispatchEvent(new CustomEvent('kickside-sso-token', { detail: { token }, bubbles: true }))
  }
  if (linked) notice.value = `Connected ${linked}.`
  if (err) error.value = decodeURIComponent(err)
  if (token || linked || err) {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}

const connectedSet = computed(() => new Set(connections.value.map((c) => c.provider)))

async function loadProviders() {
  const data = await httpGet('/api/public/sso/providers')
  if (!data?.success) throw new Error(data?.error || 'failed to load providers')
  providers.value = data.providers as Provider[]
}

async function loadConnections() {
  const data = await httpGet('/api/v1/sso/connections')
  if (!data?.success) throw new Error(data?.error || 'failed to load connections')
  connections.value = data.connections as Connection[]
}

function signIn(p: Provider) {
  window.location.href = `${p.start}?redirect=${encodeURIComponent(currentRedirect())}`
}

async function connect(p: Provider) {
  busy.value = p.id
  error.value = ''
  try {
    const data = await httpPost(`/api/v1/sso/${p.id}/link?redirect=${encodeURIComponent(currentRedirect())}`)
    if (!data?.success || !data.url) throw new Error(data?.error || 'failed to start linking')
    window.location.href = data.url
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    busy.value = ''
  }
}

async function disconnect(providerId: string) {
  busy.value = providerId
  error.value = ''
  try {
    const data = await httpDelete(`/api/v1/sso/${providerId}/link`)
    if (!data?.success) throw new Error(data?.error || 'failed to disconnect')
    await loadConnections()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    busy.value = ''
  }
}

onMounted(async () => {
  consumeHash()
  try {
    await loadProviders()
    if (mode.value === 'account') await loadConnections()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="sso">
    <div v-if="error" class="sso-msg sso-err">{{ error }}</div>
    <div v-if="notice" class="sso-msg sso-ok">{{ notice }}</div>
    <div v-if="loading" class="sso-muted">Loading…</div>

    <template v-else-if="mode === 'buttons'">
      <button
        v-for="p in providers"
        :key="p.id"
        type="button"
        class="sso-btn"
        @click="signIn(p)"
      >
        Continue with {{ p.label }}
      </button>
      <div v-if="!providers.length" class="sso-muted">No sign-in providers are enabled.</div>
    </template>

    <template v-else>
      <div v-for="p in providers" :key="p.id" class="sso-row">
        <div class="meta">
          <span class="name">{{ p.label }}</span>
          <span class="sub">{{ connectedSet.has(p.id) ? 'Connected' : 'Not connected' }}</span>
        </div>
        <button
          v-if="connectedSet.has(p.id)"
          type="button"
          class="sso-unlink"
          :disabled="busy === p.id"
          @click="disconnect(p.id)"
        >
          Disconnect
        </button>
        <button
          v-else
          type="button"
          class="sso-link"
          :disabled="busy === p.id"
          @click="connect(p)"
        >
          Connect
        </button>
      </div>
      <div v-if="!providers.length" class="sso-muted">No sign-in providers are enabled.</div>
    </template>
  </div>
</template>
