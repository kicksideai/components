-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local threads = require("threads")
local json=require("json")
local M = {}
local mismatch=false
function M.set_mismatch(value:boolean) mismatch=value end
local head = 0
function M.set_head(value: integer) head = value end
function M.open(): (threads.Client?, error?)
    local client, err = threads.open()
    if err or not client then return nil, err end
    return {
        find = function(_: unknown, _: unknown): ({event_count: integer}, error?)
            return {event_count=head}, nil
        end,
        get_projection_cursor = function(_: unknown, request: {[string]: unknown}): (unknown, error?)
            local raw,err=client:get_projection_cursor(request)
            if not err and raw and mismatch then
                local pair=raw :: {projection:{body:unknown}}
                local body=type(pair.projection.body)=="string" and assert(json.decode(pair.projection.body :: string)) or pair.projection.body
                body.worker_config.config={marker="another-registration"}
                pair.projection.body=json.encode(body)
            end
            return raw,err
        end,
    } :: threads.Client, nil
end
return M
