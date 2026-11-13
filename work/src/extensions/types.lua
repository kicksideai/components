-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local domain = require("domain")
local reads = require("reads")
type Pair = { projection: { id: string, body: unknown }, cursor: { last_seq: integer, status: string, last_error: unknown? } }
type Config = { board_id: string, plugin: string, attachment_id: string, config: domain.JsonObject,
    input: string, start_seq: integer, revision: integer }
type Body = { worker_config: Config, token: string? }
type FeedToken = { projection_id: string, start_seq: integer, cursor: reads.ChangesCursor?, bootstrapping: boolean }
type Definition = { id: string, kind: string, projection_key: string, body: unknown }
type Page = { projections: { Definition }, projections_has_more: boolean, projections_cursor: string? }
return { FeedToken = FeedToken, Config = Config, Body = Body, Definition = Definition, Page = Page, Pair = Pair }
