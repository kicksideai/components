<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work administration

`kickside/work-admin` configures the published `kickside/work` backend from
**System → Work**. Products can use Work's contracts and HTTP API for their own
interfaces. This module publishes administration only.

Administrators create boards from installed packs or an empty declaration, edit
board names and descriptions, and configure fields, options, item types,
relations, visibility, policy, plugins and pack installation/upgrades. The process builder
edits states, transitions, conditions, approvers, timers, automated stages,
parallel regions and capacity. Changes pass through Work's plan/review/apply
boundary with generation checks and a stable request key; migrations can be
reviewed and resumed. The graph supports branching, loops, large processes,
responsive layout, keyboard selection, zoom and pan.

## Installation and access

Bind `kickside.work.admin:ui_server` to the host HTTP service and
`kickside.work.admin:api_router` to its authenticated router running
`token_auth` and `endpoint_firewall`. Install and bind `kickside/work` and
`kickside/widgets` as usual. The Work dependency floor is 0.1.15. This release
supports board ADMIN schema options, typed board admission, automated stage
Flow bindings, and explicit visibility removal.

`kickside.work.admin:admin` announces `kickside-work-admin` and the
`ui.settings_tab` mount. The platform checks
`kickside.work.api:create.endpoint` before displaying the tab, following the
platform administration convention. Each board still requires its own ADMIN
access and the backend's schema-administration capability.
`kickside.work.admin:board_settings` announces
`kickside-work-board-settings`, accepting `board-id` and `embedded`; products
may embed it and handle its `navigate` event for related board routes.

The public `kickside.work.admin.security:module_access` policy composes exact
view, asset and helper entry grants into the configured
`user_security_scope` (platform Members by default). It grants no Work backend
administration rights. Its two helper routes are:

- `GET /api/v1/work-admin/boards/{id}/options`: reads the board under the
  caller's scope and reports independent READ/WRITE/ADMIN access. Only board
  administrators receive plugin and installed field-type choices. `installed_types`
  carries the same descriptors as `schema_options.field_types`. The Fields picker uses
  each descriptor's value form, index choices and configuration schema.
- `POST /api/v1/work-admin/boards/{id}/principal_labels`: requires board ADMIN
  and resolves up to 200 user/group references through the scoped Directory
  contract. It accepts `{ "refs": [{ "type": "user", "id": "…" }] }` and returns
  `invalid_principal_refs` for malformed batches.

Board listing, metadata, schema plans/applies, plugin configuration, pack
discovery/plans/applies and migration resume use Work's published endpoints.
Typed condition and transition operands use its item lookup/query endpoints
for selection. No board, kanban, list, table, backlog or item view is bundled.

## Build and verification

Use Wippy v0.3.60a or newer and Node 22. The build materializes the locked
UI Kit artifact without adding it to the host import map. The three ES-module
entry points and their shared chunks live in `static/` and are embedded in the
published module.

- `/kickside-work-admin/admin.js` opens System → Work.
- `/kickside-work-admin/settings.js` opens the embeddable board settings.
- `/kickside-work-admin/defaults.js` opens Work application defaults.

Run `make check` to verify the registry entries, the installed package and the
assets for all three components.

```sh
make setup build typecheck ui-test lint strict check test test-published test-scope pack
make test-pg WORK_ADMIN_PG_PORT=5434
```

The standalone harness uses the real authenticated platform stack and the
sibling Work source. It validates `structuredContent` against the advertised
output schemas for all 41 static Work tools through MCP 0.2.13 or later. The
published Work probe installs the exact minimum Work release and exercises a
published Flow binding, ADMIN-only schema options, visibility removal, and
saved-view rejection.
The custom scope probe exercises both helpers with a host-selected group. The
harness fails for empty suites and failed cases. PostgreSQL
uses the `postgres` profile; supply a fresh database through
`WIPPY_ARGS="--set vars.pg_database=work_admin_test"`.

UI tests include review/apply and permission behavior, editor interactions,
diagram layout/route geometry, viewport navigation and browser layout checks.
The vendored Dagre and Graphlib licenses and provenance are retained in
`ui/src/app/settings/vendor/`. Release Please owns release versions and
changelogs; publication follows the repository workflow.


Board headers expose ADMIN-only sharing through the platform `kickside-share`
widget. Identity editing uses the shared icon picker. All settings controls live
in their ordinary sections; human-readable labels leave stored identifiers and
values unchanged. Native dialogs are retained as the documented owner-approved
ShadowRoot overlay exception, with browser modality and focus restoration.

System → Work edits individual boards; its Application defaults link opens
System → Settings. The Work block there keeps every `kickside.work` setting in
the shared `kickside-settings-provider` and links back to Board settings. Board
policy overrides are optional: blank uses the application default. Zero audit
and interval days selects 365 days, while zero trash/deletion-record days permits
immediate cleanup. Comments per item supports a board override of 1–100000.

An existing empty board can use Install pack and review the backend's plan before
applying. Required plugins use exact manifest IDs and the existing configuration
form during pack review. Packed creation uses each required plugin’s declared configuration fields.
It submits values under the exact plugin IDs and includes them in the retry
identity so Work can validate the required configuration. Refresh status explicitly reloads plugin
lifecycle/projection progress while preserving a schema draft.
