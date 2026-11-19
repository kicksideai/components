<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work Planning

Install `kickside.work.planning:pack` through Work pack plan and apply. On a new
board, Work board creation can install it in the same request. Installation
requires board ADMIN. Agents can use Work's administration trait to list, plan,
and apply the pack.

Sprint and Milestone carry `name`, `planning_start`, `planning_end`, and optional
`planning_goal`. Both start in `planned`. The `start` transition to `active`
requires dates in order. Work accepts calendar dates and UTC timestamps for the
date fields. The `close` transition leads to `closed`.

Issue items carry indexed, tracked `current_sprint` and `milestone` references.
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
to the caller and that snapshot. It leaves completed and canceled issues on the
source sprint and excludes trash. The Work trait contributes
`WorkPlanCloseSprint` on boards with Planning active.

Preview requires live board WRITE, visibility of the entire live sprint
membership, and write access to the membership field on each unfinished issue.
On boards with item restrictions, a proof that exceeds Work's 10,000-match
count budget is refused. If 200 or more issues are unfinished, use Work bulk to
reduce that set and preview again.
