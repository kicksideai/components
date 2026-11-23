// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { BoardAccess } from '../work/types'

export interface Principal { kind: 'user' | 'group' | 'service'; id: string }
export interface Reference { board?: string; item: string }
export type Scalar = string | number | boolean | Principal | Reference
export type FieldValue = Scalar | Scalar[] | null | undefined
export type Values = Record<string, FieldValue>

export interface Field {
  code: string
  title: string
  type?: string
  form?: string
  cardinality?: string
  config?: { format?: string; item_type?: string; item_states?: string[] }
  options?: { id: string; label?: string; order?: number }[]
  transition_only?: boolean
  formula?: unknown
  rollup?: unknown
}

export interface IssueType {
  id: string
  title: string
  process: string
  fields: string[]
  parent_types: (false | string)[]
}

export interface State {
  id: string
  name: string
  require?: string[]
  release_when?: { approvals?: { min: number } }
}

export interface Schema {
  fields: Field[]
  item_types: IssueType[]
  processes: { id: string; initial: string; states: State[] }[]
  relation_types: { id: string; outward: string; inward: string }[]
}

export interface Issue {
  id: string
  key: string
  type: string
  state: string | Record<string, string>
  parent?: string
  visit?: number
  version: number
  values: Values
  value_states: Record<string, string>
  gate?: {
    can_approve: boolean
    approvals: { principal: Principal; decision: string }[]
  }
}

export interface Transition { id: string; name: string; to: string; require: string[]; region?: string }
export interface Detail {
  item: Issue
  access: BoardAccess
  field_edit?: Record<string, 'editable' | 'read_only' | 'field_denied'>
  transitions?: Transition[]
}

export type QueryCursor = string | Record<string, unknown>
export interface ItemPage { items: Issue[]; after?: QueryCursor; incomplete?: boolean; reindexing?: boolean }
export interface Comment { id: string; body: string; author: string; created_at: string }
export type LinkEndpoint = (Reference & { board: string }) | { unavailable: true }
export interface Link { type: string; source: LinkEndpoint; target: LinkEndpoint }
export interface History {
  seq: number
  n: number
  kind: string
  actor: string
  at: string
  field?: string
  before?: FieldValue
  after?: FieldValue
}
export interface Finding { code?: string; message?: string; field?: string }
export interface Outcome { status: string; item?: string; rolled_back?: boolean; findings?: Finding[] }
export interface WriteResult { applied: boolean; outcomes: Outcome[]; seq?: number; as_of?: number }
export interface Operation { op: string; [key: string]: unknown }
