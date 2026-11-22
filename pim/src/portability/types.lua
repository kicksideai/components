-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

type Position = { phase: string, file: integer, offset: integer, after: string }
type Mapping = { old_id: string, sku: string, refs: { types.ExportedValue } }
type Checkpoint = { mappings: { Mapping }, next: Position }
type SchemaCommand = Checkpoint & { method: "schema", request: types.SchemaRequest }
type ItemsCommand = Checkpoint & { method: "items", request: types.ApplyRequest }
type Advance = Checkpoint & { method: "advance", request: {} | types.ApplyRequest }
type Frozen = SchemaCommand | ItemsCommand | Advance
type Work = {
    catalog_id: string, request_id: string, storage_id: string, path: string,
    identity: types.JsonObject, position: Position, batch: Frozen?, job_id: string, done: integer,
}

return { Position = Position, Mapping = Mapping, Frozen = Frozen, Work = Work }
