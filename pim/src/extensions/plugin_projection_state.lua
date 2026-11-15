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
type Pair = { projection: { body: types.JsonObject }, cursor: { last_seq: integer, status: string, last_error: string? } }

function M.states(catalog_id: string, plugin: types.Plugin, intent: types.PluginIntent?): ({ [string]: types.PluginProjectionState }?, error?)
    if #(plugin.projections or {}) == 0 then return nil, nil end
    local client, err = threads.open()
    if err or not client then return nil, err end
    local states: { [string]: types.PluginProjectionState } = {}
    for _, p in ipairs(plugin.projections or {}) do
        local raw, rerr = client:get_projection_cursor({ thread_id = catalog_id, kind = p.kind, projection_key = PREFIX .. plugin.id })
        if rerr then
            if rerr:kind()==errors.NOT_FOUND then return {},nil end
            return nil,rerr
        end
        local pair = raw :: Pair
        local cursor = pair.cursor
        local raw_body = pair.projection.body
        local decoded, jerr = json.decode(raw_body :: string)
        if jerr then return nil,failure.corrupt("stored projection body is malformed","body") end
        local body = decoded :: types.JsonObject
        local config = body.worker_config :: types.JsonObject
        if type(config)~="table" then return nil,failure.corrupt("stored projection config is malformed","worker_config") end
        if intent and (config.start_seq~=intent.seq or config.attachment_id~=intent.attachment_id or not values.equal(config.config,intent.config) or config.revision~=p.revision) then
            return {},nil
        end
        local bootstrapping = config.input == "state"
        if bootstrapping and body.token then
            local token, terr = plugin_feed.decode(body.token :: string)
            if terr or not token then return nil, terr end
            bootstrapping = token.bootstrapping
        end
        local state: types.PluginProjectionState = { last_seq = cursor.last_seq, parked = cursor.status == "invalid", bootstrapping = bootstrapping, error = cursor.last_error }
        states[p.kind] = state
    end
    return states, nil
end
return M
