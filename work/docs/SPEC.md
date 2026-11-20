<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work specification

## Item write invariants

Omit `parent_types` or use an empty list for a root-only item type. A nonempty list allows the listed item type IDs as parents. Include JSON `false` to also allow top-level placement. For example, `["root", false]` allows a parent item whose type ID is `root` and also allows the item at the top level. Creating or reparenting an item at root when its type requires a parent returns `parent_required` on `parent`.

A state’s `require` list applies on entry and after ordinary edits settle. Work checks the item’s resulting state and each active parallel region in the item’s process generation. A missing value returns `required_field` on the corresponding field. An edit that leaves a state may clear a field that the resulting states no longer require.

An item reference field can declare `config.item_type` as the target item type ID. Work checks each written reference after resolving its live, visible target, including targets on another board. A type mismatch returns `invalid_reference` on the field. Fields with no target type accept any visible, live item type.

## Work Templates

### Template catalog

A board with `kickside.work.templates:plugin` keeps up to 128 immutable template versions in its plugin attachment. Each version holds one Work create preset and the field codes that callers may override. Board ADMIN publishes and archives versions. Board READ lists active versions and exposes only defaults visible under current field and item access. Board WRITE instantiates an exact version with an explicit key, subject to current schema and create admission. Archiving blocks fresh creates and preserves committed Work receipt replays while their evidence is retained. Attachment teardown removes the catalog.

Use `GET /work/boards/{id}/templates` to list active versions, then `POST /work/boards/{id}/templates/instantiate` with `template_id`, `version`, `key`, and optional `overrides`. The endpoints use the authenticated `kickside.work:api_router` and the Work Templates member policy. They call the Templates contract as the request actor and return the standard Work HTTP envelope.

### Recurring tasks

Use Automation's standard installation for `kickside.automation.recurring:task` with the board as its parent. Component placement requires board WRITE. Automation runs each occurrence as the installer and owns scheduling, run-now, pause, resume, and reconfiguration. The `kickside.work.templates:recurring` action pins a board, template ID, and exact version. It submits a Work create under the installer's current access with a key derived from the automation origin and occurrence identity. The board's event retention must cover Automation replay. An operator replay whose Work receipt evidence has expired returns `template_replay_unavailable`.

Component returns `CONFLICT` when the board delete request finds a live recurring task placed under the board. To delete a board, delete or move its recurring tasks first.
