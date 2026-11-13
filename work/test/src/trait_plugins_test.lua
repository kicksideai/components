-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local fixture = require("fixture")
local steps = require("steps")
local values = require("values")
type Map = { [string]: unknown }
local NS = "kickside.work.traits:"
local PLUGIN = "app:trait_plugin"
local READ = "app:trait_plugin_read"
local WRITE = "app:trait_plugin_write"
local function build(h: fixture.Handle, name: string, context: Map): Map
    local trait = assert(registry.get(NS .. name))
    test.not_nil(trait.data.build_func_id)
    local result, err = h.executor:call(trait.data.build_func_id, trait.data.prompt, context)
    assert(not err, steps.detail(err))
    return result :: Map
end
local function ids(out: Map): Map
    local found: Map = {}
    for _, tool in ipairs(out.tools or {}) do found[tool.id] = true end
    return found
end
local function define()
    test.describe("Work declared plugin tools", function()
        local original
        test.after_each(function()
            if original then
                local changes = assert(registry.snapshot()):changes()
                changes:update(original); assert(changes:apply()); original = nil
            end
        end)
        test.it("refuses unknown and wrong-type tool ids at declaration validation", function()
            local h = fixture.board()
            original = assert(registry.get(PLUGIN))
            for _, tool_id in ipairs({ "app:unknown_tool", "app:fold_attachment" }) do
                local updated = assert(registry.get(PLUGIN))
                updated.meta.tools = { tool_id }
                local changes = assert(registry.snapshot()):changes()
                changes:update(updated); assert(changes:apply())
                for _, method in ipairs({ "plan_schema", "apply_schema" }) do
                    local _, err = h.call(method, { declaration = { plugins = { { use = PLUGIN } } } })
                    test.not_nil(err)
                    test.eq(err:kind(), errors.INVALID)
                    test.eq(err:details().code, "plugin_tool_invalid")
                end
            end
            test.eq(assert(h.call("get_schema", {})).generation, 1)
        end)
        test.it("keeps valid contributions when an installed declaration is malformed", function()
            local h = fixture.board()
            original = assert(registry.get(PLUGIN))
            local updated = assert(registry.get(PLUGIN))
            updated.meta.tools = { "app:absent_tool" }
            local changes = assert(registry.snapshot()):changes()
            changes:update(updated); assert(changes:apply())
            local contribution = build(h, "work", {})
            test.not_nil(contribution.tools)
            test.not_nil(contribution.problems)
            test.eq(contribution.problems[PLUGIN].code, "plugin_tool_invalid")
        end)
        test.it("contributes active plugins as the caller and filters read-only scopes", function()
            local h, inactive, outsider = fixture.board(), fixture.board(), fixture.board()
            assert(h.call("apply_schema", { declaration = { plugins = { { use = PLUGIN } } } }))
            local schema = assert(h.call("get_schema", {}))
            test.eq(values.canonical(schema.plugins[1].tools), values.canonical({ READ, WRITE }))
            test.eq(values.canonical(assert(h.call("get_schema", { generation = schema.generation })).plugins[1].tools), values.canonical({ READ, WRITE }))
            test.eq(values.canonical(ids(build(h, "work", { board_id = h.id }))), values.canonical({ [READ] = true, [WRITE] = true }))
            test.eq(values.canonical(ids(build(h, "work_readonly", { board_id = h.id }))), values.canonical({ [READ] = true }))
            test.eq(next(ids(build(h, "work", { board_id = inactive.id }))), nil)
            test.eq(next(ids(build(outsider, "work", { board_id = h.id }))), nil)
            local installed = ids(build(h, "work", {}))
            test.is_true(installed[READ]); test.is_true(installed[WRITE])
            local reads = ids(build(h, "work_readonly", {}))
            test.is_true(reads[READ]); test.is_nil(reads[WRITE])
            test.is_nil(assert(registry.get(NS .. "work_admin")).data.build_func_id)
        end)
    end)
end
return { run = test.run_cases(define) }
