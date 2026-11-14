-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Shared work types: values, declarations, the compiled model, rows, events and
-- the shapes the fold and the commands exchange. Values that cross a boundary
-- (requests, decoded JSON, registry meta) enter as unknown and are narrowed
-- before use.
local sql = require("sql")

-- JSON documents as decoded or encoded.
type Json = nil | boolean | number | string | { Json } | { [string]: Json }
type JsonObject = { [string]: Json }

-- SQL parameter lists and result rows; rows are narrowed field by field.
type SqlParams = { unknown }
type Row = { [string]: unknown }

-- Canonical values. The field's form gives which variant a value holds.
type Dec = { m: integer, e: integer }
type Quantity = { v: Dec, u: string }
type Ref = { ref: { string } }
type Record = { [string]: Value }
type Scalar = string | integer | boolean | Dec | Quantity | Ref | Record
type Value = Scalar | { Scalar }

-- Field configuration a form reads: decimal scale and range, text case and
-- pattern, reference target, record members, quantity units and currency.
type FieldConfig = {
    scale: integer?, range: { integer }?, case: string?, target: string?, members: { [string]: MemberSpec }?,
    units: { [string]: string }?, canonical: string?, currency: string?, pattern: string?, format: string?,
}
type MemberSpec = FieldConfig & { form: string, cardinality: string? }
-- ValueShape is what normalizing a value needs: its form, cardinality and config.
type ValueShape = { form: string, cardinality: string, config: FieldConfig }

-- One instant, as the RFC3339 text the threads contract takes and as nanoseconds for local checks.
type Deadline = { at: string, ns: integer }

-- The Core threads contract as boards use it.
type ThreadRequest = { [string]: unknown }
type ThreadClient = {
    find: (self: ThreadClient, request: ThreadRequest) -> (unknown, error?),
    create: (self: ThreadClient, request: ThreadRequest) -> (unknown, error?),
    catch_up_projection: (self: ThreadClient, request: ThreadRequest) -> (unknown, error?),
    find_event_by_external: (self: ThreadClient, request: ThreadRequest) -> (unknown, error?),
    list_projections: (self: ThreadClient, request: ThreadRequest) -> (unknown, error?),
    register_projection: (self: ThreadClient, request: ThreadRequest) -> (unknown, error?),
    remove_projection: (self: ThreadClient, request: ThreadRequest) -> (unknown, error?),
    get_projection_cursor: (self: ThreadClient, request: ThreadRequest) -> (unknown, error?),
    append_events: (self: ThreadClient, request: ThreadRequest) -> (unknown, error?),
}
-- last_seq is the cursor position once done; it is set only once done.
type CatchUp = { done: boolean, last_seq: integer? }
-- ThreadExpect is the append guard: the thread head or one subject's version.
type ThreadExpect = { head: integer } | { subject: string, version: integer }
type ThreadMarker = { seq: integer, body: unknown }

-- Generated tables, one set per board. A layout column holds one indexed field: key
-- and number columns hold a value's key or order value.
type ColumnValue = string | integer | boolean
type LayoutColumn = { field_id: integer, kind: string, column: string }
type Layout = { columns: { LayoutColumn }, sets: { LayoutColumn } }
-- System columns every generated row keeps (kind text or int).
type SystemColumn = { name: string, kind: string }
type GeneratedNames = { base: string, item: string, set: string }
type GeneratedTable = { names: GeneratedNames, layout: Layout, system: { SystemColumn }, indexes: { { string } }, relations: { [string]: Relation } }
-- IndexRow is one item's generated row: system values, index values by column and set keys by column.
type IndexRow = { id: string, system: { [string]: ColumnValue }, values: { [string]: ColumnValue }, sets: { [string]: { string } } }

-- Queries. A reader is a caller admitted to read one board; allows answers whether it
-- holds an access level (read, write, admin) there; actor is who it reads as, for $actor operands.
type Reader = { awaiting: ((string) -> (Condition?, error?))?, search: { string }?, board_id: string, actor: string?, plugins: { PluginDecl }?, allows: (string) -> boolean }
-- Where is a filter tree as requested; kickside.work.domain:filter reads it.
type Where = { [string]: unknown }
type Sort = { field: string, ctx: { [string]: string }?, dir: string? }
type Cursor = { id: string, v: ColumnValue?, keys: { { v: ColumnValue? } }? }
type ItemQuery = { scan: integer?, groups: { string }?, sorts: { Sort }?, where: Where?, after: Cursor?, count: integer? }
-- ColumnTarget is the generated column a filter or sort names: the value shape normalizes
-- request values, coerce maps a request shorthand onto the canonical form first, and
-- field_id names the field in the change table.
type Memberships = { [string]: { [string]: boolean } }
type ColumnTarget = { principal: boolean?, memberships: Memberships?, column: string, kind: string, set: boolean, shape: ValueShape, coerce: ((unknown) -> (unknown, error?))?, field_id: integer?, state_column: string?, order: ColumnTarget?, intervals: boolean? }
type Resolver = (string, { [string]: string }?) -> (ColumnTarget?, error?)
-- Condition is compiled SQL and its arguments in placeholder order, over alias i (generated row) and r (item row).
type Condition = { sql: string, args: { unknown } }
-- FilterEnvironment is what a filter tree compiles against; FilterCompilation adds the
-- leaves and values the tree may still use and the row it stands on.
type FilterEnvironment = { reader: Reader, item_table: string, set_table: string, position: string, relations: { [string]: Relation }, resolve: Resolver }
type FilterCompilation = {
    reader: Reader, item_table: string, set_table: string, position: string, relations: { [string]: Relation }, resolve: Resolver,
    leaves: integer, values: integer, alias: string, hop: integer,
}
-- RelationScope is what the tree hands a relation condition; nested compiles a node with the target row as its alias.
type RelationScope = { reader: Reader, alias: string, hop: integer, item_table: string, relations: { [string]: Relation }, nested: (unknown, string) -> (Condition?, error?) }
-- HistoryAsked is a history condition as parsed: the field and what is asked of it.
type HistoryAsked = { target: ColumnTarget, by: string?, from: string?, to: string?, held: string?, before: string?, after: string? }

-- Scopes: declarative filters over plugin tables in the board database.
type ScopeFilter = { column: string, type: string, ops: { [string]: boolean } }
type Scope = { id: string, table: string, board_column: string, item_column: string, filters: { [string]: ScopeFilter }, access: string }
type ScopeQuery = { id: string, where: { [string]: { [string]: unknown } } }
-- AdmittedScope is a scope query whose scope the reader's access allows.
type AdmittedScope = { scope: Scope, where: { [string]: { [string]: unknown } } }

-- Where a plugin's schema fragment comes from: a static template in the manifest or a
-- kickside.work:schema_provider binding.
type PluginSchemaSource = { template: JsonObject?, provider: string? }
-- A resolved fragment as the board stores it, with the provider's version and its digest.
type PluginSchema = { fragment: JsonObject, version: string?, digest: string }
-- What a provider resolves against: the board, the plugin's effective config and the copy the board holds.
type ResolveContext = { board_id: string, config: JsonObject, current: PluginSchema? }
-- Plugin is a loaded manifest.
type PluginProjection = { kind: string, worker_ref: string, input: string, revision: integer, events: { string } }
type PluginError = { kind: string, code: string?, message: string }
type PluginProblem = { code: string, message: string, field: string? }
type PluginLifecycle = { state: string, error: PluginError? }
type PluginProjectionState = { last_seq: integer, parked: boolean, bootstrapping: boolean, error: unknown? }
type PluginView = { plugin: string, title: string?, description: string?, icon: string?, installed: boolean, active: boolean,
    attachment_id: string?, config: JsonObject?, config_schema: JsonObject?, requires: { string }, tools: { string },
    lifecycle: PluginLifecycle, projections: { [string]: PluginProjectionState }, problem: PluginProblem?,
    version: string?, digest: string?, outdated: boolean? }
type Plugin = { tools: { string }, projections: { PluginProjection }, id: string, title: string?, description: string?, icon: string?, settings: string?, attachment: string?, config_schema: JsonObject, schema: PluginSchemaSource?, requires: { string }, seams: { string } }
-- ProviderResult is what a schema_provider binding answers.
type ProviderResult = { fragment: JsonObject, version: string? }
type Provider = { resolve: (self: Provider, request: JsonObject) -> (unknown, error?) }
-- FieldType is what a kickside.work.type entry declares.
type FieldType = { form: string, indexes: { string }?, config_schema: JsonObject? }

-- Finding names why an op or a transition is refused: a stable code, the message and the field it concerns.
type WorkingState = { items: { [string]: Item }, links: { [string]: boolean } }
type WhenCheck = (Item, unknown) -> (boolean, error?)

type Finding = { code: string, message: string, field: string? }

-- Declarations as callers send them. The contract's input schema checks their
-- shape at the service boundary; compile checks their meaning.
type OptionDecl = { id: string, label: string?, color: string?, order: integer?, category: string? }
type Holder = { group: string?, user: string?, service: string?, field: string? }
type FieldAccess = { read: { Holder }?, write: { Holder }? }
type Visibility = { field: string, levels: { { id: string, holders: { Holder } } }, bypass: string? }
type AccessCaller = { principal: PrincipalDecl, groups: { [string]: boolean }, admin: boolean }
type FieldDecl = {
    access: FieldAccess?, id: integer?, code: string, title: string?, type: string?, form: string?, cardinality: string?, options: { OptionDecl }?,
    config: FieldConfig?, index: string?, track: boolean?, intervals: boolean?,
    expression: string?, of: string?, fn: string?, field: string?, by: string?, where: unknown,
}
type ItemTypeDecl = {
    move_children: string?,
    id: string, title: string?, process: string, parent_types: { string }?, fields: { string }?, inherit: { string }?,
}
type RelationDecl = { id: string, outward: string?, inward: string?, cardinality: string?, symmetric: boolean? }
type PrincipalDecl = { kind: string, id: string }
type TimerEffect = { emit: string?, transition: string? }
type Timer = { id: string, after: string?, at_field: string?, by: string?, table: { [string]: string }?, interrupting: boolean? } & { [string]: unknown }
type PrincipalSource = { PrincipalDecl } | { group: string } | { field: string }
type Approvals = { min: integer, from: PrincipalSource, prevent_self: boolean? }
type Release = { approvals: Approvals?, wait: string?, when: unknown }
type Stage = { stage: string, timeout: string?, max_visits: integer?, on_exhausted: string?, retry: { max: integer, backoff: string }?, on_fail: string?, on_pass: string?, on_cancel: string? }
type Region = { id: string, initial: string }
type Wip = { [string]: { limit: integer, hard: boolean? } }
type StateDecl = {
    id: string, name: string?, category: string, kind: string?, awaiting: PrincipalSource?, stage: string?, assign: { PrincipalDecl }?, require: { string }?, invariants: { string }?, due: string?, timers: { Timer }?, run: Stage?, release_when: Release?, regions: { Region }?, join: string | integer | nil,
}
type EffectDecl = { field: string, value: unknown, clear: boolean?, copy: string? }
type TransitionDecl = {
    id: string, name: string?, from: unknown, to: string, require: { string }?, set: { EffectDecl }?, auto: boolean?, people: boolean?, order: integer?,
    default: boolean?, when: unknown, guards: { string }?,
}
type ProcessDecl = {
    id: string, name: string?, states: { StateDecl }, initial: string?, transitions: { TransitionDecl }?, migration: string?,
    map: { [string]: string }?,
}
type PolicyDecl = { stage_timeout: string?, stage_max_visits: integer?, wip: Wip?, audit: string?, audit_days: integer?, trash_days: integer?, tombstone_days: integer?, interval_days: integer? }
type PluginOwners = { [string]: { [string]: string } }
type PluginDecl = { schema: PluginSchema?, use: string, attachment_kind: string?, attachment_id: string? }
type PluginProgress = { projection_after: string?, scanned: boolean?, registered: integer? }
type PluginState = { plugin: string, attachment_id: string, impl_id: string, config: JsonObject, active: boolean, revision: integer, applied_revision: integer, lifecycle: PluginLifecycle, progress: PluginProgress? }
type StateMaps = { [string]: { [string]: string } }
type RemoveDecl = { fields: { string }?, item_types: { string }?, processes: { string }?, relation_types: { string }? }
type Declaration = {
    visibility: Visibility?, key_prefix: string?, fields: { FieldDecl }?, item_types: { ItemTypeDecl }?, relation_types: { RelationDecl }?,
    processes: { ProcessDecl }?, plugins: { PluginDecl }?, scopes: { string }?, policy: PolicyDecl?, remove: RemoveDecl?,
}

-- The compiled model: what a stored declaration means. Field ids are stable
-- across renames; next_field_id is the next id to hand out.
type Option = { id: string, label: string, color: string?, order: integer, category: string? }
type Rollup = { of: string, fn: string, field: integer?, by: string?, where: unknown, reads: { integer } }
type RecomputeRange = { after: string, through: string, generation: integer }
type Field = {
    plugin: string?,
    id: integer, code: string, title: string?, type: string, form: string, cardinality: string, config: FieldConfig,
    formula: { expression: string, depends: { integer } }?, access: FieldAccess?, rollup: Rollup?, options: { Option }?, index: string, track: boolean, intervals: boolean,
}
type ItemType = { move_children: string?, plugin: string?, id: string, title: string, process: string, parent_types: { string }, fields: { string }, inherit: { string } }
type Relation = { plugin: string?, id: string, outward: string, inward: string, cardinality: string, symmetric: boolean }
type State = {
    id: string, name: string, category: string, kind: string, awaiting: PrincipalSource?, stage: string?, assign: { PrincipalDecl }, require: { string }, invariants: { string }?, due: string?, timers: { Timer }?, run: Stage?, release_when: Release?, regions: { Region }?, join: string | integer | nil,
}
-- Effect op is literal, actor, now, clear or copy; value holds a literal's canonical value, from the copied field.
type Effect = { field: string, op: string, value: Value?, from: string? }
type Transition = {
    id: string, name: string, from: { string }, any: boolean, to: string, require: { string }, set: { Effect }, auto: boolean, people: boolean?,
    order: integer, default: boolean, when: unknown, guards: { string }?,
}
-- generation is the board generation that last changed the process definition.
type Process = {
    plugin: string?,
    id: string, name: string, initial: string, migration: string, generation: integer, states: { State }, transitions: { Transition },
}
type Policy = { stage_timeout: string?, stage_max_visits: integer?, wip: Wip?, audit: string, audit_days: integer?, trash_days: integer?, tombstone_days: integer?, interval_days: integer? }
type Compiled = {
    visibility: Visibility?, key_prefix: string, fields: { Field }, item_types: { ItemType }, relation_types: { Relation }, processes: { Process },
    plugins: { PluginDecl }?, scopes: { string }?, policy_overrides: PolicyDecl?, policy: Policy, next_field_id: integer, counter_field: integer?,
}
-- Model indexes a compiled schema by code and id.
type Model = {
    compiled: Compiled, fields: { [string]: Field }, by_id: { [integer]: Field }, item_types: { [string]: ItemType },
    relations: { [string]: Relation }, processes: { [string]: Process },
}

type SchemaChange = { code: string, class: string, what: string, detail: string?, to: string?, count: integer? }
-- states counts the items holding each state, by item type.
type Usage = { fields: { [integer]: integer }, items: integer, types: { [string]: integer }, links: { [string]: integer }, states: { [string]: { [string]: integer } } }

-- Rows.
type Board = { memberships: Memberships?, pack: string?, pack_version: string?, pack_digest: string?, pack_base: JsonObject?, caller_error: error?,
    schema_version: integer?,
    dialect: string?, caller: AccessCaller?, board_id: string, key_prefix: string, generation: integer, compiled: Compiled, model: Model, digest: string,
    applied_seq: integer, counter: integer,
    tombstone_floor_seq: integer, layout: Layout?,
}
type Cell = { p: Value?, c: integer? }
type Document = { [string]: Cell }
type AutoBudget = { steps: integer, chain: { string } }
type StateData = { stage_visit: integer?, visit: integer?, entered_at: string?, entered_by: string?, pending_entry: boolean?, rejected: boolean?, attempt: integer?, waiting: boolean?,
    approvals: { [string]: string }?, wait_done: boolean?, timer_due: { [string]: string }? }
type ProcessData = StateData & { stage_visits: { [string]: integer }?, region_data: { [string]: StateData }?, regions: { [string]: string }? }
type Item = {
    move_id: string?,
    findings: { Finding }?, work: ProcessData?,
    board_id: string, item_id: string, number: integer, type: string, state: string, category: string,
    process_generation: integer, visit: integer, parent_id: string?, path: string, rank: string?, version: integer,
    created_at: string?, updated_at: string?, life: string, life_at: string?, document: Document, created_seq: integer, updated_seq: integer,
}
type StateItem = Item & { root: Item?, region: string? }
type LinkRow = { from_id: string, type: string, to_board_id: string, to_id: string, at: string, seq: integer }
type InboundLink = { board_id: string, from_id: string, type: string, at: string, seq: integer }
type RankRange = { offset: integer, total: integer, direction: string }
type RebalanceState = { offset: integer, total: integer, direction: string }
type CommentRow = {
    comment_id: string, item_id: string, body: string, mentions: { PrincipalDecl }, author: string, version: integer,
    deleted: boolean, created_at: string, edited_at: string?,
}
type IntervalRow = { field_id: string, start_seq: integer, value_key: string, started_at: string, ended_at: string? }
type ChangeRow = {
    seq: integer, n: integer, subject: string, kind: string, field_id: integer?, before: Json, after: Json, actor: string,
    source: string?, origin: JsonObject?, at: string,
}

-- Events. A patch step writes (v), clears or unsets one field; before is the
-- value replaced.
type PatchStep = { f: integer, v: Value?, before: Value?, clear: boolean?, unset: boolean? }
type Target = { board: string, item: string }
type Receipt = { request_hash: string, result: JsonObject }
type EventBody = { pack: JsonObject?,
    title: string?, description: string?, icon: string?,
    operation_id: string?, processed: integer?, total: integer?, status: string?, counts: { [string]: integer }?, moved_from: Target?, moved_to: Target?, old_key: string?,
    region: string?, decision: string?, gate: string?, attempt: integer?, outcome: string?, outputs: JsonObject?, progress: JsonObject?, timer: string?, scheduled_at: string?, emitted: string?, force: boolean?,
    command_key: string?,
    plugin: string?, attachment: string?, config: JsonObject?, audit: string?, actor: string?, at: string?, source: string?, origin: JsonObject?, receipt: Receipt?,
    plugin_configs: { [string]: JsonObject }?, generation: integer?, declaration: Declaration?, compiled: Compiled?, digest: string?, class: string?, changes: { SchemaChange }?,
    item: string?, type: string?, parent: string?, previous: string?, state: string?, patch: { PatchStep }?,
    transition: string?, from: string?, to: string?, visit: integer?, auto: boolean?, from_generation: integer?, to_generation: integer?,
    state_map: { [string]: string }?, maps: StateMaps?, migrates: boolean?,
    recompute: RecomputeRange?, after: string?, before: string?, range: RankRange?, count: integer?,
    target: Target?, comment: string?, body: string?, mentions: { PrincipalDecl }?, prefix: string?, board: string?, claim_version: integer?,
}
type External = { external_source: string, external_id: string }
type TraceContext = { trace_id: string?, run_id: string?, caused_by_event_id: string?, correlation_key: string? }
type Event = { trace_context: TraceContext?, type: string, subject: string, body: EventBody, external: External? }
type RawEvent = { id: string?, trace_context: TraceContext?, seq: unknown, type: string, body: unknown }
type FoldEvent = { id: string?, trace_context: TraceContext?, seq: integer, type: string, body: EventBody }

type FoldResult = { plugin_job: string?, last_seq: integer, reindex_job: string?, migration_job: string?, rebalance_job: string?, recompute_job: string? }
type FoldBatch = { trace_context: TraceContext?,
    intervals: { SqlParams }?, interval_ends: { SqlParams }?, at: string?, times: { [integer]: string }?, cache: { [string]: Item }, dirty: { [string]: boolean }, history: { SqlParams }, rows: integer,
    observed: { [string]: integer }?, affected: { [string]: integer }?, rank_end: string?, written: { [integer]: integer }, board_id: string, usage: { [integer]: integer },
}

type ProjectionRange = { from_seq: integer?, to_seq: integer? }
type ProjectionBody = { [string]: unknown }
type ProjectionInput = {
    thread_id: string?, range: ProjectionRange?, events: { RawEvent }?, projection: { body: ProjectionBody? }?,
}

type BoardAccess = { read: boolean, write: boolean, admin: boolean }

type BoardMeta = { title: string, description: string, icon: string, applied_seq: integer? }
type ComponentMeta = { [string]: unknown }
type ComponentRow = { component_id: string?, impl_id: string?, parent_id: string?, meta: ComponentMeta?, access_level: integer? }

type Write = {
    group: string, thread_id: string?, events: { Event }, ops: { integer }, expect_subject: string?, expect_version: integer?, expect_head: integer?,
    guards: { [string]: integer }?, caller_expect: boolean,
}

type PathMove = { previous: string, path: string }
type SubtreeStats = { size: integer, depth: integer }

type DeleteResult = { success: boolean }


type BoardClient = { [string]: (BoardClient, Row) -> (unknown, error?) }
return { PrincipalSource = PrincipalSource, Memberships = Memberships, Approvals = Approvals, BoardClient = BoardClient, BoardMeta = BoardMeta, BoardAccess = BoardAccess, StateItem = StateItem, AutoBudget = AutoBudget, TimerEffect = TimerEffect, ProcessData = ProcessData, Timer = Timer, Release = Release, Stage = Stage, Region = Region, Wip = Wip, WorkingState = WorkingState, TraceContext = TraceContext,
    Deadline = Deadline, ThreadRequest = ThreadRequest, ThreadClient = ThreadClient, CatchUp = CatchUp, ThreadExpect = ThreadExpect, ThreadMarker = ThreadMarker,
    Scalar = Scalar, Record = Record, MemberSpec = MemberSpec, ColumnValue = ColumnValue, LayoutColumn = LayoutColumn, SystemColumn = SystemColumn,
    GeneratedNames = GeneratedNames, GeneratedTable = GeneratedTable, IndexRow = IndexRow, Reader = Reader, Where = Where, Sort = Sort, Cursor = Cursor,
    ItemQuery = ItemQuery, ColumnTarget = ColumnTarget, Resolver = Resolver, Condition = Condition, FilterEnvironment = FilterEnvironment,
    FilterCompilation = FilterCompilation, RelationScope = RelationScope, HistoryAsked = HistoryAsked, ScopeFilter = ScopeFilter, Scope = Scope,
    ScopeQuery = ScopeQuery, AdmittedScope = AdmittedScope, PluginSchemaSource = PluginSchemaSource, PluginSchema = PluginSchema, ResolveContext = ResolveContext,
    PluginError = PluginError, PluginProblem = PluginProblem, PluginLifecycle = PluginLifecycle, PluginView = PluginView, PluginProjection = PluginProjection, PluginProjectionState = PluginProjectionState, Plugin = Plugin, ProviderResult = ProviderResult, Provider = Provider, FieldType = FieldType,
    Holder = Holder, FieldAccess = FieldAccess, Visibility = Visibility, AccessCaller = AccessCaller,
    PluginOwners = PluginOwners, PluginDecl = PluginDecl, PluginState = PluginState, PluginProgress = PluginProgress,
    PathMove = PathMove, SubtreeStats = SubtreeStats, DeleteResult = DeleteResult,
    Write = Write,
    WhenCheck = WhenCheck, Layout = Layout, Rollup = Rollup, RecomputeRange = RecomputeRange, RankRange = RankRange, RebalanceState = RebalanceState, Finding = Finding, Json = Json, JsonObject = JsonObject, SqlParams = SqlParams, Row = Row, Value = Value, Dec = Dec, Quantity = Quantity, Ref = Ref, FieldConfig = FieldConfig,
    ValueShape = ValueShape, OptionDecl = OptionDecl, FieldDecl = FieldDecl, ItemTypeDecl = ItemTypeDecl,
    RelationDecl = RelationDecl, PrincipalDecl = PrincipalDecl, StateDecl = StateDecl, EffectDecl = EffectDecl,
    TransitionDecl = TransitionDecl, ProcessDecl = ProcessDecl, PolicyDecl = PolicyDecl,
    StateMaps = StateMaps, RemoveDecl = RemoveDecl, Declaration = Declaration, Option = Option, Field = Field, ItemType = ItemType, Relation = Relation, State = State,
    Effect = Effect, Transition = Transition, Process = Process, Policy = Policy, Compiled = Compiled, Model = Model, SchemaChange = SchemaChange, Usage = Usage,
    Board = Board, Cell = Cell, Document = Document, Item = Item, LinkRow = LinkRow, InboundLink = InboundLink, CommentRow = CommentRow, ChangeRow = ChangeRow, IntervalRow = IntervalRow,
    PatchStep = PatchStep, Target = Target, Receipt = Receipt, EventBody = EventBody, External = External, Event = Event,
    FoldBatch = FoldBatch, FoldResult = FoldResult, RawEvent = RawEvent, FoldEvent = FoldEvent, ProjectionRange = ProjectionRange, ProjectionBody = ProjectionBody,
    ProjectionInput = ProjectionInput, ComponentMeta = ComponentMeta, ComponentRow = ComponentRow,
}
