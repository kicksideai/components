<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work specification

## Board UI binding

A UI module registers a `registry.entry` with `meta.type: kickside.work.ui.app`, a title, an icon, and one destination. Use `meta.page` for a local board-route prefix or `meta.component` for a web component tag. Append a slash and the encoded board component ID to the page route, or pass the ID to the component as its `board` property. An optional `meta.packs` list names suitable Work pack IDs for consumers that present UI and pack choices. Grant registry discovery for the entry to the users who can bind boards to it.

`board.create` and `WorkCreateBoard` accept an optional `ui_app` registry entry ID. A pack can preset it with `data.ui_app` and an explicit creation argument takes precedence. Applying or updating a pack on an existing board leaves its binding in place. Board ADMIN can set `ui_app` with `board.update` or `WorkUpdateBoard`, or clear the setting with an empty string. Work validates new bindings against registered UI apps before any write.

`board.list`, `WorkListBoards`, and `GET /work/boards` expose each readable board’s optional `ui_app` ID. Pass that ID as `ui_app` to filter discovery before pagination. Follow `next` with the same filter. Discovery uses Component’s READ-filtered metadata query and the existing caller-visible board counts.

## Item write invariants

Omit `parent_types` or use an empty list for a root-only item type. A nonempty list allows the listed item type IDs as parents. Include JSON `false` to also allow top-level placement. For example, `["root", false]` allows a parent item whose type ID is `root` and also allows the item at the top level. Creating or reparenting an item at root when its type requires a parent returns `parent_required` on `parent`.

A state’s `require` list applies on entry and after ordinary edits settle. Work checks the item’s resulting state and each active parallel region in the item’s process generation. A missing value returns `required_field` on the corresponding field. An edit that leaves a state may clear a field that the resulting states no longer require.

An item reference field can declare `config.item_type` as the target item type ID. Work checks each written reference after resolving its live, visible target, including targets on another board. A type mismatch returns `invalid_reference` on the field. Fields with no target type accept any visible, live item type.

## Agent pipelines

The Agent Queue pack composes a principal field, an absolute time field and a process timer. Its `claim` edge enters the claimed state with both fields present. `renew` re-enters that state on a new visit. The timer releases the current visit and clears the two fields. Workers use the item version from their last successful mutation as `expect_version` for their next mutation. A superseded version yields `version_mismatch`.

A `report` with `kind: progress` requires a keyed command and the active visit and attempt. It replaces the attempt's latest progress with an object of at most 65,536 canonical JSON bytes. The corresponding `stage.progressed` fact does not route the item, affect the attempt deadline or set the terminal fields. Terminal reports apply the same progress bound and preserve the checkpoint when they omit progress. Terminal outputs use their existing independent size limit.

The Wait for Work item Block matches the current live item state under board and item READ. It resumes the unfiltered change feed from the given cursor or from a head snapshot and listens for commits to the board's projection. A feed gap causes a new head snapshot and point read. The Block returns `matched` with the item id, state and version, or `timed_out`. Both outcomes carry a feed cursor. A wait lives for the current Block invocation.

## Work Templates

### Template catalog

A board with `kickside.work.templates:plugin` keeps up to 128 immutable template versions in its plugin attachment. Each version holds one Work create preset and the field codes that callers may override. Board ADMIN publishes and archives versions. Board READ lists active versions and exposes only defaults visible under current field and item access. Board WRITE instantiates an exact version with an explicit key, subject to current schema and create admission. Archiving blocks fresh creates and preserves committed Work receipt replays while their evidence is retained. Attachment teardown removes the catalog.

Use `GET /work/boards/{id}/templates` to list active versions, then `POST /work/boards/{id}/templates/instantiate` with `template_id`, `version`, `key`, and optional `overrides`. The endpoints use the authenticated `kickside.work:api_router` and the Work Templates member policy. They call the Templates contract as the request actor and return the standard Work HTTP envelope.

### Recurring tasks

Use Automation's standard installation for `kickside.automation.recurring:task` with the board as its parent. Component placement requires board WRITE. Automation runs each occurrence as the installer and owns scheduling, run-now, pause, resume, and reconfiguration. The `kickside.work.templates:recurring` action pins a board, template ID, and exact version. It submits a Work create under the installer's current access with a key derived from the automation origin and occurrence identity. The board's event retention must cover Automation replay. An operator replay whose Work receipt evidence has expired returns `template_replay_unavailable`.

Component returns `CONFLICT` when the board delete request finds a live recurring task placed under the board. To delete a board, delete or move its recurring tasks first.
