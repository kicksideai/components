// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { QueryCursor } from '../issue/types'

const sprintIssuePageSize = 10

export interface SprintPreview {
  snapshot: Record<string, unknown>
  token: string
  unfinished?: number
}

export function closeRequest(preview: SprintPreview, key: string) {
  return { snapshot: preview.snapshot, token: preview.token, key }
}

export function sprintMemberQuery(board: string, sprint?: string, after?: QueryCursor) {
  const membership = sprint
    ? { field: 'current_sprint', op: 'eq', value: { board, item: sprint } }
    : { field: 'current_sprint', op: 'is_null', value: true }
  return {
    where: { and: [{ field: 'type', op: 'nin', value: ['sprint', 'milestone'] }, membership] },
    order: [{ field: 'rank', dir: 'asc' }],
    limit: sprintIssuePageSize,
    ...(after === undefined ? {} : { after }),
  }
}
