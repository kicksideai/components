<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Write a KickSide Mail driver

A driver translates one rendered Mail message into a provider request. It owns its provider configuration, request encoding, outbound HTTP policy, and provider response classification. Mail owns the public send and activity surfaces, templates, attachment reads, queue, and delivery retries.

## Build the package

Start with this complete Example Relay package. Copy it into a new module, replace the package and registry namespace throughout, and adapt the transport to the provider API. The sample's default host is a reserved domain. The Mail harness installs the example and intercepts its HTTP requests at Mail's documented `http_transport` requirement.

- [wippy.yaml](https://github.com/kicksideai/components/blob/main/mail/test/driver-example/wippy.yaml) — Plugin manifest and publication exclusions
- [src/_index.yaml](https://github.com/kicksideai/components/blob/main/mail/test/driver-example/src/_index.yaml) — Module definition, Mail and Settings dependencies, endpoint requirement, and transport binding
- [src/security/_index.yaml](https://github.com/kicksideai/components/blob/main/mail/test/driver-example/src/security/_index.yaml) — Discovery, member and admin access, Settings reads, and exact egress permission
- [src/settings/_index.yaml](https://github.com/kicksideai/components/blob/main/mail/test/driver-example/src/settings/_index.yaml) and [validate.lua](https://github.com/kicksideai/components/blob/main/mail/test/driver-example/src/settings/validate.lua) — Settings definitions, validation, and the provider's Integrations block
- [src/transport/_index.yaml](https://github.com/kicksideai/components/blob/main/mail/test/driver-example/src/transport/_index.yaml) and [relay.lua](https://github.com/kicksideai/components/blob/main/mail/test/driver-example/src/transport/relay.lua) — The function entries, declared imports, and complete Lua adapter

## Implement the transport contract

Create one `contract.binding` for `kickside.mail:transport` in the module root. Map `send` and `status` to two function entries. Multiple drivers can be installed together. Mail uses `contract.find_implementations` and opens each implementation under `kickside.mail.security:transports`. A permission denial on open excludes the binding from delivery and the catalog. Mail obtains driver metadata through `status`. The driver contributes this exact policy in its own security namespace.

```yaml
- name: transport_open
  kind: security.policy
  meta: { private: true, comment: Admits this driver to the Mail transports group. }
  groups: [kickside.mail.security:transports]
  policy:
    resources: [example.mail.relay:transport]
    actions: [contract.open]
    effect: allow
```

The contract declares JSON Schemas for `send` input and output and `status` output. Import `kickside.mail:types` for `TransportRequest`, `TransportResult`, `TransportStatus`, `Attachment`, `Mailbox` and `HttpResponse`. Implementations return `(value, err)` with a native error on failure.

### `send(input) -> (TransportResult?, error?)`

- `from` — Required object with `address` and optional `name`
- `to` — Required nonempty array of addresses
- `cc`, `bcc` — Optional arrays of addresses
- `reply_to` — Optional address
- `subject` — Required nonempty subject
- `html`, `text` — Rendered strings. Include at least one.
- `attachments` — Optional array. Each item has `filename`, `content_type`, `content` (original bytes in a Lua string), `disposition` (`attachment` or `inline`), and `content_id` (required for `inline`). Preserve the Content-ID used in the rendered HTML. Encode bytes only as the provider requires.
- `idempotency_key` — Optional stable key for the provider's idempotent request API
- `deadline` — Required absolute RFC3339 delivery deadline

Return `{provider_message_id = id}` when the provider accepts the message and returns a usable ID. Return `{}` when acceptance succeeds without an ID. An acceptance response does not confirm inbox delivery. The provider key is the Mail message ID and stays constant across attempts. If the provider honors it, pass it unchanged and advertise `idempotent: true`. Set it to `false` when repeating a request may send again. Let Mail own retries and use its deadline for every delivery call.

### `status() -> (TransportStatus?, error?)`

Return nonempty `title`, `icon`, `description`, and `settings_ns`, plus boolean `idempotent` and `ready`. The optional `max_recipients` and `max_message_bytes` are positive integers. Use the provider's total recipient allowance across To, Cc, and Bcc, and its deliverable message size in bytes. Omit a limit when the provider does not publish one. Mail counts the message fields, body and attachments and applies an allowance for Base64 and per-attachment headers. Advertise a conservative limit if the provider format adds more overhead. Validate credentials and any required values locally. Status makes no provider request.

For missing or invalid configuration, return `ready: false`, `code` from `config.status_error`, and a nonempty setup `reason`. A `code` must match `^[a-z][a-z0-9_]*$`. Propagate errors reading Settings or the registry so Mail can distinguish operational failures from setup needs. Avoid returning credentials in status or errors.

## Configure Settings and HTTP access

Declare one Settings namespace owned by the driver and return it as `settings_ns`. Give each `kickside.settings:definition` a `key`, `title`, `description`, `scope`, `value_type`, default, and validator where appropriate. Store an API key as `value_type: secret` with `read_access: admin`; use `kickside.mail.driver:config.validate_api_key` in a `validate_func` wrapper. The Mail editor uses the selected driver's `settings_ns` with the generic Settings provider. Administrators save settings through the platform-owned `PUT /api/v1/settings` endpoint.

Give `send` and `status` a private `settings_read` policy with `contract.get`, `contract.open`, and `contract.call` on the Settings contract, its binding, and `get_namespace`. Reading an admin-only secret also requires the separate private `settings_admin_read` policy with `access` on `kickside.settings.api:list_settings.endpoint` at the pinned Settings ABI. Apply those two grants only to the functions that read the driver's own namespace. Declare a public `module_access` discovery policy with `intent: module_access` and include the private `module_runtime` policy that reads the binding and its method entries. Bind both groups through `user_security_scope` with `meta.value_kind: security.scope`. Declare `driver_admin` with `intent: module_management` and exact resources for the driver’s settings and validators.

Keep the destination and egress permission linked to a single scalar requirement. Wippy applies its value verbatim to both targets. For an exact URL, accept a complete HTTPS delivery URL including its path, and use exactly that URL for the request.

```yaml
- name: endpoints
  kind: registry.entry
  endpoints: {}
- name: api_base_url
  kind: ns.requirement
  meta:
    value_type: string
    comment: Sets the delivery URL and its outbound HTTP grant.
    description: Complete HTTPS URL for the relay delivery endpoint.
  default: https://delivery.example.invalid/messages
  targets:
    - { entry: example.mail.relay:endpoints, path: ".endpoints.api" }
    - { entry: example.mail.relay.security:http_access, path: ".policy.resources +=" }
```

The `provider_reads` policy grants `registry.get` on your `endpoints` entry. Start `http_access.policy.resources` as `[]`, restrict its action to `http_client.request`, and attach it only to `send`. Validate the linked endpoint in Lua. When a provider requires a runtime segment in the URL, use a narrowly scoped HTTPS prefix and validate the segment before assembling the exact path. Mailgun's two regional URL prefixes illustrate this case. Keep the permissions off Mail's own entries.

## Use the public driver libraries

The signatures below omit some Lua optional-return annotations for readability. Every helper returning an error uses Wippy's native error type.

### `kickside.mail.driver:config`

- `settings(namespace)` — `(values, err)`. Read a single driver-owned Settings namespace.
- `validate_api_key({value = value})` — Settings validation result `{valid, error?}`. An empty string clears the key.
- `api_key(values, service)` — `(key, err)`. Validate a value already read.
- `read_api_key(namespace, service)` — `(key, err)`. Read and validate the key for a single-key driver.
- `missing(message, reason_code?, reason?)` — Creates a nonretryable `INVALID` setup error with `details.code = "invalid_config"` and optional diagnostics.
- `status_error(err)` — `(readiness, err)`. Convert a setup error into readiness data and propagate other errors. Use the returned `code` and `reason`. The readiness code comes from the setup error’s `details.reason_code`.
- `mailbox(sender)`, `address(value)` — Format a sender mailbox for a header or validate a single address.
- `endpoint(entry_id, key, mode?)` — `(url, err)`. Read `entry.data.endpoints[key]` and validate HTTPS. Default `origin` accepts a bare origin and strips a trailing slash. `exact` accepts a complete delivery URL. `prefix` validates a policy prefix and removes its final `/*`.

### `kickside.mail.driver:http`

- `post(url, body, headers, deadline, auth?)` — `(response, err)`. POST with the deadline, a 20-second timeout ceiling, and a bounded response. `auth` accepts `{user, pass}` for Basic authentication.
- `bearer_json(key)` — Authorization and JSON Content-Type headers.
- `encode_message(payload)`, `encode_attachment(bytes)` — `(encoded, err)`. Encode the JSON request and Base64 attachment content.
- `message_id(response)` — `(result, nil)`. Get the nonempty `id` property in a JSON acceptance response. Read provider-specific success headers yourself when needed.
- `retry_hint(response, reset_header, units)` — Milliseconds until retry, or `nil`. `Retry-After` takes precedence. Provider reset units are `seconds`, `epoch_seconds`, or `epoch_milliseconds`.
- `response_detail(response, key, basic_user?)` — Bounded provider detail with credentials and control characters removed. Keep it for the administrator-facing diagnostic.
- `failure(kind, code, message, retryable, status?, retry_after_ms?, provider_detail?)` — Construct a classified native error. `retry_after_ms` is carried on retryable failures.
- `status_error(status, rejected_status, retry_after_ms?, provider_detail?)` — Common provider status classification. `rejected_status` is the provider status that means a message was refused. `authorization_refused(status, detail?)` creates the specific ambiguous authorization failure.

## Classify errors

Treat a clear credential failure as nonretryable `PermissionDenied` with `credentials_invalid`; use `authorization_refused` when a provider's response could reflect an account, plan, or authorization refusal. Use `Invalid` with `message_rejected` for a confirmed message refusal. Preserve valid `Retry-After` hints on retryable rate limits and temporary provider outages. Use `idempotency_conflict` for a key reused with different content and retryable `send_in_progress` for a provider that explicitly reports an in-flight request with that key. An exhausted quota can be a permanent `quota_exhausted` even when the provider uses HTTP 429. The shared HTTP helper handles transport errors and deadlines.

Mail shows these public aliases to ordinary senders. Administrators with activity-log access can see the original classified code and redacted provider detail.

- `credentials_invalid`, `authorization_refused`, `sender_or_recipient_not_allowed`, `request_rejected`, `idempotency_conflict` — `provider_rejected`
- `send_in_progress`, `delivery_deadline_exceeded` — `provider_unavailable`
- `quota_exhausted` — `rate_limited`
- `settings_read_failed`, `invalid_transport_status`, `provider_endpoint_invalid` — `invalid_config`

Mail can also show shared codes directly, including `invalid_config`, `message_rejected`, `provider_rejected`, `provider_transport_failed`, `provider_request_failed`, `provider_unavailable`, `rate_limited`, and `attachment_unavailable` and `incomplete_attachment`. Codes outside the documented public mapping produce `delivery_failed` for ordinary senders. Use a stable code and a native error kind for machine decisions. Keep diagnostic text free of API keys, authorization headers, and provider response bodies outside the bounded redacted detail.

## Retry and verification

Mail classifies failures using the native error kind and `retryable` flag. A retryable failure normally receives up to 32 delivery attempts with backoff from one second to five minutes. Mail caps a provider retry hint at 15 minutes. A request that may already have reached a non-idempotent driver settles as `delivery_uncertain` instead of risking another send.

In a standalone driver harness, override the URL requirement to a loopback TLS listener. Generate a per-run certificate and set `SSL_CERT_FILE` only on the harness process. Grant `http_client.private_ip` in the harness only, on the loopback fixture URL. The providers repository's `test-support/mail-driver-run.sh` implements this pattern. Test admission, setup, attachment encoding, the supplied deadline, success and refusal classification, and egress denial. Build caller identities from the public Mail capability selections.

The [Mail reference](https://github.com/kicksideai/components/blob/main/mail/src/README.md#transport-drivers) describes the contract, operator permissions, and settings editor. The [example tests](https://github.com/kicksideai/components/blob/main/mail/test/src/mailer/driver_example_cases.lua) use the example transport through Mail's harness.
