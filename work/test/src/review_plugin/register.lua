-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local ctx = require("ctx")
local board = require("board")
local component = require("component")
local scopes = require("scopes")
local types = require("types")
local M = {}
local PLUGIN = "app.review_plugin:plugin"
local REGISTER = "app.review_plugin:register"
type Map = { [string]: unknown }
type Worker = { thread_id: string, projection: { kind: string, body: Map },
    range: { from_seq: integer, to_seq: integer }, events: { Map }? }

function M.initialize(): (boolean?, error?)
    local db = assert(sql.get("app:db"))
    local _, err = db:execute([[CREATE TABLE IF NOT EXISTS work_test_review_register (
        board_id TEXT NOT NULL, item_id TEXT NOT NULL, title TEXT NOT NULL, risk BIGINT,
        PRIMARY KEY (board_id, item_id))]], {})
    if not err then
        _, err = db:execute([[CREATE INDEX IF NOT EXISTS work_test_review_exact ON work_test_review_register (board_id, title, item_id)]], {})
    end
    db:release()
    return err == nil, err
end

local function update(tx: sql.Transaction, board_id: string, feed: types.PluginFeed, first: boolean): error?
    if first or feed.reset then
        local _, err = tx:execute("DELETE FROM work_test_review_register WHERE board_id = $1", { board_id })
        if err then return err end
    end
    for _, item in ipairs(feed.changes) do
        local value = item.values or {}
        if item.op ~= "upsert" or item.type ~= "change" then
            local _, err = tx:execute("DELETE FROM work_test_review_register WHERE board_id = $1 AND item_id = $2", { board_id, item.item_id })
            if err then return err end
        else
            local err = scopes.write_search(tx, REGISTER, board_id, item.item_id, { title = (value.title or "") :: string })
            if err then return err end
            local _, werr = tx:execute("UPDATE work_test_review_register SET risk = $1 WHERE board_id = $2 AND item_id = $3",
                { value.risk or sql.NULL, board_id, item.item_id })
            if werr then return werr end
            if value.title == "Crash after write" then
                error(errors.new({ kind = errors.INVALID, message = "review register crashed after an index write" }))
            end
        end
    end
    return nil
end

function M.state(input: Worker): (Map?, error?)
    local body = input.projection.body
    local raw, ferr = board.call("plugin_feed", { board_id = input.thread_id, plugin = PLUGIN,
        kind = REGISTER, token = body.token })
    if ferr or not raw then return nil, ferr end
    local feed = raw :: types.PluginFeed
    local db = assert(sql.get("app:db"))
    local tx, terr = db:begin()
    if terr or not tx then db:release(); return nil, terr end
    local err = update(tx, input.thread_id, feed, body.token == nil)
    if err then tx:rollback(); db:release(); return nil, err end
    local _, cerr = tx:commit()
    local _, rerr = db:release()
    if cerr or rerr then return nil, cerr or rerr end
    body.token = feed.token
    body.pages = (body.pages or 0) + 1
    body.largest_page = math.max((body.largest_page or 0) :: integer, #feed.changes)
    return { body = body, last_seq = feed.done and input.range.to_seq or input.range.from_seq - 1 }, nil
end

function M.events(input: Worker): (Map?, error?)
    local _, err = board.call("plugin_context", { board_id = input.thread_id, plugin = PLUGIN })
    if err then return nil, err end
    local body = input.projection.body
    body.created = (body.created or 0) + #(input.events or {})
    return { body = body, last_seq = input.range.to_seq }, nil
end

function M.delete(): (Map?, error?)
    local context, err = component.get_private_context(ctx.get("component_id") :: string)
    if err or not context then return nil, err end
    local db = assert(sql.get("app:db"))
    local _, werr = db:execute("DELETE FROM work_test_review_register WHERE board_id = $1", { context.board_id })
    db:release()
    if werr then return nil, werr end
    return { success = true }, nil
end

function M.resolve_ids(input: { board_id: string, query: string, limit: integer }): (Map?, error?)
    local title = input.query:match("^change:(.+)$")
    if not title then return { ids = {} }, nil end
    local db = assert(sql.get("app:db"))
    local rows, err = db:query([[SELECT item_id FROM work_test_review_register
        WHERE board_id = $1 AND title = $2 ORDER BY item_id LIMIT $3]], { input.board_id, title, input.limit })
    db:release()
    if err then return nil, err end
    local ids: { string } = {}
    for _, row in ipairs(rows or {}) do ids[#ids + 1] = row.item_id :: string end
    return { ids = ids }, nil
end

function M.list(input: { board_id: string }): (unknown, error?)
    local _, err = board.call("plugin_context", { board_id = input.board_id, plugin = PLUGIN })
    if err then return nil, err end
    return board.call("query", { board_id = input.board_id, where = { field = "type", op = "eq", value = "change" }, limit = 20 })
end
return M
