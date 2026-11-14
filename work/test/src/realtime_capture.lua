-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The harness records deliveries from the real component meta fanout.
local sql = require("sql")
local json = require("json")
local security = require("security")
local M = {}
function M.notify(input: unknown): (unknown, error?)
    local args = input :: { user_ids: { string }?, user_id: string?, topic: string, data: unknown }
    local db, err = sql.get("app:db")
    if not db then return nil, err end
    local _, cerr = db:execute([[CREATE TABLE IF NOT EXISTS work_test_delivery (user_id TEXT, topic TEXT, data TEXT)]])
    if cerr then db:release(); return nil, cerr end
    for _, id in ipairs(args.user_ids or { args.user_id }) do
        local actor = security.actor()
        if not (actor and actor:id() == id) and security.can("realtime.notify", "kickside.realtime:user:" .. id) ~= true then
            db:release()
            return nil, errors.new({ kind = errors.PERMISSION_DENIED, message = "realtime delivery refused" })
        end
        local _, werr = db:execute("INSERT INTO work_test_delivery (user_id, topic, data) VALUES ($1, $2, $3)", { id, args.topic, json.encode(args.data) })
        if werr then db:release(); return nil, werr end
    end
    db:release()
    return { success = true }, nil
end
function M.broadcast(): (unknown, error?)
    return nil, errors.new({ kind = errors.INTERNAL, message = "component fanout requires targeted delivery" })
end
return M
