<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Mail administration

`kickside/mail-admin` administers the published `kickside/mail` backend from
**System → Mail**. It publishes one component, `kickside-mail-admin`, and no
backend of its own: every read and change goes through Mail's HTTP API.

The tab holds the mail template library and delivery Activity:

- **All resources** lists every message, base template, part and image with its
  kind, source, usage and last change. Filters show customized, created and
  original resources; search covers names and template content.
  **Preview all messages** renders every message with its sample values through
  the current library.
- **Messages**, **Base templates** and **Parts** open into an editor: the HTML
  and plain-text sources with syntax highlighting and line numbers, the subject
  and base template of a message, an Insert dialog for variables, parts (with
  their inputs filled in), images and the message body slot, and a live preview
  of the unsaved draft beside it (email or plain text, desktop or phone width,
  inline images shown from the preview's data URIs). Variables and part inputs
  are edited with their types, required flags, defaults and sample values.
  A draft is reviewed and saved with an optional note; engine errors appear
  under the face they belong to and block saving, and a save that would break
  other messages names them. History shows each version read-only, compares it
  with the current one, and restores it. Resources start from blank or from an
  existing one, and a customized shipped resource resets to the original.
- **Assets** lists the images templates show inline. Images are uploaded
  through the platform upload flow, replaced, reset, restored from History and
  deleted when no message shows them.
- **Activity** lists recent email with its status, template, sender and origin,
  searchable by subject and recipient. Delivery administrators see every
  message; a sender sees their own, with the neutral failure text. Opening a
  message shows its reason, history and technical details, and a failed message
  can be sent again.

The page refetches when Mail announces `mail.library.changed` or
`mail.message.changed`, and when the host tab becomes visible again. Leaving an
unsaved draft asks first, and the host receives `dirty-change`.

The source editor is CodeMirror 6 (MIT), bundled into the module and loaded only
when an editor opens. Jet template tags share Liquid's `{{ … }}` delimiters, so
the Liquid grammar over HTML highlights template expressions inside markup.

## Installation and access

Bind `kickside.mail.admin:ui_server` to the host HTTP service and install
`kickside/mail` with its authenticated API router. The
`ui.settings_tab` entry `kickside.mail.admin:settings_tab` appears only for
callers who can reach `kickside.mail.api:library_list.endpoint`, which Mail
grants with **Edit mail library**. The page reads `GET /mail/capabilities`:
Activity appears for **Administer mail delivery** and, limited to the caller's
own email, for **Send mail**; Send again and Send test to me also require
**Send mail**. Uploading and replacing images requires the Mail library
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
