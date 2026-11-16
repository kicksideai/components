-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Both plugin harnesses exercise the same activation and compiler contract.
local test = require("test")
local registry = require("registry")
local funcs = require("funcs")
type Map = { [string]: unknown }
type Handle = { id: string, executor: funcs.Executor, call: (string, Map) -> (unknown, error?) }
local M = {}
local PREFIX = "kickside.pim.traits:"
local function contains(tools: { Map }, id: string): boolean
    for _, tool in ipairs(tools) do if tool.id == id then return true end end
    return false
end
function M.check(h: Handle, inactive: Handle, plugin_id: string, read_ids: { string }, write_ids: { string })
    local declaration = assert(registry.get(plugin_id))
    test.eq(#declaration.meta.tools, #read_ids + #write_ids)
    local schema = assert(h.call("get_schema", {}))
    for _, plugin in ipairs(schema.plugins) do if plugin.plugin == plugin_id then test.eq(#plugin.tools, #declaration.meta.tools) end end
    local options = assert(h.call("schema_options", {}))
    local found = false
    for _, plugin in ipairs(options.plugins) do
        if plugin.plugin == plugin_id then test.eq(#plugin.tools, #declaration.meta.tools); found = true end
    end
    test.is_true(found)
    for _, name in ipairs({ "pim_readonly", "pim_trait" }) do
        local trait = assert(registry.get(PREFIX .. name))
        local function build(handle: Handle, context: Map): Map
            local out, err = handle.executor:call(trait.data.build_func_id, trait.data.prompt, context)
            assert(not err, tostring(err))
            return out
        end
        local active = build(h, { catalog_id = h.id }).tools
        local off = build(inactive, { catalog_id = inactive.id }).tools
        local installed = build(h, {}).tools
        for _, id in ipairs(read_ids) do
            test.is_true(contains(active, id), id)
            test.is_false(contains(off, id), id)
            test.is_true(contains(installed, id), id)
        end
        for _, id in ipairs(write_ids) do
            test.eq(contains(active, id), name == "pim_trait", id)
            test.is_false(contains(off, id), id)
            test.eq(contains(installed, id), name == "pim_trait", id)
        end
        local reworded, rerr = h.executor:call(trait.data.build_func_id, "an agent-specific prompt", { catalog_id = h.id })
        assert(not rerr, tostring(rerr))
        for _, id in ipairs(write_ids) do test.eq(contains(reworded.tools, id), name == "pim_trait", id) end
        local denied = build(inactive, { catalog_id = h.id })
        test.eq(#denied.tools, 0)
    end
    local compiled, err = h.executor:call("app:compile_agent", { id = "app:catalog_agent", traits = {
        { id = PREFIX .. "pim_trait", context = { catalog_id = h.id } },
        { id = PREFIX .. "pim_admin", context = { catalog_id = h.id } },
    } })
    assert(compiled, tostring(err))
    local ids: { [string]: boolean } = {}
    for _, tool in pairs(compiled.tools) do
        test.is_nil(ids[tool.registry_id], tool.registry_id)
        ids[tool.registry_id] = true
    end
    for _, id in ipairs(declaration.meta.tools) do test.is_true(ids[id] == true, id) end
    test.eq(compiled.tools[assert(registry.get(read_ids[1])).meta.llm_alias].context.catalog_id, h.id)
    return compiled
end
return M
