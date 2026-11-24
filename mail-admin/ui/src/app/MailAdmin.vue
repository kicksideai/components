<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
<script setup lang="ts">
import { host } from '@wippy-fe/proxy'
import { computed, provide, ref, watch } from 'vue'
import SettingsRail, { type SettingsRailGroup, type SettingsRailItem } from '@kickside/ui-kit/SettingsRail.vue'
import SettingsDirectoryActions from '@kickside/ui-kit/SettingsDirectoryActions.vue'
import { delivery as deliveryApi, isDenied } from '../api'
import { mailContextKey, type CreateIntent } from '../context'
import { kindIcons, kindPlurals } from '../copy'
import { useLibrary } from '../library/useLibrary'
import LibraryPage from '../library/LibraryPage.vue'
import ResourcePage from '../library/ResourcePage.vue'
import AssetsPage from '../library/AssetsPage.vue'
import CreateResource from '../library/CreateResource.vue'
import ActivityPage from '../activity/ActivityPage.vue'
import { parse, pathOf, sectionOf, sectionsFor, type LibrarySection, type ResourceSection, type Route } from '../route'
import type { DeliveryStatus } from '../types'

const props = defineProps<{ route?: string }>()
const emit = defineEmits<{ navigate: [route: string] }>()

const local = ref<Route>(parse(''))
const current = computed<Route>(() => props.route === undefined ? local.value : parse(props.route))
function go(route: Route) {
  const path = pathOf(route)
  if (props.route === undefined) local.value = route
  else if (path !== props.route) emit('navigate', path)
}

const library = useLibrary()
const delivery = ref<DeliveryStatus>()
const deliveryAdmin = ref(false)
async function loadDelivery() {
  try {
    delivery.value = await deliveryApi.status()
    deliveryAdmin.value = true
  } catch (failure) {
    delivery.value = undefined
    deliveryAdmin.value = !isDenied(failure)
  }
}
void loadDelivery()

const creating = ref(false)
const createIntent = ref<CreateIntent>({})
function create(intent: CreateIntent) {
  createIntent.value = intent
  creating.value = true
}
provide(mailContextKey, { library, delivery, deliveryAdmin, go, create })

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

const libraryGroups = computed<SettingsRailGroup[]>(() => [
  { heading: 'Library', items: [
    { value: 'messages', label: 'Messages', icon: kindIcons.message },
    { value: 'bases', label: 'Base templates', icon: kindIcons.base },
    { value: 'parts', label: 'Parts', icon: kindIcons.part },
    { value: 'assets', label: 'Assets', icon: 'tabler:photo' },
  ] },
  ...(deliveryAdmin.value ? [{ heading: 'Delivery', items: [{ value: 'activity', label: 'Activity', icon: 'tabler:activity' }] }] : []),
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
    if (value === 'all') go({ name: 'library', section: sectionOf(route.kind) })
    else go({ ...route, section: value as ResourceSection })
    return
  }
  if (value === 'activity') go({ name: 'activity' })
  else go({ name: 'library', section: value as LibrarySection })
}

function createFromRail() {
  const route = current.value
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
      <div ref="main" class="kx-main-scroll mail-main">
        <ResourcePage v-if="current.name === 'resource'" :key="current.kind + '/' + current.resource"
          :kind="current.kind" :name="current.resource" :section="current.section" />
        <ActivityPage v-else-if="current.name === 'activity'" :message="current.message" :template="current.template" />
        <AssetsPage v-else-if="current.section === 'assets'" />
        <LibraryPage v-else :section="current.section" />
      </div>
    </div>
    <CreateResource :visible="creating" :intent="createIntent" @close="creating = false" />
  </main>
</template>
