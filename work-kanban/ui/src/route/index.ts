// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export const kanbanRoot = '/work-kanban'
export const tabs = ['board', 'backlog', 'sprints', 'search'] as const
export type KanbanTab = typeof tabs[number]

export interface KanbanRoute {
  tab: KanbanTab
  board?: string
  issue?: string
}

export interface Navigate {
  path: string
  back?: { within: string }
}

function readId(segment?: string): string | undefined {
  if (!segment) return
  try {
    const id = decodeURIComponent(segment)
    if (id !== '.' && id !== '..' && !/[/\\\s?#]/u.test(id)) return id
  } catch {
    return
  }
}

export function parseRoute(path: string): KanbanRoute | undefined {
  if (!path) return { tab: 'board' }
  const [prefix, boardSegment, ...segments] = path.split('/')
  const board = readId(boardSegment)
  if (prefix !== 'board' || !board) return
  const tab = tabs.find(value => value !== 'board' && value === segments[0]) ?? 'board'
  const overlay = tab === 'board' ? segments : segments.slice(1)
  if (!overlay.length) return { board, tab }
  const issue = readId(overlay[1])
  if (overlay.length === 2 && overlay[0] === 'issue' && issue) return { board, tab, issue }
}

export function boardPath({ board, tab, issue }: KanbanRoute): string {
  if (!board) return ''
  const path = 'board/' + encodeURIComponent(board)
  const view = tab === 'board' ? path : path + '/' + tab
  return issue ? view + '/issue/' + encodeURIComponent(issue) : view
}

export function issuePath(board: string, issue: string): string {
  return boardPath({ board, tab: 'board', issue })
}

export function routeInSurface(path: string, previous?: KanbanRoute): KanbanRoute | undefined {
  const route = parseRoute(path)
  if (route?.issue && route.tab === 'board' && previous && previous.board === route.board) {
    return { ...route, tab: previous.tab }
  }
  return route
}

export function switchBoard(route: KanbanRoute, board: string, supported: readonly KanbanTab[]): KanbanRoute {
  return { board, tab: supported.includes(route.tab) ? route.tab : 'board' }
}

export function dismissIssue(route: KanbanRoute): Navigate {
  const path = boardPath({ board: route.board, tab: route.tab })
  return { path, back: { within: path } }
}
