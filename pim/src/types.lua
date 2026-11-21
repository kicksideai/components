-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Shared PIM types. Modules import this library and annotate with types.<Type>.
-- Values that cross a boundary (requests, decoded JSON, registry meta) enter as
-- unknown and are narrowed by the declaration or value checks before use.
local sql = require("sql")

-- JSON documents as decoded or encoded.
type Json = nil | boolean | number | string | { Json } | { [string]: Json }
type JsonObject = { [string]: Json }

-- A database handle or an open transaction; statements run on either.
type Executor = sql.DB | sql.Transaction

-- SQL parameter lists and result rows; rows are narrowed field by field.
type SqlParams = { unknown }
type Row = { [string]: unknown }

-- Canonical values. The attribute's form gives which variant a value holds.
type Dec = { m: integer, e: integer }
type Quantity = { v: Dec, u: string }
type Ref = { ref: { string } }
type Record = { [string]: Value }
type Scalar = string | integer | boolean | Dec | Quantity | Ref | Record
type Value = Scalar | { Scalar }

type Ctx = { [string]: string }
type Cell = { p: Value?, c: integer?, s: string? }
type Coordinates = { [string]: Cell }
type Document = { [string]: Coordinates }
-- Product counts for one attribute, including products with incompatible authored cells.
type AttributeUsage = { products: integer, key_violations: integer, order_violations: integer }

-- Attribute configuration a form reads: decimal scale and range, text case and
-- pattern, reference target, record members, quantity units and currency.
type AttributeConfig = {
    scale: integer?, range: { integer }?, case: string?, target: string?, members: { [string]: MemberSpec }?,
    units: { [string]: string }?, canonical: string?, currency: string?, pattern: string?,
}
type MemberSpec = AttributeConfig & { form: string, cardinality: string?, vocabulary: string? }
-- ValueShape is what normalizing a value needs: its form, cardinality and config.
type ValueShape = { form: string, cardinality: string, config: AttributeConfig }

-- Catalog policy overrides (spec 5.9); unset keys take the deployment default.
type PolicyOverrides = { audit: string?, audit_days: integer?, trash_days: integer?, tombstone_days: integer?, proposal_days: integer?, completed_work_days: integer?, abandoned_work_days: integer?, import_days: integer?, proposal_count: integer?, proposal_bytes: integer?, command_deadline_ms: integer?, rebuild_rows: integer?, job_batches: integer?, import_rows: integer? }
type Policy = { audit: string, audit_days: integer, trash_days: integer, tombstone_days: integer, proposal_days: integer, completed_work_days: integer, abandoned_work_days: integer, import_days: integer, pending_creation_days: integer, proposal_count: integer, proposal_bytes: integer, command_deadline_ms: integer, maintenance_rows: integer, maintenance_catalogs: integer, rebuild_rows: integer, job_batches: integer, import_rows: integer }

-- Declarations as callers send them (spec 3, 4, 8). The contract's input schema
-- checks their shape at the service boundary; compile checks their meaning.
type DimensionDecl = { name: string, members: { string }, fallback: { [string]: { string } }? }
type VocabularyDecl = { code: string, hierarchical: boolean?, semantic: boolean? }
-- width is the attribute's share of a form row: full, half, third or quarter;
-- absent, compile picks one from the form and cardinality.
type AttributeDecl = {
    id: integer?, code: string, type: string, scope: { string }?, cardinality: string?, index: string?,
    index_contexts: { Ctx }?, unique: boolean?, vocabulary: string?, default: Json?, config: AttributeConfig?, width: string?,
}
type WriteRule = { sources: { string }? }
type AspectDecl = { namespace: string, write: WriteRule?, attributes: { AttributeDecl }? }
type VariationDecl = { axes: { string }?, own: { string }? }
type RequirementDecl = { id: string, context: { [string]: string }?, require: { string }?, authored: { string }? }
type CheckDecl = { check: string, reads: { string }?, cost: string?, config: JsonObject?, enforce: string? }
type FamilyDecl = {
    code: string, aspects: { string }?, variation: { VariationDecl }?, requirements: { RequirementDecl }?, checks: { CheckDecl }?,
}
type SourceDecl = { id: string, ordering: string?, writes: { string }?, principals: { string }?, audit: boolean? }
type ChannelDecl = { id: string, requirements: { string }?, families: { string }? }
type RemoveDecl = {
    dimensions: { string }?, vocabularies: { string }?, aspects: { string }?, families: { string }?,
    sources: { string }?, channels: { string }?, attributes: { string }?, scopes: { string }?, plugins: { string }?,
}
type PolicyDecl = { audit: string | false | nil, audit_days: integer | false | nil, trash_days: integer | false | nil,
    tombstone_days: integer | false | nil, proposal_days: integer | false | nil, completed_work_days: integer | false | nil, abandoned_work_days: integer | false | nil, import_days: integer | false | nil, proposal_count: integer | false | nil, proposal_bytes: integer | false | nil, command_deadline_ms: integer | false | nil, rebuild_rows: integer | false | nil, job_batches: integer | false | nil, import_rows: integer | false | nil }
type Declaration = {
    dimensions: { DimensionDecl }?, vocabularies: { VocabularyDecl }?, aspects: { AspectDecl }?, families: { FamilyDecl }?,
    sources: { SourceDecl }?, channels: { ChannelDecl }?, policy: PolicyDecl?, scopes: { string }?,
    plugins: { PluginEntry }?, remove: RemoveDecl?,
}

type Attribute = {
    id: integer, code: string, aspect: string, type: string, form: string, scope: { string },
    cardinality: string, index: string, unique: boolean, config: AttributeConfig, default: Value?,
    status: string, vocabulary: string?, index_contexts: { string }, functions: TypeFunctions?, width: string?,
}
-- Refined is what a type's functions made of one requested value: the value
-- the patch takes, the error that refuses it, or the findings that reject it.
type Refined = { value: Value?, error: string?, findings: { Finding }? }
type Dimension = { name: string, members: { string }, member_set: { [string]: boolean }?, fallback: { [string]: { string } } }
type Level = { axes: { string } }
type Requirement = { id: string, contexts: { Ctx }, require: { string }, authored: { string } }
-- A compiled family check; an enforced check rejects writes of the products at
-- level, the one level owning everything it reads.
type Check = { fn: string, digest: string, reads: { string }, cost: string, config: JsonObject, enforce: boolean, level: integer? }
type Family = { code: string, owner: { [string]: integer }, levels: { Level }, item_level: integer, requirements: { Requirement }, checks: { Check } }
type Channel = { id: string, requirements: { string }, families: { string }? }
-- A compiled aspect; plugin names the plugin whose resolved schema contributes it.
type Aspect = { namespace: string, write_sources: { string }, plugin: string? }
type Source = { id: string, ordering: string, writes: { [string]: boolean }, principals: { [string]: boolean }, audit: boolean }
type Vocabulary = { code: string, semantic: boolean, hierarchical: boolean }
-- Membership retains the host-held schema copy resolved for this plugin.
type PluginEntry = { use: string, schema: PluginSchema? }
-- Where a plugin's schema fragment comes from: a static template in the manifest
-- or a kickside.pim:schema_provider binding.
type PluginSchemaSource = { template: JsonObject?, provider: string? }
-- A resolved fragment as the catalog stores it: the fragment in the declaration
-- vocabulary, the provider's version when it gives one, and the fragment's digest.
type PluginSchema = { fragment: JsonObject, version: string?, digest: string }
-- Registry metadata authored by a plugin, before the host applies defaults.
type PluginProjectionDeclaration = { kind: string, worker_ref: string, input: "state" | "events", revision: integer?, events: { string }? }
type PluginManifest = {
    type: "kickside.pim.plugin", interface_version: integer?, title: string?, description: string?, icon: string?, settings: string?,
    attachment: string, config_schema: JsonObject?, schema: PluginSchemaSource?, projections: { PluginProjectionDeclaration }?,
    tools: { string }?, requires: { string }?, seams: { string }?,
}
-- Plugin is a loaded kickside.pim.plugin manifest.
type Plugin = {
    id: string, interface_version: integer, title: string?, description: string?, icon: string?, settings: string?, attachment: string?, config_schema: JsonObject, schema: PluginSchemaSource?,
    projections: { PluginProjection }?, tools: { string }?, requires: { string }?, seams: { string }?,
}
type PluginLifecycle = { state: string, error: { kind: string, code: string?, message: string }? }
type PluginIntent = { removing: {string}?, projection_after: string?, active: boolean, generation: integer, seq: integer, attachment_id: string?, config: JsonObject, lifecycle: PluginLifecycle }
type PluginProjection = { kind: string, worker_ref: string, input: string, revision: integer, events: { string } }
type PluginProjectionState = { last_seq: integer, parked: boolean, bootstrapping: boolean, error: string? }
-- What a provider resolves against: the catalog, the plugin's effective config
-- and the copy the catalog holds.
type ResolveContext = { catalog_id: string, config: JsonObject, current: PluginSchema? }
type ProviderRequest = ResolveContext & { plugin: string }
type ProviderResult = { fragment: JsonObject, version: string? }
-- Fragment is what a plugin's schema source contributes: aspects and
-- vocabularies in the declaration vocabulary, attributes without ids.
type Fragment = { aspects: { AspectDecl }?, vocabularies: { VocabularyDecl }? }
-- PluginView is what get_schema reports per installed plugin: the catalog's
-- choice, what the plugin runs with, or why it cannot run.
type PluginProblem = { code: string, message: string, field: string? }
type PluginFeedRequest = { catalog_id: string, plugin: string, kind: string, token: string? }
-- On a gap, clear the catalog replica before applying changes and commit both with the replacement token.
type PluginFeed = { attachment_id: string, config: JsonObject, bootstrap: boolean, gap: FeedGap?, changes: { ChangeItem }, token: string, done: boolean }
type PluginContext = ReadStamp & { attachment_id: string?, config: JsonObject, lifecycle: PluginLifecycle, projections: { [string]: PluginProjectionState }, retention: { event_days: integer } }
type PluginView = { plugin: string, interface_version: integer?, title: string?, description: string?, icon: string?, installed: boolean, active: boolean,
    attachment_id: string?, config: JsonObject?, requires: { string }, tools: { string }, lifecycle: PluginLifecycle,
    projections: { [string]: PluginProjectionState }, problem: PluginProblem? }

-- The generated layout: index columns per indexed attribute context, and one
-- flag column per requirement set holding the item's readiness. Key and number
-- columns hold a value's key or order value; flag columns an int computed per item.
type Column = { attribute_id: integer, ctx: string, kind: string, column: string }
type Layout = { columns: { Column }, sets: { Column }, search: { Column }, flags: { Column } }
type RebuildStorage = { active: Layout, other: { base: string, layout: Layout, retired_after: string? }? }
type Compiled = {
    policy: PolicyOverrides,
    dimensions: { Dimension }, vocabularies: { [string]: Vocabulary }, aspects: { [string]: Aspect },
    attributes: { [string]: Attribute }, families: { [string]: Family }, sources: { [string]: Source },
    channels: { [string]: Channel }, scopes: { [string]: boolean }, plugins: { [string]: PluginEntry },
    layout: Layout, next_attribute_id: integer, layout_digest: string, digest: string,
    by_id: { [integer]: Attribute }?,
}
type Catalog = {
    catalog_id: string, generation: integer, applied_seq: integer, compiled: Compiled,
    plugin_state: { [string]: PluginIntent }, plugin_after: string?, item_table: string, digest: string, layout_digest: string, rebuild_after: string?, rebuild_seq: integer?,
    rebuild_job: string?, rebuild_storage: RebuildStorage?, pending_columns: { string },
    product_count: integer, item_count: integer, trashed_count: integer, tombstone_floor_seq: integer,
}
type Product = {
    product_id: string, sku: string, family: string, parent_id: string?, root_id: string, level: integer,
    is_item: integer, axis_key: string?, version: integer, status: string, state: string, state_at: string?,
    document: Document, source_seq: { [string]: integer }, created_seq: integer?, updated_seq: integer?,
    release_id: string?,
}
type Lineage = { [integer]: Product }
type Resolution = {
    state: string, value: Value?, owner: Product?, ctx: string?, source: string?, inherited: boolean?, fallback: boolean?,
}
type PatchStep = { a: integer, c: string, v: Value?, before: Value?, clear: boolean?, unset: boolean?, s: string? }

-- SchemaChange is one classified change (class cosmetic, additive, semantic or refused).
type SchemaChange = { code: string, class: string, what: string }

-- Release snapshot (spec 9): every applicable attribute resolved in every served
-- context, plus identity and the labels of referenced terms.
type ContextValues = { [string]: Value }
-- LinkTarget is what a link kind's owner says about one id at release time.
type LinkTarget = { label: string, data: JsonObject? }
type Snapshot = {
    product_id: string, sku: string, family: string, parent_id: string?, root_id: string, level: integer,
    version: integer, status: string,
    values: { [string]: ContextValues }, terms: { [string]: { [string]: string } }, links: { [string]: LinkTarget }?,
}
-- CheckInput is what a family check function receives (spec 3.4).
type CheckProduct = { product_id: string, sku: string, family: string, level: integer }
type CheckInput = { config: JsonObject, view: { [string]: ContextValues }, product: CheckProduct,
    previous_status: string?, proposed_status: string? }
type CheckResult = { findings: { Finding } }

-- Event bodies, one record per event family (spec 5.2). The writer adds actor,
-- at and the receipt of an idempotent command. Receipts that need projected
-- values are carried by the final event so all results are available at commit.
type Receipt = { request_hash: string?, result: JsonObject?, event_count: integer?, marker: string?, noop: boolean?, after_fold: boolean? }
type SchemaBody = {
    generation: integer, declaration: Declaration, compiled: Compiled, class: string, changes: { SchemaChange }?,
    plugin_configs: { [string]: JsonObject }?, actor: string?, at: string?, receipt: Receipt?,
}
type ProductBody = {
    product_id: string, sku: string?, family: string?, parent_id: string?, level: integer?, is_item: boolean?,
    axis_key: string?, status: string?, previous_status: string?, source: string?, source_seq: integer?, patch: { PatchStep }?,
    origin: Origin?, provenance: JsonObject?, approval_item_id: string?, audit: boolean?, actor: string?, at: string?, receipt: Receipt?,
}
type ProductPatchBody = ProductBody & { generation: integer, patch: { PatchStep } }
type TermBody = {
    vocabulary: string, code: string, labels: { [string]: string }?, parent: string?, retired: boolean?, merged_into: string?, merge: Merge?,
    actor: string?, at: string?, receipt: Receipt?,
}
type ReleaseBody = {
    release_id: string, product_id: string, version: integer, generation: integer, snapshot: Snapshot, hash: string,
    channels: { string }?, actor: string?, at: string?, receipt: Receipt?,
}
type WithdrawBody = { product_id: string, channels: { string }?, actor: string?, at: string?, receipt: Receipt? }
type ModelReleaseBody = { request_id: string, product_id: string, version: integer, root: boolean, identity: JsonObject,
    channels: { string }?, actor: string?, at: string?, receipt: Receipt? }
type PluginConfiguredBody = { plugin: string, config: JsonObject, actor: string?, at: string?, receipt: Receipt? }
type PluginRebuildBody = { plugin: string, actor: string?, at: string?, receipt: Receipt? }
type ProposalSubmittedBody = { proposal_id: string, generation: integer, base: { [string]: integer }, items: { ApplyItem },
    source: string?, origin: Origin?, provenance: JsonObject?, actor: string?, at: string? }
type DecisionStatus = "accepted" | "rejected" | "conflict" | "failed"
type ProposalStatus = "pending" | DecisionStatus
type ProposalDecidedBody = { proposal_id: string, decision: "accept" | "reject", status: DecisionStatus, result: ApplyResult?,
    actor: string?, at: string? }
type EventBody = PluginRebuildBody | PluginConfiguredBody | SchemaBody | ProductBody | TermBody | ReleaseBody | WithdrawBody | ModelReleaseBody
    | ProposalSubmittedBody | ProposalDecidedBody
-- External identity makes a retried command idempotent.
type External = { external_source: string, external_id: string }
-- TraceContext correlates an event with the work that caused it.
type TraceContext = { trace_id: string?, run_id: string?, caused_by_event_id: string?, correlation_key: string? }
-- Origin is the canonical provenance of a change (kickside.core.provenance:source_ref).
type Origin = { type: string, id: string }
type Event = { type: string, subject: string?, body: EventBody, external: External?, trace_context: TraceContext? }
type SchemaEvent = { kind: "schema", seq: integer, type: string, body: SchemaBody }
-- A created product's body always names its identity.
type ProductCreatedBody = ProductPatchBody & { sku: string, family: string, level: integer, is_item: boolean, status: string }
type CreatedEvent = { kind: "created", seq: integer, type: string, body: ProductCreatedBody }
type ProductEvent = { kind: "product", seq: integer, type: string, body: ProductBody }
type TermEvent = { kind: "term", seq: integer, type: string, body: TermBody }
type ReleaseEvent = { kind: "release", seq: integer, type: string, body: ReleaseBody }
type WithdrawEvent = { kind: "withdraw", seq: integer, type: string, body: WithdrawBody }
type ModelReleaseEvent = { kind: "model_release", seq: integer, type: string, body: ModelReleaseBody }
type FoldEvent = ModelReleaseEvent | SchemaEvent | CreatedEvent | ProductEvent | TermEvent | ReleaseEvent | WithdrawEvent
-- RawEvent is a prefetched thread event as the projection receives it.
type RawEvent = { seq: unknown, type: string, body: unknown, trace_context: TraceContext?, trace_id: string?, run_id: string?, caused_by_event_id: string?, correlation_key: string? }

type FindingDetail = {
    attribute: string?, holder: string?, version: integer?, product_id: string?, code: string?,
    set: string?, check: string?, context: string?, channel: string?,
}
type CodedFinding = FindingDetail & { code: string, message: string? }
type ExtensionFinding = FindingDetail & { message: string }
type Finding = CodedFinding | ExtensionFinding
type OutcomeStatus = "created" | "updated" | "unchanged" | "conflict" | "invalid" | "forbidden"
    | "released" | "queued" | "not_ready" | "withdrawn"
type Outcome = {
    index: integer?, outcome: OutcomeStatus, product_id: string?, sku: string?, version: integer?,
    term: string?, trashed: boolean?, restored: boolean?, findings: { Finding }?,
    request_id: string?, job_id: string?, release_id: string?, hash: string?, channels: { string }?, rewritten: integer?, deferred: integer?,
}
type ColumnValue = string | integer | boolean
-- ItemRow is one item's generated row: system values, index values by column,
-- set keys by column, searchable text and flags by column.
type ItemRow = {
    id: string, system: { [string]: ColumnValue }, values: { [string]: ColumnValue }, sets: { [string]: { string } },
    text: string?, flags: { [string]: integer },
}
type Names = { base: string, item: string, set: string, fts: string }
-- System columns every generated item row keeps (kind text or int).
type SystemColumn = { name: string, kind: string }
-- Table is one catalog's generated table set at a layout.
type Table = { names: Names, layout: Layout }

type ProductRef = { id: string?, sku: string? }
type ValueEntry = { attr: string, ctx: Ctx?, value: unknown, source: string? }
type CreateSpec = { family: string?, parent: ProductRef? }
type TermRef = { vocabulary: string, code: string }
-- TermMerge retires from and re-points every value referencing it at into.
type TermMerge = { vocabulary: string, from: string, into: string }
-- Merge is the pending merge a job finishes for the actor who asked, kept
-- until no value references the retired term.
type Merge = { catalog_id: string, vocabulary: string, from: string, into: string, identity: JsonObject, source: string?,
    requested_by: string, created_at: string,trace_context: TraceContext? }
-- TermRefRow locates one term reference inside a product's document.
type TermRefRow = { product_id: string, attribute_id: integer, ctx: string, path: string }
type ExpectVersion = integer | "any"
type ApplyItem = {
    product: ProductRef?, create: CreateSpec?, upsert: boolean?, expect_version: ExpectVersion?, seq: integer?,
    set: { ValueEntry }?, clear: { ValueEntry }?, unset: { ValueEntry }?, move: { parent: ProductRef }?,
    status: string?, delete: boolean?, restore: boolean?, term: TermRef?, labels: { [string]: string }?, parent: string?, retired: boolean?,
    term_merge: TermMerge?,
}
type Idempotency = { namespace: string, key: string }
type ApplyRequest = { items: { ApplyItem }, mode: string?, source: string?, expected_generation: integer?, origin: Origin?, provenance: JsonObject?, approval_item_id: string?, idempotency: Idempotency?,
    import: boolean?, trace_context: TraceContext? }
type ApplyResult = { outcomes: { Outcome }, applied: boolean, seq: integer?, as_of: integer?, replayed: boolean? }
type SchemaRequest = { plugin_configs: { [string]: JsonObject }?, declaration: Declaration, expected_generation: integer?, idempotency: Idempotency?, trace_context: TraceContext? }
type SchemaResult = { generation: integer, class: string, changes: { SchemaChange }, seq: integer?, as_of: integer?, replayed: boolean? }
type SchemaPlanResult = { generation: integer, class: string, changes: { SchemaChange }, refused: { SchemaChange }, migration: string? }
type ReleaseItem = { product: ProductRef, expect_version: integer?, channels: { string }? }
type ReleaseRequest = { items: { ReleaseItem }, idempotency: Idempotency?, trace_context: TraceContext? }
type ProposeRequest = { items: { ApplyItem }, source: string?, origin: Origin?, provenance: JsonObject?, trace_context: TraceContext? }
type Proposal = {
    proposal_id: string, source: string?, origin: JsonObject, provenance: JsonObject?, items: { ApplyItem }, base: { [string]: integer },
    generation: integer,
    status: ProposalStatus, result: ApplyResult?, created_by: string, created_at: string, decided_by: string?, decided_at: string?,
}
type ProposeResult = { proposal_id: string, status: "pending" }
type DecideRequest = { proposal_id: string, decision: string, trace_context: TraceContext? }
type DecideResult = { proposal_id: string, status: DecisionStatus, result: ApplyResult? }
type RebuildResult = { rebuilding: boolean }
-- Read contracts (spec 7). Every read result carries the projection position it
-- describes.
type ReadStamp = { as_of: integer?, generation: integer?, rebuilding: boolean? }
type ResolvedValue = { state: string, value: Value?, source: string?, ctx: string?, owner: string? }
type ProductView = {
    product_id: string, sku: string, family: string, parent_id: string?, root_id: string, level: integer,
    is_item: boolean, version: integer, status: string,
}
type GetRequest = { product: ProductRef, context: Ctx?, min_seq: integer? }
type PublicationState = { channel: string, release_id: string?, state: string }
type GetResult = ReadStamp & {
    product: ProductView, values: { [string]: ResolvedValue }, readiness: { [string]: { Finding } }?,
    release_id: string?, publications: { PublicationState },
}
-- Where is a filter tree as requested; kickside.pim.persist:tree reads it.
type Where = { [string]: unknown }
type Sort = { field: string, ctx: { [string]: string }?, dir: string? }
-- Cursor is the SQL keyset position. QueryToken is its opaque public form.
type SortValue = string | integer
type Cursor = { id: string, v: SortValue? }
type QueryToken = string
type QueryPosition = { id: string, key: string?, decimal: string? }
-- Reader is a caller admitted to read one catalog; allows answers whether it
-- holds an access level (read, write, admin) there; actor is who it reads as,
-- for $actor operands.
type Reader = { catalog_id: string, actor: string?, allows: (string) -> boolean }
-- ItemQuery is what the query compiler pages; count caps the count it carries
-- and scan bounds the rows a filter may walk.
type ItemQuery = { where: Where?, text: string?, sort: Sort?, after: Cursor?, count: integer?, scan: integer? }
-- Target is the generated column a filter or sort names: the value shape
-- normalizes request values, and coerce maps a request shorthand onto the
-- canonical form first.
type Target = { column: string, kind: string, set: boolean, shape: ValueShape, coerce: ((unknown) -> unknown)? }
type Resolver = (string, { [string]: string }?) -> (Target?, error?)
-- Condition is a clause over alias i (generated row) and r (product row).
type Condition = { sql: string, args: { unknown } }
type ReadyFilter = { set: string, value: boolean }
type PublishedFilter = { channel: string }
-- Scopes (spec 3.5): declarative filters over plugin tables in PIM's database.
type ScopeFilter = { column: string, type: string, ops: { [string]: boolean } }
type Scope = { id: string, table: string, catalog_column: string, product_column: string, filters: { [string]: ScopeFilter },
    access: string }
type ScopeQuery = { id: string, where: { [string]: { [string]: unknown } } }
-- AdmittedScope is a scope query whose scope the reader's access allows.
type AdmittedScope = { scope: Scope, where: { [string]: { [string]: unknown } } }
type QueryRequest = {
    where: Where?, text: string?, family: string?, status: string?, sort: Sort?, limit: integer?, after: QueryToken?, count: boolean?,
    ready: ReadyFilter?, published: PublishedFilter?, parent: ProductRef?, root: ProductRef?, scopes: { ScopeQuery }?,
    min_seq: integer?, columns: { string }?, context: Ctx?,
}
-- values holds the resolved value of each requested column in the request's
-- context; a value that resolves to nothing is absent.
type QueryItem = { product_id: string, sku: string, version: integer, status: string, family: string, values: { [string]: Value }? }
type QueryResult = ReadStamp & { items: { QueryItem }, after: QueryToken?, total: integer?, estimated: boolean?, incomplete: boolean? }
type AttributeView = {
    id: integer, type: string, form: string, scope: { string }, cardinality: string, index: string,
    index_contexts: { string }, unique: boolean, vocabulary: string?, default: Value?, plugin: string?, config: AttributeConfig,
    width: string,
}
type CatalogAccess = { read: boolean, write: boolean, admin: boolean }
type SchemaView = ReadStamp & {
    access: CatalogAccess,
    schema_generation: integer, declaration: Declaration, attributes: { [string]: AttributeView }, families: { [string]: Family },
    channels: { [string]: Channel }, dimensions: { Dimension }, vocabularies: { [string]: Vocabulary }, sources: { [string]: Source },
    scopes: { [string]: boolean }, plugins: { PluginView },
}
type HistoryRequest = { product: ProductRef?, before: string?, limit: integer?, min_seq: integer? }
-- sku names the product of a product subject while its row exists.
type HistoryEntry = {
    seq: integer, n: integer, subject: string, sku: string?, kind: string, attribute_id: integer?, attribute: string?, ctx: string?,
    before: Json, after: Json, actor: string, source: string?, origin: Json, at: string,
}
type HistoryResult = ReadStamp & { entries: { HistoryEntry }, next: string? }
type ProposalCursor = { created_at: string, proposal_id: string }
type ProposalsRequest = { status: string?, limit: integer?, after: ProposalCursor? }

-- Feeds (spec 12): cursor-resumable over durable state.
type FeedGap = { floor: integer }
type FeedPosition = { seq: integer, product_id: string }
type ChangesCursor = FeedPosition & { expiry_floor: integer? }
type ChangesRequest = { cursor: ChangesCursor?, limit: integer?, families: { string }? }
type ChangeTerm = TermView & { vocabulary: string }
type ChangeItem = {
    product_id: string, op: string, updated_seq: integer, sku: string, family: string, parent_id: string?, root_id: string,
    level: integer, status: string, version: integer, values: { [string]: ContextValues }?, terms: { ChangeTerm }?,
}
type ChangesResult = ReadStamp & { items: { ChangeItem }, next: ChangesCursor, has_more: boolean, gap: FeedGap? }
type PublicationCursor = FeedPosition & { expiry_floor: FeedPosition? }
type PublicationsRequest = { channel: string, after: PublicationCursor?, limit: integer? }
type PublicationItem = {
    product_id: string, state: string, seq: integer, updated_at: string, release_id: string?, hash: string?,
    version: integer?, snapshot: Snapshot?,
}
type PublicationsResult = ReadStamp & { items: { PublicationItem }, next: PublicationCursor, has_more: boolean }

-- Further reads (spec 7).
type LinksCursor = { product_id: string, attribute_id: integer, ctx: string, path: string }
type LinksRequest = { kind: string, target: string, after: LinksCursor?, limit: integer? }
type LinkRow = { product_id: string, sku: string, attribute: string?, attribute_id: integer, ctx: string, path: string }
type LinksResult = ReadStamp & { items: { LinkRow }, next: LinksCursor? }
type ReleaseRecord = {
    release_id: string, product_id: string, version: integer, generation: integer, snapshot: Snapshot, hash: string,
    channels: { string }, seq: integer, created_at: string,
}
type GetReleaseRequest = { release_id: string }
type GetReleaseResult = ReadStamp & { release: ReleaseRecord }
-- TermView is a vocabulary term as a reader sees it.
type TermView = { code: string, labels: { [string]: string }, parent: string?, retired: boolean }
type ListTermsRequest = { vocabulary: string, parent: string?, retired: boolean?, limit: integer?, after: string? }
type ListTermsResult = ReadStamp & { terms: { TermView }, next: string? }
type ReleasesRequest = { product: ProductRef, before: integer?, limit: integer? }
type ReleasesResult = ReadStamp & { releases: { ReleaseRecord }, next: integer? }
type GetSchemaRequest = { generation: integer? }
-- schema_options answers the registry declarations a catalog may use in its
-- schema: attribute types, product scopes, plugins and bound link kinds.
type SchemaOptionsRequest = {}
type TypeOption = { id: string, title: string?, form: string, indexes: { string }, target: string?, config_schema: JsonObject?, problem: string? }
type ScopeFilterOption = { type: string, ops: { string } }
type ScopeOption = { id: string, title: string?, access: string, filters: { [string]: ScopeFilterOption }, problem: string? }
type PluginOption = PluginView & { config_schema: JsonObject }
type LinkKindOption = { kind: string, binding: string, title: string? }
type SchemaOptions = { types: { TypeOption }, scopes: { ScopeOption }, plugins: { PluginOption }, link_kinds: { LinkKindOption } }
type ExplainRequest = { product: ProductRef, attr: string, context: Ctx? }
type ExplainResult = ReadStamp & {
    attribute: string, candidates: { string }, resolution: ResolvedValue, findings: { [string]: { Finding } }?,
}
type ProposalsResult = { proposals: { Proposal }, next: ProposalCursor?, has_more: boolean }

-- Catalog lifecycle contracts.
type CreateRequest = { idempotency_key: string, title: string?, parent_id: string?, declaration: Declaration?, plugin_configs: { [string]: JsonObject }?,
    pack: string?, ui_app: string? }
type CreateResult = { catalog_id: string, title: string, generation: integer, replayed: boolean }
type UpdateRequest = { catalog_id: string?, ui_app: string }
type UpdateResult = { catalog_id: string, ui_app: string? }
type CatalogSummary = { access: CatalogAccess, catalog_id: string, title: string, ui_app: string?, product_count: integer?, item_count: integer?, generation: integer?, status: string? }
type ListRequest = { limit: integer?, after: integer?, text: string?, admin_only: boolean?, ui_app: string? }
type ListResult = { catalogs: { CatalogSummary },after:integer? }
-- ComponentRow is the part of a component query row PIM reads.
type ComponentMeta = { title: string?, pim_ui_app: string?, product_count: number?, item_count: number?, generation: number?, status: string? }
type ComponentRow = { access_level: unknown, component_id: string?, impl_id: string?, parent_id: string?, meta: ComponentMeta? }

-- Portable catalog export (spec 12): data/schema.json, terms.jsonl, products-NNNNNN.jsonl.
type ExportedValue = { attr: string, ctx: Ctx, source: string?, cleared: boolean?, value: Value? }
type ExportedTerm = { vocabulary: string, code: string, parent: string?, labels: { [string]: string }, retired: boolean }
type ExportedProduct = {
    product_id: string, sku: string, family: string, level: integer, parent_sku: string?, status: string,
    values: { ExportedValue }, refs: { ExportedValue },
}
type PortableArgs = { storage_id: string, path: string, id_map: IdMap? }
type IdMap = { rows: { [string]: { [string]: string } }? }
type PortableManifest = { impl_id: string, slots: { string }, files: { string }, counts: { [string]: integer } }
type PortableResult = { success: boolean, error: string?, kind: string?, message: string?, retryable: boolean?, details: JsonObject?, manifest: PortableManifest?, id_map: IdMap?, warnings: { string }? }

-- Projection runtime input.
type ProjectionRange = { to_seq: integer }
type ProjectionBody = { body: unknown }
type ProjectionInput = { thread_id: string, range: ProjectionRange, events: { RawEvent }?, projection: ProjectionBody? }

-- TypeFunctions are the pure functions a type declares: normalize refines a
-- valid form value, validate answers findings over it.
type TypeFunctions = { normalize: string?, validate: string? }
-- Type metadata a kickside.pim.type registry entry declares.
type TypeMeta = { type: string, form: string, indexes: { string }?, target: string?, config_schema: JsonObject?, functions: TypeFunctions? }
-- Normalized is one answer of a normalize function: the refined value or why the
-- value is refused.
type Normalized = { value: unknown?, error: string? }
-- TypeFinding is one finding a validate function answers.
type TypeFinding = { code: string?, message: string }
type TypeFunctionRequest = { config: JsonObject, values: { unknown } }
type NormalizeResult = { results: { Normalized } }
type ValidateResult = { results: { { findings: { TypeFinding } } } }
type CommandResult = ApplyResult | SchemaResult | ProposeResult | DecideResult | { seq: integer?, as_of: integer?, replayed: boolean? }
type Plan = { result: CommandResult, events: { Event }, receipt_after_fold: boolean? }

return {
    Json = Json, JsonObject = JsonObject, SqlParams = SqlParams, Row = Row, Dec = Dec, Quantity = Quantity, Ref = Ref, Record = Record,
    Scalar = Scalar, Value = Value, Ctx = Ctx, Cell = Cell, Coordinates = Coordinates, Document = Document,
    AttributeUsage = AttributeUsage,
    AttributeConfig = AttributeConfig, MemberSpec = MemberSpec, ValueShape = ValueShape,
    PolicyOverrides = PolicyOverrides, Policy = Policy, DimensionDecl = DimensionDecl, VocabularyDecl = VocabularyDecl,
    AttributeDecl = AttributeDecl, WriteRule = WriteRule, AspectDecl = AspectDecl,
    VariationDecl = VariationDecl, RequirementDecl = RequirementDecl, CheckDecl = CheckDecl,
    FamilyDecl = FamilyDecl, SourceDecl = SourceDecl, ChannelDecl = ChannelDecl, RemoveDecl = RemoveDecl,
    PolicyDecl = PolicyDecl, Declaration = Declaration, Attribute = Attribute, Dimension = Dimension,
    Level = Level, Requirement = Requirement, Check = Check, Family = Family, Channel = Channel,
    Aspect = Aspect, Source = Source, Vocabulary = Vocabulary, Column = Column, Layout = Layout, RebuildStorage = RebuildStorage,
    Compiled = Compiled, Catalog = Catalog, Product = Product, Lineage = Lineage, Resolution = Resolution,
    PatchStep = PatchStep, Receipt = Receipt, SchemaBody = SchemaBody, ProductBody = ProductBody, ProductPatchBody = ProductPatchBody,
    ModelReleaseBody = ModelReleaseBody, ModelReleaseEvent = ModelReleaseEvent, TermBody = TermBody, ReleaseBody = ReleaseBody, WithdrawBody = WithdrawBody, EventBody = EventBody,
    External = External, Event = Event, SchemaEvent = SchemaEvent, ProductCreatedBody = ProductCreatedBody, CreatedEvent = CreatedEvent,
    ProductEvent = ProductEvent, TermEvent = TermEvent,
    ReleaseEvent = ReleaseEvent, WithdrawEvent = WithdrawEvent, FoldEvent = FoldEvent, RawEvent = RawEvent,
    ProposalSubmittedBody = ProposalSubmittedBody, ProposalDecidedBody = ProposalDecidedBody,
        SchemaChange = SchemaChange, ContextValues = ContextValues, Snapshot = Snapshot,
    CheckProduct = CheckProduct, CheckInput = CheckInput, CheckResult = CheckResult, FindingDetail = FindingDetail, Finding = Finding,
    CodedFinding = CodedFinding, ExtensionFinding = ExtensionFinding,
    Outcome = Outcome, OutcomeStatus = OutcomeStatus, ColumnValue = ColumnValue, ItemRow = ItemRow, Names = Names, ProductRef = ProductRef,
    ValueEntry = ValueEntry, CreateSpec = CreateSpec, TermRef = TermRef, ExpectVersion = ExpectVersion,
    ApplyItem = ApplyItem, Idempotency = Idempotency, ApplyRequest = ApplyRequest, ApplyResult = ApplyResult,
    SchemaRequest = SchemaRequest, SchemaResult = SchemaResult, SchemaPlanResult = SchemaPlanResult,
    ReleaseItem = ReleaseItem, ReleaseRequest = ReleaseRequest, ProposeRequest = ProposeRequest, Proposal = Proposal,
    ProposeResult = ProposeResult, DecideRequest = DecideRequest, DecideResult = DecideResult, RebuildResult = RebuildResult,
    ProposalStatus = ProposalStatus, DecisionStatus = DecisionStatus,
        TypeMeta = TypeMeta, ReadStamp = ReadStamp, ResolvedValue = ResolvedValue, ProductView = ProductView,
    GetRequest = GetRequest, GetResult = GetResult, Where = Where, Executor = Executor, Origin = Origin, TraceContext = TraceContext, Sort = Sort,
    Cursor = Cursor, SortValue = SortValue, QueryToken = QueryToken, QueryPosition = QueryPosition, ReadyFilter = ReadyFilter,
    QueryRequest = QueryRequest, QueryItem = QueryItem, QueryResult = QueryResult, AttributeView = AttributeView,
    SchemaView = SchemaView, HistoryRequest = HistoryRequest, HistoryEntry = HistoryEntry, HistoryResult = HistoryResult,
    ProposalCursor = ProposalCursor, ProposalsRequest = ProposalsRequest, ProposalsResult = ProposalsResult, PublicationState = PublicationState,
    PublishedFilter = PublishedFilter, ScopeQuery = ScopeQuery, PluginEntry = PluginEntry,
        PluginView = PluginView, PluginSchema = PluginSchema, Fragment = Fragment, LinkTarget = LinkTarget, Refined = Refined,
        TermMerge = TermMerge, Merge = Merge, TermRefRow = TermRefRow, AdmittedScope = AdmittedScope, FeedGap = FeedGap,
        FeedPosition = FeedPosition, ChangesCursor = ChangesCursor,
        ChangesRequest = ChangesRequest,
    ChangeTerm = ChangeTerm, ChangeItem = ChangeItem, ChangesResult = ChangesResult, PublicationsRequest = PublicationsRequest,
    PublicationCursor = PublicationCursor, PublicationItem = PublicationItem, PublicationsResult = PublicationsResult, LinksCursor = LinksCursor,
    LinksRequest = LinksRequest, LinkRow = LinkRow, LinksResult = LinksResult, ReleaseRecord = ReleaseRecord,
    TermView = TermView, ListTermsRequest = ListTermsRequest, ListTermsResult = ListTermsResult,
    GetReleaseRequest = GetReleaseRequest, GetReleaseResult = GetReleaseResult, ReleasesRequest = ReleasesRequest,
    ReleasesResult = ReleasesResult, GetSchemaRequest = GetSchemaRequest, SchemaOptionsRequest = SchemaOptionsRequest, TypeOption = TypeOption, ScopeFilterOption = ScopeFilterOption,
    ScopeOption = ScopeOption, PluginOption = PluginOption, LinkKindOption = LinkKindOption, SchemaOptions = SchemaOptions, ExplainRequest = ExplainRequest,
    ExplainResult = ExplainResult, CreateRequest = CreateRequest, CreateResult = CreateResult,
    UpdateRequest = UpdateRequest, UpdateResult = UpdateResult, ListRequest = ListRequest,
    CatalogAccess = CatalogAccess, CatalogSummary = CatalogSummary, ListResult = ListResult, ComponentMeta = ComponentMeta, ComponentRow = ComponentRow,
        ExportedValue = ExportedValue, ExportedTerm = ExportedTerm,
    ExportedProduct = ExportedProduct, PortableArgs = PortableArgs, IdMap = IdMap, PortableManifest = PortableManifest,
    PortableResult = PortableResult, ProjectionRange = ProjectionRange,
    ProjectionBody = ProjectionBody, ProjectionInput = ProjectionInput, CommandResult = CommandResult, Plan = Plan,
    SystemColumn = SystemColumn, Table = Table, Reader = Reader, ItemQuery = ItemQuery, Target = Target, Resolver = Resolver,
    Condition = Condition, ScopeFilter = ScopeFilter, Scope = Scope, TypeFunctions = TypeFunctions, Normalized = Normalized,
    TypeFinding = TypeFinding, Plugin = Plugin, PluginProjection = PluginProjection, PluginProjectionState = PluginProjectionState,
    TypeFunctionRequest = TypeFunctionRequest, NormalizeResult = NormalizeResult, ValidateResult = ValidateResult,
    PluginManifest = PluginManifest, PluginProjectionDeclaration = PluginProjectionDeclaration, ProviderRequest = ProviderRequest, ProviderResult = ProviderResult,
    PluginFeedRequest = PluginFeedRequest, PluginFeed = PluginFeed, PluginContext = PluginContext, PluginIntent = PluginIntent, PluginLifecycle = PluginLifecycle, PluginSchemaSource = PluginSchemaSource, ResolveContext = ResolveContext,
}
