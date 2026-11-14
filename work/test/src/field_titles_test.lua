-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local store = require("store")
local json = require("json")

local function define()
    test.describe("field titles", function()
        test.it("retains optional titles in declarations and compiled schema generations", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            for _, field in ipairs(d.fields) do field.title = "Display " .. field.code end
            local h = fixture.board({ declaration = d })
            local schema = assert(h.call("get_schema", {}))
            for _, field in ipairs(schema.declaration.fields) do test.eq(field.title, "Display " .. field.code) end
            for _, field in ipairs(schema.compiled.fields) do test.eq(field.title, "Display " .. field.code) end
            assert(h.call("apply_schema", { declaration = { fields = { { code = "optional", form = "text" } } } }))
            local current = assert(h.call("get_schema", {}))
            test.is_nil(current.compiled.fields[#current.compiled.fields].title)
        end)

        test.it("applies only field titles as cosmetic metadata with no item or storage work", function()
            local h = fixture.board()
            local item = steps.create(h, "task", { title = "Keep value" })
            local before = assert(h.call("get", { item = { id = item } })).item
            local old = assert(h.call("get_schema", {}))
            local field = old.declaration.fields[1]
            field.title = "Display title"
            local request = { declaration = { fields = { field } } }
            local plan = assert(h.call("plan_schema", request))
            test.eq(plan.class, "cosmetic")
            test.eq(#plan.changes, 1)
            test.eq(plan.changes[1].what, "title")
            test.eq(plan.changes[1].class, "cosmetic")
            test.is_nil(plan.migration)
            local applied = assert(h.call("apply_schema", request))
            test.eq(applied.class, "cosmetic")
            test.eq(applied.generation, old.generation + 1)
            local current = assert(h.call("get_schema", {}))
            test.is_nil(current.migration_error)
            test.eq(current.compiled.fields[1].title, "Display title")
            test.is_nil(assert(h.call("get_schema", { generation = old.generation })).compiled.fields[1].title)
            local after = assert(h.call("get", { item = { id = item } })).item
            test.eq(assert(json.encode(after)), assert(json.encode(before)))
            local db = assert(store.open())
            local jobs = assert(db:query("SELECT job_type FROM kickside_work_job WHERE board_id = $1", { h.id }))
            db:release()
            test.eq(#jobs, 0)
            test.eq(assert(h.call("plan_schema", request)).class, "unchanged")
        end)

        test.it("keeps titles on rollup predicate fields cosmetic without recomputing items", function()
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[#d.fields + 1] = { code = "selected", type = "rollup", form = "int", of = "children", fn = "sum",
                field = "estimate", where = { field = "estimate", op = "gt", value = 0 } }
            d.item_types[1].fields[#d.item_types[1].fields + 1] = "selected"
            local h = fixture.board({ declaration = d })
            local parent = steps.create(h, "epic")
            local child = steps.create(h, "story", { estimate = 2 }, parent)
            local before = assert(steps.get(h, parent)).item
            local child_before = assert(steps.get(h, child)).item
            test.eq(before.values.selected, 2)
            local schema = assert(h.call("get_schema", {}))
            local field = schema.declaration.fields[2]
            test.eq(field.code, "estimate")
            field.title = "Effort"
            local request = { declaration = { fields = { field } } }
            local plan = assert(h.call("plan_schema", request))
            test.eq(plan.class, "cosmetic")
            test.eq(#plan.changes, 1)
            test.eq(plan.changes[1].what, "title")
            test.eq(assert(h.call("apply_schema", request)).class, "cosmetic")
            test.eq(assert(json.encode(assert(steps.get(h, parent)).item)), assert(json.encode(before)))
            test.eq(assert(json.encode(assert(steps.get(h, child)).item)), assert(json.encode(child_before)))
            local db = assert(store.open())
            local jobs = assert(db:query("SELECT job_type FROM kickside_work_job WHERE board_id = $1", { h.id }))
            db:release()
            test.eq(#jobs, 0)
        end)

        test.it("refuses blank and oversized field titles with condition codes", function()
            local h = fixture.board()
            for _, entry in ipairs({ { title = " \t\n", code = "field_title_blank" }, { title = string.rep("x", 256), code = "field_title_too_long" } }) do
                for _, method in ipairs({ "plan_schema", "apply_schema" }) do
                    local _, err = h.call(method, { declaration = { fields = { { code = "named", title = entry.title, form = "text" } } } })
                    test.not_nil(err)
                    test.eq(err:kind(), errors.INVALID)
                    test.eq(err:details().code, entry.code)
                end
            end
        end)
    end)
end

return { run = test.run_cases(define) }
