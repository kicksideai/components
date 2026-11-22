-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local domain = require("domain")
type Map = domain.JsonObject
type BoardRequest = { board_id: string }
type Pinned = { board_id: string, template_id: string, version: string }
type Preset = { op: string, type: string, parent: string?, state: string?, values: Map? }
type Publish = { board_id: string, template_id: string, title: string, description: string?, preset: Preset, override_fields: { string }? }
type Instantiate = { board_id: string, template_id: string, version: string, key: string, overrides: Map? }
type Record = {
    template_id: string, version: string, title: string, description: string?,
    schema_generation: integer, preset: Preset, override_fields: { string },
}
type Version = { record: Record, field_identities: { [string]: string }, type_identity: string, archived: boolean }
type Publication = { attachment: string, version: Version, generation: integer?, as_of: integer? }
type List = { templates: { Record }, generation: integer?, as_of: integer? }
type Archive = { template_id: string, version: string, archived: boolean }
type ActionInput = { overrides: Map? }
type Write = {
    config: Pinned?, input: ActionInput?, sink_op: string?, identity_key: string?, idempotency_key: string?,
    origin: string?, automation_ref: Map?, trace_context: domain.TraceContext?,
}
type WriteSuccess = { success: boolean, result: string, dest_ref: { item_id: string? } }
type WriteFailure = {
    success: boolean,
    error: { code: string, message: string, retriable: boolean, scope: string, kind: string?, details: unknown },
}
type WriteResult = WriteSuccess | WriteFailure

local M = {}
M.Map, M.BoardRequest, M.Pinned, M.Preset = Map, BoardRequest, Pinned, Preset
M.Publish, M.Instantiate, M.Record, M.Version, M.List, M.Archive = Publish, Instantiate, Record, Version, List, Archive
M.Publication, M.ActionInput, M.Write, M.WriteResult = Publication, ActionInput, Write, WriteResult
return M
