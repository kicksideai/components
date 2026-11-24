-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local handlers = require("handlers")
local M = {}

type Handler = (unknown) -> (unknown, error?)

local function invoke(handler: Handler, input: unknown): (unknown, error?)
    local out, err = handler(input)
    if err or not out then return nil, err end
    local result = out :: { [string]: unknown }
    result.success = true
    return result, nil
end

function M.create(input: unknown): (unknown, error?) return invoke(handlers.create, input) end
function M.edit(input: unknown): (unknown, error?) return invoke(handlers.edit, input) end
function M.delete(input: unknown): (unknown, error?) return invoke(handlers.delete, input) end
function M.list(input: unknown): (unknown, error?) return invoke(handlers.list, input) end
function M.totals(input: unknown): (unknown, error?) return invoke(handlers.totals, input) end

return M
