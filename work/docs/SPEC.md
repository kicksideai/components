<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work Templates specification

## Template catalog

A board with `kickside.work.templates:plugin` keeps up to 128 immutable template versions in its plugin attachment. Each version holds one Work create preset and the field codes that callers may override. Board ADMIN publishes and archives versions. Board READ lists active versions and exposes only defaults visible under current field and item access. Board WRITE instantiates an exact version with an explicit key, subject to current schema and create admission. Archiving blocks fresh creates and preserves committed Work receipt replays while their evidence is retained. Attachment teardown removes the catalog.

Use `GET /work/boards/{id}/templates` to list active versions, then `POST /work/boards/{id}/templates/instantiate` with `template_id`, `version`, `key`, and optional `overrides`. The endpoints use the authenticated `kickside.work:api_router` and the Work Templates member policy. They call the Templates contract as the request actor and return the standard Work HTTP envelope.

## Recurring tasks

Use Automation's standard installation for `kickside.automation.recurring:task` with the board as its parent. Component placement requires board WRITE. Automation runs each occurrence as the installer and owns scheduling, run-now, pause, resume, and reconfiguration. The `kickside.work.templates:recurring` action pins a board, template ID, and exact version. It submits a Work create under the installer's current access with a key derived from the automation origin and occurrence identity. The board's event retention must cover Automation replay. An operator replay whose Work receipt evidence has expired returns `template_replay_unavailable`.

Component returns `CONFLICT` when the board delete request finds a live recurring task placed under the board. To delete a board, delete or move its recurring tasks first.
