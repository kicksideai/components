-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Stored bodies keep their accepted shape at every object and array level.
local values = require("values")
local M = {}
type Map = { [string]: unknown }

local function incompatible(path: string): (boolean, error?)
    return false, errors.new({ kind = errors.INVALID, retryable = false, message = "event schema narrows stored bodies at " .. path,
        details = { code = "event_schema_incompatible", path = path } })
end

function M.check(frozen: Map, current: Map, path: string): (boolean, error?)
    local required: { [string]: boolean } = {}
    for _, name in ipairs((frozen.required or {}) :: { string }) do required[name] = true end
    for _, name in ipairs((current.required or {}) :: { string }) do
        if not required[name] then return incompatible(path .. ".required." .. name) end
    end
    for key, old in pairs(frozen) do
        if key ~= "required" and key ~= "description" then
            local new = current[key]
            if key == "properties" then
                if type(new) ~= "table" then return incompatible(path .. ".properties") end
                for name, node in pairs(old :: Map) do
                    local next_node = (new :: Map)[name]
                    if type(next_node) ~= "table" then return incompatible(path .. "." .. name) end
                    local ok, err = M.check(node :: Map, next_node :: Map, path .. "." .. name)
                    if not ok then return false, err end
                end
            elseif key == "items" then
                if type(new) ~= "table" then return incompatible(path .. "[]") end
                local ok, err = M.check(old :: Map, new :: Map, path .. "[]")
                if not ok then return false, err end
            elseif values.canonical(old) ~= values.canonical(new) then
                return incompatible(path .. "." .. key)
            end
        end
    end
    for key in pairs(current) do
        if frozen[key] == nil and key ~= "description" and key ~= "properties" and key ~= "required" then
            return incompatible(path .. "." .. key)
        end
    end
    return true, nil
end
return M
