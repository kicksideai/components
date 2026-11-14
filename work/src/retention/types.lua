-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Retention reports preserve each blocked prefix's native error.
type Blocked = { component_id: string, prefix: string, error: error }
type Result = { success: boolean, deadline_ms: integer?, deleted: integer?, needs_continue: boolean?, blocked: { Blocked }?, error: error? }


type Position = { board_after: string, inclusive: integer, item_after: string, deadline_ms: integer? }
type Pruned = { removed: integer, more: boolean }
return { Position = Position, Pruned = Pruned, Blocked = Blocked, Result = Result }
