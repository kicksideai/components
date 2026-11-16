-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Compilation contributes installed plugin tools, restricted by role and activation.
local registry = require("registry")
local catalog_client = require("catalog_client")
local plugins = require("plugins")
local types = require("types")
local M = {}
type Map = { [string]: unknown }
type Tool = { id: string }
type Contribution = { tools: { Tool } }

local function contribute(context: Map, read_only: boolean): (Contribution?, error?)
    local declarations: { { tools: { string }? } } = {}
    if context.catalog_id ~= nil then
        local client, err = catalog_client.open()
        if err then return nil, err end
        local service = client :: catalog_client.Catalog
        local get_schema = service.get_schema :: (catalog_client.Catalog, Map) -> (Map?, error?)
        local schema, serr = get_schema(service, { catalog_id = context.catalog_id })
        if serr then
            if serr:kind() == errors.PERMISSION_DENIED or serr:kind() == errors.NOT_FOUND then return { tools = {} }, nil end
            return nil, serr
        end
        for _, plugin in ipairs(schema.plugins) do
            if plugin.active == true and not plugin.problem then declarations[#declarations + 1] = plugin end
        end
    else
        local installed, err = plugins.list()
        if err then return nil, err end
        for _, plugin in ipairs(installed :: { types.PluginOption }) do declarations[#declarations + 1] = { tools = plugin.tools } end
    end
    local ids: { [string]: boolean } = {}
    for _, plugin in ipairs(declarations) do
        for _, id in ipairs(plugin.tools or {}) do
            local tool, err = plugins.tool(id)
            if err or not tool then return nil, err end
            local scopes = tool.required_scopes
            if not read_only or (#scopes == 1 and scopes[1] == "state.read") then ids[id] = true end
        end
    end
    local sorted: { string } = {}
    for id in pairs(ids) do sorted[#sorted + 1] = id end
    table.sort(sorted)
    local tools: { Tool } = {}
    for _, id in ipairs(sorted) do tools[#tools + 1] = { id = id } end
    return { tools = tools }, nil
end

-- reads serves the reads trait: tools that only read state.
function M.reads(_prompt: string, context: Map): (Contribution?, error?) return contribute(context, true) end

-- working serves the working trait: every declared plugin tool.
function M.working(_prompt: string, context: Map): (Contribution?, error?) return contribute(context, false) end
return M
