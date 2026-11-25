<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# KickSide Mail

Mail queues email from an installation-managed address and delivers it through an installed driver. It supplies a mailer contract, agent tools, a virtual Workflow Block, and an automation destination.

## Requirements

Install KickSide Settings, Contract, Component, Core, Jobs, Execution, Users, Uploads, `wippy/views`, and at least one mail driver. Bind `kickside.mail:target_db` to the SQL resource Jobs uses. Mail opens the Users provisioning contract under the caller and reads each distinct user ID once. The pinned Users contract exposes a single-user lookup. Mail supplies the ContentProvider call permissions at admission and in the attachment reader. Uploads checks component access under the caller at admission and under the sender’s current identity in the worker. Drivers receive the bytes after those checks. Template discovery follows the caller’s registry visibility. Template declarations can provide `template.origin_label` for display in the library.

Assign **Send mail** to groups that may send messages. **Edit mail library** grants access to list, inspect, preview, and edit library resources. Assign **Administer mail delivery** to administrators who manage the Mail settings through the platform Settings surface. The installed driver has a separate administration capability. Mailer contract callers can read their own delivery log. The Activity HTTP endpoints require delivery administration. Assign **Read all mail delivery logs** to groups that need to read messages from all senders.

## Settings

With Mail Admin installed, open **Settings → Integrations → Mail** to choose an admitted delivery service and set the From address. Without Mail Admin, the generated **Mail** section edits the sender and retention settings; the driver setting is hidden from the generic form and is written through the Settings contract. The display name and default Reply-To address are optional. A message can supply its own Reply-To address. The installation’s configured From applies to every message.

- `driver` selects an admitted transport by its exact contract binding ID.
- `from_address` sets the sender’s email address.
- `from_name` sets the sender’s display name.
- `reply_to` sets the default reply address.
- `log_retention_days` sets how long to keep sent and failed rows. It defaults to 30 and accepts 1 to 3650 days.

## Contracts and tools

`kickside.mail:mailer` exposes `send`, `resend`, `get_message`, `list_messages`, `list_templates`, `get_template`, `preview`, `delivery_status`, and `send_delivery_test`. The corresponding tools are `MailSend`, `MailListTemplates`, `MailGetTemplate`, and `MailPreview`. The `kickside.mail.traits:mail` trait includes all four. The `kickside.mail.traits:mail_readonly` trait includes the three template tools.

Supply a nonempty `to` list and either a `template` with its `vars`, or a `subject` with `text`, `html`, or both. `cc` and `bcc` use the same address or `{user_id}` entries as `to`. After resolving user IDs, Mail includes each address once, comparing local parts exactly and domains case-insensitively in To, Cc, then Bcc order. Mail accepts unquoted ASCII local parts and dotted ASCII domains, including domains already encoded as Punycode. Subjects allow up to 255 characters and each raw or rendered body allows up to 256 KiB. `attachments` accepts up to ten upload references with a 25 MiB raw combined limit. The configured driver’s total message limit also applies, including attachment encoding overhead. Mail uses the basename of the supplied or stored upload filename, up to 255 bytes, and uses `attachment` for an empty name. An inline reference supplies a `content_id` that the HTML can address as `cid:<content_id>`.

Send validates and renders the message, commits it with a delivery job, and returns `{message_id, status = "queued"}`. An optional `idempotency_key` of up to 2048 bytes names the write for that sender while its log row exists. Repeating the key and message content returns the original ID and current status. Different content with the same key returns `idempotency_conflict`.

Read the log entry with `get_message(message_id)`. Subscribe to the payload-free `mail.activity` invalidation before reading, then refetch on each hint. A retry keeps `status = "queued"` and records the attempt and `next_attempt_at`. A committed `sent` or `failed` status and its `finished_at` are the completion signal. The durable read remains authoritative if a listener misses a hint. It becomes `sent` when the provider accepts the message, with a provider ID if supplied, or `failed` with a structured `last_error`. If a job ends without recording an outcome, `delivery_interrupted` indicates that the provider may have accepted the email. Only callers with **Read all mail delivery logs** see `driver_id`, `provider_message_id`, and a sanitized provider excerpt in `last_error.provider_detail` when present. `list_messages({limit, status?, since?, cursor?})` gives most recent entries first. Dates and `since` use Unix milliseconds. Use the returned `next_cursor` for the next page. The log stores metadata, recipient addresses including Bcc, and attachment references until expiry. Queued mail retains its rendered bodies for delivery. Sent mail discards them on completion. Failed mail keeps its rendered bodies for resend until the log row expires. Expiry defaults to 30 days after completion and follows `log_retention_days`. Provider excerpts omit addresses and words echoed from the subject and rendered bodies. Jobs stores a failure code.

On the first attempt the worker pins the active binding. Each attempt checks that the binding is still admitted and that the sender still holds **Send mail**. It passes the message ID to providers with idempotency support. For retryable rate limits, timeouts, provider unavailability, or sends already in progress, Mail allows up to 32 attempts with exponential delays from one second to five minutes. A provider retry hint can extend an interval up to 15 minutes. When the HTTP client reports a retryable error without a response, Mail records `provider_transport_failed`. If a non-idempotent transport might have accepted the request before communication failed, Mail records `delivery_uncertain` and leaves it for an administrator to check.

The `notice` template supplies plain-text and HTML parts. Set `subject` and any combination of an opening message, headings, paragraphs, labeled details, a web action link, or an inline image. Use `MailGetTemplate` for its variable schema and `MailPreview` for the rendered parts.

`MailSend` appears as a virtual Block. A Workflow can pass the message from a preceding step and fix optional fields in Block configuration. The `kickside.mail.sink:send_email` automation destination queues one message per origin and stable `identity_key` and returns `dest_ref.message_id`. Redelivery with the same message replays that result within the log retention window. Different content for the same identity returns `idempotency_conflict`. When the caller omits `identity_key`, Mail uses the origin, operation and per-delivery `idempotency_key`. The port accepts `upsert` and `delete`, and direct callers of its writable binding can also use `create`. A source `delete` requires **Send mail** and succeeds without a payload, a delivery key, or a new message.

### Transport drivers

Depend on `kickside/mail` and bind the `send` and `status` methods of
`kickside.mail:transport`. The contract lives in the root registry. Its
input, acceptance, and status schemas ship with Mail. [Send input](schemas/transport.input.json) ·
[Send output](schemas/transport.output.json) · [Status output](schemas/transport.status.output.json)

**Admission and authority**

Join Mail's public transports group from a policy in the driver namespace. Its only
resource is the binding ID and its only action is `contract.open`.

```yaml
- name: transport_open
  kind: security.policy
  meta: {private: true}
  groups: [kickside.mail.security:transports]
  policy:
    resources: [example.mail.driver:transport]
    actions: [contract.open]
    effect: allow
```

Mail discovers contract implementations and tries to open them under that
group. An open refusal excludes the binding from the available transports.
The administration contract and HTTP status endpoint require Mail delivery
administration. The active driver key is writable through Settings by callers
with **Administer mail delivery**. The selected descriptor's `settings_ns`
feeds the generic Settings editor. The driver owns its settings definitions
and separately grants permission to administer them.

Attach Settings read access to the driver functions. Grant
`contract.get`, `contract.open` and `contract.call` for the Settings contract,
its default binding and `get_namespace`, as required by the pinned Settings
runtime. Secrets with `read_access: admin` also require access on
`kickside.settings.api:list_settings.endpoint`; confine that capability to
the frame reading the driver's own namespace. Attach a separate
`http_client.request` policy only to `send`. A host-overridable HTTPS
destination requirement must update both the driver's endpoint entry and
its policy resource. An exact destination includes the full path. If the path
contains a runtime domain setting, a host requirement can declare an HTTPS
path prefix ending in `/*`. Validate the domain before appending it.

**Requests and readiness**

`send` receives `from` (`address` and optional `name`), `to`, `cc`, `bcc`,
`reply_to`, `subject`, one or both rendered `text` and `html` faces, optional
`attachments`, a Mail-generated `idempotency_key`, and a Jobs RFC3339
`deadline`. Each attachment carries `filename`, `content_type`, and original
bytes in `content`. `disposition` is `attachment` or `inline`. An inline
attachment includes `content_id` matching the rendered HTML CID. Return
`{provider_message_id = id}` on acceptance if the service supplies one, or
an empty record on acceptance without an ID.

`status` reports `title`, `icon`, `description`, `settings_ns`, `idempotent`
and `ready` without contacting the provider. Optional positive integer
`max_recipients` and `max_message_bytes` govern admission and delivery.
Recipient limits count To, Cc and Bcc together. The size budget includes
body, address, header and encoded-attachment overhead. Use
`^[a-z][a-z0-9_]*$` for status codes and provide a reason that an
administrator can act on. Return native errors for unexpected failures.

Mail pins the open binding at the first delivery attempt. The idempotency
key is the Mail message ID and remains the same across retries. Declare
`idempotent: true` when the provider honors that stable key. Keep a native
error's kind and retry flag. Mail records retry or terminal status durably
and normalizes known classifications for ordinary senders. The driver
authoring example and error mapping explain the complete provider-side
wiring. [Worked driver and harness](https://github.com/kicksideai/providers/blob/main/mail-resend/src/driver-authoring.md)

**Public Lua helpers**

`kickside.mail.driver:config`

- `settings(namespace)` returns the settings values and a native error.
- `api_key(values, service)`, `read_api_key(namespace, service)` return a valid key or an `invalid_config` error with a stable reason.
- `validate_api_key(input)` validates a Settings write.
- `endpoint(entry_id, region, mode?)` returns the HTTPS `origin` without its trailing slash, `exact` URL as declared, or `prefix` base without `/*`. Defaults to origin mode.
- `status_error(err)`, `missing(message, reason_code?, reason?)` return a readiness record and a typed setup error, respectively.
- `mailbox(from)`, `address(value)` format or validate a sender address.

`kickside.mail.driver:http`

- `post(url, body, headers, deadline, auth?)` makes a provider POST within the supplied deadline and returns a response or native error.
- `bearer_json(key)` returns authorization and JSON headers.
- `encode_message(record)`, `encode_attachment(bytes)` return JSON or Base64 and a native error.
- `retry_hint(response, reset_header, units)` returns milliseconds until retry or `nil`. Units are `seconds`, `epoch_seconds` or `epoch_milliseconds`.
- `response_detail(response, key, basic_user?)` returns bounded provider detail after redaction.
- `failure(kind, code, message, retryable, status?, retry_after_ms?, provider_detail?)` builds a classified native error.
- `status_error(status, rejected_status, retry_after_ms?, provider_detail?)`, `authorization_refused(status, provider_detail?)` classify HTTP errors.
- `message_id(response)` returns an acceptance result with a nonempty JSON `id` if supplied.

Mail maps `credentials_invalid`, `authorization_refused`,
`sender_or_recipient_not_allowed`, `request_rejected` and
`idempotency_conflict` to `provider_rejected` in the sender's Activity.
`send_in_progress` and `delivery_deadline_exceeded` map to
`provider_unavailable`, and `quota_exhausted` maps to `rate_limited`.
`settings_read_failed`, `invalid_transport_status` and
`provider_endpoint_invalid` map to `invalid_config`. Administrators with
**Read all mail delivery logs** see the original classified code and
bounded redacted provider detail. Keep secrets out of arguments to
logging functions and native error messages.

### Delivery administration API

`GET /mail/delivery` requires **Administer mail delivery**. It returns the
active driver summary, sender, reply-to address, readiness, and the status
of every admitted transport. Each transport includes its exact binding ID
and its settings namespace. Read the selected namespace through Platform
Settings, which masks secret values. `driver_revision` is the revision of the
stored `driver` setting (0 while it holds its default); pass it as
`expected_revision` when writing `driver` so a concurrent change is refused. When configuration is incomplete,
`code` identifies the issue and `reason` tells the administrator what to do.

## Template library

The library stores messages, base templates, parts, and image assets. Messages, bases, and parts have HTML and text faces. A message also has a subject, a variable schema with samples, and the name of its base. A part declares its inputs. The starter library ships Standard and Plain bases and composes Notice from editable parts.

Each edit appends an event to the library component’s thread. Create, update, base change, reset, and restore events carry the resulting resource snapshot. Content across both faces and the description is limited to 512 KiB per resource. The projection updates the library, reference index, and History together. The resource revision is its subject version, and `seq` is its position on the shared library thread. Unedited packaged originals start at revision zero.

The `library_sync` job publishes Jet sets from the committed projection. Mail supports single-node template publishing in this release. A render checks the live registry marker against the committed template sequence and returns retryable `mail_library_publishing` while publication is pending. Jobs retries transient publication failures. At boot and during retention, Mail compares the live marker with the committed template sequence and enqueues publication if it is behind. Committed edits remain available through the library read model after projection.

A message selects its base as data. The base provides a `body()` block and the message supplies that block's content. Include a part by its absolute Jet name and pass its inputs as the context.

```jet
{{ block body() }}
  <p>{{ vars.greeting }}</p>
  {{ include "/part/button" map("action_url", vars.url, "action_label", "Open") }}
{{ end }}
```

Parts read passed inputs through the dot context. Templates can also read `site.title`, `site.url`, `sender.name`, `message.subject`, and `message.preheader` in both faces. Use `vars` for declared message variables.

Lua callers with **Edit mail library** open `kickside.mail:library` through `kickside.mail:client`. Use `list` for summaries (filter by `kind`, `state`, `base`, a search `q`, or up to 100 exact `names`; HTTP takes `names` comma-separated), `get` for editable source, `asset_content` for image bytes, and `read_history` and `read_revision` for saved versions. The write methods are `create`, `update`, `save`, `set_base`, `reset`, `restore`, `delete`, and `add_asset`. Use `send_test` to queue the selected saved message to the acting editor’s email address. Use `add_asset` for uploads. Omit `expected_revision` to create an image or provide the current revision to replace it. The existing HTTP POST and PUT paths dispatch uploads to this method.

Use `preview` to render a saved message or review a draft against a selected message. The HTTP preview path is `POST /mail/library/preview`. Preview the proposed non-image create, update, save, base change, reset, or restore, then send the returned `preview_id` with the write. Preview IDs belong to the issuing actor and expire after 15 minutes. Writes to an existing resource also require its current `expected_revision`. Supply a UUID `command_id` to replay the same write safely. A write can return `seq`, `committed: true`, and `projected: false` when the projection is still catching up. Refetch when the library invalidation arrives. `delete` acknowledges success with a boolean.

History pages list one item per retained event in descending sequence order. Request `read_revision` or `restore` with the History item’s `seq`. Core retains library events for 365 days under the component policy. A request for a pruned event returns `mail_revision_pruned`. Restore appends a new event with the selected historical content. Reset uses the currently shipped original.

Mail broadcasts topic-only `mail.library` and `mail.activity` invalidations after writes commit. Subscribers read the affected view through the API using their own access.

## Library images

Add a named image from your completed Uploads file with **Edit mail library** or the `MailAssetAdd` tool. Mail supports PNG, JPEG, and GIF images up to 1 MiB. Mail gets the media type and byte size from Uploads. Only the person who uploaded the source can adopt it into the library. Bind `kickside.mail:library_editor_grant` to the host editor group with `subject_type: group` and `access_mask: 3`.

Use the `assets` map in any HTML message, base, or part. Use brackets for names containing a hyphen.

```html
<img src="{{ assets.logo }}" alt="Team mark">
<img src='{{ assets["event-banner"] }}' alt="Event banner">
```

The shipped Header uses `logo`. Replace the image to change every email that uses Header. Reset restores the logo in the currently installed package. An original revision and a queued reference to an original resolve the package's current file. Adopted versions remain available for retained revisions, queued delivery and the existing failed-message resend window.

Mail attaches each library image referenced in rendered HTML once. It counts the image and transfer encoding toward the driver’s size limit. Message and draft previews expose a content-ID-to-data-URI map in `inline_assets`. Pass optional inline `attachments` to also preview caller-owned uploads referenced by the HTML. The plain-text face has no library image map.

Asset list summaries include a `used_by.messages` count. Asset details return the sorted message names. Usage follows source references through messages, bases, and parts, including packaged originals. The projection updates the reference index from the library events.

## Error codes

The native error kind and retry flag come from the operation. The generated reference lists Mail-defined error codes, setup reasons and diagnostics. External errors can retain their original codes. The writable destination and sender-facing Activity apply their declared mappings.

<!-- BEGIN MAIL CODES -->

```text
Code                                   Declared in
access_denied                          domain/failure.lua
api_key_invalid                        driver/config.lua
api_key_required                       driver/config.lua
attachment_empty                       domain/failure.lua, domain/message.lua
attachment_encoding_failed             domain/failure.lua, driver/http.lua
attachment_unavailable                 domain/failure.lua, read/content.lua
attachments_too_large                  domain/failure.lua, domain/message.lua
authentication_required                api/request.lua
authorization_refused                  driver/http.lua
body_required                          domain/message.lua, render/render.lua
credentials_invalid                    driver/http.lua
delivery_deadline_exceeded             driver/http.lua
delivery_deadline_invalid              driver/http.lua
delivery_failed                        command/outbox.lua, domain/failure.lua, read/activity.lua
delivery_interrupted                   command/outbox.lua, domain/failure.lua
delivery_state_changed                 command/outbox.lua
delivery_uncertain                     command/outbox.lua, domain/failure.lua, domain/policy.lua
driver_not_admitted                    command/send.lua, domain/config.lua, domain/failure.lua
driver_not_configured                  domain/config.lua
driver_not_installed                   read/transports.lua
driver_required                        read/transports.lua
duplicate_mail_resource                command/preview.lua, domain/edit.lua
duplicate_template_name                render/originals.lua
from_address_invalid                   domain/config.lua
from_address_required                  domain/config.lua
from_name_invalid                      domain/config.lua
from_not_allowed                       domain/message.lua
gmail_html_clipping                    render/render.lua
html_too_large                         domain/message.lua
http_context_required                  api/request.lua
idempotency_conflict                   command/send.lua, sink/write.lua
incomplete_attachment                  domain/failure.lua, read/content.lua
invalid_address                        domain/message.lua
invalid_attachment                     domain/failure.lua, domain/message.lua
invalid_attachment_filename            domain/failure.lua, domain/message.lua
invalid_attachment_size                domain/failure.lua, domain/message.lua
invalid_body                           domain/message.lua, render/render.lua
invalid_config                         domain/config.lua, domain/failure.lua, sink/write.lua
invalid_content_id                     domain/failure.lua, domain/message.lua, read/content.lua
invalid_header_text                    domain/message.lua
invalid_idempotency_key                domain/message.lua
invalid_identity_key                   domain/message.lua
invalid_mail_asset                     binding/library.lua, command/assets.lua, command/library_edits.lua, command/preview.lua, domain/resource.lua, read/content.lua, read/library.lua
invalid_mail_command_id                domain/edit.lua
invalid_mail_draft                     command/preview.lua
invalid_mail_filter                    domain/resource.lua, read/history.lua, read/library.lua
invalid_mail_origin                    domain/message.lua
invalid_mail_resource                  command/library_edits.lua, domain/resource.lua
invalid_mail_resources                 command/library_edits.lua, command/preview.lua
invalid_mail_revision                  command/assets.lua, domain/edit.lua, read/history.lua
invalid_mail_test                      command/send.lua
invalid_message                        domain/message.lua
invalid_recent_senders_cursor          persist/message_reader.lua
invalid_request                        api/request.lua, command/send.lua, read/activity.lua, sink/write.lua
invalid_revision_note                  domain/resource.lua
invalid_subject                        domain/message.lua
invalid_template                       domain/message.lua, read/library.lua, read/preview.lua
invalid_template_declaration           render/originals.lua
invalid_template_vars                  domain/vars.lua
invalid_transport_status               domain/config.lua
lease_lost                             command/outbox.lua, domain/failure.lua
mail_activity_denied                   client.lua
mail_asset_media_type                  domain/assets.lua
mail_asset_size                        domain/assets.lua
mail_asset_source_gone                 persist/asset_file_repo.lua
mail_asset_version_unavailable         persist/asset_file_repo.lua
mail_base_not_found                    domain/edit.lua
mail_command_id_conflict               command/threads.lua
mail_content_unavailable               command/send.lua
mail_db_unconfigured                   persist/db.lua
mail_delivery_denied                   client.lua
mail_directory_unavailable             api/principals.lua
mail_draft_workspace_unavailable       render/scratch.lua
mail_event_snapshot_missing            domain/events.lua
mail_job_link_missing                  command/send.lua
mail_library_catching_up               command/library.lua, command/library_edits.lua
mail_library_changed                   command/library.lua, persist/asset_file_repo.lua
mail_library_component_required        command/library.lua
mail_library_denied                    client.lua, command/library.lua, command/preview.lua
mail_library_overlay_missing           command/live.lua, render/live.lua
mail_library_publication_failed        jobs/library_sync.lua
mail_library_publish_conflict          command/live.lua
mail_library_publishing                render/live.lua
mail_library_read_denied               read/library.lua
mail_library_thread_missing            read/thread_events.lua
mail_library_write_denied              read/library.lua
mail_message_unavailable               command/outbox.lua
mail_original_changed                  domain/resource.lua
mail_original_not_editable             render/live.lua
mail_preview_digest_failed             domain/digest.lua
mail_preview_expired                   command/library_edits.lua, command/preview.lua
mail_preview_mismatch                  command/library_edits.lua
mail_preview_required                  command/library_edits.lua
mail_preview_stale                     command/library_edits.lua
mail_projection_resource_missing       domain/fold.lua
mail_projection_source_gap             persist/projection.lua
mail_projection_timestamp              persist/projection.lua
mail_provider_detail_redaction_failed  driver/http.lua
mail_realtime_refused                  command/notify.lua
mail_resource_collision                domain/resource.lua
mail_resource_in_use                   command/library.lua, command/library_edits.lua, render/scratch.lua
mail_resource_is_shipped               command/library_edits.lua
mail_resource_not_customized           command/library_edits.lua
mail_resource_not_found                domain/edit.lua, read/library.lua
mail_resource_too_large                domain/resource.lua
mail_revision_conflict                 domain/edit.lua
mail_revision_not_found                read/history.lua
mail_revision_pruned                   read/library.lua, read/thread_events.lua
mail_revision_unrestorable             read/history.lua
mail_send_denied                       client.lua, domain/failure.lua
mail_template_archived                 read/library.lua
mail_unknown_event                     domain/fold.lua
message_encoding_failed                domain/failure.lua, driver/http.lua
message_not_found                      persist/message_reader.lua
message_rejected                       domain/failure.lua, driver/http.lua
message_too_large                      domain/failure.lua, domain/message.lua
not_found                              sink/write.lua
permission_denied                      sink/write.lua
provider_endpoint_invalid              driver/config.lua
provider_error                         sink/write.lua
provider_rejected                      domain/failure.lua, driver/http.lua
provider_request_failed                domain/failure.lua, driver/http.lua
provider_response_invalid              command/outbox.lua, domain/failure.lua
provider_transport_failed              domain/failure.lua, driver/http.lua
provider_unavailable                   domain/failure.lua, driver/http.lua, sink/write.lua
rate_limited                           domain/failure.lua, driver/http.lua, sink/write.lua
recipient_address_missing              command/recipients.lua, command/send.lua
recipient_lookup_failed                command/recipients.lua
recipient_required                     domain/message.lua
reply_to_invalid                       domain/config.lua
settings_read_failed                   driver/config.lua, read/driver_selection.lua
subject_required                       domain/message.lua
subject_too_long                       domain/message.lua
template_body_conflict                 domain/message.lua
template_not_found                     read/library.lua
template_render_failed                 render/render.lua
template_set_unavailable               render/render.lua
text_too_large                         domain/message.lua
too_many_attachments                   domain/message.lua
too_many_recipients                    domain/failure.lua, domain/message.lua
unsupported_operation                  sink/write.lua
```

<!-- END MAIL CODES -->

A draft workspace conflict retains its registry diagnostics in `details` and returns the stable code `mail_draft_workspace_unavailable`. Template render failures carry a plain Mail message, with the original engine message in `details.engine_message`. Edit-preview issue rows expose that engine message as `engine_message`.

## Development

Use Make, Python 3 with PyYAML, Node.js, and Wippy `v0.3.70a`. The isolated harness resolves the mail modules and uses local source replacements for sibling dependencies.

```sh
make verify
# From the Components root, with the sibling KickSide source checkout
make structure-mail-platform
```

`make verify` requires a clean structure check, refreshes the dependency graph, and runs lint, type checks, registry checks, and the SQLite harness. For PostgreSQL, create a dedicated test database and run `make test-pg` with
`WIPPY_ARGS="--profile postgres --set vars.pg_host=$PGHOST --set vars.pg_port=$PGPORT --set vars.pg_database=$PGDATABASE"`.
Drop the database after the run. Tests use local delivery fixtures.

Tool schemas are checked as installed registry data. The pinned MCP runtime accepts both JSON strings and equivalent object declarations, including resolved schema file references.
