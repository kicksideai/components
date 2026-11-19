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
