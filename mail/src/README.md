<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# KickSide Mail

Mail queues email from an installation-managed address and delivers it through an installed driver. It supplies a mailer contract, agent tools, a virtual Workflow Block, and an automation destination.

## Requirements

Install KickSide Settings, Contract, Component, Core, Jobs, Execution, Users, Uploads, `wippy/views`, and at least one mail driver. Bind `kickside.mail:target_db` to the SQL resource Jobs uses. Mail opens the Users provisioning contract under the caller and reads each distinct user ID once. The pinned Users contract exposes a single-user lookup. Mail supplies the ContentProvider call permissions at admission and in the attachment reader. Uploads checks component access under the caller at admission and under the sender’s current identity in the worker. Drivers receive the bytes after those checks. Template discovery follows the caller’s registry visibility. Template declarations can provide `template.origin_label` for display in the library.

If the app installs its own default implementation of `kickside.contract:realtime`, bind `kickside.mail:realtime_binding` to that implementation's ID.

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

`MailSend` appears as a virtual Block. A Workflow can pass the message from a preceding step and fix optional fields in Block configuration. The `kickside.mail.sink:send_email` automation destination queues one message per origin and stable `identity_key` and returns `dest_ref.message_id`. Redelivery replays the first message within the log retention window. A new delivery with changed content for that identity returns the original message ID and `dest_ref.content_changed = true`. Reusing the same delivery key with different content returns `idempotency_conflict`. When the caller omits `identity_key`, Mail uses the origin, operation and per-delivery `idempotency_key`. The port accepts `upsert` and `delete`, and direct callers of its writable binding can also use `create`. A source `delete` requires **Send mail** and succeeds without a payload, a delivery key, or a new message.

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
wiring. [Write a Mail driver](https://github.com/kicksideai/components/blob/main/mail/src/driver-authoring.md)

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

### Host requirements

- `clock` provides the `now()` clock for library writes, preview expiry, and the retention owner. It defaults to Wippy's runtime clock.
- `http_transport` provides the `request(method, url, options)` function used by Mail's public HTTP driver helper. It defaults to Wippy's HTTP client, which enforces the driver's outbound policy.

## Template library

The library stores messages, base templates, parts, and image assets. Messages, bases, and parts have HTML and text faces. A message also has a subject, a variable schema with samples, and the name of its base. A part declares its inputs. The starter library ships Standard and Plain bases and composes Notice from editable parts.

Each edit appends an event to the library component’s thread. Create, update, base change, reset, and restore events carry the resulting resource snapshot. Content across both faces and the description is limited to 512 KiB per resource. The projection updates the library, reference index, and History together. The resource revision is its subject version, and `seq` is its position on the shared library thread. Unedited packaged originals start at revision zero.

The `library_sync` job publishes Jet sets from the committed projection. Mail supports single-node template publishing in this release. A render checks the live registry marker against the committed template sequence and returns retryable `mail_library_publishing` while publication is pending. Jobs retries transient publication failures. At boot, Mail enqueues publication if the live marker is behind the committed template sequence. During normal operation, a lease-release hint for an exhausted library job lets the retention owner reconcile the marker. Jobs permits the enqueuer to choose `max_attempts`; Mail gives a publication job three transient attempts. The worker returns native failures with their retry flags intact. The pinned Jobs release classifies retryability by kind. Committed edits remain available through the library read model after projection.

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

The native error kind and retry flag come from the operation. The reference lists Mail-defined error codes, setup reasons and diagnostics. External errors can retain their original codes. The writable destination and sender-facing Activity apply their declared mappings.

<!-- BEGIN MAIL CODES -->

```text
Code                                   Meaning
access_denied                          The principal lacks the requested access.
api_key_invalid                        Provide an API key without invalid characters.
api_key_required                       Set the delivery provider API key.
attachment_empty                       An attachment has no bytes.
attachment_encoding_failed             Mail could not encode the attachment for the provider.
attachment_unavailable                 The attachment could not be read.
attachments_too_large                  Reduce the combined size of the attachments.
authentication_required                Sign in before calling Mail.
authorization_refused                  The provider refused the account or its sending permissions.
body_required                          Supply a text or HTML body.
credentials_invalid                    Check the credentials configured for the provider.
delivery_deadline_exceeded             The delivery deadline elapsed.
delivery_deadline_invalid              Provide the absolute Jobs deadline in RFC3339 format.
delivery_failed                        Delivery failed without a public provider classification.
delivery_interrupted                   The delivery job ended without a known outcome.
delivery_state_changed                 The delivery record changed while the worker held it.
delivery_uncertain                     Check the provider before sending the message again.
driver_not_admitted                    The transport binding cannot open in Mail's transports group.
driver_not_configured                  Configure the selected driver's Settings namespace.
driver_not_installed                   Install the selected transport binding.
driver_required                        Select an admitted transport in Mail delivery settings.
duplicate_mail_resource                A request names the same resource more than once.
duplicate_template_name                Installed declarations name the same Mail template.
from_address_invalid                   Set a valid sender address in Mail settings.
from_address_required                  Set a sender address in Mail settings.
from_name_invalid                      Check the sender display name and its length.
from_not_allowed                       Use the installation's configured sender.
gmail_html_clipping                    The rendered HTML may be clipped by Gmail.
html_too_large                         Reduce the size of the HTML body.
http_context_required                  Call this handler through its HTTP endpoint.
idempotency_conflict                   The same delivery or sender key was used with different content.
incomplete_attachment                  The source returned fewer or inconsistent bytes for the attachment.
invalid_address                        Use valid email addresses or supported user identifiers.
invalid_attachment                     Provide a supported attachment reference.
invalid_attachment_filename            Provide a safe filename for the attachment.
invalid_attachment_size                Provide an attachment with a valid byte length.
invalid_body                           Provide text and HTML bodies as strings.
invalid_config                         Complete Mail or its provider's configuration.
invalid_content_id                     Use a valid Content-ID for an inline attachment.
invalid_header_text                    Remove control characters from the mail header.
invalid_idempotency_key                Use a nonempty delivery key of at most 2048 bytes without control characters.
invalid_identity_key                   Supply a nonempty stable identity on an automation write.
invalid_mail_asset                     Use a valid upload reference with the asset operation.
invalid_mail_command_id                Provide a valid command ID.
invalid_mail_draft                     Check the draft operation and content shape.
invalid_mail_filter                    Use one of the supported library or Activity filters.
invalid_mail_origin                    Provide a valid origin for the request's producer.
invalid_mail_resource                  Check the kind, name and content of the resource.
invalid_mail_resources                 Provide a valid batch of resource edits.
invalid_mail_revision                  Provide a valid resource revision or event sequence.
invalid_mail_test                      Send-test input must name a template or use the documented delivery test fields.
invalid_message                        The send request contains unsupported fields or values.
invalid_recent_senders_cursor          Restart paging with a valid recent-senders cursor.
invalid_request                        Correct the operation's input and retry.
invalid_revision_note                  Keep revision notes to 500 characters.
invalid_subject                        Use a subject suitable for a mail header.
invalid_template                       Provide a valid template name or pair variables with a template.
invalid_template_declaration           Check the installed template declaration and its referenced faces.
invalid_template_vars                  Check the supplied variables against the template schema.
invalid_transport_status               The driver's status response is incomplete or malformed.
lease_lost                             The delivery worker no longer holds its job lease.
mail_activity_denied                   The principal lacks access to delivery Activity.
mail_asset_media_type                  Use one of the supported image formats.
mail_asset_size                        Use an image within the Mail asset size limit.
mail_asset_source_gone                 The historical upload is no longer available for restore.
mail_asset_version_unavailable         The requested image version cannot be read.
mail_base_not_found                    Select an available base template.
mail_command_id_conflict               The command ID already identifies a different edit.
mail_content_unavailable               The Mail content source could not be read.
mail_db_unconfigured                   Bind the Mail database requirement.
mail_delivery_denied                   The principal lacks Administer mail delivery.
mail_directory_unavailable             Mail could not resolve display names through the principal directory.
mail_draft_workspace_unavailable       Mail could not open the draft template workspace.
mail_event_snapshot_missing            The library event lacks its required resource snapshot.
mail_job_link_missing                  Mail could not link a queued delivery to its durable job.
mail_library_catching_up               The library projection has not processed the required events.
mail_library_changed                   The library changed during the operation. Read it again before editing.
mail_library_component_required        The operation requires the installation's Mail library component.
mail_library_denied                    The principal lacks Edit mail library.
mail_library_job_payload_invalid       The publication job lacks the template sequence it owns.
mail_library_overlay_missing           The live template overlay could not be opened.
mail_library_publish_conflict          Templates changed while Mail was publishing them.
mail_library_publishing                Wait for publication of the committed template revision.
mail_library_read_denied               The principal lacks component READ on the Mail library.
mail_library_thread_missing            The Mail library's component thread could not be found.
mail_library_write_denied              The principal lacks component WRITE on the Mail library.
mail_message_unavailable               Mail could not read the message needed by the operation.
mail_original_changed                  The installed original differs from the reviewed source.
mail_original_not_editable             The original's module has not granted Mail overlay access.
mail_preview_digest_failed             Mail could not identify the reviewed draft.
mail_preview_expired                   Review the draft again after its preview expires.
mail_preview_mismatch                  The reviewed content, caller or operation differs from the save.
mail_preview_required                  Review the draft before saving this edit.
mail_preview_stale                     Review again using the current resource revisions.
mail_projection_resource_missing       A projected resource required by the operation is missing.
mail_projection_source_gap             Required events are missing from the projection input.
mail_projection_timestamp              The event timestamp cannot be projected.
mail_provider_detail_redaction_failed  Mail suppressed unsafe provider diagnostic detail.
mail_realtime_refused                  The realtime service refused a Mail change notification.
mail_resource_collision                A packaged or existing resource already uses this name.
mail_resource_in_use                   Remove references before deleting the resource.
mail_resource_is_shipped               Reset a shipped resource to its original instead of deleting it.
mail_resource_not_customized           The resource has no customization to reset.
mail_resource_not_found                The requested resource does not exist.
mail_resource_too_large                Reduce combined source and description content to 512 KiB.
mail_revision_conflict                 The resource was edited after the supplied expected revision.
mail_revision_not_found                The requested history entry does not exist.
mail_revision_pruned                   Retention removed the requested historical event.
mail_revision_unrestorable             The historical action does not contain a restorable snapshot.
mail_send_denied                       The principal lacks Send mail.
mail_template_archived                 Restore the archived template before sending it.
mail_unknown_event                     The library received an unsupported event type.
message_encoding_failed                Mail could not encode the provider request.
message_not_found                      The message does not exist or is hidden from the caller.
message_rejected                       The provider rejected the message.
message_too_large                      Reduce the size of the message before sending it.
not_found                              A record required by the writable mail operation is unavailable.
permission_denied                      The writable mail operation lacks the required authority.
provider_endpoint_invalid              Supply an HTTPS endpoint in the required form.
provider_error                         The writable mail operation encountered an unclassified provider failure.
provider_rejected                      The provider refused delivery.
provider_request_failed                The HTTP client refused or could not make the provider request.
provider_response_invalid              The provider response could not be interpreted.
provider_transport_failed              The HTTP exchange did not return a response.
provider_unavailable                   The delivery service is temporarily unavailable.
rate_limited                           Wait before retrying a rate-limited delivery.
recipient_address_missing              A referenced user has no deliverable address.
recipient_lookup_failed                Mail could not resolve a referenced recipient.
recipient_required                     Supply at least one To recipient.
reply_to_invalid                       Provide a valid Reply-To address.
settings_read_failed                   The required Settings namespace could not be read.
subject_required                       Provide a nonempty subject.
subject_too_long                       Shorten the message subject.
template_body_conflict                 Choose template rendering or supply a raw subject and body.
template_not_found                     Select an available template.
template_render_failed                 Mail could not render the selected template or draft.
template_set_unavailable               The template set required for rendering could not be opened.
text_too_large                         Reduce the size of the plain-text body.
too_many_attachments                   Remove attachments to meet Mail's limit.
too_many_recipients                    Reduce the combined number of To, Cc and Bcc recipients.
unsupported_operation                  Use an operation declared by the Mail destination.
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
