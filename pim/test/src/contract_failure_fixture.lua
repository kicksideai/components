-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
local mode = "missing"
local version = 0
local raw: unknown = false
function M.set(value: string) mode = value; version = version + 1 end
function M.schema(value: unknown)
    raw = value
    M.set("schema")
end
function M.current_version(): (unknown, error?)
    return { id = function(): integer return version end }, nil
end
function M.get(_id: string): (unknown, error?)
    if mode == "missing" then return nil, nil end
    local definition = {}
    function definition.with_actor() return definition, nil end
    function definition.with_scope() return definition, nil end
    function definition.open() return nil, nil end
    function definition.method() return { input_schemas = { { definition = mode == "schema" and raw or false } } }, nil end
    return definition, nil
end
return M
