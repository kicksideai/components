-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
-- Read shapes: requests as callers send them and the views reads answer.
local domain = require("domain")

type Json = domain.Json
type JsonObject = domain.JsonObject
type Declaration = domain.Declaration

-- Count counts the matches up to cap + 1, before any page or cursor applies.
type Count = { statement: string, args: { unknown }, cap: integer, beyond: string?, beyond_args: { unknown }? }
-- Plan is the built page statement and its count.
type BoundedPlan = { scans: { sql.SelectBuilder }, scan: integer, dialect: string, order: { domain.Sort },
    statement: (sql.SelectBuilder, integer, integer) -> (string, { unknown }) }
type MeasureColumn = { id: string, scale: integer, decimal_key: boolean }
type GroupSeek = (boolean, GroupKey?, string?, integer) -> (string, { unknown })
type Plan = { group_seek: GroupSeek?, bounded: BoundedPlan?, query: sql.SelectBuilder, tails: { sql.SelectBuilder },
    count: Count?, groups: integer, measures: { MeasureColumn }?, take: integer }
type ReadStamp = { as_of: integer?, generation: integer? }
type PluginSelection = ReadStamp & { state: domain.PluginState }
type PluginAdmission = { state: domain.PluginState, manifest: domain.Plugin, config: JsonObject }
type PluginOptions = ReadStamp & { plugins: { domain.PluginView }, field_types: { domain.FieldTypeOption } }
type PluginContext = { attachment_id: string?, interface_version: integer, config: JsonObject?, lifecycle: domain.PluginLifecycle, projections: { [string]: domain.PluginProjectionState } }
type PluginContextRequest = { board_id: string, plugin: string }
type PluginFeedRequest = PluginContextRequest & { kind: string, token: string? }
type PluginFeed = { attachment_id: string, config: JsonObject, bootstrap: boolean, reset: boolean, generation: integer, changes: { ChangeItem }, token: string, done: boolean }
type SchemaGetRequest = { budget: ReadBudget?, board_id: string, generation: integer?, check_plugins: boolean? }
type SchemaPlugin = domain.PluginView
type SchemaView = ReadStamp & { pack: JsonObject?, outdated: boolean?, plugins: { SchemaPlugin }?, declaration: Declaration, compiled: JsonObject, digest: string, key_prefix: string, migration_error: string? }
type ItemRef = { id: string?, key: string? }
type GetRequest = { budget: ReadBudget?, board_id: string?, item: ItemRef, include: { string }?, min_seq: integer? }
type ApprovalView = { principal: domain.PrincipalDecl, decision: string, at: string }
type GateView = { entered_by: domain.PrincipalDecl, entered_at: string, approvals: { ApprovalView }, can_approve: boolean }
type AwaitingView = { since: string, by: string?, can_act: boolean, principals: { domain.PrincipalDecl }? }
type ItemView = { board_id: string,
    id: string, key: string, type: string, state: string | { [string]: string }, category: string, visit: integer, process_generation: integer, version: integer, parent: string?, life: string,
    awaiting: AwaitingView?, gate: GateView?, findings: { domain.Finding }?, transitions: { TransitionView }?, rank: string?, value_states: { [string]: string }, values: { [string]: unknown }, created_seq: integer, updated_seq: integer,
}
type LinkView = { type: string, direction: string, board: string?, item: string?, unavailable: boolean?, at: string }
type CommentView = { id: string, body: string, mentions: { domain.PrincipalDecl }, author: string, version: integer, created_at: string, edited_at: string? }
type StageRun = { retry_at: string?, visit: integer, attempt: integer, state: string, started_at: string, finished_at: string?, outcome: string?, flow_run: string?, outputs: JsonObject?, progress: JsonObject? }
type StageRunsRequest = { budget: ReadBudget?, board_id: string, item: ItemRef, after: string?, limit: integer?, min_seq: integer? }
type StageRunsResult = ReadStamp & { stage_runs: { StageRun }, after: string? }
type TransitionView = { id: string, name: string, to: string, require: { string }, region: string? }
type GetResult = ReadStamp & {
    title: string?, description: string?, icon: string?,
    access: domain.BoardAccess,
    field_edit: { [string]: domain.FieldEdit }?,
    stage_runs: { StageRun }?,
    item: ItemView, links: { LinkView }?, children: { ItemView }?, comments: { CommentView }?, transitions: { TransitionView }?,
}
type ChangesCursor = { floor: integer?, access: string?, seq: integer, item_id: string, position: string? }
type ChangesRequest = { budget: ReadBudget?, selection: domain.Where?, board_id: string, cursor: ChangesCursor?, limit: integer?, min_seq: integer? }
type ChangeItem = { awaiting: AwaitingView?, gate: GateView?, rank: string?,
    item_id: string, op: string, updated_seq: integer, key: string?, type: string?, visit: integer?, process_generation: integer?, state: string | { [string]: string } | nil, category: string?, parent: string?,
    comments_truncated: boolean?, comments: { domain.CommentRow }?, version: integer?, value_states: { [string]: string }?, values: { [string]: unknown }?,
}
type FeedGap = { floor: integer }
type ChangesResult = ReadStamp & { items: { ChangeItem }, next: ChangesCursor, has_more: boolean, gap: FeedGap? }
type HistoryRequest = { budget: ReadBudget?, board_id: string, item: ItemRef?, before: string?, limit: integer?, min_seq: integer?, include: { string }? }
type IntervalView = { field: string, value: unknown, started_at: string, ended_at: string?, duration_ms: integer }
type HistoryEntry = {
    seq: integer, n: integer, subject: string, kind: string, field: string?, before: Json, after: Json, actor: string,
    source: string?, at: string,
}
type HistoryResult = ReadStamp & { entries: { HistoryEntry }, next: string?, intervals: { IntervalView }? }
type TimeInStateRequest = { budget: ReadBudget?, after: integer?, board_id: string, item: ItemRef, field: string?, min_seq: integer? }
type TimeInStateResult = ReadStamp & { after: integer?, field: string, periods: { IntervalView }, totals: { [string]: integer } }

type Order = domain.Sort | { domain.Sort }
type ReferenceOrder = { after: domain.Cursor?, admission: string }
type BoardSelection = { string } | string
type BoardAdmission = { generation: integer, digest: string, caller: domain.AccessCaller? }
type CrossAdmission = { ids: { string }, boards: { [string]: BoardAdmission }, sort: domain.Sort, reference: boolean }
type CrossCursor = { id: string, boards: { [string]: domain.Cursor }, frontiers: { [string]: domain.Cursor | boolean }, selection: { string } }
type QueryPage = ReadStamp & { incomplete: boolean?, group_limited: boolean?, scanned: integer?, groups: { QueryGroup }?, group_after: string?, items: { ItemView }, cursors: { domain.Cursor }, following: domain.Cursor?, after: domain.Cursor?, reindexing: boolean }
type ReadBudget = { rows: integer?, deadline: string? }
type ReadAllowance = { rows: integer, remaining: integer, deadline: domain.Deadline }
type QueryRequest = { budget: ReadBudget?, include: { string }?, group_by: string?, sub_group_by: string?, group_after: string?, group_limit: integer?, measures: { domain.Measure }?, boards: BoardSelection?, cross_after: CrossCursor?, board_id: string, where: domain.Where?, scopes: { domain.ScopeQuery }?, order: Order?, after: domain.Cursor?, limit: integer?, min_seq: integer?, include_trashed: boolean? }
type MeasureValue = string | number
type QueryGroupRow = { field: string, value: unknown, count: integer, items: { ItemView }, after: domain.Cursor?, measures: { [string]: MeasureValue }? }
type QueryGroup = QueryGroupRow & { groups: { QueryGroupRow }? }
type GroupKey = string | integer
type GroupPosition = { parent: GroupKey?, child: GroupKey? }
type GroupBucket = { key: GroupKey?, count: integer, rows: { domain.Row }, totals: { [integer]: string }?, children: { GroupBucket }? }
type GroupPage = { buckets: { GroupBucket }?, after: string?, limited: boolean, scanned: integer }
type CrossCandidate = { board: string, index: integer, key: domain.Cursor, item: ItemView }
type QueryResult = ReadStamp & { incomplete: boolean?, group_limited: boolean?, groups: { QueryGroup }?, group_after: string?, positions: { [string]: ReadStamp }?, cross_after: CrossCursor?, items: { ItemView }, after: domain.Cursor?, reindexing: boolean }
type EditMember = { item_id: string, version: integer }
type EditSelection = ReadStamp & { members: { EditMember }, over_limit: boolean? }
type CountResult = ReadStamp & { incomplete: boolean?, total: integer?, estimated: boolean?, reindexing: boolean }

-- Link continuations are opaque and bound to the board and selector.
type LinksRequest = { budget: ReadBudget?, board_id: string, item: ItemRef?, target: domain.Target?, direction: string?, after: string?, limit: integer?, min_seq: integer? }
type LinkPeer = { board: string?, item: string?, unavailable: boolean? }
type RelationView = { type: string, source: LinkPeer, target: LinkPeer, at: string }
type LinksResult = ReadStamp & { links: { RelationView }, after: string? }
type CommentsRequest = { budget: ReadBudget?, board_id: string, item: ItemRef, after: string?, limit: integer?, min_seq: integer? }
type CommentsResult = ReadStamp & { comments: { CommentView }, after: string? }
type BudgetUsage = { rows_scanned: integer, rows_remaining: integer, deadline_remaining_ms: integer }
type ExplainResult = ReadStamp & { access: domain.BoardAccess, budget: BudgetUsage?, plan: { statement: string, args: { unknown }, indexes: { string } }, scopes: { string }, visibility: { life: boolean } }

type Executor = sql.DB | sql.Transaction

type PrincipalResult = domain.AccessCaller | boolean
type ReadContext = { partial: boolean?, allowance: ReadAllowance?, admitted: { [string]: boolean }, holders: { [string]: boolean }, caller: domain.AccessCaller? }
type PageCheck = (domain.Board) -> error?

type Snapshot<T> = (Executor, domain.Board, string) -> (T?, error?)
type SnapshotPreparation = (domain.Board) -> error?


type Redactor = (string, unknown) -> (unknown, error?)

type TransitionCandidate = { item: domain.Item, root: domain.Item, transition: domain.Transition, region: string? }
type TransitionGroup = { candidates: { TransitionCandidate }, items: { domain.Item }, where: unknown, require: { string },
    model: domain.Model, process: domain.Process }
return { AwaitingView = AwaitingView, GateView = GateView, ApprovalView = ApprovalView, StageRun = StageRun, StageRunsRequest = StageRunsRequest, StageRunsResult = StageRunsResult, JsonObject = JsonObject, PluginFeedRequest = PluginFeedRequest, PluginFeed = PluginFeed, PluginContext = PluginContext, PluginSelection = PluginSelection, PluginAdmission = PluginAdmission, PluginOptions = PluginOptions, PluginContextRequest = PluginContextRequest, TransitionCandidate = TransitionCandidate, TransitionGroup = TransitionGroup, Redactor = Redactor, BudgetUsage = BudgetUsage, ReadBudget = ReadBudget, ReadAllowance = ReadAllowance, SchemaPlugin = SchemaPlugin, QueryGroupRow = QueryGroupRow, QueryGroup = QueryGroup,
    Count = Count, Plan = Plan, BoundedPlan = BoundedPlan, MeasureColumn = MeasureColumn, MeasureValue = MeasureValue,
    GroupKey = GroupKey, GroupSeek = GroupSeek, GroupPosition = GroupPosition, GroupBucket = GroupBucket, GroupPage = GroupPage,
    CrossCandidate = CrossCandidate,
    ReferenceOrder = ReferenceOrder, BoardSelection = BoardSelection, BoardAdmission = BoardAdmission,
    CrossAdmission = CrossAdmission, CrossCursor = CrossCursor, QueryPage = QueryPage,
    LinksRequest = LinksRequest, LinkPeer = LinkPeer, RelationView = RelationView, LinksResult = LinksResult,
    CommentsRequest = CommentsRequest, CommentsResult = CommentsResult, ExplainResult = ExplainResult,
    Snapshot = Snapshot, SnapshotPreparation = SnapshotPreparation, PrincipalResult = PrincipalResult, ReadContext = ReadContext, PageCheck = PageCheck,
    Executor = Executor,
    Order = Order, QueryRequest = QueryRequest, QueryResult = QueryResult, CountResult = CountResult,
    EditMember = EditMember, EditSelection = EditSelection, ReadStamp = ReadStamp, SchemaGetRequest = SchemaGetRequest, SchemaView = SchemaView, ItemRef = ItemRef, GetRequest = GetRequest,
    ItemView = ItemView, LinkView = LinkView, CommentView = CommentView, GetResult = GetResult, ChangesCursor = ChangesCursor,
    ChangesRequest = ChangesRequest, ChangeItem = ChangeItem, FeedGap = FeedGap, ChangesResult = ChangesResult,
    HistoryRequest = HistoryRequest, HistoryEntry = HistoryEntry, HistoryResult = HistoryResult, TransitionView = TransitionView,
    IntervalView = IntervalView, TimeInStateRequest = TimeInStateRequest, TimeInStateResult = TimeInStateResult,
}
