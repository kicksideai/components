-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Collection sources map the catalog's durable read pages to pullable records.
local catalog_client = require("catalog_client")
local data_error = require("data_error")
local failure = require("failure")
local types = require("types")
local M = {}
type Config = { catalog_id: string?, families: { string }?, aspects: { string }? }
type Request<Cursor> = { config: Config?, cursor: Cursor?, limit: integer? }
type Item = { item_key: string, dedup_key: string, source_version: string, occurred_at: string?, op: string, payload: unknown }
type Result<Cursor> = { success: boolean, items: { Item }?, next_cursor: Cursor?, has_more: boolean? } | data_error.Failure

type Catalog = {
    list_changes: (Catalog, { [string]: unknown }) -> (types.ChangesResult?, error?),
    list_proposals: (Catalog, { [string]: unknown }) -> (types.ProposalsResult?, error?),
}

local function open(config: Config): (Catalog?, error?)
    if not config.catalog_id or config.catalog_id == "" then
        return nil, failure.invalid("config.catalog_id is required", { code = "invalid_config" })
    end
    local client, err = catalog_client.open()
    return client :: Catalog?, err
end

function M.products(req: Request<types.ChangesCursor>): Result<types.ChangesCursor>
    local config = req.config or {}
    local client, err = open(config)
    if err or not client then return data_error.failure(err :: error) end
    local result, rerr = client:list_changes({ catalog_id = config.catalog_id, cursor = req.cursor, limit = req.limit, families = config.families })
    if rerr then return data_error.failure(rerr) end
    local page = result :: types.ChangesResult
    if page.gap then
        return data_error.failure(errors.new({ kind = errors.CONFLICT, message = "product cursor precedes the tombstone floor",
            details = { code = "source_gap", floor = page.gap.floor } }), "source_gap")
    end
    local items: { Item } = {}
    for i, p in ipairs(page.items) do
        if config.aspects and p.values then
            local selected: { [string]: types.ContextValues } = {}
            for code, value in pairs(p.values) do
                for _, namespace in ipairs(config.aspects) do
                    if code:sub(1, #namespace + 1) == namespace .. "." then selected[code] = value end
                end
            end
            p.values = selected
        end
        items[i] = { item_key = p.product_id, dedup_key = p.product_id .. ":" .. p.updated_seq,
            source_version = string.format("%020d", p.updated_seq), op = p.op, payload = p.op == "upsert" and p or nil }
    end
    return { success = true, items = items, next_cursor = page.next, has_more = page.has_more }
end

function M.proposals(req: Request<types.ProposalCursor>): Result<types.ProposalCursor>
    local config = req.config or {}
    local client, err = open(config)
    if err or not client then return data_error.failure(err :: error) end
    local result, rerr = client:list_proposals({ catalog_id = config.catalog_id, status = "pending", after = req.cursor, limit = req.limit })
    if rerr then return data_error.failure(rerr) end
    local page = result :: types.ProposalsResult
    local items: { Item } = {}
    for i, p in ipairs(page.proposals) do
        items[i] = { item_key = p.proposal_id, dedup_key = p.proposal_id, source_version = p.proposal_id,
            occurred_at = p.created_at, op = "upsert", payload = p }
    end
    return { success = true, items = items, next_cursor = page.next, has_more = page.has_more }
end
return M
