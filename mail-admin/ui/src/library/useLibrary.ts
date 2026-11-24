// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { computed, ref, shallowRef } from 'vue'
import { isDenied, library } from '../api'
import { describe } from '../copy'
import { useLibraryChanges } from '../realtime'
import type { LibraryRow, ResourceKind } from '../types'

export type StateFilter = 'all' | 'original' | 'customized' | 'created'

// Every resource's summary row, for titles, pickers and the Insert dialog.
export function useLibrary() {
  const resources = shallowRef<LibraryRow[]>([])
  const loading = ref(true), loaded = ref(false), denied = ref(false)
  const error = ref('')
  const version = ref(0)
  const begin = latestRequest()

  async function load() {
    const current = begin()
    if (!loaded.value) loading.value = true
    try {
      const items = await library.all()
      if (!current()) return
      resources.value = items
      error.value = ''
      denied.value = false
      loaded.value = true
      version.value++
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
  const find = (kind: ResourceKind, name: string) => byKey.value.get(kind + '/' + name)
  const ofKind = (kind: ResourceKind) => resources.value.filter(item => item.kind === kind)
    .sort((a, b) => a.title.localeCompare(b.title))

  return { resources, loading, loaded, denied, error, version, load, find, ofKind }
}
