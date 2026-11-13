-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local M = {}
local raw: unknown = false
local version, decodes = 0, 0
function M.schema(value: unknown)
    raw = value
    version = version + 1
end
function M.current_version(): (unknown, error?)
    return { id = function(): integer return version end }, nil
end
function M.get(_id: string): (unknown, error?)
    return { method = function(_self: unknown, _method: string): (unknown, error?)
        return { input_schemas = { { definition = raw } } }, nil
    end }, nil
end
function M.decode(text: string): (unknown, error?)
    decodes = decodes + 1
    return json.decode(text)
end
function M.count(): integer return decodes end
return M
