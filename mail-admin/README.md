<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Mail administration

`kickside/mail-admin` administers the published `kickside/mail` backend from
**System → Mail**. It publishes the `kickside-mail-admin` library and `kickside-mail-delivery` settings components. The components call the Mail and Platform Settings APIs.

The tab holds the mail template library and delivery Activity:

- **All resources** lists every message, base template, part and image with its
  kind, source, usage and last change, a page at a time in Mail's order, with
  Mail's count of every matching resource. Pickers search Mail a page at a time,
  and titles of references shown together are looked up by their exact names.
  Filters show customized, created and original resources; search covers names
  and template content. **Preview all messages** lists messages a page at a
  time and renders each one with its sample values when its tile scrolls into
  view, three at a time; closing it stops every render.
- **Messages**, **Base templates** and **Parts** open into an editor: the HTML
  and plain-text sources with syntax highlighting and line numbers, the subject
  and base template of a message, an Insert dialog for variables, parts (with
  their inputs filled in), images and the message body slot, and a live preview
  of the unsaved draft beside it (email or plain text, desktop or phone width,
  inline images shown from the preview's data URIs). Variables and part inputs
  are edited with their labels, types, required flags, defaults and sample
  values; lists and records of text have their own controls.
  A draft is reviewed and saved with an optional note; engine errors appear
  under the face they belong to and block saving, and a save that would break
  other messages names them. History shows each version read-only and compares
  it with the current one; Restore loads a version into the draft, which takes
  effect through the same review and save. Resources start from blank or from an
  existing one, and a customized shipped resource resets to the original.
- **Images** lists the images templates show inline, with the messages that
  show them. An image is uploaded through the platform upload flow and Mail
  adopts it; while Mail answers that the upload is still processing, the page
  waits for the platform's completion signal and asks once more; closing the
  dialog ends the wait at once. Deleting an
  image that any template names is refused with those templates listed. Images
  are replaced, reset, restored from History and deleted when no message shows
  them.
- **Activity** lets delivery administrators search recent email by subject or recipient and
  inspect its status, template, sender, origin and failure details. Administrators with
  **Send mail** can resend any message Mail reports as resendable, and delivery
  administrators reach the delivery settings from a failure. Counts above 10,000
  show a minimum, and a search covers the newest 10,000 messages.

Each screen reads what it shows. On a `mail.library` or `mail.activity`
invalidation, the screen refetches the data it displays through the Mail API.
An editor keeps unsaved changes and identifies a newer revision when it arrives.
A write that Mail has committed but not yet projected is read again on the next
`mail.library` invalidation.

A preview shows Mail's warning when Gmail may clip the email, and an email
larger than Mail can send is a problem that blocks saving.

Previews render in a frame with an empty sandbox. Each document starts with a
Content-Security-Policy that allows inline styles and inline images only and a
`base` that opens links in a new context, which the sandbox refuses, before any
template bytes; template HTML makes no outside requests and cannot navigate the
frame.

The source editor is CodeMirror 6 (MIT), bundled into the module and loaded only
when an editor opens. Jet template tags share Liquid's `{{ … }}` delimiters, so
the Liquid grammar over HTML highlights template expressions inside markup.

## Delivery settings

`kickside.mail.admin:delivery_block` is Mail's block in System → Settings →
Integrations, rendered by `kickside-mail-delivery`. It lists the transports
Mail admits from `GET /api/v1/mail/delivery`, each with its readiness and setup
issue, and switches the service from a dropdown: the block writes
`kickside.mail:driver` through `PUT /api/v1/settings` with the
`driver_revision` Mail reported, so a concurrent change is refused and read
again. The chosen service's settings namespace and Mail's own `kickside.mail`
settings (From address, From name, Reply-to, log retention) render through the
platform's `kickside-settings-provider` card, which reads, validates and saves
each namespace. A test email goes to the signed-in administrator.

The provider card saves its fields one by one and sends no revision, because
Settings lists no per-setting revision; a refused field can leave the fields
before it saved. Each transport's settings namespace also keeps its own
generated Settings entry, because a block can claim only namespaces it names.
Both belong to Platform Settings.

## Installation and access

Bind `kickside.mail.admin:ui_server` to the host HTTP service and install
`kickside/mail` with its authenticated API router. The
`ui.settings_tab` entry `kickside.mail.admin:settings_tab` appears only for
callers with `access` on `kickside.mail.api:library_list.endpoint`, which
Mail grants with **Edit mail library**. The page reads `GET /mail/capabilities`:
Activity requires **Administer mail delivery**. Send again and Send test to me
also require **Send mail**. Uploading and replacing images requires the Mail library
component grant the host composes through `kickside.mail:library_editor_grant`.

The public `kickside.mail.admin.security:module_access` policy grants the view
component, the tab declaration and the static bundle to the configured
`user_security_scope` (platform Members by default). It grants no Mail
capability.

Routes inside the tab are `/system/mail`, `/system/mail/<messages|bases|parts|assets>`, `/system/mail/assets/<name>`,
`/system/mail/<kind>/<name>/<content|variables|used-by|history>`,
`/system/mail/activity`, `/system/mail/activity/template/<name>` and
`/system/mail/activity/<message-id>`.

## Build and verification

Use the Wippy runtime Mail requires (v0.3.68a or newer, with the Jet text escape option) and Node 22.
The build materializes the locked UI Kit artifact without adding it to the host
import map, and writes the component to `static/`, which the module embeds.

```sh
make setup build typecheck ui-test lint strict check test pack
make test-pg MAIL_ADMIN_PG_PORT=5435
```

The harness boots the authenticated platform stack with the sibling Mail
source and checks the tab declaration, the served bundle and the tab's access
gate for members and library editors. PostgreSQL uses the `postgres` profile;
supply a fresh database through `WIPPY_ARGS="--set vars.pg_database=mail_admin_test"`.
Release Please owns release versions and changelogs.
