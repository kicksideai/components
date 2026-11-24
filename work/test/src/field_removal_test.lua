-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local fixture = require("fixture")
local provider = require("provider")
local steps = require("steps")

local PLUGIN = "app:schema_provider"
local ORIGINAL = "time_original_minutes"
local REMAINING = "time_remaining_minutes"

local function fragment(item_types: { string }): { [string]: unknown }
    local extensions = {}
    for _, id in ipairs(item_types) do
        extensions[#extensions + 1] = { id = id, fields = { ORIGINAL, REMAINING } }
    end
    return {
        fields = {
            { code = ORIGINAL, form = "int", index = "number", track = true },
            { code = REMAINING, form = "int", index = "number", track = true },
        },
        item_types = extensions,
    }
end

local function configure(enabled: boolean): { [string]: unknown }
    return { declaration = {}, plugin_configs = { [PLUGIN] = { extra = enabled } } }
end

local function migration_choices(plan: { [string]: unknown }, choice: string, item_type: string?): { [string]: string }
    local out = {}
    for _, change in ipairs(plan.refused) do
        test.eq(change.class, "refused")
        test.eq(change.what, "field.remove")
        test.eq(change.item_type, item_type)
        test.not_nil(change.path)
        out[change.path] = choice
    end
    return out
end

local function define()
    test.describe("schema review of field removals", function()
        test.it("keeps estimates until a type is reselected or the removal is explicitly resolved", function()
            local admin = scoped.admin()
            local decl = fixture.declaration(fixture.fresh_prefix())
            local task = decl.item_types[3]
            decl.item_types[#decl.item_types + 1] = { id = "ticket", process = task.process, fields = task.fields }
            local board = scoped.board(admin, decl)
            local base = "/" .. board.id
            provider.seed(board.id, fragment({ "task", "ticket" }))
            local enabled = { declaration = { plugins = { { use = PLUGIN } } }, plugin_configs = { [PLUGIN] = { extra = true } } }
            local installed = admin.http("POST", base .. "/apply_schema", enabled)
            test.eq(installed.status, 200)
            local generation = installed.body.data.generation :: integer
            local item = steps.create(board, "task", { [ORIGINAL] = 90, [REMAINING] = 30 })
            local retained = steps.create(board, "ticket", { [ORIGINAL] = 50, [REMAINING] = 10 })
            test.eq(assert(steps.get(board, item)).item.values[ORIGINAL], 90)
            test.eq(assert(steps.get(board, item)).item.values[REMAINING], 30)

            provider.seed(board.id, fragment({ "ticket" }))
            local request = configure(false)
            local plan = admin.http("POST", base .. "/plan_schema", request)
            test.eq(plan.status, 200)
            test.eq(plan.body.data.class, "refused")
            test.eq(#plan.body.data.refused, 2)
            local codes = {}
            for _, change in ipairs(plan.body.data.refused) do codes[change.code] = true end
            test.is_true(codes[ORIGINAL])
            test.is_true(codes[REMAINING])
            local rejected = admin.http("POST", base .. "/apply_schema", request)
            test.eq(rejected.status, 400)
            test.eq(rejected.body.details.code, "migration_required")
            test.eq(assert(steps.get(board, item)).item.values[ORIGINAL], 90)
            test.eq(assert(steps.get(board, item)).item.values[REMAINING], 30)

            request.expected_generation = generation
            request.resolutions = migration_choices(plan.body.data, "keep", "task")
            local kept = admin.http("POST", base .. "/apply_schema", request)
            test.eq(kept.status, 200)
            test.eq(kept.body.data.generation, generation)
            test.eq(assert(steps.get(board, item)).item.values[ORIGINAL], 90)

            provider.seed(board.id, fragment({ "task", "ticket" }))
            local reselected = admin.http("POST", base .. "/apply_schema", configure(true))
            test.eq(reselected.status, 200)
            test.eq(reselected.body.data.generation, generation)
            test.eq(assert(steps.get(board, item)).item.values[REMAINING], 30)

            provider.seed(board.id, fragment({ "ticket" }))
            local only_one = plan.body.data.refused[1].path
            request.resolutions = { [only_one] = "drop" }
            test.eq(admin.http("POST", base .. "/apply_schema", request).status, 400)
            test.eq(assert(steps.get(board, item)).item.values[ORIGINAL], 90)
            test.eq(assert(steps.get(board, item)).item.values[REMAINING], 30)

            request.resolutions = migration_choices(plan.body.data, "drop", "task")
            request.key = "drop-estimates"
            local dropped = admin.http("POST", base .. "/apply_schema", request)
            test.eq(dropped.status, 200)
            test.eq(dropped.body.data.generation, generation + 1)
            test.is_nil(assert(steps.get(board, item)).item.values[ORIGINAL])
            test.eq(assert(steps.get(board, retained)).item.values[ORIGINAL], 50)
            local replay = admin.http("POST", base .. "/apply_schema", request)
            test.eq(replay.status, 200)
            test.is_true(replay.body.data.replayed)

            provider.seed(board.id, fragment({ "task", "ticket" }))
            test.eq(admin.http("POST", base .. "/apply_schema", configure(true)).status, 200)
            local after = assert(steps.get(board, item))
            test.is_nil(after.item.values[ORIGINAL])
            test.is_nil(after.item.values[REMAINING])

            -- Only the other type has values now. Its usage must not block this removal.
            provider.seed(board.id, fragment({ "ticket" }))
            local empty = admin.http("POST", base .. "/plan_schema", configure(false))
            test.eq(empty.status, 200)
            test.eq(#empty.body.data.refused, 0)
            test.eq(admin.http("POST", base .. "/apply_schema", configure(false)).status, 200)
            test.eq(assert(steps.get(board, retained)).item.values[REMAINING], 10)
        end)

        test.it("reviews authored field removal and archives values for a later reattachment", function()
            local admin = scoped.admin()
            local decl = fixture.declaration(fixture.fresh_prefix())
            decl.fields[#decl.fields + 1] = { code = "flag", form = "bool" }
            local task = decl.item_types[3]
            task.fields[#task.fields + 1] = "flag"
            local board = scoped.board(admin, decl)
            local item = steps.create(board, "task", { flag = false })
            local base = "/" .. board.id
            local field_list = {}
            for _, code in ipairs(task.fields) do if code ~= "flag" then field_list[#field_list + 1] = code end end
            local change = { item_types = { { id = task.id, process = task.process, fields = field_list, parent_types = task.parent_types, inherit = task.inherit } } }
            local plan = admin.http("POST", base .. "/plan_schema", { declaration = change })
            test.eq(plan.status, 200)
            test.eq(plan.body.data.class, "refused")
            test.eq(#plan.body.data.refused, 1)
            local archived = admin.http("POST", base .. "/apply_schema", { declaration = change, expected_generation = 1,
                resolutions = migration_choices(plan.body.data, "archive", "task") })
            test.eq(archived.status, 200)
            test.is_nil(assert(steps.get(board, item)).item.values.flag)
            test.eq(admin.http("POST", base .. "/apply_schema", { declaration = { item_types = { task } } }).status, 200)
            test.eq(assert(steps.get(board, item)).item.values.flag, false)

            -- Removing the definition itself follows the same review.
            change.remove = { fields = { "flag" } }
            plan = admin.http("POST", base .. "/plan_schema", { declaration = change })
            test.eq(plan.status, 200)
            test.eq(plan.body.data.class, "refused")
            test.eq(#plan.body.data.refused, 1)
            test.eq(plan.body.data.refused[1].code, "flag")
            test.is_nil(plan.body.data.refused[1].item_type)
            test.eq(admin.http("POST", base .. "/apply_schema", { declaration = change }).status, 400)
            test.eq(assert(steps.get(board, item)).item.values.flag, false)
        end)
    end)
end

return { run = test.run_cases(define) }
