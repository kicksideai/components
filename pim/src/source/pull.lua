-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- kickside.data:pullable source of a channel's publications: a thin mapping of
-- the kickside.pim:catalog publications feed onto pullable items. A published
-- release is an upsert carrying its immutable snapshot; a withdrawal is a delete.
local catalog_client = require("catalog_client")
local data_error = require("data_error")
local failure = require("failure")
local writable_sink = require("writable_sink")
local types = require("types")

local M = {}

type Config = { catalog_id: string?, channel: string? }
type Cursor = types.ChangesCursor
type Request = { cursor: Cursor?, config: Config?, limit: integer? }
type Payload = { release_id: string?, hash: string?, version: integer?, snapshot: types.Snapshot? }
type Item = { item_key: string, dedup_key: string, source_version: string, occurred_at: string, op: string, payload: Payload? }
-- Pull failures carry the DataError envelope and native classification.
type Result = { success: boolean, items: { Item }?, next_cursor: Cursor?, has_more: boolean? } | data_error.Failure
type Catalog = { list_publications: (Catalog, types.PublicationsRequest & { catalog_id: string }) -> (types.PublicationsResult?, error?) }

local function fail(err: error, code: string?): Result
    return data_error.failure(err, code)
end

local function version(seq: integer): string
    return string.format("%020d", seq)
end

function M.pull(req: Request): Result
    local config: Config = req.config or {}
    local catalog_id = writable_sink.trim(config.catalog_id)
    local channel = writable_sink.trim(config.channel)
    if catalog_id == "" or channel == "" then return fail(failure.invalid("config.catalog_id and config.channel are required", { code = "invalid_config" }), "invalid_config") end
    local opened, oerr = catalog_client.open()
    if oerr then return fail(oerr) end
    local catalog = opened :: Catalog
    local page, err = catalog:list_publications({ catalog_id = catalog_id, channel = channel, after = req.cursor, limit = req.limit })
    if err then return fail(err, err:kind() == errors.INVALID and "invalid_config" or nil) end
    if not page then return fail(errors.new({ kind = errors.INTERNAL, message = "publications read returns no page", details = { code = "internal" } })) end
    local items: { Item } = {}
    for i, p in ipairs(page.items) do
        local item: Item = { item_key = p.product_id, dedup_key = channel .. ":" .. p.product_id .. ":" .. p.seq,
            source_version = version(p.seq), occurred_at = p.updated_at, op = "delete" }
        if p.state == "published" then
            item.op = "upsert"
            item.payload = { release_id = p.release_id, hash = p.hash, version = p.version, snapshot = p.snapshot }
        end
        items[i] = item
    end
    return { success = true, items = items, next_cursor = page.next, has_more = page.has_more }
end

return M
