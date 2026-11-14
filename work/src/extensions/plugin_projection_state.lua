-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Cursor failures affect only their declared projection state.
local threads = require("threads")
local json = require("json")
local types = require("types")
local plugin_feed = require("plugin_feed")
local local_types = require("local_types")
local M = {}
function M.states(board_id: string, plugin: types.Plugin): { [string]: types.PluginProjectionState }
    local out: { [string]: types.PluginProjectionState } = {}
    local client, err = threads.open()
    for _, p in ipairs(plugin.projections) do
        local state: types.PluginProjectionState = { last_seq = 0, parked = false, bootstrapping = p.input == "state" }
        local failure = err
        if client then
            local raw, rerr = client:get_projection_cursor({ thread_id = board_id, kind = p.kind, projection_key = "kickside.work.plugin:" .. plugin.id })
            failure = rerr
            if raw then
                local pair = raw :: local_types.Pair
                local body = pair.projection.body
                if type(body) == "string" then body, failure = json.decode(body) end
                state.last_seq, state.parked, state.error = pair.cursor.last_seq, pair.cursor.status == "invalid", pair.cursor.last_error
                if not failure and p.input == "state" then
                    local token = (body :: local_types.Body).token
                    if token then
                        local decoded, terr = plugin_feed.decode(token)
                        failure = terr
                        if decoded then state.bootstrapping = decoded.bootstrapping end
                    end
                end
            end
        end
        if failure then
            local details = failure:details()
            state.error = { kind = failure:kind(), code = details and details.code, message = failure:message() }
        end
        out[p.kind] = state
    end
    return out
end
return M
