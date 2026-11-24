<!-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 -->
# Work Time

`kickside/work-time` adds time tracking to KickSide Work and requires Work
0.1.50 or newer. Bind
`kickside.work.time:target_db` to the same SQLite or PostgreSQL database as
`kickside.work:target_db`. Bind `kickside.work.time.api:api_router` to Work's
authenticated HTTP router. Work Time can be enabled on a board without Planning
or Search.

The item summary returns direct minutes and estimate fields in one batch.
Item totals also include readable live descendants. Timesheet reports support
board, person by week and sprint selectors. CSV uses the same authorization
and pagination as the report.
Worklog lists default to oldest first. Set `sort=newest` to reverse the order.

In Work Admin, enable `kickside.work.time:plugin` and select the existing item
types that accept time. Work reviews and applies the schema change. Time adds
the optional, indexed and tracked `time_original_minutes` and
`time_remaining_minutes` fields to those types. The item audience can read both
fields. Work owns their edits and versions. Resolve the removal of a type with
saved estimates through Work's schema review.

| Setting | Default | Effect |
| --- | --- | --- |
| `item_types` | `[]` | Existing item type IDs that accept worklogs and estimates. |
| `rounding_minutes` | `1` | Round new durations to the nearest 1, 5, 15 or 30 minutes, with ties up and a minimum of one increment. |
| `entry_visibility` | `all` | With `self`, readers see their own entries in timesheets and CSV. Board administrators can also see others' entries. Any item reader can see its totals, badges and filters. |

Time's storage is keyed by the exact Work attachment ID. The direct totals
hold only time logged on the item. The daily table groups minutes and entry
counts by item, person, work date and optional sprint. Its empty sprint ID
represents unallocated time. Dates in the log, daily and receipt tables use
ISO calendar days in UTC. An idempotency receipt has a separate expiry only
after explicit deletion of the entry. Attachment and item fences are kept
separately from aggregates, so cleanup can drop empty aggregate buckets.

`time.over_estimate` signals changes to over-estimate state observed by the
projection on boards with board-wide item visibility, so a crossing that
reverts between observations may emit no event and automations can query the
over-estimate filter for the current state.
