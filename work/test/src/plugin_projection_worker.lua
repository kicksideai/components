-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local security = require("security")
local json = require("json")
local M = {}
local function ensure(db: sql.DB): error?
    local _, err = db:execute("CREATE TABLE IF NOT EXISTS work_test_plugin_fold (board_id TEXT NOT NULL, seq BIGINT NOT NULL, item_id TEXT NOT NULL, event_type TEXT NOT NULL, actor_id TEXT NOT NULL, marker TEXT NOT NULL, deliveries BIGINT NOT NULL, PRIMARY KEY (board_id, seq))", {})
    return err
end
type Map = { [string]: unknown }
type Change = { item_id: string, updated_seq: integer, op: string, values: { estimate: integer? }? }
type Body = { worker_config: { plugin: string, input: string, attachment_id: string }, token: string?, delivered: { unknown }?, patches: { Map }? }
type Input = { thread_id: string, projection: { id: string, kind: string, body: Body }, range: { from_seq: integer, to_seq: integer }, events: { Map }?, worker_input_mode: string }
type Feed = { config: { fail: boolean?, marker: string? }, changes: { Change }, token: string, done: boolean }
function M.run(input: Input): (Map?, error?)
    local projection_feed = require("projection_feed")
    local body = input.projection.body
    local page, ferr = projection_feed.page({ board_id = input.thread_id, plugin = body.worker_config.plugin,
        attachment_id = body.worker_config.attachment_id, projection_id = input.projection.id,
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
        -- Model T3's 80 logged minutes in this fixture without depending on Time's worker.
        local estimate = event.values and event.values.estimate
        local marker = estimate and (estimate < 80 and "over_estimate" or "within_estimate") or feed.config.marker or "initial"
        local _, werr = tx:execute("INSERT INTO work_test_plugin_fold (board_id, seq, item_id, event_type, actor_id, marker, deliveries) VALUES ($1, $2, $3, $4, $5, $6, 1) ON CONFLICT (board_id, seq) DO UPDATE SET marker=excluded.marker, deliveries=work_test_plugin_fold.deliveries+1", { input.thread_id, event.updated_seq, event.item_id, event.op, (security.actor() :: security.Actor):id(), marker })
        if werr then tx:rollback(); db:release(); return nil, werr end
    end
    local _, cerr = tx:commit()
    local _, rerr = db:release()
    if cerr or rerr then return nil, cerr or rerr end
    body.token = feed.token
    local output: Map = { worker_config = body.worker_config, token = body.token,
        observed_mode = input.worker_input_mode, received_events = input.events ~= nil }
    return { body = output, last_seq = feed.done and input.range.to_seq or input.range.from_seq - 1 }, nil
end

function M.events(input: Input): (Map?, error?)
    local body = input.projection.body
    local delivered, patches = body.delivered or {}, body.patches or {}
    for _, event in ipairs(input.events or {}) do
        delivered[#delivered + 1] = event.type
        local value = event.body
        if type(value) == "string" then value = assert(json.decode(value)) end
        if type(value) == "table" and value.patch then
            patches[#patches + 1] = { seq = event.seq, schema_generation = value.schema_generation }
        end
    end
    return { body = { worker_config = body.worker_config, observed_mode = input.worker_input_mode, delivered = delivered, patches = patches },
        last_seq = input.range.to_seq }, nil
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
