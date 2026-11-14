-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Declaration merge and field change classes: named entries replace, omitted stay,
-- only remove destroys, fields rename by id, and each field change has a class judged
-- against whether stored values use the field.
local test = require("test")
local declaration = require("declaration")
local changes = require("changes")
local types = require("types")

type Entry = { name: string, v: integer? }
local function key(e: Entry): string? return e.name end

local function field(id: integer, code: string, over: { [string]: unknown }?): types.Field
    local f: { [string]: unknown } = { id = id, code = code, type = "text", form = "text", cardinality = "one", unique = false,
        config = {}, index = "none", track = false, intervals = false }
    for k, v in pairs(over or {}) do f[k] = v end
    return f :: types.Field
end

local function classes(prev: { [string]: types.Field }, next: { [string]: types.Field }, usage: { [integer]: integer }): { [string]: string }
    local out: { [string]: string } = {}
    for _, c in ipairs(changes.field_changes(prev, next, usage)) do out[c.what] = c.class end
    return out
end

local function define()
    test.describe("merge helpers", function()
        test.it("keeps order, replaces named entries and appends new ones", function()
            local out = assert(declaration.merge_list({ { name = "a", v = 1 }, { name = "b", v = 2 } } :: { Entry }, { { name = "b", v = 3 }, { name = "c" } } :: { Entry }, key))
            test.eq(#out, 3)
            test.eq(out[2].v, 3)
            test.eq(out[3].name, "c")
            test.eq(#assert(declaration.merge_list(nil, nil, key)), 0)
        end)

        test.it("removes named entries and refuses a name that matches nothing", function()
            local out = assert(declaration.remove_from("things", { { name = "a" }, { name = "b" } } :: { Entry }, { "a" }, key))
            test.eq(#out, 1)
            local _, err = declaration.remove_from("things", out, { "a" }, key)
            test.eq((err :: error):kind(), errors.NOT_FOUND)
        end)

        test.it("merges fields by code, renames by id and refuses taken codes and unknown ids", function()
            local base: { types.FieldDecl } = { { id = 1, code = "a" }, { id = 2, code = "b" } }
            local out = assert(declaration.merge_fields(base, { { code = "b", type = "x" }, { code = "c" } }))
            test.eq(out[2].type, "x")
            test.eq(out[3].code, "c")
            local chain = assert(declaration.merge_fields(base, { { id = 2, code = "z" }, { id = 1, code = "b" } }))
            test.eq(chain[1].code, "b")
            test.eq(chain[2].code, "z")
            test.not_nil(select(2, declaration.merge_fields(base, { { id = 1, code = "b" } })))
            test.not_nil(select(2, declaration.merge_fields(base, { { id = 9, code = "q" } })))
        end)
    end)

    test.describe("field changes", function()
        test.it("keeps field forms immutable and judges removal by held values", function()
            local prev = { a = field(1, "a"), gone = field(2, "gone") }
            local next = { a = field(1, "a", { form = "int" }), fresh = field(3, "fresh") }
            local unused = classes(prev, next, {})
            test.eq(unused.form, "refused")
            test.eq(unused.removed, "additive")
            test.eq(unused.added, "additive")
            local used = classes(prev, next, { [1] = 2, [2] = 1 })
            test.eq(used.form, "refused")
            test.eq(used.removed, "semantic")
        end)

        test.it("classes renames, indexes and config", function()
            local prev = { a = field(1, "a", { config = { scale = 2 } }) }
            local renamed = classes(prev, { b = field(1, "b", { config = { scale = 2 } }) }, { [1] = 1 })
            test.eq(renamed["renamed from a"], "cosmetic")
            local changed = classes(prev, { a = field(1, "a", { config = { scale = 3 }, index = "key" }) }, { [1] = 1 })
            test.eq(changed["config.scale"], "refused")
            test.eq(changed.index, "semantic")
            test.eq(classes(prev, { a = field(1, "a", { config = { scale = 2 }, track = true }) }, {}).index, "semantic")
            test.eq(next(classes(prev, prev, { [1] = 1 })), nil)
        end)

        test.it("ranks the highest class of a change list", function()
            test.eq(changes.highest({}), "cosmetic")
            test.eq(changes.highest({ { code = "a", class = "additive", what = "x" }, { code = "b", class = "cosmetic", what = "y" } }), "additive")
            test.eq(changes.highest({ { code = "a", class = "semantic", what = "x" }, { code = "b", class = "refused", what = "y" } }), "refused")
        end)
    end)
end

return { run = test.run_cases(define) }
