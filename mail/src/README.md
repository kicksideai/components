<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# KickSide Mail

Mail queues email from an installation-managed address and delivers it through an installed driver. It supplies a mailer contract, agent tools, a virtual Workflow Block, and an automation destination.

## Requirements

Install KickSide Settings, Contract, Jobs, Execution, Uploads, and at least one mail driver. Bind `kickside.mail:target_db` to the SQL resource Jobs uses. User-ID recipients use the Users provisioning contract with the caller’s existing authority. Mail checks upload metadata with the caller’s permissions at admission. The worker reads the upload bytes using the sender’s current authority. Template discovery follows the caller’s registry visibility.

Assign **Send mail** to groups that may send messages. **Edit mail library** grants access to list, inspect, preview, and edit library resources. Assign **Administer mail delivery** to administrators who manage the Mail settings through the platform Settings surface. The installed driver has a separate administration capability. Members can read their own delivery log. Assign **Read all mail delivery logs** to groups that need to read messages from all senders.

## Settings

Under **Integrations → Mail**, choose the installed driver ID and set the From address. The display name and default Reply-To address are optional. A message can supply its own Reply-To address. The installation’s configured From applies to every message.

- `driver` selects an installed descriptor by its `id`.
- `from_address` sets the sender’s email address.
- `from_name` sets the sender’s display name.
- `reply_to` sets the default reply address.
- `log_retention_days` sets how long to keep sent and failed rows. It defaults to 30 and accepts 1 to 3650 days.

## Contracts and tools

`kickside.mail:mailer` exposes `send`, `get_message`, `list_messages`, `list_templates`, `get_template`, and `preview`. The corresponding tools are `MailSend`, `MailListTemplates`, `MailGetTemplate`, and `MailPreview`. The `kickside.mail.traits:mail` trait includes all four. The `kickside.mail.traits:mail_readonly` trait includes the three template tools.

Supply a nonempty `to` list and either a `template` with its `vars`, or a `subject` with `text`, `html`, or both. `cc` and `bcc` use the same address or `{user_id}` entries as `to`. After resolving user IDs, Mail includes each address once, comparing case-insensitively in To, Cc, then Bcc order. Subjects allow up to 255 characters and each raw or rendered body allows up to 256 KiB. `attachments` accepts up to ten upload references with a 25 MiB raw combined limit. The configured driver’s total message limit also applies, including attachment encoding overhead. Mail uses the basename of the supplied or stored upload filename, up to 255 bytes, and uses `attachment` for an empty name. An inline reference supplies a `content_id` that the HTML can address as `cid:<content_id>`.

Send validates and renders the message, commits it with a delivery job, and returns `{message_id, status = "queued"}`. An optional `idempotency_key` of up to 2048 bytes names the write for that sender while its log row exists. Repeating the key and message content returns the original ID and current status. Different content with the same key returns `idempotency_conflict`.

Read the log entry with `get_message(message_id)`. It becomes `sent` when the provider accepts the message, with a provider ID if supplied, or `failed` with a structured `last_error`. If a job ends without recording an outcome, `delivery_interrupted` indicates that the provider may have accepted the email. Only callers with **Read all mail delivery logs** see `driver_id`, `provider_message_id`, and a sanitized provider excerpt in `last_error.provider_detail` when present. `list_messages({limit, status?, since?, cursor?})` gives most recent entries first. Dates and `since` use Unix milliseconds. Use the returned `next_cursor` for the next page. The log exposes metadata and attachment references. Terminal rows discard the rendered bodies.

On each attempt the worker selects the active driver and checks the sender’s current **Send mail** capability before delivery. It passes the message ID to providers with idempotency support. For retryable rate limits, timeouts, provider unavailability, or sends already in progress, Mail allows up to 32 attempts with exponential delays from one second to five minutes. A provider retry hint can extend an interval up to 15 minutes.

The `notice` template supplies plain-text and HTML parts. Set `subject` and any combination of an opening message, headings, paragraphs, labeled details, a web action link, or an inline image. Use `MailGetTemplate` for its variable schema and `MailPreview` for the rendered parts.

`MailSend` appears as a virtual Block. A Workflow can pass the message from a preceding step and fix optional fields in Block configuration. The `kickside.mail.sink:send_email` automation destination reports success when the message is committed and returns `dest_ref.message_id`. Its `kickside.data:writable` binding declares at-least-once delivery and reuses the automation’s per-delivery idempotency key within the log retention window.

Drivers declare `registry.entry` with `meta.type: kickside.mail:driver` and implement `send` on `kickside.mail:transport`. The descriptor supplies `id`, `label`, `icon`, `description`, `binding`, `settings_ns`, and `available_func`. Declare `max_recipients` and `max_message_bytes` as positive integers for the provider. Mail enforces the declared limits on admission and delivery. The driver contributes its exact descriptor, binding, send, and availability function IDs to Mail’s private discovery and dispatch policies. The availability function checks configuration and returns `{available: boolean, reason?: string}`.

## Template library

The library stores messages, base templates, and parts. Every resource has HTML and text faces. A message also has a subject, a variable schema with samples, and the name of its base. A part declares its inputs. The starter library ships Standard and Plain bases and composes Notice from editable parts.

A message selects its base as data. The base provides a `body()` block and the message supplies that block's content. Include a part by its absolute Jet name and pass its inputs as the context.

```jet
{{ block body() }}
  <p>{{ vars.greeting }}</p>
  {{ include "/part/button" map("action_url", vars.url, "action_label", "Open") }}
{{ end }}
```

Parts read passed inputs through the dot context. Templates can also read `site.title`, `site.url`, `sender.name`, `message.subject`, and `message.preheader` in both faces. Use `vars` for declared message variables.

Lua callers with **Edit mail library** call functions in `kickside.mail.library`. Use `list` and `get` to read resources, `render` to render a message, and `render_draft` to preview a candidate against a selected message. Call `create`, `update`, `set_base`, `reset`, or `delete` to edit the library. Edits to an existing resource require its current `expected_revision`. Reset restores the current shipped original.

## Error codes

The native error kind and retry flag come from the operation. The `details.code` values below identify Mail’s errors. Errors from Uploads, Users, Settings, or the driver retain their native classification. The writable destination maps errors into the platform writable failure envelope.

```text
Code                           Kind               Retryable
attachment_unavailable         Internal           No
attachments_too_large          Invalid            No
body_required                  Invalid            No
delivery_interrupted           Unavailable        No
duplicate_driver_id            Invalid            No
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
invalid_driver_descriptor      Invalid            No
invalid_idempotency_key        Invalid            No
invalid_message                Invalid            No
invalid_subject                Invalid            No
invalid_template               Invalid            No
invalid_template_declaration   Invalid            No
invalid_template_vars          Invalid            No
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

## Development

Use Make and a Wippy runtime that supports `template.set.engine.escape` and registry overlay shadows. The isolated harness resolves the mail modules and uses local source replacements for sibling dependencies.

```sh
make verify
```

`make verify` refreshes the dependency graph and runs validation and the SQLite harness. For PostgreSQL, create a dedicated test database, then run the same target with
`WIPPY_ARGS="--profile postgres --set vars.pg_host=$PGHOST --set vars.pg_port=$PGPORT --set vars.pg_database=$PGDATABASE"`.
Drop the database after the run. Tests use local delivery fixtures.
