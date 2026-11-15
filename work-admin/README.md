<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work administration

`kickside/work-admin` configures the published `kickside/work` backend from
**System → Work**. Products can use Work's contracts and HTTP API for their own
interfaces. This module publishes administration only.

Administrators create boards from installed packs or an empty declaration, edit
board names and descriptions, and configure fields, options, item types,
relations, visibility, policy, plugins and pack upgrades. The process builder
edits states, transitions, conditions, approvers, timers, automated stages,
parallel regions and capacity. Changes pass through Work's plan/review/apply
boundary with generation checks and a stable request key; migrations can be
reviewed and resumed. The graph supports branching, loops, large processes,
responsive layout, keyboard selection, zoom and pan.

## Installation and access

Bind `kickside.work.admin:ui_server` to the host HTTP service and
`kickside.work.admin:api_router` to its authenticated router running
`token_auth` and `endpoint_firewall`. Install and bind `kickside/work` and
`kickside/widgets` as usual. Dependencies declare `*`; the committed harness
lock selects published Work 0.1.1 and compatible platform releases.

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
  administrators receive plugin and installed field-type choices.
- `POST /api/v1/work-admin/boards/{id}/principal_labels`: requires board ADMIN
  and resolves up to 200 user/group references through the scoped Directory
  contract. It accepts `{ "refs": [{ "type": "user", "id": "…" }] }`.

Board listing, metadata, schema plans/applies, plugin configuration, pack
discovery/plans/applies and migration resume use Work's published endpoints.
Typed condition and transition operands use its item lookup/query endpoints
for selection. No board, kanban, list, table, backlog or item view is bundled.

## Build and verification

Use Wippy v0.3.60a or newer and Node 22. The build materializes the locked
UI Kit artifact without adding it to the host import map. The two ES-module
entry points and shared chunks live in `static/`, served at
`/kickside-work-admin` and embedded in the published module.

```sh
make setup build typecheck ui-test lint strict check test pack
make test-pg WORK_ADMIN_PG_PORT=5434
```

The standalone harness uses the real authenticated platform stack, published
Work and only repository-local replacements for this module and the existing
platform UI siblings. It fails for empty suites and failed cases. PostgreSQL
uses the `postgres` profile; supply a fresh database through
`WIPPY_ARGS="--set vars.pg_database=work_admin_test"`.

UI tests include review/apply and permission behavior, editor interactions,
diagram layout/route geometry, viewport navigation and browser layout checks.
The vendored Dagre and Graphlib licenses and provenance are retained in
`ui/src/app/settings/vendor/`. Release Please owns release versions and
changelogs; publication follows the repository workflow.
