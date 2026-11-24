<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work specification

## Board UI binding

A UI module registers a `registry.entry` with `meta.type: kickside.work.ui.app`, a title, an icon, and one destination. Use `meta.page` for a local board-route prefix or `meta.component` for a web component tag. Append a slash and the encoded board component ID to the page route, or pass the ID to the component as its `board` property. An optional `meta.packs` list names suitable Work pack IDs for consumers that present UI and pack choices. Grant registry discovery for the entry to the users who can bind boards to it.

`board.create` and `WorkCreateBoard` accept an optional `ui_app` registry entry ID. A pack can preset it with `data.ui_app` and an explicit creation argument takes precedence. Applying or updating a pack on an existing board leaves its binding in place. Board ADMIN can set `ui_app` with `board.update` or `WorkUpdateBoard`, or clear the setting with an empty string. Work validates new bindings against registered UI apps before any write. Existing unbound boards can be assigned a UI through the same update command.

`board.list`, `WorkListBoards`, and `GET /work/boards` expose each readable board’s optional `ui_app` ID. Pass that ID as `ui_app` to filter discovery before pagination. Follow `next` with the same filter. Discovery uses Component’s READ-filtered metadata query. Pass `include_counts: false` (HTTP `include_counts=false`) to return board metadata and access without reading items. The default includes exact caller-visible item counts. Pagination uses Component’s offset within the readable, filtered directory.

`GET /work/packs` returns the caller-visible pack catalog and `data.can_create_board`. The flag requires both access to `POST /work/boards` and `work.board.create` on `kickside.work.binding:board`. The Work administration policy grants both. The flag describes the caller's root board creation capability. Pack readiness, selected version and creation inputs are checked by the create command. To create from a pack without sample items, pass its exact ID and version, `starter: false`, an idempotency key, and `declaration.key_prefix` if supplied. Replay the same request and key after an uncertain result.

## Consumer extension discovery

Call `kickside.work:consumer_board.get_schema` or `POST /work/boards/{id}/get_schema` with `{ "include_extensions": true }` to get the active schema and placements in one authenticated board read. The response includes `extensions`, an array of `{ id, slot, tag?, title, order, access, plugin, target }`. When the caller requests a historical generation or omits the flag, Work omits `extensions`. An active request with no eligible placements returns an empty array.

- `kickside.work.ui.card` declares a `card_badge` targeting `item` by default or `item:<type_id>` when `meta.type_ref` names an existing item type.
- `kickside.work.ui.panel` declares a `drawer_panel` with the same item targets, or a `board_panel` when `meta.target` is `board:<role>`, such as `board:sprints` or `board:search`.
- `kickside.work.ui.filter` declares a `filter` with `meta.target` set to `field:<code>`, `scope:<registry_id>` or `operand:<registry_id>`.

Use `registry.entry` with a nonblank `meta.title` and the registered custom-element name in `meta.tag`. A filter may omit the tag so the consumer can use its own control. The entry ID is the stable placement ID. `meta.order` is an integer and defaults to 100. `meta.access` defaults to `read` and may require `write`, `delete` or `admin` on that board. Use `meta.plugin` for the owning Work manifest or `meta.plugins` for alternatives in preference order. The singular ID is tried first. The returned `plugin` is the first eligible manifest. Grant discovery on the exact placement and manifest entries and grant the component bundle to the intended audience.

Work discovers these entries in the request caller's registry scope. It checks the active manifest and board attachment in the selected snapshot, the effective board access mask, and each filter target. A field must be queryable under the same board-wide read rules as Work queries. A scope must be an admitted plugin seam that the caller can query. An operand must be an admitted plugin seam callable by the caller. Work omits invalid declarations and returns at most 16 per slot, ordered by ascending order and then registry ID. For each board panel role it returns the first eligible placement in that order.

Load a tag lazily through the shell and give a badge only the already-authorized card summary. The card displays at most two optional badges and the drawer can show the overflow. Mount drawer extensions when the drawer opens. Filter controls send typed predicates through Work query validation. Work commands and plugin endpoints continue to enforce their own access and input checks.

## Plugin extensions

Manifests with `meta.type: kickside.work.plugin` declare interface version 1, an attachment binding, optional deployment settings and board configuration, dependencies, seam IDs, tools, projections, and a schema source. Optional `title`, `description`, `icon` and `category` strings describe the plugin to administrators; `category` names the purpose heading that groups it in board administration. Schema sources are static templates or `kickside.work:schema_provider` bindings. Packs compose those sources with a board schema and saved views.

When board ADMIN supplies `config` to `configure_plugin` for an active plugin with a schema provider, Work submits the complete override through the same provider resolution, compilation and change checks as schema review. A successful change records the configuration and compiled schema in one schema generation. Refusals return the typed schema findings. Settings for plugins whose schemas are static or absent are written directly to the attachment.

The published seams are declarative field types over the existing value forms, guards for transitions and state checks, concrete operands, SQL query and search scopes, and search resolver bindings. Field configuration can use the validators of its declared form. Work refuses stored-value reinterpretation through the ordinary schema review. Guard, check and operand calls have a one-second execution limit. Guards return up to 64 findings and result data is bounded to 65,536 canonical JSON bytes. A board adopts each scope ID once. A scope that declares a backing projection names a kind on its owning manifest.

A SQL query scope supplies a source with an index that supports lookup by the declared board and item columns, including through an attachment-filtered view. Work probes the source for each candidate item and accepts the item when one source row satisfies all scope filters.

Schema review reports a `field.remove` finding when a declaration removes a field definition with stored values or detaches it from an item type holding values. It evaluates the compiled schema by stable field ID across authored and plugin contributions. A refused draft leaves the current generation and its reads in place. Each finding reports `count`, the number of board items holding a value in the field. Plan and apply accept `resolutions` keyed by the paths in the findings and require the current `expected_generation` with those choices. Keep cancels the draft. Archive removes the field from the active item shape and preserves stored cells. Reattaching an archived field with the same ID makes its values readable again. Drop commits ordinary item unsets and the schema change under one board-head expectation. Audit history follows the board's existing retention policy. The review seeks bounded item pages of the affected types. If a review exceeds its candidate budget or a drop exceeds the atomic patch limit, Work refuses the draft before writing anything.

Installed state workers read bounded pages from the `kickside.work.extensions:plugin_feed` library. Work validates the active attachment and declared projection registration in the snapshot that reads the changes. The feed covers all items on that board, including items with visibility restrictions and terminal entries. Feed continuations conceal item IDs. Work applies caller visibility when reading derived scopes, totals and filters. Event workers receive selected retained events. When an installed plugin's manifest or Hub version changes, Work queues lifecycle jobs for its active attachments after package migrations are applied. The jobs register new projections and remove obsolete cursors using the saved board configuration. Changing a declared revision resets the corresponding worker.

Board ADMIN can omit `config` from `configure_plugin` to retry an active attachment using its saved overrides. The lifecycle batch publishes the rebuild event. Resync preserves healthy unchanged registrations and rebuilds a parked state projection from current items. A parked event projection replays from its registered start and reports the retained floor if that start is gone. An independent view type can bind a saved view to a registered web component. Removing the view type makes run return `view_type_unavailable` and preserves the saved definition for repair.

## Work queries and saved views

Renaming a saved view requires its personal owner or board ADMIN. Saving a definition requires view WRITE and admission to its board selection. If save includes a title, the rename authority applies as well. Work saves the new title and definition in one component transaction.

`kickside.work:view` creates, lists, reads, saves, renames, deletes and runs saved views. Shared views are owned by the anchor board and placed beneath it. Personal views sit at root. Deletion requires the personal owner or board ADMIN and reports `deleted` or `in_progress` while component cleanup completes. Lists page in creation order under the caller's read access. The binding is `kickside.work.binding:view` and its class is `kickside.work:view`.

- Single-board flat items use the top-level `after` cursor. Keep the selection and order. A saved grouped view also returns a flat item page. Continue it with `after` and flat arguments such as `limit` and `min_seq`.
- Single-board groups use `group_after`. Keep the board, viewer, generation, selection and grouping. Send `group_limit` and `measures` on the first grouped request and subsequent group pages.
- Items within a group or subgroup use that bucket's `after` cursor. Run a flat query filtered to the bucket using the same item order.
- Cross-board flat items use `cross_after`. Keep the original selection, viewer authority, filters and sort. Restart without the cursor if the selection, authority or schema invalidates it.

Pass each returned cursor unchanged and use one continuation mode per request. Single-board queries support up to three sort keys, nulls last, and `min_seq` as a minimum committed sequence. Group pages follow the group keys with missing keys last. `group_limit` defaults to 200 and accepts 1 through 200. Two-level pages spend that limit on subgroups. A parent that spans pages repeats with its full count and measures. Each call reads a committed snapshot and reports `as_of`. A read waiting on a needed index omits groups and `group_after`. Inspect `reindexing` before using the result.

Single-level queries with no selection filter or plugin scope seek past the previous group key when an existing index covers the group key and item ID. Inspected rows spend the read allowance before visibility is applied. The separately capped top-level item page keeps its requested order. The group page returns the requested number of complete groups or reaches the end of the selection. Two-level and other group shapes produce exact results when their candidate selection fits the allowance. A group page over its allowance returns `incomplete: true` and `group_limited: true` and omits groups and `group_after`.

Grouped queries and saved-view runs accept up to four sums with unique IDs in `measures`. A sum uses `{ id, op: "sum", field }` and requires board-wide READ on an indexed scalar `int` or `dec` field. Counts and sums cover the same caller-visible, filtered rows. Totals are exact base-ten strings, including totals beyond JSON's safe integer range. Cleared and absent values contribute nothing. A measure with no values is `null`.

A saved view can select up to 50 distinct boards or use `view.boards: "readable"`, expanded for the current viewer on every run. Create and save validate compatible filters, columns, scopes and one indexed sort key across the selection. Cross-board queries are flat and use a single sort key. Get and run require READ on the anchor and selected boards. When a selected board becomes inaccessible, those methods return a generic access denial. The anchor list returns only `view_id`, `board_id` and `status: "unavailable"` for that entry and advances its continuation. Work stores the selection expression and runs under the viewer's live authority.

## Item write invariants

Omit `parent_types` or use an empty list for a root-only item type. A nonempty list allows the listed item type IDs as parents. Include JSON `false` to also allow top-level placement. For example, `["root", false]` allows a parent item whose type ID is `root` and also allows the item at the top level. Creating or reparenting an item at root when its type requires a parent returns `parent_required` on `parent`.

A state’s `require` list applies on entry and after ordinary edits settle. Work checks the item’s resulting state and each active parallel region in the item’s process generation. A missing value returns `required_field` on the corresponding field. An edit that leaves a state may clear a field that the resulting states no longer require.

An item reference field can declare `config.item_type` as the target item type ID and `config.item_states` as the allowed target state IDs. Work checks each written reference after resolving its live, visible target, including targets on another board. A type or state mismatch returns `invalid_reference` on the field. State restrictions govern new assignments. Existing references remain when their target transitions.

Directed relations can declare `from_types` and `to_types` as nonempty lists of item type IDs. Source types are declared on the owning board. Target types are matched against the live, visible item after resolving its destination board and any move aliases. An omitted list allows any type at that endpoint. A link with a mismatched endpoint returns `relation_source_type` on `item` or `relation_target_type` on `target`. Symmetric relations omit the directional lists. Work refuses changes to endpoint lists while the relation has links, using the existing relation shape check.

Move alias resolution follows up to 32 redirects. Moves redirect retained aliases to the new destination. If a chain still exceeds the limit, resolution returns `key_alias_hop_limit`.

A cross-board move admits at most 5,000 live subtree items and 5,000 outgoing relation edges. Planning returns `move_edge_limit` before preparing destination operations when the source selection exceeds the edge allowance. Mapped links use the ordinary endpoint validation.

A transition with `people: false` is reserved for the process engine and board ADMIN force. A direct named transition without force receives `unknown_transition`. Stage reports and state timers can take that route. When `people` is omitted, discovery hides stage outcome routes, while an otherwise eligible non-automatic route still accepts a direct call by name.

A transition with `prepare_command` names a registered `function.lua` with `meta.type: kickside.work.transition_command`. The owning service calls `kickside.work.service:transition_command` with `{ command, input }`. Work invokes the named function with `input` under the authenticated actor. The preparation function validates the caller's request and returns an atomic Apply request with a key, expected head and exactly one transition operation. Work checks the owner on the item's pinned process when applying that operation. Ordinary Work Apply and Bulk, including ADMIN force, cannot run these transitions.

The existing `command` field continues to authorize ordinary Apply according to the host's `work.transition.command` policy for the declared owner. A host must restrict that legacy action to its producing services. KickSide App 0.2.57 excludes it from the administrator wildcard. Use at most one of `command` and `prepare_command` on a manual transition. Work excludes both from ordinary transition discovery and process routing.

The Planning pack uses this rule to close sprints through its preview and commit command. Milestones close through their ordinary transition. The preview moves or clears unfinished live membership. Completed, canceled and trashed issues retain their assignment. New assignments require a planned or active sprint.

### Adopting Work-owned preparation

Providers can adopt `prepare_command` in a new process generation. The producing service needs `funcs.call` on the dispatcher and its preparation function and `registry.get` on the preparation function. Preserve the original atomic key, expected head, operations, source, and origin when callers may retry a previously committed request. Keep the original service and its exact policy available while any live or restorable item remains pinned to a generation with `command`. Verify execution on affected generations and replay of a committed request before retiring the legacy service.

## Agent pipelines

The Agent Queue pack declares `claimant` and `claim_expires_at` as `transition_only` fields, so ordinary edits cannot change or clear them. `claim` enters the claimed state with both fields present. `renew` re-enters that state on a new visit. Its `at_field` timer has `future: true`, requiring the deadline to be later than the visit's entry time. Expiry releases the current visit and clears both fields. Workers cooperate under board WRITE and use the version from their last successful mutation as `expect_version` for their next mutation. A superseded version yields `version_mismatch`.

WorkReport and WorkApply use the same report rules. A checkpoint supplies `kind: progress` and a `progress` object, omits `outcome` and `outputs`, and requires a command key. WorkApply takes the key on its batch. A terminal report supplies `outcome` (`passed`, `failed`, or `canceled`), omits `kind`, and can include `outputs` and a final `progress` object. WorkReport returns a request error for invalid report forms. WorkApply returns the same code and message in the operation's findings.

Both forms require the active visit and attempt. The latest progress is limited to 65,536 canonical JSON bytes. A `stage.progressed` fact leaves the attempt running with its current deadline. Terminal reports preserve the checkpoint when they omit progress, and terminal outputs use an independent size limit.

The Wait for Work item Block matches a single live item state under board and item READ. Observing a live item in a parallel state returns `INVALID/work_wait_parallel_unsupported`. It checks the item when the Block starts and after commits to the board's projection. The optional input cursor can carry a previous wait's position. Each invocation starts from the current projection. The Block returns `matched` with the item id, state and version, or `timed_out`. Both outcomes carry the unfiltered feed head from the latest item read, with the caller's access stamp and current retention floor. A wait lives for the current Block invocation.

## Work Templates

### Template catalog

A board with `kickside.work.templates:plugin` keeps up to 128 immutable template versions in its plugin attachment. Each version holds one Work create preset and the field codes that callers may override. Board ADMIN publishes and archives versions. Board READ lists active versions and exposes only defaults visible under current field and item access. Board WRITE instantiates an exact version with an explicit key, subject to current schema and create admission. After checking the caller's live board WRITE, Work checks the principal-bound receipt against the original template ID, version and overrides. Matching receipts replay through archive, catalog expiry and attachment teardown while the Work receipt remains within the board's event window. Fresh creates require an active catalog version.

The Templates plugin initializes the catalog table on the Work target database. The additive migration preserves existing versions.

Use `GET /work/boards/{id}/templates` to list active versions, then `POST /work/boards/{id}/templates/instantiate` with `template_id`, `version`, `key`, and optional `overrides`. The endpoints use the authenticated `kickside.work:api_router` and the Work Templates member policy. They call the Templates contract as the request actor and return the standard Work HTTP envelope.

### Recurring tasks

Use Automation's standard installation for `kickside.automation.recurring:task` with the board as its parent. Component placement requires board WRITE. Automation runs each occurrence as the installer and owns scheduling, run-now, pause, resume, and reconfiguration. The `kickside.work.templates:recurring` action pins a board, template ID, and exact version. It submits a Work create under the installer's current access with a key derived from the automation origin and occurrence identity. Fresh occurrences require a board event window that covers Automation replay. An operator replay without retained Work receipt evidence returns `template_replay_unavailable`.

Component returns `CONFLICT` when the board delete request finds a live recurring task placed under the board. To delete a board, delete or move its recurring tasks first.
