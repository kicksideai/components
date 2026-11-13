-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local security = require("security")
local board = require("board")
local M = {}
local function ensure(db: sql.DB): error?
    local _, err = db:execute("CREATE TABLE IF NOT EXISTS work_test_plugin_fold (board_id TEXT NOT NULL, seq BIGINT NOT NULL, event_type TEXT NOT NULL, actor_id TEXT NOT NULL, marker TEXT NOT NULL, deliveries BIGINT NOT NULL, PRIMARY KEY (board_id, seq))", {})
    return err
end
type Map = { [string]: unknown }
type Change = { updated_seq: integer, op: string }
type Body = { worker_config: { plugin: string, input: string }, token: string? }
type Input = { thread_id: string, projection: { kind: string, body: Body }, range: { from_seq: integer, to_seq: integer }, events: { Map } }
type Feed = { config: { fail: boolean?, marker: string? }, changes: { Change }, token: string, done: boolean }
function M.run(input: Input): (Map?, error?)
    local body = input.projection.body
    local page, ferr = board.call("plugin_feed", { board_id = input.thread_id, plugin = body.worker_config.plugin,
        kind = input.projection.kind, token = body.token })
    if ferr or not page then return nil, ferr end
    local feed = page :: Feed
    if feed.config.fail then
        return nil, errors.new({ kind = errors.INVALID, message = "plugin fold refuses this configuration", details = { code = "plugin_fold_refused" } })
    end
    local db, err = sql.get("app:db")
    if err or not db then return nil, err end
    local derr = ensure(db)
    if derr then db:release(); return nil, derr end
    local tx, terr = db:begin()
    if terr or not tx then db:release(); return nil, terr end
    for _, event in ipairs(feed.changes) do
        local _, werr = tx:execute("INSERT INTO work_test_plugin_fold (board_id, seq, event_type, actor_id, marker, deliveries) VALUES ($1, $2, $3, $4, $5, 1) ON CONFLICT (board_id, seq) DO UPDATE SET marker=excluded.marker, deliveries=work_test_plugin_fold.deliveries+1", { input.thread_id, event.updated_seq, event.op, (security.actor() :: security.Actor):id(), feed.config.marker or "initial" })
        if werr then tx:rollback(); db:release(); return nil, werr end
    end
    local _, cerr = tx:commit()
    local _, rerr = db:release()
    if cerr or rerr then return nil, cerr or rerr end
    body.token = feed.token
    return { body = body, last_seq = feed.done and input.range.to_seq or input.range.from_seq - 1 }, nil
end

function M.delete(): ({ success: boolean }?, error?)
    local ctx = require("ctx")
    local component = require("component")
    local context, err = component.get_private_context(ctx.get("component_id") :: string)
    if err or not context then return nil, err end
    local db, derr = sql.get("app:db")
    if derr or not db then return nil, derr end
    local cerr = ensure(db)
    if cerr then db:release(); return nil, cerr end
    local _, werr = db:execute("DELETE FROM work_test_plugin_fold WHERE board_id = $1", { context.board_id })
    local _, rerr = db:release()
    if werr or rerr then return nil, werr or rerr end
    return { success = true }, nil
end
return M
