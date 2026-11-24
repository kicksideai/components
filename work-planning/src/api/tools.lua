-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local handlers = require("handlers")
local M = {}
type Handler = (unknown) -> (unknown, error?)

local function tool(handler: Handler): Handler
    return function(input: unknown): (unknown, error?)
        local out, err = handler(input)
        if err or not out then return nil, err end
        local result = out :: { [string]: unknown }
        result.success = true
        return result, nil
    end
end

M.plan_sprint = tool(handlers.plan_sprint)
M.move_dates = tool(handlers.move_dates)
M.check_capacity = tool(handlers.check_capacity)
M.set_capacity = tool(handlers.set_capacity)
return M
