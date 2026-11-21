<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work Planning

Work Planning requires `kickside/work` 0.1.32 or newer for command-owned sprint
closure and state-restricted sprint references.

Install `kickside.work.planning:pack` through Work pack plan and apply. On a new
board, Work board creation can install it in the same request. Installation
requires board ADMIN. Agents can use Work's administration trait to list, plan,
and apply the pack.

Sprint and Milestone carry `name`, `planning_start`, `planning_end`, and optional
`planning_goal`. Both start in `planned`. The `start` transition to `active`
requires dates in order. Work accepts calendar dates and UTC timestamps for the
date fields. Close a milestone with its `close` transition. Close a sprint with
the Planning preview and commit described below.

Issue items carry indexed, tracked `current_sprint` and `milestone` references
that accept Sprint and Milestone items respectively. New assignments require a
planned or active sprint. Issues can retain an existing reference to a closed
sprint.
On a populated board, use the same pack plan with
`plugin_configs["kickside.work.planning:plugin"].issue_types` set to the IDs
of any custom issue types that should gain these fields. The plan describes
schema changes and identifies conflicts that require explicit resolutions.
Pass the same configuration to apply with the planned generation and resolved
choices. Adopted types keep their existing process and items.

`kickside.work.planning:sprints.plan_close` previews an active sprint. Pass its
board and item IDs, plus the ID of a different planned or active sprint to roll
unfinished issues into it. Omit the destination for the backlog. The preview
returns the affected item IDs and versions, the Work snapshot, and a token bound
to the caller and that snapshot. Completed and canceled issues stay on the
source sprint. Trash is excluded from rollover and keeps its membership if
restored later.

Preview requires live board WRITE, visibility of the entire live sprint
membership, and write access to the membership field on each unfinished issue.
On boards with item restrictions, a proof that exceeds Work's 10,000-match
count budget is refused. If 200 or more issues are unfinished, use Work bulk to
reduce that set and preview again.

Pass the unchanged `snapshot` and `token` with a unique `key` to
`kickside.work.planning:sprints.close`. Work applies the rollover and the sprint
transition in one command, and records the membership edits in item history.
An intervening board write makes the preview stale. A retry of a committed
request with the same key and preview returns the Work receipt.

The Work trait contributes `WorkPlanCloseSprint` and `WorkCloseSprint` on boards
with Planning active.

Work mounts sprint preview and closure on the authenticated router already bound
to `kickside.work:api_router`. The Work Planning member policy grants access to
the two endpoints. Both call the Planning contract as the request actor and
return the standard Work HTTP envelope.

- `POST /work/sprints/plan_close` accepts `board_id`, `sprint_id`, and optional
  `rollover_id`.
- `POST /work/sprints/close` accepts the preview's unchanged `snapshot` and
  `token` with a `key`.
