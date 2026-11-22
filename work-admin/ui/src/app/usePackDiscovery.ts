// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import { ref } from 'vue'
import { work } from '../api'
import type { Pack } from '../packs'
import { formatApiError } from '../transport'

export function usePackDiscovery() {
  const packs = ref<Pack[]>([])
  const loading = ref(false), error = ref('')
  const beginRead = latestRequest()

  async function load(stillOpen: () => boolean = () => true) {
    const current = beginRead()
    error.value = ''
    loading.value = true
    try {
      const rows = await work.packs()
      if (current() && stillOpen()) packs.value = rows
    } catch (e) {
      if (current() && stillOpen()) error.value = formatApiError(e, 'Could not load packs.')
    } finally {
      if (current()) loading.value = false
    }
  }

  function reset() {
    beginRead()
    packs.value = []
    error.value = ''
    loading.value = false
  }

  return { packs, loading, error, load, reset }
}
