<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work Kanban

Open **Kanban** in the KickSide shell or follow a Work board link to
`/work-kanban/board/<board-id>[/<backlog|sprints|search>][/issue/<item-id>]`.
The switcher lists readable Work boards bound to `kickside.work.kanban:board_app`.
It searches the loaded pages and can load the next Work directory page.

The **New board** dialog uses Work's board creation capability, installs
`kickside.work.kanban:pack` version 1.0.0 and opens the created board.
The pack supplies the board app binding and creates an empty board. Work
generates a key prefix when the dialog leaves it blank. The create request
supplies Planning's `issue_types` config so its schema provider attaches
typed sprint and milestone membership to the five Kanban issue types.

Board administrators can bind an existing board through Work Admin's Board app
picker or Work's board update command. Review its shared views and schema before
using the Kanban screens.

## Build and test

Use Wippy 0.3.66a and the repository's Work harness dependencies.

```sh
make -C work-kanban setup build typecheck ui-test check lint test pack
make -C work-kanban test WIPPY_ARGS='--profile postgres --set vars.pg_port=5434 --set vars.pg_database=kickside_test_work_kanban'
```

The PostgreSQL profile expects an empty database. The build materializes
ui-kit 1.7.8 and emits `static/index.js` and Wippy metadata. Packaging embeds
`kickside.work.kanban:ui_fs`. The runtime requires Work 0.1.45 or newer for
consumer extension discovery and the pack catalog's create capability.
Planning 0.1.5 and Search 0.1.4 are the plugin floors. The deployment can override `ui_server` (default
`app:gateway`) and `user_security_scope` (default
`kickside.security.groups:members`).

The `ui/src/app` page controller owns the directory, selected schema, URL, and
navigation. Its board-scoped content receives the selected board, schema, route,
Work client and issue navigation intents. The Board and Backlog presentations
and the drawer, create-issue, Planning and Search panels plug into that context.
