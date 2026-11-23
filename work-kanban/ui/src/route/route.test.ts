// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { describe, expect, it } from 'vitest'
import { boardPath, dismissIssue, parseRoute, switchBoard } from './index'

describe('Kanban routes', () => {
  it('parses the shell-relative board path and optional issue overlay', () => {
    expect(parseRoute('')).toEqual({ tab: 'board' })
    const path = 'board/board-id/sprints/issue/issue-id'
    const route = { board: 'board-id', tab: 'sprints', issue: 'issue-id' } as const
    expect(parseRoute(path)).toEqual(route)
    expect(boardPath(route)).toBe(path)
    expect(parseRoute('board/board-id/issue/issue-id')).toEqual({ ...route, tab: 'board' })
  })

  it.each(['backlog/board-id', 'board/', 'board/b/board', 'board/b/issue', 'board/b/search/x',
    'board/b/issue/i/extra', 'board/%ZZ', 'board/a%2Fb', 'board/..'])('rejects malformed paths %s', path => {
    expect(parseRoute(path)).toBeUndefined()
  })

  it('preserves a supported tab on switch and drops its issue', () => {
    const route = { board: 'old', tab: 'sprints', issue: 'item' } as const
    expect(switchBoard(route, 'new', ['board', 'sprints'])).toEqual({ board: 'new', tab: 'sprints' })
    expect(switchBoard(route, 'new', ['board', 'backlog'])).toEqual({ board: 'new', tab: 'board' })
  })

  it('requests shell Back within the view and supplies a direct-link fallback', () => {
    expect(dismissIssue({ board: 'b', tab: 'search', issue: 'i' }))
      .toEqual({ path: 'board/b/search', back: { within: 'board/b/search' } })
  })
})
