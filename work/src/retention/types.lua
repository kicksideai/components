-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Retention reports preserve each blocked prefix's native error.
type Blocked = { component_id: string, prefix: string, error: error }
type Result = { success: boolean, deadline_ms: integer?, deleted: integer?, needs_continue: boolean?, blocked: { Blocked }?, error: error? }


type Position = { board_after: string, inclusive: integer, board_scan: string, deadline_ms: integer? }
type Checkpoint = { board_id: string, after: string? }
type BoardPage = { removed: integer, spent: integer, after: string?, deadline_ms: integer? }
type VisibilityPosition = {seq: integer, item: string}
type Collection = {name: string, keys: string, where: string, order: string?, protection: string?, age: string?, days: integer?, before: string?}
type CollectionPosition = {name: string, after: {unknown}}
type Pruned = { removed: integer, more: boolean, spent: integer?, examined: integer?, cursor: string? }
return { Collection = Collection, CollectionPosition = CollectionPosition, VisibilityPosition = VisibilityPosition, Position = Position,
    Checkpoint = Checkpoint, BoardPage = BoardPage, Pruned = Pruned, Blocked = Blocked, Result = Result }
