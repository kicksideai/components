<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# KickSide Mail

Mail queues email from an installation-managed address and delivers it through an installed driver. It supplies a mailer contract, agent tools, a virtual Workflow Block, and an automation destination.

## Requirements

Install KickSide Settings, Contract, Component, Core, Jobs, Execution, Users, Uploads, and at least one mail driver. Bind `kickside.mail:target_db` to the SQL resource Jobs uses. User-ID recipients use the Users provisioning contract with the caller’s existing authority. Mail checks upload metadata with the caller’s permissions at admission. The worker reads the upload bytes using the sender’s current authority. Template discovery follows the caller’s registry visibility.

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

Read the log entry with `get_message(message_id)`. It becomes `sent` when the provider accepts the message, with a provider ID if supplied, or `failed` with a structured `last_error`. If a job ends without recording an outcome, `delivery_interrupted` indicates that the provider may have accepted the email. Only callers with **Read all mail delivery logs** see `driver_id`, `provider_message_id`, and a sanitized provider excerpt in `last_error.provider_detail` when present. `list_messages({limit, status?, since?, cursor?})` gives most recent entries first. Dates and `since` use Unix milliseconds. Use the returned `next_cursor` for the next page. The log stores metadata, recipient addresses including Bcc, and attachment references until expiry. Queued mail retains its rendered bodies for delivery. Sent mail discards them on completion. Failed mail keeps its rendered bodies for resend until the log row expires. Expiry defaults to 30 days after completion and follows `log_retention_days`. Provider excerpts omit addresses and words echoed from the subject and rendered bodies. Jobs stores a failure code.

On the first attempt the worker pins the active binding. Each attempt checks that the binding is still admitted and that the sender still holds **Send mail**. It passes the message ID to providers with idempotency support. For retryable rate limits, timeouts, provider unavailability, or sends already in progress, Mail allows up to 32 attempts with exponential delays from one second to five minutes. A provider retry hint can extend an interval up to 15 minutes. When the HTTP client reports a retryable error without a response, Mail records `provider_transport_failed`. If a non-idempotent transport might have accepted the request before communication failed, Mail records `delivery_uncertain` and leaves it for an administrator to check.

The `notice` template supplies plain-text and HTML parts. Set `subject` and any combination of an opening message, headings, paragraphs, labeled details, a web action link, or an inline image. Use `MailGetTemplate` for its variable schema and `MailPreview` for the rendered parts.

`MailSend` appears as a virtual Block. A Workflow can pass the message from a preceding step and fix optional fields in Block configuration. The `kickside.mail.sink:send_email` automation destination queues one message per origin and stable `identity_key` and returns `dest_ref.message_id`. Redelivery with the same message replays that result within the log retention window. Different content for the same identity returns `idempotency_conflict`. When the caller omits `identity_key`, Mail uses the origin, operation and per-delivery `idempotency_key`. The port accepts `upsert` and `delete`, and direct callers of its writable binding can also use `create`. A source `delete` requires **Send mail** and succeeds without a payload, a delivery key, or a new message.

### Transport drivers

Create a `contract.binding` for `kickside.mail:transport` with `send` and
`status` methods. `send` receives one rendered message, its idempotency key,
and an RFC3339 deadline. An accepted delivery returns `provider_message_id`
when the service supplies one. `status` checks the driver's own settings
without contacting the service. It returns `title`, `icon`, `description`,
`settings_ns`, `idempotent` and `ready`, with optional positive integer
`max_recipients` and `max_message_bytes`. Report a setup issue with a stable
`code` and an actionable `reason`.

The provider admits its binding by declaring an exact `contract.open` grant
as a member of Mail's transports group. Give its methods separate policies
for their settings and HTTP endpoint access.

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

Driver modules can use `kickside.mail.driver:config` for their Settings and
endpoint lookups and `kickside.mail.driver:http` for HTTP delivery bounded by
the Jobs deadline.

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

The `library_sync` job publishes Jet sets from the committed projection. Mail supports single-node template publishing in this release. A render checks the live registry marker against the committed template sequence and returns retryable `mail_library_publishing` while publication is pending. The job retries failed publications. Committed edits remain available through the library read model after projection.

A message selects its base as data. The base provides a `body()` block and the message supplies that block's content. Include a part by its absolute Jet name and pass its inputs as the context.

```jet
{{ block body() }}
  <p>{{ vars.greeting }}</p>
  {{ include "/part/button" map("action_url", vars.url, "action_label", "Open") }}
{{ end }}
```

Parts read passed inputs through the dot context. Templates can also read `site.title`, `site.url`, `sender.name`, `message.subject`, and `message.preheader` in both faces. Use `vars` for declared message variables.

Lua callers with **Edit mail library** open `kickside.mail:library` through `kickside.mail:client`. Use `list` for summaries (filter by `kind`, `state`, `base`, a search `q`, or up to 100 exact `names`; HTTP takes `names` comma-separated), `get` for editable source, `asset_content` for image bytes, and `read_history` and `read_revision` for saved versions. The write methods are `create`, `update`, `save`, `set_base`, `reset`, `restore`, `delete`, and `add_asset`. Use `send_test` to queue the selected saved message to the acting editor’s email address.

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

The native error kind and retry flag come from the operation. The `details.code` values below identify Mail’s errors. Errors from Uploads, Users, Settings, or the driver retain their native classification. The writable destination maps errors into the platform writable failure envelope.

```text
Code                           Kind               Retryable
attachment_empty               Invalid            No
attachment_unavailable         Internal           No
attachments_too_large          Invalid            No
body_required                  Invalid            No
delivery_interrupted           Unavailable        No
driver_not_admitted            Invalid            No
duplicate_template_name        Conflict           No
from_not_allowed               Invalid            No
html_too_large                 Invalid            No
incomplete_attachment          Internal           No
idempotency_conflict            Conflict           No
invalid_address                Invalid            No
invalid_attachment             Invalid            No
invalid_attachment_filename    Invalid            No
invalid_attachment_size        Internal           No
invalid_body                   Invalid            No
invalid_config                 Invalid            No
invalid_content_id             Invalid            No
invalid_transport_status       Internal           No
invalid_idempotency_key        Invalid            No
invalid_message                Invalid            No
invalid_subject                Invalid            No
invalid_template               Invalid            No
invalid_template_declaration   Invalid            No
invalid_template_vars          Invalid            No
mail_draft_workspace_unavailable Conflict           Source flag
mail_library_denied            PermissionDenied   No
mail_send_denied               PermissionDenied   No
message_not_found              NotFound           No
message_too_large              Invalid            No
provider_endpoint_invalid      Invalid            No
recipient_address_missing      Invalid            No
recipient_lookup_failed        Unavailable        No
recipient_required             Invalid            No
settings_read_failed           Internal           No
subject_required               Invalid            No
subject_too_long               Invalid            No
template_body_conflict         Invalid            No
template_not_found             NotFound           No
template_render_failed         Source error       Source flag
text_too_large                 Invalid            No
too_many_attachments           Invalid            No
too_many_recipients            Invalid            No
```

A draft workspace conflict retains its registry diagnostics in `details` and returns the stable code `mail_draft_workspace_unavailable`. Template render failures carry a plain Mail message, with the original engine message in `details.engine_message`. Edit-preview issue rows expose that engine message as `engine_message`.

## Development

Use Make, Python 3 with PyYAML, Node.js, and Wippy `v0.3.70a`. The isolated harness resolves the mail modules and uses local source replacements for sibling dependencies.

```sh
make verify
```

`make verify` requires a clean structure check, refreshes the dependency graph, and runs lint, type checks, registry checks, and the SQLite harness. For PostgreSQL, create a dedicated test database and run `make test-pg` with
`WIPPY_ARGS="--profile postgres --set vars.pg_host=$PGHOST --set vars.pg_port=$PGPORT --set vars.pg_database=$PGDATABASE"`.
Drop the database after the run. Tests use local delivery fixtures.
