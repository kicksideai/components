-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")

type Executor = sql.DB | sql.Transaction
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
type InlineAssets = {[string]: string}
type Attachment = {filename: string, content_type: string, content: string, disposition: string, content_id: string?}
type Origin = {kind: string, id: string, label: string}
type SendRequest = {
    template: string?, vars: JsonObject?, subject: string?, text: string?, html: string?,
    to: {Recipient}, cc: {Recipient}?, bcc: {Recipient}?, reply_to: string?,
    attachments: {AttachmentRef}?, idempotency_key: string?, origin: Origin?,
}
type Addresses = {to: {string}, cc: {string}?, bcc: {string}?}
type TransportRequest = Addresses & {
    from: Mailbox, reply_to: string?, subject: string, html: string?, text: string?,
    attachments: {Attachment}?, idempotency_key: string?,
}
type TransportResult = {provider_message_id: string?}
type SendResult = {message_id: string, status: string}
type MessageRef = {message_id: string}
type PrincipalLabel = {kind: string, id: string, label: string}
type PrincipalRef = {type: string, id: string}
type DirectoryPrincipal = PrincipalRef & {label: string}
type PrincipalDirectory = {resolve: (PrincipalDirectory, {refs: {PrincipalRef}}) -> ({principals: {DirectoryPrincipal}}?, error?)}
type Capabilities = {send: boolean, edit_library: boolean, administer_delivery: boolean}
type ListRequest = {status: string?, template: string?, since: integer?, q: string?, limit: integer, cursor: string?}
type ListResult = {items: {LogMessage}, next_cursor: string?, has_more: boolean, total: integer?, failed_today: integer?}
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
type Job = {id: string, lease_token: string, execution_seq: integer}
type JobInput = {job: Job, payload: {message_id: string}}
type Lease = {token: string, execution_seq: integer}
type ActorRow = {actor_id: string, actor_context: string}
type OwnerInput = {change: {kind: string?, job_id: string?, owner_locator: {kind: string, id: string}?}?}
type OwnerResult = {success: boolean, deleted: integer?, deadline_ms: integer?, needs_continue: boolean?, error: error?}
type ResourceKey = {kind: string, name: string}
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
}
type ResourceFilter = {kind: string?, state: string?, base: string?, q: string?}
type RecentSender = {sender: string, origin: Origin?, count: integer}
type UsedBy = {messages: {string}?, recent_senders: {RecentSender}?}
type Original = {resource: Resource, entries: {[string]: string}}
type ResourceMap = {[string]: Resource}
type OriginalMap = {[string]: Original}
type ResourceRevision = ResourceKey & {expected_revision: integer, note: string?}
type ResourceEdit = ResourceContent & {expected_revision: integer, note: string?}
type ResourceCreate = ResourceKey & {note: string?, preview_id: string?, from: ResourceKey?, title: string?, description: string?,
    html: string?, text: string?, base: string?, subject: string?, schema: VariableSchema?, samples: JsonObject?}
type AssetWrite = {name: string, upload_id: string, expected_revision: integer?, width: integer?, height: integer?, note: string?,
    title: string?, description: string?}
type ResourceBaseEdit = {name: string, base: string, expected_revision: integer, note: string?}
type ResourceRestore = ResourceRevision & {revision: integer}
type RevisionChange = {action: string, state: string, restored_from: integer?, note: string?}
type Revision = RevisionChange & {kind: string, name: string, revision: integer, version: integer,
    content: ResourceContent, author: string, created_at: integer}
type OriginalRevisions = {[string]: {[string]: integer}}
type DraftRequest = {attachments: {AttachmentRef}?, resource: ResourceContent?, resources: {ResourceContent}?, message: string, vars: JsonObject?}
type ResourceSave = {resources: {ResourceEdit}, note: string?, preview_id: string?}
type EditPreview = DraftRequest & {create: ResourceCreate?}
type DraftIssue = {code: string, message: string, resource: ResourceKey, face: string}
type DraftPreview = {subject: string?, html: string?, text: string?, errors: {DraftIssue},
    dependent_messages: {string}, preview_id: string?, inline_assets: InlineAssets?, library_assets: {AssetRef}?}
type LibraryPageRequest = ResourceFilter & {limit: integer?, cursor: string?}
type LibraryRowSummary = ResourceKey & {state: string, revision: integer, used_by: {messages: integer?, recent_sources: integer?}?}
type LibraryListRow = LibraryRowSummary & {
    title: string, description: string, origin: string?, origin_label: string?,
    base: string?, author: string?, updated_at: integer?,
}
type LibraryPage = {items: {LibraryListRow}, next_cursor: string?}
type LibraryEdit = {key: ResourceKey, content: ResourceContent?, expected: integer?, base: string?, restore: integer?, note: string?, from: ResourceKey?}
type LibraryRow = {
    asset_upload_id: string?, filename: string?, content_type: string?, size_bytes: integer?, width: integer?, height: integer?,
    kind: string, name: string, title: string, description: string, html: string, text: string,
    base: string?, subject: string?, schema_json: string, samples_json: string, state: string,
    origin: string?, revision: integer, author: string, created_at: integer, updated_at: integer, note: string?,
    version: integer, action: string, restored_from: integer?,
}
type JetEntry = {id: string, kind: string, meta: Record, data: Record}
type TemplateRequest = {template: string}
type PreviewRequest = {template: string, vars: JsonObject, attachments: {AttachmentRef}?}
type PreviewResult = {subject: string, html: string, text: string, inline_assets: InlineAssets?}
type Rendered = {subject: string, html: string?, text: string?, library_assets: {AssetRef}?, inline_assets: InlineAssets?}
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
type Driver = {id: string, label: string, icon: string, description: string, binding: string,
    settings_ns: string, available_func: string, max_recipients: integer?, max_message_bytes: integer?}
type Availability = {available: boolean, reason: string?}
type Settings = {driver: string, from_address: string, from_name: string, reply_to: string}
type ApiSettings = {api_key: string?}
type SettingsResult = {success: boolean, values: Record?, error: string?}
type SettingsContract = {get_namespace: (self: SettingsContract, input: {namespace: string}) -> (SettingsResult?, error?)}
type SettingInput = {value: unknown}
type SettingValidation = {valid: boolean, error: string?}
type Mailer = {
    send: (self: Mailer, input: SendRequest) -> (SendResult?, error?),
    resend: (self: Mailer, message_id: string) -> (SendResult?, error?),
    get_message: (self: Mailer, message_id: string) -> (LogMessage?, error?),
    list_messages: (self: Mailer, input: ListRequest) -> (ListResult?, error?),
    list_templates: (self: Mailer) -> (TemplateList?, error?),
    get_template: (self: Mailer, input: TemplateRequest) -> (Template?, error?),
    preview: (self: Mailer, input: PreviewRequest) -> (PreviewResult?, error?),
}
type Transport = {send: (self: Transport, input: TransportRequest) -> (TransportResult?, error?)}
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
type SinkRequest = {sink_op: string, input: SendRequest, idempotency_key: string, origin: string, automation_ref: {id: string}?}
type SinkResult = {success: true, result: string, dest_ref: MessageRef}
type SinkFailure = {success: false, error: {code: string, message: string, retriable: boolean, scope: string, details: Record?}}
type WritableSink = {
    origin: (SinkRequest) -> (string?, SinkFailure?),
    fail: (string, string?, boolean?, string?, Record?) -> SinkFailure,
}
type Realtime = {broadcast: (self: Realtime, input: {topic: string, data: Record}) -> ({success: boolean, error: string?}?, error?)}
type DeliveryStatus = {driver: {id: string, label: string}?, configured: boolean, from: Mailbox?, reply_to: string?, reason: string?}
type TestSend = {message: string, vars: JsonObject?}

type HttpAuth = {user: string, pass: string}
type HttpResponse = {status_code: number, headers: {[string]: string | {string}}, body: string}

return {
    Executor = Executor, TransactionWork = TransactionWork, TransportResult = TransportResult,
    MessageRef = MessageRef, ListRequest = ListRequest, ListResult = ListResult, LogMessage = LogMessage,
    MessageError = MessageError, MessageRow = MessageRow, Admission = Admission, AdmissionResult = AdmissionResult,
    Job = Job, JobInput = JobInput, Lease = Lease, ActorRow = ActorRow, OwnerInput = OwnerInput, OwnerResult = OwnerResult,
    ResourceKey = ResourceKey, ResourceContent = ResourceContent, Resource = Resource, ResourceFilter = ResourceFilter,
    Original = Original, OriginalMap = OriginalMap, ResourceMap = ResourceMap, ResourceRevision = ResourceRevision,
    ResourceEdit = ResourceEdit, ResourceCreate = ResourceCreate, ResourceBaseEdit = ResourceBaseEdit,
    ResourceRestore = ResourceRestore, Revision = Revision, OriginalRevisions = OriginalRevisions, DraftRequest = DraftRequest,
    ResourceSave = ResourceSave, LibraryEdit = LibraryEdit, RecentSender = RecentSender, UsedBy = UsedBy,
    LibraryRow = LibraryRow, JetEntry = JetEntry,
    JsonObject = JsonObject, Record = Record, Recipient = Recipient, Mailbox = Mailbox,
    Asset = Asset, AssetWrite = AssetWrite, AssetPart = AssetPart, AssetRef = AssetRef, InlineAssets = InlineAssets, AttachmentRef = AttachmentRef, Attachment = Attachment, Origin = Origin, SendRequest = SendRequest, Addresses = Addresses,
    TransportRequest = TransportRequest, SendResult = SendResult, TemplateRequest = TemplateRequest,
    PreviewRequest = PreviewRequest, PreviewResult = PreviewResult, Rendered = Rendered, RenderGlobals = RenderGlobals, TemplateParts = TemplateParts,
    VariableSchema = VariableSchema, TemplateSummary = TemplateSummary, Template = Template, TemplateList = TemplateList,
    ToolTemplateList = ToolTemplateList, TemplateSet = TemplateSet, SchemaIssue = SchemaIssue,
    Driver = Driver, Availability = Availability, Settings = Settings, ApiSettings = ApiSettings,
    SettingsResult = SettingsResult, SettingsContract = SettingsContract, SettingInput = SettingInput, SettingValidation = SettingValidation,
    Mailer = Mailer, Transport = Transport, Users = Users, ContentInfo = ContentInfo, Content = Content, AttachmentInput = AttachmentInput,
    ContentFailure = ContentFailure, ContentProvider = ContentProvider, SinkRequest = SinkRequest,
    SinkResult = SinkResult, SinkFailure = SinkFailure, WritableSink = WritableSink, Realtime = Realtime, DeliveryStatus = DeliveryStatus, TestSend = TestSend, HttpAuth = HttpAuth, HttpResponse = HttpResponse,
}
