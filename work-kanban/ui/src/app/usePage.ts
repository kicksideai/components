// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { latestRequest } from '@kickside/ui-kit/latestRequest'
import { computed, onScopeDispose, ref, shallowRef, watch, type Ref } from 'vue'
import { checkPlacements } from '../extensions/placements'
import { findView, runFirstViewPage, viewType, type FirstViewRead } from '../presentation/query'
import { boardPath, dismissIssue, kanbanRoot, switchBoard, type KanbanRoute, type KanbanTab, type Navigate } from '../route'
import { isAccessLoss, planningPlugin, searchPlugin, WorkError, type WorkClient } from '../work/client'
import { BoardDirectory } from '../work/directory'
import type { BoardAccess, BoardOption, BoardSchema } from '../work/types'

export function availableTabs(schema?: BoardSchema, access?: BoardAccess): KanbanTab[] {
  const items: KanbanTab[] = ['board', 'backlog']
  const panels = access && checkPlacements(schema?.extensions, access)
  const active = new Set(schema?.plugins?.filter(plugin => plugin.active).map(plugin => plugin.plugin))
  for (const [role, pluginId] of [['sprints', planningPlugin], ['search', searchPlugin]] as const) {
    const panel = panels?.some(entry => entry.slot === 'board_panel' && entry.target === 'board:' + role && active.has(entry.plugin))
    if (panel || active.has(pluginId)) items.push(role)
  }
  return items
}

export function usePage(
  route: Readonly<Ref<KanbanRoute | undefined>>,
  work: Pick<WorkClient, 'boards' | 'schema' | 'boardRead' | 'runView'>,
  navigate: (request: Navigate) => void,
  subscribe: (board: string, revalidate: () => Promise<void>) => (() => void) | undefined,
) {
  let directory = new BoardDirectory(work.boards)
  let stopSubscription: (() => void) | undefined
  let subscribed: string | undefined
  const begin = latestRequest()
  const boards = shallowRef<BoardOption[]>([])
  const board = shallowRef<BoardOption>()
  const schema = shallowRef<BoardSchema>()
  const firstView = shallowRef<FirstViewRead>()
  const loading = ref(false)
  const error = shallowRef<unknown>()
  const missing = ref(false)
  const paging = ref(false)
  const pagingError = shallowRef<unknown>()
  const hasMore = ref(true)
  const allowedTabs = computed(() => availableTabs(schema.value, board.value?.access))

  function syncDirectory() {
    boards.value = directory.boards
    hasMore.value = directory.hasMore
  }

  function setSubscription(next?: string) {
    if (subscribed === next) return
    stopSubscription?.()
    subscribed = next
    stopSubscription = next ? subscribe(next, () => refresh(true, next)) : undefined
  }

  function clearSelection() {
    board.value = undefined
    schema.value = undefined
    firstView.value = undefined
    setSubscription()
  }

  async function refresh(revalidate = false, selected?: string) {
    const active = route.value
    const current = begin()
    if (!active) {
      clearSelection()
      return
    }
    const requested = selected ?? active.board
    const changing = requested !== board.value?.board_id || !board.value
    if (changing) clearSelection()
    missing.value = false
    error.value = undefined
    loading.value = true
    const source = revalidate ? new BoardDirectory(work.boards) : directory
    let found: BoardOption | undefined
    const tab = active.tab === 'board' || active.tab === 'backlog' ? active.tab : undefined
    const selection = source.resolve(requested)
    function readView(id: string) {
      if (changing && tab) return findView(work, id, viewType(tab))
    }
    const earlySchema = requested ? work.schema(requested) : undefined
    const earlyView = requested ? readView(requested) : undefined
    // The directory can reject the selection before these reads finish. Their
    // original promises still carry errors to the page or presentation reader.
    void earlySchema?.catch(() => {})
    void earlyView?.catch(() => {})
    try {
      found = await selection
      if (!current()) return
      directory = source
      syncDirectory()
      if (!found) {
        clearSelection()
        missing.value = !!requested
        return
      }
      if (found.status && found.status !== 'ready') {
        setSubscription()
        board.value = found
        schema.value = undefined
        return
      }
      const snapshot = earlySchema ?? work.schema(found.board_id)
      const view = earlyView ?? readView(found.board_id)
      if (tab && view) {
        const page = view.then(saved => {
          if (current() && route.value?.tab === tab) return runFirstViewPage(work, tab, saved)
        })
        void page.catch(() => {})
        firstView.value = { board: found.board_id, tab, view, page }
      }
      setSubscription(found.board_id)
      const next = await snapshot
      if (!current()) return
      board.value = found
      schema.value = next
      if (!active.board || selected && active.board !== found.board_id) {
        const target = switchBoard(active, found.board_id, availableTabs(next, found.access))
        navigate({ path: boardPath(target) })
      }
    } catch (problem) {
      if (!current()) return
      if (isAccessLoss(problem)) {
        clearSelection()
        if (found && problem instanceof WorkError && problem.status !== 401) directory.remove(found.board_id)
        else directory = new BoardDirectory(work.boards)
        syncDirectory()
        missing.value = true
      } else error.value = problem
    } finally {
      if (current()) loading.value = false
    }
  }

  async function loadMore() {
    if (paging.value) return
    const source = directory
    paging.value = true
    pagingError.value = undefined
    try {
      await source.loadMore()
      if (directory === source) syncDirectory()
    } catch (problem) {
      if (directory === source) pagingError.value = problem
    } finally {
      paging.value = false
    }
  }

  watch([() => route.value?.board, () => !!route.value], ([id, valid]) => {
    if (!valid || !board.value || id !== board.value.board_id) void refresh()
  }, { immediate: true })
  onScopeDispose(() => {
    begin()
    stopSubscription?.()
  })

  function openTab(value: KanbanTab) {
    if (!board.value || !allowedTabs.value.includes(value)) return
    navigate({ path: boardPath({ board: board.value.board_id, tab: value }) })
  }

  function openIssue(issue: string) {
    if (!board.value || !route.value) return
    navigate({ path: boardPath({ board: board.value.board_id, tab: route.value.tab, issue }) })
  }

  function closeIssue() {
    if (route.value?.issue) navigate(dismissIssue(route.value))
  }

  function links() {
    const selected = board.value
    const active = route.value
    if (!selected || !active) return
    const view = { ...active, board: selected.board_id }
    return {
      board: `${kanbanRoot}/${boardPath({ ...view, issue: undefined })}`,
      issue: view.issue ? `${kanbanRoot}/${boardPath(view)}` : undefined,
    }
  }

  return {
    boards, board, schema, firstView, allowedTabs, loading, error, missing, paging, pagingError, hasMore,
    refresh, loadMore, openTab, openIssue, closeIssue, links,
    select: (id: string) => id !== board.value?.board_id ? refresh(false, id) : undefined,
    created: (id: string) => refresh(true, id),
  }
}
