-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Retention reports preserve each blocked prefix's native error.
type Blocked = { component_id: string, prefix: string, error: error }
type Result = { success: boolean, deadline_ms: integer?, deleted: integer?, needs_continue: boolean?, blocked: { Blocked }?, error: error? }


type Position = { board_after: string, inclusive: integer, item_after: string, deadline_ms: integer? }
type Anchor = {id: string, owner_id: string, job_identity: string}
type VisibilityPosition = {seq: integer, item: string}
type Collection = {name: string, keys: string, where: string, order: string?, protection: string?, age: string?, days: integer?}
type CollectionPosition = {name: string, after: {unknown}}
type Pruned = { removed: integer, more: boolean, spent: integer?, examined: integer?, cursor: string? }
return { Collection = Collection, CollectionPosition = CollectionPosition, VisibilityPosition = VisibilityPosition, Anchor = Anchor, Position = Position, Pruned = Pruned, Blocked = Blocked, Result = Result }
