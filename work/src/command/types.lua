-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local reads = require("reads")
local sql = require("sql")
-- Command and read shapes: requests as callers send them, outcomes, plans and results.
local domain = require("domain")

type Json = domain.Json
type JsonObject = domain.JsonObject
type Declaration = domain.Declaration
type SchemaChange = domain.SchemaChange
type Event = domain.Event
type Item = domain.Item

-- Requests. The contract's input schema checks their shape at the service
-- boundary; the planner checks their meaning.
type TargetRef = { board: string?, item: string?, kind: string?, id: string? }
type Op = {
    moved_from: domain.Target?, operation_id: string?,
    visit: integer?, attempt: integer?, outcome: string?, outputs: domain.JsonObject?, progress: domain.JsonObject?, decision: string?, timer: string?, scheduled_at: string?, force: boolean?,
    op: string, type: string?, parent: string | boolean | nil, values: { [string]: unknown }?, clear: { string }?, unset: { string }?,
    region: string?, state: string?, item: string?, expect_version: integer?, transition: string?, target: TargetRef?, comment: string?,
    body: string?, delete: boolean?, mentions: unknown, after: unknown, before: unknown,
}
type ApplyRequest = { trace_context: domain.TraceContext?, board_id: string, key: string?, mode: string?, ops: { Op }, source: string?, origin: JsonObject? }
type SchemaRequest = { pack: JsonObject?, trace_context: domain.TraceContext?, plugin_configs: { [string]: JsonObject }?, board_id: string, declaration: Declaration, expected_generation: integer?, key: string?, source: string?, origin: JsonObject? }
type UpdateRequest = { board_id: string, title: string?, description: string?, icon: string?, key_prefix: string? }
type UpdateResult = { board_id: string, status: string, seq: integer?, as_of: integer? }
type CreateRequest = { pack: string?, version: string?, starter: boolean?, trace_context: domain.TraceContext?, plugin_configs: { [string]: JsonObject }?, idempotency_key: string, title: string?, parent_id: string?, declaration: Declaration? }

type SchemaSnapshot = { board: domain.Board?, declaration: Declaration? }

type SchemaPlan = {
    generation: integer, class: string, changes: { SchemaChange }, refused: { SchemaChange },
    maps: domain.StateMaps, declaration: Declaration, compiled: domain.Compiled, digest: string,
    unchanged: boolean, claim: boolean, migrates: boolean,
}

-- Results. A status is applied, unchanged, conflict, invalid, denied or unavailable.
type Finding = domain.Finding
type Outcome = {
    op: integer, status: string, item: string?, key: string?, version: integer?, comment: string?, findings: { Finding }?,
    rolled_back: boolean?,
}
type ApplyResult = { outcomes: { Outcome }, applied: boolean, seq: integer?, as_of: integer?, replayed: boolean? }
type SchemaResult = { generation: integer, class: string, changes: { SchemaChange }, seq: integer?, as_of: integer?, replayed: boolean? }
type SchemaPlanResult = { generation: integer, class: string, changes: { SchemaChange }, refused: { SchemaChange }, migration: string? }
type ResumeMigrationRequest = { board_id: string }
type ResumeMigrationResult = { resumed: boolean, job_id: string }
type CreateResult = { board_id: string, title: string, generation: integer?, replayed: boolean }
type BoardSummary = {
    access: domain.BoardAccess,
    board_id: string, title: string, description: string, icon: string, key_prefix: string?, item_count: integer?, open_count: integer?, completed_count: integer?, trashed_count: integer?, generation: integer?, status: string?,
}
type ListRequest = { limit: integer?, after: integer? }
type ListResult = { boards: { BoardSummary }, next: integer? }

-- OpPlan is the planned result of one op: its status, the events it appends and
-- the write group they join. Ops of one group share one write and one expect.
type OpPlan = {
    status: string, events: { Event }, group: string, item: string?, comment: string?, version: integer?, findings: { Finding }?,
    guards: { [string]: integer }?, expected: integer?, head: integer?,
}
-- Write is one append: the events of a group and the subject version it expects, on the
-- board thread unless thread_id names another.
type Write = domain.Write
type Planned = { plans: { OpPlan }, writes: { Write }, ok: boolean }

type PrepareContext = {
    importing: boolean?,
    auto: domain.AutoBudget,
    db: sql.DB | sql.Transaction, dialect: string, board: domain.Board, items: { [string]: domain.Item }, base: { [string]: integer },
    peer_boards: { [string]: domain.Board }?,
    comments: { [string]: domain.CommentRow }, comment_base: { [string]: integer }, links: { [string]: boolean },
    head_guard: integer?, child_delta: { [string]: integer }, moves: { PathMove }, access: { [string]: boolean }, actor: string, now: string,
}

type PathMove = domain.PathMove
type SubtreeStats = domain.SubtreeStats

type Executor = sql.DB | sql.Transaction

type Durable = { receipt: domain.Receipt, seq: integer }

type ApplyContext = {
    generation: string,
    settings: domain.Policy,
    c: domain.ThreadClient, board_id: string, request: ApplyRequest, ops: { Op }, hashed: string,
    claimed: boolean?, base: string?, until_at: domain.Deadline, source: string,
}

type ConfigureSelection = { schema_version: integer?, as_of: integer?, generation: integer?, plugin: domain.PluginState }
type ConfigureRequest = { trace_context: domain.TraceContext?, board_id: string, plugin: string, config: domain.JsonObject }
type ConfigureResult = { attachment_id: string, seq: integer?, as_of: integer? }

type Map = { [string]: unknown }
type BulkRequest = { board_id: string, key: string, query: reads.QueryRequest, ops_template: { Op } }
type Locator = { deadline: string?, board_id: string, operation_id: string?, bulk_id: string?, move_id: string? }
type Owner = { deadline: domain.Deadline?, board_id: string, operation_id: string, kind: string, key: string, request_hash: string,
    actor_id: string, actor_context: string, data: Map, status: string, processed: integer, counts: { [string]: integer }, error_code: string?, job_id: string }
type Status = { bulk_id: string?, move_id: string?, job_id: string, status: string, total: integer, processed: integer,
    applied: integer, unchanged: integer, invalid: integer, denied: integer, conflict: integer, unavailable: integer, error_code: string?, item: string?, items: { string }? }
type MoveMap = { type: { [string]: string }?, state: { [string]: string }?, fields: { [string]: string | boolean }?, relations: { [string]: string }? }
type MoveRequest = { board_id: string, item: string, to_board: string, key: string?, map: MoveMap }
type MoveItem = { from: string, item: string, type: string, state: string, parent: string?, values: Map, clear: { string }, version: integer, old_key: string }
type MoveLink = { item: string, type: string, target: domain.Target }
type MovePlan = { from_board: string?, allowed: boolean, findings: { domain.Finding }, items: { MoveItem }, links: { MoveLink }, source_seq: integer?, target_seq: integer?, to_board: string, item: string?, target_digest: string? }
type Job = { id: string, lease_token: string, execution_seq: integer, deadline: string? }
type Input = { job: Job, payload: Locator }

type ProcessTarget = { model: domain.Model, item: domain.StateItem, definition: domain.Process, state: domain.State }
return { ProcessTarget = ProcessTarget, Map = Map, BulkRequest = BulkRequest, Locator = Locator, Owner = Owner, Status = Status, MoveMap = MoveMap, MoveRequest = MoveRequest, MoveItem = MoveItem, MoveLink = MoveLink, MovePlan = MovePlan, Job = Job, Input = Input, ConfigureSelection = ConfigureSelection, ConfigureRequest = ConfigureRequest, ConfigureResult = ConfigureResult,
    ApplyContext = ApplyContext,
    Durable = Durable,
    Executor = Executor,
    PrepareContext = PrepareContext, PathMove = PathMove, SubtreeStats = SubtreeStats, TargetRef = TargetRef, Op = Op, ApplyRequest = ApplyRequest, SchemaRequest = SchemaRequest, CreateRequest = CreateRequest,
    Finding = Finding, Outcome = Outcome, ApplyResult = ApplyResult, SchemaResult = SchemaResult,
    SchemaSnapshot = SchemaSnapshot, SchemaPlan = SchemaPlan, SchemaPlanResult = SchemaPlanResult, ResumeMigrationRequest = ResumeMigrationRequest, ResumeMigrationResult = ResumeMigrationResult, UpdateRequest = UpdateRequest, UpdateResult = UpdateResult, CreateResult = CreateResult, BoardSummary = BoardSummary, ListRequest = ListRequest, ListResult = ListResult,
    OpPlan = OpPlan, Write = Write, Planned = Planned,
}
