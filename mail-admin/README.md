<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Mail administration

`kickside/mail-admin` administers the published `kickside/mail` backend from
**System → Mail**. It publishes one component, `kickside-mail-admin`, and no
backend of its own: every read and change goes through Mail's HTTP API.

The tab holds the mail template library and delivery Activity:

- **All resources** lists every message, base template and part with its kind,
  source, usage and last change. Filters show customized, created and original
  resources, and search covers names and template content.
- **Messages**, **Base templates** and **Parts** list one kind each. Opening a
  resource shows its source in both faces (HTML and plain text), its variables
  or inputs with samples and defaults, what uses it, and its saved versions.
  A customized resource can be reset to the included version, an earlier
  version can be restored, any resource can be duplicated, and a resource
  created here can be deleted unless something still uses it.
- **Assets** is reserved for inline images.
- **Activity** lists recent email with its status, template, sender and origin.
  Opening a message shows its reason, history and technical details, and a
  failed message can be sent again.

The page refetches when Mail announces `mail.library.changed` or
`mail.message.changed`, and when the host tab becomes visible again.

## Installation and access

Bind `kickside.mail.admin:ui_server` to the host HTTP service and install
`kickside/mail` with its authenticated API router. The
`ui.settings_tab` entry `kickside.mail.admin:settings_tab` appears only for
callers who can reach `kickside.mail.api:library_list.endpoint`, which Mail
grants with **Edit mail library**. Activity appears for callers with
**Administer mail delivery**; Send again also requires **Send mail**.

The public `kickside.mail.admin.security:module_access` policy grants the view
component, the tab declaration and the static bundle to the configured
`user_security_scope` (platform Members by default). It grants no Mail
capability.

Routes inside the tab are `/system/mail`, `/system/mail/<messages|bases|parts|assets>`,
`/system/mail/<kind>/<name>/<content|variables|used-by|history>`,
`/system/mail/activity`, `/system/mail/activity/template/<name>` and
`/system/mail/activity/<message-id>`.

## Build and verification

Use Wippy v0.3.68a or newer (Mail needs the Jet text escape option) and Node 22.
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
