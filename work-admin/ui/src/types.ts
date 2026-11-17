// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Principal } from './principals'
export type ComponentProps = Record<string, unknown>
export type Values = Record<string, unknown>
export interface BoardAccess { read: boolean; write: boolean; admin: boolean }
export interface BoardRow { board_id: string; title: string; description?: string; icon?: string; key_prefix?: string; item_count?: number; open_count?: number; generation?: number; status?: string; access?: BoardAccess }
export interface Option { id: string; label?: string; order?: number; color?: string; category?: string }
export type Holder = { group: string } | { user: string } | { service: string } | { field: string }
export type FieldForm = 'text' | 'int' | 'dec' | 'quantity' | 'bool' | 'time' | 'ref' | 'record'
export interface Field {
  id?: number; code: string; title?: string; type?: string; form: FieldForm; cardinality?: string; options?: Option[]
  config?: { scale?: number; target?: string; format?: string; units?: Record<string, string>; canonical?: string; [key: string]: unknown }
  access?: { read?: Holder[]; write?: Holder[] }; index?: string; track?: boolean; intervals?: boolean; expression?: string; of?: string; fn?: string; field?: string; by?: 'rank' | 'time'; where?: unknown
}
export interface ItemType { id: string; title?: string; process: string; fields: string[]; parent_types?: string[]; inherit?: string[]; move_children?: string }
export type PrincipalSource = { group: string } | { field: string } | Principal[]
export interface State { id: string; name?: string; category: string; kind?: string; awaiting?: PrincipalSource; regions?: { id: string; initial: string }[]; join?: string | number; run?: { stage: string; timeout?: string; max_visits?: number; on_exhausted?: string; on_pass?: string; on_cancel?: string; retry?: { max: number; backoff: string }; on_fail?: string }; release_when?: { approvals?: { min: number; from: PrincipalSource; prevent_self?: boolean }; wait?: string; when?: unknown }; timers?: Timer[]; assign?: { kind: string; id: string }[]; require?: string[]; invariants?: string[]; due?: string }
export interface Transition { id: string; name?: string; to: string; from: string[] | 'any'; auto?: boolean; require?: string[]; default?: boolean; order?: number; set?: { field: string; value?: unknown; clear?: boolean; copy?: string }[]; when?: unknown; guards?: string[] }
export interface Process { id: string; name?: string; initial: string; generation?: number; states: State[]; transitions?: Transition[]; migration?: string; map?: Record<string, string> }
export interface Declaration {
  key_prefix?: string; fields?: Field[]; item_types?: ItemType[]; processes?: Process[]
  relation_types?: { id: string; outward?: string; inward?: string; cardinality?: string; symmetric?: boolean }[]
  plugins?: { use: string }[]; scopes?: string[]; visibility?: { field: string; levels: { id: string; holders: Holder[] }[]; bypass?: string }; remove?: Partial<Record<'fields' | 'item_types' | 'processes' | 'relation_types', string[]>>
  policy?: { comments_per_item?: number; stage_timeout?: string; stage_max_visits?: number; wip?: Record<string, { limit: number; hard?: boolean }>; audit?: string; audit_days?: number; trash_days?: number; tombstone_days?: number; interval_days?: number }
}
export interface Schema { pack?: { id: string; version: string; digest: string }; outdated?: boolean; declaration: Declaration; compiled: Declaration; key_prefix: string; generation: number; as_of: number; migration_error?: string; plugins?: PluginState[] }
export interface EligibleTransition { id: string; name: string; to: string; region?: string; require: string[] }
export interface Awaiting { since: string; by?: string; can_act: boolean }
export interface Gate { entered_by: Principal; entered_at: string; can_approve: boolean; approvals: { principal: Principal; decision: string; at: string }[] }
export interface Item {
  id: string; key: string; type: string; state: string | Record<string, string>; category: string
  version: number; process_generation: number; visit: number; parent?: string; rank?: string
  awaiting?: Awaiting
  gate?: Gate
  values: Values; value_states: Record<string, string>; transitions?: EligibleTransition[]; findings?: Finding[]
}
export interface StageRun { visit: number; attempt: number; state: string; outcome?: string; flow_run?: string; started_at: string; finished_at?: string; outputs?: Record<string, unknown>; progress?: Record<string, unknown> }
export interface GetResult { stage_runs?: StageRun[]; item: Item; transitions?: EligibleTransition[]; as_of: number }
export interface Cursor { id: string; v?: string | number | boolean; keys?: { v?: string | number | boolean }[] }
export interface Group { field: string; value?: unknown; count: number; items: Item[]; after?: Cursor; groups?: Group[] }
export interface Query {
  where?: Values; group_by?: string; sub_group_by?: string; order?: { field: string; dir?: string } | { field: string; dir?: string }[]
  limit?: number; after?: Cursor; include?: string[]; scopes?: { id: string; where: Values }[]
}
export interface QueryResult { items: Item[]; groups?: Group[]; after?: Cursor; as_of: number; reindexing: boolean; incomplete?: boolean }
export interface Finding { code: string; message?: string; field?: string }
export interface PluginOption extends PluginState { title?: string; description?: string; config_schema: Record<string, unknown> }
export interface AdminOptions { access: BoardAccess; schema_options: { plugins: PluginOption[] }; installed_types?: { id: string; title: string }[] }
export const emptyOptions = (): AdminOptions => ({ access: { read: false, write: false, admin: false }, schema_options: { plugins: [] } })

export interface Timer { id: string; after?: string; at_field?: string; by?: string; table?: Record<string, string>; repeat?: string; interrupting?: boolean; then?: { emit?: string; transition?: string } }
export interface PluginProjection { last_seq: number; parked: boolean; bootstrapping: boolean; error?: string | { message: string; kind?: string; code?: string } }
export interface PluginState { plugin: string; installed: boolean; active: boolean; config?: Record<string, unknown>; attachment_id?: string; requires: string[]; tools: string[]; lifecycle: { state: 'pending' | 'ready' | 'failed'; error?: { kind: string; code?: string; message: string } }; projections: Record<string, PluginProjection>; problem?: { code: string; message: string; field?: string }; outdated?: boolean }
