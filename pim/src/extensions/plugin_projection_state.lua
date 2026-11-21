-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Live cursor state is read through the Core threads contract.
local threads = require("threads")
local json = require("json")
local plugin_feed = require("plugin_feed")
local types = require("types")
local values=require("values")
local failure=require("failure")
local M = {}
local PREFIX = "kickside.pim.plugin:"
type Pair = { projection: { body: types.JsonObject }, cursor: { id: string, last_seq: integer, status: string, last_error: string? } }

local function current(pair: Pair, projection: types.PluginProjection, intent: types.PluginIntent?): (types.PluginProjectionState?, error?)
    local decoded, err = json.decode(pair.projection.body :: string)
    if err then return nil, failure.corrupt("stored projection body is malformed", "body") end
    local body = decoded :: types.JsonObject
    local config = body.worker_config :: types.JsonObject
    if type(config) ~= "table" then return nil, failure.corrupt("stored projection config is malformed", "worker_config") end
    if intent and (config.start_seq ~= intent.seq or config.attachment_id ~= intent.attachment_id
        or not values.equal(config.config, intent.config) or config.revision ~= projection.revision) then
        return nil, nil
    end
    local bootstrapping = config.input == "state"
    if bootstrapping and body.token then
        local token, terr = plugin_feed.decode(body.token :: string)
        if terr or not token then return nil, terr end
        bootstrapping = token.bootstrapping
    end
    local cursor = pair.cursor
    return { cursor_id = cursor.id, last_seq = cursor.last_seq, status = cursor.status, parked = cursor.status == "invalid" or cursor.status == "paused",
        bootstrapping = bootstrapping, error = cursor.last_error }, nil
end

function M.states(catalog_id: string, plugin: types.Plugin, intent: types.PluginIntent?): ({ [string]: types.PluginProjectionState }?, error?)
    if #(plugin.projections or {}) == 0 then return nil, nil end
    local client, err = threads.open()
    if err or not client then return nil, err end
    local states: { [string]: types.PluginProjectionState } = {}
    for _, p in ipairs(plugin.projections or {}) do
        local raw, rerr = client:get_projection_cursor({ thread_id = catalog_id, kind = p.kind, projection_key = PREFIX .. plugin.id })
        if rerr and rerr:kind() ~= errors.NOT_FOUND then return nil, rerr end
        if raw then
            local state, serr = current(raw :: Pair, p, intent)
            if serr then return nil, serr end
            states[p.kind] = state
        end
    end
    return states, nil
end
return M
