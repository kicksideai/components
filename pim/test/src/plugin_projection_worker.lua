-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local security = require("security")
local contract = require("contract")
local M = {}
type Map = { [string]: unknown }
type Event = { seq: integer, type: string }
type Input = { catalog_id: string, config: { fail: boolean?, marker: string? }, events: { Event } }
function M.run(native: { thread_id: string, projection: { body: Map }, events: { Event }, range: { to_seq: integer } }): (Map?, error?)
    local body = native.projection.body
    local client = assert(contract.get("kickside.pim:catalog")):with_actor(security.actor()):with_scope(security.scope()):open()
    local context, cerr = client:plugin_context({ catalog_id = native.thread_id, plugin = body.worker_config.plugin })
    if cerr then return nil, cerr end
    local input: Input = { catalog_id = native.thread_id, config = context.config, events = native.events }
    if input.config.fail then
        return nil, errors.new({ kind = errors.INVALID, message = "plugin fold refuses this configuration", details = { code = "plugin_fold_refused" } })
    end
    local db, err = sql.get("app:db")
    if err or not db then return nil, err end
    local _, derr = db:execute("CREATE TABLE IF NOT EXISTS pim_test_plugin_fold (catalog_id TEXT NOT NULL, seq BIGINT NOT NULL, event_type TEXT NOT NULL, actor_id TEXT NOT NULL, marker TEXT NOT NULL, deliveries BIGINT NOT NULL, PRIMARY KEY (catalog_id, seq))", {})
    if derr then db:release(); return nil, derr end
    local tx, terr = db:begin()
    if terr or not tx then db:release(); return nil, terr end
    for _, event in ipairs(input.events) do
        local _, werr = tx:execute("INSERT INTO pim_test_plugin_fold (catalog_id, seq, event_type, actor_id, marker, deliveries) VALUES ($1, $2, $3, $4, $5, 1) ON CONFLICT (catalog_id, seq) DO UPDATE SET marker=excluded.marker, deliveries=pim_test_plugin_fold.deliveries+1", { input.catalog_id, event.seq, event.type, (security.actor() :: security.Actor):id(), input.config.marker or "initial" })
        if werr then tx:rollback(); db:release(); return nil, werr end
    end
    local _, cerr = tx:commit()
    local _, rerr = db:release()
    if cerr or rerr then return nil, cerr or rerr end
    return { body = body, last_seq = native.range.to_seq }, nil
end
return M
