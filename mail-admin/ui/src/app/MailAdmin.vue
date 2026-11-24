<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { host } from '@wippy-fe/proxy'
import { computed, provide, ref, watch } from 'vue'
import SettingsRail, { type SettingsRailGroup, type SettingsRailItem } from '@kickside/ui-kit/SettingsRail.vue'
import SettingsDirectoryActions from '@kickside/ui-kit/SettingsDirectoryActions.vue'
import { access, delivery as deliveryApi } from '../api'
import { mailContextKey, type CreateIntent } from '../context'
import { kindIcons, kindPlurals } from '../copy'
import { useLibrary } from '../library/useLibrary'
import LibraryPage from '../library/LibraryPage.vue'
import ResourcePage from '../library/ResourcePage.vue'
import AssetsPage from '../library/AssetsPage.vue'
import CreateResource from '../library/CreateResource.vue'
import UploadAsset from '../library/UploadAsset.vue'
import ActivityPage from '../activity/ActivityPage.vue'
import { parse, pathOf, sectionOf, sectionsFor, type LibrarySection, type ResourceSection, type Route } from '../route'
import type { Capabilities, DeliveryStatus } from '../types'

const props = defineProps<{ route?: string }>()
const emit = defineEmits<{ navigate: [route: string]; 'dirty-change': [dirty: boolean] }>()

const local = ref<Route>(parse(''))
const current = computed<Route>(() => props.route === undefined ? local.value : parse(props.route))

const dirty = ref(false)
watch(dirty, value => emit('dirty-change', value), { flush: 'sync' })
let asking = false
async function mayLeave(): Promise<boolean> {
  if (!dirty.value) return true
  if (asking) return false
  asking = true
  try {
    return await host.confirm({
      header: 'Discard unsaved changes?', message: 'Your changes to this resource are not saved yet.',
      acceptLabel: 'Discard changes', rejectLabel: 'Keep editing', acceptClass: 'p-button-danger',
    })
  } finally {
    asking = false
  }
}

function sameResource(a: Route, b: Route): boolean {
  return a.name === 'resource' && b.name === 'resource' && a.kind === b.kind && a.resource === b.resource
}

async function go(route: Route) {
  const path = pathOf(route)
  if (!sameResource(current.value, route) && !await mayLeave()) return
  if (!sameResource(current.value, route)) dirty.value = false
  if (props.route === undefined) local.value = route
  else if (path !== props.route) emit('navigate', path)
}

const library = useLibrary()
const capabilities = ref<Capabilities>()
const delivery = ref<DeliveryStatus>()
async function loadAccess() {
  try {
    capabilities.value = await access.capabilities()
  } catch {
    capabilities.value = undefined
  }
  if (capabilities.value?.administer_delivery) {
    try { delivery.value = await deliveryApi.status() } catch { delivery.value = undefined }
  }
}
void loadAccess()

const creating = ref(false), uploading = ref(false)
const createIntent = ref<CreateIntent>({})
function create(intent: CreateIntent) {
  createIntent.value = intent
  creating.value = true
}
provide(mailContextKey, {
  library, capabilities, delivery, go: route => { void go(route) }, create,
  upload: () => { uploading.value = true },
  setDirty: value => { dirty.value = value },
})

const sectionTitles: Record<ResourceSection, (kind: string) => string> = {
  content: kind => kind === 'message' ? 'Message' : kind === 'base' ? 'Layout' : 'Content',
  variables: kind => kind === 'message' ? 'Variables' : 'Inputs',
  'used-by': () => 'Used by',
  history: () => 'History',
}
const sectionIcons: Record<ResourceSection, (kind: string) => string> = {
  content: kind => kindIcons[kind as keyof typeof kindIcons],
  variables: () => 'tabler:variable',
  'used-by': () => 'tabler:link',
  history: () => 'tabler:history',
}

// Activity is for delivery administrators and, limited to their own email, for senders.
const showActivity = computed(() => !!capabilities.value && (capabilities.value.administer_delivery || capabilities.value.send))
const libraryGroups = computed<SettingsRailGroup[]>(() => [
  { heading: 'Library', items: [
    { value: 'messages', label: 'Messages', icon: kindIcons.message },
    { value: 'bases', label: 'Base templates', icon: kindIcons.base },
    { value: 'parts', label: 'Parts', icon: kindIcons.part },
    { value: 'assets', label: 'Assets', icon: kindIcons.asset },
  ] },
  ...(showActivity.value ? [{ heading: 'Delivery', items: [{ value: 'activity', label: 'Activity', icon: 'tabler:activity' }] }] : []),
])
const allResources: SettingsRailItem = { value: 'all', label: 'All resources', icon: 'tabler:table' }

const openTitle = computed(() => {
  const route = current.value
  if (route.name !== 'resource') return ''
  return library.find(route.kind, route.resource)?.title ?? route.resource
})
const resourceRail = computed(() => {
  const route = current.value
  if (route.name !== 'resource') return undefined
  return {
    leading: { value: 'all', label: 'All ' + kindPlurals[route.kind].toLowerCase(), icon: 'tabler:table' },
    groups: [{ heading: openTitle.value, items: sectionsFor(route.kind).map(section => ({
      value: section, label: sectionTitles[section](route.kind), icon: sectionIcons[section](route.kind),
    })) }],
  }
})
const railValue = computed(() => {
  const route = current.value
  if (route.name === 'resource') return route.section
  if (route.name === 'activity') return 'activity'
  return route.section
})

function selectRail(value: string) {
  const route = current.value
  if (route.name === 'resource') {
    if (value === 'all') void go({ name: 'library', section: sectionOf(route.kind) })
    else void go({ ...route, section: value as ResourceSection })
    return
  }
  if (value === 'activity') void go({ name: 'activity' })
  else void go({ name: 'library', section: value as LibrarySection })
}

function createFromRail() {
  const route = current.value
  if (route.name === 'library' && route.section === 'assets') { uploading.value = true; return }
  if (route.name === 'resource') create({ kind: route.kind })
  else if (route.name === 'library') create({ kind: route.section === 'bases' ? 'base' : route.section === 'parts' ? 'part' : 'message' })
  else create({})
}

const main = ref<HTMLElement>()
watch(() => pathOf(current.value), () => { main.value?.scrollTo({ top: 0 }) })
</script>

<template>
  <main class="kx-shell kx-settings-shell mail-admin">
    <SettingsRail label="Mail sections" title="Mail" :value="railValue"
      :groups="resourceRail ? resourceRail.groups : libraryGroups"
      :leading-item="resourceRail ? resourceRail.leading : allResources" @update:value="selectRail">
      <template #actions>
        <SettingsDirectoryActions create-label="New resource" @create="createFromRail" @defaults="host.navigate('/system/settings/mail')" />
      </template>
    </SettingsRail>
    <div class="kx-main">
      <div ref="main" class="kx-main-scroll mail-main" :class="{ 'mail-main-wide': current.name === 'resource' && current.section === 'content' }">
        <ResourcePage v-if="current.name === 'resource'" :key="current.kind + '/' + current.resource"
          :kind="current.kind" :name="current.resource" :section="current.section" />
        <ActivityPage v-else-if="current.name === 'activity'" :message="current.message" :template="current.template" />
        <AssetsPage v-else-if="current.section === 'assets'" :asset="current.asset" />
        <LibraryPage v-else :section="current.section" />
      </div>
    </div>
    <CreateResource :visible="creating" :intent="createIntent" @close="creating = false" />
    <UploadAsset :visible="uploading" @close="uploading = false" />
  </main>
</template>
