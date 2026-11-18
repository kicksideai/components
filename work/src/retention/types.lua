-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Retention reports preserve each blocked prefix's native error.
type Blocked = { component_id: string, prefix: string, error: error }
type Result = { success: boolean, deadline_ms: integer?, deleted: integer?, needs_continue: boolean?, blocked: { Blocked }?, error: error? }


type Position = { board_after: string, inclusive: integer, board_scan: string, board_through: string?,
    discovery_turn: integer, pending_page_budget: integer }
type Checkpoint = { board_id: string, applied_seq: integer, after: string?, due_ms: integer? }
type Cutoffs = { trash: string, tombstone: string, audit: string, interval: string, event: string? }
type Visit = { board_id: string, floor: integer, boundary: integer, after: string?, cutoffs: Cutoffs, windows: { [string]: integer } }
type Eligibility = { due: boolean, deadline_ms: integer? }
type BoardPage = { removed: integer, spent: integer, after: string?, deadline_ms: integer? }
type VisibilityPosition = {seq: integer, item: string}
type Collection = {name: string, keys: string, where: string, order: string?, protection: string?, age: string?, before: string?}
type CollectionPosition = {name: string, after: {unknown}}
type Pruned = { removed: integer, more: boolean, spent: integer?, examined: integer?, cursor: string? }
return { Collection = Collection, CollectionPosition = CollectionPosition, VisibilityPosition = VisibilityPosition, Position = Position,
    Checkpoint = Checkpoint, Cutoffs = Cutoffs, Visit = Visit, Eligibility = Eligibility, BoardPage = BoardPage, Pruned = Pruned, Blocked = Blocked, Result = Result }
