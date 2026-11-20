// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { computed, onUnmounted, ref, watch } from 'vue'
import { on } from '@wippy-fe/proxy'
import { useHostVisibilityRefresh } from '@wippy-fe/webcomponent-vue'
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import { work } from '../api'
import { formatApiError } from '../transport'
import type { BoardRow } from '../types'

export function useBoards() {
  const boards = ref<BoardRow[]>([]), loading = ref(true), error = ref(''), search = ref('')
  const hasLoaded = ref(false)
  const visibleBoards = computed(() => boards.value.filter(board => `${board.title} ${board.description ?? ''} ${board.key_prefix ?? ''}`.toLocaleLowerCase().includes(search.value.trim().toLocaleLowerCase())))
  const begin = latestRequest()
  async function load(showLoading = false) {
    const current = begin()
    if (showLoading) { loading.value = true; error.value = '' }
    try {
      const rows = await work.boards()
      if (!current()) return
      boards.value = rows
      hasLoaded.value = true
      error.value = ''
    }
    catch (e) { if (current()) error.value = formatApiError(e, 'Could not load boards.') }
    finally { if (current()) loading.value = false }
  }
  const stops = new Map<string, () => void>()
  watch(boards, rows => {
    for (const [id, stop] of stops) if (!rows.some(board => board.board_id === id)) { stop(); stops.delete(id) }
    for (const board of rows) if (!stops.has(board.board_id)) stops.set(board.board_id, on(`component.${board.board_id}`, () => { void load() }))
  })
  useHostVisibilityRefresh(load)
  onUnmounted(() => { begin(); for (const stop of stops.values()) stop() })
  return { boards, loading, error, search, visibleBoards, hasLoaded, load }
}
