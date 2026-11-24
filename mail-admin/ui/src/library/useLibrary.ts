// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { computed, ref, shallowRef } from 'vue'
import { isDenied, library } from '../api'
import { describe } from '../copy'
import { resolvePrincipals } from '../principals'
import { useLibraryChanges } from '../realtime'
import type { Resource, ResourceKind, ResourceState } from '../types'

export type StateFilter = 'all' | ResourceState

export function useLibrary() {
  const resources = shallowRef<Resource[]>([])
  const loading = ref(true), loaded = ref(false), denied = ref(false)
  const error = ref('')
  const begin = latestRequest()

  async function load() {
    const current = begin()
    if (!loaded.value) loading.value = true
    try {
      const items = await library.list()
      if (!current()) return
      resources.value = items
      error.value = ''
      denied.value = false
      loaded.value = true
      void resolvePrincipals(items.map(item => item.author))
    } catch (failure) {
      if (!current()) return
      denied.value = isDenied(failure)
      error.value = denied.value ? '' : describe(failure, 'The mail library could not be loaded.')
    } finally {
      if (current()) loading.value = false
    }
  }

  useLibraryChanges(() => { void load() })
  useHostVisibilityRefresh(load)

  const byKey = computed(() => new Map(resources.value.map(item => [item.kind + '/' + item.name, item])))
  const usage = computed(() => {
    const counts = new Map<string, string[]>()
    for (const item of resources.value) {
      if (item.kind !== 'message' || !item.base) continue
      const users = counts.get(item.base) ?? []
      users.push(item.name)
      counts.set(item.base, users)
    }
    return counts
  })
  const find = (kind: ResourceKind, name: string) => byKey.value.get(kind + '/' + name)

  return { resources, loading, loaded, denied, error, load, find, usage }
}

export function matches(resource: Resource, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [resource.title, resource.name, resource.description, resource.subject ?? '', resource.html, resource.text]
    .some(value => value.toLowerCase().includes(q))
}
