<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { api } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { useComponentEvents } from '../constants.ts'

// Standalone WC: no SPA composables — read data through the authenticated proxy API,
// navigate by dispatching a `navigate` CustomEvent (the shell's WcSurface
// router.push()es its `path`), and style with the universal --p-* theme vocabulary.

interface Surface {
  id: string
  label: string
  description: string
  icon: string
  route_name: string
  component_tag: string
}

const emit = useComponentEvents()

const surfaces = ref<Surface[]>([])
const loading = ref(false)
const error = ref('')

async function fetchOverview() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/api/v1/dashboard/overview')
    surfaces.value = data.success ? (data.surfaces || []) : []
    if (!data.success && data.error) error.value = data.error
  } catch (e) {
    surfaces.value = []
    error.value = e instanceof Error ? e.message : 'failed to load overview'
  } finally {
    loading.value = false
  }
}

// Navigate to a sibling surface by its absolute shell route (/<route_name>). This
// is SHELL-INTERNAL navigation: the `navigate` event carries `path`, the shell's
// WcSurface bridge router.push()es it, and the shell reflects the host URL
// (/c/app.views:main/<route>) via host.onRouteChanged. We deliberately do NOT call
// host.navigate here -- that is host-level navigation (it addresses host pages by
// /c/<page-id>), so a bare /agents would be wrong and a /c/app.views:main/agents
// would hardcode the shell's page id. The host owns the /c/<page-id> prefix.
function open(s: Surface) {
  if (!s.route_name) return
  emit('navigate', { path: `/${s.route_name}`, route_name: s.route_name, component_tag: s.component_tag, id: s.id })
}

useHostVisibilityRefresh(fetchOverview)
</script>

<template>
  <div class="kx">
    <header class="kx-hero">
      <div class="kx-hero-inner">
        <div class="kx-hero-mark"><Icon icon="tabler:sparkles" aria-hidden="true" /></div>
        <div class="kx-hero-text">
          <h1 class="kx-hero-title">Welcome to KickSide</h1>
          <p class="kx-hero-sub">Everything installed in this workspace, ready to use.</p>
        </div>
        <span v-if="surfaces.length" class="kx-hero-chip">{{ surfaces.length }} surface{{ surfaces.length === 1 ? '' : 's' }}</span>
      </div>
    </header>

    <div v-if="error" class="kx-err">{{ error }}</div>

    <div class="kx-body">
      <div v-if="loading && !surfaces.length" class="kx-loading">
        <Icon icon="tabler:loader-2" class="spin" aria-hidden="true" /> Loading…
      </div>

      <div v-else-if="!surfaces.length" class="kx-empty">
        <Icon icon="tabler:layout-dashboard" class="kx-empty-ico" aria-hidden="true" />
        <div class="kx-empty-title">Nothing installed yet</div>
        <div class="kx-empty-sub">Install a feature module that declares a surface and it appears here.</div>
      </div>

      <div v-else class="kx-grid">
        <button
          v-for="s in surfaces"
          :key="s.id"
          class="kx-card"
          :class="{ 'kx-card-static': !s.route_name }"
          :disabled="!s.route_name"
          :aria-label="s.route_name ? `Open ${s.label}` : s.label"
          @click="open(s)"
        >
          <span class="kx-card-icon"><Icon :icon="s.icon" aria-hidden="true" /></span>
          <span class="kx-card-name">{{ s.label }}</span>
          <span v-if="s.description" class="kx-card-desc">{{ s.description }}</span>
          <span v-if="s.route_name" class="kx-card-go"><Icon icon="tabler:arrow-right" aria-hidden="true" /></span>
        </button>
      </div>
    </div>
  </div>
</template>
