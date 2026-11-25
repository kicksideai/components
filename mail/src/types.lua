-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")

type DB = sql.DB
type Executor = DB | sql.Transaction
type Transaction = sql.Transaction
type TransactionWork<T> = (sql.Transaction, string) -> (T?, error?)
type Json = nil | boolean | number | string | {Json} | {[string]: Json}
type JsonObject = {[string]: Json}
type Record = {[string]: unknown}
type Recipient = string | {user_id: string}
type Mailbox = {address: string, name: string?}
type AttachmentRef = {upload_id: string, filename: string?, disposition: string?, content_id: string?}
type Asset = {source: string, filename: string?, content_type: string?, size: integer?, width: integer?, height: integer?,
    filesystem: string?, path: string?, upload_id: string?}
type AssetPart = {filename: string, content_type: string, size: integer, content: string?}
type AssetRef = {name: string, content_id: string, original: string?, upload_id: string?}
type AssetReadRequest = {ref: AssetRef, bytes: boolean}
type InlineAssets = {[string]: string}
type Attachment = {filename: string, content_type: string, content: string, disposition: string, content_id: string?}
type Origin = {kind: string, id: string, label: string}
type SendRequest = {
    template: string?, vars: JsonObject?, subject: string?, text: string?, html: string?,
    to: {Recipient}, cc: {Recipient}?, bcc: {Recipient}?, reply_to: string?,
    attachments: {AttachmentRef}?, idempotency_key: string?, origin: Origin?, sink_op: string?,
}
type Addresses = {to: {string}, cc: {string}?, bcc: {string}?}
type DeliveryMessage = Addresses & {
    from: Mailbox, reply_to: string?, subject: string, html: string?, text: string?,
}
type TransportRequest = DeliveryMessage & {attachments: {Attachment}?, idempotency_key: string?, deadline: string}
type TransportResult = {provider_message_id: string?}
type SendResult = {message_id: string, status: string}
type MessageRef = {message_id: string}
type PrincipalLabel = {kind: string, id: string, label: string}
type PrincipalRef = {type: string, id: string}
type DirectoryPrincipal = PrincipalRef & {label: string}
type PrincipalDirectory = {resolve: (PrincipalDirectory, {refs: {PrincipalRef}}) -> ({principals: {DirectoryPrincipal}}?, error?)}
type Capabilities = {send: boolean, edit_library: boolean, administer_delivery: boolean}
type ListRequest = {status: string?, template: string?, since: integer?, q: string?, limit: integer, cursor: string?}
type ListQuery = {status: string?, template: string?, since: integer?, q: string?, limit: integer,
    before_time: integer?, before_id: string?, day_start: integer, next_day: integer}
type ListResult = {items: {LogMessage}, next_cursor: string?, has_more: boolean, total: integer?, total_is_lower_bound: boolean?, failed_today: integer?}
type MessageError = {kind: string, code: string, message: string, provider_detail: string?}
type LogMessage = Addresses & {
    message_id: string, status: string, created_at: integer, attempts: integer,
    next_attempt_at: integer?, sent_at: integer?, finished_at: integer?, sender: string, template: string?,
    subject: string, reply_to: string?, attachments: {AttachmentRef}, driver_id: string?, origin: Origin?,
    provider_message_id: string?, last_error: MessageError?, resend_of: string?, can_resend: boolean?,
}
type MessageRow = {
    id: string, created_at: integer, status: string, attempts: integer,
    next_attempt_at: integer?, next_check_at: integer?, sent_at: integer?, finished_at: integer?,
    sender: string, actor_context: string, template: string?, recipients: string, subject: string,
    html: string?, text: string?, from_address: string, from_name: string?, reply_to: string?, attachments: string,
    job_id: string, driver_id: string?, provider_message_id: string?, content_hash: string?,
    error_kind: string?, error_code: string?, error_message: string?, provider_detail: string?,
    origin_kind: string?, origin_id: string?, origin_label: string?,
    failed_html: string?, failed_text: string?, resend_of: string?, has_failed_content: integer?,
}
type Admission = Addresses & {
    sender: string, actor_context: string, template: string?, subject: string,
    html: string?, text: string?, from: Mailbox, reply_to: string?, attachments: {AttachmentRef}?,
    library_assets: {AssetRef}?, idempotency_key: string?, content_hash: string?, origin: Origin?, resend_of: string?,
}
type AdmissionResult = {message: SendResult, inserted: boolean}
type MessageInsert = Admission & {id: string, created_at: integer, next_check_at: integer}
type KeyRow = {id: string, status: string, content_hash: string?}
type InsertOutcome = KeyRow & {inserted: boolean}
type Outcome = {delivered: TransportResult?, cause: MessageError?}
type DueRow = {id: string, job_id: string, next_check_at: integer}
type Deadlines = {check_at: integer?, finished_at: integer?}
type MessageContent = {addresses: Addresses, attachments: {AttachmentRef}}
type DeliveryContent = MessageContent & {assets: {AssetRef}}
type ResendSource = {row: MessageRow, content: MessageContent, assets: {AssetRef}}
type MessagePage = {items: {MessageRow}, has_more: boolean, total: integer, total_is_lower_bound: boolean?, failed_today: integer}
type Job = {id: string, lease_token: string, execution_seq: integer, deadline: string}
type JobInput = {job: Job, payload: {message_id: string}}
type Lease = {token: string, execution_seq: integer}
type ActorRow = {actor_id: string, actor_context: string}
type OwnerLocator = {kind: string, id: string}
type JobCompletion = {run_history_settled: boolean}
type OwnerInput = {change: {kind: string?, job_id: string?, owner_locator: OwnerLocator?}?}
type BlockedAsset = {component_id: string, error: error}
type OwnerResult = {success: boolean, deleted: integer?, deadline_ms: integer?, needs_continue: boolean?,
    error: error?, blocked: {BlockedAsset}?}
type ComponentAccessResult = {success: boolean?, error: string?, kind: string?, retryable: boolean?, details: Record?, error_kind: string?}
type ComponentAccessContract = {get_access_context: (self: ComponentAccessContract,
    input: {component_id: string, access_mask: integer, include_context: boolean}) -> (ComponentAccessResult?, error?)}
type AssetContent = {revision: integer, content_type: string, bytes: string}
type ResourceKey = {kind: string, name: string}
type ResourceReferences = {bases: {string}, parts: {string}, assets: {string}}
type ReferenceClosure = {dependencies: {ResourceKey}, dependants: {ResourceKey}}
type PreviewRow = {id: string, actor: string, operation: string, digest: string, expected: {[string]: integer}, expires_at: integer}
type ResourceContent = {
    kind: string, name: string,
    title: string, description: string, html: string, text: string, base: string?,
    subject: string?, schema: VariableSchema, samples: JsonObject, asset: Asset?,
}
type OriginalSource = {html: string, text: string, subject: string?, base: string?,
    schema: VariableSchema, samples: JsonObject}
type Resource = {
    kind: string, name: string, title: string, description: string, html: string, text: string,
    base: string?, subject: string?, schema: VariableSchema, samples: JsonObject,
    asset: Asset?, original: OriginalSource?, state: string, origin: string?, origin_label: string?, revision: integer, author: string?, created_at: integer?, updated_at: integer?, used_by: UsedBy?,
    archived: boolean?, seq: integer?, projected: boolean?, committed: boolean?,
}
type ResourceFilter = {kind: string?, state: string?, base: string?, q: string?}
type RecentSender = {sender: string, origin: Origin?, count: integer}
type SenderPage = {items: {RecentSender}, next_cursor: string?}
type AssetUsage = {[string]: {string}}
type UsedBy = {messages: {string}?, recent_senders: {RecentSender}?}
type Original = {resource: Resource, entries: {[string]: string}}
type ResourceMap = {[string]: Resource}
type OriginalMap = {[string]: Original}
type LibraryWorkspace = {
    ex: Executor, items: ResourceMap, originals: OriginalMap,
    loaded: {[string]: boolean},
}
type ResourceRevision = ResourceKey & {expected_revision: integer, note: string?, preview_id: string?, command_id: string?}
type ResourceEdit = ResourceContent & {expected_revision: integer, note: string?, preview_id: string?, command_id: string?}
type ResourceCreate = ResourceKey & {note: string?, preview_id: string?, command_id: string?, from: ResourceKey?, title: string?, description: string?,
    html: string?, text: string?, base: string?, subject: string?, schema: VariableSchema?, samples: JsonObject?}
type AssetWrite = {name: string, upload_id: string, command_id: string?, expected_revision: integer?, width: integer?, height: integer?, note: string?,
    title: string?, description: string?}
type ResourceBaseEdit = {name: string, base: string, expected_revision: integer, note: string?, preview_id: string?, command_id: string?}
type ResourceRestore = ResourceRevision & {revision: integer, seq: integer?}
type RevisionChange = {action: string, state: string, restored_from: integer?, note: string?}
type LibraryWrite = {item: Resource, released: {Record}}
type Revision = {action: string, state: string, restored_from: integer?, note: string?, kind: string, name: string, revision: integer, version: integer,
    content: ResourceContent, author: string, created_at: integer}
type LibraryHistoryRequest = ResourceKey & {limit: integer?, cursor: string?}
type LibraryRevisionRequest = ResourceKey & {revision: integer}
type LibraryHistoryPage = {items: {Revision}, next_cursor: string?}
type LibraryAssetRequest = {name: string, revision: integer?}
type LibrarySaveResult = {items: {Resource}?, seq: integer?, projected: boolean?, committed: boolean?}
type LibraryWriteOptions = {preview_id: string?, command_id: string?, identity_op: string?, command_hash: string?}
type OriginalRevisions = {[string]: {[string]: integer}}
type DraftRequest = {attachments: {AttachmentRef}?, resource: ResourceContent?, resources: {ResourceEdit}?, message: string, vars: JsonObject?}
type ResourceSave = {resources: {ResourceEdit}, note: string?, preview_id: string?, command_id: string?}
type EditPreview = DraftRequest & {create: ResourceCreate?, set_base: ResourceBaseEdit?, reset: ResourceRevision?, restore: ResourceRestore?}
type DraftIssue = {code: string, engine_message: string?, message: string, resource: ResourceKey, face: string, candidate_resources: {ResourceKey}}
type PreviewWarning = {code: string, message: string, bytes: integer, threshold_bytes: integer}
type DraftPreview = {subject: string?, html: string?, text: string?, errors: {DraftIssue},
    dependent_messages: {string}, preview_id: string?, inline_assets: InlineAssets?, warnings: {PreviewWarning}?, library_assets: {AssetRef}?}
type LibraryPageRequest = ResourceFilter & {limit: integer?, cursor: string?}
type LibraryRowSummary = ResourceKey & {state: string, revision: integer, seq: integer?, committed: boolean?, projected: boolean?, used_by: {messages: integer?, recent_sources: integer?}?}
type LibraryListRow = LibraryRowSummary & {
    title: string, description: string, origin: string?, origin_label: string?,
    base: string?, author: string?, updated_at: integer?, asset: Asset?,
}
type LibraryDeclaration = ResourceKey & {base: string?, selected: integer}
type LibraryPage = {items: {LibraryListRow}, next_cursor: string?, total: integer, library_seq: integer?}
type LibraryEdit = {key: ResourceKey, content: ResourceContent?, expected: integer?, base: string?, restore: integer?, source_seq: integer?,
    note: string?, from: ResourceKey?, asset_deadline: integer?}
type LibraryRow = {
    asset_upload_id: string?, filename: string?, content_type: string?, size_bytes: integer?, archived: boolean | integer | nil,
    kind: string, name: string, title: string, description: string, html: string, text: string,
    base: string?, subject: string?, schema_json: string, samples_json: string, state: string,
    origin: string?, origin_label: string?, revision: integer, author: string, created_at: integer, updated_at: integer, note: string?,
    version: integer, action: string, restored_from: integer?, last_seq: integer?,
}
type EventContent = {title: string, description: string, html: string, text: string, subject: string?,
    schema: VariableSchema, samples: JsonObject}
type EventAsset = {upload_id: string, filename: string, content_type: string, size: integer}
type LibraryEventBody = {
    key: ResourceKey, revision: integer, author: string, note: string?, change: string, command_hash: string?,
    content: EventContent?, base: string?, state: string?, origin: string?, origin_label: string?,
    preview_id: string?, from: ResourceKey?, previous_base: string?, from_seq: integer?, from_version: integer?,
    asset: EventAsset?, title: string?, description: string?,
}
type ThreadExternal = {external_source: string, external_id: string, external_version: string}
type ThreadLookup = ThreadExternal & {thread_id: string, event_type: string}
type ThreadEvent = {seq: integer, subject: string, body: string, subject_version: integer, created_at: string}
type ThreadHead = {event_count: integer, subject_version: integer?}
type ThreadExpect = {head: integer, subject: string?, version: integer?}
type LibraryEvent = {type: string, body: LibraryEventBody, subject: string, external: ThreadExternal?}
type ThreadAppend = {duplicates: integer, max_seq: integer}
type LibraryThreads = {
    find: (LibraryThreads, {thread_id: string, subject: string?}) -> (ThreadHead?, error?),
    find_event_by_external: (LibraryThreads, ThreadLookup) -> ({event: ThreadEvent?}?, error?),
    list_events: (LibraryThreads, {thread_id: string, from_seq: integer, to_seq: integer, limit: integer}) ->
        ({events: {ThreadEvent}, source_gap: boolean?}?, error?),
    prune_boundary: (LibraryThreads, {thread_id: string}) -> ({max_pruned_seq: integer}?, error?),
    append_events: (LibraryThreads, {thread_id: string, expect: ThreadExpect, events: {LibraryEvent}}) -> (ThreadAppend?, error?),
    catch_up_projection: (LibraryThreads, {thread_id: string, kind: string, target_seq: integer, deadline: string}) ->
        ({done: boolean}?, error?),
}
type PrefetchedLibraryEvent = {type: string, body: LibraryEventBody, seq: integer, created_at: string}
type ProjectionInput = {thread_id: string, range: {from_seq: integer, to_seq: integer}, events: {PrefetchedLibraryEvent}}
type ProjectedResource = Resource & {last_seq: integer}
type ProjectedAsset = EventAsset & {
    name: string, title: string, description: string, origin: string?, origin_label: string?,
    author: string, revision: integer, last_seq: integer, created_at: integer, updated_at: integer,
}
type ProjectedState = {created_at: integer, archived: boolean | integer | nil, upload_id: string?, last_seq: integer}
type HistoryRow = {seq: integer, kind: string, name: string, version: integer, action: string, author: string,
    note: string?, restored_from: integer?, at: integer}
type LiveState = {projected_seq: integer, template_seq: integer}
type FoldEffect = {
    upsert: ProjectedResource?, upsert_asset: ProjectedAsset?, archive: boolean?, delete: boolean?,
    refs: {ResourceKey}?, retire: {upload_id: string, last_seq: integer}?,
    history: HistoryRow, template_change: boolean,
}
type JetEntry = {id: string, kind: string, meta: Record, data: Record}
type TemplateRequest = {template: string}
type PreviewRequest = {template: string, vars: JsonObject, attachments: {AttachmentRef}?}
type PreviewResult = {subject: string, html: string, text: string, inline_assets: InlineAssets?, warnings: {PreviewWarning}?}
type Rendered = {subject: string, html: string?, text: string?, library_assets: {AssetRef}?, inline_assets: InlineAssets?, warnings: {PreviewWarning}?}
type Appearance = {title: unknown, url: string?, sender_name: unknown}
type RenderGlobals = {assets: {Resource}?, site: {title: string, url: string}, sender: {name: string}}
type TemplateParts = {subject: string, html: string, text: string}
type VariableSchema = {type: string, properties: JsonObject, additionalProperties: boolean?}
type TemplateSummary = {name: string, title: string, description: string}
type TemplateInfo = TemplateSummary & {variable_schema: VariableSchema}
type Template = TemplateInfo & {parts: TemplateParts, sample: JsonObject}
type TemplateList = {templates: {TemplateInfo}}
type ToolTemplateList = {templates: {TemplateSummary}}
type TemplateSet = {
    render: (self: TemplateSet, name: string, data: JsonObject) -> (string?, error?),
    release: (self: TemplateSet) -> (),
}
type SchemaIssue = {schema_path: string, instance_path: string}
type Settings = {driver: string, from_address: string, from_name: string, reply_to: string, log_retention_days: unknown?}
type ApiSettings = {api_key: string?}
type SettingsResult = {success: boolean, values: Record?, overridden: {string}?, error: string?}
type SettingsContract = {get_namespace: (self: SettingsContract, input: {namespace: string}) -> (SettingsResult?, error?)}
type SettingInput = {value: unknown}
type SettingValidation = {valid: boolean, error: string?}
type TransportReadiness = {ready: boolean, code: string?, reason: string?}
type TransportStatus = TransportReadiness & {title: string, icon: string, description: string, settings_ns: string,
    max_recipients: integer?, max_message_bytes: integer?, idempotent: boolean}
type AdmittedTransport = TransportStatus & {id: string}
type DeliveryStatus = {driver: {id: string, label: string}?, configured: boolean, ready: boolean,
    transports: {AdmittedTransport}, from: Mailbox?, reply_to: string?, code: string?, reason: string?}
type Mailer = {
    send: (self: Mailer, input: SendRequest) -> (SendResult?, error?),
    resend: (self: Mailer, message_id: string) -> (SendResult?, error?),
    get_message: (self: Mailer, message_id: string) -> (LogMessage?, error?),
    list_messages: (self: Mailer, input: ListRequest) -> (ListResult?, error?),
    list_templates: (self: Mailer) -> (TemplateList?, error?),
    get_template: (self: Mailer, input: TemplateRequest) -> (Template?, error?),
    preview: (self: Mailer, input: PreviewRequest) -> (PreviewResult?, error?),
    delivery_status: (self: Mailer) -> (DeliveryStatus?, error?),
    send_delivery_test: (self: Mailer, input: Record) -> (SendResult?, error?),
}
type Transport = {
    send: (self: Transport, input: TransportRequest) -> (TransportResult?, error?),
    status: (self: Transport) -> (TransportStatus?, error?),
}
type UserResult = {ok: boolean, user: {user_id: string, email: string}?, error: string?}
type Users = {get_user: (self: Users, input: {identifier: string}) -> (UserResult?, error?)}
type AttachmentInput = {refs: {AttachmentRef}?, library_assets: {AssetRef}?, message_bytes: integer, max_message_bytes: integer?}
type ContentInfo = {size: number, filename: string, content_type: string, source_ref: {component_id: string?}?}
type Content = {content: string, content_type: string, truncated: boolean?}
type ContentFailure = {success: boolean, error: error}
type ContentProvider = {
    get_info: (self: ContentProvider, input: {format: string}) -> (ContentInfo | ContentFailure | nil, error?),
    get_content: (self: ContentProvider, input: {format: string, max_size: number}) -> (Content | ContentFailure | nil, error?),
}
type SinkRequest = {sink_op: string, input: Record, idempotency_key: string, origin: string, automation_ref: {id: string}?}
type SinkResult = {success: true, result: string, dest_ref: MessageRef?}
type SinkFailure = {success: false, error: {code: string, message: string, retriable: boolean, scope: string, details: Record?}}
type WritableSink = {
    origin: (SinkRequest) -> (string?, SinkFailure?),
    fail: (string, string?, boolean?, string?, Record?) -> SinkFailure,
}
type Realtime = {broadcast: (self: Realtime, input: {topic: string}) -> ({success: boolean, error: string?}?, error?)}
type TestSend = {message: string, vars: JsonObject?}

type Library = {
    list: (self: Library, input: LibraryPageRequest) -> (LibraryPage?, error?),
    get: (self: Library, input: ResourceKey) -> (Resource?, error?),
    read_history: (self: Library, input: LibraryHistoryRequest) -> (LibraryHistoryPage?, error?),
    read_revision: (self: Library, input: LibraryRevisionRequest) -> (Revision?, error?),
    asset_content: (self: Library, input: LibraryAssetRequest) -> (AssetContent?, error?),
    preview: (self: Library, input: EditPreview) -> (DraftPreview | Rendered | nil, error?),
    create: (self: Library, input: ResourceCreate) -> (Resource?, error?),
    update: (self: Library, input: ResourceEdit) -> (Resource?, error?),
    save: (self: Library, input: ResourceSave) -> (LibrarySaveResult?, error?),
    set_base: (self: Library, input: ResourceBaseEdit) -> (Resource?, error?),
    reset: (self: Library, input: ResourceRevision) -> (Resource?, error?),
    restore: (self: Library, input: ResourceRestore) -> (Resource?, error?),
    delete: (self: Library, input: ResourceRevision) -> (boolean?, error?),
    add_asset: (self: Library, input: AssetWrite) -> (Resource?, error?),
    send_test: (self: Library, input: TestSend) -> (SendResult?, error?),
}

type HttpAuth = {user: string, pass: string}
type HttpResponse = {status_code: number, headers: {[string]: string | {string}}, body: string}

local function origin_text(value: unknown): boolean
    return type(value) == "string" and #value <= 256 and utf8.len(value) ~= nil
        and value:find("%S") ~= nil and value:find("%c") == nil
end


return {
    origin_text = origin_text,
    DB = DB, Executor = Executor, Transaction = Transaction, TransactionWork = TransactionWork, TransportResult = TransportResult,
    MessageRef = MessageRef, ListRequest = ListRequest, ListQuery = ListQuery, ListResult = ListResult, LogMessage = LogMessage,
    MessageError = MessageError, MessageRow = MessageRow, ResendSource = ResendSource, Admission = Admission, AdmissionResult = AdmissionResult,
    MessageInsert = MessageInsert, KeyRow = KeyRow, InsertOutcome = InsertOutcome, Outcome = Outcome,
    DueRow = DueRow, Deadlines = Deadlines, MessageContent = MessageContent, DeliveryContent = DeliveryContent,
    MessagePage = MessagePage, SenderPage = SenderPage,
    Job = Job, JobInput = JobInput, Lease = Lease, ActorRow = ActorRow, OwnerInput = OwnerInput, JobCompletion = JobCompletion,
    OwnerResult = OwnerResult, BlockedAsset = BlockedAsset, ComponentAccessContract = ComponentAccessContract,
    ResourceKey = ResourceKey, ResourceReferences = ResourceReferences, ReferenceClosure = ReferenceClosure, PreviewRow = PreviewRow,
    ResourceContent = ResourceContent, Resource = Resource, ResourceFilter = ResourceFilter,
    Original = Original, OriginalMap = OriginalMap, ResourceMap = ResourceMap, LibraryWorkspace = LibraryWorkspace, ResourceRevision = ResourceRevision,
    ResourceEdit = ResourceEdit, ResourceCreate = ResourceCreate, ResourceBaseEdit = ResourceBaseEdit,
    ResourceRestore = ResourceRestore, Revision = Revision, OriginalRevisions = OriginalRevisions, DraftRequest = DraftRequest,
    Library = Library, LibraryHistoryRequest = LibraryHistoryRequest, LibraryRevisionRequest = LibraryRevisionRequest,
    LibraryHistoryPage = LibraryHistoryPage, LibraryAssetRequest = LibraryAssetRequest, LibrarySaveResult = LibrarySaveResult,
    ResourceSave = ResourceSave, LibraryEdit = LibraryEdit, RecentSender = RecentSender, AssetUsage = AssetUsage, UsedBy = UsedBy,
    LibraryRow = LibraryRow, LibraryWrite = LibraryWrite, JetEntry = JetEntry,
    LibraryEvent = LibraryEvent, LibraryEventBody = LibraryEventBody, EventContent = EventContent, EventAsset = EventAsset,
    PrefetchedLibraryEvent = PrefetchedLibraryEvent, ProjectionInput = ProjectionInput,
    ProjectedResource = ProjectedResource, ProjectedAsset = ProjectedAsset, ProjectedState = ProjectedState,
    HistoryRow = HistoryRow, LiveState = LiveState, FoldEffect = FoldEffect,
    JsonObject = JsonObject, Record = Record, Recipient = Recipient, Mailbox = Mailbox,
    Asset = Asset, AssetWrite = AssetWrite, AssetContent = AssetContent, AssetPart = AssetPart, AssetReadRequest = AssetReadRequest, AssetRef = AssetRef, InlineAssets = InlineAssets, AttachmentRef = AttachmentRef, Attachment = Attachment, Origin = Origin, SendRequest = SendRequest, Addresses = Addresses,
    DeliveryMessage = DeliveryMessage, TransportRequest = TransportRequest, SendResult = SendResult, TemplateRequest = TemplateRequest,
    PreviewRequest = PreviewRequest, PreviewResult = PreviewResult, PreviewWarning = PreviewWarning, Rendered = Rendered,
    Appearance = Appearance, RenderGlobals = RenderGlobals, TemplateParts = TemplateParts,
    VariableSchema = VariableSchema, TemplateSummary = TemplateSummary, Template = Template, TemplateList = TemplateList,
    ToolTemplateList = ToolTemplateList, TemplateSet = TemplateSet, SchemaIssue = SchemaIssue,
    Settings = Settings, ApiSettings = ApiSettings,
    SettingsResult = SettingsResult, SettingsContract = SettingsContract, SettingInput = SettingInput, SettingValidation = SettingValidation,
    Mailer = Mailer, Transport = Transport, TransportStatus = TransportStatus, TransportReadiness = TransportReadiness, AdmittedTransport = AdmittedTransport, Users = Users, ContentInfo = ContentInfo, Content = Content, AttachmentInput = AttachmentInput,
    ContentFailure = ContentFailure, ContentProvider = ContentProvider, SinkRequest = SinkRequest,
    SinkResult = SinkResult, SinkFailure = SinkFailure, WritableSink = WritableSink, Realtime = Realtime, DeliveryStatus = DeliveryStatus, TestSend = TestSend, HttpAuth = HttpAuth, HttpResponse = HttpResponse,
}
