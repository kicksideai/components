<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work specification

## Board UI binding

A UI module registers a `registry.entry` with `meta.type: kickside.work.ui.app`, a title, an icon, and one destination. Use `meta.page` for a local board-route prefix or `meta.component` for a web component tag. Append a slash and the encoded board component ID to the page route, or pass the ID to the component as its `board` property. An optional `meta.packs` list names suitable Work pack IDs for consumers that present UI and pack choices. Grant registry discovery for the entry to the users who can bind boards to it.

`board.create` and `WorkCreateBoard` accept an optional `ui_app` registry entry ID. A pack can preset it with `data.ui_app` and an explicit creation argument takes precedence. Applying or updating a pack on an existing board leaves its binding in place. Board ADMIN can set `ui_app` with `board.update` or `WorkUpdateBoard`, or clear the setting with an empty string. Work validates new bindings against registered UI apps before any write. Existing unbound boards can be assigned a UI through the same update command.

`board.list`, `WorkListBoards`, and `GET /work/boards` expose each readable board’s optional `ui_app` ID. Pass that ID as `ui_app` to filter discovery before pagination. Follow `next` with the same filter. Discovery uses Component’s READ-filtered metadata query. Pass `include_counts: false` (HTTP `include_counts=false`) to return board metadata and access without reading items. The default includes exact caller-visible item counts. Pagination uses Component’s offset within the readable, filtered directory.

## Plugin extensions

Manifests with `meta.type: kickside.work.plugin` declare interface version 1, an attachment binding, optional deployment settings and board configuration, dependencies, seam IDs, tools, projections, and a schema source. Schema sources are static templates or `kickside.work:schema_provider` bindings. Packs compose those sources with a board schema and saved views.

The published seams are declarative field types over the existing value forms, guards for transitions and state checks, concrete operands, SQL query and search scopes, and search resolver bindings. Field configuration can use the validators of its declared form. Work refuses stored-value reinterpretation through the ordinary schema review. Guard, check and operand calls have a one-second execution limit. Guards return up to 64 findings and result data is bounded to 65,536 canonical JSON bytes. A board adopts each scope ID once. A scope that declares a backing projection names a kind on its owning manifest.

State workers consume the bounded `plugin_feed` pages. Event workers receive selected retained events. Resync preserves healthy unchanged registrations and rebuilds a parked state projection from current items. A parked event projection replays from its registered start and reports the retained floor if that start is gone. Changing a declared revision resets the corresponding worker. An independent view type can bind a saved view to a registered web component. Removing the view type makes run return `view_type_unavailable` and preserves the saved definition for repair.

## Grouped reads

Single-level queries with no selection filter or plugin scope use a keyset seek when an existing index covers the group key and item ID. The walk handles missing keys last and budgets inspected rows before applying visibility. The separately capped top-level item page keeps its requested order. A page returns the requested number of complete groups or reaches the end of the selection. Two-level and other group shapes still return exact results when their candidate selection fits the allowance, including full totals for a parent repeated across subgroup pages. A group page that exceeds its allowance returns `incomplete: true` and `group_limited: true` without groups or a group continuation.

## Item write invariants

Omit `parent_types` or use an empty list for a root-only item type. A nonempty list allows the listed item type IDs as parents. Include JSON `false` to also allow top-level placement. For example, `["root", false]` allows a parent item whose type ID is `root` and also allows the item at the top level. Creating or reparenting an item at root when its type requires a parent returns `parent_required` on `parent`.

A state’s `require` list applies on entry and after ordinary edits settle. Work checks the item’s resulting state and each active parallel region in the item’s process generation. A missing value returns `required_field` on the corresponding field. An edit that leaves a state may clear a field that the resulting states no longer require.

An item reference field can declare `config.item_type` as the target item type ID. Work checks each written reference after resolving its live, visible target, including targets on another board. A type mismatch returns `invalid_reference` on the field. Fields with no target type accept any visible, live item type.

Directed relations can declare `from_types` and `to_types` as nonempty lists of item type IDs. Source types are declared on the owning board. Target types are matched against the live, visible item after resolving its destination board and any move aliases. An omitted list allows any type at that endpoint. A link with a mismatched endpoint returns `relation_source_type` on `item` or `relation_target_type` on `target`. Symmetric relations omit the directional lists. Work refuses changes to endpoint lists while the relation has links, using the existing relation shape check.

Move alias resolution follows up to 32 redirects. Moves redirect retained aliases to the new destination. If a chain still exceeds the limit, resolution returns `key_alias_hop_limit`.

A cross-board move admits at most 5,000 live subtree items and 5,000 outgoing relation edges. Planning returns `move_edge_limit` before preparing destination operations when the source selection exceeds the edge allowance. Mapped links use the ordinary endpoint validation.

A transition with `people: false` is reserved for the process engine and board ADMIN force. A direct named transition without force receives `unknown_transition`. Stage reports and state timers can take that route.

## Agent pipelines

The Agent Queue pack composes a principal field, an absolute time field and a process timer. Its `claim` edge enters the claimed state with both fields present. `renew` re-enters that state on a new visit. The timer releases the current visit and clears the two fields. Workers use the item version from their last successful mutation as `expect_version` for their next mutation. A superseded version yields `version_mismatch`.

A `report` with `kind: progress` requires a keyed command and the active visit and attempt. It replaces the attempt's latest progress with an object of at most 65,536 canonical JSON bytes. The corresponding `stage.progressed` fact does not route the item, affect the attempt deadline or set the terminal fields. Terminal reports apply the same progress bound and preserve the checkpoint when they omit progress. Terminal outputs use their existing independent size limit.

The Wait for Work item Block matches a single live item state under board and item READ. Observing a live item in a parallel state returns `INVALID/work_wait_parallel_unsupported`. It checks the item when the Block starts and after commits to the board's projection. The optional input cursor can carry a previous wait's position. Each invocation starts from the current projection. The Block returns `matched` with the item id, state and version, or `timed_out`. Both outcomes carry the unfiltered feed head from the latest item read, with the caller's access stamp and current retention floor. A wait lives for the current Block invocation.

## Work Templates

### Template catalog

A board with `kickside.work.templates:plugin` keeps up to 128 immutable template versions in its plugin attachment. Each version holds one Work create preset and the field codes that callers may override. Board ADMIN publishes and archives versions. Board READ lists active versions and exposes only defaults visible under current field and item access. Board WRITE instantiates an exact version with an explicit key, subject to current schema and create admission. Archiving blocks fresh creates and preserves committed Work receipt replays while their evidence is retained. Attachment teardown removes the catalog.

The Templates plugin initializes the catalog table on the Work target database. The additive migration preserves existing versions.

Use `GET /work/boards/{id}/templates` to list active versions, then `POST /work/boards/{id}/templates/instantiate` with `template_id`, `version`, `key`, and optional `overrides`. The endpoints use the authenticated `kickside.work:api_router` and the Work Templates member policy. They call the Templates contract as the request actor and return the standard Work HTTP envelope.

### Recurring tasks

Use Automation's standard installation for `kickside.automation.recurring:task` with the board as its parent. Component placement requires board WRITE. Automation runs each occurrence as the installer and owns scheduling, run-now, pause, resume, and reconfiguration. The `kickside.work.templates:recurring` action pins a board, template ID, and exact version. It submits a Work create under the installer's current access with a key derived from the automation origin and occurrence identity. The board's event retention must cover Automation replay. An operator replay whose Work receipt evidence has expired returns `template_replay_unavailable`.

Component returns `CONFLICT` when the board delete request finds a live recurring task placed under the board. To delete a board, delete or move its recurring tasks first.
