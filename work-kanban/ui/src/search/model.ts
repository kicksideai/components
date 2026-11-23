// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { issuePageLimit } from '../issue/model'
import type { QueryCursor } from '../issue/types'
import { workFailure } from '../work/errors'

export interface SavedSearch {
  view_id: string
  title?: string
  status?: string
  view?: { type: string }
}

export function searchRequest(text: string, view?: string, after?: QueryCursor) {
  const term = text.trim()
  const page = { limit: issuePageLimit, ...(after === undefined ? {} : { after }) }
  if (view) return { view, body: page }
  if (term) return { body: { ...page, where: { match: term } } }
}

export function searchProblem(error: unknown) {
  const problem = workFailure(error)
  const messages: Record<string, string> = {
    search_indexing: 'Search is indexing this board. Try again when the index is ready.',
    search_verification_budget: 'Refine your search to narrow the number of matching issues.',
    search_unavailable: 'Search is unavailable on this board.',
    search_candidates_limit: 'Refine your search to narrow the number of matching issues.',
    stale_view: 'This saved view changed. Select it again to refresh the results.',
  }
  const message = problem.code && Object.hasOwn(messages, problem.code) ? messages[problem.code]! : problem.message
  return { ...problem, message }
}
