// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { WorkClient } from '../work/client'
import type { BoardAccess, WorkFinding } from '../work/types'

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json }
export type Predicate = {
  field: string
  op: string
  value: Json
} | { and: Predicate[] } | { or: Predicate[] } | { not: Predicate }
export interface ScopeQuery { id: string, where: Record<string, Record<string, Json>> }
export interface FilterSelection { where?: Predicate, scope?: ScopeQuery }
export type Cursor = Record<string, Json>
export type Sort = { field: string, dir?: 'asc' | 'desc' }
export interface SavedView {
  board_id: string
  view_id: string
  title: string
  view: {
    type: string
    where?: Predicate
    scopes?: ScopeQuery[]
    group_by?: string
    sub_group_by?: string
    order?: Sort | Sort[]
    boards?: string | string[]
  }
}
export interface ItemSummary {
  id: string
  key: string
  type: string
  state: string | Record<string, string>
  version: number
  values: Record<string, Json>
}
export interface Transition {
  id: string
  name: string
  to: string
  require?: string[]
  region?: string
}
export interface ItemDetail {
  item: ItemSummary
  access: BoardAccess
  field_edit?: Record<string, 'editable' | 'field_denied' | 'read_only'>
  transitions?: Transition[]
}
export interface QueryBucket {
  field: string
  value?: Json
  count: number
  items: ItemSummary[]
  after?: Cursor
  groups?: QueryBucket[]
}
export interface QueryPage {
  as_of: number
  items: ItemSummary[]
  after?: Cursor
  groups?: QueryBucket[]
  group_after?: string
  group_limited?: boolean
  reindexing?: boolean
  incomplete?: boolean
}
export interface WorkOperation {
  op: 'rank' | 'transition' | 'set'
  item: string
  expect_version?: number
  transition?: string
  region?: string
  after?: string
  before?: string
  clear?: string[]
  values?: Record<string, Json>
}
export interface WorkCommand {
  key: string
  mode: 'atomic'
  ops: WorkOperation[]
}
export interface ApplyResult {
  as_of?: number
  seq?: number
  outcomes: { status: string, findings?: WorkFinding[], error?: WorkFinding }[]
}

const defaultOrder: Sort[] = [{ field: 'rank' }]
export const columnPageSize = 20
export const boardFirstPageSize = 10
export const backlogPageSize = 25

export function and(...parts: (Predicate | undefined)[]): Predicate | undefined {
  const clauses = parts.flatMap(part => part ? 'and' in part ? part.and : [part] : [])
  return clauses.length > 1 ? { and: clauses } : clauses[0]
}

export function queryFor(saved: SavedView, filters: readonly FilterSelection[]) {
  const { where, scopes, order } = saved.view
  const selection = and(where, ...filters.map(filter => filter.where))
  const selectedScopes = [...(scopes ?? []), ...filters.flatMap(filter => filter.scope ? [filter.scope] : [])]
  return {
    ...(selection ? { where: selection } : {}),
    ...(selectedScopes.length ? { scopes: selectedScopes } : {}),
    order: order ?? defaultOrder,
  }
}

export function pageIdentity(board: string, generation: number, saved: SavedView, filters: readonly FilterSelection[]) {
  return JSON.stringify([board, generation, saved.view_id, saved.view, filters])
}

export interface BucketPosition {
  state: string
  lane?: Predicate
  after?: Cursor
}

export function bucketQuery(query: ReturnType<typeof queryFor>, bucket: BucketPosition, minSeq?: number, limit = columnPageSize) {
  return {
    ...query,
    where: and(query.where, { field: 'state', op: 'eq', value: bucket.state }, bucket.lane),
    after: bucket.after,
    min_seq: minSeq,
    limit,
  }
}

export async function findView(work: WorkClient, board: string, type: 'kanban_board' | 'kanban_backlog') {
  let after: string | undefined
  do {
    const page: { views: (SavedView | { status: string })[], after?: string } =
      await work.boardRead(board, 'list_views', { limit: 50, after })
    const match = (page.views ?? []).find((entry): entry is SavedView => 'view' in entry && entry.view?.type === type)
    if (match) {
      if (match.view.boards || (type === 'kanban_board' && match.view.group_by !== 'state')) {
        throw new Error('This saved view no longer selects a single Kanban board.')
      }
      return match
    }
    after = page.after
  } while (after)
  throw new Error(type === 'kanban_board' ? 'This board needs a shared Board view.' : 'This board needs a shared Backlog view.')
}

export function requireComplete(page: QueryPage) {
  if (page.reindexing) throw new Error('Work is indexing this view. Try again shortly.')
  if (page.incomplete || page.group_limited) throw new Error('Work could only read part of this view. Try narrowing the filters.')
  return page
}

export function readItemDetail(work: WorkClient, board: string, id: string, include?: 'transitions'[]) {
  return work.boardRead<ItemDetail>(board, 'get', { item: { id }, include })
}

export function titleOf(item: ItemSummary) {
  return typeof item.values.title === 'string' ? item.values.title : item.key
}
