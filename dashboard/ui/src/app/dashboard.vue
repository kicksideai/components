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
  icon: string
  path: string
  route_name: string
  component_tag: string
}

interface NavItem extends Surface {
  hidden?: boolean
  render?: string
  surface?: string
}

const emit = useComponentEvents()

const surfaces = ref<Surface[]>([])
const status = ref<'loading' | 'ready' | 'error'>('loading')
let refresh = 0

const componentTag = /^[a-z][a-z0-9]*-[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

function isActionable(item: NavItem): boolean {
  if (!item?.id || !item.label || item.hidden || typeof item.path !== 'string') return false
  const path = item.path.split(/[?#]/, 1)[0]
  if (!path.startsWith('/') || path.startsWith('//') || path === '/' || item.path.includes('\\') || item.path.includes('://')) return false
  if (item.render === 'component') return typeof item.component_tag === 'string'
    && item.component_tag.length <= 80 && componentTag.test(item.component_tag)
  // System is the built-in KickSide renderer. Admission still comes from nav/list.
  return (!item.render || item.render === 'surface') && path === '/system'
    && (item.surface || item.route_name) === 'system'
}

async function fetchOverview() {
  const current = ++refresh
  status.value = 'loading'
  try {
    const { data } = await api.get('/api/v1/nav/list')
    if (current !== refresh) return
    if (data?.success !== true) throw new Error('Navigation unavailable')
    const items = data.items
    if (!Array.isArray(items) && !(data.count === 0 && items && typeof items === 'object' && !Object.keys(items).length)) {
      throw new Error('Invalid navigation response')
    }
    surfaces.value = Array.isArray(items) ? items.filter(isActionable) : []
    status.value = 'ready'
  } catch {
    if (current === refresh) status.value = 'error'
  }
}

// Use the effective path because a provider's route name can differ from its URL.
function open(s: Surface) {
  emit('navigate', { path: s.path, route_name: s.route_name, component_tag: s.component_tag, id: s.id })
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
        </div>
      </div>
    </header>

    <div class="kx-body">
      <div v-if="status === 'loading'" class="kx-loading" role="status">
        <Icon icon="tabler:loader-2" class="spin" aria-hidden="true" /> Loading…
      </div>

      <div v-else-if="status === 'error'" class="kx-err">
        <p role="alert">Could not load workspace navigation.</p>
        <button type="button" class="kx-retry" @click="fetchOverview">Retry</button>
      </div>

      <div v-else-if="!surfaces.length" class="kx-empty">
        <Icon icon="tabler:layout-dashboard" class="kx-empty-ico" aria-hidden="true" />
        <div class="kx-empty-title">No features available to this account</div>
      </div>

      <div v-else class="kx-grid">
        <button
          v-for="s in surfaces"
          :key="s.id"
          class="kx-card"
          type="button"
          :aria-label="`Open ${s.label}`"
          @click="open(s)"
        >
          <span class="kx-card-icon"><Icon :icon="s.icon" aria-hidden="true" /></span>
          <span class="kx-card-name">{{ s.label }}</span>
          <span class="kx-card-go"><Icon icon="tabler:arrow-right" aria-hidden="true" /></span>
        </button>
      </div>
    </div>
  </div>
</template>
