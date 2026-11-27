// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { ref, shallowRef, type Ref } from 'vue'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import { isMissing, library } from '../api'
import { describe } from '../copy'
import type { HistoryItem, ResourceKey } from '../types'

export function useResourceHistory(key: Readonly<Ref<ResourceKey>>) {
  const revisions = shallowRef<HistoryItem[]>([])
  const historyLoading = ref(false), historyError = ref(''), historyMoreError = ref('')
  const historyCursor = ref<string>()
  const beginHistory = latestRequest()
  // The newest page of History; older pages follow on request.
  async function loadHistory() {
    const current = beginHistory()
    historyLoading.value = true
    try {
      const page = await library.history(key.value)
      if (!current()) return
      revisions.value = page.items
      historyCursor.value = page.next_cursor
      historyError.value = historyMoreError.value = ''
    } catch (failure) {
      if (!current()) return
      historyError.value = isMissing(failure) ? '' : describe(failure, 'History could not be loaded.')
    } finally {
      if (current()) historyLoading.value = false
    }
  }
  async function loadOlderHistory() {
    const cursor = historyCursor.value
    if (!cursor || historyLoading.value) return
    const current = beginHistory()
    historyLoading.value = true
    try {
      const page = await library.history(key.value, cursor)
      if (!current()) return
      const known = new Set(revisions.value.map(item => item.seq))
      revisions.value = [...revisions.value, ...page.items.filter(item => !known.has(item.seq))]
      historyCursor.value = page.next_cursor
      historyMoreError.value = ''
    } catch (failure) {
      if (current()) historyMoreError.value = describe(failure, 'Older versions could not be loaded.')
    } finally {
      if (current()) historyLoading.value = false
    }
  }

  return { revisions, historyLoading, historyError, historyMoreError, historyCursor, loadHistory, loadOlderHistory }
}
